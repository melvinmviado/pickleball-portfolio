import React from 'react';
import { User, Bell, Moon, Save, Download } from 'lucide-react';

interface SettingsProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings successfully updated! (Local mock data)');
  };

  return (
    <div className="fade-in">
      <div className="view-header">
        <h1>Account Settings</h1>
        <p className="subtitle">Customize your player profile and theme preferences</p>
      </div>

      <div className="settings-container content-card">
        <form onSubmit={handleSave}>
          {/* Section 1: Player Profile */}
          <div className="settings-section">
            <div className="section-title-wrapper">
              <User size={20} className="text-accent" />
              <h3>Player Information</h3>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="playerName">Full Name</label>
                <input type="text" id="playerName" defaultValue="Zephyr Pickleballer" className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="duprId">DUPR ID</label>
                <input type="text" id="duprId" defaultValue="DUPR-893-XKL" className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="homeCourt">Home Court Arena</label>
                <input type="text" id="homeCourt" defaultValue="Riverfront Pickleball Arena, Austin TX" className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="skillSelect">Self-Rated Category</label>
                <select id="skillSelect" defaultValue="4.0-4.5" className="form-select">
                  <option value="2.0-3.0">Beginner (2.0 - 3.0)</option>
                  <option value="3.0-3.5">Intermediate (3.0 - 3.5)</option>
                  <option value="3.5-4.0">Upper Intermediate (3.5 - 4.0)</option>
                  <option value="4.0-4.5">Advanced (4.0 - 4.5)</option>
                  <option value="4.5+">Pro/Semi-Pro (4.5+)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Section 2: UI Preferences */}
          <div className="settings-section">
            <div className="section-title-wrapper">
              <Moon size={20} className="text-secondary" />
              <h3>Interface Customization</h3>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="themeSelect">Theme Mode</label>
                <select id="themeSelect" value={theme} onChange={handleThemeChange} className="form-select">
                  <option value="dark">Sleek Dark Mode (Default)</option>
                  <option value="light">Crisp Light Mode</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="densitySelect">Dashboard Layout</label>
                <select id="densitySelect" defaultValue="comfortable" className="form-select">
                  <option value="compact">Compact (More statistics density)</option>
                  <option value="comfortable">Comfortable (Clean visuals)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Section 3: Notification Alerts */}
          <div className="settings-section">
            <div className="section-title-wrapper">
              <Bell size={20} className="text-purple" />
              <h3>System &amp; Match Alerts</h3>
            </div>
            
            <div className="checkbox-list">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked className="form-checkbox" />
                <span>Tournament Sign-up Alerts (Email updates when registration opens)</span>
              </label>

              <label className="checkbox-label">
                <input type="checkbox" defaultChecked className="form-checkbox" />
                <span>Weekly DUPR Rating Digests (Log of rating shifts)</span>
              </label>

              <label className="checkbox-label">
                <input type="checkbox" className="form-checkbox" />
                <span>Recreational Match Invites (Notifications from players nearby)</span>
              </label>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="form-footer">
            <button type="submit" className="btn btn-primary btn-icon">
              <Save size={16} />
              Save Settings
            </button>
            <button type="button" className="btn btn-secondary btn-icon" onClick={() => alert('Exporting portfolio resume... (Mock)')}>
              <Download size={16} />
              Export Athletic Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
