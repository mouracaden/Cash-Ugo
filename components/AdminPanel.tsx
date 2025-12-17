import React, { useState } from 'react';
import { Upload, Users, AlertTriangle, List } from 'lucide-react';
import { Participant } from '../types';
import { parseCSVData } from '../utils';

interface AdminPanelProps {
  onImport: (participants: Participant[], topics: string[]) => void;
  onClose: () => void;
  hasData: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onImport, onClose, hasData }) => {
  const [csvInput, setCsvInput] = useState('');
  const [topicsInput, setTopicsInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    if (!csvInput.trim()) {
      setError("Veuillez coller des données participants.");
      return;
    }

    const participants = parseCSVData(csvInput);
    
    if (participants.length === 0) {
      setError("Aucun participant valide trouvé. Vérifiez le format (Nom, Titre, Salaire).");
      return;
    }

    // Parse topics (filter out empty lines)
    const topics = topicsInput
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onImport(participants, topics);
    setError(null);
    onClose();
  };

  const participantPlaceholder = `Jean Dupont	CEO	120000
Marie Curie	R&D Lead	95000
Stagiaire	Café	20000`;

  const topicPlaceholder = `Introduction & Café
Revue du Budget T1
Brainstorming Innovation
Points Divers
Conclusion`;

  return (
    <div className="bg-carbon-900 border border-gray-800 rounded-lg p-6 shadow-2xl max-w-4xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-6 text-money-500">
        <Users className="w-8 h-8" />
        <h2 className="text-2xl font-bold tracking-tight">Configuration de la Réunion</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Participants */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" /> Participants
            </label>
            <div className="text-xs text-gray-500 mb-2 font-mono bg-carbon-950 p-2 rounded border border-gray-800">
              Copiez-collez vos colonnes directement depuis Excel.<br/>
              Ordre : Nom | Titre | Salaire Annuel
            </div>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder={participantPlaceholder}
              className="w-full h-64 bg-carbon-950 text-gray-200 border border-gray-700 rounded-md p-3 font-mono text-sm focus:ring-2 focus:ring-money-500 focus:border-transparent outline-none transition-all resize-none whitespace-pre"
            />
          </div>
        </div>

        {/* Right Col: Topics */}
        <div className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <List className="w-4 h-4" /> Ordre du Jour (Optionnel)
            </label>
            <div className="text-xs text-gray-500 mb-2 font-mono bg-carbon-950 p-2 rounded border border-gray-800">
              Un sujet par ligne. Copiez-collez votre agenda ici.
            </div>
            <textarea
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder={topicPlaceholder}
              className="w-full h-64 bg-carbon-950 text-gray-200 border border-gray-700 rounded-md p-3 font-mono text-sm focus:ring-2 focus:ring-money-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-900/50">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-800 mt-6">
        {hasData && (
            <button 
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Annuler
          </button>
        )}
        
        <button
          onClick={handleImport}
          className="flex items-center gap-2 bg-money-600 hover:bg-money-500 text-white font-bold py-3 px-8 rounded shadow-lg shadow-money-900/50 transition-all transform hover:scale-105"
        >
          <Upload className="w-4 h-4" />
          {hasData ? 'Mettre à jour' : 'Lancer la Réunion'}
        </button>
      </div>
    </div>
  );
};