import {CartForm, Money} from '@shopify/hydrogen';
import {useRef} from 'react';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const paddingClass = layout === 'page' ? 'p-6' : 'p-0'; // Remove extra padding for aside layout

  return (
    <div aria-labelledby="cart-summary" className={`${className} bg-white ${paddingClass} rounded-xl border border-gray-100 shadow-sm`}>
      <h4 className={`font-serif ${layout === 'page' ? 'text-xl' : 'text-lg'} font-semibold text-gray-800 mb-4`}>Order Summary</h4>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-800">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
        
        <CartDiscounts discountCodes={cart.discountCodes} />
        <CartGiftCard giftCardCodes={cart.appliedGiftCards} />
        
        {cart.cost?.totalAmount && (
          <div className="flex justify-between items-center py-3 border-t border-gray-200 font-semibold text-lg">
            <span className="text-gray-800">Total</span>
            <span className="text-orange-500">
              <Money data={cart.cost.totalAmount} />
            </span>
          </div>
        )}
        
        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
      </div>
    </div>
  );
}
/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="pt-4">
      <a 
        href={checkoutUrl} 
        target="_self"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2 text-center block"
      >
        <span>Continue to Checkout</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-3">
      {/* Have existing discount, display it with a remove option */}
      {codes.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-green-700">Discount Applied</span>
              <div className="text-sm text-green-600 font-mono">{codes.join(', ')}</div>
            </div>
            <UpdateDiscountForm>
              <button 
                type="submit"
                className="text-green-600 hover:text-green-700 text-sm underline"
              >
                Remove
              </button>
            </UpdateDiscountForm>
          </div>
        </div>
      )}      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="space-y-2">
          <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700">
            Discount Code
          </label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              id="discountCode"
              name="discountCode" 
              placeholder="Enter code" 
              className="flex-1 px-3 w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const appliedGiftCardCodes = useRef([]);
  const giftCardCodeInput = useRef(null);
  const codes =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    if (giftCardCodeInput.current) {
      giftCardCodeInput.current.value = '';
    }
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div className="space-y-3">
      {/* Have existing gift card applied, display it with a remove option */}
      {codes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-blue-700">Gift Card Applied</span>
              <div className="text-sm text-blue-600 font-mono">{codes.join(', ')}</div>
            </div>
            <UpdateGiftCardForm>
              <button 
                type="submit"
                onClick={removeAppliedCode}
                className="text-blue-600 hover:text-blue-700 text-sm underline"
              >
                Remove
              </button>
            </UpdateGiftCardForm>
          </div>
        </div>
      )}

      {/* Show an input to apply a gift card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="space-y-2">
          <label htmlFor="giftCardCode" className="block text-sm font-medium text-gray-700">
            Gift Card Code
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="giftCardCode"
              name="giftCardCode"
              placeholder="Enter gift card code"
              ref={giftCardCodeInput}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   giftCardCodes?: string[];
 *   saveAppliedCode?: (code: string) => void;
 *   removeAppliedCode?: () => void;
 *   children: React.ReactNode;
 * }}
 */
function UpdateGiftCardForm({giftCardCodes, saveAppliedCode, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher?.formData?.get('giftCardCode');
        if (code && saveAppliedCode && typeof saveAppliedCode === 'function') {
          saveAppliedCode(code);
        }
        return children;
      }}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
