import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  const collections = context.storefront
    .query(COLLECTIONS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    collections,
  };
}



export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Find the perfect handmade piece
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover unique items, from vintage treasures to trendy pieces, all crafted with love by independent sellers
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for anything"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Collection */}
      <FeaturedCollection collection={data.featuredCollection} />
      
      {/* Collections Section */}
      <Collections collections={data.collections} />
      
      {/* Recommended Products */}
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          className="group block"
          to={`/collections/${collection.handle}`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {image && (
              <div className="order-2 md:order-1">
                <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Image 
                    data={image} 
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}
            <div className="order-1 md:order-2 text-center md:text-left">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4 group-hover:text-orange-500 transition-colors">
                {collection.title}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Explore our curated collection of handmade treasures
              </p>
              <span className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors">
                Shop Collection
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   collections: Promise<CollectionsQuery | null>;
 * }}
 */
function Collections({collections}) {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Explore our curated collections of handmade treasures
          </p>
        </div>
        
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length: 6}, (_, i) => `collection-skeleton-${i}`).map((id) => (
              <div key={id} className="bg-gray-100 rounded-xl shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <Await resolve={collections}>
            {(response) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {response?.collections?.nodes?.length > 0
                  ? response.collections.nodes.map((collection) => (
                      <CollectionCard key={collection.id} collection={collection} />
                    ))
                  : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">No collections found</p>
                        <p className="text-gray-400">Collections will appear here once they are created in your store.</p>
                      </div>
                    )}
              </div>
            )}
          </Await>
        </Suspense>
        
        <div className="text-center mt-12">
          <Link 
            to="/collections"
            className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:border-gray-400 hover:bg-white transition-colors"
          >
            View all collections
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   collection: CollectionItemFragment;
 * }}
 */
function CollectionCard({collection}) {
  return (
    <Link 
      to={`/collections/${collection.handle}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
    >
      {collection.image && (
        <div className="aspect-square rounded-t-xl overflow-hidden">
          <Image
            data={collection.image}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {collection.description}
          </p>
        )}
        <div className="mt-4 flex items-center text-orange-500 font-medium">
          <span>Shop now</span>
          <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-gray-800 mb-4">
            Recommended for you
          </h2>
          <p className="text-lg text-gray-600">
            Handpicked items based on trending searches
          </p>
        </div>        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({length: 8}, (_, i) => `skeleton-${i}`).map((id) => (
              <div key={id} className="bg-white rounded-xl shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        }>          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {response?.products?.nodes?.length > 0
                  ? response.products.nodes.map((product) => (
                      <ProductItem 
                        key={product.id} 
                        product={product} 
                        loading={product.id.includes('0') ? 'eager' : 'lazy'}
                      />
                    ))
                  : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">No products found</p>
                        <p className="text-gray-400">Products will appear here once they are added to your store.</p>
                      </div>
                    )}
              </div>
            )}
          </Await>
        </Suspense>
        
        <div className="text-center mt-12">
          <Link 
            to="/collections/all"
            className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:border-gray-400 hover:bg-white transition-colors"
          >
            View all products
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const COLLECTIONS_QUERY = `#graphql
  fragment CollectionItem on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
  }
  query Collections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...CollectionItem
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('react-router').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('storefrontapi.generated').CollectionsQuery} CollectionsQuery */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
