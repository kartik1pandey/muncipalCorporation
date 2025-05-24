import React from 'react';
import { Link } from 'react-router-dom';

const onlineServices = [
  'Pay Property Tax',
  'New Water Connection',
  'File Tracking System',
  'Asset Transfer',
  'E-Tendering / Procurement',
  'Attendance',
  'RTI',
  'Citizen Facilities',
  'D2D Vehicle Tracking',
  'Air Quality Index',
  'Health Department',
  'Water Meter Billing',
  'Water Quality Index',
];

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-');
};

const OnlineServices = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Online Services</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {onlineServices.map((service, index) => (
              <li key={index}>
                <Link to={`/online-services/${slugify(service)}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {service}
                      </p>
                      {/* You can add a link or button here later */}
                      {/* <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Access
                        </span>
                      </div> */}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OnlineServices; 