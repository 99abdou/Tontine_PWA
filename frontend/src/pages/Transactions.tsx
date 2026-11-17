import React, { useState } from 'react';
import {
  History,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { mockTransactions } from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';

export const TransactionsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'payment' | 'payout'>('all');
  const [search, setSearch] = useState('');

  const filtered = mockTransactions.filter((tx) => {
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    const matchesSearch = tx.member_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Journal des Opérations</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Historique complet, auditable et sécurisé de toutes les transactions financières
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Exporter Excel
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par membre..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              filterType === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilterType('payment')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              filterType === 'payment' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
            }`}
          >
            Encaissements (+)
          </button>
          <button
            onClick={() => setFilterType('payout')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              filterType === 'payout' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
            }`}
          >
            Versements (-)
          </button>
        </div>
      </div>

      {/* Transactions List Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Participante</th>
                <th className="py-3.5 px-4">Tontine</th>
                <th className="py-3.5 px-4">Moyen de paiement</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Montant</th>
                <th className="py-3.5 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                        tx.type === 'payment'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {tx.type === 'payment' ? (
                        <>
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> Cotisation
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-3 h-3 text-amber-600" /> Versement Tour
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">{tx.member_name}</td>
                  <td className="py-3.5 px-4 text-gray-600">{tx.tontine_name}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-700 capitalize">{tx.method}</td>
                  <td className="py-3.5 px-4 text-gray-500">{formatDate(tx.date)}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    <span className={tx.type === 'payment' ? 'text-emerald-700' : 'text-amber-800'}>
                      {tx.type === 'payment' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge variant="success">{tx.status}</Badge>
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
