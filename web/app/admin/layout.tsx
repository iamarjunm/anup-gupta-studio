'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Users, Settings, ExternalLink, ChevronDown, ChevronRight, FileText, HelpCircle } from 'lucide-react';
import { cmsSchemas } from '@/lib/schema-config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, sanityUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Products: true,
    Marketing: true,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  useEffect(() => {
    if (!loading) {
      if (!user || !sanityUser || !sanityUser.isAdmin) {
        router.push('/');
      }
    }
  }, [user, sanityUser, loading, router]);

  if (loading || !user || !sanityUser?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Help Center', href: '/admin/help', icon: HelpCircle },
  ];

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0">
        <div className="p-6">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-900">Admin Portal</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          
          <div>
            <h3 className="px-3 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Store Management</h3>
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-black text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {[
            { title: 'Products', keys: ['product', 'category', 'subcategory', 'collection'] },
            { title: 'Marketing', keys: ['heroSection', 'marquee', 'announcementBar', 'discountCode', 'celebrity'] },
          ].map(group => (
            <div key={group.title}>
              <button 
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-3 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 hover:text-gray-900 transition-colors"
              >
                {group.title}
                {openGroups[group.title] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {openGroups[group.title] && (
                <div className="space-y-1">
                  {group.keys.map(key => {
                    const schema = cmsSchemas.find(s => s.name === key);
                    if (!schema) return null;
                    const href = `/admin/content/${schema.name}`;
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={schema.name}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          isActive 
                            ? 'bg-black text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        {schema.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <div>
            <h3 className="px-3 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Configuration</h3>
            <div className="space-y-1">
              {['contactForm', 'newsletterSubscriber', 'siteSettings'].map(key => {
                const schema = cmsSchemas.find(s => s.name === key);
                if (!schema) return null;
                const href = `/admin/content/${schema.name}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={schema.name}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-black text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    {schema.title}
                  </Link>
                );
              })}
            </div>
          </div>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
