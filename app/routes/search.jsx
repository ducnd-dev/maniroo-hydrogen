import {useLoaderData} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {ProductFilter} from '~/components/ProductFilter';
import {ActiveFilterTags} from '~/components/ActiveFilterTags';
import {ProductListHeader, QuickFilterBar} from '~/components/ProductListHeader';
import {getEmptyPredictiveSearchResult} from '~/lib/search';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: `Hydrogen | Search`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise = isPredictive
    ? predictiveSearch({request, context})
    : regularSearch({request, context});

  searchPromise.catch((error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}

/**
 * Renders the /search route
 */
export default function SearchPage() {
  /** @type {LoaderReturnData} */
  const {type, term, result, error} = useLoaderData();
  if (type === 'predictive') return null;

  const handleFilterChange = () => {
    // Filters are handled by URL search params automatically
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">Search</h1>
          
          {/* Search Form */}
          <div className="max-w-2xl">
            <SearchForm>
              {({inputRef}) => (
                <div className="flex space-x-2">
                  <input
                    defaultValue={term}
                    name="q"
                    placeholder="Search for anything..."
                    ref={inputRef}
                    type="search"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Search
                  </button>
                </div>
              )}
            </SearchForm>
          </div>
          
          {/* Search Term Display */}
          {term && (
            <div className="mt-4">              <p className="text-gray-600">
                Search results for: <span className="font-medium text-gray-900">&ldquo;{term}&rdquo;</span>
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {!term || !result?.total ? (
          <div className="text-center py-12">
            <SearchResults.Empty />
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1 mb-8 lg:mb-0">
              <ProductFilter 
                onFilterChange={handleFilterChange}
                className="sticky top-8"
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Active Filter Tags */}
              <div className="mb-6">
                <ActiveFilterTags />
              </div>

              {/* Quick Filter Bar */}
              <div className="mb-6">
                <QuickFilterBar />
              </div>

              {/* Results Count & Sort */}
              <div className="mb-6">
                <ProductListHeader 
                  totalCount={result?.total || 0}
                />
              </div>

              {/* Search Results */}
              <SearchResults result={result} term={term}>
                {({articles, pages, products, term}) => (
                  <div className="space-y-8">
                    <SearchResults.Products products={products} term={term} />
                    <SearchResults.Pages pages={pages} term={term} />
                    <SearchResults.Articles articles={articles} term={term} />
                  </div>
                )}
              </SearchResults>
            </div>
          </div>
        )}

        <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
      </div>
    </div>
  );
}

/**
 * Regular search query and fragments
 * (adjust as needed)
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
`;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
`;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
`;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
    $sortKey: SearchSortKeys
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: $sortKey,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Build search query with filters
 * @param {string} searchTerm 
 * @param {URLSearchParams} searchParams 
 * @returns {string}
 */
function buildSearchQuery(searchTerm, searchParams) {
  const queryParts = [searchTerm];
  
  // Price filter
  const price = searchParams.get('price');
  if (price) {
    const priceMap = {
      'under-25': '(price:<25)',
      '25-50': '(price:>=25 AND price:<=50)',
      '50-100': '(price:>=50 AND price:<=100)',
      '100-200': '(price:>=100 AND price:<=200)',
      'over-200': '(price:>200)',
    };
    if (priceMap[price]) {
      queryParts.push(priceMap[price]);
    }
  }
  
  // Availability filter
  const availability = searchParams.get('availability');
  if (availability === 'in-stock') {
    queryParts.push('available:true');
  } else if (availability === 'out-of-stock') {
    queryParts.push('available:false');
  }
  
  // Product type filter
  const productType = searchParams.get('type');
  if (productType) {
    queryParts.push(`product_type:${productType}`);
  }
  
  // Color filter
  const color = searchParams.get('color');
  if (color) {
    queryParts.push(`tag:${color}`);
  }
  
  // Material filter
  const material = searchParams.get('material');
  if (material) {
    queryParts.push(`tag:${material}`);
  }
  
  // Vendor filter
  const vendor = searchParams.get('vendor');
  if (vendor) {
    queryParts.push(`vendor:${vendor}`);
  }
  
  return queryParts.filter(Boolean).join(' AND ');
}

/**
 * Convert sort parameter to search sort key
 * @param {string} sort 
 * @returns {string}
 */
function buildSearchSortKey(sort) {
  const sortMap = {
    'featured': 'RELEVANCE',
    'price-low-high': 'PRICE',
    'price-high-low': 'PRICE', // Note: will need reverse: true
    'newest': 'CREATED_AT',
    'best-selling': 'RELEVANCE', // Search API doesn't have BEST_SELLING
    'alpha-asc': 'RELEVANCE',
    'alpha-desc': 'RELEVANCE',
  };
  
  return sortMap[sort] || 'RELEVANCE';
}

/**
 * Regular search fetcher
 * @param {Pick<
 *   LoaderFunctionArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<RegularSearchReturn>}
 */
async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const searchParams = url.searchParams;
  const originalTerm = String(searchParams.get('q') || '');
  
  // Build enhanced search query with filters
  const enhancedTerm = buildSearchQuery(originalTerm, searchParams);
  const sortKey = buildSearchSortKey(searchParams.get('sort') || 'featured');

  // Search articles, pages, and products for the enhanced term
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term: enhancedTerm, sortKey},
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, {nodes}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term: originalTerm, error, result: {total, items}};
}

/**
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
`;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
`;

/**
 * Predictive search fetcher
 * @param {Pick<
 *   ActionFunctionArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<PredictiveSearchReturn>}
 */
async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, item) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @template T @typedef {import('react-router').MetaFunction<T>} MetaFunction */
/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
/** @typedef {import('~/lib/search').PredictiveSearchReturn} PredictiveSearchReturn */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
