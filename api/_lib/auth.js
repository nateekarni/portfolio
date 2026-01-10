import { supabaseAdmin } from './supabase.js';

const SESSION_COOKIE_NAME = 'admin_session';

/**
 * Parse cookies from request headers
 */
export function parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.trim().split('=');
        cookies[name] = rest.join('=');
    });

    return cookies;
}

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

// Legacy session functions (kept for backward compatibility during migration)

/**
 * Validate session token from cookie (legacy)
 */
export async function validateSession(sessionToken) {
    if (!sessionToken) return false;

    const { data, error } = await supabaseAdmin
        .from('admin_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

    if (error || !data) {
        return false;
    }

    return true;
}

/**
 * Delete session (logout) - legacy
 */
export async function deleteSession(sessionToken) {
    if (!sessionToken) return;

    await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken);
}

/**
 * Create cookie to clear session
 */
export function clearSessionCookie() {
    return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export { SESSION_COOKIE_NAME };
