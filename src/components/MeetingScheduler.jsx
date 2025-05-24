import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

export default function MeetingScheduler({ departments = [], projects = [] }) {
  const { can } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const handleCreateMeeting = (meetingData) => {
    const newMeeting = {
      id: Date.now(),
      ...meetingData,
      status: 'scheduled',
      attendees: [],
      createdAt: new Date().toISOString()
    };
    setMeetings([...meetings, newMeeting]);
    setShowMeetingForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Interdepartmental Meetings
          </h2>
          {can('meetings', 'create') && (
            <button
              onClick={() => setShowMeetingForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Schedule Meeting
            </button>
          )}
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      {meeting.title}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="text-sm text-gray-500">
                        {meeting.description}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Date:</span>{' '}
                        {format(new Date(meeting.date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Time:</span>{' '}
                        {format(new Date(meeting.date), 'h:mm a')}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Departments:</span>{' '}
                        {meeting.departments.join(', ')}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Projects:</span>{' '}
                        {meeting.projects.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-800">
                      View Details
                    </button>
                    {can('meetings', 'edit') && (
                      <button className="text-indigo-600 hover:text-indigo-800">
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No meetings scheduled</p>
          )}
        </div>
      </div>

      {/* Meeting Form Modal */}
      {showMeetingForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Schedule Interdepartmental Meeting
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleCreateMeeting({
                title: formData.get('title'),
                description: formData.get('description'),
                date: formData.get('date'),
                time: formData.get('time'),
                departments: selectedDepartments,
                projects: selectedProjects,
                type: formData.get('type')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Meeting Type
                  </label>
                  <select
                    name="type"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="project_coordination">Project Coordination</option>
                    <option value="resource_planning">Resource Planning</option>
                    <option value="status_update">Status Update</option>
                    <option value="planning">Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Departments
                  </label>
                  <div className="mt-2 space-y-2">
                    {departments.map((dept) => (
                      <label key={dept.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDepartments([...selectedDepartments, dept.id]);
                            } else {
                              setSelectedDepartments(
                                selectedDepartments.filter((id) => id !== dept.id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {dept.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Related Projects
                  </label>
                  <div className="mt-2 space-y-2">
                    {projects.map((project) => (
                      <label key={project.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProjects([...selectedProjects, project.id]);
                            } else {
                              setSelectedProjects(
                                selectedProjects.filter((id) => id !== project.id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {project.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMeetingForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 