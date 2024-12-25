export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'editor' | 'admin' | 'super_admin';
}

export interface AuthError {
  code: string;
  message: string;
  status?: number;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: AuthError | null;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthError | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegistrationData extends AuthCredentials {
  name: string;
  role?: AuthUser['role'];
}