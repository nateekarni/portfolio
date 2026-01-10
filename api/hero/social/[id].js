import { supabaseAdmin } from '../../../_lib/supabase.js';
import { isAuthenticated } from '../../../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../../../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    const authenticated = await isAuthenticated(request);
    if (!authenticated) return errorResponse('Unauthorized', 401);

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) return errorResponse('ID required', 400);

    if (request.method === 'PUT') {
        try {
            const body = await request.json();

            const updates = {
                platform: body.platform,
                url: body.url,
                icon: body.icon,
                display_order: body.display_order
            };

            const { data, error } = await supabaseAdmin
                .from('social_links')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating social link:', error);
                return errorResponse('Failed to update social link', 500);
            }

            return jsonResponse({
                success: true,
                message: 'Social link updated',
                data
            });

        } catch (error) {
            console.error('Social PUT error:', error);
            return errorResponse('Internal server error', 500);
        }
    }

    if (request.method === 'DELETE') {
        try {
            const { error } = await supabaseAdmin
                .from('social_links')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting social link:', error);
                return errorResponse('Failed to delete social link', 500);
            }

            return jsonResponse({
                success: true,
                message: 'Social link deleted'
            });

        } catch (error) {
            console.error('Social DELETE error:', error);
            return errorResponse('Internal server error', 500);
        }
    }

    return errorResponse('Method not allowed', 405);
}
