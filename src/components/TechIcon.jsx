import { FaReact, FaNodeJs, FaStripe, FaFigma, FaVuejs, FaPencilRuler, FaSearch } from 'react-icons/fa';
import { SiD3Dotjs, SiOpenai, SiNextdotjs, SiTailwindcss, SiFirebase, SiRedux, SiMqtt, SiFramer, SiTypescript, SiSupabase, SiVite, SiVercel, SiJavascript, SiHtml5, SiCss3, SiGit, SiDocker, SiPostgresql, SiMongodb } from 'react-icons/si';

const iconMap = {
    'React': FaReact,
    'Node.js': FaNodeJs,
    'Stripe': FaStripe,
    'Figma': FaFigma,
    'D3.js': SiD3Dotjs,
    'OpenAI': SiOpenai,
    'Next.js': SiNextdotjs,
    'Tailwind': SiTailwindcss,
    'Tailwind CSS': SiTailwindcss,
    'React Native': FaReact,
    'Firebase': SiFirebase,
    'Redux': SiRedux,
    'Vue.js': FaVuejs,
    'MQTT': SiMqtt,
    'Framer Motion': SiFramer,
    'TypeScript': SiTypescript,
    'Supabase': SiSupabase,
    'Vite': SiVite,
    'Vercel': SiVercel,
    'JavaScript': SiJavascript,
    'HTML': SiHtml5,
    'CSS': SiCss3,
    'Git': SiGit,
    'Docker': SiDocker,
    'PostgreSQL': SiPostgresql,
    'MongoDB': SiMongodb,
    'Prototyping': FaPencilRuler,
    'User Research': FaSearch,
};

const colorMap = {
    'React': '#61DAFB',
    'Node.js': '#339933',
    'Stripe': '#008CDD',
    'Figma': '#F24E1E',
    'D3.js': '#F9A03C',
    'OpenAI': '#412991',
    'Next.js': 'currentColor', 
    'Tailwind CSS': '#06B6D4',
    'Node.js': '#339933',
    'Supabase': '#3ECF8E',
    'Framer Motion': '#0055FF',
    'Vite': '#646CFF',
    'Vercel': '#000000',
    'Firebase': '#FFCA28',
    'Redux': '#764ABC',
    'MQTT': '#660066',
    'MongoDB': '#47A248',
    'PostgreSQL': '#4169E1',
    'Docker': '#2496ED',
    'Git': '#F05032',
    'Figma': '#F24E1E',
    'TypeScript': '#3178C6',
};

const TechIcon = ({ name, size = 20, className = "" }) => {
    const Icon = iconMap[name];
    const color = colorMap[name] || 'currentColor';
    
    if (!Icon) return null;
    return <Icon size={size} className={className} style={{ color: color === 'currentColor' ? undefined : color }} />;
};

export default TechIcon;
