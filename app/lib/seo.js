/**
 * SEO helper functions for better search engine optimization
 */

/**
 * Generate meta tags for pages
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} [options.image] - Page image URL
 * @param {string} [options.url] - Page URL
 * @param {string} [options.type] - Page type (website, article, product)
 * @param {Array} [options.keywords] - Page keywords
 * @param {string} [options.siteName] - Site name
 * @returns {Array} Meta tags array
 */
export function generateMeta({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords = [],
  siteName = 'Maniroo Store'
}) {
  const meta = [
    { title: `${title} | ${siteName}` },
    { name: 'description', content: description },
    { name: 'robots', content: 'index, follow' },
    
    // Open Graph tags
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteName },
    
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    
    // Additional SEO tags
    { name: 'author', content: siteName },
    { name: 'theme-color', content: '#ff6900' },
    { name: 'msapplication-TileColor', content: '#ff6900' },
  ];

  // Add image if provided
  if (image) {
    meta.push(
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: title },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:alt', content: title }
    );
  }

  // Add URL if provided
  if (url) {
    meta.push(
      { property: 'og:url', content: url },
      { rel: 'canonical', href: url }
    );
  }

  // Add keywords if provided
  if (keywords.length > 0) {
    meta.push({ name: 'keywords', content: keywords.join(', ') });
  }

  return meta;
}

/**
 * Generate product-specific meta tags
 * @param {Object} product - Product object
 * @param {string} [url] - Product URL
 * @returns {Array} Meta tags array
 */
export function generateProductMeta(product, url) {
  const title = product.title;
  const description = product.description || `Shop ${product.title} at Maniroo Store. High-quality products with fast shipping.`;
  const image = product.featuredImage?.url;
  const keywords = product.tags || [];

  const meta = generateMeta({
    title,
    description,
    image,
    url,
    type: 'product',
    keywords
  });

  // Add product-specific tags
  if (product.priceRange?.minVariantPrice) {
    meta.push(
      { property: 'product:price:amount', content: product.priceRange.minVariantPrice.amount },
      { property: 'product:price:currency', content: product.priceRange.minVariantPrice.currencyCode }
    );
  }

  if (product.availableForSale !== undefined) {
    meta.push(
      { property: 'product:availability', content: product.availableForSale ? 'in stock' : 'out of stock' }
    );
  }

  return meta;
}

/**
 * Generate collection-specific meta tags
 * @param {Object} collection - Collection object
 * @param {string} [url] - Collection URL
 * @returns {Array} Meta tags array
 */
export function generateCollectionMeta(collection, url) {
  const title = collection.title;
  const description = collection.description || `Discover ${collection.title} collection at Maniroo Store. Curated products for every style.`;
  const image = collection.image?.url;

  return generateMeta({
    title,
    description,
    image,
    url,
    type: 'website'
  });
}

/**
 * Generate structured data (JSON-LD)
 * @param {Object} data - Data object
 * @param {string} type - Schema type (Product, Organization, WebSite, etc.)
 * @returns {Object} Structured data object
 */
export function generateStructuredData(data, type) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type
  };

  switch (type) {
    case 'Product':
      return {
        ...baseSchema,
        name: data.title,
        description: data.description,
        image: data.featuredImage?.url,
        sku: data.id,
        brand: {
          '@type': 'Brand',
          name: 'Maniroo Store'
        },
        offers: {
          '@type': 'Offer',
          price: data.priceRange?.minVariantPrice?.amount,
          priceCurrency: data.priceRange?.minVariantPrice?.currencyCode,
          availability: data.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Maniroo Store'
          }
        }
      };

    case 'Organization':
      return {
        ...baseSchema,
        name: 'Maniroo Store',
        url: 'https://maniroo.com',
        logo: 'https://maniroo.com/logo.png',
        sameAs: [
          'https://facebook.com/maniroo',
          'https://instagram.com/maniroo',
          'https://twitter.com/maniroo'
        ]
      };

    case 'WebSite':
      return {
        ...baseSchema,
        name: 'Maniroo Store',
        url: 'https://maniroo.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://maniroo.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      };

    default:
      return baseSchema;
  }
}
