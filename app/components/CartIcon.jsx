import { useState } from 'react';

/**
 * Modern Cart Icon Component with multiple variations
 */

export function CartIcon({ variant = 'bag', className = "w-5 h-5", ...props }) {
  const baseClass = `${className} text-gray-700`;
  
  switch (variant) {
    case 'bag':
      return (
        <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} {...props}>
          {/* Modern shopping bag */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      );
      
    case 'basket':
      return (
        <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} {...props}>
          {/* Shopping basket */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      );
      
    case 'modern':
      return (
        <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} {...props}>
          {/* Ultra modern design */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 1-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m8.25 4.5V16.5a1.5 1.5 0 0 1 3 0v2.25m-3 0h3m-3 0h-3m-3 0a1.5 1.5 0 0 1 3 0m-3 0v-3.375a1.125 1.125 0 0 1 1.125-1.125h9.75a1.125 1.125 0 0 1 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H6.375a1.125 1.125 0 0 1-1.125-1.125V15.75a1.125 1.125 0 0 1 1.125-1.125Z" />
        </svg>
      );
      
    case 'filled':
      return (
        <svg className={baseClass} fill="currentColor" viewBox="0 0 24 24" {...props}>
          {/* Filled shopping bag */}
          <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
        </svg>
      );
      
    default:
      return (
        <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      );
  }
}

/**
 * Animated Cart Icon with hover effects
 */
export function AnimatedCartIcon({ count, className = "w-5 h-5" }) {
  return (
    <div className="relative">
      <svg 
        className={`${className} text-gray-700 transition-all duration-200 hover:text-orange-500 hover:scale-110 ${count > 0 ? 'cart-pulse' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
        
        {/* Handle details */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 10.5h.375a.375.375 0 0 1 .375.375v.375m4.5-1.125h.375a.375.375 0 0 1 .375.375v.375m-3.375 0V9.375a1.125 1.125 0 0 1 2.25 0v1.5" />
        
        {/* Animated dots for items when cart has items */}
        {count > 0 && (
          <>
            <circle cx="9.5" cy="15" r="0.5" fill="currentColor" className="animate-pulse" />
            <circle cx="14.5" cy="15" r="0.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.2s'}} />
            {count > 2 && (
              <circle cx="12" cy="13.5" r="0.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.4s'}} />
            )}
          </>
        )}
      </svg>
      
      {/* Enhanced animated badge */}
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 cart-badge-gradient text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold text-shadow cart-bounce">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}

/**
 * Interactive Cart Icon with click effects
 */
export function InteractiveCartIcon({ count, onClick, className = "w-5 h-5" }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
    if (onClick) onClick(e);
  };

  return (
    <div className="relative">
      <svg 
        className={`${className} text-gray-700 transition-all duration-200 hover:text-orange-500 cursor-pointer
          ${isClicked ? 'cart-shake' : ''}
          ${count > 0 ? 'text-orange-600' : ''}
        `}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5}
        onClick={handleClick}
      >
        {/* Main bag */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
        
        {/* Handle details for realism */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 10.5a.375.375 0 0 1 .375-.375h.75a.375.375 0 0 1 .375.375m5.25 0a.375.375 0 0 1 .375-.375h.75a.375.375 0 0 1 .375.375" />
        
        {/* Items representation */}
        {count > 0 && (
          <g className="animate-pulse">
            <rect x="9" y="13" width="6" height="2" rx="1" fill="currentColor" opacity="0.3" />
            {count > 1 && <rect x="10" y="15.5" width="4" height="1.5" rx="0.75" fill="currentColor" opacity="0.2" />}
          </g>
        )}
      </svg>
      
      {/* Premium badge with glow effect */}
      {count !== null && count > 0 && (
        <span className={`absolute -top-1 -right-1 cart-badge-gradient text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold 
          ${isClicked ? 'cart-bounce' : 'animate-pulse'}
          shadow-lg
        `}>
          {count > 99 ? '99+' : count}
        </span>
      )}
      
      {/* Click effect ripple */}
      {isClicked && (
        <div className="absolute inset-0 rounded-full bg-orange-500 opacity-20 animate-ping"></div>
      )}
    </div>
  );
}
