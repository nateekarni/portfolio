import { supabasePublic, supabaseAdmin } from '../../_lib/supabase.js';
import { isAuthenticated } from '../../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../../_lib/cors.js';



export default async function handler(request) {
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method === 'GET') {
        try {
            const { data, error } = await supabasePublic.from('projects_sections').select('*').limit(1).single();
            if (error && error.code !== 'PGRST116') return errorResponse('Failed to fetch config', 500);
            return jsonResponse({ success: true, data: data || {} });
        } catch (error) { return errorResponse('Internal server error', 500); }
    }

    if (request.method === 'PUT') {
        const authenticated = await isAuthenticated(request);
        if (!authenticated) return errorResponse('Unauthorized', 401);
        try {
            const body = await request.json();
            const fields = { title: body.title, description: body.description };
            const { data: existing } = await supabaseAdmin.from('projects_sections').select('id').limit(1).single();
            let query = supabaseAdmin.from('projects_sections');
            if (existing) query = query.update(fields).eq('id', existing.id);
            else query = query.insert(fields);
            const { data, error } = await query.select().single();
            if (error) return errorResponse('Failed to update config', 500);
            return jsonResponse({ success: true, data });
        } catch (error) { return errorResponse('Internal server error', 500); }
    }
    return errorResponse('Method not allowed', 405);
}
