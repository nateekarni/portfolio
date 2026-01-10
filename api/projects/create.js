import { supabaseAdmin } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';



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

        // Prepare project data
        const projectData = {
            title: body.title,
            category: body.category || '',
            image: body.image || '',
            description: body.description || '',
            tags: body.tags || [],
            github_url: body.github_url || '',
            demo_url: body.demo_url || '',
            is_featured: body.is_featured || false,
            display_order: body.display_order || 0,
            is_active: body.is_active !== false
        };

        const { data, error } = await supabaseAdmin
            .from('projects')
            .insert(projectData)
            .select()
            .single();

        if (error) {
            console.error('Error creating project:', error);
            return errorResponse('Failed to create project', 500);
        }

        return jsonResponse({
            success: true,
            message: 'Project created successfully',
            data
        }, 201);

    } catch (error) {
        console.error('Create project error:', error);
        return errorResponse('Internal server error', 500);
    }
}
