'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Stop loader when navigation completes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Start loader on internal link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      // Ignore non-internal links
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;
      
      try {
        const targetUrl = new URL(target.href);
        const currentUrl = new URL(window.location.href);

        if (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) {
          setIsLoading(true);
        }
      } catch (err) {
        // Fallback
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[999999] pointer-events-none overflow-hidden">
      <div className="h-full bg-black w-full" style={{
        animation: 'progress 1.5s ease-in-out infinite',
        transformOrigin: 'left'
      }}></div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
