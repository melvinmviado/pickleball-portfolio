import React, { useState } from 'react';
import duprData from '../data/dupr.json';

export const Stats: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'All' | '6 Months' | '3 Months'>('All');
  const { player, ratingHistory, matchStats } = duprData;

  // SVG chart dimensions
  const chartWidth = 700;
  const chartHeight = 220;

  // Dynamically calculate SVG coordinates based on DUPR ratings range (3.0 - 4.5)
  const points = ratingHistory.map((item, idx) => {
    const x = 50 + (idx / (ratingHistory.length - 1 || 1)) * 600;
    const ratingVal = parseFloat(item.val);
    const minRating = 3.0;
    const maxRating = 4.5;
    const ratio = (ratingVal - minRating) / (maxRating - minRating);
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    const y = 180 - clampedRatio * 150; // Maps 3.0 to 180 (bottom) and 4.5 to 30 (top)
    return { x, y, label: item.label, val: item.val };
  });

  // Make path string for SVG line
  const pathD = points.reduce(
    (path, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`),
    ''
  );
  
  // Area path string under the line
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : '';

  // Assign design system colors to skills list
  const skillColors = ['var(--color-accent)', 'var(--color-secondary)', '#a855f7', '#f59e0b', '#10b981'];
  const skillsBreakdown = duprData.skillsBreakdown.map((skill, idx) => ({
    ...skill,
    color: skillColors[idx % skillColors.length]
  }));

  const winPercentage = parseFloat(player.winRate) || 50;
  const lossPercentage = 100 - winPercentage;

  return (
    <div className="fade-in">
      <div className="view-header-row">
        <div>
          <h1>Performance Analytics</h1>
          <p className="subtitle">Visualizing ratings development and shot consistency profiles</p>
        </div>
        <div className="period-tabs">
          {(['All', '6 Months', '3 Months'] as const).map((period) => (
            <button
              key={period}
              className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Line Chart Card */}
      <div className="content-card chart-card">
        <div className="chart-header">
          <div>
            <h3>DUPR Rating Growth</h3>
            <p className="card-subtitle">Rating progress since starting tournament competition</p>
          </div>
          <div className="rating-now">
            <span className="rating-dot"></span>
            Current: {player.duprRating}
          </div>
        </div>

        <div className="chart-container">
          {points.length > 0 ? (
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} className="analytics-svg">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-secondary)" />
                  <stop offset="50%" stopColor="var(--color-accent)" />
                  <stop offset="100%" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="50" y1="30" x2="650" y2="30" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="75" x2="650" y2="75" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="120" x2="650" y2="120" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="165" x2="650" y2="165" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area under curve */}
              <path d={areaD} fill="url(#areaGrad)" />

              {/* Main curve line */}
              <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" />

              {/* Connecting points */}
              {points.map((pt, i) => (
                <g key={i} className="chart-point-group">
                  <circle cx={pt.x} cy={pt.y} r="5" className="chart-circle" />
                  <circle cx={pt.x} cy={pt.y} r="8" className="chart-circle-pulse" />
                  <text x={pt.x} y={pt.y - 12} textAnchor="middle" className="chart-value-text">{pt.val}</text>
                  <text x={pt.x} y={chartHeight + 15} textAnchor="middle" className="chart-label-text">{pt.label}</text>
                </g>
              ))}
            </svg>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No historical rating data available.</p>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Card: Key Stats Breakdown */}
        <div className="content-card match-metrics-card">
          <h2>Key Match Metrics</h2>
          <p className="card-subtitle">In-depth statistical review across recent tournaments</p>

          <div className="metrics-list">
            {matchStats.map((stat, idx) => (
              <div className="metric-row-item" key={idx}>
                <span className="metric-label">{stat.label}</span>
                <span className={`metric-value ${stat.type}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="metric-chart-bar-container">
            <h3>Win/Loss Ratio</h3>
            <div className="dual-progress-bar">
              <div className="progress-segment win" style={{ width: `${winPercentage}%` }}>
                <span>{player.winRate} Win ({player.winCount} W)</span>
              </div>
              <div className="progress-segment loss" style={{ width: `${lossPercentage}%` }}>
                <span>{100 - winPercentage}% Loss ({player.lossCount} L)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Technical Skill Distribution */}
        <div className="content-card skills-card">
          <h2>Shot Type Performance</h2>
          <p className="card-subtitle">Estimated consistency based on match drill session notes</p>

          <div className="skills-list">
            {skillsBreakdown.map((skill, idx) => (
              <div className="skill-progress-item" key={idx}>
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percentage">{skill.rate}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${skill.rate}%`,
                      backgroundColor: skill.color,
                      boxShadow: `0 0 10px ${skill.color}50`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
