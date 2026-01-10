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
            // Fetch hero section (assuming single row)
            const { data: heroData, error: heroError } = await supabasePublic
                .from('hero_sections')
                .select('*')
                .limit(1)
                .single();

            if (heroError && heroError.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
                console.error('Error fetching hero:', heroError);
                return errorResponse('Failed to fetch hero data', 500);
            }

            // Fetch social links
            const { data: socialLinks, error: socialError } = await supabasePublic
                .from('social_links')
                .select('*')
                .order('display_order', { ascending: true });

            if (socialError) {
                console.error('Error fetching social links:', socialError);
            }

            return jsonResponse({
                success: true,
                data: {
                    ...(heroData || {}),
                    social_links: socialLinks || []
                }
            });

        } catch (error) {
            console.error('Hero GET error:', error);
            return errorResponse('Internal server error', 500);
        }
    }

    if (request.method === 'PUT') {
        const authenticated = await isAuthenticated(request);
        if (!authenticated) return errorResponse('Unauthorized', 401);

        try {
            const body = await request.json();

            // Extract hero fields
            const heroFields = {
                greeting: body.greeting,
                name: body.name,
                role: body.role,
                status_text: body.status_text,
                hero_image_url: body.hero_image_url,
                hero_video_url: body.hero_video_url
            };

            // Upsert hero (always ID 1 or ensure single row)
            // Check if exists first
            const { data: existing } = await supabaseAdmin
                .from('hero_sections')
                .select('id')
                .limit(1)
                .single();

            let query = supabaseAdmin.from('hero_sections');

            if (existing) {
                query = query.update(heroFields).eq('id', existing.id);
            } else {
                query = query.insert(heroFields);
            }

            const { data, error } = await query.select().single();

            if (error) {
                console.error('Error updating hero:', error);
                return errorResponse('Failed to update hero data', 500);
            }

            return jsonResponse({
                success: true,
                message: 'Hero section updated',
                data
            });

        } catch (error) {
            console.error('Hero PUT error:', error);
            return errorResponse('Internal server error', 500);
        }
    }

    return errorResponse('Method not allowed', 405);
}
