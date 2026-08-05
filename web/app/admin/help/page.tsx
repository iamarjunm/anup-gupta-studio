import React from 'react';
import { HelpCircle, LayoutDashboard, ShoppingCart, Users, Database, FileText, Settings, AlertCircle, Phone } from 'lucide-react';

export default function HelpCenterPage() {
  const sections = [
    {
      title: 'Dashboard Overview',
      icon: LayoutDashboard,
      description: 'The dashboard gives you a high-level view of your store\'s performance.',
      items: [
        'Total Revenue: Calculated from all non-cancelled orders.',
        'Total Orders: The total number of orders placed.',
        'Active Orders: Orders that are not yet delivered or cancelled.',
        'Total Users: Number of registered customers.',
        'Export Centre: Download your data in CSV format or take a full JSON backup of your database.'
      ]
    },
    {
      title: 'Order Management',
      icon: ShoppingCart,
      description: 'Manage customer orders and update their statuses.',
      items: [
        'View order details, shipping address, and purchased items.',
        'Update order status (Processing, Shipped, Delivered, Cancelled).',
        'Customers will see the updated status in their profile dashboard.',
        'Export orders to CSV for your accounting or fulfillment team.'
      ]
    },
    {
      title: 'User Management',
      icon: Users,
      description: 'View and manage registered customers.',
      items: [
        'View customer details, sign-up dates, and authentication methods.',
        'Grant or revoke Admin privileges for any user.',
        'Only Admin users can access this admin portal.'
      ]
    },
    {
      title: 'Content Management (CMS)',
      icon: Database,
      description: 'Manage your products, categories, and marketing content.',
      items: [
        'Products: Add, edit, or delete products. Ensure you upload high-quality images.',
        'Categories & Collections: Organize your products for the storefront.',
        'Important: You cannot delete a category or collection if products are currently assigned to it. Remove the connections first.',
        'Marketing: Manage the Announcement Bar, Marquee texts, Hero Section, and Discount Codes.'
      ]
    },
    {
      title: 'Configuration',
      icon: Settings,
      description: 'Manage global store settings.',
      items: [
        'Site Settings: Update your store name, contact email, social links, and SEO metadata.',
        'Contact Form Submissions: View messages sent by customers through the contact page.',
        'Newsletter Subscribers: View and export emails of users who subscribed to your newsletter.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-gray-400" />
          Help Center
        </h1>
        <p className="text-sm text-gray-500 mt-1">Learn how to use the admin portal to manage your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 shrink-0">
                <section.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">{section.description}</p>
            <ul className="space-y-3 mt-auto">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-blue-900">Need Developer Support?</h3>
          <p className="text-sm text-blue-700 mt-1 leading-relaxed">
            If you encounter bugs, need new features, or require technical assistance, please contact your development team. Ensure you have your latest database backups saved safely.
          </p>
        </div>
      </div>
    </div>
  );
}
