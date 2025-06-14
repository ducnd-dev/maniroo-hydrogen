import {redirect} from '@shopify/remix-oxygen';
import {useLoaderData} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {ProductFilter} from '~/components/ProductFilter';
import {ActiveFilterTags} from '~/components/ActiveFilterTags';
import {ProductListHeader, QuickFilterBar} from '~/components/ProductListHeader';

/**
 * Convert URL search params to Shopify product filters
 * @param {URLSearchParams} searchParams
 * @returns {Array}
 */
function buildShopifyFilters(searchParams) {
  const filters = [];
  
  // Price filter
  const price = searchParams.get('price');
  if (price) {
    const priceMap = {
      'under-25': { price: { max: 25.0 } },
      '25-50': { price: { min: 25.0, max: 50.0 } },
      '50-100': { price: { min: 50.0, max: 100.0 } },
      '100-200': { price: { min: 100.0, max: 200.0 } },
      'over-200': { price: { min: 200.0 } },
    };
    if (priceMap[price]) {
      filters.push(priceMap[price]);
    }
  }
  
  // Availability filter
  const availability = searchParams.get('availability');
  if (availability === 'in-stock') {
    filters.push({ available: true });
  } else if (availability === 'out-of-stock') {
    filters.push({ available: false });
  }
    // Product type filter - try both productType and tag
  const productType = searchParams.get('type');
  if (productType) {
    // First try as productType
    filters.push({ productType });
    // Also try as tag for better matching
    filters.push({ tag: productType });
  }
  
  // Color filter
  const color = searchParams.get('color');
  if (color) {
    filters.push({ tag: color });
  }
  
  // Material filter
  const material = searchParams.get('material');
  if (material) {
    filters.push({ tag: material });
  }
  
  // Vendor filter
  const vendor = searchParams.get('vendor');
  if (vendor) {
    filters.push({ productVendor: vendor });
  }
  
  return filters;
}

/**
 * Convert sort parameter to Shopify sort format
 * @param {string} sort
 * @returns {Object}
 */
function buildSortKey(sort) {
  const sortMap = {
    'featured': { sortKey: 'MANUAL', reverse: false },
    'price-low-high': { sortKey: 'PRICE', reverse: false },
    'price-high-low': { sortKey: 'PRICE', reverse: true },
    'newest': { sortKey: 'CREATED', reverse: true },
    'best-selling': { sortKey: 'BEST_SELLING', reverse: false },
    'alpha-asc': { sortKey: 'TITLE', reverse: false },
    'alpha-desc': { sortKey: 'TITLE', reverse: true },
  };
  
  return sortMap[sort] || sortMap['featured'];
}

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  // Parse URL search params for filters
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // Build Shopify filters from URL params
  const filters = buildShopifyFilters(searchParams);
  const sortKey = buildSortKey(searchParams.get('sort') || 'featured');

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle, 
        ...paginationVariables,
        filters,
        sortKey: sortKey.sortKey,
        reverse: sortKey.reverse,
      },
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
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
  const {collection} = useLoaderData();  const handleFilterChange = () => {
    // Filters are handled by URL search params automatically
    // Could add analytics tracking here if needed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Collection Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-gray-600 max-w-2xl">
              {collection.description}
            </p>
          )}
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
            </div>

            {/* Products Count & Sort */}
            <div className="mb-6">
              <ProductListHeader 
                totalCount={collection.products.nodes.length}
              />
            </div>

            {/* Products Grid */}
            <PaginatedResourceSection
              connection={collection.products}
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

        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
            },
          }}
        />
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('react-router').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
