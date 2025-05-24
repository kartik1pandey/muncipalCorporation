import React from 'react';
import { useParams } from 'react-router-dom';

const ServiceDetail = () => {
  const { serviceSlug } = useParams();

  // You can use serviceSlug to fetch actual service details from an API later
  // For now, we'll just display the slug.
  const formatSlug = (slug) => {
    return slug
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">{formatSlug(serviceSlug)}</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
          <p className="text-gray-700">Details for {formatSlug(serviceSlug)} will be displayed here.</p>
          {/* Add specific content and functionality for each service here */}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail; 