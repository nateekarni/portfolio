import { supabasePublic, supabaseAdmin } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method === 'GET') {
        try {
            const { data, error } = await supabasePublic
                .from('contact_items')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) return errorResponse('Failed to fetch contact items', 500);

            return jsonResponse({ success: true, data: data || [] });
        } catch (error) { return errorResponse('Internal server error', 500); }
    }

    if (request.method === 'POST') {
        const authenticated = await isAuthenticated(request);
        if (!authenticated) return errorResponse('Unauthorized', 401);

        try {
            const body = await request.json();
            const { data, error } = await supabaseAdmin.from('contact_items').insert(body).select().single();
            if (error) return errorResponse('Failed to add contact item', 500);
            return jsonResponse({ success: true, data }, 201);
        } catch (error) { return errorResponse('Internal server error', 500); }
    }

    return errorResponse('Method not allowed', 405);
}
