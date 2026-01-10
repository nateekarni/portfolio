import { supabaseAdmin } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';



export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    // Check authentication for all operations
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
        return errorResponse('Unauthorized', 401);
    }

    // Extract ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
        return errorResponse('Message ID is required', 400);
    }

    switch (request.method) {
        case 'GET':
            return handleGet(id);
        case 'PUT':
            return handlePut(request, id);
        case 'DELETE':
            return handleDelete(id);
        default:
            return errorResponse('Method not allowed', 405);
    }
}

// GET single message
async function handleGet(id) {
    try {
        const { data, error } = await supabaseAdmin
            .from('messages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return errorResponse('Message not found', 404);
            }
            console.error('Error fetching message:', error);
            return errorResponse('Failed to fetch message', 500);
        }

        return jsonResponse({
            success: true,
            data
        });

    } catch (error) {
        console.error('Get message error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// PUT update message (mark as read/unread)
async function handlePut(request, id) {
    try {
        const body = await request.json();

        const updateData = {};
        if (body.is_read !== undefined) updateData.is_read = body.is_read;

        const { data, error } = await supabaseAdmin
            .from('messages')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return errorResponse('Message not found', 404);
            }
            console.error('Error updating message:', error);
            return errorResponse('Failed to update message', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Message updated successfully',
            data
        });

    } catch (error) {
        console.error('Update message error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// DELETE message
async function handleDelete(id) {
    try {
        const { error } = await supabaseAdmin
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting message:', error);
            return errorResponse('Failed to delete message', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Message deleted successfully'
        });

    } catch (error) {
        console.error('Delete message error:', error);
        return errorResponse('Internal server error', 500);
    }
}
