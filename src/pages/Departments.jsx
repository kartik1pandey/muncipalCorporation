import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import DepartmentProfile from '../components/DepartmentProfile';
import ProjectCoordination from '../components/ProjectCoordination';
import MeetingScheduler from '../components/MeetingScheduler';

// Mock data - replace with actual API calls
const mockDepartments = [
  {
    id: 1,
    name: 'Engineering Department',
    description: 'Handles all engineering and technical operations',
    location: 'Building A, Floor 3',
    head: 'Dr. Sarah Johnson',
    established: '2020-01-15',
    contact: {
      email: 'engineering@company.com',
      phone: '+1 (555) 123-4567'
    },
    employees: [
      { id: 1, name: 'John Smith', role: 'Lead Developer' },
      { id: 2, name: 'Emily Brown', role: 'Project Manager' }
    ],
    projects: [
      {
        id: 1,
        title: 'System Modernization',
        description: 'Upgrading legacy systems to modern architecture',
        status: 'ongoing',
        startDate: '2024-03-01',
        endDate: '2024-08-31',
        location: 'Data Center A'
      },
      {
        id: 2,
        title: 'Cloud Migration',
        description: 'Moving infrastructure to cloud platform',
        status: 'planned',
        startDate: '2024-06-01',
        endDate: '2024-12-31',
        location: 'Data Center B'
      }
    ],
    resources: [
      {
        id: 1,
        name: 'Development Lab',
        description: 'High-performance computing environment',
        status: 'available',
        location: 'Building A, Room 301',
        lastUpdated: '2024-03-15',
        specifications: '20 workstations, 2 servers'
      },
      {
        id: 2,
        name: 'High-Performance Computing Cluster',
        description: 'Computing resources for complex simulations',
        status: 'in_use',
        location: 'Building A, Room 302',
        lastUpdated: '2024-03-14',
        specifications: '100 cores, 500GB RAM'
      }
    ]
  },
  {
    id: 2,
    name: 'IT Department',
    description: 'Manages IT infrastructure and support',
    location: 'Building B, Floor 2',
    head: 'Michael Chen',
    established: '2019-06-01',
    contact: {
      email: 'it@company.com',
      phone: '+1 (555) 234-5678'
    },
    employees: [
      { id: 3, name: 'David Wilson', role: 'System Administrator' },
      { id: 4, name: 'Lisa Anderson', role: 'Network Engineer' }
    ],
    projects: [
      {
        id: 3,
        title: 'Network Upgrade',
        description: 'Upgrading network infrastructure',
        status: 'ongoing',
        startDate: '2024-04-01',
        endDate: '2024-07-31',
        location: 'Data Center A'
      }
    ],
    resources: [
      {
        id: 3,
        name: 'Network Operations Center',
        description: '24/7 network monitoring facility',
        status: 'available',
        location: 'Building B, Room 201',
        lastUpdated: '2024-03-15',
        specifications: '10 monitoring stations'
      }
    ]
  }
];

export default function Departments() {
  const { can } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState('departments');

  const tabs = [
    { id: 'departments', name: 'Departments' },
    { id: 'coordination', name: 'Project Coordination' },
    { id: 'meetings', name: 'Meetings' }
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage departments, coordinate projects, and schedule meetings
            </p>
          </div>
          {can('departments', 'create') && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Department
            </button>
          )}
        </div>

        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'departments' && (
              <>
                {selectedDepartment ? (
                  <DepartmentProfile
                    department={selectedDepartment}
                    onBack={() => setSelectedDepartment(null)}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {mockDepartments.map((department) => (
                      <div
                        key={department.id}
                        className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedDepartment(department)}
                      >
                        <h3 className="text-lg font-medium text-gray-900">
                          {department.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {department.description}
                        </p>
                        <div className="mt-4">
                          <div className="text-sm">
                            <span className="font-medium">Location:</span>{' '}
                            {department.location}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Head:</span>{' '}
                            {department.head}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'coordination' && (
              <ProjectCoordination
                projects={mockDepartments.flatMap(dept => dept.projects)}
                departments={mockDepartments}
              />
            )}

            {activeTab === 'meetings' && (
              <MeetingScheduler
                departments={mockDepartments}
                projects={mockDepartments.flatMap(dept => dept.projects)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 