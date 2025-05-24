import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import ComplaintsList from '../components/ComplaintsList';

export default function Reports() {
  const { user, can } = useAuth();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: format(new Date().setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [activeTab, setActiveTab] = useState('complaints');

  // Mock data for reports
  const reports = {
    overview: {
      title: 'System Overview',
      metrics: [
        { name: 'Total Projects', value: 12, change: '+2', changeType: 'increase' },
        { name: 'Active Resources', value: 45, change: '-5', changeType: 'decrease' },
        { name: 'Department Utilization', value: '78%', change: '+3%', changeType: 'increase' },
        { name: 'Task Completion Rate', value: '92%', change: '+5%', changeType: 'increase' }
      ]
    },
    projects: {
      title: 'Project Performance',
      metrics: [
        { name: 'On-Time Delivery', value: '85%', change: '+2%', changeType: 'increase' },
        { name: 'Budget Adherence', value: '92%', change: '-1%', changeType: 'decrease' },
        { name: 'Resource Efficiency', value: '88%', change: '+4%', changeType: 'increase' },
        { name: 'Quality Score', value: '94%', change: '+3%', changeType: 'increase' }
      ]
    },
    resources: {
      title: 'Resource Utilization',
      metrics: [
        { name: 'Equipment Usage', value: '76%', change: '+5%', changeType: 'increase' },
        { name: 'Personnel Allocation', value: '82%', change: '-2%', changeType: 'decrease' },
        { name: 'Resource Availability', value: '68%', change: '+4%', changeType: 'increase' },
        { name: 'Maintenance Schedule', value: '91%', change: '+1%', changeType: 'increase' }
      ]
    },
    departments: {
      title: 'Department Analytics',
      metrics: [
        { name: 'Cross-Department Collaboration', value: '72%', change: '+6%', changeType: 'increase' },
        { name: 'Resource Sharing', value: '65%', change: '+3%', changeType: 'increase' },
        { name: 'Project Coordination', value: '88%', change: '+2%', changeType: 'increase' },
        { name: 'Communication Score', value: '85%', change: '+4%', changeType: 'increase' }
      ]
    }
  };

  const reportTypes = [
    { id: 'overview', name: 'System Overview' },
    { id: 'projects', name: 'Project Performance' },
    { id: 'resources', name: 'Resource Utilization' },
    { id: 'departments', name: 'Department Analytics' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('complaints')}
              className={`${
                activeTab === 'complaints'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Complaints
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`${
                activeTab === 'other'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Other Reports
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'complaints' ? (
          <ComplaintsList />
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Other Reports</h2>
            <p className="text-gray-600">Other reports will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
} 