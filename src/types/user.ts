
// User role types
export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_PROVIDER';

// User interface
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roles: UserRole[];
}

// Registration data interface
export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: UserRole[];
}
