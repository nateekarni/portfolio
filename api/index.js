import { createClient } from '@supabase/supabase-js';

// Import Controllers
// About
import aboutIndex from './about/_index.js';
import aboutCerts from './about/_certs.js';
import aboutCertsId from './about/certs/_[id].js';
import aboutStats from './about/_stats.js';
import aboutStatsId from './about/stats/_[id].js';

// Auth
import authLogin from './auth/_login.js';
import authLogout from './auth/_logout.js';
import authVerify from './auth/_verify.js';

// Contact
import contactConfig from './contact/_config.js';
import contactInfo from './contact/_info.js';
import contactItems from './contact/_items.js';
import contactItemsId from './contact/items/_[id].js';
import contactMessages from './contact/_messages.js';

// Hero
import heroIndex from './hero/_index.js';
import heroSocial from './hero/_social.js';
import heroSocialId from './hero/social/_[id].js';

// Messages
import messagesId from './messages/_[id].js';

// Projects
import projectsIndex from './projects/_index.js';
import projectsConfig from './projects/_config.js';
import projectsCreate from './projects/_create.js';
import projectsId from './projects/_[id].js';

// Services
import servicesIndex from './services/_index.js';
import servicesConfig from './services/_config.js';
import servicesCreate from './services/_create.js';
import servicesId from './services/_[id].js';

// Seed
import seedIndex from './seed/_index.js';

// Video
import videoIndex from './video/_index.js';

import { isAllowedOrigin } from './_lib/cors.js';

// Router Map
const routes = {
    // Static Routes
    '/api/about': aboutIndex,
    '/api/about/certs': aboutCerts,
    '/api/about/stats': aboutStats,
    '/api/auth/login': authLogin,
    '/api/auth/logout': authLogout,
    '/api/auth/verify': authVerify,
    '/api/contact/config': contactConfig,
    '/api/contact/info': contactInfo,
    '/api/contact/items': contactItems,
    '/api/contact/messages': contactMessages,
    '/api/hero': heroIndex,
    '/api/hero/social': heroSocial,
    '/api/projects': projectsIndex,
    '/api/projects/config': projectsConfig,
    '/api/projects/create': projectsCreate,
    '/api/services': servicesIndex,
    '/api/services/config': servicesConfig,
    '/api/services/create': servicesCreate,
    '/api/seed': seedIndex,
    '/api/video': videoIndex,
};

// Dynamic Routes (Regex matching)
const dynamicRoutes = [
    { pattern: /^\/api\/about\/certs\/([^/]+)$/, handler: aboutCertsId },
    { pattern: /^\/api\/about\/stats\/([^/]+)$/, handler: aboutStatsId },
    { pattern: /^\/api\/contact\/items\/([^/]+)$/, handler: contactItemsId },
    { pattern: /^\/api\/hero\/social\/([^/]+)$/, handler: heroSocialId },
    { pattern: /^\/api\/messages\/([^/]+)$/, handler: messagesId },
    { pattern: /^\/api\/projects\/([^/]+)$/, handler: projectsId },
    { pattern: /^\/api\/services\/([^/]+)$/, handler: servicesId },
];

// export const config = {
//     api: {
//         bodyParser: false,
//     }
// };

export default async function handler(req, res) {
    try {
        const urlStr = `http://${req.headers.host || 'localhost'}${req.url}`;
        const url = new URL(urlStr);
        const pathname = url.pathname;

        // 1. Find Handler
        let handler = routes[pathname];
        if (!handler) {
            for (const route of dynamicRoutes) {
                if (route.pattern.test(pathname)) {
                    handler = route.handler;
                    break;
                }
            }
        }

        if (!handler) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Not Found', path: pathname }));
            return;
        }

        // 2. Adapt Node Request to Web Request
        // We re-read the body. Vercel automatically parses JSON bodies.
        // If it's parsed, we stringify it.
        // We need to be careful about non-JSON bodies (e.g. multipart). 
        // Our app mainly uses JSON.

        // Wait, Vercel 'req.body' is present.
        // 'new Request' body option takes: Blob, BufferSource, FormData, URLSearchParams, USVString, or ReadableStream.
        // It does NOT take a plain object.
        let body = undefined;
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            if (req.body && typeof req.body === 'object') {
                body = JSON.stringify(req.body);
            } else {
                body = req.body; // string or buffer?
            }
        }

        const webReq = new Request(urlStr, {
            method: req.method,
            headers: req.headers, // Headers object works
            body: body
        });

        // 3. Execute Handler
        const webRes = await handler(webReq);

        // 4. Send Response
        res.statusCode = webRes.status;
        webRes.headers.forEach((val, key) => res.setHeader(key, val));

        // Inject Dynamic CORS Origin for actual responses
        const origin = req.headers.origin;
        if (origin && isAllowedOrigin(origin)) {
             res.setHeader('Access-Control-Allow-Origin', origin);
             res.setHeader('Access-Control-Allow-Credentials', 'true');
        }

        // Handle body
        const text = await webRes.text();
        res.end(text);

    } catch (error) {
        console.error('API Router Error:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            error: 'Internal Server Error',
            message: error.message
        }));
    }
}
