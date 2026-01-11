/**
 * CORS headers configuration
 * Note: Access-Control-Allow-Origin is handled dynamically in handleCors and api/index.js
 */
export const corsHeaders = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};

/**
 * Check if origin is allowed
 */
export function isAllowedOrigin(origin) {
    if (!origin) return false;
    // Allow localhost for development
    if (origin.match(/^http:\/\/localhost:\d+$/)) return true;
    // Allow Vercel deployments (subdomains)
    if (origin.endsWith('.vercel.app')) return true;
    // Allow Custom Domain (Configured via env if needed)
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return true;
    
    return false;
}

/**
 * Handle CORS preflight requests
 */
export function handleCors(request) {
    if (request.method === 'OPTIONS') {
        const origin = request.headers.get('Origin');
        const headers = { ...corsHeaders };
        
        if (isAllowedOrigin(origin)) {
            headers['Access-Control-Allow-Origin'] = origin;
        }

        return new Response(null, {
            status: 204,
            headers
        });
    }
    return null;
}

/**
 * Add CORS headers to response
 */
export function withCors(response) {
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
    });

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
}

/**
 * Create JSON response with CORS headers
 */
export function jsonResponse(data, status = 200, additionalHeaders = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...additionalHeaders
        }
    });
}

/**
 * Create error response with CORS headers
 */
export function errorResponse(message, status = 500) {
    return jsonResponse({ error: message }, status);
}
