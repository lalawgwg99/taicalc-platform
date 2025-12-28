import React from 'react';
import { DetailedReportData, Language } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { TRANSLATIONS } from '../constants';
import { Compass, Palette, Hash, ScrollText, ArrowDown } from 'lucide-react';

interface Props {
  data: DetailedReportData;
  language: Language;
}

const DetailedReport: React.FC<Props> = ({ data, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-black/80 border border-white/10 rounded-sm p-6 md:p-12 space-y-16 animate-float shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-5xl mx-auto">
      
      {/* Report Header */}
      <div className="text-center border-b border-red-900/30 pb-10">
        <div className="inline-block px-4 py-1.5 bg-red-900/20 border border-red-500/30 text-red-500 text-xs font-mono tracking-[0.3em] mb-6">CONFIDENTIAL</div>
        <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 uppercase tracking-wide">{t.report.title}</h3>
        <p className="text-white/40 text-sm font-mono uppercase tracking-widest">Authorized by The Five Elders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Radar Chart Section */}
        <div className="space-y-8">
          <div className="h-[400px] w-full relative bg-white/5 rounded-sm border border-white/5 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.aspects}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 14, fontFamily: 'Noto Serif TC' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="#ef4444"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="absolute bottom-4 left-4 text-xs text-white/30 font-mono">
              FIG 1.1: FATE METRICS
            </div>
          </div>

          {/* Lucky Elements */}
          <div className="bg-red-950/10 p-8 rounded-sm border border-red-900/20">
            <h4 className="text-red-500 text-sm font-bold uppercase tracking-[0.2em] mb-8 flex items-center gap-2 border-b border-red-900/30 pb-3">
              <Compass size={16} /> {t.report.lucky}
            </h4>
            <div className="grid grid-cols-2 gap-y-8 gap-x-6">
              <div className="flex flex-col gap-3">
                <span className="text-xs text-white/50 flex items-center gap-2 uppercase tracking-wider"><Palette size={12}/> {t.report.colors}</span>
                <div className="flex flex-wrap gap-3">
                   {data.lucky.colors.map((c, i) => (
                      <span key={i} className="text-white font-serif text-lg border-b border-white/20 pb-0.5">{c}</span>
                   ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xs text-white/50 flex items-center gap-2 uppercase tracking-wider"><Hash size={12}/> {t.report.numbers}</span>
                 <div className="flex flex-wrap gap-3">
                   {data.lucky.numbers.map((n, i) => (
                      <span key={i} className="text-white font-mono text-lg border border-white/10 px-3 py-1 rounded-sm">{n}</span>
                   ))}
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-3">
                <span className="text-xs text-white/50 flex items-center gap-2 uppercase tracking-wider"><Compass size={12}/> {t.report.direction}</span>
                <span className="text-white font-serif text-2xl text-red-100">{data.lucky.direction}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Analysis - Extended */}
        <div className="space-y-10">
           {/* Advice First */}
            <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-500/30 p-10 rounded-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-20">
                 <ScrollText size={80} className="text-red-500" />
               </div>
               <h4 className="text-red-500 font-display font-bold mb-6 flex items-center gap-2 tracking-widest text-base uppercase">
                 {t.report.advice}
               </h4>
               <p className="text-red-50/90 text-lg md:text-xl leading-loose font-serif italic relative z-10">
                 "{data.advice}"
               </p>
               <div className="mt-6 flex justify-end">
                 <div className="h-px w-16 bg-red-500/50"></div>
               </div>
            </div>

            <div className="text-center pt-4">
               <ArrowDown size={24} className="text-white/20 mx-auto animate-bounce" />
               <span className="text-xs text-white/20 font-mono uppercase tracking-widest mt-2 block">Detailed Analysis Below</span>
            </div>
        </div>
      </div>

      {/* Extended Aspects Analysis */}
      <div className="border-t border-white/5 pt-16">
        <h4 className="text-white text-base font-bold uppercase tracking-[0.2em] mb-10 text-center">Systematic Breakdown</h4>
        <div className="grid grid-cols-1 gap-8">
          {data.aspects.map((aspect) => (
             <div key={aspect.key} className="bg-white/[0.02] p-8 md:p-10 rounded-sm border border-white/5 hover:border-red-900/30 transition-colors group">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                 <h5 className="text-red-400 font-display font-bold text-xl md:text-2xl tracking-wide group-hover:text-red-500 transition-colors">
                    {aspect.label}
                 </h5>
                 <div className="flex items-center gap-4">
                    <div className="h-2 w-40 bg-white/10 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-full" style={{width: `${aspect.score}%`}}></div>
                    </div>
                    <span className="text-sm text-white/40 font-mono min-w-[3rem] text-right">{aspect.score}/100</span>
                 </div>
               </div>
               
               <p className="text-gray-200 text-base md:text-lg leading-loose opacity-90 border-l-2 border-white/10 pl-6 ml-2 font-sans font-light">
                 {aspect.description}
               </p>
             </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-10 border-t border-white/5">
        <p className="text-xs text-white/20 font-mono uppercase">End of Dossier // Prophet.AI</p>
      </div>
    </div>
  );
};

export default DetailedReport;