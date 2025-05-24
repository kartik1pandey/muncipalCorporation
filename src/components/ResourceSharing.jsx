import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function ResourceSharing({ resources }) {
  const { can } = useAuth();
  const [filter, setFilter] = useState('all');

  const filteredResources = resources.filter(resource => {
    if (filter === 'all') return true;
    return resource.type === filter;
  });

  const resourceTypes = [
    { id: 'all', name: 'All Resources' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'software', name: 'Software' },
    { id: 'expertise', name: 'Technical Expertise' },
    { id: 'facility', name: 'Facilities' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {resourceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === type.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
        {can('resources', 'create') && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Resource
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white shadow rounded-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{resource.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{resource.description}</p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  resource.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {resource.status}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Type:</span>
                <span className="ml-2">{resource.type}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Location:</span>
                <span className="ml-2">{resource.location}</span>
              </div>
              {resource.specifications && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">Specifications</h4>
                  <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
                    {resource.specifications.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              {can('resources', 'edit') && (
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
              )}
              {resource.status === 'available' && (
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 