from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import httpx
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, 
    CheckoutSessionResponse, 
    CheckoutStatusResponse, 
    CheckoutSessionRequest
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production-7777')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer(auto_error=False)

# Create the main app
app = FastAPI()

# Create router with /api prefix
api_router = APIRouter(prefix="/api")


# ===================== MODELS =====================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Auth Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AddressCreate(BaseModel):
    title: str  # Home, Work, etc.
    full_name: str
    phone: str
    street: str
    city: str
    region: str
    postal_code: Optional[str] = None
    is_default: bool = False

class AddressResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    full_name: str
    phone: str
    street: str
    city: str
    region: str
    postal_code: Optional[str] = None
    is_default: bool

# Cart & Checkout Models
class CartItem(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
    size: str
    image: Optional[str] = None

class ShippingAddress(BaseModel):
    email: str
    first_name: str
    last_name: str
    address: str
    apartment: Optional[str] = None
    city: str
    region: str
    postal_code: Optional[str] = None
    phone: str
    country: str = "Saudi Arabia"

class CheckoutRequest(BaseModel):
    origin_url: str
    items: List[CartItem]
    shipping_address: Optional[ShippingAddress] = None
    discount_code: Optional[str] = None

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    amount: float
    currency: str
    items: List[Dict]
    status: str = "pending"
    payment_status: str = "initiated"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Wishlist Model
class WishlistItem(BaseModel):
    product_id: int
    name: str
    price: float
    image: str

# Search Model
class SearchQuery(BaseModel):
    query: str
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None

# Product Model (for search results)
class Product(BaseModel):
    id: int
    name: str
    nameEn: str
    category: str
    price: float
    image: str
    isNew: bool = False


# ===================== HYPERPAY MODELS =====================

class HyperPayInitiateRequest(BaseModel):
    amount: float
    currency: str = "SAR"
    payment_type: str = "DB"  # DB=debit, PA=pre-auth
    brand: Optional[str] = None  # VISA, MASTER, MADA, AMEX
    order_id: Optional[str] = None
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None

class HyperPayTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    checkout_id: str
    order_id: Optional[str] = None
    user_id: Optional[str] = None
    amount: float
    currency: str
    payment_type: str
    brand: Optional[str] = None
    result_code: Optional[str] = None
    result_description: Optional[str] = None
    status: str = "initiated"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ===================== DHL MODELS =====================

class DHLAddress(BaseModel):
    street_lines: List[str]
    city: str
    country_code: str
    postal_code: Optional[str] = None
    state_or_province_code: Optional[str] = None

class DHLContact(BaseModel):
    person_name: str
    company_name: Optional[str] = None
    phone_number: str
    email_address: Optional[str] = None

class DHLPackage(BaseModel):
    weight: float  # kg
    length: float  # cm
    width: float   # cm
    height: float  # cm

class DHLRateRequest(BaseModel):
    shipper_account: Optional[str] = None
    origin_country_code: str = "SA"
    origin_city_name: str = "Riyadh"
    destination_country_code: str
    destination_city_name: str
    weight: float  # kg
    length: float = 20.0  # cm
    width: float = 15.0   # cm
    height: float = 10.0  # cm
    planned_shipping_date: Optional[str] = None  # YYYY-MM-DD

class DHLShipmentRequest(BaseModel):
    shipper_name: str
    shipper_company: Optional[str] = None
    shipper_phone: str
    shipper_email: Optional[str] = None
    shipper_address: DHLAddress
    recipient_name: str
    recipient_company: Optional[str] = None
    recipient_phone: str
    recipient_email: Optional[str] = None
    recipient_address: DHLAddress
    packages: List[DHLPackage]
    service_code: str = "P"  # P=Express Worldwide
    description: str = "Fashion goods"
    declared_value: float = 100.0
    currency: str = "SAR"


# ===================== ARAMEX MODELS =====================

class AramexAddress(BaseModel):
    line1: str
    line2: Optional[str] = None
    line3: Optional[str] = None
    city: str
    state_or_province_code: Optional[str] = None
    country_code: str
    postal_code: Optional[str] = None

class AramexContact(BaseModel):
    person_name: str
    company_name: Optional[str] = None
    phone_number1: str
    email_address: Optional[str] = None

class AramexDimensions(BaseModel):
    length: float  # cm
    width: float   # cm
    height: float  # cm
    unit: str = "CM"

class AramexRateRequest(BaseModel):
    origin_country_code: str = "SA"
    origin_city: str = "Riyadh"
    destination_country_code: str
    destination_city: str
    weight: float  # kg
    dimensions: Optional[AramexDimensions] = None
    product_type: str = "PPX"   # PPX=Priority Parcel Express
    product_group: str = "EXP"  # EXP=Express

class AramexShipmentRequest(BaseModel):
    shipper_contact: AramexContact
    shipper_address: AramexAddress
    consignee_contact: AramexContact
    consignee_address: AramexAddress
    weight: float  # kg
    dimensions: Optional[AramexDimensions] = None
    description: str = "Fashion goods"
    number_of_pieces: int = 1
    product_type: str = "PPX"
    product_group: str = "EXP"
    declared_value: float = 100.0
    currency: str = "SAR"
    cash_on_delivery: Optional[float] = None


# ===================== AUTH HELPERS =====================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    if not credentials:
        return None
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
        return user
    except JWTError:
        return None

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


# ===================== MOCK PRODUCTS DATA =====================

PRODUCTS = [
    {"id": 1, "name": "حقيبة جلدية فاخرة", "nameEn": "Luxury Leather Bag", "category": "bags", "price": 1299, "image": "https://images.unsplash.com/photo-1589363358751-ab05797e5629", "isNew": True},
    {"id": 2, "name": "حقيبة يد كلاسيكية", "nameEn": "Classic Handbag", "category": "bags", "price": 899, "image": "https://images.unsplash.com/photo-1587467512961-120760940315", "isNew": False},
    {"id": 3, "name": "حقيبة كتف عصرية", "nameEn": "Modern Shoulder Bag", "category": "bags", "price": 749, "image": "https://images.unsplash.com/photo-1591348278900-019a8a2a8b1d", "isNew": True},
    {"id": 4, "name": "قميص صيفي أنيق", "nameEn": "Elegant Summer Shirt", "category": "shirts", "price": 299, "image": "https://images.unsplash.com/photo-1715533173683-737d4a2433dd", "isNew": True},
    {"id": 5, "name": "جاكيت رسمي", "nameEn": "Formal Jacket", "category": "jackets", "price": 599, "image": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e", "isNew": False},
    {"id": 6, "name": "بنطلون كلاسيكي", "nameEn": "Classic Pants", "category": "pants", "price": 399, "image": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04", "isNew": True},
    {"id": 7, "name": "حقيبة ظهر عملية", "nameEn": "Practical Backpack", "category": "bags", "price": 549, "image": "https://images.unsplash.com/photo-1590739225287-bd31519780c3", "isNew": False},
    {"id": 8, "name": "قميص قطني فاخر", "nameEn": "Premium Cotton Shirt", "category": "shirts", "price": 349, "image": "https://images.unsplash.com/photo-1716951220992-2bbe913ddbf8", "isNew": True},
    {"id": 9, "name": "جاكيت كاجوال", "nameEn": "Casual Jacket", "category": "jackets", "price": 699, "image": "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd", "isNew": False},
    {"id": 10, "name": "بنطلون صيفي خفيف", "nameEn": "Light Summer Pants", "category": "pants", "price": 449, "image": "https://images.unsplash.com/photo-1716951988375-37d5793385d0", "isNew": True},
    {"id": 11, "name": "قميص بولو أنيق", "nameEn": "Elegant Polo Shirt", "category": "shirts", "price": 279, "image": "https://images.unsplash.com/photo-1716951918731-77d7682b4e63", "isNew": False},
    {"id": 12, "name": "جاكيت جلدي فاخر", "nameEn": "Luxury Leather Jacket", "category": "jackets", "price": 1499, "image": "https://images.unsplash.com/photo-1686491730848-0c86413833e5", "isNew": True},
]


# ===================== ROUTES =====================

# Basic Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ===================== AUTH ROUTES =====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        "id": user_id,
        "email": user_data.email.lower(),
        "password": get_password_hash(user_data.password),
        "name": user_data.name,
        "phone": user_data.phone,
        "created_at": now,
        "updated_at": now
    }
    
    await db.users.insert_one(user_doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            email=user_doc["email"],
            name=user_doc["name"],
            phone=user_doc["phone"],
            created_at=now
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["id"]})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            phone=user.get("phone"),
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(require_auth)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        phone=user.get("phone"),
        created_at=user["created_at"]
    )

@api_router.put("/auth/profile")
async def update_profile(
    name: Optional[str] = None,
    phone: Optional[str] = None,
    user: dict = Depends(require_auth)
):
    update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if name:
        update_data["name"] = name
    if phone:
        update_data["phone"] = phone
    
    await db.users.update_one({"id": user["id"]}, {"$set": update_data})
    return {"message": "Profile updated successfully"}


# ===================== SEARCH ROUTES =====================

@api_router.get("/products/search")
async def search_products(
    q: str = "",
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    results = []
    query_lower = q.lower()
    
    for product in PRODUCTS:
        # Text search (name in Arabic or English)
        if query_lower and query_lower not in product["name"].lower() and query_lower not in product["nameEn"].lower():
            continue
        
        # Category filter
        if category and product["category"] != category:
            continue
        
        # Price filters
        if min_price and product["price"] < min_price:
            continue
        if max_price and product["price"] > max_price:
            continue
        
        results.append(product)
    
    return {"products": results, "total": len(results)}

@api_router.get("/products/{product_id}")
async def get_product(product_id: int):
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

@api_router.get("/products")
async def get_all_products(category: Optional[str] = None):
    if category:
        return {"products": [p for p in PRODUCTS if p["category"] == category]}
    return {"products": PRODUCTS}

@api_router.get("/categories")
async def get_categories():
    return {
        "categories": [
            {"id": "bags", "name": "الحقائب", "nameEn": "Bags"},
            {"id": "jackets", "name": "الجاكيتات", "nameEn": "Jackets"},
            {"id": "shirts", "name": "القمصان", "nameEn": "Shirts"},
            {"id": "pants", "name": "البناطيل", "nameEn": "Pants"},
        ]
    }


# ===================== WISHLIST ROUTES =====================

@api_router.get("/wishlist")
async def get_wishlist(user: dict = Depends(require_auth)):
    wishlist = await db.wishlists.find_one({"user_id": user["id"]}, {"_id": 0})
    if not wishlist:
        return {"items": []}
    return {"items": wishlist.get("items", [])}

@api_router.post("/wishlist/add")
async def add_to_wishlist(item: WishlistItem, user: dict = Depends(require_auth)):
    wishlist = await db.wishlists.find_one({"user_id": user["id"]})
    
    if not wishlist:
        await db.wishlists.insert_one({
            "user_id": user["id"],
            "items": [item.model_dump()],
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
    else:
        # Check if item already exists
        existing = [i for i in wishlist.get("items", []) if i["product_id"] == item.product_id]
        if not existing:
            await db.wishlists.update_one(
                {"user_id": user["id"]},
                {
                    "$push": {"items": item.model_dump()},
                    "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
                }
            )
    
    return {"message": "Added to wishlist"}

@api_router.delete("/wishlist/{product_id}")
async def remove_from_wishlist(product_id: int, user: dict = Depends(require_auth)):
    await db.wishlists.update_one(
        {"user_id": user["id"]},
        {
            "$pull": {"items": {"product_id": product_id}},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    return {"message": "Removed from wishlist"}


# ===================== ADDRESS ROUTES =====================

@api_router.get("/addresses")
async def get_addresses(user: dict = Depends(require_auth)):
    addresses = await db.addresses.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    return {"addresses": addresses}

@api_router.post("/addresses", response_model=AddressResponse)
async def add_address(address: AddressCreate, user: dict = Depends(require_auth)):
    address_id = str(uuid.uuid4())
    
    # If this is the first address or marked as default, set others to non-default
    if address.is_default:
        await db.addresses.update_many(
            {"user_id": user["id"]},
            {"$set": {"is_default": False}}
        )
    
    address_doc = {
        "id": address_id,
        "user_id": user["id"],
        **address.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.addresses.insert_one(address_doc)
    
    return AddressResponse(id=address_id, **address.model_dump())

@api_router.delete("/addresses/{address_id}")
async def delete_address(address_id: str, user: dict = Depends(require_auth)):
    result = await db.addresses.delete_one({"id": address_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Address not found")
    return {"message": "Address deleted"}


# ===================== ORDER HISTORY ROUTES =====================

@api_router.get("/orders")
async def get_orders(user: dict = Depends(require_auth)):
    orders = await db.orders.find(
        {"user_id": user["id"]}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return {"orders": orders}

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, user: dict = Depends(require_auth)):
    order = await db.orders.find_one(
        {"id": order_id, "user_id": user["id"]},
        {"_id": 0}
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# ===================== CHECKOUT ROUTES =====================

@api_router.post("/checkout/create-session")
async def create_checkout_session(
    request: Request, 
    checkout_req: CheckoutRequest,
    user: Optional[dict] = Depends(get_current_user)
):
    try:
        stripe_api_key = os.environ.get('STRIPE_API_KEY')
        if not stripe_api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")
        
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        total_amount = sum(item.price * item.quantity for item in checkout_req.items)
        
        success_url = f"{checkout_req.origin_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{checkout_req.origin_url}/checkout/cancel"
        
        metadata = {
            "source": "7777_store",
            "items_count": str(len(checkout_req.items))
        }
        if user:
            metadata["user_id"] = user["id"]
        
        checkout_request = CheckoutSessionRequest(
            amount=float(total_amount),
            currency="sar",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create order and transaction records
        order_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        order_doc = {
            "id": order_id,
            "user_id": user["id"] if user else None,
            "session_id": session.session_id,
            "items": [item.model_dump() for item in checkout_req.items],
            "shipping_address": checkout_req.shipping_address.model_dump() if checkout_req.shipping_address else None,
            "discount_code": checkout_req.discount_code,
            "subtotal": total_amount,
            "tax": total_amount * 0.15,  # 15% VAT
            "shipping_cost": 0.0,  # Free shipping
            "total": total_amount * 1.15,  # Including tax
            "currency": "SAR",
            "status": "pending",
            "payment_status": "initiated",
            "created_at": now,
            "updated_at": now
        }
        
        await db.orders.insert_one(order_doc)
        
        transaction = PaymentTransaction(
            session_id=session.session_id,
            user_id=user["id"] if user else None,
            amount=total_amount,
            currency="sar",
            items=[item.model_dump() for item in checkout_req.items],
            status="pending",
            payment_status="initiated"
        )
        
        doc = transaction.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.payment_transactions.insert_one(doc)
        
        return {
            "url": session.url,
            "session_id": session.session_id,
            "order_id": order_id
        }
        
    except Exception as e:
        logging.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(request: Request, session_id: str):
    try:
        stripe_api_key = os.environ.get('STRIPE_API_KEY')
        if not stripe_api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")
        
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction and order status
        update_data = {
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        await db.orders.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        return {
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "amount_total": checkout_status.amount_total,
            "currency": checkout_status.currency,
            "metadata": checkout_status.metadata
        }
        
    except Exception as e:
        logging.error(f"Error getting checkout status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    try:
        stripe_api_key = os.environ.get('STRIPE_API_KEY')
        if not stripe_api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")
        
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.event_type == "checkout.session.completed":
            update_data = {
                "status": "completed",
                "payment_status": webhook_response.payment_status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": update_data}
            )
            
            await db.orders.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": update_data}
            )
        
        return {"status": "processed"}
        
    except Exception as e:
        logging.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ===================== HYPERPAY ROUTES =====================

# HyperPay base URL — swap for production URL when going live:
# Production: https://eu-prod.oppwa.com
HYPERPAY_BASE_URL = os.environ.get('HYPERPAY_BASE_URL', 'https://eu-test.oppwa.com')

@api_router.post("/payment/hyperpay/initiate")
async def hyperpay_initiate(
    req: HyperPayInitiateRequest,
    user: Optional[dict] = Depends(get_current_user)
):
    """
    Create a HyperPay checkout ID. The frontend renders the HyperPay
    payment widget using this checkout ID.
    Requires env vars: HYPERPAY_ENTITY_ID, HYPERPAY_ACCESS_TOKEN
    """
    entity_id = os.environ.get('HYPERPAY_ENTITY_ID')
    access_token = os.environ.get('HYPERPAY_ACCESS_TOKEN')
    if not entity_id or not access_token:
        raise HTTPException(status_code=500, detail="HyperPay credentials not configured")

    # Format amount to 2 decimal places as required by HyperPay
    amount_str = f"{req.amount:.2f}"

    payload = {
        "entityId": entity_id,
        "amount": amount_str,
        "currency": req.currency,
        "paymentType": req.payment_type,
    }
    if req.customer_email:
        payload["customer.email"] = req.customer_email
    if req.customer_name:
        parts = req.customer_name.split(" ", 1)
        payload["customer.givenName"] = parts[0]
        if len(parts) > 1:
            payload["customer.surname"] = parts[1]
    if req.order_id:
        payload["merchantTransactionId"] = req.order_id

    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{HYPERPAY_BASE_URL}/v1/checkouts",
                data=payload,
                headers=headers
            )
        result = response.json()
    except Exception as e:
        logging.error(f"HyperPay initiate error: {e}")
        raise HTTPException(status_code=502, detail=f"HyperPay request failed: {str(e)}")

    result_code = result.get("result", {}).get("code", "")
    # HyperPay success pattern for checkout creation: 000.200.100
    if not result_code.startswith("000.200"):
        raise HTTPException(
            status_code=400,
            detail=result.get("result", {}).get("description", "HyperPay checkout creation failed")
        )

    checkout_id = result.get("id")
    now = datetime.now(timezone.utc)

    txn = HyperPayTransaction(
        checkout_id=checkout_id,
        order_id=req.order_id,
        user_id=user["id"] if user else None,
        amount=req.amount,
        currency=req.currency,
        payment_type=req.payment_type,
        brand=req.brand,
        status="initiated"
    )
    doc = txn.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.hyperpay_transactions.insert_one(doc)

    return {
        "checkout_id": checkout_id,
        "widget_url": f"{HYPERPAY_BASE_URL}/v1/paymentWidgets.js?checkoutId={checkout_id}",
        "entity_id": entity_id
    }


@api_router.get("/payment/hyperpay/status/{checkout_id}")
async def hyperpay_status(checkout_id: str):
    """
    Retrieve the payment result for a completed HyperPay checkout.
    Call this after the user is redirected back from the payment widget.
    Requires env vars: HYPERPAY_ENTITY_ID, HYPERPAY_ACCESS_TOKEN
    """
    entity_id = os.environ.get('HYPERPAY_ENTITY_ID')
    access_token = os.environ.get('HYPERPAY_ACCESS_TOKEN')
    if not entity_id or not access_token:
        raise HTTPException(status_code=500, detail="HyperPay credentials not configured")

    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"entityId": entity_id}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{HYPERPAY_BASE_URL}/v1/checkouts/{checkout_id}/payment",
                params=params,
                headers=headers
            )
        result = response.json()
    except Exception as e:
        logging.error(f"HyperPay status error: {e}")
        raise HTTPException(status_code=502, detail=f"HyperPay request failed: {str(e)}")

    result_code = result.get("result", {}).get("code", "")
    # Successful transaction codes: 000.000.000, 000.000.100, 000.100.110, 000.100.111, 000.100.112
    is_success = (
        result_code.startswith("000.000") or
        result_code.startswith("000.100.1")
    )
    status = "completed" if is_success else "failed"

    update_data = {
        "result_code": result_code,
        "result_description": result.get("result", {}).get("description", ""),
        "status": status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.hyperpay_transactions.update_one(
        {"checkout_id": checkout_id},
        {"$set": update_data}
    )
    if status == "completed":
        await db.orders.update_one(
            {"session_id": checkout_id},
            {"$set": {"payment_status": "paid", "status": "confirmed",
                      "updated_at": datetime.now(timezone.utc).isoformat()}}
        )

    return {
        "checkout_id": checkout_id,
        "result_code": result_code,
        "result_description": result.get("result", {}).get("description", ""),
        "status": status,
        "payment_brand": result.get("paymentBrand"),
        "amount": result.get("amount"),
        "currency": result.get("currency"),
        "transaction_id": result.get("id")
    }


@api_router.post("/webhook/hyperpay")
async def hyperpay_webhook(request: Request):
    """
    Async notification endpoint for HyperPay.
    Configure this URL in the HyperPay merchant portal as the notification URL.
    """
    try:
        body = await request.body()
        params = dict(request.query_params)
        logging.info(f"HyperPay webhook received: {params}")

        checkout_id = params.get("checkoutId", "")
        result_code = params.get("result.code", "")

        is_success = (
            result_code.startswith("000.000") or
            result_code.startswith("000.100.1")
        )
        status = "completed" if is_success else "failed"

        if checkout_id:
            update_data = {
                "result_code": result_code,
                "result_description": params.get("result.description", ""),
                "status": status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.hyperpay_transactions.update_one(
                {"checkout_id": checkout_id},
                {"$set": update_data}
            )

        return {"status": "received"}
    except Exception as e:
        logging.error(f"HyperPay webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


# ===================== DHL ROUTES =====================

DHL_API_BASE_URL = "https://express.api.dhl.com/mydhlapi"

def _dhl_headers() -> dict:
    api_key = os.environ.get('DHL_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="DHL API key not configured")
    return {"DHL-API-Key": api_key, "Content-Type": "application/json"}


@api_router.post("/shipping/dhl/rates")
async def dhl_get_rates(req: DHLRateRequest):
    """
    Get DHL Express rates and transit times between two locations.
    Requires env var: DHL_API_KEY
    """
    headers = _dhl_headers()
    planned_date = req.planned_shipping_date or datetime.now(timezone.utc).strftime("%Y-%m-%d")

    params = {
        "accountNumber": req.shipper_account or os.environ.get('DHL_ACCOUNT_NUMBER', ''),
        "originCountryCode": req.origin_country_code,
        "originCityName": req.origin_city_name,
        "destinationCountryCode": req.destination_country_code,
        "destinationCityName": req.destination_city_name,
        "weight": req.weight,
        "length": req.length,
        "width": req.width,
        "height": req.height,
        "plannedShippingDate": planned_date,
        "isCustomsDeclarable": False,
        "unitOfMeasurement": "metric"
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{DHL_API_BASE_URL}/rates",
                params=params,
                headers=headers
            )
        if response.status_code not in (200, 207):
            raise HTTPException(status_code=response.status_code,
                                detail=response.text)
        return response.json()
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"DHL rates error: {e}")
        raise HTTPException(status_code=502, detail=f"DHL API request failed: {str(e)}")


@api_router.post("/shipping/dhl/create-shipment")
async def dhl_create_shipment(req: DHLShipmentRequest):
    """
    Create a DHL Express shipment and get a waybill/label.
    Requires env vars: DHL_API_KEY, DHL_ACCOUNT_NUMBER
    """
    headers = _dhl_headers()
    account_number = os.environ.get('DHL_ACCOUNT_NUMBER', '')
    planned_date = datetime.now(timezone(timedelta(hours=3))).strftime("%Y-%m-%dT%H:%M:%S") + " GMT+03:00"

    packages_payload = []
    for i, pkg in enumerate(req.packages, start=1):
        packages_payload.append({
            "weight": pkg.weight,
            "dimensions": {
                "length": pkg.length,
                "width": pkg.width,
                "height": pkg.height
            }
        })

    payload = {
        "plannedShippingDateAndTime": planned_date,
        "pickup": {"isRequested": False},
        "productCode": req.service_code,
        "accounts": [{"typeCode": "shipper", "number": account_number}],
        "customerDetails": {
            "shipperDetails": {
                "postalAddress": {
                    "streetLines": req.shipper_address.street_lines,
                    "city": req.shipper_address.city,
                    "countryCode": req.shipper_address.country_code,
                    "postalCode": req.shipper_address.postal_code or "",
                },
                "contactInformation": {
                    "fullName": req.shipper_name,
                    "companyName": req.shipper_company or req.shipper_name,
                    "phone": req.shipper_phone,
                    "email": req.shipper_email or ""
                }
            },
            "receiverDetails": {
                "postalAddress": {
                    "streetLines": req.recipient_address.street_lines,
                    "city": req.recipient_address.city,
                    "countryCode": req.recipient_address.country_code,
                    "postalCode": req.recipient_address.postal_code or "",
                },
                "contactInformation": {
                    "fullName": req.recipient_name,
                    "companyName": req.recipient_company or req.recipient_name,
                    "phone": req.recipient_phone,
                    "email": req.recipient_email or ""
                }
            }
        },
        "content": {
            "packages": packages_payload,
            "isCustomsDeclarable": False,
            "description": req.description,
            "incoterm": "DAP",
            "unitOfMeasurement": "metric"
        },
        "outputImageProperties": {
            "printerDPI": 300,
            "encodingFormat": "pdf",
            "imageOptions": [{"typeCode": "label", "templateName": "ECOM26_84_001"}]
        }
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{DHL_API_BASE_URL}/shipments",
                json=payload,
                headers=headers
            )
        if response.status_code not in (200, 201):
            raise HTTPException(status_code=response.status_code,
                                detail=response.text)
        result = response.json()
        tracking_number = result.get("shipmentTrackingNumber", "")
        await db.shipments.insert_one({
            "id": str(uuid.uuid4()),
            "carrier": "DHL",
            "tracking_number": tracking_number,
            "shipper": req.shipper_name,
            "recipient": req.recipient_name,
            "status": "created",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        return result
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"DHL create shipment error: {e}")
        raise HTTPException(status_code=502, detail=f"DHL API request failed: {str(e)}")


@api_router.get("/shipping/dhl/track/{tracking_number}")
async def dhl_track_shipment(tracking_number: str):
    """
    Track a DHL Express shipment by waybill number.
    Requires env var: DHL_API_KEY
    """
    headers = _dhl_headers()
    params = {"shipmentTrackingNumber": tracking_number}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{DHL_API_BASE_URL}/tracking",
                params=params,
                headers=headers
            )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code,
                                detail=response.text)
        return response.json()
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"DHL tracking error: {e}")
        raise HTTPException(status_code=502, detail=f"DHL API request failed: {str(e)}")


# ===================== ARAMEX ROUTES =====================

ARAMEX_API_BASE_URL = "https://ws.aramex.net/ShippingAPI.V2"

def _aramex_client_info() -> dict:
    username = os.environ.get('ARAMEX_USERNAME')
    password = os.environ.get('ARAMEX_PASSWORD')
    account_number = os.environ.get('ARAMEX_ACCOUNT_NUMBER')
    account_pin = os.environ.get('ARAMEX_ACCOUNT_PIN')
    account_entity = os.environ.get('ARAMEX_ACCOUNT_ENTITY', 'RUH')
    account_country_code = os.environ.get('ARAMEX_ACCOUNT_COUNTRY_CODE', 'SA')
    if not all([username, password, account_number, account_pin]):
        raise HTTPException(status_code=500, detail="Aramex credentials not configured")
    return {
        "UserName": username,
        "Password": password,
        "Version": "v1.0",
        "AccountNumber": account_number,
        "AccountPin": account_pin,
        "AccountEntity": account_entity,
        "AccountCountryCode": account_country_code,
        "Source": 24
    }


@api_router.post("/shipping/aramex/rates")
async def aramex_get_rates(req: AramexRateRequest):
    """
    Calculate Aramex shipping rate between two locations.
    Requires env vars: ARAMEX_USERNAME, ARAMEX_PASSWORD,
                       ARAMEX_ACCOUNT_NUMBER, ARAMEX_ACCOUNT_PIN
    """
    client_info = _aramex_client_info()

    dims_payload = None
    if req.dimensions:
        dims_payload = {
            "Length": req.dimensions.length,
            "Width": req.dimensions.width,
            "Height": req.dimensions.height,
            "Unit": req.dimensions.unit
        }

    payload = {
        "ClientInfo": client_info,
        "OriginAddress": {
            "Line1": req.origin_city,
            "City": req.origin_city,
            "CountryCode": req.origin_country_code
        },
        "DestinationAddress": {
            "Line1": req.destination_city,
            "City": req.destination_city,
            "CountryCode": req.destination_country_code
        },
        "ShipmentDetails": {
            "Dimensions": dims_payload,
            "ActualWeight": {"Value": req.weight, "Unit": "KG"},
            "ProductType": req.product_type,
            "ProductGroup": req.product_group,
            "PaymentType": "P",
            "NumberOfPieces": 1
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{ARAMEX_API_BASE_URL}/shipping/service.svc/json/CalculateRate",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code,
                                detail=response.text)
        result = response.json()
        if result.get("HasErrors"):
            notifications = result.get("Notifications", [])
            msgs = [n.get("Message", "") for n in notifications]
            raise HTTPException(status_code=400, detail="; ".join(msgs))
        return result
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Aramex rates error: {e}")
        raise HTTPException(status_code=502, detail=f"Aramex API request failed: {str(e)}")


@api_router.post("/shipping/aramex/create-shipment")
async def aramex_create_shipment(req: AramexShipmentRequest):
    """
    Create an Aramex shipment and get a waybill number and label.
    Requires env vars: ARAMEX_USERNAME, ARAMEX_PASSWORD,
                       ARAMEX_ACCOUNT_NUMBER, ARAMEX_ACCOUNT_PIN
    """
    client_info = _aramex_client_info()

    dims_payload = None
    if req.dimensions:
        dims_payload = {
            "Length": req.dimensions.length,
            "Width": req.dimensions.width,
            "Height": req.dimensions.height,
            "Unit": req.dimensions.unit
        }

    cod_payload = None
    if req.cash_on_delivery is not None:
        cod_payload = {"Amount": req.cash_on_delivery, "CurrencyCode": req.currency}

    payload = {
        "ClientInfo": client_info,
        "LabelInfo": {"ReportID": 9729, "ReportType": "RPT"},
        "Shipments": [
            {
                "Shipper": {
                    "Reference1": str(uuid.uuid4()),
                    "AccountNumber": client_info["AccountNumber"],
                    "PartyAddress": {
                        "Line1": req.shipper_address.line1,
                        "Line2": req.shipper_address.line2 or "",
                        "City": req.shipper_address.city,
                        "StateOrProvinceCode": req.shipper_address.state_or_province_code or "",
                        "PostCode": req.shipper_address.postal_code or "",
                        "CountryCode": req.shipper_address.country_code
                    },
                    "Contact": {
                        "Department": "",
                        "PersonName": req.shipper_contact.person_name,
                        "Title": "",
                        "CompanyName": req.shipper_contact.company_name or req.shipper_contact.person_name,
                        "PhoneNumber1": req.shipper_contact.phone_number1,
                        "PhoneNumber1Ext": "",
                        "EmailAddress": req.shipper_contact.email_address or ""
                    }
                },
                "Consignee": {
                    "Reference1": str(uuid.uuid4()),
                    "PartyAddress": {
                        "Line1": req.consignee_address.line1,
                        "Line2": req.consignee_address.line2 or "",
                        "City": req.consignee_address.city,
                        "StateOrProvinceCode": req.consignee_address.state_or_province_code or "",
                        "PostCode": req.consignee_address.postal_code or "",
                        "CountryCode": req.consignee_address.country_code
                    },
                    "Contact": {
                        "Department": "",
                        "PersonName": req.consignee_contact.person_name,
                        "Title": "",
                        "CompanyName": req.consignee_contact.company_name or req.consignee_contact.person_name,
                        "PhoneNumber1": req.consignee_contact.phone_number1,
                        "PhoneNumber1Ext": "",
                        "EmailAddress": req.consignee_contact.email_address or ""
                    }
                },
                "Details": {
                    "Dimensions": dims_payload,
                    "ActualWeight": {"Value": req.weight, "Unit": "KG"},
                    "ChargeableWeight": None,
                    "DescriptionOfGoods": req.description,
                    "GoodsOriginCountry": req.shipper_address.country_code,
                    "NumberOfPieces": req.number_of_pieces,
                    "ProductType": req.product_type,
                    "ProductGroup": req.product_group,
                    "PaymentType": "P",
                    "PaymentOptions": "",
                    "Services": "CODS" if req.cash_on_delivery else "",
                    "CashOnDeliveryAmount": cod_payload,
                    "CollectAmount": None,
                    "CustomsValueAmount": {"Amount": req.declared_value, "CurrencyCode": req.currency},
                    "InsuranceAmount": None
                }
            }
        ]
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{ARAMEX_API_BASE_URL}/shipping/service.svc/json/CreateShipments",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code,
                                detail=response.text)
        result = response.json()
        if result.get("HasErrors"):
            notifications = result.get("Notifications", [])
            msgs = [n.get("Message", "") for n in notifications]
            raise HTTPException(status_code=400, detail="; ".join(msgs))

        shipments = result.get("Shipments", [])
        waybill = shipments[0].get("ID", "") if shipments else ""
        await db.shipments.insert_one({
            "id": str(uuid.uuid4()),
            "carrier": "Aramex",
            "tracking_number": waybill,
            "shipper": req.shipper_contact.person_name,
            "recipient": req.consignee_contact.person_name,
            "status": "created",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        return result
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Aramex create shipment error: {e}")
        raise HTTPException(status_code=502, detail=f"Aramex API request failed: {str(e)}")


@api_router.get("/shipping/aramex/track/{tracking_number}")
async def aramex_track_shipment(tracking_number: str):
    """
    Track an Aramex shipment by waybill number.
    Requires env vars: ARAMEX_USERNAME, ARAMEX_PASSWORD,
                       ARAMEX_ACCOUNT_NUMBER, ARAMEX_ACCOUNT_PIN
    """
    client_info = _aramex_client_info()

    payload = {
        "ClientInfo": client_info,
        "GetLastTrackingUpdateOnly": False,
        "Shipments": [tracking_number]
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{ARAMEX_API_BASE_URL}/tracking/service.svc/json/TrackShipments",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code,
                                detail=response.text)
        result = response.json()
        if result.get("HasErrors"):
            notifications = result.get("Notifications", [])
            msgs = [n.get("Message", "") for n in notifications]
            raise HTTPException(status_code=400, detail="; ".join(msgs))
        return result
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Aramex tracking error: {e}")
        raise HTTPException(status_code=502, detail=f"Aramex API request failed: {str(e)}")


# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
