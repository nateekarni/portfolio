/**
 * CORS headers configuration
 */
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};

/**
 * Handle CORS preflight requests
 */
export function handleCors(request) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: corsHeaders
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
