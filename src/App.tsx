import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShieldAlert, Moon, Sun, ArrowLeft, Upload, File as FileIcon, X, Globe, Loader2, BookOpen, CheckCircle2, Save, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FirAnalysisResult, HistoryItem } from './types';
import { demoCases } from './data';
import { AnalysisView } from './components/AnalysisView';
import { Dashboard } from './components/Dashboard';
import { Chatbot } from './components/Chatbot';
import { BNSReference } from './components/BNSReference';

const WORKSPACE_STORAGE_KEY = 'cctns_fir_active_workspace_v1';
const HISTORY_STORAGE_KEY = 'cctns_fir_history_v1';
const SUBSTATE_STORAGE_KEY = 'cctns_fir_analysis_substate_v1';

interface PersistedWorkspace {
  activeTab: 'dashboard' | 'analysis' | 'bns_reference';
  firText: string;
  result: FirAnalysisResult | null;
  targetLanguage: string;
  savedAt: string;
}

function loadSavedWorkspace(): PersistedWorkspace | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        activeTab:
          parsed.activeTab === 'analysis' ||
          parsed.activeTab === 'bns_reference' ||
          parsed.activeTab === 'dashboard'
            ? parsed.activeTab
            : 'dashboard',
        firText: typeof parsed.firText === 'string' ? parsed.firText : '',
        result: parsed.result || null,
        targetLanguage: typeof parsed.targetLanguage === 'string' ? parsed.targetLanguage : 'English',
        savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : new Date().toISOString()
      };
    }
  } catch (err) {
    console.error('Failed to restore workspace from localStorage:', err);
  }
  return null;
}

function buildDefaultHistory(): HistoryItem[] {
  const dayOffsets = [0, 1, 3, 6, 12, 21, 28];
  return demoCases.map((dc, i) => ({
    id: `FIR-2026-00${i + 1}`,
    timestamp: new Date(
      Date.now() - (dayOffsets[i] ?? i * 2) * 1000 * 60 * 60 * 24 - (i + 1) * 1000 * 60 * 35
    ),
    rawText: dc.rawText,
    stressWords: dc.stressWords,
    threatLevel: dc.threatLevel,
    confidenceScore: dc.confidenceScore,
    investigativeSteps: dc.investigativeSteps,
    expectedOutcomes: dc.expectedOutcomes,
    recommendedActs: dc.recommendedActs,
    categories: dc.categories,
    categoryScores: dc.categoryScores,
    summary: dc.summary,
    timeline: dc.timeline,
    locationDetails: dc.locationDetails,
    evidenceItems: dc.evidenceItems
  }));
}

function loadSavedHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return buildDefaultHistory();
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return buildDefaultHistory();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any) => ({
        ...item,
        timestamp: item.timestamp ? new Date(item.timestamp) : new Date()
      }));
    }
  } catch (err) {
    console.error('Failed to restore history from localStorage:', err);
  }
  return buildDefaultHistory();
}

export default function App() {
  const initialWorkspace = useRef<PersistedWorkspace | null>(loadSavedWorkspace());
  const hasRestoredSession = Boolean(
    initialWorkspace.current &&
      (initialWorkspace.current.firText.trim().length > 0 || initialWorkspace.current.result !== null)
  );

  // Skip splash if investigator refreshed page mid-session so they resume immediately
  const [showSplash, setShowSplash] = useState(!hasRestoredSession);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'bns_reference'>(
    initialWorkspace.current?.activeTab || 'dashboard'
  );

  const [firText, setFirText] = useState(initialWorkspace.current?.firText || '');
  const [selectedFile, setSelectedFile] = useState<{name: string, data: string, mimeType: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FirAnalysisResult | null>(
    initialWorkspace.current?.result || null
  );
  const [error, setError] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState(
    initialWorkspace.current?.targetLanguage || 'English'
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setAiEnabled(data ? Boolean(data.aiEnabled) : null))
      .catch(() => setAiEnabled(null));
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Auto-save telemetry state
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'restored'>(
    hasRestoredSession ? 'restored' : 'saved'
  );
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(
    initialWorkspace.current?.savedAt ? new Date(initialWorkspace.current.savedAt) : new Date()
  );

  const [history, setHistory] = useState<HistoryItem[]>(() => loadSavedHistory());

  // Persist current workspace snapshot to localStorage
  const persistWorkspaceSnapshot = useCallback(
    (statusLabel: 'saved' | 'restored' = 'saved') => {
      if (typeof window === 'undefined') return;
      try {
        const nowIso = new Date().toISOString();
        const payload: PersistedWorkspace = {
          activeTab,
          firText,
          result,
          targetLanguage,
          savedAt: nowIso
        };
        localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(payload));
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        setLastSavedAt(new Date(nowIso));
        setAutoSaveStatus(statusLabel);
      } catch (err) {
        console.error('Auto-save to localStorage failed:', err);
      }
    },
    [activeTab, firText, result, targetLanguage, history]
  );

  // 1. Debounced Auto-Save whenever firText, result, activeTab, targetLanguage, or history changes
  useEffect(() => {
    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      persistWorkspaceSnapshot('saved');
    }, 650);
    return () => clearTimeout(timer);
  }, [firText, result, activeTab, targetLanguage, history, persistWorkspaceSnapshot]);

  // 2. Periodic Interval Auto-Save every 10 seconds + beforeunload flush
  useEffect(() => {
    const interval = setInterval(() => {
      persistWorkspaceSnapshot('saved');
    }, 10000);

    const handleBeforeUnload = () => {
      try {
        const payload: PersistedWorkspace = {
          activeTab,
          firText,
          result,
          targetLanguage,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(payload));
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      } catch {
        // Ignore storage quota errors on unload
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeTab, firText, result, targetLanguage, history, persistWorkspaceSnapshot]);

  const handleClearWorkspaceDraft = useCallback(() => {
    setFirText('');
    setSelectedFile(null);
    setResult(null);
    setError(null);
    try {
      localStorage.removeItem(WORKSPACE_STORAGE_KEY);
      localStorage.removeItem(SUBSTATE_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear workspace storage:', err);
    }
    setLastSavedAt(new Date());
    setAutoSaveStatus('saved');
  }, []);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const prevLang = targetLanguage;
    setTargetLanguage(newLang);

    if (result && newLang !== 'English') {
      setIsTranslating(true);
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result, language: newLang })
        });
        const data = await res.json();
        if (res.ok) {
          setResult(data);
        } else {
          setTargetLanguage(prevLang);
          setNotice(data?.error || `Translation to ${newLang} is unavailable right now.`);
        }
      } catch (err) {
        console.error("Translation error", err);
      } finally {
        setIsTranslating(false);
      }
    }
  };
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [showSplash]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f1f5f9';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Unsupported file type. Please upload PDF, DOCX, JPEG, or PNG.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedFile({
          name: file.name,
          data: base64String,
          mimeType: file.type
        });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firText.trim() && !selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-fir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firText: firText.trim() || undefined,
          inlineData: selectedFile ? { data: selectedFile.data, mimeType: selectedFile.mimeType } : undefined,
          language: targetLanguage
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Failed to analyze FIR. Please try again.');
      }

      setResult(data);
      
      setHistory(prev => {
        const newItem: HistoryItem = {
          id: `FIR-2026-${String(prev.length + 1).padStart(4, '0')}`,
          rawText: firText.trim() || `[Document Analysis: ${selectedFile?.name}]`,
          timestamp: new Date(),
          ...data
        };
        return [newItem, ...prev].slice(0, 50);
      });
      setActiveTab('analysis');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setFirText(item.rawText);
    setSelectedFile(null);
    setResult({
      stressWords: item.stressWords,
      threatLevel: item.threatLevel,
      confidenceScore: item.confidenceScore,
      investigativeSteps: item.investigativeSteps,
      expectedOutcomes: item.expectedOutcomes,
      recommendedActs: item.recommendedActs,
      categories: item.categories,
      categoryScores: item.categoryScores,
      summary: item.summary,
      timeline: item.timeline,
      locationDetails: item.locationDetails,
      evidenceItems: item.evidenceItems,
      analysisEngine: item.analysisEngine
    });
    setError(null);
    setActiveTab('analysis');
  };

  const loadImportKey = (key: string) => {
    const exactMatch = history.find(h => h.id.toLowerCase() === key.toLowerCase());
    if (exactMatch) {
      loadHistoryItem(exactMatch);
      return;
    }
    const indexStr = key.replace(/[^0-9]/g, '');
    let index = parseInt(indexStr) || 1;
    if (index > demoCases.length) index = demoCases.length;
    if (index < 1) index = 1;
    
    const selected = demoCases[index - 1];
    if (selected) {
      setFirText(selected.rawText);
      setSelectedFile(null);
      setResult({
        stressWords: selected.stressWords,
        threatLevel: selected.threatLevel,
        confidenceScore: selected.confidenceScore,
        investigativeSteps: selected.investigativeSteps,
        expectedOutcomes: selected.expectedOutcomes,
        recommendedActs: selected.recommendedActs,
        categories: selected.categories,
        categoryScores: selected.categoryScores,
        summary: selected.summary,
        timeline: selected.timeline,
        locationDetails: selected.locationDetails,
        evidenceItems: selected.evidenceItems
      });
      setError(null);
      setActiveTab('analysis');
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col ${isDark ? 'dark bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-800'}`}>
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Emblem of India"
              className="w-32 h-40 object-contain invert mb-8"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
            <motion.h1 
              className="text-3xl font-serif tracking-widest uppercase font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Satyameva Jayate
            </motion.h1>
            <motion.div 
              className="w-16 h-1 bg-blue-500 rounded-full mt-4"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            />
            <motion.p 
              className="mt-6 text-slate-400 text-sm tracking-widest uppercase font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              Digital Forensic Investigation System
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-slate-900 text-white px-6 md:px-8 py-4 flex justify-between items-center border-b border-slate-700 shadow-sm shrink-0 w-full mb-8 print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center font-serif cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem of India" className="w-8 h-10 object-contain invert mb-1" />
            <span className="text-[7px] tracking-widest font-bold">सत्यमेव जयते</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold tracking-widest text-slate-100 print:text-slate-900 cursor-pointer" onClick={() => setActiveTab('dashboard')}>FIR SEMANTICS</h1>
              {activeTab !== 'dashboard' && (
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="text-[11px] font-bold uppercase tracking-wider text-blue-300 hover:text-white bg-blue-950/70 hover:bg-blue-600 flex items-center print:hidden border border-blue-500/40 px-2.5 py-1 rounded-md transition-colors shadow-xs"
                  title="Return directly to Main Dashboard Screen"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Back to Main Screen
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 print:text-slate-500">National Police Department • First Information Report Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          {activeTab !== 'dashboard' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white transition-colors print:hidden shadow-xs"
              title="Back to Main Dashboard Screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main Screen</span>
            </button>
          )}
          {aiEnabled === false && (
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider text-amber-300 print:hidden"
              title="No GEMINI_API_KEY is configured. Seeded cases open in full; new FIR text is analysed by the built-in offline rule engine."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Demo Mode
            </div>
          )}
          {/* Auto-Save Status Indicator */}
          <div
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-[11px] text-slate-300 print:hidden"
            title="Active FIR draft and analysis results are automatically saved to local browser storage"
          >
            {autoSaveStatus === 'saving' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-300 font-medium">Auto-saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">
                  {autoSaveStatus === 'restored' ? 'Session Restored' : 'Auto-saved'}
                </span>
                {lastSavedAt && (
                  <span className="text-slate-400 font-mono text-[10px]">
                    {lastSavedAt.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'bns_reference' ? 'dashboard' : 'bns_reference')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors print:hidden ${
              activeTab === 'bns_reference' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="BNS Reference Library"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">BNS Library</span>
          </button>
          <div className="flex items-center gap-2 bg-slate-800 rounded-md px-2 py-1 print:hidden">
            {isTranslating ? (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 text-slate-400" />
            )}
            <select
              value={targetLanguage}
              onChange={handleLanguageChange}
              disabled={isTranslating}
              className="bg-transparent text-slate-200 text-xs font-medium border-none outline-none focus:ring-0 cursor-pointer appearance-none"
            >
              <option value="English" className="bg-slate-800 text-white">English</option>
              <option value="Hindi" className="bg-slate-800 text-white">Hindi</option>
              <option value="Marathi" className="bg-slate-800 text-white">Marathi</option>
              <option value="Bengali" className="bg-slate-800 text-white">Bengali</option>
              <option value="Tamil" className="bg-slate-800 text-white">Tamil</option>
              <option value="Telugu" className="bg-slate-800 text-white">Telugu</option>
              <option value="Gujarati" className="bg-slate-800 text-white">Gujarati</option>
              <option value="Kannada" className="bg-slate-800 text-white">Kannada</option>
              <option value="Malayalam" className="bg-slate-800 text-white">Malayalam</option>
            </select>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors print:hidden"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="hidden print:block text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Official Document</p>
            <p className="text-[10px] text-slate-400">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </header>

      {activeTab === 'dashboard' ? (
        <Dashboard 
          history={history} 
          activeResult={result}
          onNavigate={() => {
            setActiveTab('analysis');
          }} 
          onImportKey={loadImportKey}
          onSelectCase={loadHistoryItem}
          onOpenBnsReference={() => setActiveTab('bns_reference')}
        />
      ) : activeTab === 'bns_reference' ? (
        <BNSReference onBackToDashboard={() => setActiveTab('dashboard')} />
      ) : (
        <AnalysisView 
          firText={firText}
          setFirText={setFirText}
          selectedFile={selectedFile}
          handleFileUpload={handleFileUpload}
          removeFile={removeFile}
          loading={loading}
          result={result}
          error={error}
          handleAnalyze={handleAnalyze}
          loadHistoryItem={loadHistoryItem}
          history={history}
          autoSaveStatus={autoSaveStatus}
          lastSavedAt={lastSavedAt}
          onManualSave={() => persistWorkspaceSnapshot('saved')}
          onClearDraft={handleClearWorkspaceDraft}
          onBackToDashboard={() => setActiveTab('dashboard')}
        />
      )}

      {/* Floating Chatbot Component */}
      <Chatbot firContext={firText} />

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            role="status"
            className="fixed bottom-6 left-6 z-50 max-w-sm flex items-start gap-3 rounded-lg bg-slate-900 text-slate-100 border border-slate-700 shadow-lg px-4 py-3 text-sm print:hidden"
          >
            <Globe className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
            <span className="flex-1">{notice}</span>
            <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-white" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <footer className="bg-slate-200 dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 px-8 py-3 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between mt-auto print:bg-white print:border-t print:border-slate-300 print:text-black print:mt-12 shrink-0 relative z-10">
        <span>CONFIDENTIAL • UNIFIED CRIME AND CRIMINAL TRACKING NETWORK (CCTNS)</span>
        <span>सत्यमेव जयते • SYSTEM ARCHITECTURE: GOOGLE AI STUDIO</span>
      </footer>
    </div>
  );
}
