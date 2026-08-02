import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-32">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.05em] mb-6">Contact Us</h1>
        <p className="text-gray-600 font-light leading-relaxed text-lg">
          For inquiries about our collections, bespoke services, or retail partnerships, please reach out directly via the information below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
        
        {/* Canada */}
        <div className="space-y-6">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 border-b border-gray-200 pb-4">
            Our Atelier (Canada)
          </h2>
          <div className="space-y-2 text-gray-600 font-light leading-relaxed">
            <p>36 Cattrick street</p>
            <p>Mississauga</p>
            <p>L4T1H5</p>
          </div>
          
          <div className="pt-4 space-y-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900">Call Us (Canada)</h3>
            <p className="text-gray-600 font-light">647-926-9903</p>
            <p className="text-gray-600 font-light">416-213-1425</p>
          </div>
        </div>

        {/* India - Manufacturing */}
        <div className="space-y-6">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 border-b border-gray-200 pb-4">
            India - Manufacturing
          </h2>
          <div className="space-y-2 text-gray-600 font-light leading-relaxed">
            <p>18 Nehru Housing Society</p>
            <p>Ambedkar Road</p>
            <p>Ghaziabad. 201001</p>
            <p>Uttar Pradesh</p>
          </div>
          <div className="pt-4 space-y-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900">Contact</h3>
            <p className="text-gray-600 font-light">0120-4292177</p>
            <p className="text-gray-600 font-light">0120-4381454</p>
          </div>
        </div>

        {/* India - Showroom */}
        <div className="space-y-6">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 border-b border-gray-200 pb-4">
            India - Showroom
          </h2>
          <div className="space-y-2 text-gray-600 font-light leading-relaxed">
            <p>Anup Gupta</p>
            <p>IInd A-1, Nehru Nagar</p>
            <p>Ghaziabad. 201001</p>
            <p>Uttar Pradesh</p>
          </div>
          <div className="pt-4 space-y-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900">Contact</h3>
            <p className="text-gray-600 font-light">0120-4387417</p>
            <p className="text-gray-600 font-light">0120-4440789</p>
          </div>
        </div>

      </div>

      {/* General Contact Info & Form */}
      <div className="mt-20 pt-12 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start">
        <div className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 border-b border-gray-200 pb-4 mb-4">Email Us</h2>
            <a href="mailto:info@anupguptastudio.com" className="text-gray-600 font-light hover:text-black transition-colors block">
              info@anupguptastudio.com
            </a>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 border-b border-gray-200 pb-4 mb-4">Hours of Operation</h2>
            <p className="text-gray-600 font-light">
              Mon-Fri: 9AM - 6PM IST
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <ContactForm />
        </div>
      </div>
      
    </div>
  );
}
