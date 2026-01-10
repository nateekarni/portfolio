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
            // Fetch about section
            const { data: aboutData } = await supabasePublic
                .from('about_sections')
                .select('*')
                .limit(1)
                .single();

            // Fetch stats
            const { data: stats } = await supabasePublic
                .from('about_stats')
                .select('*')
                .order('display_order', { ascending: true });

            // Fetch certifications
            const { data: certs } = await supabasePublic
                .from('certifications')
                .select('*')
                .order('date', { ascending: false });

            return jsonResponse({
                success: true,
                data: {
                    ...(aboutData || {}),
                    about_stats: stats || [],
                    certifications: certs || []
                }
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

            const aboutFields = {
                title: body.title,
                description_1: body.description_1,
                description_2: body.description_2
            };

            const { data: existing } = await supabaseAdmin.from('about_sections').select('id').limit(1).single();

            let query = supabaseAdmin.from('about_sections');
            if (existing) {
                query = query.update(aboutFields).eq('id', existing.id);
            } else {
                query = query.insert(aboutFields);
            }

            const { data, error } = await query.select().single();

            if (error) {
                return errorResponse('Failed to update about data', 500);
            }

            return jsonResponse({
                success: true,
                message: 'About section updated',
                data
            });

        } catch (error) {
            return errorResponse('Internal server error', 500);
        }
    }

    return errorResponse('Method not allowed', 405);
}
