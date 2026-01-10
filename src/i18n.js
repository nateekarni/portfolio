import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        video: 'Video',
        contact: 'Contact'
      },
      hero: {
        greeting: 'Hello, I\'m',
        name: 'Natee S.',
        role: 'Full Stack Developer & UI/UX Enthusiast',
        role1: 'UX/UI Designer',
        role2: 'Software Tester',
        role3: 'Junior Developer',
        description: 'Passionate about creating beautiful user experiences, ensuring software quality, and building innovative solutions with clean code.',
        status: 'Available for work',
        viewWork: 'View My Work',
        contactMe: 'Contact Me',
        scrollDown: 'Scroll Down',
        watchIntro: 'Watch Intro'
      },
      about: {
        title: 'About Me',
        subtitle: 'Know Me Better',
        heading: 'A Passionate',
        designer: 'UX/UI Designer',
        tester: 'Tester',
        developer: 'Developer',
        bio1: 'I\'m a multidisciplinary creative professional with a passion for crafting exceptional digital experiences. With expertise spanning UX/UI design, software testing, and web development, I bring a unique perspective to every project. I focus on creating intuitive, accessible, and performant interfaces that delight users and solve real-world problems. My approach combines technical precision with creative flair, ensuring every line of code contributes to a seamless user journey.',
        bio2: 'My journey in tech has equipped me with a holistic understanding of the software development lifecycle, from initial design concepts to quality assurance and final deployment. I believe in creating products that are not only beautiful but also functional and thoroughly tested. I actively stay updated with the latest industry trends and technologies, constantly experimenting with new tools to improve my workflow and deliver better results for clients and stakeholders.',
        stats: {
          experience: 'Experience',
          projects: 'Projects',
          clients: 'Clients',
          awards: 'Awards'
        },
        whatIDo: 'What I Do',
        mySkills: 'My Skills',
        myJourney: 'My Journey',
        certificationsTitle: 'Certifications'
      },
      services: {
        title: 'Services',
        subtitle: 'What I Offer',
        viewDetail: 'View Detail',
        getQuote: 'Get a Quote',
        otherServices: 'Other Services',
        digital: {
           title: 'Digital Media Editing',
           description: 'Professional video editing, motion graphics, and graphic design services to elevate your brand content.'
        },
        website: {
           title: 'Website Development',
           description: 'Full-stack website development services tailored to your business needs.'
        },
        frontend: {
          title: 'Frontend Development',
          description: 'I build responsive, high-performance web applications that provide seamless user experiences across all devices, ensuring your digital presence is both beautiful and functional.'
        },
        testing: {
          title: 'Quality Assurance',
          description: 'I ensure your software is reliable and bug-free through rigorous testing methodologies, guaranteeing a smooth and stable experience for your end users.'
        },
        uiux: {
          title: 'UI/UX Design',
          description: 'I design intuitive and accessible interfaces that are tailored to your user\'s needs, creating engaging digital journeys that drive conversion and satisfaction.'
        },
        wordpress: {
          title: 'WordPress Development',
          description: 'I create custom WordPress solutions that are easy to manage and scale, taking care of everything from theme customization to plugin configuration.'
        },
        modal: {
            whatIncluded: 'What\'s included',
            pricing: 'Pricing'
        }
      },
      projects: {
        title: 'Portfolio',
        subtitle: 'Featured Projects',
        all: 'All Projects',
        design: 'UX/UI Design',
        testing: 'Testing',
        development: 'Development',
        viewLive: 'View Live',
        sourceCode: 'Source Code'
      },
      video: {
        title: 'Introduction',
        subtitle: 'Video Introduction',
        description: 'Get to know me better through this short video where I share my passion, experience, and what drives me as a creative professional.',
        duration: 'Video Duration',
        quality: 'Video Quality',
        language: 'Language',
        topics: 'What You\'ll Learn About Me'
      },
      contact: {
        title: 'Get In Touch',
        subtitle: 'Let\'s Work Together',
        description: 'Have a project in mind or want to discuss potential opportunities? I\'d love to hear from you. Let\'s create something amazing together!',
        form: {
          name: 'Your Name',
          email: 'Your Email',
          subject: 'Subject',
          message: 'Your Message',
          send: 'Send Message',
          sending: 'Sending...',
          success: 'Message sent successfully! I\'ll get back to you soon.',
          error: 'Something went wrong. Please try again.'
        },
        info: {
          email: 'Email',
          phone: 'Phone',
          location: 'Location',
          connect: 'Connect With Me',
          available: 'Currently Available',
          availableText: 'I\'m open for freelance projects, full-time positions, and exciting collaborations. Feel free to reach out!',
          responseTime: 'Quick Response Time',
          responseText: 'I typically respond within 24 hours. For urgent matters, please call or message on social media.',
          average: 'Average response: 12 hours'        },
        error: {
          common: {
            backToHome: 'Back to Home'
          },
          unauthorized: {
            title: 'Access Denied',
            description: 'Sorry, you do not have permission to access this page. Please contact administration if you believe this is an error.'
          }        }
      }
    }
  },
  th: {
    translation: {
      nav: {
        home: 'หน้าแรก',
        about: 'เกี่ยวกับ',
        services: 'บริการ',
        projects: 'ผลงาน',
        video: 'วิดีโอ',
        contact: 'ติดต่อ'
      },
      hero: {
        greeting: 'สวัสดี ฉันคือ',
        name: 'นที ส.',
        role: 'Full Stack Developer และ UI/UX Enthusiast',
        role1: 'UX/UI Designer',
        role2: 'Software Tester',
        role3: 'Junior Developer',
        description: 'หลงใหลในการสร้างประสบการณ์ผู้ใช้ที่สวยงาม ตรวจสอบคุณภาพซอฟต์แวร์ และสร้างโซลูชันที่เป็นนวัตกรรมด้วยโค้ดที่สะอาด',
        status: 'กระตือรือร้นในการทำงาน',
        available: 'พร้อมรับงาน',
        viewWork: 'ดูผลงาน',
        contactMe: 'ติดต่อฉัน',
        scrollDown: 'เลื่อนลง',
        watchIntro: 'ดูวิดีโอแนะนำตัว'
      },
      about: {
        title: 'เกี่ยวกับฉัน',
        subtitle: 'ทำความรู้จักฉัน',
        heading: 'ผู้หลงใหล',
        designer: 'UX/UI Design',
        tester: 'การทดสอบ',
        developer: 'การพัฒนา',
        bio1: 'ฉันเป็นมืออาชีพที่มีความคิดสร้างสรรค์หลากหลายสาขา มีความหลงใหลในการสร้างประสบการณ์ดิจิทัลที่เป็นเลิศ ด้วยความเชี่ยวชาญที่ครอบคลุมการออกแบบ UX/UI การทดสอบซอฟต์แวร์ และการพัฒนาเว็บ ฉันนำมุมมองที่เป็นเอกลักษณ์มาสู่ทุกโปรเจกต์ ฉันมุ่งเน้นการสร้างอินเทอร์เฟซที่ใช้งานง่าย เข้าถึงได้ และมีประสิทธิภาพ เพื่อแก้ปัญหาและสร้างความพึงพอใจให้กับผู้ใช้งาน',
        bio2: 'การเดินทางของฉันในด้านเทคโนโลยีทำให้ฉันมีความเข้าใจอย่างครบวงจรเกี่ยวกับวงจรการพัฒนาซอฟต์แวร์ ตั้งแต่แนวคิดการออกแบบเบื้องต้นไปจนถึงการประกันคุณภาพและการนำไปใช้งานขั้นสุดท้าย ฉันเชื่อในการสร้างผลิตภัณฑ์ที่ไม่เพียงแต่สวยงาม แต่ยังใช้งานได้จริงและได้รับการทดสอบอย่างละเอียด ฉันหมั่นเรียนรู้เทรนด์และเทคโนโลยีใหม่ๆ อยู่เสมอ เพื่อพัฒนาวิธีการทำงานและส่งมอบผลลัพธ์ที่ดีที่สุด',
        stats: {
          experience: 'ประสบการณ์',
          projects: 'โปรเจกต์',
          clients: 'ลูกค้า',
          awards: 'รางวัล'
        },
        whatIDo: 'สิ่งที่ฉันทำ',
        mySkills: 'ทักษะของฉัน',
        myJourney: 'เส้นทางของฉัน',
        certificationsTitle: 'ใบรับรอง'
      },
      services: {
        title: 'บริการของฉัน',
        subtitle: 'สิ่งที่ฉันนำเสนอ',
        viewDetail: 'ดูรายละเอียด',
        getQuote: 'ขอใบเสนอราคา',
        otherServices: 'บริการสื่อดิจิทัล',
        digital: {
           title: 'การตัดต่อสื่อดิจิทัล',
           description: 'บริการตัดต่อวิดีโอ โมชั่นกราฟิก และออกแบบกราฟิกอย่างมืออาชีพ เพื่อยกระดับคอนเทนต์แบรนด์ของคุณ'
        },
        website: {
           title: 'การพัฒนาเว็บไซต์',
           description: 'บริการพัฒนาเว็บไซต์ครบวงจรที่ตอบโจทย์ความต้องการทางธุรกิจของคุณ'
        },
        frontend: {
          title: 'การพัฒนา Frontend',
          description: 'สร้างเว็บไซต์และแอปพลิเคชันที่รองรับการแสดงผลบนทุกอุปกรณ์ เน้นความสวยงาม ความเร็วในการโหลด และการใช้งานที่ลื่นไหล เพื่อส่งมอบประสบการณ์ที่ดีที่สุดให้กับผู้ใช้งานของคุณ'
        },
        testing: {
          title: 'การประกันคุณภาพ',
          description: 'ตรวจสอบและรับประกันคุณภาพของซอฟต์แวร์อย่างละเอียด เพื่อให้มั่นใจว่าระบบทำงานได้อย่างถูกต้อง มีความเสถียร และปราศจากข้อผิดพลาดที่ส่งผลกระทบต่อผู้ใช้งาน'
        },
        uiux: {
          title: 'การออกแบบ UI/UX',
          description: 'ออกแบบหน้าจอการใช้งานที่เข้าใจง่ายและสวยงาม โดยคำนึงถึงความต้องการของผู้ใช้งานเป็นหลัก เพื่อสร้างความประทับใจและความสะดวกสบายในการใช้งาน'
        },
        wordpress: {
          title: 'การพัฒนา WordPress',
          description: 'รับทำเว็บไซต์ WordPress แบบครบวงจร ตั้งแต่การออกแบบ ปรับแต่งธีม ไปจนถึงการตั้งค่าระบบ เพื่อให้คุณมีเว็บไซต์ที่สวยงามและบริหารจัดการเนื้อหาได้ง่าย'
        },
        modal: {
            whatIncluded: 'สิ่งที่รวมอยู่ในบริการ',
            pricing: 'ราคาเริ่มต้น'
        }
      },
      projects: {
        title: 'ผลงาน',
        subtitle: 'โปรเจกต์เด่น',
        all: 'ทั้งหมด',
        design: 'UX/UI Design',
        testing: 'Testing',
        development: 'Development',
        viewLive: 'ดูเว็บไซต์',
        sourceCode: 'โค้ดต้นฉบับ'
      },
      video: {
        title: 'แนะนำตัว',
        subtitle: 'วิดีโอแนะนำตัว',
        description: 'ทำความรู้จักฉันมากขึ้นผ่านวิดีโอสั้นนี้ที่ฉันแชร์ความหลงใหล ประสบการณ์ และสิ่งที่ผลักดันฉันในฐานะมืออาชีพที่สร้างสรรค์',
        duration: 'ความยาววิดีโอ',
        quality: 'คุณภาพวิดีโอ',
        language: 'ภาษา',
        topics: 'สิ่งที่คุณจะได้รู้จักฉัน'
      },
      contact: {
        title: 'ติดต่อเรา',
        subtitle: 'มาทำงานด้วยกัน',
        description: 'มีโปรเจกต์ที่ต้องการหรืออยากคุยเกี่ยวกับโอกาสในการทำงาน? ฉันอยากฟังจากคุณ มาสร้างสิ่งที่น่าอัศจรรย์ไปด้วยกัน!',
        form: {
          name: 'ชื่อของคุณ',
          email: 'อีเมลของคุณ',
          subject: 'หัวข้อ',
          message: 'ข้อความของคุณ',
          send: 'ส่งข้อความ',
          sending: 'กำลังส่ง...',
          success: 'ส่งข้อความสำเร็จ! ฉันจะติดต่อกลับเร็วๆ นี้',
          error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
        },
        info: {
          email: 'อีเมล',
          phone: 'โทรศัพท์',
          location: 'ที่อยู่',
          connect: 'ติดต่อกับฉัน',
          available: 'พร้อมรับงานอยู่',
          availableText: 'ฉันพร้อมรับงานฟรีแลนซ์ ตำแหน่งงานเต็มเวลา และความร่วมมือที่น่าตื่นเต้น อย่าลังเลที่จะติดต่อ!',
          responseTime: 'เวลาตอบกลับที่รวดเร็ว',
          responseText: 'โดยปกติฉันจะตอบกลับภายใน 24 ชั่วโมง สำหรับเรื่องด่วน กรุณาโทรหรือส่งข้อความผ่านโซเชียลมีเดีย',
          average: 'เวลาตอบกลับเฉลี่ย: 12 ชั่วโมง'
        },
        error: {
          common: {
            backToHome: 'กลับหน้าหลัก'
          },
          unauthorized: {
            title: 'ไม่มีสิทธิ์เข้าถึง',
            description: 'ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบหากคุณเชื่อว่าเป็นข้อผิดพลาด'
          }
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
