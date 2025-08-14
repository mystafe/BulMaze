// Admin users configuration
export interface AdminUser {
  email: string;
  name: string;
  privileges: string[];
}

// List of admin users
export const ADMIN_USERS: AdminUser[] = [
  {
    email: 'admin@wordmaster.com',
    name: 'System Administrator',
    privileges: ['assessment_length', 'user_management', 'content_management'],
  },
  {
    email: 'mustafa@wordmaster.com',
    name: 'Mustafa Evleksiz',
    privileges: ['assessment_length', 'content_management'],
  },
  {
    email: 'demo@wordmaster.com',
    name: 'Demo Admin',
    privileges: ['assessment_length'],
  },
];

// Helper function to check if a user is admin
export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_USERS.some(admin => admin.email === email);
}

// Helper function to get admin user details
export function getAdminUser(email: string): AdminUser | null {
  return ADMIN_USERS.find(admin => admin.email === email) || null;
}

// Helper function to check if user has specific privilege
export function hasPrivilege(email: string | null | undefined, privilege: string): boolean {
  if (!email) return false;
  const adminUser = getAdminUser(email);
  return adminUser?.privileges.includes(privilege) || false;
}
