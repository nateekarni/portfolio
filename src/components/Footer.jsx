import { Terminal, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Video', href: '#video' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className='border-t border-border bg-black/20 backdrop-blur-md'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid md:grid-cols-3 gap-8 mb-8'>
          {/* Brand */}
          <div>
            <a href='#home' className='flex items-center gap-2 mb-4 group'>
              <div className='p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                 <Terminal className='w-6 h-6 text-primary' />
              </div>
              <span className='text-xl font-bold gradient-text'>
                Portfolio
              </span>
            </a>
            <p className='text-secondary text-sm max-w-xs'>
              UX/UI Designer, Software Tester, and Junior Developer passionate about creating
              exceptional digital experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-bold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className='text-secondary hover:text-primary transition-colors text-sm'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='font-bold mb-4'>Get In Touch</h4>
            <div className='text-secondary text-sm space-y-2'>
              <p>your.email@example.com</p>
              <p>+66 123 456 789</p>
              <p>Bangkok, Thailand</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className='pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-secondary text-sm flex items-center gap-1'>
            © {currentYear} Made with <Heart className='w-4 h-4 text-accent' fill='currentColor' /> by Your Name
          </p>
          <p className='text-secondary text-sm'>
            Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
