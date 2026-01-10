import { supabaseAdmin, supabasePublic } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';



export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    // Extract ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
        return errorResponse('Service ID is required', 400);
    }

    switch (request.method) {
        case 'GET':
            return handleGet(id);
        case 'PUT':
            return handlePut(request, id);
        case 'DELETE':
            return handleDelete(request, id);
        default:
            return errorResponse('Method not allowed', 405);
    }
}

// GET single service (public)
async function handleGet(id) {
    try {
        const { data, error } = await supabasePublic
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return errorResponse('Service not found', 404);
            }
            console.error('Error fetching service:', error);
            return errorResponse('Failed to fetch service', 500);
        }

        return jsonResponse({
            success: true,
            data
        });

    } catch (error) {
        console.error('Get service error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// PUT update service (protected)
async function handlePut(request, id) {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const body = await request.json();

        // Build update object with only provided fields
        const updateData = {};
        if (body.title !== undefined) updateData.title = body.title;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.icon !== undefined) updateData.icon = body.icon;
        if (body.category !== undefined) updateData.category = body.category;
        if (body.items !== undefined) updateData.items = body.items;
        if (body.gallery !== undefined) updateData.gallery = body.gallery;
        if (body.pricing !== undefined) updateData.pricing = body.pricing;
        if (body.display_order !== undefined) updateData.display_order = body.display_order;
        if (body.is_active !== undefined) updateData.is_active = body.is_active;

        const { data, error } = await supabaseAdmin
            .from('services')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return errorResponse('Service not found', 404);
            }
            console.error('Error updating service:', error);
            return errorResponse('Failed to update service', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Service updated successfully',
            data
        });

    } catch (error) {
        console.error('Update service error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// DELETE service (protected)
async function handleDelete(request, id) {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const { error } = await supabaseAdmin
            .from('services')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting service:', error);
            return errorResponse('Failed to delete service', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Service deleted successfully'
        });

    } catch (error) {
        console.error('Delete service error:', error);
        return errorResponse('Internal server error', 500);
    }
}
