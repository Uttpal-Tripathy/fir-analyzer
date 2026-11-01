import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Book,
  FileText,
  Scale,
  ExternalLink,
  Download,
  Printer,
  Globe,
  ShieldAlert,
  CheckCircle2,
  X,
  Sparkles,
  Filter,
  Layers,
  Eye,
  FileCheck,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import {
  BNS_CATALOG,
  BNSSectionItem,
  LANGUAGE_META,
  SupportedLanguage,
  UI_LABELS
} from '../data/bnsCatalog';

interface BNSReferenceProps {
  onBackToDashboard?: () => void;
}

export function BNSReference({ onBackToDashboard }: BNSReferenceProps) {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [bilingualMode, setBilingualMode] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [cognizableFilter, setCognizableFilter] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<BNSSectionItem | null>(null);
  const [pdfViewMode, setPdfViewMode] = useState<'gazette-form' | 'embedded-pdf'>('gazette-form');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const labels = UI_LABELS[language];
  const langMeta = LANGUAGE_META[language];

  // Sort sections numerically by section number
  const sortedCatalog = useMemo(() => {
    return [...BNS_CATALOG].sort((a, b) => Number(a.section) - Number(b.section));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    sortedCatalog.forEach((item) => set.add(item.category));
    return Array.from(set);
  }, [sortedCatalog]);

  const filteredData = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return sortedCatalog.filter((item) => {
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesCognizable =
        cognizableFilter === 'ALL' || item.cognizable === cognizableFilter;

      if (!matchesCategory || !matchesCognizable) return false;
      if (q === '') return true;

      // Search across all 4 languages, section number, IPC equivalent, and ingredients
      const allLangText = (['en', 'hi', 'te', 'or'] as SupportedLanguage[])
        .map(
          (l) =>
            `${item.translations[l].title} ${item.translations[l].description} ${item.translations[l].punishment} ${item.chapterName[l]}`
        )
        .join(' ')
        .toLowerCase();

      return (
        item.section.toLowerCase().includes(q) ||
        `section ${item.section}`.toLowerCase().includes(q) ||
        item.ipcEquivalent.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        allLangText.includes(q)
      );
    });
  }, [sortedCatalog, searchTerm, categoryFilter, cognizableFilter]);

  // Build jsPDF document for a single BNS Section
  const buildSingleSectionPdf = (item: BNSSectionItem): jsPDF => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 18) {
        doc.addPage();
        y = 18;
      }
    };

    // Official Gazette Header Box
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 34, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(
      'THE GAZETTE OF INDIA • EXTRAORDINARY • STATUTORY LEGAL DOSSIER',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    doc.setFontSize(13);
    doc.text(
      'BHARATIYA NYAYA SANHITA (BNS), 2023 — ACT NO. 45 OF 2023',
      pageWidth / 2,
      18,
      { align: 'center' }
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `AI Statutory PDF Form • Section ${item.section} BNS (${item.ipcEquivalent}) • Generated: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      26,
      { align: 'center' }
    );

    y = 42;

    // Section Title Banner
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text(`BNS SECTION ${item.section}: ${item.translations.en.title.toUpperCase()}`, margin + 4, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Chapter ${item.chapter} (${item.chapterName.en})  |  Category: ${item.category}  |  Former IPC: ${item.ipcEquivalent}`,
      margin + 4,
      y + 15
    );

    y += 26;

    // Classification Grid (4 boxes)
    const boxW = (contentWidth - 6) / 4;
    const metaBoxes = [
      { label: 'COGNIZABILITY', value: item.cognizable },
      { label: 'BAIL STATUS', value: item.bailable },
      { label: 'TRIABLE BY COURT', value: item.triableBy },
      {
        label: 'BNSS SEC 176(3) FSL',
        value: item.forensicMandatory7Yr ? 'MANDATORY (>=7 Yrs)' : 'STANDARD PROTOCOL'
      }
    ];

    metaBoxes.forEach((b, i) => {
      const bx = margin + i * (boxW + 2);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(bx, y, boxW, 14, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(b.label, bx + 2.5, y + 5);

      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      const valLines = doc.splitTextToSize(b.value, boxW - 5);
      doc.text(valLines[0], bx + 2.5, y + 10.5);
    });

    y += 20;

    // Section 1: Statutory Provision
    const drawSectionBlock = (heading: string, bodyText: string, highlight = false) => {
      const lines = doc.splitTextToSize(bodyText, contentWidth - 8);
      const blockH = lines.length * 4.8 + 12;
      checkPageBreak(blockH);

      if (highlight) {
        doc.setFillColor(254, 242, 242);
        doc.setDrawColor(248, 113, 113);
      } else {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
      }
      doc.roundedRect(margin, y, contentWidth, blockH, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(highlight ? 153 : 30, highlight ? 27 : 64, highlight ? 27 : 175);
      doc.text(heading, margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(lines, margin + 4, y + 11.5);

      y += blockH + 5;
    };

    drawSectionBlock(
      '1. VERBATIM STATUTORY PROVISION (BHARATIYA NYAYA SANHITA, 2023)',
      item.translations.en.description
    );

    drawSectionBlock(
      '2. PRESCRIBED STATUTORY PUNISHMENT & SENTENCING',
      item.translations.en.punishment,
      true
    );

    drawSectionBlock(
      '3. AI JUDICIAL & FORENSIC APPLICABILITY ANALYSIS',
      item.translations.en.aiCommentary
    );

    // Essential Legal Ingredients
    const ingLines = item.ingredients.map((ing, idx) => `${idx + 1}. ${ing}`).join('\n');
    drawSectionBlock(
      '4. ESSENTIAL LEGAL INGREDIENTS (MENS REA & ACTUS REUS)',
      ingLines
    );

    // BNSS & BSA Procedural Mandate
    drawSectionBlock(
      '5. BNSS 2023 PROCEDURAL & BSA 2023 EVIDENTIARY MANDATE',
      `BNSS 2023 Procedure: ${item.bnssProcedure}\nBSA 2023 Admissibility: ${item.bsaAdmissibility}`
    );

    // Investigative Steps
    const stepLines = item.investigativeSteps.map((st, idx) => `Step ${idx + 1}: ${st}`).join('\n');
    drawSectionBlock(
      '6. MANDATORY INVESTIGATING OFFICER (IO) CHECKLIST',
      stepLines
    );

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Official BNS 2023 Statutory Reference Dossier • Section ${item.section} (${item.ipcEquivalent})`,
        margin,
        pageHeight - 7
      );
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 7, {
        align: 'right'
      });
    }

    return doc;
  };

  // Whenever selectedSection changes, generate a fresh PDF Blob URL for live preview & instant download
  useEffect(() => {
    if (!selectedSection) {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
      return;
    }

    const doc = buildSingleSectionPdf(selectedSection);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfBlobUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedSection]);

  const handleDownloadSectionPdf = (item: BNSSectionItem) => {
    const doc = buildSingleSectionPdf(item);
    doc.save(`BNS_2023_Section_${item.section}_Gazette_Dossier.pdf`);
  };

  // Export the entire filtered BNS Compendium as a multi-page PDF codebook
  const handleExportCompendiumPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    // Cover Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(
      'BHARATIYA NYAYA SANHITA (BNS), 2023 — STATUTORY COMPENDIUM',
      pageWidth / 2,
      14,
      { align: 'center' }
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Complete Police Reference Codebook (${filteredData.length} Statutory Sections) • Generated: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      23,
      { align: 'center' }
    );

    y = 40;

    filteredData.forEach((item, index) => {
      const descLines = doc.splitTextToSize(item.translations.en.description, contentWidth - 8);
      const punLines = doc.splitTextToSize(
        `Punishment: ${item.translations.en.punishment}`,
        contentWidth - 8
      );
      const blockHeight = 16 + descLines.length * 4.2 + punLines.length * 4.2;

      if (y + blockHeight > pageHeight - 16) {
        doc.addPage();
        y = 18;
      }

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, y, contentWidth, blockHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 58, 138);
      doc.text(
        `${index + 1}. BNS Section ${item.section} — ${item.translations.en.title}`,
        margin + 3.5,
        y + 6
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `[Chapter ${item.chapter} | ${item.ipcEquivalent} | ${item.cognizable} | ${item.bailable}]`,
        margin + 3.5,
        y + 11
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(30, 41, 59);
      doc.text(descLines, margin + 3.5, y + 16);

      const punY = y + 16 + descLines.length * 4.2 + 1;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(185, 28, 28);
      doc.text(punLines, margin + 3.5, punY);

      y += blockHeight + 4;
    });

    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Bharatiya Nyaya Sanhita (BNS), 2023 Official Police Compendium`,
        margin,
        pageHeight - 7
      );
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 7, {
        align: 'right'
      });
    }

    doc.save('BNS_2023_Statutory_Compendium_Codebook.pdf');
  };

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Navigation Bar with Direct Link Back to Main Dashboard Screen */}
      {onBackToDashboard && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-xs print:hidden">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Screen (Dashboard)</span>
          </button>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
            BNS 2023 STATUTORY CODEBOOK • MULTILINGUAL GAZETTE
          </span>
        </div>
      )}

      {/* Top Multilingual Command Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Scale className="w-3.5 h-3.5" />
                {langMeta.gazetteHeader}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                {filteredData.length} / {sortedCatalog.length} Statutory Sections
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 font-serif tracking-tight">
              {langMeta.actTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {langMeta.subtitle}
            </p>
          </div>

          {/* 4-Language Switcher + Compendium PDF Export */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="px-2.5 py-1 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Language:</span>
              </div>
              {(['en', 'hi', 'te', 'or'] as SupportedLanguage[]).map((langCode) => {
                const meta = LANGUAGE_META[langCode];
                const isActive = language === langCode;
                return (
                  <button
                    key={langCode}
                    type="button"
                    onClick={() => setLanguage(langCode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span>{meta.nativeName}</span>
                    {langCode !== 'en' && (
                      <span
                        className={`text-[10px] font-normal ${
                          isActive ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        ({meta.name})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleExportCompendiumPdf}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              {labels.exportCompendiumPdf}
            </button>
          </div>
        </div>

        {/* Search, Category Filter & Bilingual Toggle */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none" />
            <input
              type="text"
              className="w-full pl-10 pr-9 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder={labels.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="lg:col-span-3 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="ALL">{labels.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3 flex items-center justify-between gap-2">
            <select
              value={cognizableFilter}
              onChange={(e) => setCognizableFilter(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="ALL">All Classifications</option>
              <option value="Cognizable">{labels.cognizable}</option>
              <option value="Non-Cognizable">{labels.nonCognizable}</option>
            </select>

            {language !== 'en' && (
              <button
                type="button"
                onClick={() => setBilingualMode((prev) => !prev)}
                className={`px-3 py-2.5 rounded-lg border text-xs font-bold whitespace-nowrap transition-colors ${
                  bilingualMode
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
                title="Toggle side-by-side English reference"
              >
                {bilingualMode ? 'Bilingual: ON' : 'Bilingual: OFF'}
              </button>
            )}
          </div>
        </div>

        {/* Interactive Instruction Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 text-xs text-blue-800 dark:text-blue-200">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{labels.clickHint}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span>Quick Jump:</span>
            {['64', '69', '103', '111', '113', '303', '304', '318'].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  const found = sortedCatalog.find((s) => s.section === sec);
                  if (found) setSelectedSection(found);
                }}
                className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 hover:bg-blue-600 hover:text-white transition-colors font-bold"
              >
                Sec {sec}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Multilingual BNS Sections Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/90 sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24"
                >
                  {labels.chapter}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-32"
                >
                  {labels.section}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4"
                >
                  {labels.title}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {labels.description}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-44"
                >
                  {labels.classification}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-36"
                >
                  {labels.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const localized = item.translations[language];
                  const english = item.translations.en;

                  return (
                    <tr
                      key={item.section}
                      onClick={() => {
                        setPdfViewMode('gazette-form');
                        setSelectedSection(item);
                      }}
                      className="hover:bg-blue-50/50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer group"
                    >
                      {/* Chapter */}
                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                          Ch. {item.chapter}
                        </span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[110px] truncate">
                          {item.chapterName[language]}
                        </div>
                      </td>

                      {/* BNS Section + Former IPC */}
                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 group-hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors">
                          <FileText className="w-3.5 h-3.5" />
                          Sec {item.section}
                        </div>
                        <div className="mt-1.5 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                          {item.ipcEquivalent}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-4 py-4 align-top">
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {localized.title}
                        </div>
                        {language !== 'en' && bilingualMode && (
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                            {english.title}
                          </div>
                        )}
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.category}
                        </div>
                      </td>

                      {/* Description & Punishment */}
                      <td className="px-4 py-4 align-top">
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {localized.description}
                        </p>
                        {language !== 'en' && bilingualMode && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 italic leading-relaxed">
                            {english.description}
                          </p>
                        )}
                        <div className="mt-2.5 p-2 rounded-lg bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 text-xs">
                          <span className="font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider text-[10px] mr-1.5">
                            {labels.punishment}:
                          </span>
                          <span className="text-rose-900 dark:text-rose-200 font-medium">
                            {localized.punishment}
                          </span>
                        </div>
                      </td>

                      {/* Classification */}
                      <td className="px-4 py-4 align-top whitespace-nowrap space-y-1.5">
                        <div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.cognizable === 'Cognizable'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {item.cognizable === 'Cognizable'
                              ? labels.cognizable
                              : labels.nonCognizable}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.bailable === 'Non-Bailable'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            }`}
                          >
                            {item.bailable === 'Non-Bailable'
                              ? labels.nonBailable
                              : labels.bailable}
                          </span>
                        </div>
                        {item.forensicMandatory7Yr && (
                          <div className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            FSL Mandatory
                          </div>
                        )}
                      </td>

                      {/* Actions: Open PDF Form & Direct PDF Download */}
                      <td
                        className="px-4 py-4 align-top text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col items-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPdfViewMode('gazette-form');
                              setSelectedSection(item);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {labels.openPdf}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadSectionPdf(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                            title="Direct download as .pdf file"
                          >
                            <Download className="w-3 h-3" />
                            Download .PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    <Book className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p>No BNS 2023 statutory sections found matching "{searchTerm}".</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI STATUTORY GAZETTE PDF FORM MODAL (Opens whenever any section is clicked) */}
      <AnimatePresence>
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white"
            onClick={() => setSelectedSection(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:border-none print:shadow-none print:bg-white"
            >
              {/* Modal Top Toolbar (Hidden when printing) */}
              <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
                        AI STATUTORY GAZETTE PDF FORM
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                        BNS Sec {selectedSection.section} • {selectedSection.ipcEquivalent}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white truncate max-w-md">
                      {selectedSection.translations[language].title}
                    </h3>
                  </div>
                </div>

                {/* Language Switcher inside PDF Modal + View Toggle + Export Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Inline Language Selector inside PDF Viewer */}
                  <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
                    {(['en', 'hi', 'te', 'or'] as SupportedLanguage[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLanguage(l)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                          language === l
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {LANGUAGE_META[l].nativeName}
                      </button>
                    ))}
                  </div>

                  {/* Toggle between Multilingual Gazette A4 Form & Native PDF Stream */}
                  <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setPdfViewMode('gazette-form')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                        pdfViewMode === 'gazette-form'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Multilingual Gazette Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfViewMode('embedded-pdf')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                        pdfViewMode === 'embedded-pdf'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Embedded PDF Stream
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadSectionPdf(selectedSection)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {labels.downloadPdfBtn}
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    {labels.printMultilingualBtn}
                  </button>

                  {onBackToDashboard && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSection(null);
                        onBackToDashboard();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                      title="Close PDF and return to Main Dashboard Screen"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Main Screen
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedSection(null)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors"
                    title={labels.closeBtn}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Either A4 Multilingual Gazette PDF Form OR Embedded jsPDF Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/70 dark:bg-slate-950 print:p-0 print:bg-white">
                {pdfViewMode === 'embedded-pdf' && pdfBlobUrl ? (
                  <div className="w-full h-[75vh] bg-white rounded-xl overflow-hidden shadow-lg border border-slate-300 dark:border-slate-800">
                    <iframe
                      src={pdfBlobUrl}
                      title={`BNS Section ${selectedSection.section} PDF`}
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (
                  /* A4 Official Gazette PDF Sheet (Supports English, Hindi, Telugu, Odia crisply) */
                  <div className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] shadow-xl border border-slate-300 p-8 sm:p-12 space-y-6 font-serif print:shadow-none print:border-none print:p-4">
                    {/* Official Gazette Header */}
                    <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1.5">
                      <p className="text-[11px] font-sans font-bold tracking-widest uppercase text-slate-600">
                        {langMeta.gazetteHeader}
                      </p>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase">
                        {langMeta.actTitle}
                      </h1>
                      <p className="text-xs font-sans text-slate-600">
                        MINISTRY OF LAW AND JUSTICE (LEGISLATIVE DEPARTMENT) • OFFICIAL POLICE STATUTORY DOSSIER
                      </p>
                      <div className="pt-2 flex flex-wrap items-center justify-center gap-2 font-sans text-[11px]">
                        <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white font-bold">
                          BNS SECTION {selectedSection.section}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800 font-semibold">
                          Chapter {selectedSection.chapter}: {selectedSection.chapterName[language]}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 font-semibold">
                          Former IPC: {selectedSection.ipcEquivalent}
                        </span>
                      </div>
                    </div>

                    {/* Statutory Classification Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold uppercase text-slate-500">
                          {labels.classification}
                        </div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">
                          {selectedSection.cognizable === 'Cognizable'
                            ? labels.cognizable
                            : labels.nonCognizable}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold uppercase text-slate-500">
                          Bail Status
                        </div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">
                          {selectedSection.bailable === 'Non-Bailable'
                            ? labels.nonBailable
                            : labels.bailable}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold uppercase text-slate-500">
                          Triable By Court
                        </div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">
                          {selectedSection.triableBy}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold uppercase text-slate-500">
                          Sec 176(3) BNSS Forensic
                        </div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">
                          {selectedSection.forensicMandatory7Yr
                            ? 'Mandatory FSL Visit'
                            : 'Standard IO Protocol'}
                        </div>
                      </div>
                    </div>

                    {/* Primary Statutory Text in Selected Language */}
                    <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-blue-700 space-y-3">
                      <div className="flex items-center justify-between font-sans">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                          {labels.section} {selectedSection.section} — {LANGUAGE_META[language].nativeName} ({LANGUAGE_META[language].name})
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {selectedSection.category}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        {selectedSection.translations[language].title}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                        {selectedSection.translations[language].description}
                      </p>
                      <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans">
                        <div>
                          <span className="text-xs font-bold uppercase text-rose-700 mr-2">
                            {labels.punishment}:
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {selectedSection.translations[language].punishment}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Parallel Official English Text (When viewing Hindi, Telugu, or Odia) */}
                    {language !== 'en' && (
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500">
                          Official English Gazette Text — Section {selectedSection.section} BNS
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {selectedSection.translations.en.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {selectedSection.translations.en.description}
                        </p>
                        <p className="text-xs font-sans font-semibold text-rose-700">
                          Prescribed Punishment: {selectedSection.translations.en.punishment}
                        </p>
                      </div>
                    )}

                    {/* All 4 Languages Quick Reference Matrix inside the PDF Sheet */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden font-sans">
                      <div className="bg-slate-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                        Quad-Lingual Statutory Title Synopsis (English • हिन्दी • తెలుగు • ଓଡ଼ିଆ)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-xs">
                        <div className="p-3 space-y-1.5">
                          <div>
                            <span className="font-bold text-blue-700">English: </span>
                            <span className="text-slate-800">{selectedSection.translations.en.title}</span>
                          </div>
                          <div>
                            <span className="font-bold text-blue-700">हिन्दी (Hindi): </span>
                            <span className="text-slate-800">{selectedSection.translations.hi.title}</span>
                          </div>
                        </div>
                        <div className="p-3 space-y-1.5">
                          <div>
                            <span className="font-bold text-blue-700">తెలుగు (Telugu): </span>
                            <span className="text-slate-800">{selectedSection.translations.te.title}</span>
                          </div>
                          <div>
                            <span className="font-bold text-blue-700">ଓଡ଼ିଆ (Odia): </span>
                            <span className="text-slate-800">{selectedSection.translations.or.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Judicial & Forensic Applicability Analysis */}
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 font-sans">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        {labels.aiLegalBrief}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {selectedSection.translations[language].aiCommentary}
                      </p>
                      {language !== 'en' && (
                        <p className="text-xs text-slate-600 italic">
                          {selectedSection.translations.en.aiCommentary}
                        </p>
                      )}
                    </div>

                    {/* Essential Ingredients & Investigative Protocol */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                      <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {labels.statutoryIngredients}
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                          {selectedSection.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {labels.investigativeProtocol}
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                          {selectedSection.investigativeSteps.map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* BNSS 2023 & BSA 2023 Procedural Compliance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="font-bold text-slate-800 uppercase text-[10px] mb-1">
                          {labels.bnssCompliance}
                        </div>
                        <p className="text-slate-700">{selectedSection.bnssProcedure}</p>
                      </div>
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="font-bold text-slate-800 uppercase text-[10px] mb-1">
                          {labels.bsaCompliance}
                        </div>
                        <p className="text-slate-700">{selectedSection.bsaAdmissibility}</p>
                      </div>
                    </div>

                    {/* Official Footer */}
                    <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-slate-500 gap-2">
                      <span>
                        Bharatiya Nyaya Sanhita, 2023 (Act 45 of 2023) • Section {selectedSection.section} Statutory PDF Form
                      </span>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          `Bharatiya Nyaya Sanhita BNS Section ${selectedSection.section} ${selectedSection.translations.en.title}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline print:hidden"
                      >
                        Verify on India Code Portal
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Return to Main Screen Footer Bar */}
      {onBackToDashboard && (
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs print:hidden">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Finished reviewing Bharatiya Nyaya Sanhita (BNS) 2023 statutory provisions?
          </span>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Back to Main Screen (Dashboard)</span>
          </button>
        </div>
      )}
    </div>
  );
}
