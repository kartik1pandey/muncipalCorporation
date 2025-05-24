import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

export default function TaskManagement({ tasks = [], departments = [], onTaskUpdate }) {
  const { can } = useAuth();
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800'
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleStatusChange = (taskId, newStatus) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { status: newStatus });
    }
  };

  const handleAddLog = (taskId, log) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { 
        logs: [...(tasks.find(t => t.id === taskId)?.logs || []), {
          id: Date.now(),
          message: log,
          timestamp: new Date().toISOString(),
          user: 'Current User' // Replace with actual user
        }]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {['all', 'pending', 'ongoing', 'completed', 'blocked'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === status
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        {can('tasks', 'create') && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white shadow rounded-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className={`rounded-md text-sm font-medium px-2.5 py-1 ${
                    statusColors[task.status]
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Assigned To</h4>
                <div className="mt-2 space-y-2">
                  {task.assignedTo.map((assignee) => (
                    <div key={assignee.id} className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">{assignee.name}</span>
                      <span className="mx-2">•</span>
                      <span>{assignee.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Department</h4>
                <p className="mt-2 text-sm text-gray-500">{task.department}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Milestones</h4>
              <div className="mt-2 space-y-2">
                {task.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-500">{milestone.title}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      new Date(milestone.deadline) < new Date()
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {format(new Date(milestone.deadline), 'MMM d, yyyy')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Update Log</h4>
              <div className="mt-2 space-y-2">
                {task.logs?.map((log) => (
                  <div key={log.id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{log.message}</span>
                      <span className="text-gray-400">
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">by {log.user}</span>
                  </div>
                ))}
              </div>
              {can('tasks', 'update') && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Add an update..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleAddLog(task.id, e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 