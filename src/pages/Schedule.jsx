import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import TaskManagement from '../components/TaskManagement';
import TaskForm from '../components/TaskForm';

// Mock data - replace with actual API calls
const mockTasks = [
  {
    id: 1,
    title: 'System Modernization Phase 1',
    description: 'Initial phase of system modernization project',
    department: 'Engineering Department',
    assignedTo: [
      { id: 1, name: 'John Smith', role: 'Lead Developer' },
      { id: 2, name: 'Emily Brown', role: 'Project Manager' }
    ],
    status: 'ongoing',
    priority: 'high',
    milestones: [
      {
        id: 1,
        title: 'Requirements Analysis',
        deadline: '2024-04-01'
      },
      {
        id: 2,
        title: 'System Design',
        deadline: '2024-05-15'
      }
    ],
    logs: [
      {
        id: 1,
        message: 'Project kickoff meeting completed',
        timestamp: '2024-03-15T10:00:00Z',
        user: 'Emily Brown'
      },
      {
        id: 2,
        message: 'Initial requirements gathered',
        timestamp: '2024-03-16T14:30:00Z',
        user: 'John Smith'
      }
    ]
  },
  {
    id: 2,
    title: 'Cloud Migration Planning',
    description: 'Planning phase for cloud infrastructure migration',
    department: 'IT Department',
    assignedTo: [
      { id: 3, name: 'David Wilson', role: 'Cloud Architect' }
    ],
    status: 'pending',
    priority: 'medium',
    milestones: [
      {
        id: 3,
        title: 'Infrastructure Assessment',
        deadline: '2024-04-15'
      }
    ],
    logs: [
      {
        id: 3,
        message: 'Task created',
        timestamp: '2024-03-17T09:00:00Z',
        user: 'System'
      }
    ]
  }
];

const mockDepartments = [
  { id: 1, name: 'Engineering Department' },
  { id: 2, name: 'IT Department' },
  { id: 3, name: 'Research & Development' }
];

export default function Schedule() {
  const { can } = useAuth();
  const [tasks, setTasks] = useState(mockTasks);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const handleTaskSubmit = (taskData) => {
    if (selectedTask) {
      // Update existing task
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === selectedTask.id ? { ...task, ...taskData } : task
        )
      );
    } else {
      // Create new task
      const newTask = {
        id: Date.now(),
        ...taskData,
        logs: [
          {
            id: Date.now(),
            message: 'Task created',
            timestamp: new Date().toISOString(),
            user: 'System'
          }
        ]
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    setShowTaskForm(false);
    setSelectedTask(null);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage tasks, track progress, and monitor deadlines
            </p>
          </div>
          {can('tasks', 'create') && (
            <button
              type="button"
              onClick={() => setShowTaskForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Task
            </button>
          )}
        </div>

        <div className="mt-6">
          {showTaskForm ? (
            <div className="bg-white shadow rounded-lg p-6">
              <TaskForm
                task={selectedTask}
                departments={mockDepartments}
                onSubmit={handleTaskSubmit}
                onCancel={() => {
                  setShowTaskForm(false);
                  setSelectedTask(null);
                }}
              />
            </div>
          ) : (
            <TaskManagement
              tasks={tasks}
              departments={mockDepartments}
              onTaskUpdate={handleTaskUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
} 