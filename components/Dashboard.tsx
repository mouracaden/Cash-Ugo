import React, { useState } from 'react';
import { Play, Pause, Square, Plus, Trash2, Clock, Banknote, Briefcase } from 'lucide-react';
import { Topic, Participant } from '../types';
import { formatCurrency, formatDuration, getWittyRemark } from '../utils';

interface DashboardProps {
  topics: Topic[];
  activeTopicId: string | null;
  totalCost: number;
  participants: Participant[];
  onAddTopic: (title: string) => void;
  onStartTopic: (id: string) => void;
  onPauseTopic: (id: string) => void;
  onStopTopic: (id: string) => void;
  onEndMeeting: () => void;
  burnRatePerSecond: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  topics,
  activeTopicId,
  totalCost,
  participants,
  onAddTopic,
  onStartTopic,
  onPauseTopic,
  onStopTopic,
  onEndMeeting,
  burnRatePerSecond
}) => {
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopicTitle.trim()) {
      onAddTopic(newTopicTitle);
      setNewTopicTitle('');
    }
  };

  const activeTopic = topics.find(t => t.id === activeTopicId);
  const activeParticipantsCount = participants.length;

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full p-4 gap-6">
      
      {/* Top Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Burn Rate - Small Card */}
        <div className="md:col-span-3 bg-carbon-900 border border-gray-800 p-4 rounded-lg flex flex-col justify-between relative overflow-hidden group h-32 md:h-auto">
           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <UsersIcon count={activeParticipantsCount} />
           </div>
           <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Taux de combustion</span>
           <div>
             <span className="text-2xl font-mono text-gray-200 block">
               {formatCurrency(burnRatePerSecond * 60)}
             </span>
             <span className="text-xs text-gray-500 uppercase">par minute</span>
           </div>
        </div>

        {/* MAIN DISPLAY: Current Topic Cost */}
        <div className="md:col-span-6 bg-gradient-to-b from-carbon-900 to-black border border-money-900/50 p-6 rounded-lg flex flex-col items-center justify-center relative shadow-[0_0_40px_rgba(46,204,113,0.1)] min-h-[200px]">
           
           <div className="flex items-center gap-2 mb-2">
             <div className={`w-2 h-2 rounded-full ${activeTopicId ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></div>
             <span className="text-xs font-mono text-money-500 uppercase tracking-widest">
                {activeTopicId ? 'EN DIRECT' : 'EN PAUSE'}
             </span>
           </div>

           <div className="text-center z-10 w-full">
             <h2 className="text-lg md:text-xl text-gray-300 font-medium mb-1 truncate max-w-full px-4">
               {activeTopic ? activeTopic.title : "Aucun sujet actif"}
             </h2>
             
             <div className="flex flex-col items-center">
               <span className="text-5xl md:text-7xl font-bold font-mono text-white tracking-tighter tabular-nums text-shadow-glow my-2">
                 {activeTopic ? formatCurrency(activeTopic.accumulatedCost) : formatCurrency(0)}
               </span>
               <span className="text-xs text-gray-500 uppercase tracking-widest">Coût du sujet en cours</span>
             </div>
           </div>
        </div>

        {/* Total Cost - Secondary Display */}
        <div className="md:col-span-3 bg-carbon-900 border border-gray-800 p-4 rounded-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-money-900/5"></div>
           <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1 relative z-10">Total Réunion</span>
           <span className="text-3xl font-mono text-money-400 font-bold relative z-10">
             {formatCurrency(totalCost)}
           </span>
           <p className="text-gray-600 text-[10px] mt-2 font-mono h-4 relative z-10">
             {activeTopicId ? getWittyRemark(totalCost) : "..."}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        
        {/* Left: Topic List */}
        <div className="lg:col-span-2 flex flex-col bg-carbon-900 border border-gray-800 rounded-lg overflow-hidden h-[500px]">
          <div className="p-4 border-b border-gray-800 bg-carbon-950 flex justify-between items-center">
            <h3 className="font-bold text-gray-200 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-money-500" />
              Sujets de discussion
            </h3>
            <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
              {topics.filter(t => t.status === 'completed').length} / {topics.length} Terminé
            </span>
          </div>

          <div className="flex-grow overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {topics.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                <Briefcase className="w-12 h-12 mb-2" />
                <p>Aucun sujet à l'ordre du jour.</p>
              </div>
            )}

            {topics.map(topic => (
              <div 
                key={topic.id}
                className={`flex items-center justify-between p-3 rounded border transition-all ${
                  topic.id === activeTopicId 
                    ? 'bg-money-900/10 border-money-500/50 shadow-inner' 
                    : topic.status === 'completed'
                    ? 'bg-gray-900/50 border-gray-800 opacity-60'
                    : 'bg-carbon-950 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex-grow min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium truncate ${topic.id === activeTopicId ? 'text-white' : 'text-gray-300'}`}>
                      {topic.title}
                    </h4>
                    {topic.status === 'active' && (
                       <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-money-400 opacity-75 ml-[-10px] mt-[-10px]"></span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(topic.durationSeconds)}
                    </span>
                    <span className={`flex items-center gap-1 ${topic.id === activeTopicId ? 'text-money-400' : ''}`}>
                      <Banknote className="w-3 h-3" />
                      {formatCurrency(topic.accumulatedCost)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {topic.status !== 'completed' && topic.status !== 'active' && (
                    <button 
                      onClick={() => onStartTopic(topic.id)}
                      disabled={!!activeTopicId}
                      className="p-2 bg-carbon-800 hover:bg-money-600 hover:text-white text-gray-400 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Démarrer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  )}
                  
                  {topic.status === 'active' && (
                    <button 
                      onClick={() => onPauseTopic(topic.id)}
                      className="p-2 bg-yellow-600/20 hover:bg-yellow-600 text-yellow-500 hover:text-white rounded-full transition-colors"
                      title="Pause"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                    </button>
                  )}

                   {topic.status !== 'completed' && (
                    <button 
                      onClick={() => onStopTopic(topic.id)}
                      disabled={topic.status === 'pending' && topic.durationSeconds === 0}
                      className="p-2 bg-carbon-800 hover:bg-red-600 hover:text-white text-gray-400 rounded-full transition-colors disabled:opacity-30"
                      title="Terminer ce sujet"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-carbon-950 border-t border-gray-800">
            <form onSubmit={handleAddSubmit} className="flex gap-2">
              <input
                type="text"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                placeholder="Ajout rapide d'un sujet..."
                className="flex-grow bg-carbon-900 text-sm text-white border border-gray-700 rounded px-3 py-2 outline-none focus:border-money-500"
              />
              <button 
                type="submit"
                disabled={!newTopicTitle.trim()}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Controls & Info */}
        <div className="flex flex-col gap-4">
           
           <div className="bg-carbon-900 border border-gray-800 p-4 rounded-lg flex-grow flex flex-col justify-center items-center text-center space-y-4">
              <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm">Contrôle Réunion</h3>
              
              {!activeTopicId ? (
                 <div className="p-4 bg-carbon-950 rounded border border-gray-800 text-sm text-gray-500">
                    <p className="mb-2">Le compteur est arrêté.</p>
                    <p>Sélectionnez un sujet dans la liste pour démarrer la facturation.</p>
                 </div>
              ) : (
                <div className="p-4 bg-money-900/10 rounded border border-money-900/30 w-full animate-pulse-fast">
                   <p className="text-money-400 text-sm font-bold">FACTURATION ACTIVE</p>
                </div>
              )}

              <div className="mt-auto w-full pt-8">
                <button
                  onClick={onEndMeeting}
                  className="w-full bg-red-900/30 hover:bg-red-700 text-red-200 border border-red-900/50 font-bold py-4 px-6 rounded transition-all flex items-center justify-center gap-2 group"
                >
                  <Square className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  TERMINER LA RÉUNION
                </button>
                <p className="text-[10px] text-gray-600 mt-2 text-center">
                  Ceci finalisera le compte rendu et arrêtera tous les minuteurs.
                </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const UsersIcon = ({ count }: { count: number }) => (
  <div className="flex -space-x-2">
    {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
      <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-carbon-900 flex items-center justify-center text-[10px] text-gray-400">
        {i === 4 && count > 5 ? `+${count-4}` : ''}
      </div>
    ))}
  </div>
);