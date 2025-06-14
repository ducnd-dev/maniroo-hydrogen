import {useState, useRef, useEffect} from 'react';
import {useFetcher, Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

/**
 * Enhanced Search Input with Autocomplete
 * @param {EnhancedSearchProps} props
 */
export function EnhancedSearch({
  placeholder = "Search for anything",
  className = "",
  showResults = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fetcher = useFetcher({key: 'predictive-search'});
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const aside = useAside();

  // Fetch predictive results
  const fetchResults = (term) => {
    if (term.length > 2) {
      fetcher.submit(
        {q: term, limit: 6, predictive: true},
        {method: 'GET', action: '/search'},
      );
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length > 0);
    
    if (value.length > 2) {
      fetchResults(value);
    }
  };

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      setIsOpen(false);
      aside.close();
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = fetcher.data?.result?.items || {};
  const isLoading = fetcher.state === 'loading';

  return (
    <div className={`relative ${className}`} ref={resultsRef}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="search"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Predictive Results Dropdown */}
      {isOpen && showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              <span className="ml-2">Searching...</span>
            </div>
          ) : (
            <div className="py-2">
              {/* Search Suggestions */}
              {searchTerm && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <Link
                    to={`/search?q=${encodeURIComponent(searchTerm)}`}
                    className="flex items-center text-sm text-gray-700 hover:text-orange-600 transition-colors"
                    onClick={() => {
                      setIsOpen(false);
                      aside.close();
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search for &ldquo;{searchTerm}&rdquo;
                  </Link>
                </div>
              )}

              {/* Products */}
              {results.products?.nodes?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Products
                  </div>
                  {results.products.nodes.slice(0, 4).map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.handle}`}
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        aside.close();
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        {product.selectedOrFirstAvailableVariant?.image && (
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded overflow-hidden">
                            <Image
                              data={product.selectedOrFirstAvailableVariant.image}
                              alt={product.title}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </p>
                          {product.selectedOrFirstAvailableVariant?.price && (
                            <p className="text-sm text-orange-600">
                              <Money data={product.selectedOrFirstAvailableVariant.price} />
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Collections */}
              {results.collections?.nodes?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-t border-gray-100">
                    Collections
                  </div>
                  {results.collections.nodes.slice(0, 3).map((collection) => (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.handle}`}
                      className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        aside.close();
                      }}
                    >
                      <p className="text-sm text-gray-900">{collection.title}</p>
                    </Link>
                  ))}
                </div>
              )}

              {/* No results */}
              {!isLoading && !results.products?.nodes?.length && !results.collections?.nodes?.length && searchTerm.length > 2 && (
                <div className="px-4 py-6 text-center text-gray-500">
                  <p className="text-sm">No results found for &ldquo;{searchTerm}&rdquo;</p>
                  <Link
                    to="/collections/all"
                    className="text-sm text-orange-600 hover:text-orange-700 mt-2 inline-block"
                    onClick={() => {
                      setIsOpen(false);
                      aside.close();
                    }}
                  >
                    Browse all products
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * @typedef {Object} EnhancedSearchProps
 * @property {string} [placeholder] - Placeholder text for the search input
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [showResults] - Whether to show predictive results
 */
