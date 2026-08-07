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
        {trend && (
          <p className={`card-trend ${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
