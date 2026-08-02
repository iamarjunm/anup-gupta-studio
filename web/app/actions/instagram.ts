'use server';

export async function fetchInstagramImage(url: string) {
  try {
    // 1. Try standard URL with Googlebot user agent (Instagram often allows Googlebot to see og tags)
    let res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      },
      next: { revalidate: 3600 }
    });
    
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/<meta property="og:image" content="(.*?)"/);
      if (match && match[1]) {
        return match[1].replace(/&amp;/g, '&');
      }
    }

    // 2. Fallback: try fetching the /embed/ version which might have less strict blocking
    const embedUrl = url.endsWith('/') ? `${url}embed/` : `${url}/embed/`;
    res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const html = await res.text();
      // Look for any image tag that looks like the main media
      const match = html.match(/<img[^>]+src="([^">]+)"/);
      if (match && match[1]) {
        return match[1].replace(/&amp;/g, '&');
      }
    }

    // 3. Fallback: try JSON endpoint
    const jsonUrl = url.includes('?') ? `${url}&__a=1&__d=dis` : `${url}?__a=1&__d=dis`;
    res = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const data = await res.json();
      const imageUrl = data?.graphql?.shortcode_media?.display_url || data?.items?.[0]?.image_versions2?.candidates?.[0]?.url;
      if (imageUrl) return imageUrl;
    }
    
    return null;
  } catch (e) {
    console.error('Error fetching instagram image:', e);
    return null;
  }
}
