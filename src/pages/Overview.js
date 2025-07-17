import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import KpiCard from '../components/dashboard/KpiCard';
import QuickActionButton from '../components/dashboard/QuickActionButton';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '@mdi/react';
import { mdiUpload, mdiCalendar, mdiCheckDecagram, mdiAccountPlus, mdiCash } from '@mdi/js';

// NOTA: Dados estáticos para simulação.
const recentActivities = [
    { icon: mdiCheckDecagram, text: "Venda realizada! (Foto IMG_7812.JPG)", time: "Hoje, 15:02", color: 'text-success' },
    { icon: mdiUpload, text: "15 mídias enviadas para 'Trilha do Desafio'.", time: "Ontem, 11:34", color: 'text-text-secondary' },
    { icon: mdiCheckDecagram, text: "Venda realizada! (Vídeo DJI_0025.MP4)", time: "Ontem, 09:12", color: 'text-success' },
    { icon: mdiCash, text: "Repasse de R$ 450,00 concluído.", time: "2 dias atrás", color: 'text-success' },
    { icon: mdiAccountPlus, text: "Novo cliente 'João Silva' comprou uma foto.", time: "3 dias atrás", color: 'text-text-secondary' },
];

const Overview = () => {
    const { user } = useAuth();

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-bebas-neue text-5xl m-0">
                    Bem-vindo de volta, <span className="text-primary">{user?.nickname || 'Criador'}!</span>
                </h1>
                <p className="text-lg text-text-secondary mt-1">Aqui está um resumo rápido da sua atividade na plataforma.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <KpiCard title="SALDO A RECEBER" value="R$ 755,60" isPositive={true} />
                        <KpiCard title="VENDAS (ÚLTIMOS 7 DIAS)" value="R$ 310,80" />
                    </div>

                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Ações Rápidas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <QuickActionButton to="/creator/upload" icon={mdiUpload} label="Fazer Novo Upload" />
                            <QuickActionButton to="/creator/events" icon={mdiCalendar} label="Gerenciar Eventos" />
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Atividade Recente</h2>
                        <ul className="space-y-4 mb-6">
                            {recentActivities.map((activity, index) => (
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
                        <Link to="/creator/activity" className="w-full">
                            <Button variant="secondary" className="w-full">Ver Todas as Atividades</Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Overview;