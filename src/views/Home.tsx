import React from 'react';
import { Trophy, Activity, Calendar, Star, TrendingUp, Award, MapPin } from 'lucide-react';
import duprData from '../data/dupr.json';

interface HomeProps {
}

export const Home: React.FC<HomeProps> = () => {
  const { player, recentMatches } = duprData;

  const stats = [
    { label: 'DUPR Rating', value: player.duprRating, change: player.duprChange, icon: Award, color: 'var(--color-accent)' },
    { label: 'Win Rate', value: player.winRate, change: `${player.winCount}W - ${player.lossCount}L`, icon: TrendingUp, color: 'var(--color-secondary)' },
    { label: 'Matches Played', value: player.matchesCount, change: 'Total matches', icon: Activity, color: '#a855f7' },
    { label: 'Tournament Wins', value: player.tournamentWins, change: 'Gold Medals', icon: Trophy, color: '#f59e0b' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="fade-in">
      {/* Hero Banner Section */}
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot"></span>
            Active Player Portfolio
          </div>
          <h1>{player.name}</h1>
          <p>
            Welcome to my official Pickleball Athlete Portfolio. Tracking stats, tournament progress, and court milestones as I climb the DUPR ratings.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => window.location.hash = '#portfolio'}>
              View My Gear &amp; Accomplishments
            </button>
            <button className="btn btn-secondary" onClick={() => window.location.hash = '#stats'}>
              Analyze Match Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={idx}>
              <div className="stat-card-header">
                <span className="stat-label">{stat.label}</span>
                <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="stat-value" style={{ textShadow: stat.label === 'DUPR Rating' ? '0 0 10px rgba(var(--color-accent-rgb), 0.3)' : 'none' }}>
                {stat.value}
              </div>
              <div className="stat-change">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Main Section Grid */}
      <div className="dashboard-grid">
        {/* Left Side: Recent Matches */}
        <div className="content-card recent-matches-card">
          <div className="card-header">
            <div>
              <h2>Recent Match History</h2>
              <p className="card-subtitle">Logs of competitive and tournament games</p>
            </div>
            <button className="btn btn-text" onClick={() => window.location.hash = '#stats'}>View All</button>
          </div>

          <div className="matches-list">
            {recentMatches.map((match) => (
              <div className="match-row" key={match.id}>
                <div className="match-details">
                  <div className="match-type">
                    <span className={`badge ${match.type.toLowerCase() === 'tournament' ? 'badge-tournament' : 'badge-rec'}`}>
                      {match.type}
                    </span>
                    <span className="match-date">{match.date}</span>
                  </div>
                  <div className="match-opponents">
                    vs. {match.opponents}
                  </div>
                  <div className="match-partner">
                    Partner: <span className="highlight">{match.partner}</span>
                  </div>
                </div>
                <div className="match-score-result">
                  <div className="match-score">{match.score}</div>
                  <div className={`match-result ${match.result.toLowerCase() === 'win' ? 'text-win' : 'text-loss'}`}>
                    {match.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Info */}
        <div className="content-card profile-details-card">
          <h2>Player Profile</h2>
          <div className="player-avatar-box">
            <div className="avatar-placeholder">
              <span>{getInitials(player.name)}</span>
              <div className="avatar-ring"></div>
            </div>
            <div>
              <h3>{player.name}</h3>
              <p className="player-meta">Right-Handed | {player.duprRating} DUPR | Advanced</p>
            </div>
          </div>

          <div className="info-list">
            <div className="info-item">
              <MapPin size={18} className="info-icon text-accent" />
              <div>
                <div className="info-title">Home Court</div>
                <div className="info-desc">{player.homeCourt}</div>
              </div>
            </div>
            <div className="info-item">
              <Star size={18} className="info-icon text-secondary" />
              <div>
                <div className="info-title">Play Style</div>
                <div className="info-desc">{player.playStyle}</div>
              </div>
            </div>
            <div className="info-item">
              <Award size={18} className="info-icon text-purple" />
              <div>
                <div className="info-title">Current Paddle</div>
                <div className="info-desc">{player.currentPaddle}</div>
              </div>
            </div>
            <div className="info-item">
              <Calendar size={18} className="info-icon text-yellow" />
              <div>
                <div className="info-title">Next Tournament</div>
                <div className="info-desc">{player.nextTournament}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
