import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
// React Icons - Devicon seti için
import * as DevIcons from 'react-icons/di';
import './IconPicker.css';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  allowCustomUpload?: boolean; // Özel icon yüklemeye izin ver
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Font Awesome + Devicon icon setlerini birleştir
const getAllIcons = () => {
  const icons: { [key: string]: IconDefinition | any } = {};
  
  // Solid icons
  Object.keys(SolidIcons).forEach((key) => {
    if (key.startsWith('fa') && key !== 'fas' && key !== 'far' && key !== 'fal' && key !== 'fad' && key !== 'fab') {
      icons[key] = (SolidIcons as any)[key];
    }
  });
  
  // Brand icons
  Object.keys(BrandIcons).forEach((key) => {
    if (key.startsWith('fa') && key !== 'fab') {
      icons[key] = (BrandIcons as any)[key];
    }
  });
  
  // Devicon icons (C++, C#, Unity, Unreal, vs.)
  Object.keys(DevIcons).forEach((key) => {
    if (key.startsWith('Di')) {
      icons[key] = (DevIcons as any)[key];
    }
  });
  
  return icons;
};

const iconCategories = {
  'Programming Languages': [
    'DiJavascript1', 'DiPython', 'DiJava', 'DiPhp', 'DiRuby', 'DiGo', 'DiRust', 
    'DiCss3Full', 'DiHtml5', 'DiSwift', 'DiKotlin', 'DiScala', 
    'DiPerl', 'DiLua', 'DiGroovy', 'DiClojure', 'DiErlang', 'DiElixir'
  ],
  'Frameworks & Libraries': [
    'DiReact', 'DiNodejsSmall', 'DiDjango', 'DiLaravel', 'DiSymfony', 'DiCodeigniter',
    'DiAngular', 'DiVuejs', 'DiBootstrap', 'DiMaterializecss', 'DiBackbone', 'DiEmber',
    'DiDotnet', 'DiJqueryLogo', 'DiNpm', 'DiYarn'
  ],
  'Game Development': [
    'DiUnitySmall', 'faGamepad', 'faDice', 'faPuzzlePiece', 'faVrCardboard'
  ],
  'Databases': [
    'DiMongodb', 'DiMysql', 'DiPostgresql', 'DiRedis', 'DiSqllite', 'DiDatabase',
    'faDatabase', 'faServer'
  ],
  'Tools & Platforms': [
    'DiGit', 'DiGithubBadge', 'DiDocker', 'DiJenkins', 'DiLinux', 'DiUbuntu',
    'DiWindows', 'DiApple', 'DiAndroid', 'DiAws', 'DiHeroku', 'DiNginx',
    'DiVisualstudio', 'DiSublime', 'DiAtom', 'DiIntellij', 'DiEclipse'
  ],
  'Web & Development': ['faCode', 'faLaptopCode', 'faServer', 'faCloud', 'faCogs', 'faTerminal', 'faBug', 'faFileCode'],
  'Design & UI': ['faPalette', 'faPaintBrush', 'faMagic', 'faEye', 'faImage', 'faCrop', 'faFillDrip'],
  'Mobile': ['faMobileAlt', 'faTabletAlt', 'faPhoneAlt', 'faMobile', 'faSimCard'],
  'Business': ['faBriefcase', 'faChartLine', 'faHandshake', 'faMoneyBill', 'faChartBar', 'faClipboard'],
  'Communication': ['faEnvelope', 'faComment', 'faComments', 'faPhone', 'faVideo', 'faBell'],
  'Social Media': ['faFacebook', 'faTwitter', 'faLinkedin', 'faGithub', 'faInstagram', 'faYoutube', 'faDiscord', 'faSlack'],
  'Technology': ['faReact', 'faNodeJs', 'faPython', 'faJs', 'faHtml5', 'faCss3Alt', 'faDocker', 'faGit', 'faAws', 'faVuejs', 'faAngular'],
  'General': ['faStar', 'faHeart', 'faCheck', 'faTimes', 'faPlus', 'faMinus', 'faArrowRight', 'faHome', 'faUser', 'faGlobe'],
  'Files & Folders': ['faFile', 'faFileAlt', 'faFolder', 'faFolderOpen', 'faDownload', 'faUpload', 'faSave'],
  'Other': ['faRocket', 'faLightbulb', 'faTrophy', 'faGift', 'faCoffee', 'faBolt', 'faFire', 'faBrain']
};

const IconPicker = ({ value, onChange, label = 'Icon Seç', allowCustomUpload = true }: IconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxDisplay, setMaxDisplay] = useState(200); // Başlangıçta 200 icon göster
  const [uploading, setUploading] = useState(false);
  
  const allIcons = getAllIcons();
  
  // Kategori veya arama değiştiğinde limiti resetle
  useEffect(() => {
    setMaxDisplay(200);
  }, [selectedCategory, search]);
  
  // Custom icon upload
  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Dosya tipini kontrol et (SVG, PNG, JPG)
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Sadece SVG, PNG, JPG veya WebP dosyaları yükleyebilirsiniz.');
      return;
    }
    
    // Dosya boyutunu kontrol et (max 500KB)
    if (file.size > 500 * 1024) {
      alert('Dosya boyutu 500KB\'dan küçük olmalıdır.');
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('icon', file);
      
      console.log('Uploading icon to:', `${API_URL}/upload/icon`);
      console.log('File:', file.name, file.type, file.size);
      
      const res = await fetch(`${API_URL}/upload/icon`, {
        method: 'POST',
        body: formData
      });
      
      console.log('Upload response status:', res.status);
      const data = await res.json();
      console.log('Upload response data:', data);
      
      if (res.ok) {
        // Custom icon URL'ini döndür - "custom:" prefix ile işaretle
        onChange(`custom:${data.url}`);
        setIsOpen(false);
        setSearch('');
      } else {
        alert(`Icon yüklenirken hata oluştu: ${data.message || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Icon yüklenirken hata oluştu: ${error}`);
    } finally {
      setUploading(false);
    }
  };
  
  // Filtreleme
  const getFilteredIcons = () => {
    let iconList = Object.keys(allIcons);
    
    // Kategori filtresi
    if (selectedCategory !== 'All') {
      const categoryIcons = iconCategories[selectedCategory as keyof typeof iconCategories] || [];
      iconList = iconList.filter(key => categoryIcons.includes(key));
    }
    
    // Arama filtresi
    if (search) {
      iconList = iconList.filter(key => 
        key.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return iconList;
  };
  
  const allFilteredIcons = getFilteredIcons();
  const filteredIcons = allFilteredIcons.slice(0, maxDisplay);
  
  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearch('');
  };
  
  // Icon render helper - FontAwesome, React Icons veya Custom Upload
  const renderIcon = (iconName: string) => {
    // Custom uploaded icon ise
    if (iconName.startsWith('custom:')) {
      const iconUrl = iconName.replace('custom:', '');
      return <img src={iconUrl} alt="custom icon" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />;
    }
    
    const icon = allIcons[iconName];
    if (!icon) return null;
    
    // Eğer React Icons (Devicon) ise
    if (iconName.startsWith('Di')) {
      const IconComponent = icon;
      return <IconComponent size={20} />;
    }
    
    // FontAwesome ise
    return <FontAwesomeIcon icon={icon} />;
  };
  
  return (
    <div className="icon-picker">
      <label>{label}</label>
      
      <div className="icon-picker-display" onClick={() => setIsOpen(!isOpen)}>
        {value && allIcons[value] ? (
          <div className="selected-icon">
            {renderIcon(value)}
            <span>{value}</span>
          </div>
        ) : (
          <span className="placeholder">Icon Seç...</span>
        )}
        <span className="dropdown-arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="icon-picker-dropdown">
          <div className="icon-picker-header">
            <input
              type="text"
              placeholder="Icon ara... (örn: code, heart, react)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="icon-search"
              autoFocus
            />
            
            <div className="icon-categories">
              <button
                className={selectedCategory === 'All' ? 'active' : ''}
                onClick={() => setSelectedCategory('All')}
              >
                Tümü
              </button>
              {Object.keys(iconCategories).map((category) => (
                <button
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Custom Icon Upload */}
            {allowCustomUpload && (
              <div className="custom-upload-section">
                <label htmlFor="custom-icon-upload" className="upload-label">
                  {uploading ? (
                    <span>📤 Yükleniyor...</span>
                  ) : (
                    <>
                      <span>📁 Özel Icon Yükle</span>
                      <small>(SVG, PNG, JPG - Max 500KB)</small>
                    </>
                  )}
                </label>
                <input
                  id="custom-icon-upload"
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.webp"
                  onChange={handleCustomUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </div>
            )}
          </div>
          
          <div className="icon-picker-grid">
            {filteredIcons.length === 0 ? (
              <div className="no-icons">Icon bulunamadı</div>
            ) : (
              filteredIcons.map((iconName) => (
                <div
                  key={iconName}
                  className={`icon-option ${value === iconName ? 'selected' : ''}`}
                  onClick={() => handleSelect(iconName)}
                  title={iconName}
                >
                  {renderIcon(iconName)}
                </div>
              ))
            )}
          </div>
          
          {/* Daha fazla yükle butonu */}
          {allFilteredIcons.length > filteredIcons.length && (
            <div className="load-more-container">
              <button 
                onClick={() => setMaxDisplay(maxDisplay + 200)} 
                className="load-more-btn"
              >
                Daha Fazla ({filteredIcons.length} / {allFilteredIcons.length})
              </button>
            </div>
          )}
          
          <div className="icon-picker-footer">
            <button onClick={() => setIsOpen(false)} className="close-picker">
              Kapat
            </button>
            {value && (
              <button onClick={() => { onChange(''); setIsOpen(false); }} className="clear-icon">
                Temizle
              </button>
            )}
          </div>
        </div>
      )}
      
      {isOpen && <div className="icon-picker-backdrop" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default IconPicker;
