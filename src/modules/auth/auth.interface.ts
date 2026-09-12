export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export interface verifyEmailPayload {
  email: string;
  otp: string;
  type: string;
}
