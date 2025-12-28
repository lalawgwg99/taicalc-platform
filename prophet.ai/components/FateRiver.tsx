import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { FatePoint, Language } from '../types';
import { Sparkles, TrendingUp, TrendingDown, Activity, Orbit } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  data: FatePoint[];
  onPointSelect: (point: FatePoint) => void;
  selectedPoint: FatePoint | null;
  language: Language;
}

const FIBONACCI_NUMBERS = [13, 21, 34, 55, 89];

const CustomTooltip = ({ active, payload, label, language }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as FatePoint;
    const isFib = FIBONACCI_NUMBERS.includes(data.age);
    const t = TRANSLATIONS[language];

    return (
      <div className="bg-void/90 border border-gold/30 p-3 rounded-lg backdrop-blur-md shadow-xl text-sm max-w-[200px]">
        <div className="flex justify-between items-center mb-1">
          <p className="text-gold font-bold font-display">Age: {label}</p>
          {isFib && <Orbit size={14} className="text-cyan-400 animate-spin-slow" />}
        </div>
        <p className="text-white">Luck Index: <span className="text-ethereal font-mono">{data.luckScore}</span></p>

        {isFib && (
          <div className="mt-2 pt-2 border-t border-cyan-500/30 text-xs text-cyan-200 font-bold">
            <span className="text-cyan-400">φ</span> {t.fibonacci.label}
            <div className="text-[10px] font-normal text-cyan-200/70">{t.fibonacci.desc}</div>
          </div>
        )}

        {data.event && (
          <div className="mt-2 pt-2 border-t border-white/10 text-xs text-gray-300">
            <span className="text-gold">✦</span> {data.event}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const FateRiver: React.FC<Props> = ({ data, onPointSelect, selectedPoint, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full h-[280px] md:h-[400px] relative group transition-all duration-500">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-ethereal/5 to-transparent rounded-xl pointer-events-none" />

      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 text-xs text-white/40">
        <Activity size={14} />
        <span>{t.fateRiver.toUpperCase()}</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          onClick={(e) => {
            if (e && e.activePayload) {
              onPointSelect(e.activePayload[0].payload);
            }
          }}
        >
          <defs>
            <linearGradient id="colorLuck" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
            <filter id="glow" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="fibGlow" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="age"
            stroke="#94a3b8"
            tick={{ fontSize: 12, fontFamily: 'Cinzel' }}
            tickMargin={10}
            label={{ value: 'AGE', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10 }}
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip content={<CustomTooltip language={language} />} cursor={{ stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '5 5' }} />

          <Area
            type="monotone"
            dataKey="luckScore"
            stroke="#fbbf24"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorLuck)"
            filter="url(#glow)"
            className="cursor-crosshair"
            animationDuration={2000}
            animationEasing="ease-in-out"
          />

          {/* Highlights for Fibonacci Numbers */}
          {data.map((entry, index) => (
            FIBONACCI_NUMBERS.includes(entry.age) ? (
              <ReferenceDot
                key={`fib-${index}`}
                x={entry.age}
                y={entry.luckScore}
                r={5}
                fill="#22d3ee" // Cyan
                stroke="#fff"
                strokeWidth={2}
                filter="url(#fibGlow)"
                isFront
              />
            ) : null
          ))}

          {/* Highlights for major events */}
          {data.map((entry, index) => (
            entry.event && !FIBONACCI_NUMBERS.includes(entry.age) ? (
              <ReferenceDot
                key={index}
                x={entry.age}
                y={entry.luckScore}
                r={4}
                fill="#fff"
                stroke="#fbbf24"
                strokeWidth={2}
                isFront
              />
            ) : null
          ))}

          {/* Selected Point Indicator */}
          {selectedPoint && (
            <ReferenceDot
              x={selectedPoint.age}
              y={selectedPoint.luckScore}
              r={8}
              fill="#fbbf24"
              stroke="#fff"
              strokeWidth={2}
            >
              <animate attributeName="r" from="6" to="10" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0.5" dur="1s" repeatCount="indefinite" />
            </ReferenceDot>
          )}

        </AreaChart>
      </ResponsiveContainer>

      <div className="absolute bottom-2 left-6 text-xs text-white/30 italic">
        * {t.clickToConsult} <span className="text-cyan-400 ml-2">●</span> {t.fibonacci.label}
      </div>
    </div>
  );
};

export default FateRiver;