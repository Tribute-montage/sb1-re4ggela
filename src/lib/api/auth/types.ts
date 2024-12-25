export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'client' | 'admin';
  } | null;
  error: Error | null;
}

export interface AuthError extends Error {
  status?: number;
  code?: string;
}