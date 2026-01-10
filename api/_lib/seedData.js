/**
 * Seed Data for Database
 * 
 * This file contains all the static data that should be inserted into the database.
 * Run this via the API or directly in Supabase SQL Editor.
 */

// =============================================
// HERO SECTION
// =============================================
export const heroData = {
    greeting: "Hello, I'm",
    name: "Natee Karni",
    role: "Full Stack Developer",
    status_text: "Available for freelance work"
};

export const socialLinksData = [
    { platform: 'GitHub', url: 'https://github.com', icon: 'Github', display_order: 1 },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', display_order: 2 },
    { platform: 'Email', url: 'mailto:hello@example.com', icon: 'Mail', display_order: 3 }
];

// =============================================
// ABOUT SECTION
// =============================================
export const aboutData = {
    title: "About Me",
    description_1: "I am a passionate developer with a strong foundation in modern web technologies. I love building clean, user-friendly, and performant web applications.",
    description_2: "Specializing in React, Node.js, and cloud architectures, I strive to create digital experiences that solve real-world problems."
};

export const aboutStatsData = [
    { label: 'Years Experience', value: '3+', display_order: 1 },
    { label: 'Completed Projects', value: '20+', display_order: 2 },
    { label: 'Satisfied Clients', value: '10+', display_order: 3 },
    { label: 'Awards Won', value: '5', display_order: 4 }
];

export const certificationsData = [
    {
        name: 'Certified React Developer',
        issuer: 'Meta',
        date: '2025',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
        cert_image_url: 'https://img.freepik.com/free-vector/modern-certificate-template-appreciation_1017-38662.jpg',
        display_order: 1
    },
    {
        name: 'Advanced Software Testing',
        issuer: 'ISTQB',
        date: '2024',
        logo_url: 'https://companieslogo.com/img/orig/ISTQB.D-2da26815.png?t=1720244492',
        cert_image_url: 'https://img.freepik.com/free-vector/modern-certificate-template-appreciation_1017-38662.jpg',
        display_order: 2
    },
    {
        name: 'UI/UX Design Specialization',
        issuer: 'Google',
        date: '2023',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png',
        cert_image_url: 'https://img.freepik.com/free-vector/modern-certificate-template-appreciation_1017-38662.jpg',
        display_order: 3
    },
    {
        name: 'Full Stack Web Development',
        issuer: 'Udemy',
        date: '2023',
        logo_url: 'https://seeklogo.com/images/U/udemy-logo-5B56A082F8-seeklogo.com.png',
        cert_image_url: 'https://img.freepik.com/free-vector/modern-certificate-template-appreciation_1017-38662.jpg',
        display_order: 4
    }
];

// =============================================
// VIDEO SECTION
// =============================================
export const videoData = {
    subtitle: "Behind the Process",
    description: "Take a look at my development workflow and how I bring ideas to life through code and design.",
    video_url: "your-video-url.mp4",
    cover_image_url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200"
};

// =============================================
// CONTACT ITEMS
// =============================================
export const contactItemsData = [
    { title: 'Email', value: 'hello@example.com', icon: 'Mail', type: 'email', display_order: 1 },
    { title: 'Phone', value: '+1 (555) 000-0000', icon: 'Phone', type: 'phone', display_order: 2 },
    { title: 'Location', value: 'New York, NY', icon: 'MapPin', type: 'location', display_order: 3 }
];

// =============================================
// PROJECTS DATA
// =============================================

export const projectsData = [
    {
        title: 'E-Commerce Platform',
        category: 'Development',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop',
        description: 'Full-stack e-commerce solution with Next.js and Stripe.',
        long_description: 'A comprehensive e-commerce platform built to handle high traffic and secure transactions. Features include user authentication, product catalog management, shopping cart functionality, and seamless payment integration via Stripe.',
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
        long_description: 'An intuitive dashboard designed for financial analysts to visualize real-time data. It uses D3.js for complex charting and provides insights into market trends and portfolio performance.',
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
        long_description: 'A cutting-edge chat interface that leverages OpenAI API to provide intelligent responses. It features real-time streaming of text, markdown support, and code syntax highlighting.',
        tags: ['OpenAI', 'Next.js', 'Tailwind'],
        github_url: '#',
        demo_url: '#',
        is_featured: true,
        is_active: true,
        display_order: 3
    },
    // ... Additional projects would follow same pattern
    {
        title: 'Portfolio Website',
        category: 'Web Design',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop',
        description: 'My personal portfolio website built with React.',
        long_description: 'This very website! A showcase of my skills and projects, built with React and Tailwind CSS. It features smooth animations, responsive design, and a dynamic admin panel for content management.',
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
    // ... (Other services remain same)
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

export default {
    hero: heroData,
    socialLinks: socialLinksData,
    about: aboutData,
    aboutStats: aboutStatsData,
    certifications: certificationsData,
    video: videoData,
    contactItems: contactItemsData,
    projects: projectsData,
    services: servicesData
};
