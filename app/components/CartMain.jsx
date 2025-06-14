import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);
  const cartHasItems = Boolean(cart?.totalQuantity && cart.totalQuantity > 0);

  if (layout === 'page') {
    return (
      <div className="p-6">
        <CartEmpty hidden={cartHasItems} layout={layout} />
        
        {cartHasItems && (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="mt-8 lg:mt-0 lg:col-span-1">
              <div className="sticky top-8">
                <CartSummary cart={cart} layout={layout} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }  // Sidebar layout (original)
  return (
    <div className="h-full flex flex-col">
      <CartEmpty hidden={cartHasItems} layout={layout} />
        {cartHasItems && (
        <>          <div className="flex-1 overflow-y-auto min-h-0" style={{maxHeight: 'calc(100vh - 520px)'}}>
            <div className="p-4">
              <div className="space-y-4">
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
              </div>
            </div>
            
            {layout === 'aside' && (
              <div className="p-4 border-t border-gray-100">
                <ViewFullCartLink />
              </div>
            )}
          </div>
            <div className="flex-shrink-0 border-t bg-white" style={{minHeight: '350px'}}>
            <CartSummary cart={cart} layout={layout} />
          </div>
        </>
      )}
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({hidden = false}) {
  const {close} = useAside();
  return !hidden && (
    <div hidden={hidden} className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
      </div>
      
      <h3 className="font-serif text-xl font-medium text-gray-900 mb-2">
        Your cart is empty
      </h3>
        <p className="text-gray-600 mb-6 max-w-xs">
        Looks like you haven&apos;t added any items to your cart yet.
      </p>
      
      <Link
        onClick={close}
        to="/collections/all"
        className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors"
      >
        Continue shopping
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>  );
}

/**
 * View Full Cart Link Component for Sidebar
 */
function ViewFullCartLink() {
  const {close} = useAside();
  
  return (
    <Link
      to="/cart"
      onClick={close}
      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      View Full Cart
    </Link>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
