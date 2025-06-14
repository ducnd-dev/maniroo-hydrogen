import {useSearchParams} from 'react-router';

/**
 * Active Filter Tags Component - displays selected filters as removable tags
 * @param {ActiveFilterTagsProps} props
 */
export function ActiveFilterTags({onFilterRemove, className = ''}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const removeFilter = (filterType) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(filterType);
    setSearchParams(newSearchParams);
    onFilterRemove?.(filterType);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    onFilterRemove?.('all');
  };

  const activeFilters = Array.from(searchParams.entries()).filter(
    ([key, value]) => value && key !== 'sort'
  );

  if (activeFilters.length === 0) {
    return null;
  }

  const getFilterLabel = (key, value) => {
    const labels = {
      price: {
        'under-25': 'Under $25',
        '25-50': '$25 - $50',
        '50-100': '$50 - $100',
        '100-200': '$100 - $200',
        'over-200': 'Over $200',
      },
      availability: {
        'in-stock': 'In Stock',
        'out-of-stock': 'Out of Stock',
      },
      type: {
        'clothing': 'Clothing',
        'accessories': 'Accessories',
        'home-living': 'Home & Living',
        'art-craft': 'Art & Craft',
        'jewelry': 'Jewelry',
        'electronics': 'Electronics',
      },
      color: {
        'red': 'Red',
        'orange': 'Orange',
        'yellow': 'Yellow',
        'green': 'Green',
        'blue': 'Blue',
        'purple': 'Purple',
        'pink': 'Pink',
        'black': 'Black',
        'white': 'White',
        'gray': 'Gray',
        'brown': 'Brown',
        'beige': 'Beige',
      },
      material: {
        'cotton': 'Cotton',
        'silk': 'Silk',
        'wool': 'Wool',
        'leather': 'Leather',
        'metal': 'Metal',
        'wood': 'Wood',
        'ceramic': 'Ceramic',
        'glass': 'Glass',
      },
    };

    return labels[key]?.[value] || value;
  };

  return (
    <div className={`active-filter-tags ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Applied filters:</span>
        
        {activeFilters.map(([key, value]) => (
          <button
            key={`${key}-${value}`}
            onClick={() => removeFilter(key)}
            className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full hover:bg-orange-200 transition-colors group"
          >
            <span>{getFilterLabel(key, value)}</span>
            <svg
              className="ml-1 w-3 h-3 group-hover:text-orange-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ))}
        
        {activeFilters.length > 1 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-orange-600 underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * @typedef {Object} ActiveFilterTagsProps
 * @property {function} [onFilterRemove] - Callback when filter is removed
 * @property {string} [className] - Additional CSS classes
 */
