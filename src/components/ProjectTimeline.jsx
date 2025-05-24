import { useState } from 'react';

export default function ProjectTimeline({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const getDependencies = (projectId) => {
    return projects.filter(p => p.dependencies?.includes(projectId));
  };

  const getConflicts = (project) => {
    return projects.filter(p => 
      p.id !== project.id && 
      p.location.lat === project.location.lat && 
      p.location.lng === project.location.lng &&
      (
        (new Date(p.startDate) <= new Date(project.endDate) && 
         new Date(p.endDate) >= new Date(project.startDate))
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => {
          const dependencies = getDependencies(project.id);
          const conflicts = getConflicts(project);
          
          return (
            <div
              key={project.id}
              className={`bg-white shadow rounded-lg p-4 border ${
                conflicts.length > 0 ? 'border-red-200' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span>Start: {project.startDate}</span>
                  <span className="mx-2">•</span>
                  <span>End: {project.endDate}</span>
                </div>
              </div>

              {dependencies.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Dependencies</h4>
                  <ul className="mt-2 space-y-2">
                    {dependencies.map((dep) => (
                      <li key={dep.id} className="text-sm text-gray-500">
                        {dep.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {conflicts.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-red-700">Site Conflicts</h4>
                  <ul className="mt-2 space-y-2">
                    {conflicts.map((conflict) => (
                      <li key={conflict.id} className="text-sm text-red-500">
                        {conflict.name} ({conflict.startDate} - {conflict.endDate})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 