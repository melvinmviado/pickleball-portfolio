import React from 'react';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react';
import actionShot from '../assets/pickleball_action.png';

export const Portfolio: React.FC = () => {
  const accomplishments = [
    { id: 1, title: 'Silver Medalist - Mixed Doubles 4.0 (Age 18+)', event: 'Legends of the Court 2', date: 'March 2026', desc: 'Near undefeated run with girlfriend Rhianna' },
    { id: 3, title: '4th Place - Mens Doubles 3.0 (Age 19+)', event: 'Tournament Of Champions', date: 'November 2024', desc: 'Second event ever playing doubles with my friend' },
    { id: 2, title: '4th Place - Mens Singles 3.5 (Age 19+)', event: 'Tournament Of Champions', date: 'November 2024', desc: 'First ever tournament event playing mens singles' },
  ];

  const gear = [
    { category: 'Paddle', name: 'V-Sol Pro Bloom (16mm)', specs: 'Foam Core, Carbon Fiber Face, Widebody', condition: 'Active' },
    { category: 'Footwear', name: 'Mizuno Wave Lightning Z8', specs: 'For quick literal movements and precise footwork', condition: 'Excellent' },
    { category: 'Balls', name: 'Franklin X-40', specs: 'Outdoor high-performance balls, consistent bounce', condition: 'Consumable' }
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
                I picked up a paddle early 2024 (I think) because my knees hurted from excessive Volleyball.
                Ever since then I loved the game because the rallies are lively and exciting.
                My beautiful girlfriend Rhianna and I are on the road to becoming greating Pickleball players.
                I focus mainly on defensive play, consistency, and elevating my strategic play.
              </p>
              <div className="tag-cloud">
                <span className="tag">Lefty Player</span>
                <span className="tag">Defensive Specialist</span>
                <span className="tag">Control Paddle</span>
              </div>
            </div>
          </div>

          {/* Current Gear */}
          <div className="content-card gear-card">
            <h2>Current Gear</h2>
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
                  <h4>Reached 4.1 DUPR</h4>
                  <p>Peaked for an hour then lost the next match and went back down to 3.9</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-badge">
                  <CheckCircle2 size={16} />
                </div>
                <div className="timeline-content">
                  <span className="timeline-date">June 2025</span>
                  <h4>Entered First Competitive Tournament</h4>
                  <p>Participated at local facility tournament, gained tournament experience.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-badge">
                  <CheckCircle2 size={16} />
                </div>
                <div className="timeline-content">
                  <span className="timeline-date">Early 2024</span>
                  <h4>First Pickleball Game</h4>
                  <p>Discovered the sport at HiSports Durham with my girlfriend and got hooked ever since.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
