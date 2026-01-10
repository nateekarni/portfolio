import { parseCookies, deleteSession, clearSessionCookie, SESSION_COOKIE_NAME } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method !== 'POST') {
        return errorResponse('Method not allowed', 405);
    }

    try {
        // Get session token from cookie
        const cookies = parseCookies(request.headers.get('cookie'));
        const sessionToken = cookies[SESSION_COOKIE_NAME];

        // Delete session from database
        if (sessionToken) {
            await deleteSession(sessionToken);
        }

        // Clear the session cookie
        const clearCookie = clearSessionCookie();

        return jsonResponse(
            { success: true, message: 'Logged out successfully' },
            200,
            { 'Set-Cookie': clearCookie }
        );

    } catch (error) {
        console.error('Logout error:', error);
        return errorResponse('Internal server error', 500);
    }
}
