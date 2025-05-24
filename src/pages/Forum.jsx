import { useState, useEffect } from 'react';
import { forumApi } from '../services/api';
import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns';

export default function Forum() {
  const { user } = useUser();
  const [forums, setForums] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    const loadForums = async () => {
      try {
        setLoading(true);
        const response = await forumApi.getForums();
        setForums(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch forums. Please ensure the backend is running and accessible.');
        console.error('Error fetching forums:', err);
      } finally {
        setLoading(false);
      }
    };

    loadForums();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleNewTopicClick = (forum) => {
    setSelectedForum(forum);
    setIsModalOpen(true);
  };

  const handleGlobalNewTopicClick = () => {
    // Select the first forum by default for global new topic, if forums exist
    if (forums.length > 0) {
      setSelectedForum(forums[0]);
      setIsModalOpen(true);
    } else {
      setError('Cannot create a new topic: No forums available.');
    }
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (!selectedForum) {
      setError('Cannot submit topic: No forum selected.');
      return;
    }
    if (!user) {
      setError('Cannot submit topic: User not authenticated.');
      return;
    }

    try {
      const topicData = {
        ...newTopic,
        author: user.id // Use Clerk user ID as author
      };
      await forumApi.createTopic(selectedForum._id, topicData);
      // Refresh the forums list after successful topic creation
      const response = await forumApi.getForums();
      setForums(response.data);

      setIsModalOpen(false);
      setNewTopic({ title: '', content: '' });
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to create topic. Please check your input and try again.');
      console.error('Error creating topic:', err);
    }
  };

  const filteredForums = forums.filter(forum => {
    if (filter === 'all') return true;
    return forum.type.toLowerCase() === filter.toLowerCase();
  });

  const renderLastActivity = (topics) => {
    if (!topics || topics.length === 0) return 'No activity';
    // Find the most recent topic
    const latestTopic = topics.reduce((latest, topic) => {
      return new Date(topic.createdAt) > new Date(latest.createdAt) ? topic : latest;
    }, topics[0]);

    // If the latest topic has posts, find the most recent post
    if (latestTopic.posts && latestTopic.posts.length > 0) {
      const latestPost = latestTopic.posts.reduce((latest, post) => {
         return new Date(post.createdAt) > new Date(latest.createdAt) ? post : latest;
      }, latestTopic.posts[0]);
       return format(new Date(latestPost.createdAt), 'MMM d, yyyy, h:mm a');
    }
    // Otherwise, use the topic creation date
    return format(new Date(latestTopic.createdAt), 'MMM d, yyyy, h:mm a');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center mb-4">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Forum</h1>
          <p className="mt-2 text-sm text-gray-700">
            Discussion board with intra-department, inter-department, and public forum sections.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleGlobalNewTopicClick}
            disabled={forums.length === 0}
            className={`inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto ${ forums.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            New Topic
          </button>
          {forums.length === 0 && !loading && !error && (
            <div className="text-xs text-gray-500 mt-1">No forums available. Please add a forum in the database.</div>
          )}
           {error && (
            <div className="text-sm text-red-600 mt-2">{error}</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All Forums
        </button>
        <button
          onClick={() => setFilter('intra')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'intra' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Intra-Department
        </button>
        <button
          onClick={() => setFilter('inter')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'inter' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Inter-Department
        </button>
        <button
          onClick={() => setFilter('public')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'public' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Public
        </button>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Forum
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Topics
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Posts
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Activity
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredForums.map((forum) => (
                    <tr key={forum._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{forum.name}</div>
                        <div className="text-gray-500">{forum.description}</div>
                        {forum.type === 'Intra' && forum.department && (
                          <div className="mt-1 text-xs text-gray-500">
                            Department: {forum.department.name}
                          </div>
                        )}
                        {forum.type === 'Inter' && forum.departments && (
                          <div className="mt-1 text-xs text-gray-500">
                            Departments: {forum.departments.map(d => d.name).join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          forum.type === 'Intra' ? 'bg-blue-100 text-blue-800' :
                          forum.type === 'Inter' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {forum.type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {forum.topics ? forum.topics.length : 0}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {forum.topics ? forum.topics.reduce((total, topic) => total + (topic.posts ? topic.posts.length : 0), 0) : 0}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {renderLastActivity(forum.topics)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleNewTopicClick(forum)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          New Topic<span className="sr-only">, {forum.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* New Topic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">
              New Topic for {selectedForum?.name}
            </h2>
            <form onSubmit={handleTopicSubmit}>
               <div className="mb-4">
                <label htmlFor="forum" className="block text-sm font-medium text-gray-700">
                  Forum
                </label>
                {/* Display selected forum name, prevent changing in this modal */}
                 <p className="mt-1 text-sm text-gray-900">{selectedForum?.name}</p>
               </div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  value={newTopic.content}
                  onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 