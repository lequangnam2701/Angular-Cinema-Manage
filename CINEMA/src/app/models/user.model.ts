
export interface User {
  id: number;
  username: string;
  email: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  roleName: 'ROLE_USER'
  password?: string; 
}

export interface UpdateUserRequest {
  id: number;
  username: string;
  email: string;
  roleName: string;
}


export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: User | User[];
}


export interface UserSearchParams {
  keyword?: string;
  roleName?: string;
  page?: number;
  limit?: number;
}


export interface PaginatedUserResponse {
  users: User[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}