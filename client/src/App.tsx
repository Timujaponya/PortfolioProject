import { useState, useEffect, createElement as createReactElement } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
import * as DevIcons from 'react-icons/di';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faGlobe,
  faCode,
  faServer,
  faMobileAlt,
  faPalette,
  faDatabase,
  faCogs,
  faRocket,
  faLaptopCode,
  faBrain,
  faCloud,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { 
  faGithub, 
  faLinkedin, 
  faTwitter,
  faReact,
  faNodeJs,
  faPython,
  faJs,
  faHtml5,
  faCss3Alt,
  faDocker,
  faGit
} from '@fortawesome/free-brands-svg-icons';

// Icon resolver - string icon name'i IconDefinition veya React Component'e çevirir
const resolveIcon = (iconName: string): IconDefinition | any => {
  // Devicon'dan ara (C++, C#, Unity, vs.)
  if (iconName.startsWith('Di') && (DevIcons as any)[iconName]) {
    return (DevIcons as any)[iconName];
  }
  // Solid icons'dan ara
  if ((SolidIcons as any)[iconName]) {
    return (SolidIcons as any)[iconName];
  }
  // Brand icons'dan ara
  if ((BrandIcons as any)[iconName]) {
    return (BrandIcons as any)[iconName];
  }
  // Bulunamazsa default icon
  return faCode;
};

interface Project {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  category: 'web' | 'game' | 'tools';
  categoryIcon?: string;
  icon?: string;
  link?: string;
  githubUrl?: string;
  imageUrl?: string;
  isActive: boolean;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  features: Array<{
    text: string;
    icon?: string;
  }>;
  isActive: boolean;
}

interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  cvUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
    githubIcon?: string;
    linkedinIcon?: string;
    twitterIcon?: string;
    websiteIcon?: string;
  };
  techStack: Array<{
    name: string;
    icon?: string;
  }>;
}

// Tech stack icon mapping
const getTechIcon = (tech: string | { name: string; icon?: string }): IconDefinition | any => {
  // Eğer tech undefined veya null ise default icon dön
  if (!tech) return faCode;
  
  // Eğer obje ise ve icon varsa onu kullan
  if (typeof tech === 'object' && tech.icon) {
    // Custom uploaded icon ise URL döndür (string olarak)
    if (tech.icon.startsWith('custom:')) {
      return tech.icon; // Render edilirken kontrol edilecek
    }
    return resolveIcon(tech.icon);
  }
  
  // String ise otomatik eşleştirme yap (eski uyumluluk için)
  const techName = typeof tech === 'string' ? tech : tech.name;
  
  // techName undefined kontrolü
  if (!techName) return faCode;
  
  const techLower = techName.toLowerCase();
  
  // Brand icons
  if (techLower.includes('react')) return faReact;
  if (techLower.includes('node')) return faNodeJs;
  if (techLower.includes('python')) return faPython;
  if (techLower.includes('javascript') || techLower.includes('js')) return faJs;
  if (techLower.includes('html')) return faHtml5;
  if (techLower.includes('css')) return faCss3Alt;
  if (techLower.includes('docker')) return faDocker;
  if (techLower.includes('git')) return faGit;
  
  // Solid icons - general categories
  if (techLower.includes('mobile') || techLower.includes('app')) return faMobileAlt;
  if (techLower.includes('backend') || techLower.includes('server')) return faServer;
  if (techLower.includes('database') || techLower.includes('sql') || techLower.includes('mongo')) return faDatabase;
  if (techLower.includes('cloud') || techLower.includes('aws') || techLower.includes('azure')) return faCloud;
  if (techLower.includes('ai') || techLower.includes('ml') || techLower.includes('machine learning')) return faBrain;
  if (techLower.includes('design') || techLower.includes('ui') || techLower.includes('ux')) return faPalette;
  
  // Default icon
  return faCode;
};

// Service icon mapping
const getServiceIcon = (iconText: string): IconDefinition | any => {
  // Custom uploaded icon ise
  if (iconText.startsWith('custom:')) {
    return iconText; // Render edilirken kontrol edilecek
  }
  
  // Eğer FA icon name ise resolve et
  if (iconText.startsWith('fa') || iconText.startsWith('Di')) {
    return resolveIcon(iconText);
  }
  
  const iconLower = iconText.toLowerCase();
  
  // Common service keywords
  if (iconLower.includes('web') || iconLower.includes('website')) return faLaptopCode;
  if (iconLower.includes('mobile') || iconLower.includes('app')) return faMobileAlt;
  if (iconLower.includes('design') || iconLower.includes('ui')) return faPalette;
  if (iconLower.includes('backend') || iconLower.includes('api')) return faServer;
  if (iconLower.includes('database')) return faDatabase;
  if (iconLower.includes('cloud')) return faCloud;
  if (iconLower.includes('ai') || iconLower.includes('ml')) return faBrain;
  if (iconLower.includes('devops') || iconLower.includes('deploy')) return faCogs;
  if (iconLower.includes('rocket') || iconLower.includes('launch')) return faRocket;
  
  // Default
  return faLaptopCode;
};

// Social icon mapping with override support
const getSocialIcon = (link: string, override?: string): IconDefinition => {
  if (override) {
    return resolveIcon(override);
  }
  
  const linkLower = link.toLowerCase();
  
  // Auto-detect based on URL
  if (linkLower.includes('github')) return faGithub;
  if (linkLower.includes('linkedin')) return faLinkedin;
  if (linkLower.includes('twitter')) return faTwitter;
  
  // Default
  return faGlobe;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const App = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchServices();
    fetchProfile();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      
      // ANA SAYFADA: Sadece DB'deki AKTIF projeleri göster
      // GitHub projeleri sadece admin panelinde içe aktarma için görünür
      const dbProjects = (data.result?.dbProjects || [])
        .filter((p: Project) => p.isActive) // Sadece aktif olanlar
        .map((p: Project) => ({ ...p, source: 'database' }));
      
      setProjects(dbProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/services/active`);
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile from:', `${API_URL}/profile`);
      const res = await fetch(`${API_URL}/profile`);
      console.log('Profile response status:', res.status);
      const data = await res.json();
      console.log('Profile data received:', data);
      console.log('Profile techStack:', data.profile?.techStack);
      setProfile(data.profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-brand">
            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              {profile?.name || 'Portfolio'}.DEV
            </a>
          </div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Hi, I'm {profile?.name || 'Developer'} 👋
          </h1>
          <p className="hero-subtitle">{profile?.title || 'Software Developer'}</p>
          <button className="cta-button" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            View My Work
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-card">
            <div className="about-avatar">
              <div className="avatar-placeholder">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span className="avatar-icon">👨‍💻</span>
                )}
              </div>
            </div>
            <div className="about-content">
              <h2>About Me</h2>
              <p>{profile?.bio || 'Loading...'}</p>
              <div className="tech-stack">
                {profile?.techStack?.map((tech, index) => {
                  const techName = typeof tech === 'string' ? tech : tech.name;
                  const icon = getTechIcon(tech);
                  const iconName = typeof tech === 'object' && tech.icon ? tech.icon : '';
                  
                  return (
                    <span key={index} className="tech-badge">
                      {iconName.startsWith('custom:') ? (
                        // Custom uploaded icon - URL string
                        <img 
                          src={iconName.replace('custom:', '')} 
                          alt={techName} 
                          className="tech-icon" 
                          style={{ width: '16px', height: '16px', objectFit: 'contain' }} 
                        />
                      ) : iconName.startsWith('Di') && typeof icon === 'function' ? (
                        // React Icons (Devicon) - icon bir React Component
                        createReactElement(icon, { className: "tech-icon", size: 16 })
                      ) : typeof icon === 'string' ? (
                        // Custom icon URL (getTechIcon'dan gelen)
                        <img 
                          src={icon.replace('custom:', '')} 
                          alt={techName} 
                          className="tech-icon" 
                          style={{ width: '16px', height: '16px', objectFit: 'contain' }} 
                        />
                      ) : (
                        // FontAwesome - icon bir IconDefinition
                        <FontAwesomeIcon icon={icon as IconDefinition} className="tech-icon" />
                      )}
                      {techName}
                    </span>
                  );
                }) || (
                  <>
                    <span className="tech-badge">
                      <FontAwesomeIcon icon={faJs} className="tech-icon" />
                      JavaScript
                    </span>
                    <span className="tech-badge">
                      <FontAwesomeIcon icon={faReact} className="tech-icon" />
                      React
                    </span>
                  </>
                )}
              </div>
              {profile?.cvUrl && (
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                  <button className="download-cv">
                    <FontAwesomeIcon icon={faFileAlt} /> Download CV
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Projects</h2>
            <div className="filter-buttons">
              <button 
                className={activeFilter === 'all' ? 'active' : ''} 
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={activeFilter === 'web' ? 'active' : ''} 
                onClick={() => setActiveFilter('web')}
              >
                Web
              </button>
              <button 
                className={activeFilter === 'game' ? 'active' : ''} 
                onClick={() => setActiveFilter('game')}
              >
                Game
              </button>
              <button 
                className={activeFilter === 'tools' ? 'active' : ''} 
                onClick={() => setActiveFilter('tools')}
              >
                Tools
              </button>
            </div>
          </div>

          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div 
                key={project._id} 
                className="project-card"
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-image">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="image-placeholder"></div>
                  )}
                  {(project as any).source === 'github' && (
                    <div className="github-badge">
                      <span>⭐ {(project as any).stars || 0}</span>
                    </div>
                  )}
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <div className="project-tags">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="tag">+{project.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content modal-project" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>
              ✕
            </button>
            
            {selectedProject.imageUrl && (
              <div className="modal-project-image">
                <img src={selectedProject.imageUrl} alt={selectedProject.title} />
              </div>
            )}
            
            <div className="modal-header">
              <h2>{selectedProject.title}</h2>
              <div className="modal-project-links">
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {selectedProject.link && selectedProject.link !== selectedProject.githubUrl && (
                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="modal-link modal-link-primary">
                    View Live →
                  </a>
                )}
              </div>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">{selectedProject.description}</p>
              
              <div className="modal-tags">
                <h3>Technologies:</h3>
                <div className="tags-list">
                  {selectedProject.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="modal-category">
                <span className="category-badge">{selectedProject.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <h2>Services</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div 
                key={service._id} 
                className="service-card"
                onClick={() => setSelectedService(service)}
              >
                <div className="service-icon">
                  {service.icon.startsWith('custom:') ? (
                    <img 
                      src={service.icon.replace('custom:', '')} 
                      alt={service.title} 
                      style={{ width: '3rem', height: '3rem', objectFit: 'contain' }} 
                    />
                  ) : service.icon.startsWith('Di') ? (
                    createReactElement(resolveIcon(service.icon), { size: 48 })
                  ) : (
                    <FontAwesomeIcon icon={getServiceIcon(service.icon)} />
                  )}
                </div>
                <h3>{service.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedService(null)}>
              ✕
            </button>
            <div className="modal-header">
              <div className="modal-icon">{selectedService.icon}</div>
              <h2>{selectedService.title}</h2>
            </div>
            <div className="modal-body">
              <p className="modal-description">{selectedService.description}</p>
              
              {selectedService.price && selectedService.price.min > 0 && (
                <div className="modal-price">
                  <span className="price-label">Price Range:</span>
                  <span className="price-value">
                    ${selectedService.price.min} - ${selectedService.price.max} {selectedService.price.currency}
                  </span>
                </div>
              )}

              {selectedService.features && selectedService.features.length > 0 && (
                <div className="modal-features">
                  <h3>Features:</h3>
                  <ul>
                    {selectedService.features.map((feature, index) => (
                      <li key={index}>
                        {typeof feature === 'string' ? (
                          feature
                        ) : (
                          <>
                            {feature.icon && (
                              feature.icon.startsWith('custom:') ? (
                                <img 
                                  src={feature.icon.replace('custom:', '')} 
                                  alt="feature icon" 
                                  className="feature-icon" 
                                  style={{ width: '1rem', height: '1rem', objectFit: 'contain', marginRight: '0.5rem' }} 
                                />
                              ) : feature.icon.startsWith('Di') ? (
                                createReactElement(resolveIcon(feature.icon), { className: "feature-icon", size: 16 })
                              ) : (
                                <FontAwesomeIcon icon={resolveIcon(feature.icon)} className="feature-icon" />
                              )
                            )}
                            {feature.text}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Get In Touch</h2>
          <form className="contact-form">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <textarea placeholder="Message" rows={5}></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>

      {/* Socials Section */}
      <section className="socials-section">
        <div className="container">
          <h2>Connect With Me</h2>
          <div className="socials-container">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="social-icon-link" title={profile.email}>
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            )}
            
            {profile?.phone && (
              <a href={`tel:${profile.phone}`} className="social-icon-link" title={profile.phone}>
                <FontAwesomeIcon icon={faPhone} />
              </a>
            )}

            {profile?.location && (
              <div className="social-icon-link" title={profile.location}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
            )}

            {profile?.socialLinks?.github && (
              <a href={profile.socialLinks.github} className="social-icon-link" target="_blank" rel="noopener noreferrer" title="GitHub">
                <FontAwesomeIcon icon={getSocialIcon(profile.socialLinks.github, profile.socialLinks.githubIcon)} />
              </a>
            )}

            {profile?.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} className="social-icon-link" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <FontAwesomeIcon icon={getSocialIcon(profile.socialLinks.linkedin, profile.socialLinks.linkedinIcon)} />
              </a>
            )}

            {profile?.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter} className="social-icon-link" target="_blank" rel="noopener noreferrer" title="Twitter">
                <FontAwesomeIcon icon={getSocialIcon(profile.socialLinks.twitter, profile.socialLinks.twitterIcon)} />
              </a>
            )}

            {profile?.socialLinks?.website && (
              <a href={profile.socialLinks.website} className="social-icon-link" target="_blank" rel="noopener noreferrer" title="Website">
                <FontAwesomeIcon icon={getSocialIcon(profile.socialLinks.website, profile.socialLinks.websiteIcon)} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {profile?.name?.toUpperCase() || 'TIMUJAPONYA'}.DEV. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
