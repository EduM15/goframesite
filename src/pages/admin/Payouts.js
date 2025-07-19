import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import KpiCard from '../../components/dashboard/KpiCard';
import Notification from '../../components/Notification';

// NOTA: Todos os dados nesta página são estáticos (mock) para fins de layout.
const mockPayouts = [
    { id: 1, date: '17/07/2025 10:30', creatorName: 'DroneMaster Edu', value: 755.60, bank: 'Efi Bank', holder: 'Eduardo V.', pixKey: 'edu211097@gmail.com' },
    { id: 2, date: '16/07/2025 18:45', creatorName: 'Click na Trilha', value: 980.10, bank: 'Banco Inter', holder: 'Click na Trilha LTDA', pixKey: '11988887777' },
];

const Payouts = () => {
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleCopyPix = (pixKey) => {
        navigator.clipboard.writeText(pixKey).then(() => {
            setNotification({ message: `Chave Pix "${pixKey}" copiada!`, type: 'success' });
            setTimeout(() => setNotification({ message: '', type: '' }), 3000);
        });
    };

    return (
        <div>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-bebas-neue text-primary">Gestão de Repasses</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KpiCard title="SOLICITAÇÕES PENDENTES" value="2">
                    <p className="text-xs text-primary">Aguardando processamento</p>
                </KpiCard>
                <KpiCard title="VALOR TOTAL A PAGAR" value="R$ 1.735,70" />
                <KpiCard title="TOTAL PAGO (ESTE MÊS)" value="R$ 3.450,00" />
            </div>

            <Card>
                <h2 className="text-2xl font-bebas-neue text-primary mb-4">Solicitações Pendentes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="p-4 font-semibold text-text-secondary">Data/Hora</th>
                                <th className="p-4 font-semibold text-text-secondary">Criador</th>
                                <th className="p-4 font-semibold text-text-secondary text-right">Valor</th>
                                <th className="p-4 font-semibold text-text-secondary">Dados para Repasse</th>
                                <th className="p-4 font-semibold text-text-secondary">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPayouts.map(payout => (
                                <tr key={payout.id} className="border-b border-gray-800 hover:bg-background">
                                    <td className="p-4 text-text-secondary">{payout.date}</td>
                                    <td className="p-4 font-bold">{payout.creatorName}</td>
                                    <td className="p-4 font-bold text-right">R$ {payout.value.toFixed(2).replace('.', ',')}</td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <p className="font-semibold">{payout.bank}</p>
                                            <p className="text-text-secondary">{payout.holder}</p>
                                            <p className="text-text-secondary font-mono text-xs">{payout.pixKey}</p>
                                            <Button variant="secondary" className="text-xs mt-2 py-1 px-2" onClick={() => handleCopyPix(payout.pixKey)}>
                                                Copiar Chave
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Button variant="primary" onClick={() => alert('Ação de processar repasse a ser implementada.')}>
                                            Processar Repasse
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Payouts;