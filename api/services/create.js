import { supabaseAdmin } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method !== 'POST') {
        return errorResponse('Method not allowed', 405);
    }

    // Check authentication
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const body = await request.json();

        // Validate required fields
        if (!body.title) {
            return errorResponse('Title is required', 400);
        }

        // Prepare service data
        const serviceData = {
            title: body.title,
            description: body.description || '',
            icon: body.icon || 'Globe',
            category: body.category || 'main',
            items: body.items || [],
            gallery: body.gallery || [],
            pricing: body.pricing || [],
            display_order: body.display_order || 0,
            is_active: body.is_active !== false
        };

        const { data, error } = await supabaseAdmin
            .from('services')
            .insert(serviceData)
            .select()
            .single();

        if (error) {
            console.error('Error creating service:', error);
            return errorResponse('Failed to create service', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Service created successfully',
            data
        }, 201);

    } catch (error) {
        console.error('Create service error:', error);
        return errorResponse('Internal server error', 500);
    }
}
