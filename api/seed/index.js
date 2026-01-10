import { supabaseAdmin } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { projectsData, servicesData, contactInfo } from '../_lib/seedData.js';

export const config = {
    runtime: 'edge',
};

/**
 * Seed Database API
 * POST /api/seed - Seeds the database with initial data
 * 
 * WARNING: This will clear existing data before seeding!
 */
export default async function handler(request) {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    if (request.method !== 'POST') {
        return errorResponse('Method not allowed', 405);
    }

    // Require authentication
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const results = {
            projects: { inserted: 0, errors: [] },
            services: { inserted: 0, errors: [] },
            contact: { success: false, error: null }
        };

        // Seed Projects
        console.log('Seeding projects...');
        for (const project of projectsData) {
            const { error } = await supabaseAdmin
                .from('projects')
                .insert(project);

            if (error) {
                results.projects.errors.push({ title: project.title, error: error.message });
            } else {
                results.projects.inserted++;
            }
        }

        // Seed Services
        console.log('Seeding services...');
        for (const service of servicesData) {
            const { error } = await supabaseAdmin
                .from('services')
                .insert(service);

            if (error) {
                results.services.errors.push({ title: service.title, error: error.message });
            } else {
                results.services.inserted++;
            }
        }

        // Seed Contact Info
        console.log('Seeding contact info...');
        const { error: contactError } = await supabaseAdmin
            .from('contact_info')
            .upsert({ id: 1, ...contactInfo });

        if (contactError) {
            results.contact.error = contactError.message;
        } else {
            results.contact.success = true;
        }

        return jsonResponse({
            success: true,
            message: 'Database seeded successfully',
            results
        });

    } catch (error) {
        console.error('Seed error:', error);
        return errorResponse('Failed to seed database: ' + error.message, 500);
    }
}
