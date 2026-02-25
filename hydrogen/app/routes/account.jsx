export default function AccountPage() {
  return (
    <main className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-md text-center">
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-8">
            My Account
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to access your order history and manage your account details.
          </p>
          <div className="space-y-4">
            <a
              href="/account/login"
              className="block w-full py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/account/register"
              className="block w-full py-3 border-2 border-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              Create Account
            </a>
          </div>
        </div>
    </main>
  );
}

export function meta() {
  return [{title: "Account | 4Seven's"}];
}
