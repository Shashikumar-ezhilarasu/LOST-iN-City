// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  karma: number;
  photoUrl?: string;
}

export interface LostReportRequest {
  title: string;
  description: string;
  category: string;
  lostAt: string; // ISO 8601 date-time string
  latitude: number;
  longitude: number;
  locationName?: string;
  images?: string[];
  tags?: string[];
  color?: string;
  brand?: string;
  rewardAmount?: number;
  visibility?: string;
}

export interface FoundReportRequest {
  title: string;
  description: string;
  category: string;
  foundAt: string; // ISO 8601 date-time string
  latitude: number;
  longitude: number;
  locationName?: string;
  images?: string[];
  tags?: string[];
  color?: string;
  brand?: string;
  foundCondition?: string;
  holdingInstructions?: string;
}

export interface Report {
  id: string;
  itemName: string;
  description: string;
  category: string;
  location: string;
  date: string;
  status: string;
  photoUrls?: string[];
  reporterName?: string;
  reward?: number;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Helper to get auth token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Helper to set auth token
export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

// Helper to clear auth token
export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: (data: RegisterRequest) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () => apiFetch<User>('/auth/me'),
};

// Lost Reports API
export const lostReportsAPI = {
  create: (data: LostReportRequest) =>
    apiFetch<Report>('/lost-reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (page = 1, size = 10, search = '', category = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
      ...(category && { category }),
    });
    return apiFetch<PageResponse<Report>>(`/lost-reports?${params}`);
  },

  getById: (id: string) => apiFetch<Report>(`/lost-reports/${id}`),

  updateStatus: (id: string, status: string) =>
    apiFetch<Report>(`/lost-reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/lost-reports/${id}`, {
      method: 'DELETE',
    }),
};

// Found Reports API
export const foundReportsAPI = {
  create: (data: FoundReportRequest) =>
    apiFetch<Report>('/found-reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (page = 1, size = 10, search = '', category = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
      ...(category && { category }),
    });
    return apiFetch<PageResponse<Report>>(`/found-reports?${params}`);
  },

  getById: (id: string) => apiFetch<Report>(`/found-reports/${id}`),

  updateStatus: (id: string, status: string) =>
    apiFetch<Report>(`/found-reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/found-reports/${id}`, {
      method: 'DELETE',
    }),
};

// Matches API
export const matchesAPI = {
  create: (lostReportId: string, foundReportId: string) =>
    apiFetch<any>('/matches', {
      method: 'POST',
      body: JSON.stringify({ lostReportId, foundReportId }),
    }),

  getUserMatches: () => apiFetch<any[]>('/matches/user'),

  accept: (id: string) =>
    apiFetch<any>(`/matches/${id}/accept`, {
      method: 'PATCH',
    }),

  reject: (id: string) =>
    apiFetch<any>(`/matches/${id}/reject`, {
      method: 'PATCH',
    }),
};

// Comments API
export const commentsAPI = {
  create: (reportType: string, reportId: string, content: string) =>
    apiFetch<any>('/comments', {
      method: 'POST',
      body: JSON.stringify({ reportType, reportId, content }),
    }),

  getByReport: (reportType: string, reportId: string) =>
    apiFetch<any[]>(`/comments/${reportType}/${reportId}`),
};

// Quests API
export const questsAPI = {
  getAll: (page = 1, size = 10, statusFilter = 'all') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      statusFilter,
    });
    return apiFetch<PageResponse<any>>(`/quests?${params}`);
  },

  start: (id: string) =>
    apiFetch<any>(`/quests/${id}/start`, {
      method: 'POST',
    }),

  complete: (id: string) =>
    apiFetch<any>(`/quests/${id}/complete`, {
      method: 'POST',
    }),
};

// Leaderboard API
export const leaderboardAPI = {
  getTop: (page = 1, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return apiFetch<PageResponse<User>>(`/leaderboard?${params}`);
  },
};

// User Profile API
export const userAPI = {
  getProfile: () => apiFetch<any>('/users/profile'),

  updateProfile: (data: Partial<User>) =>
    apiFetch<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Utility: Convert image to base64
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
