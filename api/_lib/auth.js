import { supabaseAdmin } from './supabase.js';

const ADMIN_SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN;
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
 * Validate the secret token for initial login
 */
export function validateSecretToken(token) {
    if (!ADMIN_SECRET_TOKEN) {
        console.error('ADMIN_SECRET_TOKEN not configured');
        return false;
    }
    return token === ADMIN_SECRET_TOKEN;
}

/**
 * Create a new session and return session token
 */
export async function createSession() {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const { error } = await supabaseAdmin
        .from('admin_sessions')
        .insert({
            session_token: sessionToken,
            expires_at: expiresAt.toISOString()
        });

    if (error) {
        console.error('Error creating session:', error);
        return null;
    }

    return { sessionToken, expiresAt };
}

/**
 * Validate session token from cookie
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
 * Delete session (logout)
 */
export async function deleteSession(sessionToken) {
    if (!sessionToken) return;

    await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken);
}

/**
 * Middleware to check if request is authenticated
 * Returns true if authenticated, false otherwise
 */
export async function isAuthenticated(request) {
    const cookies = parseCookies(request.headers.get('cookie'));
    const sessionToken = cookies[SESSION_COOKIE_NAME];

    return await validateSession(sessionToken);
}

/**
 * Create session cookie string
 */
export function createSessionCookie(sessionToken, expiresAt) {
    const isProduction = process.env.NODE_ENV === 'production';

    return `${SESSION_COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; ${isProduction ? 'Secure; ' : ''}Expires=${expiresAt.toUTCString()}`;
}

/**
 * Create cookie to clear session
 */
export function clearSessionCookie() {
    return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export { SESSION_COOKIE_NAME };
