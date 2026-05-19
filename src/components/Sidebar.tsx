import { Home, Award, Sun, Moon, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  theme: string;
  onThemeToggle: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  theme,
  onThemeToggle,
  isCollapsed,
  setIsCollapsed,
}) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'portfolio', label: 'Portfolio', icon: Award },
  ];

  return (
    <>
      {/* Sidebar Layout for Desktop */}
      <aside className={`sidebar-aside ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Logo / Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-glow"></div>
          <div className="brand-icon-wrapper">
            <Play className="paddle-logo-icon" fill="var(--color-accent)" size={20} />
          </div>
          {!isCollapsed && <span className="brand-text">MelPB</span>}
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="nav-icon-wrapper">
                  <Icon size={20} />
                </div>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
                {isActive && !isCollapsed && <span className="active-indicator"></span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="sidebar-footer">
          {/* Theme Toggle Button */}
          <button
            onClick={onThemeToggle}
            className="footer-btn theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} className="sun-pulse" /> : <Moon size={20} />}
            {!isCollapsed && <span className="footer-label">{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>}
          </button>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="footer-btn collapse-toggle-btn"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!isCollapsed && <span className="footer-label">Collapse Menu</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
        {/* Mobile Theme Toggle */}
        <button onClick={onThemeToggle} className="mobile-nav-btn theme-btn">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="mobile-nav-label">Theme</span>
        </button>
      </nav>
    </>
  );
};
