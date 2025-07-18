import React from 'react';
import Card from '../ui/Card';

const KpiCard = ({ title, value, isPositive = false, children }) => {
  return (
    <Card className="text-center flex flex-col">
      <div className="text-sm text-text-secondary mb-2 uppercase">{title}</div>
      <div className={`text-4xl font-bold ${isPositive ? 'text-success' : 'text-text-main'}`}>
        {value}
      </div>
      {/* O 'children' nos permite adicionar conteúdo extra, como subtexto ou botões */}
      <div className="mt-auto pt-4"> 
        {children}
      </div>
    </Card>
  );
};

export default KpiCard;