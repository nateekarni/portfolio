/**
 * API Service Layer
 * Handles all API calls to the backend
 */

import { supabase } from '../lib/supabase';

const API_BASE = '/api';

/**
 * Get current Supabase session token
 */
async function getAuthToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
}

/**
 * Generic fetch wrapper with error handling
 * Automatically includes Supabase auth token for authenticated requests
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add auth token if available
    const token = await getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        // If not JSON, get text and try to parse as JSON
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch {
            // If can't parse as JSON, create error object
            data = { 
                error: text || 'Unknown error',
                status: response.status,
                statusText: response.statusText
            };
        }
    }

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

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

    getConfig: async () => apiFetch('/services/config'),
    updateConfig: async (data) => apiFetch('/services/config', { method: 'PUT', body: JSON.stringify(data) }),

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

    getConfig: async () => apiFetch('/projects/config'),
    updateConfig: async (data) => apiFetch('/projects/config', { method: 'PUT', body: JSON.stringify(data) }),

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

    getConfig: async () => apiFetch('/contact/config'),
    updateConfig: async (data) => apiFetch('/contact/config', { method: 'PUT', body: JSON.stringify(data) }),

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

// =============================================
// Hero API
// =============================================

export const heroAPI = {
    get: async () => apiFetch('/hero'),
    update: async (data) => apiFetch('/hero', { method: 'PUT', body: JSON.stringify(data) }),
    addSocialLink: async (data) => apiFetch('/hero/social', { method: 'POST', body: JSON.stringify(data) }),
    updateSocialLink: async (id, data) => apiFetch(`/hero/social/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSocialLink: async (id) => apiFetch(`/hero/social/${id}`, { method: 'DELETE' }),
};

// =============================================
// About API
// =============================================

export const aboutAPI = {
    get: async () => apiFetch('/about'),
    update: async (data) => apiFetch('/about', { method: 'PUT', body: JSON.stringify(data) }),

    // Stats
    addStat: async (data) => apiFetch('/about/stats', { method: 'POST', body: JSON.stringify(data) }),
    updateStat: async (id, data) => apiFetch(`/about/stats/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteStat: async (id) => apiFetch(`/about/stats/${id}`, { method: 'DELETE' }),

    // Certifications
    addCert: async (data) => apiFetch('/about/certs', { method: 'POST', body: JSON.stringify(data) }),
    updateCert: async (id, data) => apiFetch(`/about/certs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCert: async (id) => apiFetch(`/about/certs/${id}`, { method: 'DELETE' }),
};

// =============================================
// Video API
// =============================================

export const videoAPI = {
    get: async () => apiFetch('/video'),
    update: async (data) => apiFetch('/video', { method: 'PUT', body: JSON.stringify(data) }),
};

// =============================================
// Contact Items API (New dynamic list)
// =============================================

export const contactItemsAPI = {
    getAll: async () => apiFetch('/contact/items'),
    getConfig: async () => apiFetch('/contact/config'),
    updateConfig: async (data) => apiFetch('/contact/config', { method: 'PUT', body: JSON.stringify(data) }),
    add: async (data) => apiFetch('/contact/items', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => apiFetch(`/contact/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => apiFetch(`/contact/items/${id}`, { method: 'DELETE' }),
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
    services: servicesAPI,
    projects: projectsAPI,
    contact: contactAPI,
    messages: messagesAPI,
    hero: heroAPI,
    about: aboutAPI,
    video: videoAPI,
    contactItems: contactItemsAPI,
};
