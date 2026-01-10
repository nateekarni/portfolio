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

    switch (request.method) {
        case 'GET':
            return handleGet(request);
        case 'POST':
            return handlePost(request);
        default:
            return errorResponse('Method not allowed', 405);
    }
}

// GET messages (protected - admin only)
async function handleGet(request) {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const url = new URL(request.url);
        const unreadOnly = url.searchParams.get('unread') === 'true';
        const limit = url.searchParams.get('limit');

        let query = supabaseAdmin
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (unreadOnly) {
            query = query.eq('is_read', false);
        }

        if (limit) {
            query = query.limit(parseInt(limit, 10));
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching messages:', error);
            return errorResponse('Failed to fetch messages', 500);
        }

        // Count unread messages
        const { count: unreadCount } = await supabaseAdmin
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);

        return jsonResponse({
            success: true,
            data: data || [],
            count: data?.length || 0,
            unreadCount: unreadCount || 0
        });

    } catch (error) {
        console.error('Get messages error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// POST new message (public - contact form)
async function handlePost(request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.email || !body.message) {
            return errorResponse('Name, email and message are required', 400);
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return errorResponse('Invalid email format', 400);
        }

        // Prepare message data
        const messageData = {
            name: body.name.trim(),
            email: body.email.trim().toLowerCase(),
            subject: body.subject?.trim() || '',
            message: body.message.trim(),
            is_read: false
        };

        // Use public client for inserting (no auth needed for contact form)
        const { data, error } = await supabaseAdmin
            .from('messages')
            .insert(messageData)
            .select()
            .single();

        if (error) {
            console.error('Error creating message:', error);
            return errorResponse('Failed to send message', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Message sent successfully'
        }, 201);

    } catch (error) {
        console.error('Create message error:', error);
        return errorResponse('Internal server error', 500);
    }
}
