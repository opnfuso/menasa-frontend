interface Metadata {
  lastSignInTime: string;
  creationTime: string;
  lastRefreshTime: string;
}

interface ProviderData {
  uid: string;
  providerId: string;
  phoneNumber: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  disabled: boolean;
  metadata: Metadata;
  passwordHash: string;
  passwordSalt: string;
  tokensValidAfterTime: string;
  providerData: ProviderData[];
}

export interface UserCreate {
  email: string;
  phoneNumber: string;
  displayName: string;
  password: string;
  photoURL: string;
}