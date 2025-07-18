import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import KpiCard from '../components/dashboard/KpiCard';

// NOTA: Todos os dados nesta página são estáticos para fins de layout.
const mockSalesData = [
    { date: '16/07/2025', event: 'Trilha do Desafio', item: 'Vídeo DJI_0025.MP4', saleValue: 29.90, commission: 5.98, netValue: 23.92 },
    { date: '15/07/2025', event: 'Trilha do Desafio', item: 'Foto IMG_7812.JPG', saleValue: 19.90, commission: 3.98, netValue: 15.92 },
    { date: '15/07/2025', event: 'Trilha do Desafio', item: 'Foto IMG_7814.JPG', saleValue: 19.90, commission: 3.98, netValue: 15.92 },
    { date: '14/07/2025', event: 'Enduro das Cachoeiras', item: 'Vídeo GOPR005.MP4', saleValue: 29.90, commission: 5.98, netValue: 23.92 },
];

const Financial = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-bebas-neue text-primary">Relatório Financeiro</h1>
                <p className="text-text-secondary mt-1">Dados exibidos para o mês atual.</p>
            </div>

            {/* Grid de KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="SALDO A RECEBER" value="R$ 755,60" isPositive={true}>
                    <Button className="w-full">Solicitar Repasse</Button>
                </KpiCard>
                <KpiCard title="TOTAL RECEBIDO (GERAL)" value="R$ 4.850,00">
                    <p className="text-xs text-text-secondary">Em 5 repasses</p>
                </KpiCard>
                <KpiCard title="VENDAS (MÊS ATUAL)" value="R$ 1.250,00">
                    <p className="text-xs text-text-secondary">+15% vs. mês anterior</p>
                </KpiCard>
                <KpiCard title="ITENS VENDIDOS (MÊS ATUAL)" value="48">
                    <p className="text-xs text-text-secondary">15 vídeos e 33 fotos</p>
                </KpiCard>
            </div>

            {/* Tabela de Vendas Recentes */}
            <Card>
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bebas-neue text-primary">Últimas Vendas</h2>
                    <div className="flex gap-4">
                        <Button variant="secondary">Alterar Período</Button>
                        <Button variant="secondary">Gerar Extrato</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-4 font-semibold text-text-secondary">Data</th>
                                <th className="p-4 font-semibold text-text-secondary">Evento</th>
                                <th className="p-4 font-semibold text-text-secondary">Item Vendido</th>
                                <th className="p-4 font-semibold text-text-secondary text-right">Valor Venda</th>
                                <th className="p-4 font-semibold text-text-secondary text-right">Comissão (20%)</th>
                                <th className="p-4 font-semibold text-text-secondary text-right">Seu Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockSalesData.map((sale, index) => (
                                <tr key={index} className="border-b border-gray-800 hover:bg-background">
                                    <td className="p-4">{sale.date}</td>
                                    <td className="p-4">{sale.event}</td>
                                    <td className="p-4">{sale.item}</td>
                                    <td className="p-4 text-right">R$ {sale.saleValue.toFixed(2).replace('.', ',')}</td>
                                    <td className="p-4 text-right text-danger">- R$ {sale.commission.toFixed(2).replace('.', ',')}</td>
                                    <td className="p-4 text-right font-bold text-success">R$ {sale.netValue.toFixed(2).replace('.', ',')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Financial;