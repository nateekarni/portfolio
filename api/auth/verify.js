import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method !== 'GET') {
        return errorResponse('Method not allowed', 405);
    }

    try {
        const authenticated = await isAuthenticated(request);

        return jsonResponse({
            authenticated,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Verify error:', error);
        return errorResponse('Internal server error', 500);
    }
}
