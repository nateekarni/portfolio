import { validateSecretToken, createSession, createSessionCookie } from '../_lib/auth.js';
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
        const { token } = await request.json();

        if (!token) {
            return errorResponse('Token is required', 400);
        }

        // Validate the secret token
        if (!validateSecretToken(token)) {
            return errorResponse('Invalid token', 401);
        }

        // Create a new session
        const session = await createSession();
        if (!session) {
            return errorResponse('Failed to create session', 500);
        }

        // Create response with session cookie
        const cookie = createSessionCookie(session.sessionToken, session.expiresAt);

        return jsonResponse(
            {
                success: true,
                message: 'Login successful',
                expiresAt: session.expiresAt.toISOString()
            },
            200,
            { 'Set-Cookie': cookie }
        );

    } catch (error) {
        console.error('Login error:', error);
        return errorResponse('Internal server error', 500);
    }
}
