'use server';

export async function fetchInstagramImage(url: string) {
  try {
    // 1. Try JSON endpoint first (returns clean images without play button)
    const jsonUrl = url.includes('?') ? `${url}&__a=1&__d=dis` : `${url}?__a=1&__d=dis`;
    let res = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      const imageUrl = data?.graphql?.shortcode_media?.display_url || data?.items?.[0]?.image_versions2?.candidates?.[0]?.url;
      if (imageUrl) return imageUrl;
    }

    // 1.5. Try OEmbed endpoint (often has clean thumbnails)
    const oembedUrl = `https://api.instagram.com/oembed/?url=${url}`;
    res = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.thumbnail_url) {
        return data.thumbnail_url;
      }
    }

    // 2. Try fetching the /embed/ version which usually has clean thumbnails
    const embedUrl = url.endsWith('/') ? `${url}embed/` : `${url}/embed/`;
    res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/<img[^>]+src="([^">]+)"/);
      if (match && match[1] && !match[1].includes('data:image')) {
        return match[1].replace(/&amp;/g, '&');
      }
    }

    // 3. Try standard URL with Googlebot user agent (has play buttons baked in for reels)
    res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      },
      next: { revalidate: 0 }
    });
    
    if (res.ok) {
      const html = await res.text();
      
      // Try to extract from JSON-LD schema first (clean image)
      const thumbnailMatch = html.match(/"thumbnailUrl":"([^"]+)"/);
      if (thumbnailMatch && thumbnailMatch[1]) {
        try {
          const cleanUrl = JSON.parse(`"${thumbnailMatch[1]}"`);
          return cleanUrl;
        } catch (e) {
          // ignore parse errors
        }
      }

      // Fallback to og:image (has baked-in play button for reels)
      const match = html.match(/<meta property="og:image" content="(.*?)"/);
      if (match && match[1]) {
        return match[1].replace(/&amp;/g, '&');
      }
    }
    
    return null;
  } catch (e) {
    console.error('Error fetching instagram image:', e);
    return null;
  }
}
