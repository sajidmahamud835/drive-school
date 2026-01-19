import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to resolve Facebook share links to embeddable URLs
 * Facebook share links are shortened URLs that need to be resolved
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shareUrl = searchParams.get('url');

    if (!shareUrl) {
      return NextResponse.json(
        { success: false, error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Try to resolve the share link by following redirects
    // Facebook share links redirect to the actual post URL
    const response = await fetch(shareUrl, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Get the final URL after redirects
    const resolvedUrl = response.url;

    // If we got a valid Facebook post URL, return it
    if (resolvedUrl && resolvedUrl.includes('facebook.com')) {
      return NextResponse.json({
        success: true,
        originalUrl: shareUrl,
        resolvedUrl: resolvedUrl,
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(resolvedUrl)}&show_text=false&width=734&height=413`,
      });
    }

    // Fallback: try using Facebook's oEmbed API
    try {
      const oembedUrl = `https://www.facebook.com/plugins/video/oembed.json/?url=${encodeURIComponent(shareUrl)}`;
      const oembedResponse = await fetch(oembedUrl);
      
      if (oembedResponse.ok) {
        const oembedData = await oembedResponse.json();
        if (oembedData.html) {
          // Extract URL from oEmbed HTML iframe src
          const iframeMatch = oembedData.html.match(/src="([^"]+)"/);
          if (iframeMatch && iframeMatch[1]) {
            return NextResponse.json({
              success: true,
              originalUrl: shareUrl,
              resolvedUrl: shareUrl, // Keep original for fallback
              embedUrl: iframeMatch[1],
            });
          }
        }
      }
    } catch (oembedError) {
      console.error('oEmbed API error:', oembedError);
    }

    // If all else fails, return the original URL formatted for embedding
    // Sometimes Facebook's embed system can handle share links directly
    return NextResponse.json({
      success: true,
      originalUrl: shareUrl,
      resolvedUrl: shareUrl,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(shareUrl)}&show_text=false&width=734&height=413`,
    });
  } catch (error: any) {
    console.error('Error resolving Facebook video URL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resolve video URL' },
      { status: 500 }
    );
  }
}