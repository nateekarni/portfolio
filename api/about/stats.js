import { supabaseAdmin } from '../../_lib/supabase.js';
import { isAuthenticated } from '../../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method !== 'POST') return errorResponse('Method not allowed', 405);

    const authenticated = await isAuthenticated(request);
    if (!authenticated) return errorResponse('Unauthorized', 401);

    try {
        const body = await request.json();

        const newStat = {
            label: body.label,
            value: body.value,
            display_order: body.display_order || 0
        };

        const { data, error } = await supabaseAdmin.from('about_stats').insert(newStat).select().single();

        if (error) return errorResponse('Failed to add stat', 500);

        return jsonResponse({ success: true, data }, 201);
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
}
