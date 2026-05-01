export interface LoginResponse {
  message: string;
  result?: {
    username: string;
    // Add other fields as needed, like token
  };
}

export interface AuthData {
  username: string;
  password?: string;
}
