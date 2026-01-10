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
                .from('site_settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') {
                 console.error('Fetch settings error:', error);
                 // Don't error out, just return defaults if table missing/empty
            }

            // Return defaults if no data found
            const settings = data || {
                site_name: 'Portfolio',
                logo_text: 'Portfolio',
                site_description: 'Personal Portfolio Website'
            };

            return jsonResponse({
                success: true,
                data: settings
            });
        } catch (error) {
            return errorResponse('Internal Server Error', 500);
        }
    }

    if (request.method === 'PUT') {
        const authenticated = await isAuthenticated(request);
        if (!authenticated) {
            return errorResponse('Unauthorized', 401);
        }

        try {
            const body = await request.json();
            
            // Check if row exists
            const { data: existing } = await supabasePublic
                .from('site_settings')
                .select('id')
                .single();

            let result;
            if (existing) {
                result = await supabaseAdmin
                    .from('site_settings')
                    .update({
                        ...body,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', 1)
                    .select()
                    .single();
            } else {
                result = await supabaseAdmin
                    .from('site_settings')
                    .insert([{ 
                        id: 1, 
                        ...body 
                    }])
                    .select()
                    .single();
            }

            if (result.error) throw result.error;

            return jsonResponse({
                success: true,
                data: result.data
            });

        } catch (error) {
            console.error('Update settings error:', error);
            return errorResponse(error.message, 500);
        }
    }

    return errorResponse('Method not allowed', 405);
}
