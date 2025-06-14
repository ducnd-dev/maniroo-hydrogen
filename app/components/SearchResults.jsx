import {Link} from 'react-router';
import {Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams} from '~/lib/search';
import {ProductItem} from '~/components/ProductItem';

/**
 * @param {Omit<SearchResultsProps, 'error' | 'type'>}
 */
export function SearchResults({term, result, children}) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

/**
 * @param {PartialSearchResult<'articles'>}
 */
function SearchResultsArticles({term, articles}) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Articles</h2>
      <div className="grid gap-4">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow" key={article.id}>
              <Link prefetch="intent" to={articleUrl} className="block">
                <h3 className="font-medium text-gray-900 hover:text-orange-600 transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @param {PartialSearchResult<'pages'>}
 */
function SearchResultsPages({term, pages}) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Pages</h2>
      <div className="grid gap-4">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow" key={page.id}>
              <Link prefetch="intent" to={pageUrl} className="block">
                <h3 className="font-medium text-gray-900 hover:text-orange-600 transition-colors">
                  {page.title}
                </h3>
                {page.body && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {page.body.substring(0, 150)}...
                  </p>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @param {PartialSearchResult<'products'>}
 */
function SearchResultsProducts({products}) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nodes.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading="lazy"
                />
              ))}
            </div>
          );

          return (
            <div className="space-y-8">
              {/* Previous Link */}
              <div className="flex justify-center">
                <PreviousLink className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  {isLoading ? 'Loading...' : 'Load previous'}
                </PreviousLink>
              </div>
              
              {/* Products Grid */}
              <div>
                {ItemsMarkup}
              </div>
              
              {/* Next Link */}
              <div className="flex justify-center">
                <NextLink className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                  {isLoading ? 'Loading...' : 'Load more'}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <h3 className="font-serif text-xl font-medium text-gray-900 mb-2">
        No results found
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn&apos;t find anything matching your search. Try different keywords or browse our collections.
      </p>
      
      <Link
        to="/collections/all"
        className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors"
      >
        Browse all products
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}

/** @typedef {RegularSearchReturn['result']['items']} SearchItems */
/**
 * @typedef {Pick<
 *   SearchItems,
 *   ItemType
 * > &
 *   Pick<RegularSearchReturn, 'term'>} PartialSearchResult
 * @template {keyof SearchItems} ItemType
 */
/**
 * @typedef {RegularSearchReturn & {
 *   children: (args: SearchItems & {term: string}) => React.ReactNode;
 * }} SearchResultsProps
 */

/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
