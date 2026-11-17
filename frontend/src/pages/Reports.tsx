import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle,
  FileText,
  Printer,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { mockTontines } from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from '../stores/toastStore';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('global');
  const [selectedTontine, setSelectedTontine] = useState('t-1');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success(
        'Rapport prêt pour téléchargement',
        `Le document ${format.toUpperCase()} de la Tontine Diamono a été généré avec succès`
      );
    }, 800);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Rapports & Bilans</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Générez des rapports certifiés de cotisations, retards et versements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            leftIcon={<Download className="w-4 h-4" />}
            isLoading={isExporting}
          >
            Télécharger Excel (.xlsx)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExport('pdf')}
            leftIcon={<Printer className="w-4 h-4" />}
            isLoading={isExporting}
          >
            Télécharger PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Box */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
              Paramètres du Rapport
            </h3>

            <Select
              label="Sélectionner la Tontine"
              value={selectedTontine}
              onChange={(e) => setSelectedTontine(e.target.value)}
              options={mockTontines.map((t) => ({ value: t.id, label: t.name }))}
            />

            <Select
              label="Type de Rapport"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'global', label: 'Rapport Global de Synthèse' },
                { value: 'contributions', label: 'Relevé des Cotisations par Période' },
                { value: 'overdue', label: 'Rapport d’Audit des Retards' },
                { value: 'payouts', label: 'Bilan des Versements aux Bénéficiaires' },
              ]}
            />
          </Card>
        </div>

        {/* Paper Document Preview */}
        <div className="lg:col-span-8">
          <Card className="p-8 bg-white border border-gray-200/80 shadow-md space-y-6">
            {/* Header Document */}
            <div className="flex justify-between items-start border-b-2 border-primary-900 pb-4">
              <div>
                <h2 className="text-xl font-black text-primary-950 uppercase tracking-tight">TONTINE PRO</h2>
                <p className="text-xs text-gray-500">Plateforme de Gestion Numérique des Tontines</p>
                <p className="text-[10px] text-gray-400">Dakar, Sénégal</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-gray-900">RAPPORT OFFICIEL</p>
                <p className="text-gray-500">Date d'édition : 17/05/2024</p>
                <p className="text-gray-500">Réf : DOC-TP-2024-001</p>
              </div>
            </div>

            {/* Meta */}
            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 border border-gray-100">
              <p><strong>Tontine :</strong> Tontine Diamono des Entrepreneures</p>
              <p><strong>Organisatrice :</strong> Fatou Sow (77 654 32 10)</p>
              <p><strong>Période concernée :</strong> Mars - Mai 2024 (Périodes 1 à 3)</p>
            </div>

            {/* Document Content Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Synthèse Financière</h4>
              <table className="w-full text-left text-xs border border-gray-200">
                <thead className="bg-gray-100 font-bold text-gray-700">
                  <tr>
                    <th className="p-2.5 border-b border-gray-200">Rubrique</th>
                    <th className="p-2.5 border-b border-gray-200 text-right">Montant Attendu</th>
                    <th className="p-2.5 border-b border-gray-200 text-right">Montant Encaissé</th>
                    <th className="p-2.5 border-b border-gray-200 text-right">Reste à Recouvrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-2.5 font-medium">Cotisations Période 1 (Mars)</td>
                    <td className="p-2.5 text-right">350.000 FCFA</td>
                    <td className="p-2.5 text-right text-emerald-700 font-bold">350.000 FCFA</td>
                    <td className="p-2.5 text-right text-gray-400">0 FCFA</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Cotisations Période 2 (Avril)</td>
                    <td className="p-2.5 text-right">350.000 FCFA</td>
                    <td className="p-2.5 text-right text-emerald-700 font-bold">325.000 FCFA</td>
                    <td className="p-2.5 text-right text-amber-700 font-bold">25.000 FCFA</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Cotisations Période 3 (Mai)</td>
                    <td className="p-2.5 text-right">350.000 FCFA</td>
                    <td className="p-2.5 text-right text-emerald-700 font-bold">275.000 FCFA</td>
                    <td className="p-2.5 text-right text-rose-700 font-bold">75.000 FCFA</td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50 font-bold border-t border-gray-300">
                  <tr>
                    <td className="p-2.5 uppercase">Total Global</td>
                    <td className="p-2.5 text-right">1.050.000 FCFA</td>
                    <td className="p-2.5 text-right text-emerald-800">950.000 FCFA</td>
                    <td className="p-2.5 text-right text-rose-700">100.000 FCFA</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signature Block */}
            <div className="pt-8 flex justify-between text-xs text-gray-500 border-t border-gray-100">
              <div>
                <p className="font-bold text-gray-900">Visa de l'Organisatrice</p>
                <p className="text-[10px] mt-1 text-emerald-700">Signé numériquement par Fatou Sow</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">Statut du Bilan</p>
                <span className="text-emerald-700 font-bold">Certifié Conforme</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
