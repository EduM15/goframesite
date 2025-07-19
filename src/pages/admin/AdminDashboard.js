import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import KpiCard from '../../components/dashboard/KpiCard';
import Icon from '@mdi/react';
import { mdiAccountGroup, mdiCashCheck, mdiCashPlus, mdiChartLine, mdiUpload, mdiCalendarPlus, mdiAccountPlus } from '@mdi/js';

// NOTA: Dados estáticos com 7 atividades diversificadas.
const recentAdminActivities = [
    { icon: mdiCashCheck, text: "Criador <b>Click na Trilha</b> solicitou um repasse.", time: "Hoje, 10:15", color: 'text-primary' },
    { icon: mdiAccountPlus, text: "Novo criador <b>Fotos Radicais</b> se cadastrou.", time: "Hoje, 09:45", color: 'text-text-secondary' },
    { icon: mdiChartLine, text: "Venda de <b>R$ 29,90</b> para o cliente <b>Maria Costa</b>.", time: "Hoje, 09:30", color: 'text-success' },
    { icon: mdiUpload, text: "<b>DroneMaster Edu</b> enviou 25 novas mídias para 'Trilha do Desafio'.", time: "Ontem, 18:22", color: 'text-text-secondary' },
    { icon: mdiCalendarPlus, text: "<b>Click na Trilha</b> criou o novo evento 'Corrida da Serra'.", time: "Ontem, 17:00", color: 'text-text-secondary' },
    { icon: mdiAccountGroup, text: "<b>João Silva</b> se cadastrou como novo cliente.", time: "2 dias atrás", color: 'text-text-secondary' },
    { icon: mdiChartLine, text: "Venda de <b>R$ 19,90</b> para o cliente <b>Ana Pereira</b>.", time: "2 dias atrás", color: 'text-success' },
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
                
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Vendas (Últimos 7 dias)</h2>
                        <div className="w-full h-64 bg-background rounded-md flex items-center justify-center">
                           <p className="text-text-secondary">Placeholder para o Gráfico de Vendas</p>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <KpiCard title="FATURAMENTO (MÊS)" value="R$ 6.890" />
                        <KpiCard title="COMISSÃO GERADA (MÊS)" value="R$ 1.378" isPositive={true} />
                        <KpiCard title="NOVOS CLIENTES (MÊS)" value="12" />
                        <KpiCard title="REPASSES PENDENTES" value="2">
                            <Link to="/admin/payouts"><p className="text-xs text-primary hover:underline">Verificar agora</p></Link>
                        </KpiCard>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Atividade Recente</h2>
                        <ul className="space-y-4 mb-6">
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
                        <Link to="/admin/activity" className="w-full">
                            <Button variant="secondary" className="w-full">Ver Todas as Atividades</Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;