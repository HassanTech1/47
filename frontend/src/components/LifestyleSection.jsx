import React from 'react';

const LifestyleSection = () => {
  const coordinatedImage = "https://customer-assets.emergentagent.com/job_arabic-couture-hub/artifacts/75jjitty_Gemini_Generated_Image_fkyftgfkyftgfkyf.png";

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="order-1 lg:order-2">
            <div className="relative h-[600px] lg:h-[700px] bg-gray-50 overflow-hidden">
              <img
                src={coordinatedImage}
                alt="Coordinated Outfits - 7777"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 uppercase tracking-wider">
              أزياء متناسقة<br />للأزواج العصريين
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              اكتشف مجموعتنا الحصرية من الأزياء المتناسقة التي تجمع بين الأناقة والراحة. 
              صُممت خصيصاً للأزواج الذين يبحثون عن التميز والتناغم في إطلالاتهم.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-black rounded-full"></span>
                <span className="text-gray-700">تصاميم حصرية ومحدودة</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-black rounded-full"></span>
                <span className="text-gray-700">أقمشة فاخرة عالية الجودة</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-black rounded-full"></span>
                <span className="text-gray-700">قصات عصرية تناسب جميع المناسبات</span>
              </li>
            </ul>
            <button className="cta-button">
              اكتشف المجموعة
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
