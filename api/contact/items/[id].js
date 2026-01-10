import { supabaseAdmin } from '../../_lib/supabase.js';
import { isAuthenticated } from '../../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    const authenticated = await isAuthenticated(request);
    if (!authenticated) return errorResponse('Unauthorized', 401);

    const id = new URL(request.url).pathname.split('/').pop();

    if (request.method === 'PUT') {
        try {
            const body = await request.json();
            const { data, error } = await supabaseAdmin.from('contact_items').update(body).eq('id', id).select().single();
            if (error) return errorResponse('Failed to update item', 500);
            return jsonResponse({ success: true, data });
        } catch (error) { return errorResponse('Internal server error', 500); }
    }

    if (request.method === 'DELETE') {
        try {
            const { error } = await supabaseAdmin.from('contact_items').delete().eq('id', id);
            if (error) return errorResponse('Failed to delete item', 500);
            return jsonResponse({ success: true });
        } catch (error) { return errorResponse('Internal server error', 500); }
    }

    return errorResponse('Method not allowed', 405);
}
