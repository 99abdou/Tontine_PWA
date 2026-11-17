import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { mockTontines } from '../services/mockData';
import { formatCurrency, formatDate, tontineTypeLabel } from '../utils/formatters';

export const TontinesPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'brouillon'>('all');
  const [search, setSearch] = useState('');

  const filtered = mockTontines.filter((t) => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Mes Tontines</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Gérez vos groupes d'épargne, calendriers et règles de versement
          </p>
        </div>

        <Link to="/tontines/create">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Créer une tontine
          </Button>
        </Link>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une tontine..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Toutes ({mockTontines.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'active' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Actives (2)
          </button>
          <button
            onClick={() => setFilter('brouillon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'brouillon' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Brouillons (1)
          </button>
        </div>
      </div>

      {/* Grid of Tontine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tontine) => {
          const progressPercent = Math.round(
            ((tontine.total_collected || 0) / (tontine.total_expected || 1)) * 100
          );

          return (
            <Link key={tontine.id} to={`/tontines/${tontine.id}`}>
              <Card hoverable className="h-full flex flex-col justify-between">
                <div>
                  {/* Top card strip */}
                  <div className="p-5 border-b border-gray-100 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary-800 bg-primary-50 px-2 py-0.5 rounded-md">
                        {tontineTypeLabel[tontine.tontine_type] || tontine.tontine_type}
                      </span>
                      <Badge variant={tontine.status === 'active' ? 'success' : 'gray'} dot>
                        {tontine.status === 'active' ? 'En cours' : 'Brouillon'}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-gray-950 group-hover:text-primary-800 transition-colors">
                      {tontine.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{tontine.description}</p>
                  </div>

                  {/* Body details */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Cotisation</p>
                        <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                          {formatCurrency(tontine.contribution_amount)}
                        </p>
                        <p className="text-[10px] text-gray-500 capitalize">{tontine.frequency}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Participantes</p>
                        <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                          {tontine.member_count} / {tontine.participant_limit}
                        </p>
                        <p className="text-[10px] text-gray-500">Membres inscrits</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-medium">Progression collecte</span>
                        <span className="font-bold text-gray-800">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary-700 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 pt-0.5">
                        <span>{formatCurrency(tontine.total_collected || 0)}</span>
                        <span>Obj. {formatCurrency(tontine.total_expected || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Début : {formatDate(tontine.start_date)}</span>
                  </div>
                  <span className="font-bold text-primary-800 flex items-center gap-1">
                    Gérer <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
