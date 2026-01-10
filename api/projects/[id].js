import { supabaseAdmin, supabasePublic } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    // Extract ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
        return errorResponse('Project ID is required', 400);
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

// GET single project (public)
async function handleGet(id) {
    try {
        const { data, error } = await supabasePublic
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return errorResponse('Project not found', 404);
            }
            console.error('Error fetching project:', error);
            return errorResponse('Failed to fetch project', 500);
        }

        return jsonResponse({
            success: true,
            data
        });

    } catch (error) {
        console.error('Get project error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// PUT update project (protected)
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
        if (body.category !== undefined) updateData.category = body.category;
        if (body.image !== undefined) updateData.image = body.image;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.tags !== undefined) updateData.tags = body.tags;
        if (body.github_url !== undefined) updateData.github_url = body.github_url;
        if (body.demo_url !== undefined) updateData.demo_url = body.demo_url;
        if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;
        if (body.display_order !== undefined) updateData.display_order = body.display_order;
        if (body.is_active !== undefined) updateData.is_active = body.is_active;

        const { data, error } = await supabaseAdmin
            .from('projects')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return errorResponse('Project not found', 404);
            }
            console.error('Error updating project:', error);
            return errorResponse('Failed to update project', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Project updated successfully',
            data
        });

    } catch (error) {
        console.error('Update project error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// DELETE project (protected)
async function handleDelete(request, id) {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const { error } = await supabaseAdmin
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            return errorResponse('Failed to delete project', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Project deleted successfully'
        });

    } catch (error) {
        console.error('Delete project error:', error);
        return errorResponse('Internal server error', 500);
    }
}
