import { handleCors, jsonResponse } from '../_lib/cors.js';



/**
 * This endpoint is deprecated.
 * Session verification is now handled by Supabase Auth on the frontend.
 */
export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    return jsonResponse({
        message: 'This endpoint is deprecated. Use Supabase Auth for session verification.',
        deprecated: true,
        authenticated: false
    }, 410); // 410 Gone
}
