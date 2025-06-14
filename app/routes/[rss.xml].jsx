/**
 * RSS Feed Generator for Blog Posts
 */

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context: {storefront}}) {
  const url = new URL(request.url);
  
  try {
    // Fetch blog articles
    const {blogs} = await storefront.query(BLOGS_RSS_QUERY);
    
    if (!blogs.nodes.length) {
      throw new Response('No blogs found', {status: 404});
    }

    const blog = blogs.nodes[0];
    const articles = blog.articles.nodes;    const rssContent = generateRSSFeed({
      title: `${blog.title} - Maniroo Store`,
      description: `Latest articles from ${blog.title} at Maniroo Store`,
      link: `${url.origin}/blogs/${blog.handle}`,
      articles,
      baseUrl: url.origin,
    });

    return new Response(rssContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('RSS Feed Error:', error);
    throw new Response('RSS Feed Error', {status: 500});
  }
}

function generateRSSFeed({title, description, link, articles, baseUrl}) {
  const rssItems = articles
    .map((article) => {
      const articleUrl = `${baseUrl}/blogs/${article.blog.handle}/${article.handle}`;
      const pubDate = new Date(article.publishedAt).toUTCString();
      const articleDescription = article.excerpt || `Read the full article: ${article.title}`;
      
      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${articleDescription}]]></description>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      ${article.image ? `<enclosure url="${article.image.url}" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[${description}]]></description>
    <link>${link}</link>
    <atom:link href="${link}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Maniroo Store RSS Generator</generator>
    ${rssItems}
  </channel>
</rss>`;
}

const BLOGS_RSS_QUERY = `#graphql
  query BlogsRSS($first: Int = 10) {
    blogs(first: 1) {
      nodes {
        title
        handle
        articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            excerpt
            publishedAt
            blog {
              handle
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
