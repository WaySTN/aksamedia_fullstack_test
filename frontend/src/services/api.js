const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to get auth token
const getToken = () => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
        try {
            const parsed = JSON.parse(authData);
            return parsed?.token || null;
        } catch {
            return null;
        }
    }
    return null;
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();

    const headers = {
        'Accept': 'application/json',
        ...options.headers,
    };

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    // Handle 401 - redirect to login
    if (response.status === 401) {
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
        throw new Error('Unauthenticated');
    }

    return response;
};

// Auth API
export const authApi = {
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        return { response, data };
    },

    logout: async () => {
        const response = await fetchWithAuth('/logout', {
            method: 'POST',
        });

        const data = await response.json();
        return { response, data };
    },

    updateProfile: async (userData) => {
        const response = await fetchWithAuth('/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        return { response, data };
    },
};

// Divisions API
export const divisionsApi = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/divisions${queryString ? `?${queryString}` : ''}`;

        const response = await fetchWithAuth(url);
        const data = await response.json();
        return { response, data };
    },
};

// Employees API
export const employeesApi = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/employees${queryString ? `?${queryString}` : ''}`;

        const response = await fetchWithAuth(url);
        const data = await response.json();
        return { response, data };
    },

    create: async (formData) => {
        const response = await fetchWithAuth('/employees', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return { response, data };
    },

    update: async (id, formData) => {
        // Laravel doesn't support PUT with FormData, use POST with _method
        formData.append('_method', 'PUT');

        const response = await fetchWithAuth(`/employees/${id}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return { response, data };
    },

    delete: async (id) => {
        const response = await fetchWithAuth(`/employees/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        return { response, data };
    },
};

export default {
    auth: authApi,
    divisions: divisionsApi,
    employees: employeesApi,
};
