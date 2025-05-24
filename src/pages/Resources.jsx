import { useState } from 'react';

// Mock data - replace with actual API call
const mockResources = [
  {
    id: 1,
    name: 'Conference Room A',
    type: 'Physical',
    status: 'Available',
    department: 'All',
    capacity: 20,
    location: 'Floor 1',
    schedule: '9:00 AM - 6:00 PM'
  },
  {
    id: 2,
    name: 'Development Server',
    type: 'Technical',
    status: 'In Use',
    department: 'Engineering',
    specs: '16 CPU, 64GB RAM',
    location: 'Data Center',
    schedule: '24/7'
  },
  {
    id: 3,
    name: 'Video Equipment',
    type: 'Physical',
    status: 'Available',
    department: 'Marketing',
    items: 'Cameras, Microphones, Lighting',
    location: 'Media Room',
    schedule: 'On Request'
  }
];

export default function Resources() {
  const [resources] = useState(mockResources);
  const [filter, setFilter] = useState('all');

  const filteredResources = resources.filter(resource => {
    if (filter === 'all') return true;
    return resource.type.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Resources</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track shared technical and physical resources across departments.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Resource
          </button>
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'all'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('physical')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'physical'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Physical
        </button>
        <button
          onClick={() => setFilter('technical')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'technical'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Technical
        </button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{resource.type}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{resource.name}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  <p className="mb-2">
                    <span className="font-medium">Department:</span> {resource.department}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Location:</span> {resource.location}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Schedule:</span> {resource.schedule}
                  </p>
                  {resource.type === 'Physical' && resource.capacity && (
                    <p className="mb-2">
                      <span className="font-medium">Capacity:</span> {resource.capacity} people
                    </p>
                  )}
                  {resource.type === 'Technical' && resource.specs && (
                    <p className="mb-2">
                      <span className="font-medium">Specifications:</span> {resource.specs}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    resource.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {resource.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href={`/resources/${resource.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                  View details
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 