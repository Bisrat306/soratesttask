// Using fetch API instead of axios since we're having package installation issues
// Set NEXT_PUBLIC_API_BASE_URL in your .env file to override the default
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper function to handle API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (email: string, password?: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(password ? { email, password } : { email }),
    })
    if (!response.ok) throw new Error("Login failed")
    return response.json()
  },

  verifyPassword: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/verify-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error("Password verification failed")
    return response.json()
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: getAuthHeader(),
    })
    if (!response.ok) throw new Error("Failed to get profile")
    return response.json()
  },
}

// Folders API
export const foldersApi = {
  createFolder: async (name: string, parentId?: string) => {
    const response = await fetch(`${API_URL}/folders`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, parentId }),
    })
    if (!response.ok) throw new Error("Failed to create folder")
    return response.json()
  },

  listFolders: async (parentId?: string) => {
    const url = new URL(`${API_URL}/folders`)
    if (parentId) url.searchParams.append("parentId", parentId)

    const response = await fetch(url.toString(), {
      headers: getAuthHeader(),
    })
    if (!response.ok) throw new Error("Failed to list folders")
    return response.json()
  },

  getFolder: async (id: string) => {
    const response = await fetch(`${API_URL}/folders/${id}`, {
      headers: getAuthHeader(),
    })
    if (!response.ok) throw new Error("Failed to get folder")
    return response.json()
  },

  updateFolder: async (id: string, data: { name: string }) => {
    const response = await fetch(`${API_URL}/folders/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update folder")
    return response.json()
  },

  deleteFolder: async (id: string) => {
    const response = await fetch(`${API_URL}/folders/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    })
    if (!response.ok) throw new Error("Failed to delete folder")
    return response.json()
  },

  renameFolder: async (id: string, newName: string) => {
    return foldersApi.updateFolder(id, { name: newName })
  },
}

// Files API
export const filesApi = {
  uploadFile: async (file: File, folderId?: string) => {
    const formData = new FormData()
    formData.append("file", file)
    if (folderId) formData.append("folderId", folderId)

    const response = await fetch(`${API_URL}/files/upload`, {
      method: "POST",
      headers: getAuthHeader(),
      body: formData,
    })
    if (!response.ok) throw new Error("Upload failed")
    return response.json()
  },

  listFiles: async (folderId?: string) => {
    const url = new URL(`${API_URL}/files`)
    if (folderId) url.searchParams.append("folderId", folderId)

    const response = await fetch(url.toString(), {
      headers: getAuthHeader(),
    })
    if (!response.ok) throw new Error("Failed to list files")
    return response.json()
  },

  getFile: async (id: string) => {
    const response = await fetch(`${API_URL}/files/${id}`, {
      headers: getAuthHeader(),
    })
    if (!response.ok) throw new Error("Failed to get file")
    return response.json()
  },

  getFilePreview: async (id: string) => {
    const response = await fetch(`${API_URL}/files/${id}/preview`, {
      headers: getAuthHeader(),
    })
    if (!response.ok) throw new Error("Failed to get file preview")
    return response.json()
  },

  downloadFile: async (id: string) => {
    const response = await fetch(`${API_URL}/files/${id}/download`, {
      headers: getAuthHeader(),
    })
    if (!response.ok) throw new Error("Failed to download file")
    return response.blob()
  },

  deleteFile: async (id: string) => {
    const response = await fetch(`${API_URL}/files/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    })
    if (!response.ok) throw new Error("Failed to delete file")
    return response.json()
  },

  renameFile: async (id: string, newName: string) => {
    return filesApi.updateFile(id, { name: newName })
  },

  updateFile: async (id: string, data: { name: string }) => {
    const response = await fetch(`${API_URL}/files/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update file")
    return response.json()
  },
}

export const usersApi = {
  register: async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Registration failed")
    return response.json()
  },
} 