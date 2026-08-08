export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-gray-900">
      <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.05em] mb-12 border-b border-gray-200 pb-8">Shipping Information</h1>
      
      <div className="prose prose-gray max-w-none font-light leading-relaxed">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-4 mt-8 text-gray-900">Processing Time</h2>
        <p className="mb-6">
          Since all our orders are made to order, please allow 7-14 business days for production and processing before your order is dispatched. We appreciate your patience as we craft each piece exclusively for you.
        </p>

        <h2 className="text-xl font-bold uppercase tracking-wider mb-4 mt-8 text-gray-900">Domestic Shipping</h2>
        <p className="mb-4">
          We offer reliable shipping across India. Once your order has been dispatched, delivery typically takes 3-5 business days, depending on your location.
        </p>

        <h2 className="text-xl font-bold uppercase tracking-wider mb-4 mt-8 text-gray-900">International Shipping</h2>
        <p className="mb-4">
          For international orders, shipping timelines and costs vary based on the destination. Please note that customs duties, taxes, and import fees are not included in our pricing and are the sole responsibility of the customer upon delivery.
        </p>

        <h2 className="text-xl font-bold uppercase tracking-wider mb-4 mt-8 text-gray-900">Order Tracking</h2>
        <p className="mb-4">
          Once your order has been dispatched, you will receive a tracking link via email to monitor your shipment's journey.
        </p>
      </div>
    </div>
  );
}
