import { useState, useEffect } from 'react';
import './AdminPanel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faSignOutAlt, 
  faUser, 
  faFolderOpen, 
  faBriefcase,
  faSave,
  faTrash,
  faEdit,
  faPlus,
  faTimes,
  faImage,
  faFileAlt,
  faUpload,
  faEye,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import IconPicker from './IconPicker';

interface Project {
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  category: 'web' | 'game' | 'tools';
  categoryIcon?: string;
  icon?: string;
  link?: string;
  githubUrl?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

interface Service {
  _id?: string;
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
  order: number;
  isActive: boolean;
}

interface Profile {
  _id?: string;
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'services'>('profile');
  const [projects, setProjects] = useState<Project[]>([]);
  const [githubProjects, setGithubProjects] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Check authentication on mount
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Environment variable'dan şifre al
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'authenticated');
      showNotification('Giriş başarılı!', 'success');
    } else {
      showNotification('Hatalı şifre!', 'error');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    showNotification('Çıkış yapıldı', 'success');
  };

  // Fetch data
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchServices();
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      console.log('Admin - Projects data:', data);
      
      // Admin panelinde sadece DB projelerini göster (düzenlenebilir)
      const dbProjects = data.result?.dbProjects || [];
      setProjects(dbProjects);
      
      // GitHub projelerini de saklayalım (DB'ye aktarma için)
      const githubRepos = data.result?.githubRepositories || [];
      console.log('Admin - GitHub repos:', githubRepos);
      setGithubProjects(githubRepos.filter((repo: any) => !repo.fork && !repo.archived));
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]);
      setGithubProjects([]);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/services`);
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`);
      const data = await res.json();
      setProfile(data.profile || null);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  // Project CRUD
  const handleSaveProject = async (project: Project) => {
    try {
      const method = project._id ? 'PUT' : 'POST';
      const url = project._id ? `${API_URL}/projects/${project._id}` : `${API_URL}/projects`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (res.ok) {
        fetchProjects();
        setEditingProject(null);
        showNotification(project._id ? 'Proje güncellendi!' : 'Proje eklendi!', 'success');
      } else {
        showNotification('İşlem başarısız oldu', 'error');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      showNotification('Bir hata oluştu', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;
    
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
        showNotification('Proje silindi', 'success');
      } else {
        showNotification('Silme işlemi başarısız', 'error');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      showNotification('Bir hata oluştu', 'error');
    }
  };

  // Service CRUD
  const handleSaveService = async (service: Service) => {
    try {
      const method = service._id ? 'PUT' : 'POST';
      const url = service._id ? `${API_URL}/services/${service._id}` : `${API_URL}/services`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });

      if (res.ok) {
        fetchServices();
        setEditingService(null);
        showNotification(service._id ? 'Servis güncellendi!' : 'Servis eklendi!', 'success');
      } else {
        showNotification('İşlem başarısız oldu', 'error');
      }
    } catch (err) {
      console.error('Error saving service:', err);
      showNotification('Bir hata oluştu', 'error');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Bu servisi silmek istediğinizden emin misiniz?')) return;
    
    try {
      const res = await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchServices();
        showNotification('Servis silindi', 'success');
      } else {
        showNotification('Silme işlemi başarısız', 'error');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      showNotification('Bir hata oluştu', 'error');
    }
  };

  // Profile Update
  const handleSaveProfile = async (profileData: Profile) => {
    try {
      console.log('handleSaveProfile received:', profileData);
      console.log('TechStack in handleSaveProfile:', profileData.techStack);
      
      const method = profileData._id ? 'PUT' : 'POST';
      const url = profileData._id ? `${API_URL}/profile/${profileData._id}` : `${API_URL}/profile`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        fetchProfile();
        showNotification('Profil güncellendi!', 'success');
      } else {
        showNotification('İşlem başarısız oldu', 'error');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      showNotification('Bir hata oluştu', 'error');
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.type === 'success' ? '✅' : '❌'} {notification.message}
          </div>
        )}
        
        <div className="login-container">
          <div className="login-box">
            <h1>🔐 Admin Girişi</h1>
            <p>Admin paneline erişim için şifre gereklidir</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                autoFocus
              />
              <button type="submit" className="login-button">
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? '✅' : '❌'} {notification.message}
        </div>
      )}
      
      <div className="admin-header">
        <div className="header-content">
          <h1>Admin Panel</h1>
          <div className="header-buttons">
            <button onClick={() => window.location.href = '/'} className="home-button">
              <FontAwesomeIcon icon={faHome} /> Ana Sayfa
            </button>
            <button onClick={handleLogout} className="logout-button">
              <FontAwesomeIcon icon={faSignOutAlt} /> Çıkış Yap
            </button>
          </div>
        </div>
        <div className="admin-tabs">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            <FontAwesomeIcon icon={faUser} /> Profil
          </button>
          <button 
            className={activeTab === 'projects' ? 'active' : ''} 
            onClick={() => setActiveTab('projects')}
          >
            <FontAwesomeIcon icon={faFolderOpen} /> Projeler ({projects.length})
          </button>
          <button 
            className={activeTab === 'services' ? 'active' : ''} 
            onClick={() => setActiveTab('services')}
          >
            <FontAwesomeIcon icon={faBriefcase} /> Servisler ({services.length})
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'profile' && (
          <ProfileEditor profile={profile} onSave={handleSaveProfile} />
        )}

        {activeTab === 'projects' && (
          <ProjectsManager
            projects={projects}
            githubProjects={githubProjects}
            editingProject={editingProject}
            onEdit={setEditingProject}
            onSave={handleSaveProject}
            onDelete={handleDeleteProject}
            onRefresh={fetchProjects}
          />
        )}

        {activeTab === 'services' && (
          <ServicesManager
            services={services}
            editingService={editingService}
            onEdit={setEditingService}
            onSave={handleSaveService}
            onDelete={handleDeleteService}
          />
        )}
      </div>
    </div>
  );
};

// Profile Editor Component
const ProfileEditor = ({ profile, onSave }: { profile: Profile | null; onSave: (profile: Profile) => void }) => {
  const [formData, setFormData] = useState<Profile>(profile || {
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    avatarUrl: '',
    cvUrl: '',
    socialLinks: { 
      github: '', 
      linkedin: '', 
      twitter: '', 
      website: '',
      githubIcon: '',
      linkedinIcon: '',
      twitterIcon: '',
      websiteIcon: ''
    },
    techStack: []
  });
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (profile) {
      // Tech stack'i normalize et - eski format (string[]) yeni formata (object[]) çevir
      const normalizedProfile = {
        ...profile,
        techStack: profile.techStack?.map((tech: any) => {
          if (typeof tech === 'string') {
            return { name: tech, icon: 'faCode' };
          }
          return tech;
        }) || [],
        socialLinks: {
          github: profile.socialLinks?.github || '',
          linkedin: profile.socialLinks?.linkedin || '',
          twitter: profile.socialLinks?.twitter || '',
          website: profile.socialLinks?.website || '',
          githubIcon: profile.socialLinks?.githubIcon || '',
          linkedinIcon: profile.socialLinks?.linkedinIcon || '',
          twitterIcon: profile.socialLinks?.twitterIcon || '',
          websiteIcon: profile.socialLinks?.websiteIcon || ''
        }
      };
      setFormData(normalizedProfile);
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Resim dosyası kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası yükleyin!');
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır!');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    setUploadingAvatar(true);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, avatarUrl: data.url });
      } else {
        alert('Avatar yükleme başarısız: ' + data.message);
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      alert('Avatar yüklenirken hata oluştu');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // CV dosyası kontrolü (PDF)
    if (file.type !== 'application/pdf') {
      alert('Lütfen sadece PDF dosyası yükleyin!');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    setUploadingCV(true);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, cvUrl: data.url });
      } else {
        alert('CV yükleme başarısız: ' + data.message);
      }
    } catch (err) {
      console.error('CV upload error:', err);
      alert('CV yüklenirken hata oluştu');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving profile with data:', formData);
    console.log('Tech stack:', formData.techStack);
    onSave(formData);
  };

  const addTech = () => {
    const name = prompt('Teknoloji adı:');
    if (name) {
      setFormData({ 
        ...formData, 
        techStack: [...formData.techStack, { name, icon: 'faCode' }] 
      });
    }
  };

  const removeTech = (index: number) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((_, i) => i !== index)
    });
  };

  const updateTechIcon = (index: number, icon: string) => {
    const updated = [...formData.techStack];
    updated[index] = { ...updated[index], icon };
    setFormData({ ...formData, techStack: updated });
  };

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <h2>Profil Bilgileri</h2>
      
      <div className="form-group">
        <label>İsim</label>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Ünvan</label>
        <input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Biyografi</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefon</label>
          <input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Konum</label>
        <input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Avatar (Profil Fotoğrafı)</label>
          <div className="file-upload-section">
            <div className="upload-options">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                id="avatar-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="avatar-upload" className="upload-button">
                {uploadingAvatar ? (
                  <>
                    <FontAwesomeIcon icon={faUpload} spin /> Yükleniyor...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faImage} /> Resim Yükle
                  </>
                )}
              </label>
              <span className="upload-divider">veya</span>
              <input
                type="url"
                placeholder="Avatar URL girin"
                value={formData.avatarUrl || ''}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="url-input avatar-url-input"
              />
            </div>
            {formData.avatarUrl && (
              <div className="file-preview avatar-preview">
                <img src={formData.avatarUrl} alt="Avatar Preview" className="avatar-preview-img" />
                <div className="preview-actions">
                  <a href={formData.avatarUrl} target="_blank" rel="noopener noreferrer" className="view-file-btn">
                    <FontAwesomeIcon icon={faEye} /> Görüntüle
                  </a>
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, avatarUrl: '' })} 
                    className="remove-file-btn"
                  >
                    <FontAwesomeIcon icon={faTimes} /> Kaldır
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>CV Dosyası veya Link</label>
          <div className="file-upload-section">
            <div className="upload-options">
              <input
                type="file"
                accept=".pdf"
                onChange={handleCVUpload}
                disabled={uploadingCV}
                id="cv-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="cv-upload" className="upload-button">
                {uploadingCV ? (
                  <>
                    <FontAwesomeIcon icon={faUpload} spin /> Yükleniyor...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faFileAlt} /> PDF Yükle
                  </>
                )}
              </label>
              <span className="upload-divider">veya</span>
              <input
                type="url"
                placeholder="CV linki girin (örn: https://...)"
                value={formData.cvUrl || ''}
                onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                className="url-input cv-url-input"
              />
            </div>
            {formData.cvUrl && (
              <div className="file-preview">
                <a href={formData.cvUrl} target="_blank" rel="noopener noreferrer" className="view-file-btn">
                  <FontAwesomeIcon icon={formData.cvUrl.includes('http') ? faGlobe : faFileAlt} />
                  {' '}{formData.cvUrl.includes('http') ? 'Linki Aç' : 'PDF Görüntüle'}
                </a>
                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, cvUrl: '' })} 
                  className="remove-file-btn"
                >
                  <FontAwesomeIcon icon={faTimes} /> Kaldır
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3>Sosyal Medya</h3>
      <div className="form-row">
        <div className="form-group">
          <label>GitHub</label>
          <input
            type="url"
            placeholder="https://github.com/kullaniciadi"
            value={formData.socialLinks.github}
            onChange={(e) => setFormData({
              ...formData,
              socialLinks: { ...formData.socialLinks, github: e.target.value }
            })}
          />
          {formData.socialLinks.github && (
            <IconPicker 
              value={formData.socialLinks.githubIcon || 'faGithub'}
              onChange={(icon) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, githubIcon: icon }
              })}
              label="GitHub Icon Override"
            />
          )}
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/kullaniciadi"
            value={formData.socialLinks.linkedin}
            onChange={(e) => setFormData({
              ...formData,
              socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
            })}
          />
          {formData.socialLinks.linkedin && (
            <IconPicker 
              value={formData.socialLinks.linkedinIcon || 'faLinkedin'}
              onChange={(icon) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, linkedinIcon: icon }
              })}
              label="LinkedIn Icon Override"
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Twitter</label>
          <input
            type="url"
            placeholder="https://twitter.com/kullaniciadi"
            value={formData.socialLinks.twitter}
            onChange={(e) => setFormData({
              ...formData,
              socialLinks: { ...formData.socialLinks, twitter: e.target.value }
            })}
          />
          {formData.socialLinks.twitter && (
            <IconPicker 
              value={formData.socialLinks.twitterIcon || 'faTwitter'}
              onChange={(icon) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, twitterIcon: icon }
              })}
              label="Twitter Icon Override"
            />
          )}
        </div>

        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            placeholder="https://websiteadi.com"
            value={formData.socialLinks.website}
            onChange={(e) => setFormData({
              ...formData,
              socialLinks: { ...formData.socialLinks, website: e.target.value }
            })}
          />
          {formData.socialLinks.website && (
            <IconPicker 
              value={formData.socialLinks.websiteIcon || 'faGlobe'}
              onChange={(icon) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, websiteIcon: icon }
              })}
              label="Website Icon Override"
            />
          )}
        </div>
      </div>

      <h3>Beceriler</h3>
      <div className="form-group">
        <label>Tech Stack</label>
        <div className="tech-stack-list">
          {formData.techStack.map((tech, index) => (
            <div key={index} className="tech-stack-item">
              <div className="tech-stack-item-header">
                <span>{tech.name}</span>
                <button type="button" onClick={() => removeTech(index)} className="remove-tech">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <IconPicker 
                value={tech.icon || 'faCode'}
                onChange={(icon) => updateTechIcon(index, icon)}
                label="Icon"
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={addTech} className="add-tech-btn">
          <FontAwesomeIcon icon={faPlus} /> Yeni Teknoloji Ekle
        </button>
      </div>

      <button type="submit" className="save-btn">
        <FontAwesomeIcon icon={faSave} /> Kaydet
      </button>
    </form>
  );
};

// Projects Manager Component
const ProjectsManager = ({ projects, githubProjects, editingProject, onEdit, onSave, onDelete, onRefresh }: any) => {
  // Güvenlik kontrolü - projects array değilse boş array kullan
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeGithubProjects = Array.isArray(githubProjects) ? githubProjects : [];

  const [formData, setFormData] = useState<Project>({
    _id: '',
    title: '',
    description: '',
    tags: [],
    category: 'web',
    categoryIcon: 'faCode',
    icon: 'faLaptopCode',
    link: '',
    githubUrl: '',
    imageUrl: '',
    order: 0,
    isActive: true
  });

  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setFormData({
        ...editingProject,
        tags: editingProject.tags || []
      });
    }
  }, [editingProject]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır!');
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Sadece resim dosyaları yüklenebilir!');
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, imageUrl: data.url });
      } else {
        alert('Resim yükleme başarısız oldu');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Başlık zorunludur!');
      return;
    }
    onSave(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      _id: '',
      title: '',
      description: '',
      tags: [],
      category: 'web',
      link: '',
      githubUrl: '',
      imageUrl: '',
      order: 0,
      isActive: true
    });
    setTagInput('');
    onEdit(null);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="manager-container">
      <div className="items-list">
        <div className="list-header">
          <h2>
            <FontAwesomeIcon icon={faFolderOpen} /> Projeler ({safeProjects.length})
          </h2>
          <button onClick={() => { resetForm(); }} className="new-item-btn">
            <FontAwesomeIcon icon={faPlus} /> Yeni Proje
          </button>
        </div>
        
        {safeProjects.length === 0 ? (
          <div className="empty-state">
            <p>🔍 Henüz proje eklenmemiş</p>
            <p className="empty-state-hint">Sağdaki formu kullanarak yeni proje ekleyebilirsiniz</p>
          </div>
        ) : (
          safeProjects.map((project: Project) => (
            <div key={project._id} className="item-card">
              <div className="item-card-header">
                <h3>{project.title}</h3>
                <span className={`status-badge ${project.isActive ? 'active' : 'inactive'}`}>
                  {project.isActive ? '✓ Aktif' : '✗ Pasif'}
                </span>
              </div>
              <p className="item-description">{project.description || 'Açıklama yok'}</p>
              
              <div className="item-meta">
                <span className="category-badge category-{project.category}">
                  {project.category === 'web' ? '🌐' : project.category === 'game' ? '🎮' : '🛠️'} 
                  {project.category}
                </span>
                {project.tags && project.tags.length > 0 && (
                  <div className="tags-preview">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="tag-mini">{tag}</span>
                    ))}
                    {project.tags.length > 3 && <span className="tag-mini">+{project.tags.length - 3}</span>}
                  </div>
                )}
              </div>

              <div className="item-actions">
                <button onClick={() => onEdit(project)} className="edit-btn">
                  <FontAwesomeIcon icon={faEdit} /> Düzenle
                </button>
                <button onClick={() => onDelete(project._id)} className="delete-btn">
                  <FontAwesomeIcon icon={faTrash} /> Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="editor-panel">
        <h2>
          <FontAwesomeIcon icon={editingProject ? faEdit : faPlus} />
          {' '}{editingProject ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
        </h2>
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label>Başlık *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Proje adı"
              required
            />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Proje hakkında kısa açıklama"
            />
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="web">🌐 Web</option>
              <option value="game">🎮 Game</option>
              <option value="tools">🛠️ Tools</option>
            </select>
          </div>

          <IconPicker 
            value={formData.icon || 'faLaptopCode'}
            onChange={(icon) => setFormData({ ...formData, icon })}
            label="Proje İkonu (Opsiyonel)"
          />

          <IconPicker 
            value={formData.categoryIcon || 'faCode'}
            onChange={(icon) => setFormData({ ...formData, categoryIcon: icon })}
            label="Kategori İkonu (Opsiyonel)"
          />

          <div className="form-group">
            <label>Etiketler (Tags)</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Etiket ekle (Enter ile)"
              />
              <button type="button" onClick={addTag} className="add-tag-inline-btn">
                Ekle
              </button>
            </div>
            <div className="tech-stack-editor">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tech-item">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Proje Linki</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label>GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="form-group">
            <label>Proje Görseli</label>
            <div className="image-upload-section">
              <div className="upload-options">
                <div className="upload-option">
                  <label className="upload-btn">
                    {uploading ? '📤 Yükleniyor...' : '📁 Resim Yükle'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className="upload-hint">veya</span>
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Görsel URL'si girin"
                  className="url-input"
                />
              </div>
            </div>
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl} alt="Preview" />
                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, imageUrl: '' })}
                  className="remove-image-btn"
                >
                  ✖️ Görseli Kaldır
                </button>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sıra (Küçük önce görünür)</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Aktif (Ana sayfada göster)</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FontAwesomeIcon icon={editingProject ? faSave : faPlus} />
              {' '}{editingProject ? 'Güncelle' : 'Ekle'}
            </button>
            {editingProject && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                <FontAwesomeIcon icon={faTimes} /> İptal
              </button>
            )}
          </div>
        </form>

        {/* Bilgilendirme */}
        {!editingProject && safeGithubProjects.length === 0 && (
          <div className="info-box">
            <p>ℹ️ <strong>GitHub Entegrasyonu:</strong> GitHub projeleriniz yüklenirken sorun oluştu veya hiç public repo yok.</p>
            <p>Token kontrolü için: <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">GitHub Settings → Tokens</a></p>
          </div>
        )}

        {/* GitHub Projelerini İçe Aktar - Token varsa göster */}
        {!editingProject && safeGithubProjects.length > 0 && (
          <div className="github-import-section">
            <h3>
              <FontAwesomeIcon icon={faGithub} /> GitHub Projelerini İçe Aktar
            </h3>
            <p className="import-hint">Aşağıdaki GitHub projelerinizi veritabanına ekleyerek düzenleyebilirsiniz</p>
            <div className="github-projects-grid">
              {safeGithubProjects.map((repo: any) => {
                // Bu proje DB'de var mı kontrol et
                const existsInDb = safeProjects.some((p: Project) => 
                  p.githubUrl?.toLowerCase() === repo.html_url.toLowerCase() ||
                  p.title.toLowerCase() === repo.name.toLowerCase()
                );

                return (
                  <div key={repo.id} className={`github-project-card ${existsInDb ? 'already-imported' : ''}`}>
                    <div className="github-card-header">
                      <h4>{repo.name}</h4>
                      {repo.stargazers_count > 0 && (
                        <span className="stars">⭐ {repo.stargazers_count}</span>
                      )}
                    </div>
                    <p className="github-description">{repo.description || 'Açıklama yok'}</p>
                    {repo.language && (
                      <span className="language-badge">{repo.language}</span>
                    )}
                    {existsInDb ? (
                      <button className="import-btn already-added" disabled>
                        ✓ Zaten Eklendi
                      </button>
                    ) : (
                      <button 
                        onClick={() => importGithubProject(repo)} 
                        className="import-btn"
                      >
                        ➕ DB'ye Ekle
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // GitHub projesini DB'ye aktarma fonksiyonu
  function importGithubProject(repo: any) {
    // Önce bu proje DB'de var mı kontrol et
    const alreadyExists = safeProjects.some((p: Project) => 
      p.githubUrl?.toLowerCase() === repo.html_url.toLowerCase() ||
      p.title.toLowerCase() === repo.name.toLowerCase()
    );

    if (alreadyExists) {
      alert(`⚠️ "${repo.name}" projesi zaten veritabanında mevcut!`);
      return;
    }

    // Kullanıcıya onay sor
    if (!confirm(`"${repo.name}" projesini veritabanına eklemek istediğinizden emin misiniz?`)) {
      return;
    }

    const projectData: Project = {
      title: repo.name,
      description: repo.description || '',
      tags: repo.topics || [repo.language].filter(Boolean),
      category: repo.topics?.includes('game') ? 'game' : 
               repo.topics?.includes('tool') ? 'tools' : 'web',
      link: repo.homepage || repo.html_url,
      githubUrl: repo.html_url,
      imageUrl: `https://opengraph.githubassets.com/1/Timujaponya/${repo.name}`,
      order: 0,
      isActive: true
    };
    onSave(projectData);
    setTimeout(() => onRefresh(), 500); // Yenile
  }
};

// Services Manager Component
const ServicesManager = ({ services, editingService, onEdit, onSave, onDelete }: any) => {
  const [formData, setFormData] = useState<Service>({
    title: '',
    description: '',
    icon: 'faLaptopCode',
    price: { min: 0, max: 0, currency: 'USD' },
    features: [],
    order: 0,
    isActive: true
  });

  useEffect(() => {
    if (editingService) {
      setFormData(editingService);
    }
  }, [editingService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '💻',
      price: { min: 0, max: 0, currency: 'USD' },
      features: [],
      order: 0,
      isActive: true
    });
    onEdit(null);
  };

  const addFeature = () => {
    const text = prompt('Özellik:');
    if (text) {
      setFormData({ 
        ...formData, 
        features: [...formData.features, { text, icon: 'faCheck' }] 
      });
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const updateFeatureIcon = (index: number, icon: string) => {
    const updated = [...formData.features];
    updated[index] = { ...updated[index], icon };
    setFormData({ ...formData, features: updated });
  };

  return (
    <div className="manager-container">
      <div className="items-list">
        <div className="list-header">
          <h2>
            <FontAwesomeIcon icon={faBriefcase} /> Servisler ({services.length})
          </h2>
          <button onClick={() => { resetForm(); }} className="new-item-btn">
            <FontAwesomeIcon icon={faPlus} /> Yeni Servis
          </button>
        </div>
        
        {services.length === 0 ? (
          <div className="empty-state">
            <p>🔍 Henüz servis eklenmemiş</p>
            <p className="empty-state-hint">Sağdaki formu kullanarak yeni servis ekleyebilirsiniz</p>
          </div>
        ) : (
          services.map((service: Service) => (
            <div key={service._id} className="item-card">
              <div className="item-card-header">
                <div className="service-header-content">
                  <div className="service-icon-large">{service.icon}</div>
                  <h3>{service.title}</h3>
                </div>
                <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                  {service.isActive ? '✓ Aktif' : '✗ Pasif'}
                </span>
              </div>
              <p className="item-description">{service.description}</p>
              <p className="price">
                💰 {service.price.min} - {service.price.max} {service.price.currency}
              </p>
              {service.features && service.features.length > 0 && (
                <div className="service-features-preview">
                  <span className="features-count">📋 {service.features.length} özellik</span>
                </div>
              )}
              <div className="item-actions">
                <button onClick={() => onEdit(service)} className="edit-btn">
                  <FontAwesomeIcon icon={faEdit} /> Düzenle
                </button>
                <button onClick={() => onDelete(service._id)} className="delete-btn">
                  <FontAwesomeIcon icon={faTrash} /> Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="editor-panel">
        <h2>
          <FontAwesomeIcon icon={editingService ? faEdit : faPlus} />
          {' '}{editingService ? 'Servis Düzenle' : 'Yeni Servis Ekle'}
        </h2>
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label>Başlık</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <IconPicker 
            value={formData.icon}
            onChange={(icon) => setFormData({ ...formData, icon })}
            label="Servis İkonu"
          />

          <h4>Fiyat</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Min</label>
              <input
                type="number"
                value={formData.price.min}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, min: parseInt(e.target.value) }
                })}
              />
            </div>

            <div className="form-group">
              <label>Max</label>
              <input
                type="number"
                value={formData.price.max}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, max: parseInt(e.target.value) }
                })}
              />
            </div>

            <div className="form-group">
              <label>Para Birimi</label>
              <select
                value={formData.price.currency}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, currency: e.target.value }
                })}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="TRY">TRY</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Özellikler</label>
            <div className="features-list">
              {formData.features.map((feature, index) => (
                <div key={index} className="feature-item-editor">
                  <div className="feature-item-header">
                    <span>{feature.text}</span>
                    <button type="button" onClick={() => removeFeature(index)} className="remove-feature">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  <IconPicker 
                    value={feature.icon || 'faCheck'}
                    onChange={(icon) => updateFeatureIcon(index, icon)}
                    label="Icon"
                  />
                </div>
              ))}
            </div>
            <button type="button" onClick={addFeature} className="add-tech-btn">
              <FontAwesomeIcon icon={faPlus} /> Yeni Özellik Ekle
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sıra (Küçük önce görünür)</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Aktif (Ana sayfada göster)</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FontAwesomeIcon icon={editingService ? faSave : faPlus} />
              {' '}{editingService ? 'Güncelle' : 'Ekle'}
            </button>
            {editingService && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                <FontAwesomeIcon icon={faTimes} /> İptal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
