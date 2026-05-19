import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Home } from './views/Home';
import { Portfolio } from './views/Portfolio';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync hash with view state for out-of-the-box GitHub Pages support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validViews = ['home', 'portfolio'];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
      } else {
        setCurrentView('home');
        window.location.hash = 'home';
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update HTML data-theme attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleViewChange = (view: string) => {
    window.location.hash = view;
    setCurrentView(view);
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderView = () => {
    switch (currentView) {
      case 'portfolio':
        return <Portfolio />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Panel Content */}
      <main className="main-content" style={{ marginLeft: isCollapsed ? 'var(--sidebar-collapsed-width)' : undefined }}>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
