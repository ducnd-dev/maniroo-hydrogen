/**
 * Breadcrumb Structured Data Component
 * Generates JSON-LD structured data for breadcrumb navigation
 */

import {StructuredData} from './StructuredData';

export function BreadcrumbSchema({items}) {
  if (!items || items.length === 0) {
    return null;
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `https://maniroo.com${item.url}` : undefined,
    })),
  };

  return <StructuredData data={breadcrumbSchema} />;
}

/**
 * Breadcrumb Navigation Component
 */
export function Breadcrumb({items}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <BreadcrumbSchema items={items} />      {items.map((item) => (
        <div key={`breadcrumb-${item.name}-${item.url || 'current'}`} className="flex items-center space-x-2">
          {item.url !== items[0].url && (
            <svg
              className="w-3 h-3 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {item.url ? (
            <a
              href={item.url}
              className="hover:text-orange-500 transition-colors"
            >
              {item.name}
            </a>
          ) : (
            <span className="text-gray-800 font-medium">{item.name}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
