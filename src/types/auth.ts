export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  headline?: string;
  customDomain?: string;
  isPro?: boolean;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isDemoMode: boolean;
  error: string | null;
}
