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
                .from('video_sections')
                .select('*')
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') {
                return errorResponse('Failed to fetch video data', 500);
            }

            return jsonResponse({
                success: true,
                data: data || {}
            });
        } catch (error) {
            return errorResponse('Internal server error', 500);
        }
    }

    if (request.method === 'PUT') {
        const authenticated = await isAuthenticated(request);
        if (!authenticated) return errorResponse('Unauthorized', 401);

        try {
            const body = await request.json();

            const fields = {
                subtitle: body.subtitle,
                description: body.description,
                video_url: body.video_url,
                cover_image_url: body.cover_image_url,
                updated_at: new Date().toISOString()
            };

            const { data: existing } = await supabaseAdmin.from('video_sections').select('id').limit(1).single();

            let query = supabaseAdmin.from('video_sections');
            if (existing) {
                query = query.update(fields).eq('id', existing.id);
            } else {
                query = query.insert(fields);
            }

            const { data, error } = await query.select().single();

            if (error) return errorResponse('Failed to update video section', 500);

            return jsonResponse({ success: true, data });
        } catch (error) { return errorResponse('Internal server error', 500); }
    }

    return errorResponse('Method not allowed', 405);
}
