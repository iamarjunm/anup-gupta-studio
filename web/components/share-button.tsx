'use client';

import { Share2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useEffect, useState } from 'react';

export function ShareButton() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: url
        });
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }

    // Fallback to copying to clipboard
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied to clipboard!', 'success');
    } catch (err) {
      toast('Failed to copy link', 'error');
    }
  };

  return (
    <button 
      onClick={handleShare}
      suppressHydrationWarning 
      className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase mt-6 hover:text-gray-600 transition-colors cursor-pointer w-fit"
    >
      <Share2 className="w-4 h-4" /> SHARE
    </button>
  );
}
