import { supabasePublic } from '../_lib/supabase.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';



export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method !== 'GET') {
        return errorResponse('Method not allowed', 405);
    }

    try {
        // Check if Supabase client is available
        if (!supabasePublic) {
            console.warn('Supabase client not available - returning empty data');
            return jsonResponse({
                success: true,
                data: [],
                count: 0
            });
        }

        // Get query parameters
        const url = new URL(request.url);
        const category = url.searchParams.get('category'); // 'main' or 'other'
        const includeInactive = url.searchParams.get('includeInactive') === 'true';

        // Build query
        let query = supabasePublic
            .from('services')
            .select('*')
            .order('display_order', { ascending: true });

        // Filter by category if specified
        if (category) {
            query = query.eq('category', category);
        }

        // Only include active services for public requests
        if (!includeInactive) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching services:', error);
            return errorResponse('Failed to fetch services', 500);
        }

        return jsonResponse({
            success: true,
            data: data || [],
            count: data?.length || 0
        });

    } catch (error) {
        console.error('Services error:', error);
        return errorResponse('Internal server error', 500);
    }
}
