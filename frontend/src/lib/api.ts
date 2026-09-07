import axios from 'axios';

// Axios Instance Configuration
// We create a pre-configured HTTP client targeting our local .NET Minimal API.
// Centralizing this allows us to easily add interceptors (e.g., for JWT tokens) in the future.
export const api = axios.create({
    baseURL: 'http://localhost:5041/api',
    headers: {
        'Content-Type': 'application/json',
    },
});