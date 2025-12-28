import React from 'react';
import { ConsultationResponse, MasterRole, Language } from '../types';
import { Scroll, Sword, Heart, MessageSquare } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  advice: ConsultationResponse[];
  loading: boolean;
  age: number;
  language: Language;
}

const MasterCard: React.FC<{ data: ConsultationResponse; delay: number; language: Language }> = ({ data, delay, language }) => {
  const t = TRANSLATIONS[language];
  
  const getIcon = (role: MasterRole) => {
    switch (role) {
      case 'critic': return <Sword size={20} className="text-red-400" />;
      case 'healer': return <Heart size={20} className="text-emerald-400" />;
      case 'strategist': return <Scroll size={20} className="text-blue-400" />;
    }
  };

  const getTitle = (role: MasterRole) => {
    return t.roles[role];
  };

  const getBg = (role: MasterRole) => {
    switch (role) {
      case 'critic': return "bg-red-950/20 border-red-900/50";
      case 'healer': return "bg-emerald-950/20 border-emerald-900/50";
      case 'strategist': return "bg-blue-950/20 border-blue-900/50";
    }
  };

  return (
    <div 
      className={`p-5 rounded-lg border backdrop-blur-sm ${getBg(data.role)} animate-float transition-all duration-700`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
        <div className="p-2 rounded-full bg-white/5 shadow-inner">
          {getIcon(data.role)}
        </div>
        <h4 className="font-display font-bold text-gray-200 tracking-wider text-sm">{getTitle(data.role)}</h4>
      </div>

      <div className="space-y-4">
        <p className="text-gray-300 text-sm leading-relaxed font-light">
          {data.content}
        </p>

        {data.quote && (
          <div className="mt-3 pl-3 border-l-2 border-gold/40 text-xs text-white/50 italic">
             "{data.quote.text}"
             <div className="mt-1 text-gold/60 not-italic font-display text-[10px]">
               — {data.quote.source}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ThreeMasters: React.FC<Props> = ({ advice, loading, age, language }) => {
  const t = TRANSLATIONS[language];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative w-16 h-16">
           <div className="absolute inset-0 border-4 border-t-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
           <div className="absolute inset-2 border-4 border-t-transparent border-r-ethereal border-b-transparent border-l-transparent rounded-full animate-spin-reverse"></div>
        </div>
        <p className="text-gold/60 font-display tracking-widest text-sm animate-pulse">
          CONVENING THE COUNCIL...
        </p>
      </div>
    );
  }

  if (advice.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white/30 border border-dashed border-white/10 rounded-xl">
        <MessageSquare size={32} className="mb-2 opacity-50" />
        <p className="text-sm font-light">Select a point on the river to receive wisdom.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display text-gold">{t.council} (Age {age})</h3>
        <span className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10 text-white/40">{t.aiAnalysis}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {advice.map((item, idx) => (
          <MasterCard key={item.role} data={item} delay={idx * 200} language={language} />
        ))}
      </div>
    </div>
  );
};

export default ThreeMasters;