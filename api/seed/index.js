import { supabaseAdmin } from '../_lib/supabase.js';
import { isAuthenticated } from '../_lib/auth.js';
import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import {
    projectsData,
    servicesData,
    contactInfo,
    heroData,
    socialLinksData,
    aboutData,
    aboutStatsData,
    certificationsData,
    videoData,
    contactItemsData
} from '../_lib/seedData.js';

export const config = {
    runtime: 'edge',
};

/**
 * Seed Database API
 * POST /api/seed - Seeds the database with initial data
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
            hero: { success: false, error: null },
            socialLinks: { inserted: 0, errors: [] },
            about: { success: false, error: null },
            aboutStats: { inserted: 0, errors: [] },
            certifications: { inserted: 0, errors: [] },
            video: { success: false, error: null },
            contactItems: { inserted: 0, errors: [] },
            projects: { inserted: 0, errors: [] },
            services: { inserted: 0, errors: [] }
        };

        // 1. Seed Hero Section
        console.log('Seeding hero section...');
        const { error: heroError } = await supabaseAdmin
            .from('hero_sections')
            .upsert({ id: 1, ...heroData });
        if (heroError) results.hero.error = heroError.message;
        else results.hero.success = true;

        // 2. Seed Social Links (Clear existing first if you want valid refresh)
        console.log('Seeding social links...');
        // Optional: delete existing? await supabaseAdmin.from('social_links').delete().neq('id', 0);
        for (const link of socialLinksData) {
            const { error } = await supabaseAdmin.from('social_links').insert(link);
            if (error) results.socialLinks.errors.push({ platform: link.platform, error: error.message });
            else results.socialLinks.inserted++;
        }

        // 3. Seed About Section
        console.log('Seeding about section...');
        const { error: aboutError } = await supabaseAdmin
            .from('about_sections')
            .upsert({ id: 1, ...aboutData });
        if (aboutError) results.about.error = aboutError.message;
        else results.about.success = true;

        // 4. Seed About Stats
        console.log('Seeding about stats...');
        for (const stat of aboutStatsData) {
            const { error } = await supabaseAdmin.from('about_stats').insert(stat);
            if (error) results.aboutStats.errors.push({ label: stat.label, error: error.message });
            else results.aboutStats.inserted++;
        }

        // 5. Seed Certifications
        console.log('Seeding certifications...');
        for (const cert of certificationsData) {
            const { error } = await supabaseAdmin.from('certifications').insert(cert);
            if (error) results.certifications.errors.push({ name: cert.name, error: error.message });
            else results.certifications.inserted++;
        }

        // 6. Seed Video Section
        console.log('Seeding video section...');
        const { error: videoError } = await supabaseAdmin
            .from('video_sections')
            .upsert({ id: 1, ...videoData });
        if (videoError) results.video.error = videoError.message;
        else results.video.success = true;

        // 7. Seed Contact Items
        console.log('Seeding contact items...');
        for (const item of contactItemsData) {
            const { error } = await supabaseAdmin.from('contact_items').insert(item);
            if (error) results.contactItems.errors.push({ title: item.title, error: error.message });
            else results.contactItems.inserted++;
        }

        // 8. Seed Projects (Upsert based on title or just insert?) 
        // For simplicity, we just insert. In real app, might want to check existence.
        console.log('Seeding projects...');
        for (const project of projectsData) {
            const { error } = await supabaseAdmin.from('projects').insert(project);
            if (error) results.projects.errors.push({ title: project.title, error: error.message });
            else results.projects.inserted++;
        }

        // 9. Seed Services
        console.log('Seeding services...');
        for (const service of servicesData) {
            const { error } = await supabaseAdmin.from('services').insert(service);
            if (error) results.services.errors.push({ title: service.title, error: error.message });
            else results.services.inserted++;
        }

        return jsonResponse({
            success: true,
            message: 'Database formatted and seeded successfully',
            results
        });

    } catch (error) {
        console.error('Seed error:', error);
        return errorResponse('Failed to seed database: ' + error.message, 500);
    }
}
