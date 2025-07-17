import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';

const QuickActionButton = ({ to, icon, label }) => {
  return (
    <Link
      to={to}
      className="bg-background border border-gray-700 text-text-main p-5 rounded-lg text-center font-semibold flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:border-primary hover:text-primary"
    >
      <Icon path={icon} size={1.5} />
      <span>{label}</span>
    </Link>
  );
};

export default QuickActionButton;