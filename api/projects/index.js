import { supabasePublic } from '../_lib/supabase.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method !== 'GET') {
        return errorResponse('Method not allowed', 405);
    }

    try {
        // Get query parameters
        const url = new URL(request.url);
        const category = url.searchParams.get('category');
        const featured = url.searchParams.get('featured');
        const limit = url.searchParams.get('limit');
        const includeInactive = url.searchParams.get('includeInactive') === 'true';

        // Build query
        let query = supabasePublic
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });

        // Filter by category if specified
        if (category) {
            query = query.eq('category', category);
        }

        // Filter by featured if specified
        if (featured === 'true') {
            query = query.eq('is_featured', true);
        }

        // Only include active projects for public requests
        if (!includeInactive) {
            query = query.eq('is_active', true);
        }

        // Limit results if specified
        if (limit) {
            query = query.limit(parseInt(limit, 10));
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching projects:', error);
            return errorResponse('Failed to fetch projects', 500);
        }

        return jsonResponse({
            success: true,
            data: data || [],
            count: data?.length || 0
        });

    } catch (error) {
        console.error('Projects error:', error);
        return errorResponse('Internal server error', 500);
    }
}
