import React, { useState, useEffect } from 'react';
import { Settings, BarChart2 } from 'lucide-react';
import { Participant, Topic, AppState } from './types';
import { AdminPanel } from './components/AdminPanel';
import { Dashboard } from './components/Dashboard';
import { Summary } from './components/Summary';

const STORAGE_KEY = 'le-chrono-cheque-ugo-v1';

const INITIAL_STATE: AppState = {
  participants: [],
  topics: [],
  activeTopicId: null,
  totalMeetingCost: 0,
  isMeetingEnded: false,
  lastTick: null,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isAdminOpen, setIsAdminOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({ ...parsed, lastTick: null }); // Reset tick on reload to prevent huge jumps
        if (parsed.participants.length > 0) setIsAdminOpen(false);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  // Calculate global burn rate (Euros per second)
  const burnRatePerSecond = state.participants.reduce((acc, p) => acc + p.ratePerSecond, 0);

  // Timer Loop
  useEffect(() => {
    if (!state.activeTopicId || state.isMeetingEnded) return;

    const interval = setInterval(() => {
      setState(prev => {
        const now = Date.now();
        const lastTick = prev.lastTick || now;
        const deltaSeconds = (now - lastTick) / 1000;
        
        const costIncrement = burnRatePerSecond * deltaSeconds;

        const updatedTopics = prev.topics.map(t => {
          if (t.id === prev.activeTopicId) {
            return {
              ...t,
              accumulatedCost: t.accumulatedCost + costIncrement,
              durationSeconds: t.durationSeconds + deltaSeconds
            };
          }
          return t;
        });

        return {
          ...prev,
          topics: updatedTopics,
          totalMeetingCost: prev.totalMeetingCost + costIncrement,
          lastTick: now
        };
      });
    }, 1000); 

    return () => clearInterval(interval);
  }, [state.activeTopicId, state.isMeetingEnded, burnRatePerSecond]);


  // Handlers
  const handleImportData = (participants: Participant[], newTopicTitles: string[]) => {
    const newTopics: Topic[] = newTopicTitles.map(title => ({
      id: crypto.randomUUID(),
      title,
      status: 'pending',
      accumulatedCost: 0,
      durationSeconds: 0
    }));

    setState(prev => ({ 
      ...prev, 
      participants,
      // If we are re-importing, we preserve existing topics if they have data? 
      // For simplicity/UX of this specific app request, we append new topics or replace if empty.
      // Let's just append them to existing if any, or set them if empty.
      topics: [...prev.topics, ...newTopics] 
    }));
  };

  const handleAddTopic = (title: string) => {
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      title,
      status: 'pending',
      accumulatedCost: 0,
      durationSeconds: 0
    };
    setState(prev => ({ ...prev, topics: [...prev.topics, newTopic] }));
  };

  const handleStartTopic = (id: string) => {
    setState(prev => ({
      ...prev,
      activeTopicId: id,
      lastTick: Date.now(),
      topics: prev.topics.map(t => 
        t.id === id ? { ...t, status: 'active' } : t
      )
    }));
  };

  const handlePauseTopic = (id: string) => {
     setState(prev => ({
      ...prev,
      activeTopicId: null,
      lastTick: null,
      topics: prev.topics.map(t => 
        t.id === id ? { ...t, status: 'paused' } : t
      )
    }));
  };

  const handleStopTopic = (id: string) => {
    setState(prev => {
      const isCurrent = prev.activeTopicId === id;
      return {
        ...prev,
        activeTopicId: isCurrent ? null : prev.activeTopicId,
        lastTick: null,
        topics: prev.topics.map(t => 
          t.id === id ? { ...t, status: 'completed' } : t
        )
      };
    });
  };

  const handleEndMeeting = () => {
    setState(prev => ({
      ...prev,
      activeTopicId: null,
      isMeetingEnded: true
    }));
  };

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir tout effacer ?")) {
      setState(INITIAL_STATE);
      setIsAdminOpen(true);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-carbon-950 text-gray-100 font-sans selection:bg-money-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-carbon-900 border-b border-gray-800 p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-money-600 p-2 rounded-lg text-white">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              Le chrono-chèque <span className="text-money-500">d’Ugo</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {!state.isMeetingEnded && (
               <button 
               onClick={() => setIsAdminOpen(!isAdminOpen)}
               className={`p-2 rounded-full transition-colors ${isAdminOpen ? 'bg-money-900 text-money-400' : 'text-gray-400 hover:text-white'}`}
               title="Paramètres"
             >
               <Settings className="w-5 h-5" />
             </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        
        {isAdminOpen ? (
          <AdminPanel 
            onImport={handleImportData} 
            onClose={() => setIsAdminOpen(false)}
            hasData={state.participants.length > 0}
          />
        ) : state.isMeetingEnded ? (
          <Summary 
            topics={state.topics}
            totalCost={state.totalMeetingCost}
            totalDuration={state.topics.reduce((acc, t) => acc + t.durationSeconds, 0)}
            participants={state.participants}
            onReset={handleReset}
          />
        ) : (
          <Dashboard 
            topics={state.topics}
            activeTopicId={state.activeTopicId}
            totalCost={state.totalMeetingCost}
            participants={state.participants}
            burnRatePerSecond={burnRatePerSecond}
            onAddTopic={handleAddTopic}
            onStartTopic={handleStartTopic}
            onPauseTopic={handlePauseTopic}
            onStopTopic={handleStopTopic}
            onEndMeeting={handleEndMeeting}
          />
        )}
      </main>

    </div>
  );
};

export default App;