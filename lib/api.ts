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
  title: string;
  description: string;
  category: string;
  location: string;
  locationName: string;
  date: string;
  status: string;
  photoUrls?: string[];
  images?: string[];
  reporterName?: string;
  reward?: number;
  rewardAmount?: number;
  createdAt: string;
  reportedBy?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
}

export interface LostReportResponse extends Report {
  lostAt: string;
}

export interface FoundReportResponse extends Report {
  foundAt: string;
  foundCondition?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Helper to get auth token (from Clerk or fallback to legacy)
async function getAuthToken(): Promise<string | null> {
  // Try to get Clerk token if available
  if (typeof window !== 'undefined' && (window as any).__clerk_session_token) {
    return (window as any).__clerk_session_token;
  }
  
  // Fallback to localStorage for legacy auth
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Helper to set auth token (legacy)
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

// Set Clerk session token (called from ClerkProvider)
export function setClerkToken(token: string) {
  if (typeof window !== 'undefined') {
    (window as any).__clerk_session_token = token;
  }
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  customToken?: string | null
): Promise<T> {
  const token = customToken !== undefined ? customToken : await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorData = await response.json();
      
      // Check if this is a "User not found" error
      if (errorData.errors && errorData.errors.some((err: any) => 
        err.message && err.message.includes('User not found'))) {
        // Clear the invalid token and redirect to login
        clearAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        errorMessage = 'Session expired. Please login again.';
      } else if (errorData.errors && errorData.errors.length > 0) {
        errorMessage = errorData.errors[0].message;
      }
    } catch (e) {
      // If JSON parsing fails, try to get text
      try {
        errorMessage = await response.text();
      } catch (textError) {
        // Keep the default error message
      }
    }
    
    throw new Error(errorMessage);
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
  create: (data: LostReportRequest, token?: string | null) =>
    apiFetch<Report>('/lost-reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getAll: (page = 1, size = 10, search = '', category = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: size.toString(),
      ...(search && { q: search }),
      ...(category && { category }),
    });
    return apiFetch<PageResponse<LostReportResponse>>(`/lost-reports?${params}`);
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
  create: (data: FoundReportRequest, token?: string | null) =>
    apiFetch<Report>('/found-reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getAll: (page = 1, size = 10, search = '', category = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: size.toString(),
      ...(search && { q: search }),
      ...(category && { category }),
    });
    return apiFetch<PageResponse<FoundReportResponse>>(`/found-reports?${params}`);
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
      pageSize: size.toString(),
      statusFilter,
    });
    return apiFetch<PageResponse<any>>(`/quests?${params}`);
  },

  start: (id: string, token?: string | null) =>
    apiFetch<any>(`/quests/${id}/start`, {
      method: 'POST',
    }, token),

  complete: (id: string, token?: string | null) =>
    apiFetch<any>(`/quests/${id}/complete`, {
      method: 'POST',
    }, token),
};

// Leaderboard API
export const leaderboardAPI = {
  getTop: (page = 1, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: size.toString(),
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

// Claims API
export const claimsAPI = {
  // Create a claim for a lost item
  create: (lostReportId: string, foundReportId: string | null, message: string) =>
    apiFetch<any>('/claims', {
      method: 'POST',
      body: JSON.stringify({
        lost_report_id: lostReportId,
        found_report_id: foundReportId,
        message,
      }),
    }),

  // Get all claims for a specific lost report (owner only)
  getForLostReport: (lostReportId: string) =>
    apiFetch<any[]>(`/claims/lost-report/${lostReportId}`),

  // Get user's own claims (as a claimer/finder)
  getMyClaims: () => apiFetch<any[]>('/claims/my-claims'),

  // Get claims for user's lost items (as owner)
  getMyLostItemsClaims: () => apiFetch<any[]>('/claims/my-lost-items'),

  // Get a specific claim by ID
  getById: (claimId: string) => apiFetch<any>(`/claims/${claimId}`),

  // Approve a claim (owner only)
  approve: (claimId: string, response: string) =>
    apiFetch<any>(`/claims/${claimId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    }),

  // Reject a claim (owner only)
  reject: (claimId: string, response: string) =>
    apiFetch<any>(`/claims/${claimId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    }),

  // Complete claim and release reward (owner only)
  complete: (claimId: string) =>
    apiFetch<any>(`/claims/${claimId}/complete`, {
      method: 'POST',
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
