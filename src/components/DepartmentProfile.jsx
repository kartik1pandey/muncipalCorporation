import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function DepartmentProfile({ department }) {
  const { can } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', name: 'Department Info' },
    { id: 'employees', name: 'Employees' },
    { id: 'projects', name: 'Projects' },
    { id: 'resources', name: 'Resources' },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Department Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {department.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {department.description}
            </p>
          </div>
          {can('departments', 'edit') && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Department
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-5 sm:p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Department Details</h4>
              <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{department.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Head of Department</dt>
                  <dd className="mt-1 text-sm text-gray-900">{department.head}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Established</dt>
                  <dd className="mt-1 text-sm text-gray-900">{department.established}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900">{department.contact}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">About</h4>
              <p className="mt-2 text-sm text-gray-900">{department.about}</p>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-500">Department Employees</h4>
              {can('departments', 'edit') && (
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Employee
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {department.employees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white shadow rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{employee.name}</h5>
                      <p className="text-sm text-gray-500">{employee.position}</p>
                      <p className="text-xs text-gray-400">{employee.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-500">Department Projects</h4>
              {can('projects', 'create') && (
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  New Project
                </button>
              )}
            </div>
            <div className="space-y-4">
              {department.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white shadow rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{project.name}</h5>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>Start: {project.startDate}</span>
                    <span className="mx-2">•</span>
                    <span>End: {project.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-500">Available Resources</h4>
              {can('resources', 'create') && (
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Resource
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {department.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white shadow rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{resource.name}</h5>
                      <p className="text-sm text-gray-500">{resource.type}</p>
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
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Location: {resource.location}</p>
                    <p>Last Updated: {resource.lastUpdated}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 