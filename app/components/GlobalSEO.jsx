/**
 * Global SEO Component
 * This component provides base SEO functionality that can be used across all pages
 */

import {generateStructuredData} from '~/lib/seo';
import {StructuredData} from './StructuredData';

export function GlobalSEO({children}) {
  // Global structured data that appears on every page
  const organizationSchema = generateStructuredData({}, 'Organization');
  const websiteSchema = generateStructuredData({}, 'WebSite');

  return (
    <>
      {/* Global structured data */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      
      {/* Page-specific content */}
      {children}
    </>
  );
}
