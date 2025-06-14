import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {ProductFilter} from '~/components/ProductFilter';
import {ActiveFilterTags} from '~/components/ActiveFilterTags';
import {ProductListHeader, QuickFilterBar} from '~/components/ProductListHeader';

/**
 * Convert URL search params to Shopify product filters
 * @param {URLSearchParams} searchParams
 * @returns {Array}
 */
/**
 * Convert URL search params to Shopify search query
 * @param {URLSearchParams} searchParams
 * @returns {string}
 */
function buildSearchQuery(searchParams) {
  const queryParts = [];
  
  // Product type filter
  const productType = searchParams.get('type');
  if (productType) {
    queryParts.push(`product_type:${productType}`);
  }
  
  // Availability filter
  const availability = searchParams.get('availability');
  if (availability === 'in-stock') {
    queryParts.push('available:true');
  } else if (availability === 'out-of-stock') {
    queryParts.push('available:false');
  }
  
  // Color filter (as tag)
  const color = searchParams.get('color');
  if (color) {
    queryParts.push(`tag:${color}`);
  }
  
  // Material filter (as tag)
  const material = searchParams.get('material');
  if (material) {
    queryParts.push(`tag:${material}`);
  }
  
  // Vendor filter
  const vendor = searchParams.get('vendor');
  if (vendor) {
    queryParts.push(`vendor:${vendor}`);
  }
  
  return queryParts.join(' AND ');
}

/**
 * Convert sort parameter to Shopify sort format
 * @param {string} sort
 * @returns {Object}
 */
function buildSortKey(sort) {
  const sortMap = {
    'featured': { sortKey: 'RELEVANCE', reverse: false },
    'price-low-high': { sortKey: 'PRICE', reverse: false },
    'price-high-low': { sortKey: 'PRICE', reverse: true },
    'newest': { sortKey: 'CREATED_AT', reverse: true },
    'best-selling': { sortKey: 'BEST_SELLING', reverse: false },
    'alpha-asc': { sortKey: 'TITLE', reverse: false },
    'alpha-desc': { sortKey: 'TITLE', reverse: true },
  };
  
  return sortMap[sort] || sortMap['featured'];
}

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = () => {
  return [{title: `Hydrogen | Products`}];
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
async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  // Parse URL search params for filters
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // Build Shopify search query from URL params
  const query = buildSearchQuery(searchParams);
  const sortKey = buildSortKey(searchParams.get('sort') || 'featured');

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {
        ...paginationVariables,
        query: query || undefined,
        sortKey: sortKey.sortKey,
        reverse: sortKey.reverse,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData() {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();
  const handleFilterChange = () => {
    // Filters are handled by URL search params automatically
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Discover our entire collection of handmade and unique items
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <ProductFilter 
              onFilterChange={handleFilterChange}
              className="sticky top-8"
            />
          </div>          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Active Filter Tags */}
            <div className="mb-6">
              <ActiveFilterTags />
            </div>

            {/* Quick Filter Bar */}
            <div className="mb-6">
              <QuickFilterBar />
            </div>            {/* Products Count & Sort */}
            <div className="mb-6">
              <ProductListHeader 
                totalCount={products?.nodes?.length || 0}
              />
            </div>

            {/* Products Grid */}
            <PaginatedResourceSection
              connection={products}
              resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {({node: product, index}) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 8 ? 'eager' : undefined}
                />
              )}
            </PaginatedResourceSection>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCT_CATALOG_FRAGMENT = `#graphql
  fragment MoneyProductCatalog on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductCatalogItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductCatalog
      }
      maxVariantPrice {
        ...MoneyProductCatalog
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first, 
      last: $last, 
      before: $startCursor, 
      after: $endCursor,
      query: $query,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      nodes {
        ...ProductCatalogItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CATALOG_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('react-router').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
