import {useSearchParams} from 'react-router';

/**
 * Product List Header with count and sort controls
 * @param {ProductListHeaderProps} props
 */
export function ProductListHeader({
  totalCount = 0,
  currentPage = 1,
  itemsPerPage = 8,
  onSortChange,
  className = '',
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get('sort') || 'featured';

  const handleSortChange = (sortValue) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (sortValue === 'featured') {
      newSearchParams.delete('sort');
    } else {
      newSearchParams.set('sort', sortValue);
    }
    setSearchParams(newSearchParams);
    onSortChange?.(sortValue);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className={`product-list-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      {/* Results Count */}
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-600">
          {totalCount > 0 ? (
            <>
              Showing {startItem}-{endItem} of {totalCount} results
            </>
          ) : (
            'No products found'
          )}
        </p>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-2">
        <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white min-w-0 sm:min-w-[160px]"
        >
          <option value="featured">Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="best-selling">Best Selling</option>
          <option value="customer-review">Customer Reviews</option>
          <option value="alphabetical-az">Name: A-Z</option>
          <option value="alphabetical-za">Name: Z-A</option>
        </select>
      </div>
    </div>
  );
}

/**
 * Quick Filter Bar for common filters
 * @param {QuickFilterBarProps} props
 */
export function QuickFilterBar({onQuickFilter, className = ''}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleQuickFilter = (filterKey, filterValue) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Toggle filter if it's already active
    if (searchParams.get(filterKey) === filterValue) {
      newSearchParams.delete(filterKey);
    } else {
      newSearchParams.set(filterKey, filterValue);
    }
    
    setSearchParams(newSearchParams);
    onQuickFilter?.(filterKey, filterValue);
  };

  const quickFilters = [
    { key: 'availability', value: 'in-stock', label: 'In Stock', icon: '✓' },
    { key: 'price', value: 'under-25', label: 'Under $25', icon: '$' },
    { key: 'type', value: 'jewelry', label: 'Jewelry', icon: '💎' },
    { key: 'type', value: 'clothing', label: 'Clothing', icon: '👗' },
    { key: 'material', value: 'cotton', label: 'Cotton', icon: '🌿' },
    { key: 'color', value: 'black', label: 'Black', icon: '⚫' },
  ];

  return (
    <div className={`quick-filter-bar ${className}`}>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600 self-center">Quick filters:</span>
        {quickFilters.map((filter) => {
          const isActive = searchParams.get(filter.key) === filter.value;
          return (
            <button
              key={`${filter.key}-${filter.value}`}
              onClick={() => handleQuickFilter(filter.key, filter.value)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{filter.icon}</span>
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @typedef {Object} ProductListHeaderProps
 * @property {number} [totalCount] - Total number of products
 * @property {number} [currentPage] - Current page number
 * @property {number} [itemsPerPage] - Items per page
 * @property {function} [onSortChange] - Callback when sort changes
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {Object} QuickFilterBarProps
 * @property {function} [onQuickFilter] - Callback when quick filter is applied
 * @property {string} [className] - Additional CSS classes
 */
