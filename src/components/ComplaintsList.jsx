import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, in-progress, resolved, rejected

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      if (response.data.success) {
        setComplaints(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch complaints');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const response = await api.patch(`/complaints/${complaintId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        // Update the complaint in the local state
        setComplaints(prevComplaints =>
          prevComplaints.map(complaint =>
            complaint._id === complaintId
              ? { ...complaint, status: newStatus }
              : complaint
          )
        );
      }
    } catch (err) {
      console.error('Error updating complaint status:', err);
      setError('Failed to update complaint status');
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    filter === 'all' ? true : complaint.status === filter
  );

  // Function to extract pothole detection info from description
  const extractPotholeInfo = (description) => {
    const potholeMatch = description.match(/Pothole Detected \(Confidence: (\d+\.\d+)%\)/);
    if (potholeMatch) {
      return { detected: true, confidence: parseFloat(potholeMatch[1]) };
    }
    const noPotholeMatch = description.includes('No Pothole Detected');
    if (noPotholeMatch) {
        return { detected: false, confidence: null };
    }
    return null;
  };

  if (loading) return <div className="text-center py-4">Loading complaints...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Complaints Management</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Complaints</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pothole
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => {
              const potholeInfo = complaint.category === 'roads' ? extractPotholeInfo(complaint.description) : null;
              return (
                <tr key={complaint._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                    <div className="text-sm text-gray-500">{complaint.description.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {complaint.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                      ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                      ${complaint.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {potholeInfo === null && complaint.category === 'roads' && 'N/A'}
                      {potholeInfo && potholeInfo.detected && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Detected ({potholeInfo.confidence.toFixed(2)}%)
                          </span>
                      )}
                       {potholeInfo && !potholeInfo.detected && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Not Detected
                          </span>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComplaintsList; 