import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  
  return (
    <Link
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <div className="overflow-hidden rounded-t-xl">
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-4">
        <h4 className="font-serif text-lg font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-gray-900 transition-colors">
          {product.title}
        </h4>
          <div className="flex items-center justify-between">
          <div className="text-orange-500 font-bold text-lg">
            {product.priceRange?.minVariantPrice ? (
              <Money data={product.priceRange.minVariantPrice} />
            ) : (
              <span>Price unavailable</span>
            )}
          </div>
          
          {/* Etsy-style favorite heart icon placeholder */}
          <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        
        {/* Optional: Free shipping badge like Etsy */}
        <div className="mt-2 text-xs text-gray-500">
          FREE shipping
        </div>
      </div>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
