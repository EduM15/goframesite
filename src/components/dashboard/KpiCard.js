import React from 'react';
import Card from '../ui/Card';

const KpiCard = ({ title, value, isPositive = false }) => {
  return (
    <Card className="text-center">
      <div className="text-sm text-text-secondary mb-2 uppercase">{title}</div>
      <div className={`text-4xl font-bold ${isPositive ? 'text-success' : 'text-text-main'}`}>
        {value}
      </div>
    </Card>
  );
};

export default KpiCard;