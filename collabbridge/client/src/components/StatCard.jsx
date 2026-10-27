import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'purple' }) => {
  return (
    <div className="stat-card">
      {Icon && (
        <div className={`stat-icon ${color}`}>
          <Icon size={24} />
        </div>
      )}
      <div className="stat-info">
        <h4>{title}</h4>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
