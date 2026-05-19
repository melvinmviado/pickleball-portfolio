import React from 'react';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react';
import actionShot from '../assets/pickleball_action.png';

export const Portfolio: React.FC = () => {
  const accomplishments = [
    { id: 1, title: 'Gold Medalist - Men\'s Doubles 4.0', event: 'Austin Regional Pickleball Open', date: 'April 2026', desc: 'Undefeated run (6-0) in double-elimination bracket with partner Marcus R.' },
    { id: 2, title: 'Silver Medalist - Mixed Doubles 4.0', event: 'Texas State Amateur Championships', date: 'October 2025', desc: 'Fought through a 16-team field, falling short in a tight 3-game final match.' },
    { id: 3, title: 'Quarterfinalist - Men\'s Singles 4.0', event: 'Lone Star Shootout', date: 'September 2025', desc: 'First singles tournament tournament showing strong baseline game.' },
  ];

  const gear = [
    { category: 'Paddle', name: 'Selkirk Vanguard Control Invicto (16mm)', specs: 'Raw Carbon Fiber, QuadCarbon face, Control-focus', condition: 'Active' },
    { category: 'Footwear', name: 'Babolat Jet Tere All Court', specs: 'Michelin outsole, lightweight speed profile', condition: 'Excellent' },
    { category: 'Bags & Accessories', name: 'Franklin Sports Pro Series Bag', specs: 'Thermal insulation, shoe compartment, holds 6 paddles', condition: 'Active' },
    { category: 'Balls', name: 'Dura Fast 40 / Selkirk Pro S1', specs: 'Outdoor high-performance balls, consistent bounce', condition: 'Consumable' }
  ];

  return (
    <div className="fade-in">
      <div className="view-header">
        <h1>Athlete Portfolio</h1>
        <p className="subtitle">Explore my pickleball journey, career milestones, and selected gear</p>
      </div>

      <div className="portfolio-layout">
        {/* Left Side: Photo and Bio */}
        <div className="portfolio-sidebar">
          <div className="content-card photo-card">
            <div className="portfolio-img-container">
              <img src={actionShot} alt="Pickleball Action Shot" className="portfolio-img" />
              <div className="img-glow"></div>
            </div>
            <div className="bio-content">
              <h3>Bio</h3>
              <p>
                Picking up a paddle in early 2024, I quickly transitioned from recreational play to competitive brackets. Combining a tennis background with pickleball-specific kitchen dink strategies, I focus on soft kitchen play, fast resets, and high-percentage roll volleys.
              </p>
              <div className="tag-cloud">
                <span className="tag">Lefty Player</span>
                <span className="tag">Dink Specialist</span>
                <span className="tag">Control Paddle</span>
                <span className="tag">DUPR 4.3</span>
              </div>
            </div>
          </div>

          {/* Current Gear */}
          <div className="content-card gear-card">
            <h2>Current Gear Bag</h2>
            <div className="gear-list">
              {gear.map((item, idx) => (
                <div className="gear-item" key={idx}>
                  <div className="gear-header">
                    <span className="gear-category">{item.category}</span>
                    <span className={`gear-badge ${item.condition.toLowerCase()}`}>{item.condition}</span>
                  </div>
                  <h4 className="gear-name">{item.name}</h4>
                  <p className="gear-specs">{item.specs}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Achievements and Timeline */}
        <div className="portfolio-main">
          {/* Tournament Highlights */}
          <div className="content-card achievements-card">
            <h2>Tournament Achievements</h2>
            <div className="achievements-list">
              {accomplishments.map((item) => (
                <div className="achievement-row" key={item.id}>
                  <div className="achievement-icon-box">
                    <Award size={24} className="gold-glow" />
                  </div>
                  <div className="achievement-info">
                    <div className="achievement-meta">
                      <span className="achievement-date">{item.date}</span>
                      <ChevronRight size={14} className="text-muted" />
                      <span className="achievement-event">{item.event}</span>
                    </div>
                    <h3 className="achievement-title">{item.title}</h3>
                    <p className="achievement-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="content-card timeline-card">
            <h2>Career Timeline</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-badge success">
                  <CheckCircle2 size={16} />
                </div>
                <div className="timeline-content">
                  <span className="timeline-date">April 2026</span>
                  <h4>Reached 4.3 DUPR Goal</h4>
                  <p>Confirmed rating update after securing Gold at the Austin Regional Pickleball Open.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-badge">
                  <CheckCircle2 size={16} />
                </div>
                <div className="timeline-content">
                  <span className="timeline-date">December 2025</span>
                  <h4>Began Coaching &amp; Drills Program</h4>
                  <p>Partnered with a private coach to refine third-shot drop mechanics and court coverage speed.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-badge">
                  <CheckCircle2 size={16} />
                </div>
                <div className="timeline-content">
                  <span className="timeline-date">June 2025</span>
                  <h4>Entered First Competitive 4.0 Tournament</h4>
                  <p>Represented local club in regional qualifiers, capturing the silver and setting the stage for future competitive matches.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-badge">
                  <CheckCircle2 size={16} />
                </div>
                <div className="timeline-content">
                  <span className="timeline-date">February 2024</span>
                  <h4>First Pickleball Game</h4>
                  <p>Discovered the sport at Austin municipal courts and developed an immediate passion for fast kitchen exchanges.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
