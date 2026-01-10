import { FaReact, FaNodeJs, FaStripe, FaFigma, FaVuejs, FaPencilRuler, FaSearch } from 'react-icons/fa';
import { SiD3Dotjs, SiOpenai, SiNextdotjs, SiTailwindcss, SiFirebase, SiRedux, SiMqtt, SiFramer } from 'react-icons/si';

const iconMap = {
    'React': FaReact,
    'Node.js': FaNodeJs,
    'Stripe': FaStripe,
    'Figma': FaFigma,
    'D3.js': SiD3Dotjs,
    'OpenAI': SiOpenai,
    'Next.js': SiNextdotjs,
    'Tailwind': SiTailwindcss,
    'React Native': FaReact,
    'Firebase': SiFirebase,
    'Redux': SiRedux,
    'Vue.js': FaVuejs,
    'MQTT': SiMqtt,
    'Framer Motion': SiFramer,
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
    'Next.js': 'currentColor', // Adapts to theme
    'Tailwind': '#06B6D4',
    'React Native': '#61DAFB',
    'Firebase': '#FFCA28',
    'Redux': '#764ABC',
    'Vue.js': '#4FC08D',
    'MQTT': '#660066',
    'Framer Motion': '#0055FF',
};

const TechIcon = ({ tag, className = "" }) => {
    const Icon = iconMap[tag];
    const color = colorMap[tag];
    
    if (!Icon) return null;
    return <Icon className={className} style={{ color: color }} />;
};

export default TechIcon;
