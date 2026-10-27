import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();
  let badgeClass = 'badge-draft';

  if (normalized === 'published') badgeClass = 'badge-published';
  else if (normalized === 'accepted') badgeClass = 'badge-accepted';
  else if (normalized === 'completed') badgeClass = 'badge-completed';
  else if (normalized === 'pending') badgeClass = 'badge-pending';
  else if (normalized === 'rejected') badgeClass = 'badge-rejected';

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default StatusBadge;
