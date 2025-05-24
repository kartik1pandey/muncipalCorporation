export const ROLES = {
  ADMIN: 'admin',
  DEPARTMENT_ADMIN: 'department_admin',
  OFFICER: 'officer',
  PROJECT_MANAGER: 'project_manager',
  TECHNICAL_EXPERT: 'technical_expert',
  PUBLIC_VIEWER: 'public_viewer'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    name: 'System Administrator',
    permissions: {
      departments: ['view', 'create', 'edit', 'delete', 'manage'],
      projects: ['view', 'create', 'edit', 'delete', 'manage'],
      resources: ['view', 'create', 'edit', 'delete', 'manage'],
      schedule: ['view', 'create', 'edit', 'delete', 'manage'],
      forum: ['view', 'create', 'edit', 'delete', 'moderate', 'manage'],
      users: ['view', 'create', 'edit', 'delete', 'manage'],
      admin: ['view', 'manage']
    }
  },
  [ROLES.DEPARTMENT_ADMIN]: {
    name: 'Department Admin',
    permissions: {
      departments: ['view', 'create', 'edit', 'delete'],
      projects: ['view', 'create', 'edit', 'delete'],
      resources: ['view', 'create', 'edit', 'delete'],
      schedule: ['view', 'create', 'edit', 'delete'],
      forum: ['view', 'create', 'edit', 'delete', 'moderate'],
      users: ['view', 'create', 'edit', 'delete']
    }
  },
  [ROLES.OFFICER]: {
    name: 'Officer/Engineer',
    permissions: {
      departments: ['view'],
      projects: ['view', 'create', 'edit'],
      resources: ['view', 'create'],
      schedule: ['view', 'create', 'edit'],
      forum: ['view', 'create', 'edit'],
      users: ['view']
    }
  },
  [ROLES.PROJECT_MANAGER]: {
    name: 'Project Manager',
    permissions: {
      departments: ['view'],
      projects: ['view', 'create', 'edit', 'delete'],
      resources: ['view', 'create', 'edit'],
      schedule: ['view', 'create', 'edit', 'delete'],
      forum: ['view', 'create', 'edit'],
      users: ['view']
    }
  },
  [ROLES.TECHNICAL_EXPERT]: {
    name: 'Technical Expert',
    permissions: {
      departments: ['view'],
      projects: ['view', 'create', 'edit'],
      resources: ['view', 'create', 'edit'],
      schedule: ['view', 'create'],
      forum: ['view', 'create', 'edit'],
      users: ['view']
    }
  },
  [ROLES.PUBLIC_VIEWER]: {
    name: 'Public Viewer',
    permissions: {
      departments: ['view'],
      projects: ['view'],
      resources: ['view'],
      schedule: ['view'],
      forum: ['view'],
      users: []
    }
  }
};

export const hasPermission = (userRole, resource, action) => {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) return false;
  return ROLE_PERMISSIONS[userRole].permissions[resource]?.includes(action) || false;
};

export const getRoleName = (role) => {
  return ROLE_PERMISSIONS[role]?.name || 'Unknown Role';
}; 