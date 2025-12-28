import React from 'react';
import { ConsultationResponse, MasterRole, Language } from '../types';
import { Gavel, Coins, Heart, Skull, Crown, MessageSquare, Star, ChevronRight } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  advice: ConsultationResponse[];
  loading: boolean;
  age: number;
  language: Language;
}

const ElderCard: React.FC<{ data: ConsultationResponse; delay: number; language: Language }> = ({ data, delay, language }) => {
  const t = TRANSLATIONS[language];

  const getIcon = (role: MasterRole) => {
    switch (role) {
      case 'authority': return <Crown size={28} className="text-yellow-500" />; // Saturn - Gold
      case 'karma': return <Gavel size={28} className="text-purple-400" />; // Jupiter - Purple
      case 'fortune': return <Coins size={28} className="text-emerald-400" />; // Venus - Green
      case 'desire': return <Heart size={28} className="text-red-500" />; // Mars - Red
      case 'calamity': return <Skull size={28} className="text-gray-400" />; // Mercury - Grey
      default: return <MessageSquare size={28} />;
    }
  };

  const getTitle = (role: MasterRole) => {
    return t.roles[role] || role;
  };

  // Divine Throne Styling
  return (
    <div
      className="relative group h-full w-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glow Effect behind the card */}
      <div className="absolute inset-0 bg-gradient-to-b from-divine/20 to-judgment/20 rounded-lg blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>

      <div className="relative h-full bg-[#0a0a0c] border border-white/10 group-hover:border-divine/50 p-6 rounded-lg shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 overflow-hidden">

        {/* Top Metallic Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-divine/50 to-transparent opacity-50"></div>

        <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4 shrink-0 relative z-10">
          <div className="p-3 rounded-full bg-black border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500">
            {getIcon(data.role)}
          </div>
          <div>
            <h4 className="font-display font-bold text-gray-100 tracking-[0.15em] text-sm uppercase group-hover:text-divine transition-colors">
              {getTitle(data.role).split(' ')[0]} {/* Show Role Name */}
            </h4>
            <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest block mt-1">
              {getTitle(data.role).split(' ')[1] || 'Elder Star'} {/* Show Planet Name if avail */}
            </span>
          </div>
        </div>

        <div className="space-y-5 flex-grow flex flex-col relative z-10">
          <p className="text-gray-300 text-lg leading-loose font-serif font-light flex-grow">
            {data.content}
          </p>

          {data.quote && (
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="flex gap-3">
                <div className="w-1 bg-divine/30 rounded-full shrink-0"></div>
                <div className="text-sm text-gray-400/80 italic font-serif">
                  "{data.quote.text}"
                </div>
              </div>
              <div className="mt-2 text-right text-divine/60 font-bold uppercase text-[10px] tracking-[0.2em]">
                — {data.quote.source}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Council: React.FC<Props> = ({ advice, loading, age, language }) => {
  const t = TRANSLATIONS[language];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 relative">
        <div className="absolute inset-0 bg-god-rays opacity-50 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-divine blur-2xl opacity-20 animate-pulse"></div>
            <Crown size={64} className="text-divine animate-float relative z-10" strokeWidth={1} />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-divine font-display tracking-[0.3em] text-xl animate-pulse text-glow">
              THE COUNCIL IS CONVENING
            </p>
            <p className="text-white/30 text-xs font-mono tracking-widest">
              CALCULATING KARMIC DEBT FOR AGE {age}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (advice.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-white/5 rounded-lg bg-black/20 backdrop-blur-sm">
        <Star size={40} className="mb-4 text-white/10" />
        <p className="text-base text-white/30 font-mono tracking-wider uppercase">Select a point in the river to summon the Elders</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Background Ambience */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-divine/5 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="flex flex-col md:flex-row items-center justify-between border-b border-divine/20 pb-6 gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 border border-divine/30 rounded-full bg-black/50">
            <Gavel size={32} className="text-divine" />
          </div>
          <div>
            <h3 className="text-3xl font-display text-white font-bold uppercase tracking-[0.15em] text-glow">
              {t.council}
            </h3>
            <p className="text-divine/60 text-xs font-mono tracking-[0.3em] mt-1">
              JUDGMENT FOR AGE {age}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Mobile Hint */}
          <div className="lg:hidden flex items-center gap-2 text-[10px] text-white/40 font-mono tracking-widest animate-pulse">
            <span>SWIPE TO CONSULT</span>
            <ChevronRight size={12} />
          </div>
          <div className="px-4 py-2 bg-judgment/20 border border-judgment/50 rounded text-red-400 text-xs font-mono tracking-widest animate-pulse hidden md:block">
            VERDICT: IN SESSION
          </div>
        </div>
      </div>

      {/* 
        Responsive Layout Strategy:
        Mobile: Flexbox with Snap Scrolling (Carousel)
        Desktop (lg): CSS Grid (The Throne Room Layout)
      */}
      <div className="
        flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 pb-8 hide-scrollbar 
        lg:grid lg:grid-cols-6 lg:gap-8 lg:overflow-visible lg:pb-0 lg:perspective-[1000px]
      ">
        {/* Top Row: Authority & Karma (The Judges) */}
        <div className="min-w-[80vw] md:min-w-[45vw] lg:min-w-0 snap-center lg:col-span-3 h-full animate-float" style={{ animationDelay: '0ms' }}>
          {advice[0] && <ElderCard data={advice[0]} delay={0} language={language} />}
        </div>
        <div className="min-w-[80vw] md:min-w-[45vw] lg:min-w-0 snap-center lg:col-span-3 h-full animate-float" style={{ animationDelay: '500ms' }}>
          {advice[1] && <ElderCard data={advice[1]} delay={100} language={language} />}
        </div>

        {/* Bottom Row: The Aspects of Life */}
        <div className="min-w-[80vw] md:min-w-[45vw] lg:min-w-0 snap-center lg:col-span-2 h-full animate-float" style={{ animationDelay: '1000ms' }}>
          {advice[2] && <ElderCard data={advice[2]} delay={200} language={language} />}
        </div>
        <div className="min-w-[80vw] md:min-w-[45vw] lg:min-w-0 snap-center lg:col-span-2 h-full animate-float" style={{ animationDelay: '1500ms' }}>
          {advice[3] && <ElderCard data={advice[3]} delay={300} language={language} />}
        </div>
        <div className="min-w-[80vw] md:min-w-[45vw] lg:min-w-0 snap-center lg:col-span-2 h-full animate-float" style={{ animationDelay: '2000ms' }}>
          {advice[4] && <ElderCard data={advice[4]} delay={400} language={language} />}
        </div>
      </div>
    </div>
  );
};

export default Council;