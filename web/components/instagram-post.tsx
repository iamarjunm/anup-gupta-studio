import Image from 'next/image';
import Link from 'next/link';
import { fetchInstagramImage } from '@/app/actions/instagram';

export async function InstagramPost({ url, index, coverImage }: { url: string, index: number, coverImage?: string }) {
  const isLink = url && url !== '#';
  const imageUrl = coverImage || (isLink ? await fetchInstagramImage(url) : null);
  let finalImage = imageUrl || `https://picsum.photos/seed/instagram_new_${index}/400/500`;
  if (imageUrl && !coverImage) {
    finalImage = finalImage.includes('?') ? `${finalImage}&bust=${Date.now()}` : `${finalImage}?bust=${Date.now()}`;
  }
  return (
    <Link href={url || '#'} target={isLink ? "_blank" : "_self"} className="relative aspect-[170/302] group block overflow-hidden bg-gray-100">
      <Image
        src={finalImage}
        alt={`Instagram post ${index + 1}`}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        {url?.includes('/reel/') ? (
          <svg 
            className="w-10 h-10 text-white ml-1" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        )}
      </div>
    </Link>
  );
}
