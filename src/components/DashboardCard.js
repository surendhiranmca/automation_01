import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({
  title,
  value,
  icon,
  description,
  color = 'primary',
  onClick,
  trend
}) => {
  return (
    <div
      className={`dashboard-card dashboard-card-${color}${onClick ? ' dashboard-card-clickable' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={onClick ? `Click to view ${title}` : ''}
    >
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3 className="card-title">{title}</h3>
        {onClick && <span className="card-redirect-arrow">→</span>}
      </div>

      <div className="card-body">
        <p className="card-value">{value}</p>
        {description && <p className="card-description">{description}</p>}
        {trend && (() => {
          if (typeof trend === 'string') {
            const isUp = trend === 'positive' || trend === 'up' || trend === 'success';
            const isDown = trend === 'negative' || trend === 'down' || trend === 'danger';
            const dirClass = isUp ? 'up' : isDown ? 'down' : 'neutral';
            const arrow = isUp ? '↑' : isDown ? '↓' : '•';
            return (
              <p className={`card-trend ${dirClass}`}>
                {arrow} {isUp ? 'Real-time Active' : isDown ? 'Action Required' : 'Live Data'}
              </p>
            );
          }
          return (
            <p className={`card-trend ${trend.direction || 'up'}`}>
              {trend.direction === 'down' ? '↓' : '↑'} {trend.text}
            </p>
          );
        })()}
      </div>

    </div>
  );
};

export default DashboardCard;
