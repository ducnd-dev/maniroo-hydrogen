import {useOutletContext, Link} from 'react-router';

export default function AccountDashboard() {
  const {customer} = useOutletContext();
  
  const dashboardCards = [
    {
      title: 'Recent Orders',
      description: 'View and track your latest purchases',
      link: '/account/orders',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Profile Settings',
      description: 'Update your personal information',
      link: '/account/profile',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Address Book',
      description: 'Manage shipping and billing addresses',
      link: '/account/addresses',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Account Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your account settings and view your order history
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="block group"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Account Info */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Account Information
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Name:</span> {customer?.firstName} {customer?.lastName}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {customer?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Member since:</span> {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <Link
            to="/account/profile"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/collections/all"
            className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-200 hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium text-gray-700">Shop Now</span>
          </Link>
          
          <Link
            to="/search"
            className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-200 hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-medium text-gray-700">Search Products</span>
          </Link>
          
          <Link
            to="/contact"
            className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-200 hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-medium text-gray-700">Contact Us</span>
          </Link>
          
          <Link
            to="/cart"
            className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-200 hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span className="font-medium text-gray-700">View Cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
