/**
 * API Service Layer
 * Handles all API calls to the backend
 */

const API_BASE = '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

// =============================================
// Authentication API
// =============================================

export const authAPI = {
    /**
     * Login with secret token
     */
    login: async (token) => {
        return apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    },

    /**
     * Logout current session
     */
    logout: async () => {
        return apiFetch('/auth/logout', {
            method: 'POST',
        });
    },

    /**
     * Verify if current session is valid
     */
    verify: async () => {
        return apiFetch('/auth/verify');
    },
};

// =============================================
// Services API
// =============================================

export const servicesAPI = {
    /**
     * Get all services
     */
    getAll: async (options = {}) => {
        const params = new URLSearchParams();
        if (options.category) params.append('category', options.category);
        if (options.includeInactive) params.append('includeInactive', 'true');

        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch(`/services${query}`);
    },

    /**
     * Get single service by ID
     */
    getById: async (id) => {
        return apiFetch(`/services/${id}`);
    },

    /**
     * Create new service (requires auth)
     */
    create: async (serviceData) => {
        return apiFetch('/services/create', {
            method: 'POST',
            body: JSON.stringify(serviceData),
        });
    },

    /**
     * Update service (requires auth)
     */
    update: async (id, serviceData) => {
        return apiFetch(`/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(serviceData),
        });
    },

    /**
     * Delete service (requires auth)
     */
    delete: async (id) => {
        return apiFetch(`/services/${id}`, {
            method: 'DELETE',
        });
    },
};

// =============================================
// Projects API
// =============================================

export const projectsAPI = {
    /**
     * Get all projects
     */
    getAll: async (options = {}) => {
        const params = new URLSearchParams();
        if (options.category) params.append('category', options.category);
        if (options.featured) params.append('featured', 'true');
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.includeInactive) params.append('includeInactive', 'true');

        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch(`/projects${query}`);
    },

    /**
     * Get single project by ID
     */
    getById: async (id) => {
        return apiFetch(`/projects/${id}`);
    },

    /**
     * Create new project (requires auth)
     */
    create: async (projectData) => {
        return apiFetch('/projects/create', {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
    },

    /**
     * Update project (requires auth)
     */
    update: async (id, projectData) => {
        return apiFetch(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData),
        });
    },

    /**
     * Delete project (requires auth)
     */
    delete: async (id) => {
        return apiFetch(`/projects/${id}`, {
            method: 'DELETE',
        });
    },
};

// =============================================
// Contact API
// =============================================

export const contactAPI = {
    /**
     * Get contact info
     */
    getInfo: async () => {
        return apiFetch('/contact/info');
    },

    /**
     * Update contact info (requires auth)
     */
    updateInfo: async (contactData) => {
        return apiFetch('/contact/info', {
            method: 'PUT',
            body: JSON.stringify(contactData),
        });
    },

    /**
     * Send contact form message (public)
     */
    sendMessage: async (messageData) => {
        return apiFetch('/contact/messages', {
            method: 'POST',
            body: JSON.stringify(messageData),
        });
    },

    /**
     * Get all messages (requires auth)
     */
    getMessages: async (options = {}) => {
        const params = new URLSearchParams();
        if (options.unread) params.append('unread', 'true');
        if (options.limit) params.append('limit', options.limit.toString());

        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch(`/contact/messages${query}`);
    },
};

// =============================================
// Messages API
// =============================================

export const messagesAPI = {
    /**
     * Get single message (requires auth)
     */
    getById: async (id) => {
        return apiFetch(`/messages/${id}`);
    },

    /**
     * Mark message as read/unread (requires auth)
     */
    markAsRead: async (id, isRead = true) => {
        return apiFetch(`/messages/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ is_read: isRead }),
        });
    },

    /**
     * Delete message (requires auth)
     */
    delete: async (id) => {
        return apiFetch(`/messages/${id}`, {
            method: 'DELETE',
        });
    },
};

export default {
    auth: authAPI,
    services: servicesAPI,
    projects: projectsAPI,
    contact: contactAPI,
    messages: messagesAPI,
};
