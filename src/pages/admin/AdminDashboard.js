import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import KpiCard from '../../components/dashboard/KpiCard';
import Icon from '@mdi/react';
import { mdiAccountGroup, mdiCashCheck, mdiCashPlus, mdiChartLine } from '@mdi/js';

// NOTA: Todos os dados nesta página são estáticos para fins de layout.
const recentAdminActivities = [
    { icon: mdiCashCheck, text: "Criador <b>Click na Trilha</b> solicitou um repasse.", time: "Hoje, 10:15", color: 'text-primary' },
    { icon: mdiAccountGroup, text: "<b>João Silva</b> se cadastrou como novo cliente.", time: "Hoje, 09:30", color: 'text-text-secondary' },
    { icon: mdiChartLine, text: "Venda de <b>R$ 29,90</b> para o cliente <b>Maria Costa</b>.", time: "Ontem, 15:00", color: 'text-success' },
];

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-bebas-neue text-5xl m-0 text-primary">Painel Maestro</h1>
                <p className="text-lg text-text-secondary mt-1">Bem-vindo, {user?.nickname || 'Admin'}!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Coluna Principal (Esquerda) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Card do Gráfico (com SVG placeholder) */}
                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Vendas (Últimos 7 dias)</h2>
                        {/* NOTA: Este é um placeholder visual. Uma biblioteca de gráficos (ex: Recharts) seria necessária para dados dinâmicos. */}
                        <div className="w-full h-64 bg-background rounded-md flex items-center justify-center">
                           <p className="text-text-secondary">Placeholder para o Gráfico de Vendas</p>
                        </div>
                    </Card>

                    {/* Grid de KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <KpiCard title="FATURAMENTO (MÊS)" value="R$ 6.890" />
                        <KpiCard title="COMISSÃO GERADA (MÊS)" value="R$ 1.378" isPositive={true} />
                        <KpiCard title="NOVOS CLIENTES (MÊS)" value="12" />
                        <KpiCard title="REPASSES PENDENTES" value="2">
                            <p className="text-xs text-primary">Verificar agora</p>
                        </KpiCard>
                    </div>
                </div>

                {/* Coluna Lateral (Direita) */}
                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Atividade Recente</h2>
                        <ul className="space-y-4">
                            {recentAdminActivities.map((activity, index) => (
                                <li key={index} className="flex items-center gap-4 border-b border-background pb-4 last:border-b-0 last:pb-0">
                                    <div className={`p-2 bg-surface rounded-full ${activity.color}`}>
                                        <Icon path={activity.icon} size={1} />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-text-main leading-tight" dangerouslySetInnerHTML={{ __html: activity.text }} />
                                        <p className="text-xs text-text-secondary">{activity.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;