import {useState} from 'react';
import {useSearchParams} from 'react-router';

/**
 * Product Filter Component with Etsy-like styling
 * @param {ProductFilterProps} props
 */
export function ProductFilter({
  onFilterChange,
  className = '',
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentFilters = {
    sortBy: searchParams.get('sort') || 'featured',
    priceRange: searchParams.get('price') || '',
    availability: searchParams.get('availability') || '',
    productType: searchParams.get('type') || '',
  };  const handleFilterChange = (filterType, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (value) {
      newSearchParams.set(filterType, value);
    } else {
      newSearchParams.delete(filterType);
    }
    
    setSearchParams(newSearchParams);
    onFilterChange?.(Object.fromEntries(newSearchParams));
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    onFilterChange?.({});
  };

  const hasActiveFilters = Array.from(searchParams.entries()).length > 0;

  return (
    <div className={`product-filter ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-700">Filters</span>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {Array.from(searchParams.entries()).length}
              </span>
            )}
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Filter Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Sort By */}
            <FilterSection title="Sort by">
              <select
                value={currentFilters.sortBy}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="best-selling">Best Selling</option>
                <option value="customer-review">Customer Reviews</option>
              </select>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price">
              <div className="space-y-2">
                {[
                  { label: 'Under $25', value: 'under-25' },
                  { label: '$25 to $50', value: '25-50' },
                  { label: '$50 to $100', value: '50-100' },
                  { label: '$100 to $200', value: '100-200' },
                  { label: 'Over $200', value: 'over-200' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={currentFilters.priceRange === option.value}
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Availability */}
            <FilterSection title="Availability">
              <div className="space-y-2">
                {[
                  { label: 'In stock', value: 'in-stock' },
                  { label: 'Out of stock', value: 'out-of-stock' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={currentFilters.availability === option.value}
                      onChange={(e) => 
                        handleFilterChange('availability', e.target.checked ? e.target.value : '')
                      }
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>            {/* Product Type */}
            <FilterSection title="Product Type">
              <div className="space-y-2">
                {[
                  { label: 'T-Shirts', value: 't-shirts' },
                  { label: 'Accessories', value: 'accessories' },
                  { label: 'Home & Garden', value: 'home-garden' },
                  { label: 'Jewelry', value: 'jewelry' },
                  { label: 'Bath & Beauty', value: 'bath-beauty' },
                  { label: 'Bags & Purses', value: 'bags-purses' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={currentFilters.productType === option.value}
                      onChange={(e) => 
                        handleFilterChange('type', e.target.checked ? e.target.value : '')
                      }
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Color Filter */}
            <FilterSection title="Color">
              <div className="grid grid-cols-6 gap-2">
                {[
                  { name: 'Red', color: '#EF4444' },
                  { name: 'Orange', color: '#F97316' },
                  { name: 'Yellow', color: '#EAB308' },
                  { name: 'Green', color: '#22C55E' },
                  { name: 'Blue', color: '#3B82F6' },
                  { name: 'Purple', color: '#A855F7' },
                  { name: 'Pink', color: '#EC4899' },
                  { name: 'Black', color: '#000000' },
                  { name: 'White', color: '#FFFFFF' },
                  { name: 'Gray', color: '#6B7280' },
                  { name: 'Brown', color: '#92400E' },
                  { name: 'Beige', color: '#D4C4A8' },
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleFilterChange('color', color.name.toLowerCase())}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      searchParams.get('color') === color.name.toLowerCase()
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  >
                    {color.name === 'White' && (
                      <div className="w-full h-full rounded-full border border-gray-200" />
                    )}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Material Filter */}
            <FilterSection title="Material">
              <div className="space-y-2">
                {[
                  'Cotton',
                  'Silk',
                  'Wool',
                  'Leather',
                  'Metal',
                  'Wood',
                  'Ceramic',
                  'Glass',
                ].map((material) => (
                  <label key={material} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={material.toLowerCase()}
                      checked={searchParams.get('material') === material.toLowerCase()}
                      onChange={(e) => 
                        handleFilterChange('material', e.target.checked ? e.target.value : '')
                      }
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{material}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Filter Section Component
 * @param {FilterSectionProps} props
 */
function FilterSection({title, children}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="filter-section">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <h4 className="font-medium text-gray-900">{title}</h4>
        <svg
          className={`w-4 h-4 text-gray-500 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && <div className="mt-2">{children}</div>}
    </div>
  );
}

/**
 * @typedef {Object} ProductFilterProps
 * @property {function} [onFilterChange] - Callback when filters change
 * @property {Object} [availableFilters] - Available filter options
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {Object} FilterSectionProps
 * @property {string} title - Section title
 * @property {React.ReactNode} children - Section content
 */
