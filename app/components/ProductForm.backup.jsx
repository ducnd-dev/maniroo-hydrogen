import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name} className="space-y-3">
            <h3 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
              {option.name}
            </h3>
            <div className="flex flex-wrap gap-2">              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className={`
                        relative min-w-[2.5rem] h-10 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                        ${selected 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }
                        ${!available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                      {!available && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-gray-400 transform rotate-45"></div>
                        </div>
                      )}
                    </Link>
                  );
                }

                return (
                  <button
                    key={option.name + name}
                    className={`
                      relative min-w-[2.5rem] h-10 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                      ${selected 
                        ? 'border-orange-500 bg-orange-50 text-orange-700' 
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }
                      ${!available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    disabled={!available}
                    onClick={() => {
                      if (!available) return;
                      navigate(`?${variantUriQuery}`, {
                        replace: true,
                        preventScrollReset: true,
                      });
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                    {!available && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-gray-400 transform rotate-45"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {/* Quantity Selector */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
          Quantity
        </h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button className="p-2 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input 
              type="number" 
              defaultValue="1" 
              min="1" 
              className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
            />
            <button className="p-2 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {selectedVariant?.quantityAvailable ? `Only ${selectedVariant.quantityAvailable} left` : ''}
          </span>
        </div>
      </div>

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}      </AddToCartButton>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <span>{name}</span>;

  return (
    <div className="flex items-center space-x-2">
      <div
        className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
        style={{
          backgroundColor: color || 'transparent',
        }}
      >
        {!!image && (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full rounded-full object-cover"
          />
        )}
      </div>
      <span>{name}</span>
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
