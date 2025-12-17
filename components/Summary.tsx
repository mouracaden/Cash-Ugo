import React from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { Topic, Participant } from '../types';
import { formatCurrency, formatDuration } from '../utils';

interface SummaryProps {
  topics: Topic[];
  totalCost: number;
  totalDuration: number;
  participants: Participant[];
  onReset: () => void;
}

export const Summary: React.FC<SummaryProps> = ({ 
  topics, 
  totalCost, 
  totalDuration,
  participants,
  onReset 
}) => {
  const handlePrint = () => {
    window.print();
  };

  const activeTopics = topics.filter(t => t.durationSeconds > 0);

  return (
    <div className="max-w-4xl mx-auto p-8 animate-in fade-in zoom-in duration-500 print:animate-none print:p-0 print:max-w-none">
      <div className="bg-white text-carbon-900 rounded-lg shadow-2xl overflow-hidden mb-8 relative print:shadow-none print:border print:border-gray-200 print:mb-0 print:rounded-none">
        {/* Receipt Header */}
        <div className="bg-carbon-900 text-white p-8 flex justify-between items-start border-b-4 border-money-500 print:bg-black print:text-black">
          <div>
            <h1 className="text-3xl font-bold font-mono tracking-tighter mb-2 print:text-black">FACTURE RÉUNION</h1>
            <p className="text-gray-400 text-sm print:text-gray-600">Le chrono-chèque d’Ugo Inc.</p>
            <p className="text-gray-400 text-sm print:text-gray-600">{new Date().toLocaleDateString('fr-FR')} — {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1 print:text-gray-600">Total à payer</p>
            <p className="text-4xl font-bold text-money-400 font-mono print:text-black">{formatCurrency(totalCost)}</p>
          </div>
        </div>

        {/* Participants Summary */}
        <div className="p-8 bg-gray-50 border-b border-gray-200 print:bg-white print:p-6">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Ressources Mobilisées ({participants.length})</h3>
           <div className="flex flex-wrap gap-2">
             {participants.map(p => (
               <span key={p.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs border border-gray-300 font-medium print:bg-transparent print:border-gray-400">
                 {p.name}
               </span>
             ))}
           </div>
        </div>

        {/* Itemized List */}
        <div className="p-8 print:p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-800 text-xs font-bold uppercase tracking-wider text-gray-600 print:border-black">
                <th className="pb-3">Sujet</th>
                <th className="pb-3 text-right">Durée</th>
                <th className="pb-3 text-right">Coût</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {activeTopics.length === 0 && (
                 <tr>
                   <td colSpan={3} className="py-4 text-center text-gray-400 italic">
                     Réunion fantôme (aucune donnée enregistrée)
                   </td>
                 </tr>
              )}
              {activeTopics.map((topic) => (
                <tr key={topic.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors print:border-gray-300">
                  {/* Explicitly set text-gray-900 to override any dark mode inheritance */}
                  <td className="py-3 font-semibold text-gray-900">{topic.title}</td>
                  <td className="py-3 text-right text-gray-600">{formatDuration(topic.durationSeconds)}</td>
                  <td className="py-3 text-right font-bold text-gray-900">{formatCurrency(topic.accumulatedCost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
               <tr className="bg-gray-50 print:bg-white print:border-t-2 print:border-black">
                 <td className="pt-6 pb-2 font-bold text-lg text-gray-900">TOTAL</td>
                 <td className="pt-6 pb-2 text-right font-bold text-lg text-gray-900">{formatDuration(totalDuration)}</td>
                 <td className="pt-6 pb-2 text-right font-bold text-2xl text-carbon-900">{formatCurrency(totalCost)}</td>
               </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 p-4 text-center text-xs text-gray-500 italic border-t border-gray-200 print:bg-white">
          "Le temps c'est de l'argent, mais ici, c'est surtout votre argent."
        </div>
      </div>

      <div className="flex justify-center gap-4 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-carbon-800 hover:bg-carbon-700 text-white px-6 py-3 rounded-lg transition-colors shadow hover:shadow-lg"
        >
          <Download className="w-4 h-4" />
          Imprimer / PDF
        </button>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 bg-money-600 hover:bg-money-500 text-white px-6 py-3 rounded-lg shadow-lg shadow-money-900/50 transition-colors hover:shadow-xl hover:scale-105 transform"
        >
          <RotateCcw className="w-4 h-4" />
          Nouvelle Réunion
        </button>
      </div>
    </div>
  );
};