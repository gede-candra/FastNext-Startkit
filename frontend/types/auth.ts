export type Role = {
  id: number;
  name: string;
  description?: string | null;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role_id: number;
  role: Role;
};

export type ProfileUpdatePayload = {
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
};

export type LoginResponse = {
  user: AuthUser;
};
