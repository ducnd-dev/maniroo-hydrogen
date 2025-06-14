import {data as remixData} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {generateMeta} from '~/lib/seo';

export const meta = () => {
  return generateMeta({
    title: 'My Account - Manage Your Profile & Orders',
    description: 'Manage your account, view order history, update profile information and addresses.',
    keywords: ['account', 'profile', 'orders', 'customer'],
    type: 'website'
  });
};

export function shouldRevalidate() {
  return true;
}

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  /** @type {LoaderReturnData} */
  const {customer} = useLoaderData();

  const firstName = customer?.firstName || 'Guest';
  const email = customer?.email || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Account Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome back, {firstName}!
                </h1>
                <p className="text-gray-600 mt-1">{email}</p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="hidden md:flex space-x-3">
              <NavLink
                to="/account/orders"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Orders
              </NavLink>
              <NavLink
                to="/account/profile"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Edit Profile
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <AccountMenu />
          </div>
          
          {/* Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Outlet context={{customer}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const menuItems = [
    { 
      to: '/account/orders', 
      label: 'Order History', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z" />
        </svg>
      ),
      description: 'View and track your orders'
    },
    { 
      to: '/account/profile', 
      label: 'Profile Settings', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Manage your personal information'
    },
    { 
      to: '/account/addresses', 
      label: 'Addresses', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'Manage shipping and billing addresses'
    }
  ];

  return (
    <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Account Menu</h2>
      </div>
      
      <div className="p-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({isActive}) => `
              flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
              }
            `}
          >
            <span className={`flex-shrink-0 transition-colors group-hover:text-orange-500`}>
              {item.icon}
            </span>
            <div>
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 group-hover:text-gray-600">
                {item.description}
              </div>
            </div>
          </NavLink>
        ))}
        
        {/* Logout Section */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <Logout />
        </div>
      </div>
    </nav>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout">
      <button 
        type="submit"
        className="flex items-center space-x-3 w-full p-4 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <div>
          <div className="font-medium">Sign Out</div>
          <div className="text-sm text-gray-500 group-hover:text-red-600">
            End your session
          </div>
        </div>
      </button>
    </Form>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
