import { supabaseAdmin } from './supabase.js';

/**
 * Verify Supabase JWT token from Authorization header
 * Returns user object if valid, null otherwise
 */
export async function verifySupabaseToken(request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);

    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            console.error('Token verification failed:', error?.message);
            return null;
        }

        return user;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}

/**
 * Middleware to check if request is authenticated via Supabase token
 * Returns true if authenticated, false otherwise
 */
export async function isAuthenticated(request) {
    const user = await verifySupabaseToken(request);
    return user !== null;
}

/**
 * Get authenticated user from request
 * Returns user object or null
 */
export async function getAuthenticatedUser(request) {
    return await verifySupabaseToken(request);
}
