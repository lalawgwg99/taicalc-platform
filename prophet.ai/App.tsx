import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, FatePoint, ChartSummary, ConsultationResponse, Achievement, DivinationSystem, Language, DetailedReportData } from './types';
import { generateLifeChart, consultMasters, generateDetailedReport } from './services/geminiService';
import FateRiver from './components/FateRiver';
import Council from './components/Council';
import DetailedReport from './components/DetailedReport';
import { ACHIEVEMENTS_DATA, TRANSLATIONS } from './constants';
import { Lock, User, Calendar, Clock, ArrowRight, RefreshCw, Trophy, Star, Flame, Globe, Volume2, VolumeX, Eye, FileText, Hexagon, Sparkles, ScrollText, Send, Share2, Download } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';

// --- Real Sound Logic ---
// NOTE: For production, replace these URLs with local files in 'public/sounds/'
// e.g., '/sounds/click.mp3' and '/sounds/ambient.mp3'
const SFX_URLS = {
  click: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_30b3554909.mp3?filename=atmosphere-dark-1-16803.mp3', // Placeholder (Dark atmos hit)
  reveal: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_73132e4d0d.mp3?filename=cinematic-atmosphere-score-2-19266.mp3', // Placeholder (Choir/Drone)
  ambient: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=drone-space-main-9706.mp3' // Placeholder (Space Drone)
};

const useSound = (enabled: boolean) => {
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Ambient Sound
    const audio = new Audio(SFX_URLS.ambient);
    audio.loop = true;
    audio.volume = 0.3;
    ambientRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    // Handle Play/Pause based on enabled state
    if (ambientRef.current) {
      if (enabled) {
        // Browser policy requires interaction first, caught by promise
        ambientRef.current.play().catch(e => console.log("Audio autoplay blocked until interaction"));
      } else {
        ambientRef.current.pause();
      }
    }
  }, [enabled]);

  const playClick = () => {
    if (!enabled) return;
    const audio = new Audio(SFX_URLS.click);
    audio.volume = 0.5;
    audio.play().catch(() => { });
  };

  const playReveal = () => {
    if (!enabled) return;
    const audio = new Audio(SFX_URLS.reveal);
    audio.volume = 0.4;
    audio.play().catch(() => { });
  };

  const startAmbient = () => {
    if (enabled && ambientRef.current) {
      ambientRef.current.play().catch(() => { });
    }
  };

  return { playClick, playReveal, startAmbient };
};

// --- Sub-components ---

const LanguageSwitcher: React.FC<{ current: Language; onChange: (l: Language) => void }> = ({ current, onChange }) => {
  const langs: { id: Language; label: string }[] = [
    { id: 'zh-TW', label: '繁體' },
    { id: 'zh-CN', label: '简体' },
    { id: 'en', label: 'EN' },
    { id: 'ja', label: 'JP' },
  ];

  return (
    <div className="flex flex-wrap gap-2 bg-black/40 rounded-full px-4 py-2 border border-white/10 backdrop-blur-md shadow-lg">
      {langs.map(l => (
        <button
          key={l.id}
          onClick={() => onChange(l.id)}
          className={`px-3 py-1 text-[12px] font-bold uppercase font-mono tracking-widest transition-all rounded-full border ${current === l.id ? 'bg-white/10 text-divine border-divine/50 shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

const SystemSwitcher: React.FC<{ current: DivinationSystem; onChange: (s: DivinationSystem) => void; language: Language; loading?: boolean }> = ({ current, onChange, language, loading }) => {
  const t = TRANSLATIONS[language];
  const systems: { id: DivinationSystem; label: string; icon: React.ReactNode }[] = [
    { id: 'ziwei', label: t.ziwei, icon: <Star size={12} /> },
    { id: 'bazi', label: t.bazi, icon: <Flame size={12} /> },
    { id: 'western', label: t.western, icon: <Globe size={12} /> },
  ];

  return (
    <div className={`flex flex-wrap gap-2 bg-black/40 rounded-full px-4 py-2 border border-white/10 backdrop-blur-md shadow-lg transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      {systems.map(s => (
        <button
          key={s.id}
          disabled={loading}
          onClick={() => onChange(s.id)}
          className={`flex items-center gap-2 px-3 py-1 text-[12px] font-bold uppercase font-mono tracking-widest transition-all rounded-full border ${current === s.id ? 'bg-white/10 text-divine border-divine/50 shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          {s.icon}
          <span className="hidden sm:inline">{s.label}</span>
          {loading && current === s.id && <RefreshCw size={10} className="animate-spin ml-1" />}
        </button>
      ))}
    </div>
  );
};

const AchievementToast: React.FC<{ achievement: Achievement | null; onClose: () => void; language: Language }> = ({ achievement, onClose, language }) => {
  const t = TRANSLATIONS[language];
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;
  const translatedAch = t.achievements.list[achievement.id] || achievement;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-float">
      <div className="bg-[#050505] border border-divine/40 p-6 rounded-lg shadow-[0_0_50px_rgba(212,175,55,0.15)] flex items-center gap-6 max-w-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-divine to-transparent group-hover:h-full transition-all duration-1000"></div>
        <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{achievement.icon}</div>
        <div>
          <h4 className="text-divine font-mono font-bold text-xs uppercase tracking-[0.2em] mb-2">{t.achievements.unlocked}</h4>
          <p className="text-white font-display font-bold text-xl tracking-wide">{translatedAch.title}</p>
          <p className="text-gray-400 text-sm font-serif italic mt-1">{translatedAch.desc || translatedAch.description}</p>
        </div>
      </div>
    </div>
  );
};

const Landing: React.FC<{ onUnlock: () => void; language: Language; setLanguage: (l: Language) => void }> = ({ onUnlock, language, setLanguage }) => {
  const t = TRANSLATIONS[language];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-void text-center p-4 md:p-6 relative overflow-hidden">
      {/* Divine Background Effects */}
      <div className="absolute inset-0 bg-god-rays opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] pointer-events-none" />

      {/* Animated Rings */}
      <div className="absolute w-[300px] h-[300px] md:w-[900px] md:h-[900px] border border-divine/10 rounded-full animate-spin-slow top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20" />
      <div className="absolute w-[250px] h-[250px] md:w-[700px] md:h-[700px] border border-judgment/20 rounded-full animate-pulse-slow top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 delay-100" />

      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <LanguageSwitcher current={language} onChange={setLanguage} />
      </div>

      <div className="relative z-10 p-6 md:p-16 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-3xl mx-auto w-full md:w-auto">
        <div className="mb-8 md:mb-12 inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 relative">
          <div className="absolute inset-0 bg-divine/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative z-10 w-full h-full rounded-full bg-black border border-divine/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <Eye className="text-divine w-10 h-10 md:w-[60px] md:h-[60px]" strokeWidth={1} />
          </div>
        </div>

        <h1 className="text-4xl md:text-8xl font-display font-bold text-white mb-4 md:mb-6 tracking-[0.1em] text-glow leading-tight">
          {t.title}
        </h1>
        <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
          <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-divine"></div>
          <span className="text-divine font-mono text-xs md:text-sm tracking-[0.3em] uppercase">{t.subtitle}</span>
          <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-divine"></div>
        </div>

        <p className="text-gray-300 text-sm md:text-xl mb-10 md:mb-16 font-serif max-w-lg mx-auto leading-relaxed md:leading-loose opacity-80 px-2">
          {t.desc}
        </p>

        <button
          onClick={onUnlock}
          className="group relative px-10 py-4 md:px-16 md:py-6 bg-transparent border border-divine/30 text-divine hover:bg-divine/10 hover:border-divine hover:text-white transition-all duration-700 ease-out overflow-hidden font-mono tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm uppercase rounded-sm w-full md:w-auto"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-divine/20 to-transparent transform -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
          <span className="relative flex items-center justify-center gap-4">
            <Lock size={14} className="group-hover:hidden opacity-70 md:w-4 md:h-4" />
            <span className="group-hover:hidden">{t.unlock}</span>
            <span className="hidden group-hover:inline-block text-glow">{t.enter}</span>
            <ArrowRight size={14} className="hidden group-hover:inline-block md:w-4 md:h-4" />
          </span>
        </button>
      </div>

      <div className="absolute bottom-4 md:bottom-8 text-white/20 text-[10px] md:text-xs font-mono uppercase tracking-[0.3em]">
        {t.poweredBy}
      </div>
    </div>
  );
};

const InputForm: React.FC<{ onSubmit: (p: UserProfile) => void; loading: boolean; language: Language; setLanguage: (l: Language) => void }> = ({ onSubmit, loading, language, setLanguage }) => {
  const t = TRANSLATIONS[language];
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    birthDate: '',
    birthTime: '12:00',
    gender: 'male',
    system: 'ziwei'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.birthDate) onSubmit(formData);
  };

  const systems: { id: DivinationSystem; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'ziwei', label: t.ziwei, icon: <Star size={24} />, desc: t.ziweiDesc },
    { id: 'bazi', label: t.bazi, icon: <Flame size={24} />, desc: t.baziDesc },
    { id: 'western', label: t.western, icon: <Globe size={24} />, desc: t.westernDesc },
  ];

  return (

    <div className="min-h-[100dvh] flex items-start pt-10 md:pt-0 md:items-center justify-center bg-black p-4 relative overflow-y-auto safe-area-inset-bottom">
      {/* Ritual Background */}
      <div className="fixed inset-0 bg-god-rays opacity-30 pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

      <div className="w-full max-w-xl bg-[#08080a] p-6 md:p-16 rounded-sm border-y border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 my-10 animate-float">

        {/* Top Controls */}
        <div className="flex justify-end mb-10">
          <LanguageSwitcher current={language} onChange={setLanguage} />
        </div>

        <div className="text-center mb-16">
          <Hexagon className="mx-auto text-divine mb-6 animate-spin-slow" size={48} strokeWidth={1} />
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6 tracking-[0.2em] uppercase">
            {t.incantation}
          </h2>
          <p className="text-white/40 font-mono text-xs tracking-widest uppercase">Input parameters for Judgment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* Name Input */}
          <div className="group relative">
            <label className="block text-xs font-mono text-divine uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
              <User size={14} /> {t.name}
            </label>
            <input
              type="text"
              required
              className="w-full bg-transparent border-b border-white/20 py-4 px-2 text-base md:text-2xl text-white font-serif placeholder-white/10 focus:outline-none focus:border-divine focus:bg-white/[0.02] transition-all"
              placeholder="..."
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group relative">
              <label className="block text-xs font-mono text-divine uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
                <Calendar size={14} /> {t.birthDate}
              </label>
              <input
                type="date"
                required
                className="w-full bg-transparent border-b border-white/20 py-4 px-2 text-white font-mono text-base md:text-lg focus:outline-none focus:border-divine focus:bg-white/[0.02] transition-all [color-scheme:dark]"
                value={formData.birthDate}
                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
            <div className="group relative">
              <label className="block text-xs font-mono text-divine uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
                <Clock size={14} /> {t.birthTime}
              </label>
              <input
                type="time"
                required
                className="w-full bg-transparent border-b border-white/20 py-4 px-2 text-white font-mono text-base md:text-lg focus:outline-none focus:border-divine focus:bg-white/[0.02] transition-all [color-scheme:dark]"
                value={formData.birthTime}
                onChange={e => setFormData({ ...formData, birthTime: e.target.value })}
              />
            </div>
          </div>

          {/* System Selection */}
          <div>
            <label className="block text-xs font-mono text-divine uppercase tracking-[0.2em] mb-6 ml-1 flex items-center gap-2">
              <Eye size={14} /> {t.system}
            </label>
            <div className="grid grid-cols-3 gap-6">
              {systems.map(sys => (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, system: sys.id })}
                  className={`flex flex-col items-center justify-center p-4 md:p-6 rounded border transition-all relative overflow-hidden group min-h-[100px] ${formData.system === sys.id
                    ? 'bg-divine/10 border-divine text-white shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                    : 'bg-white/[0.02] border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                    }`}
                >
                  <div className={`mb-4 transition-transform duration-500 ${formData.system === sys.id ? 'scale-110 text-divine drop-shadow-lg' : 'group-hover:scale-110'}`}>
                    {sys.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{sys.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-xs font-mono text-divine uppercase tracking-[0.2em] mb-6 ml-1 flex items-center gap-2">
              <User size={14} /> {t.gender}
            </label>
            <div className="flex bg-white/[0.02] p-2 border border-white/10 gap-2 rounded-sm">
              {[
                { id: 'male', label: t.male },
                { id: 'female', label: t.female },
                { id: 'other', label: t.other }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g.id as any })}
                  className={`flex-1 py-4 text-sm uppercase font-bold transition-all tracking-widest min-h-[50px] flex items-center justify-center ${formData.gender === g.id
                    ? 'bg-white/10 text-white shadow-lg border border-white/20'
                    : 'text-gray-600 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-12 bg-divine/10 border border-divine/40 text-divine font-display font-bold py-6 hover:bg-divine hover:text-black hover:border-divine transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-6 uppercase tracking-[0.3em] group text-lg relative overflow-hidden"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin relative z-10" size={20} />
                <span className="relative z-10">{t.divining}</span>
              </>
            ) : (
              <>
                <Eye size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">{t.reveal}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App Logic ---

enum ViewState {
  LANDING,
  INPUT,
  DASHBOARD
}

function App() {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [riverData, setRiverData] = useState<FatePoint[]>([]);
  const [summary, setSummary] = useState<ChartSummary | null>(null);

  // Audio State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playClick, playReveal, startAmbient } = useSound(soundEnabled);

  // Dashboard Interaction State
  const [selectedPoint, setSelectedPoint] = useState<FatePoint | null>(null);
  const [consultation, setConsultation] = useState<ConsultationResponse[]>([]);
  const [userQuestion, setUserQuestion] = useState("");

  // Report State
  const [detailedReport, setDetailedReport] = useState<DetailedReportData | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Loading States
  const [loadingRiver, setLoadingRiver] = useState(false);
  const [loadingMasters, setLoadingMasters] = useState(false);

  // Debounce State
  const [pendingSystem, setPendingSystem] = useState<DivinationSystem | null>(null);
  const systemDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('prophet_achievements');
    return saved ? JSON.parse(saved) : ACHIEVEMENTS_DATA;
  });
  const [currentToast, setCurrentToast] = useState<Achievement | null>(null);

  const exploredPoints = useRef<Set<number>>(new Set(
    JSON.parse(localStorage.getItem('prophet_explored_points') || '[]')
  ));

  const usedSystems = useRef<Set<string>>(new Set(
    JSON.parse(localStorage.getItem('prophet_used_systems') || '[]')
  ));

  const t = TRANSLATIONS[language];

  useEffect(() => {
    localStorage.setItem('prophet_achievements', JSON.stringify(achievements));
  }, [achievements]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const idx = prev.findIndex(a => a.id === id);
      if (idx !== -1 && !prev[idx].unlocked) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], unlocked: true };
        setCurrentToast(updated[idx]);
        return updated;
      }
      return prev;
    });
  };

  const updateProgress = (id: string, amount: number) => {
    setAchievements(prev => {
      const idx = prev.findIndex(a => a.id === id);
      if (idx !== -1) {
        const current = prev[idx];
        if (current.unlocked) return prev;

        const newProgress = Math.min((current.progress || 0) + amount, current.target || 100);
        if (newProgress >= (current.target || 100)) {
          const updated = [...prev];
          updated[idx] = { ...current, progress: newProgress, unlocked: true };
          setCurrentToast(updated[idx]);
          return updated;
        } else {
          const updated = [...prev];
          updated[idx] = { ...current, progress: newProgress };
          return updated;
        }
      }
      return prev;
    });
  };

  const handleShare = async () => {
    playClick();
    // We will capture the Chart Summary section as the "Artifact"
    const element = document.getElementById('fate-summary-card');
    if (!element) return;

    try {
      // Small delay to ensure any hover states are cleared
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(element, {
        backgroundColor: '#020204',
        scale: 2, // Retina quality
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `PROPHET_ARTIFACT_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      unlockAchievement('master_analyst'); // Easter egg: unlocking achievement on share
    } catch (e) {
      console.error("Artifact creation failed:", e);
      alert("The mystical energies prevented the capture. Try again.");
    }
  };

  const handleProfileSubmit = async (p: UserProfile) => {
    playClick();
    setProfile(p);
    setLoadingRiver(true);
    setDetailedReport(null);

    if (!usedSystems.current.has(p.system)) {
      usedSystems.current.add(p.system);
      localStorage.setItem('prophet_used_systems', JSON.stringify(Array.from(usedSystems.current)));
      updateProgress('sages_wisdom', 1);
    }

    try {
      const data = await generateLifeChart(p, language);
      setRiverData(data.river);
      setSummary(data.summary);

      const currentAge = new Date().getFullYear() - parseInt(p.birthDate.split('-')[0]);
      const closestPoint = data.river.reduce((prev, curr) =>
        Math.abs(curr.age - currentAge) < Math.abs(prev.age - currentAge) ? curr : prev
      );
      setSelectedPoint(closestPoint);

      playReveal();
      setView(ViewState.DASHBOARD);

      unlockAchievement('first_consult');

      handlePointSelect(closestPoint, p);
    } catch (e) {
      alert("The stars are cloudy. Please check your API Key.");
    } finally {
      setLoadingRiver(false);
    }
  };

  const handlePointSelect = async (point: FatePoint, userProfile: UserProfile | null, specificQuestion?: string) => {
    if (!userProfile) return;
    playClick();
    setSelectedPoint(point);
    // Reset question input when selecting a new point if not submitting a question
    if (!specificQuestion) setUserQuestion("");

    if (!exploredPoints.current.has(point.age)) {
      exploredPoints.current.add(point.age);
      localStorage.setItem('prophet_explored_points', JSON.stringify(Array.from(exploredPoints.current)));
      updateProgress('destiny_navigator', 1);
    }

    setLoadingMasters(true);
    setConsultation([]);
    try {
      const advice = await consultMasters(userProfile, point.age, point.luckScore, language, specificQuestion);
      setConsultation(advice);
      playReveal();
      updateProgress('master_analyst', 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMasters(false);
    }
  };

  const handleSubmitQuestion = () => {
    if (!selectedPoint || !profile || !userQuestion.trim()) return;
    handlePointSelect(selectedPoint, profile, userQuestion);
  };

  const handleGenerateReport = async () => {
    if (!profile || !selectedPoint) return;
    playClick();
    setLoadingReport(true);
    try {
      const report = await generateDetailedReport(profile, selectedPoint.age, language);
      setDetailedReport(report);
      playReveal();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleSystemChange = (newSystem: DivinationSystem) => {
    if (!profile) return;
    playClick();

    // Optimistic UI update
    setPendingSystem(newSystem);

    // Clear existing timeout
    if (systemDebounceRef.current) {
      clearTimeout(systemDebounceRef.current);
    }

    // Debounce API call by 1.5 seconds
    systemDebounceRef.current = setTimeout(() => {
      const newProfile = { ...profile, system: newSystem };
      handleProfileSubmit(newProfile).finally(() => {
        setPendingSystem(null);
      });
    }, 1500);
  };

  // Views Logic
  if (view === ViewState.LANDING) {
    return <Landing onUnlock={() => { playClick(); startAmbient(); setView(ViewState.INPUT); }} language={language} setLanguage={setLanguage} />;
  }

  if (view === ViewState.INPUT) {
    return (
      <>
        <InputForm onSubmit={handleProfileSubmit} loading={loadingRiver} language={language} setLanguage={setLanguage} />
        <AchievementToast achievement={currentToast} onClose={() => setCurrentToast(null)} language={language} />
      </>
    );
  }

  // Dashboard View (Divine Theme)
  return (
    <div className="min-h-screen bg-black text-gray-200 overflow-x-hidden selection:bg-divine/30 selection:text-white">

      {/* Global Atmosphere */}
      <div className="fixed inset-0 bg-god-rays opacity-20 pointer-events-none z-0" />
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay"></div>

      <AchievementToast achievement={currentToast} onClose={() => setCurrentToast(null)} language={language} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex flex-wrap justify-between items-center gap-y-4 shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView(ViewState.LANDING)}>
          <div className="relative">
            <div className="absolute inset-0 bg-divine blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <Eye className="relative z-10 text-divine" size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display font-bold tracking-[0.2em] uppercase leading-none text-white text-lg group-hover:text-glow transition-all">{t.title}</h1>
            <span className="text-[9px] font-mono text-white/30 tracking-[0.4em] block mt-1">THE COUNCIL</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm text-white/50">
          {profile && (
            <SystemSwitcher
              current={pendingSystem || profile.system}
              onChange={handleSystemChange}
              language={language}
              loading={!!pendingSystem || loadingRiver}
            />
          )}

          <div className="w-px h-8 bg-white/10 hidden md:block"></div>

          <LanguageSwitcher current={language} onChange={setLanguage} />

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full border transition-all ${soundEnabled ? 'border-divine/30 text-divine' : 'border-transparent text-gray-600'}`}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Social Share Button (Artifact) */}
          <button
            onClick={handleShare}
            className="p-2 hover:text-divine transition-colors flex items-center gap-2 group"
            title="Share Artifact"
          >
            <Share2 size={18} />
            <span className="text-[10px] uppercase font-mono hidden md:inline group-hover:text-glow">Artifact</span>
          </button>

          <div className="relative group cursor-pointer">
            <Trophy size={18} className={achievements.some(a => a.unlocked) ? "text-divine" : "text-gray-600"} />
            <div className="absolute right-0 top-full mt-4 w-72 bg-[#0a0a0c] border border-divine/20 rounded-lg shadow-2xl p-6 hidden group-hover:block z-50">
              <h4 className="text-divine font-bold text-xs uppercase mb-4 font-mono tracking-widest border-b border-white/10 pb-2">{t.achievements.unlocked}</h4>
              <div className="space-y-4">
                {achievements.map(a => {
                  const translatedAch = t.achievements.list[a.id] || a;
                  return (
                    <div key={a.id} className={`flex items-center gap-4 ${a.unlocked ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                      <span className="text-xl filter drop-shadow-md">{a.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-white font-display tracking-wide">{translatedAch.title}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{translatedAch.desc || translatedAch.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:text-divine transition-colors"
            title={t.reset}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-16 relative z-10">

        {/* Summary Card - Divine Style - ID ADDED FOR CAPTURE */}
        {summary && (
          <section id="fate-summary-card" className="bg-gradient-to-b from-[#111] to-black rounded-lg p-10 border border-white/5 relative overflow-hidden group hover:border-divine/30 transition-colors duration-700 shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-divine/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row gap-12 relative z-10 items-center">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-xs font-mono font-bold text-divine uppercase tracking-[0.3em] mb-4 flex items-center justify-center lg:justify-start gap-3">
                  <Sparkles size={12} className="text-divine" />
                  {profile?.system === 'bazi' ? t.summaryLabels.dayMaster : profile?.system === 'western' ? t.summaryLabels.sunSign : t.summaryLabels.majorStar}
                </h2>
                <h3 className="text-6xl md:text-7xl font-display font-bold text-white mb-8 tracking-wider text-glow">{summary.mainStar}</h3>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-divine to-transparent hidden lg:block"></div>
                  <p className="text-gray-300 leading-loose font-serif text-lg lg:pl-8 font-light italic">"{summary.description}"</p>
                </div>
              </div>

              <div className="flex flex-col gap-10 justify-center opacity-90 w-full lg:w-auto">
                <div className="flex gap-12 justify-center lg:justify-end">
                  <div className="text-center group-hover:translate-y-[-5px] transition-transform duration-500">
                    <div className="text-xs text-gray-500 uppercase mb-4 font-mono tracking-widest">{t.summaryLabels.element}</div>
                    <div className="text-4xl font-display text-white border-b border-divine/30 pb-2">{summary.element}</div>
                  </div>
                  <div className="w-px h-20 bg-white/10"></div>
                  <div className="text-center group-hover:translate-y-[-5px] transition-transform duration-500 delay-100">
                    <div className="text-xs text-gray-500 uppercase mb-4 font-mono tracking-widest">
                      {t.summaryLabels.animal}
                    </div>
                    <div className="text-4xl font-display text-white border-b border-divine/30 pb-2">{summary.animal}</div>
                  </div>
                </div>

                {/* System Specific Data Grid (e.g. Bazi Pillars) */}
                {summary.systemSpecifics && (
                  <div className="mt-4 pt-8 border-t border-white/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                      {Object.entries(summary.systemSpecifics).map(([key, val]) => (
                        <div key={key} className="space-y-2">
                          <div className="text-[9px] text-divine/70 uppercase font-mono tracking-widest">{key.replace(' Pillar', '')}</div>
                          <div className="text-lg font-serif text-white">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Watermark for Artifact */}
            <div className="absolute bottom-4 right-4 text-[10px] text-divine/20 font-mono uppercase tracking-[0.3em] hidden group-hover:block">
              PROPHET.AI ARTIFACT
            </div>
          </section>
        )}

        {/* The Fate River */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-2 px-2 border-l-4 border-divine pl-6">
            <h2 className="text-2xl font-display text-white tracking-[0.2em] uppercase">{t.fateRiver}</h2>
          </div>
          <div className="bg-[#08080a] rounded-lg border border-white/5 p-8 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
            <FateRiver
              data={riverData}
              onPointSelect={(pt) => handlePointSelect(pt, profile)}
              selectedPoint={selectedPoint}
              language={language}
            />
          </div>
        </section>

        {/* PETITION SECTION - NEW */}
        {selectedPoint && (
          <section className="max-w-3xl mx-auto w-full animate-float">
            <div className="bg-black/80 border-y border-divine/30 backdrop-blur-md p-6 md:p-8 relative group">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-divine"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-divine"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-divine"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-divine"></div>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 text-divine/80 mb-2">
                  <ScrollText size={16} />
                  <span className="text-xs font-mono uppercase tracking-[0.3em]">Petition the Court</span>
                </div>
                <h3 className="text-white text-lg font-serif italic opacity-80">
                  "The general verdict is set. Do you harbor a specific tribulation?"
                </h3>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full group-focus-within:bg-divine/5 transition-colors rounded-sm p-2">
                  <label className="block text-[10px] text-divine uppercase tracking-widest mb-2 opacity-70">Pronounce your Trouble (Optional)</label>
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="e.g., Should I change my career path?"
                    className="w-full bg-transparent border-b border-white/10 text-white font-serif text-lg py-2 focus:outline-none focus:border-divine placeholder-white/20"
                  />
                </div>
                <button
                  onClick={handleSubmitQuestion}
                  disabled={loadingMasters || !userQuestion}
                  className="w-full md:w-auto px-8 py-4 bg-divine/10 text-divine border border-divine/30 hover:bg-divine hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase font-mono text-xs tracking-[0.2em] flex items-center justify-center gap-2"
                >
                  {loadingMasters ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                  Submit Petition
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Council of Elders (Replaces ThreeMasters) */}
        <section className="min-h-[400px]">
          {selectedPoint && (
            <Council
              advice={consultation}
              loading={loadingMasters}
              age={selectedPoint.age}
              language={language}
            />
          )}
        </section>

        {/* Detailed Report Section */}
        {selectedPoint && consultation.length > 0 && (
          <section className="flex flex-col items-center space-y-10 pb-24">
            {!detailedReport && !loadingReport && (
              <button
                onClick={handleGenerateReport}
                className="group relative px-16 py-6 bg-transparent border border-divine/30 text-divine rounded-sm hover:bg-divine hover:text-black transition-all duration-700 flex items-center gap-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
                <FileText size={24} />
                <span className="font-mono font-bold tracking-[0.2em] text-sm uppercase">{t.report.button}</span>
              </button>
            )}

            {loadingReport && (
              <div className="flex flex-col items-center gap-6 text-divine/60 animate-pulse">
                <RefreshCw className="animate-spin" size={32} />
                <span className="font-mono tracking-[0.3em] text-sm uppercase">{t.report.generating}</span>
              </div>
            )}

            {detailedReport && (
              <div className="w-full">
                <DetailedReport data={detailedReport} language={language} />
              </div>
            )}
          </section>
        )}

      </main>

      <footer className="py-16 text-center text-white/20 text-[10px] font-mono border-t border-white/5 mt-24 uppercase tracking-[0.4em]">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}

export default App;