/**
 * Seed Data for Database
 * 
 * This file contains all the static data that should be inserted into the database.
 * Run this via the API or directly in Supabase SQL Editor.
 */

// =============================================
// PROJECTS DATA
// =============================================

export const projectsData = [
    {
        title: 'E-Commerce Platform',
        category: 'Development',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop',
        description: 'Full-stack e-commerce solution with Next.js and Stripe.',
        tags: ['React', 'Node.js', 'Stripe'],
        github_url: '#',
        demo_url: '#',
        is_featured: true,
        is_active: true,
        display_order: 1
    },
    {
        title: 'Finance Dashboard',
        category: 'UI/UX Design',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
        description: 'Real-time financial data visualization dashboard.',
        tags: ['Figma', 'D3.js', 'React'],
        github_url: '#',
        demo_url: '#',
        is_featured: true,
        is_active: true,
        display_order: 2
    },
    {
        title: 'AI Chat Interface',
        category: 'Development',
        image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1000&auto=format&fit=crop',
        description: 'Generative AI chat interface with streaming responses.',
        tags: ['OpenAI', 'Next.js', 'Tailwind'],
        github_url: '#',
        demo_url: '#',
        is_featured: true,
        is_active: true,
        display_order: 3
    },
    {
        title: 'Travel App Design',
        category: 'Mobile Design',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
        description: 'Modern travel social application interface design.',
        tags: ['Figma', 'Prototyping', 'User Research'],
        github_url: '#',
        demo_url: '#',
        is_featured: false,
        is_active: true,
        display_order: 4
    },
    {
        title: 'Health Tracker',
        category: 'Mobile App',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
        description: 'Fitness and health tracking application.',
        tags: ['React Native', 'Firebase', 'Redux'],
        github_url: '#',
        demo_url: '#',
        is_featured: false,
        is_active: true,
        display_order: 5
    },
    {
        title: 'Smart Home Hub',
        category: 'IoT Interface',
        image: 'https://images.unsplash.com/photo-1558002038-1091a166272c?q=80&w=2070&auto=format&fit=crop',
        description: 'Control panel for smart home devices.',
        tags: ['Vue.js', 'MQTT', 'Tailwind'],
        github_url: '#',
        demo_url: '#',
        is_featured: false,
        is_active: true,
        display_order: 6
    },
    {
        title: 'Portfolio Website',
        category: 'Web Design',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop',
        description: 'My personal portfolio website built with React.',
        tags: ['React', 'Tailwind', 'Framer Motion'],
        github_url: '#',
        demo_url: '#',
        is_featured: false,
        is_active: true,
        display_order: 7
    }
];

// =============================================
// SERVICES DATA
// =============================================

export const servicesData = [
    {
        title: 'Website Development',
        description: 'Complete web solutions from design to deployment, including e-commerce, CMS, and custom web applications.',
        icon: 'Globe',
        category: 'main',
        items: [
            { name: 'Full Stack Development', icon: 'Code', desc: 'Complete web solutions using modern technologies' },
            { name: 'CMS Integration', icon: 'Database', desc: 'Custom content management system setup' },
            { name: 'E-commerce Solutions', icon: 'ShoppingCart', desc: 'Online store functionality and payment integration' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070&auto=format&fit=crop'
        ],
        pricing: [
            { name: 'Basic', price: '$499', features: ['Single Landing Page', 'Mobile Responsive', 'Contact Form', '1 Month Support'] },
            { name: 'Professional', price: '$999', features: ['Multi-page Website', 'CMS Integration', 'SEO Optimization', '3 Months Support', 'Speed Optimization'] },
            { name: 'Enterprise', price: '$1999', features: ['Custom E-commerce', 'Payment Gateway', 'Priority Support', 'Advanced Security', 'Analytics Integration', '1 Year Support'] }
        ],
        display_order: 1,
        is_active: true
    },
    {
        title: 'Frontend Development',
        description: 'Modern, responsive web applications built with React, Next.js and cutting-edge technologies.',
        icon: 'Layout',
        category: 'main',
        items: [
            { name: 'Responsive Web Application', icon: 'Smartphone', desc: 'Applications that work seamlessly across all devices' },
            { name: 'Modern React Ecosystem', icon: 'Code', desc: 'Built with React, Next.js, and modern tools' },
            { name: 'Performance Optimization', icon: 'Monitor', desc: 'Fast loading times and optimal user experience' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop'
        ],
        pricing: [
            { name: 'Component', price: '$199', features: ['Interactive UI Component', 'Responsive', 'Clean Code'] },
            { name: 'Single Page App', price: '$799', features: ['React/Next.js SPA', 'API Integration', 'State Management', 'Testing'] },
            { name: 'Full Application', price: '$1499', features: ['Complex Architecture', 'Authentication', 'Database Integration', 'Deployment'] }
        ],
        display_order: 2,
        is_active: true
    },
    {
        title: 'UI/UX Design',
        description: 'User-centered design solutions including wireframes, prototypes, and complete design systems.',
        icon: 'Palette',
        category: 'main',
        items: [
            { name: 'Responsive Design', icon: 'Smartphone', desc: 'Layouts that adapt to any screen size' },
            { name: 'Prototype', icon: 'Figma', desc: 'Interactive mockups for user flow testing' },
            { name: 'User Interface Design', icon: 'Layout', desc: 'Visually appealing and intuitive interfaces' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=2080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1509395062558-41264c530cb6?q=80&w=2070&auto=format&fit=crop'
        ],
        pricing: [
            { name: 'Wireframe', price: '$299', features: ['User Flow', 'Low-fidelity Design', '2 Revisions'] },
            { name: 'UI Design', price: '$699', features: ['High-fidelity Design', 'Design System', 'Prototyping', 'Source Files'] },
            { name: 'Full Package', price: '$1299', features: ['UX Research', 'User Testing', 'Full UI Design', 'Interactive Prototype', 'Developer Handoff'] }
        ],
        display_order: 3,
        is_active: true
    },
    {
        title: 'Software Testing',
        description: 'Comprehensive QA services including manual testing, automation, and detailed bug reporting.',
        icon: 'Bug',
        category: 'main',
        items: [
            { name: 'Manual Testing', icon: 'CheckCircle', desc: 'Thorough verification of functionality and usability' },
            { name: 'Automated Testing', icon: 'Code', desc: 'Scripted tests for regression and stability' },
            { name: 'Bug Reporting', icon: 'Search', desc: 'Detailed issue tracking and documentation' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1605522466906-ddcb68a73196?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&auto=format&fit=crop'
        ],
        pricing: [
            { name: 'Smoke Test', price: '$149', features: ['Critical Path Testing', 'Basic Report'] },
            { name: 'Standard QA', price: '$499', features: ['Manual Testing', 'Detailed Bug Report', 'Cross-browser Testing'] },
            { name: 'Automation', price: '$999', features: ['Test Script Development', 'CI/CD Integration', 'Performance Testing', 'Comprehensive Report'] }
        ],
        display_order: 4,
        is_active: true
    },
    {
        title: 'WordPress Development',
        description: 'Custom WordPress solutions including theme development, plugin configuration, and maintenance.',
        icon: 'Globe2',
        category: 'main',
        items: [
            { name: 'Theme Customization', icon: 'Palette', desc: 'Tailoring themes to match your brand identity' },
            { name: 'Plugin Configuration', icon: 'Settings', desc: 'Extending functionality with the right tools' },
            { name: 'Site Maintenance', icon: 'Wrench', desc: 'Regular updates and security checks' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1622675363311-ac60f6037cda?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1481487484168-9b930d5b7d9f?q=80&w=2070&auto=format&fit=crop'
        ],
        pricing: [
            { name: 'Setup', price: '$299', features: ['Theme Installation', 'Basic Plugins', 'Content Upload'] },
            { name: 'Customization', price: '$599', features: ['Child Theme Development', 'CSS Styling', 'Speed Optimization'] },
            { name: 'E-commerce', price: '$899', features: ['WooCommerce Setup', 'Product Upload', 'Payment Integration'] }
        ],
        display_order: 5,
        is_active: true
    },
    {
        title: 'Digital Media',
        description: 'Creative digital content including motion graphics, video editing, and graphic design.',
        icon: 'Video',
        category: 'other',
        items: [
            { name: 'Motion Graphic', icon: 'Film', desc: 'Animated visual content for engagement' },
            { name: 'Video Editor', icon: 'Video', desc: 'Professional cutting and post-production' },
            { name: 'Graphic Design', icon: 'ImageIcon', desc: 'Static visuals for digital and print media' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1574717432741-9346631bf350?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop'
        ],
        pricing: [
            { name: 'Basic Edit', price: '$199', features: ['Cut/Trim', 'Color Correction', 'Basic Audio Mix'] },
            { name: 'Visual Effects', price: '$499', features: ['Motion Graphics', 'Transitions', 'Sound Design'] },
            { name: 'Full Production', price: '$999', features: ['Storyboarding', 'Advanced Editing', 'VFX', 'Final Polish'] }
        ],
        display_order: 1,
        is_active: true
    }
];

// =============================================
// CONTACT INFO DATA
// =============================================

export const contactInfo = {
    email: 'hello@example.com',
    phone: '+66 12 345 6789',
    location: 'Bangkok, Thailand'
};

export default {
    projects: projectsData,
    services: servicesData,
    contact: contactInfo
};
