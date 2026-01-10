import { supabaseAdmin } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method !== 'POST') {
        return errorResponse('Method not allowed', 405);
    }

    const authenticated = await isAuthenticated(request);
    if (!authenticated) return errorResponse('Unauthorized', 401);

    try {
        const body = await request.json();

        if (!body.platform || !body.url) {
            return errorResponse('Platform and URL are required', 400);
        }

        const newLink = {
            platform: body.platform,
            url: body.url,
            icon: body.icon || 'Globe',
            display_order: body.display_order || 0
        };

        const { data, error } = await supabaseAdmin
            .from('social_links')
            .insert(newLink)
            .select()
            .single();

        if (error) {
            console.error('Error adding social link:', error);
            return errorResponse('Failed to add social link', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Social link added',
            data
        }, 201);

    } catch (error) {
        console.error('Social POST error:', error);
        return errorResponse('Internal server error', 500);
    }
}
