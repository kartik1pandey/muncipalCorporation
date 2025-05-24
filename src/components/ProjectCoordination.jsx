import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../contexts/NotificationContext';
import { format } from 'date-fns';

export default function ProjectCoordination({ projects = [], departments = [] }) {
  const { can } = useAuth();
  const { addNotification } = useNotifications();
  const [conflicts, setConflicts] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const [agreements, setAgreements] = useState([]);
  const [previousConflicts, setPreviousConflicts] = useState(new Set());

  // Detect conflicts between projects
  useEffect(() => {
    const detectedConflicts = [];
    projects.forEach((project1, index) => {
      projects.slice(index + 1).forEach(project2 => {
        if (project1.location === project2.location) {
          const dateOverlap = checkDateOverlap(
            project1.startDate,
            project1.endDate,
            project2.startDate,
            project2.endDate
          );
          
          if (dateOverlap) {
            const conflictId = `${project1.id}-${project2.id}`;
            detectedConflicts.push({
              id: conflictId,
              project1,
              project2,
              location: project1.location,
              overlapPeriod: dateOverlap
            });

            // Notify about new conflicts
            if (!previousConflicts.has(conflictId)) {
              addNotification({
                type: 'warning',
                title: 'Project Conflict Detected',
                message: `Location conflict between "${project1.title}" and "${project2.title}" at ${project1.location}`,
                timestamp: new Date().toISOString(),
                persistent: true,
                action: {
                  label: 'View Details',
                  onClick: () => handleCreateAgreement({
                    id: conflictId,
                    project1,
                    project2,
                    location: project1.location,
                    overlapPeriod: dateOverlap
                  }),
                  closeOnClick: false
                }
              });
            }
          }
        }
      });
    });

    // Update previous conflicts
    setPreviousConflicts(new Set(detectedConflicts.map(c => c.id)));
    setConflicts(detectedConflicts);
  }, [projects, addNotification, previousConflicts]);

  const checkDateOverlap = (start1, end1, start2, end2) => {
    const startDate1 = new Date(start1);
    const endDate1 = new Date(end1);
    const startDate2 = new Date(start2);
    const endDate2 = new Date(end2);

    if (startDate1 <= endDate2 && startDate2 <= endDate1) {
      return {
        start: new Date(Math.max(startDate1, startDate2)),
        end: new Date(Math.min(endDate1, endDate2))
      };
    }
    return null;
  };

  const handleCreateAgreement = (conflict) => {
    setSelectedConflict(conflict);
    setShowAgreementForm(true);
  };

  const handleAgreementSubmit = (agreementData) => {
    const newAgreement = {
      id: Date.now(),
      ...agreementData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setAgreements([...agreements, newAgreement]);
    setShowAgreementForm(false);
    setSelectedConflict(null);

    // Notify about new agreement
    addNotification({
      type: 'success',
      title: 'Agreement Created',
      message: `New agreement "${agreementData.title}" has been created to resolve the conflict`,
      timestamp: new Date().toISOString(),
      persistent: false
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Interdepartmental Project Coordination
        </h2>

        {/* Conflict Detection Section */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Detected Conflicts
          </h3>
          {conflicts.length > 0 ? (
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Location Conflict: {conflict.location}
                      </h4>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Project 1:</span>{' '}
                          {conflict.project1.title} ({conflict.project1.department})
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Project 2:</span>{' '}
                          {conflict.project2.title} ({conflict.project2.department})
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Overlap Period:</span>{' '}
                          {format(new Date(conflict.overlapPeriod.start), 'MMM d, yyyy')} -{' '}
                          {format(new Date(conflict.overlapPeriod.end), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    {can('projects', 'coordinate') && (
                      <button
                        onClick={() => handleCreateAgreement(conflict)}
                        className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Create Agreement
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No conflicts detected</p>
          )}
        </div>

        {/* Agreements Section */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Project Agreements
          </h3>
          {agreements.length > 0 ? (
            <div className="space-y-4">
              {agreements.map((agreement) => (
                <div
                  key={agreement.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {agreement.title}
                      </h4>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm text-gray-500">
                          {agreement.description}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Status:</span>{' '}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            agreement.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : agreement.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {agreement.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {format(new Date(agreement.timestamp), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    {can('projects', 'coordinate') && (
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-800">
                          View Details
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-800">
                          Download MoU
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No agreements created yet</p>
          )}
        </div>
      </div>

      {/* Agreement Form Modal */}
      {showAgreementForm && selectedConflict && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create Project Agreement
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAgreementSubmit({
                title: formData.get('title'),
                description: formData.get('description'),
                type: formData.get('type'),
                projects: [selectedConflict.project1.id, selectedConflict.project2.id]
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Agreement Title
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Agreement Type
                  </label>
                  <select
                    name="type"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="unified_phasing">Unified Phasing</option>
                    <option value="joint_execution">Joint Execution</option>
                    <option value="cost_sharing">Cost Sharing</option>
                    <option value="resource_sharing">Resource Sharing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload MoU (Optional)
                  </label>
                  <input
                    type="file"
                    name="mou"
                    accept=".pdf,.doc,.docx"
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAgreementForm(false);
                    setSelectedConflict(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 