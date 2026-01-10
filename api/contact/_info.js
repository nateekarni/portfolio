import { supabaseAdmin, supabasePublic } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';



export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    switch (request.method) {
        case 'GET':
            return handleGet();
        case 'PUT':
            return handlePut(request);
        default:
            return errorResponse('Method not allowed', 405);
    }
}

// GET contact info (public)
async function handleGet() {
    try {
        const { data, error } = await supabasePublic
            .from('contact_info')
            .select('*')
            .eq('id', 'singleton')
            .single();

        if (error) {
            console.error('Error fetching contact info:', error);
            return errorResponse('Failed to fetch contact info', 500);
        }

        return jsonResponse({
            success: true,
            data
        });

    } catch (error) {
        console.error('Get contact info error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// PUT update contact info (protected)
async function handlePut(request) {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const body = await request.json();

        // Build update object
        const updateData = {};
        if (body.email !== undefined) updateData.email = body.email;
        if (body.phone !== undefined) updateData.phone = body.phone;
        if (body.location !== undefined) updateData.location = body.location;
        if (body.social_links !== undefined) updateData.social_links = body.social_links;

        const { data, error } = await supabaseAdmin
            .from('contact_info')
            .update(updateData)
            .eq('id', 'singleton')
            .select()
            .single();

        if (error) {
            console.error('Error updating contact info:', error);
            return errorResponse('Failed to update contact info', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Contact info updated successfully',
            data
        });

    } catch (error) {
        console.error('Update contact info error:', error);
        return errorResponse('Internal server error', 500);
    }
}
