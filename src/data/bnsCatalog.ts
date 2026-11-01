export type SupportedLanguage = 'en' | 'hi' | 'te' | 'or';

export interface LocalizedSectionContent {
  title: string;
  description: string;
  punishment: string;
  aiCommentary: string;
}

export interface BNSSectionItem {
  chapter: string;
  chapterName: Record<SupportedLanguage, string>;
  section: string;
  ipcEquivalent: string;
  category:
    | 'Preliminary & Punishments'
    | 'Exceptions & Abetment'
    | 'Offences Against Women & Children'
    | 'Offences Affecting Human Body'
    | 'Organised Crime & National Security'
    | 'Public Order & Justice'
    | 'Property, Cyber & Financial Crimes'
    | 'Forgery, Intimidation & Defamation';
  cognizable: 'Cognizable' | 'Non-Cognizable';
  bailable: 'Bailable' | 'Non-Bailable';
  triableBy: string;
  forensicMandatory7Yr: boolean;
  bnssProcedure: string;
  bsaAdmissibility: string;
  ingredients: string[];
  investigativeSteps: string[];
  translations: Record<SupportedLanguage, LocalizedSectionContent>;
}

export const LANGUAGE_META: Record<
  SupportedLanguage,
  {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    badge: string;
    gazetteHeader: string;
    actTitle: string;
    subtitle: string;
  }
> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    badge: 'EN',
    gazetteHeader: 'THE GAZETTE OF INDIA • EXTRAORDINARY (PART II—SECTION 1)',
    actTitle: 'BHARATIYA NYAYA SANHITA, 2023 (ACT NO. 45 OF 2023)',
    subtitle: 'Official Statutory Codebook, IPC Cross-Reference & AI Legal PDF Compendium'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    badge: 'हिं',
    gazetteHeader: 'भारत का राजपत्र • असाधारण (भाग II—खण्ड 1)',
    actTitle: 'भारतीय न्याय संहिता, 2023 (2023 का अधिनियम संख्यांक 45)',
    subtitle: 'आधिकारिक वैधानिक संहिता, पूर्व आईपीसी तुलना एवं एआई विधिक पीडीएफ निर्देशिका'
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    badge: 'తె',
    gazetteHeader: 'భారత రాజపత్రము • అసాధారణ (భాగము II—విభాగము 1)',
    actTitle: 'భారతీయ న్యాయ సంహిత, 2023 (2023 చట్టం సంఖ్య 45)',
    subtitle: 'అధికారిక చట్టబద్ధమైన కోడ్‌బుక్, ఐపీసీ పోలిక & AI లీగల్ PDF రిఫరెన్స్'
  },
  or: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    badge: 'ଓଡ଼ି',
    gazetteHeader: 'ଭାରତର ରାଜପତ୍ର • ଅସାଧାରଣ (ଭାଗ II—ଖଣ୍ଡ 1)',
    actTitle: 'ଭାରତୀୟ ନ୍ୟାୟ ସଂହିତା, ୨୦୨୩ (୨୦୨୩ ର ଅଧିନିୟମ ସଂଖ୍ୟା ୪୫)',
    subtitle: 'ସରକାରୀ ବୈଧାନିକ ସଂହିତା, ପୂର୍ବ ଆଇପିସି ତୁଳନା ଏବଂ AI ଆଇନଗତ PDF ପୁସ୍ତिका'
  }
};

export const UI_LABELS: Record<
  SupportedLanguage,
  {
    searchPlaceholder: string;
    chapter: string;
    section: string;
    title: string;
    description: string;
    punishment: string;
    ipcEquivalent: string;
    classification: string;
    actions: string;
    openPdf: string;
    exportCompendiumPdf: string;
    allCategories: string;
    cognizable: string;
    nonCognizable: string;
    bailable: string;
    nonBailable: string;
    clickHint: string;
    statutoryIngredients: string;
    investigativeProtocol: string;
    aiLegalBrief: string;
    bnssCompliance: string;
    bsaCompliance: string;
    downloadPdfBtn: string;
    printMultilingualBtn: string;
    closeBtn: string;
  }
> = {
  en: {
    searchPlaceholder: 'Search by BNS Section (e.g. 103, 303), IPC Section (302, 420), offence title, or keyword...',
    chapter: 'Chapter',
    section: 'BNS Section',
    title: 'Statutory Offence Title',
    description: 'Statutory Provision & Legal Definition',
    punishment: 'Prescribed Punishment',
    ipcEquivalent: 'Former IPC',
    classification: 'Cognizability & Bail',
    actions: 'Gazette PDF',
    openPdf: 'Open PDF Form',
    exportCompendiumPdf: 'Export Compendium PDF',
    allCategories: 'All Chapters & Offence Categories',
    cognizable: 'Cognizable',
    nonCognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    nonBailable: 'Non-Bailable',
    clickHint: 'Click any section row to open its AI Statutory Gazette PDF Document',
    statutoryIngredients: 'Essential Legal Ingredients (Mens Rea & Actus Reus)',
    investigativeProtocol: 'Mandatory IO Investigative Protocol (BNSS 2023)',
    aiLegalBrief: 'AI Judicial & Forensic Applicability Analysis',
    bnssCompliance: 'BNSS 2023 Procedural Mandate',
    bsaCompliance: 'BSA 2023 Evidentiary Standard',
    downloadPdfBtn: 'Download Official PDF (.pdf)',
    printMultilingualBtn: 'Print / Save Multilingual PDF',
    closeBtn: 'Close PDF Viewer'
  },
  hi: {
    searchPlaceholder: 'बीएनएस धारा (जैसे 103, 303), पुरानी आईपीसी धारा (302, 420), शीर्षक या शब्द से खोजें...',
    chapter: 'अध्याय',
    section: 'बीएनएस धारा',
    title: 'वैधानिक अपराध शीर्षक',
    description: 'वैधानिक प्रावधान और विधिक परिभाषा',
    punishment: 'निर्धारित दण्ड',
    ipcEquivalent: 'पूर्व आईपीसी',
    classification: 'संज्ञेयता एवं जमानत',
    actions: 'राजपत्र पीडीएफ',
    openPdf: 'पीडीएफ खोलें',
    exportCompendiumPdf: 'संपूर्ण संहिता पीडीएफ डाउनलोड',
    allCategories: 'सभी अध्याय एवं अपराध श्रेणियां',
    cognizable: 'संज्ञेय अपराध',
    nonCognizable: 'असंज्ञेय अपराध',
    bailable: 'जमानतीय',
    nonBailable: 'गैर-जमानतीय',
    clickHint: 'किसी भी धारा पर क्लिक करके उसका एआई वैधानिक राजपत्र पीडीएफ (PDF Form) खोलें',
    statutoryIngredients: 'आवश्यक विधिक तत्व (आशय एवं कृत्य)',
    investigativeProtocol: 'अनिवार्य अन्वेषण प्रोटोकॉल (BNSS 2023)',
    aiLegalBrief: 'एआई न्यायिक एवं फॉरेंसिक प्रयोज्यता विश्लेषण',
    bnssCompliance: 'भारतीय नागरिक सुरक्षा संहिता (BNSS) प्रक्रिया',
    bsaCompliance: 'भारतीय साक्ष्य अधिनियम (BSA) मानक',
    downloadPdfBtn: 'पीडीएफ डाउनलोड करें (.pdf)',
    printMultilingualBtn: 'बहुभाषी राजपत्र प्रिंट / सेव करें',
    closeBtn: 'बंद करें'
  },
  te: {
    searchPlaceholder: 'BNS సెక్షన్ (ఉదా. 103, 303), పాత IPC సెక్షన్ (302, 420), శీర్షిక లేదా కీవర్డ్ ద్వారా వెతకండి...',
    chapter: 'అధ్యాయం',
    section: 'BNS సెక్షన్',
    title: 'చట్టబద్ధమైన నేర శీర్షిక',
    description: 'చట్టబద్ధమైన నిబంధన & న్యాయ నిర్వచనం',
    punishment: 'నిర్దేశించిన శిక్ష',
    ipcEquivalent: 'పాత IPC',
    classification: 'కాగ్నిజబుల్ & బెయిల్',
    actions: 'గెజిట్ PDF',
    openPdf: 'PDF ఫారమ్ తెరువు',
    exportCompendiumPdf: 'పూర్తి BNS PDF డౌన్‌లోడ్',
    allCategories: 'అన్ని అధ్యాయాలు & నేర విభాగాలు',
    cognizable: 'కాగ్నిజబుల్ (Cognizable)',
    nonCognizable: 'నాన్-కాగ్నిజబుల్',
    bailable: 'బెయిలబుల్',
    nonBailable: 'నాన్-బెయిలబుల్',
    clickHint: 'AI గెజిట్ PDF పత్రాన్ని తెరవడానికి ఏదైనా సెక్షన్ వరుసపై క్లిక్ చేయండి',
    statutoryIngredients: 'ముఖ్యమైన చట్టపరమైన అంశాలు (Mens Rea & Actus Reus)',
    investigativeProtocol: 'తప్పనిసరి దర్యాప్తు ప్రోటోకాల్ (BNSS 2023)',
    aiLegalBrief: 'AI న్యాయ & ఫోరెన్సిక్ విశ్లేషణ',
    bnssCompliance: 'BNSS 2023 విధానపరమైన నిబంధన',
    bsaCompliance: 'BSA 2023 సాక్ష్య ప్రమాణం',
    downloadPdfBtn: 'అధికారిక PDF డౌన్‌లోడ్ (.pdf)',
    printMultilingualBtn: 'బహుభాషా గెజిట్ ప్రింట్ / సేవ్',
    closeBtn: 'మూసివేయి'
  },
  or: {
    searchPlaceholder: 'BNS ଧାରା (ଯଥା 103, 303), ପୁରୁଣା IPC ଧାରା (302, 420), ଶୀର୍ଷକ କିମ୍ବା ଶବ୍ଦ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...',
    chapter: 'ଅଧ୍ୟାୟ',
    section: 'BNS ଧାରା',
    title: 'ବୈଧାନିକ ଅପରାଧ ଶୀର୍ଷକ',
    description: 'ବୈଧାନିକ ବ୍ୟବସ୍ଥା ଏବଂ ଆଇନଗତ ସଂଜ୍ଞା',
    punishment: 'ନିର୍ଦ୍ଧାରିତ ଦଣ୍ଡବିଧାନ',
    ipcEquivalent: 'ପୂର୍ବ IPC',
    classification: 'ଧର୍ତ୍ତବ୍ୟ ଏବଂ ଜାମିନ',
    actions: 'ଗେଜେଟ୍ PDF',
    openPdf: 'PDF ফର୍ମ ଖୋଲନ୍ତୁ',
    exportCompendiumPdf: 'ସମ୍ପୂର୍ଣ୍ଣ ସଂହିତା PDF ଡାଉନଲୋଡ୍',
    allCategories: 'ସମସ୍ତ ଅଧ୍ୟାୟ ଏବଂ ଅପରାଧ ବର୍ଗ',
    cognizable: 'ଧର୍ତ୍ତବ୍ୟ (Cognizable)',
    nonCognizable: 'ଅଧର୍ତ୍ତବ୍ୟ',
    bailable: 'ଜାମିନଯୁକ୍ତ',
    nonBailable: 'ଜାମିନবিହୀନ',
    clickHint: 'AI ବୈଧାନିକ ଗେଜେଟ୍ PDF ଡକ୍ୟୁମେଣ୍ଟ୍ ଖୋଲିବାକୁ ଯେକୌଣସି ଧାରା ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ',
    statutoryIngredients: 'ଆବଶ୍ୟକୀୟ ଆଇନଗତ ଉପାଦାନ (Mens Rea & Actus Reus)',
    investigativeProtocol: 'ବାଧ୍ୟତାମୂଳକ ତଦନ୍ତ ପ୍ରୋଟୋକଲ୍ (BNSS 2023)',
    aiLegalBrief: 'AI ନ୍ୟାୟିକ ଏବଂ ଫୋରେନ୍ସିକ୍ ବିଶ୍ଳେଷଣ',
    bnssCompliance: 'BNSS 2023 ପ୍ରକ୍ରିୟାଗତ ନିୟମ',
    bsaCompliance: 'BSA 2023 ସାକ୍ଷ୍ୟ ମାନଦଣ୍ଡ',
    downloadPdfBtn: 'ସରକାରୀ PDF ଡାଉନଲୋଡ୍ (.pdf)',
    printMultilingualBtn: 'ବହୁଭାଷୀ ଗେଜେଟ୍ ପ୍ରିଣ୍ଟ୍ / ସେଭ୍',
    closeBtn: 'ବନ୍ଦ କରନ୍ତୁ'
  }
};

export const BNS_CATALOG: BNSSectionItem[] = [
  {
    chapter: 'I',
    chapterName: {
      en: 'Preliminary',
      hi: 'प्रारंभिक',
      te: 'ప్రాథమిక నిబంధనలు',
      or: 'ପ୍ରାରମ୍ଭିକ'
    },
    section: '1',
    ipcEquivalent: 'IPC Sec 1–5',
    category: 'Preliminary & Punishments',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'All Courts of Competent Jurisdiction',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Applies across the whole of India and to offences committed on Indian ships, aircraft, or targeting computer resources in India from abroad.',
    bsaAdmissibility: 'Read with Sec 1 & Sec 2 of Bharatiya Sakshya Adhiniyam, 2023.',
    ingredients: [
      'Enactment of Bharatiya Nyaya Sanhita, 2023 (Act 45 of 2023) effective from 1st July 2024',
      'Territorial and extra-territorial jurisdiction over Indian citizens and digital assets located in India'
    ],
    investigativeSteps: [
      'Verify date and time of occurrence to ensure offence occurred on or after 01-07-2024 for BNS invocation.',
      'For cyber offences committed from outside India targeting servers/victims in India, invoke extra-territorial jurisdiction under Sec 1(5) BNS.'
    ],
    translations: {
      en: {
        title: 'Short title, commencement and application',
        description: 'This Act may be called the Bharatiya Nyaya Sanhita, 2023. Every person shall be liable to punishment under this Sanhita for every act or omission contrary to the provisions thereof across India and extra-territorially for Indian citizens or computer resources located in India.',
        punishment: 'Jurisdictional Applicability Provision',
        aiCommentary: 'Establishes the foundational jurisdiction of BNS 2023. Crucial for cross-border cybercrime FIRs where perpetrators outside India target victims or financial systems located inside India.'
      },
      hi: {
        title: 'संक्षिप्त नाम, प्रारंभ और लागू होना',
        description: 'इस अधिनियम का संक्षिप्त नाम भारतीय न्याय संहिता, 2023 है। यह संपूर्ण भारत में तथा भारत के बाहर भारतीय नागरिकों एवं भारत में स्थित कंप्यूटर संसाधनों को लक्षित करने वाले अपराधों पर लागू होता है।',
        punishment: 'क्षेत्राधिकार संबंधी प्रावधान',
        aiCommentary: 'यह धारा 1 जुलाई 2024 से लागू बीएनएस 2023 के क्षेत्राधिकार को स्थापित करती है तथा विदेश से भारत के कंप्यूटर नेटवर्क पर किए गए साइबर अपराधों को भी शामिल करती है।'
      },
      te: {
        title: 'సంక్షిప్త నామం, ప్రారంభం మరియు వర్తింపు',
        description: 'ఈ చట్టాన్ని భారతీయ న్యాయ సంహిత, 2023 అని పిలుస్తారు. ఇది భారతదేశం అంతటా మరియు భారతదేశంలోని కంప్యూటర్ వనరులను లక్ష్యంగా చేసుకునే విదేశీ నేరాలకు కూడా వర్తిస్తుంది.',
        punishment: 'అధికార పరిధి నిబంధన',
        aiCommentary: '1 జూలై 2024 నుండి అమలులోకి వచ్చిన BNS 2023 యొక్క పరిధిని మరియు సైబర్ నేరాలపై అధికార పరిధిని ఈ సెక్షన్ నిర్దేశిస్తుంది.'
      },
      or: {
        title: 'ସଂକ୍ଷିପ୍ତ ନାମ, ପ୍ରାରମ୍ଭ ଏବଂ ପ୍ରୟୋଗ',
        description: 'ଏହି ଅଧିନିୟମକୁ ଭାରତୀୟ ନ୍ୟାୟ ସଂହିତା, ୨୦୨୩ କୁହାযିବ। ଏହା ସମଗ୍ର ଭାରତରେ ଏବଂ ଭାରତରେ ଥିବା କମ୍ପ୍ୟୁଟର ସମ୍ବଳକୁ ଲକ୍ଷ୍ୟ କରୁଥିବା ବାହ୍ୟ ଅପରାଧ ପ୍ରତି ମଧ୍ୟ ଲାଗୁ ହେବ।',
        punishment: 'ଅଧିକାର କ୍ଷେତ୍ର ବ୍ୟବସ୍ଥା',
        aiCommentary: '୧ ଜୁଲାଇ ୨୦୨୪ ରୁ ଲାଗୁ ହୋଇଥିବା BNS ୨୦୨୩ ର ମୌଳିକ ଅଧିକାର କ୍ଷେତ୍ର ଏବଂ ସାଇବର ଅପରାଧ ଉପରେ ପ୍ରୟୋଗକୁ ସ୍ଥିର କରେ।'
      }
    }
  },
  {
    chapter: 'I',
    chapterName: {
      en: 'Preliminary',
      hi: 'प्रारंभिक',
      te: 'ప్రాథమిక నిబంధనలు',
      or: 'ପ୍ରାରମ୍ଭିକ'
    },
    section: '2',
    ipcEquivalent: 'IPC Sec 6–52A (Consolidated)',
    category: 'Preliminary & Punishments',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'All Courts',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Standardized definitions aligned with BNSS 2023 and IT Act 2000.',
    bsaAdmissibility: 'Incorporates electronic and digital records under Sec 2(1)(d) BSA 2023.',
    ingredients: [
      'Consolidates 39 alphabetical definitions from Child Sec 2(3) to Dishonestly Sec 2(7), Electronic Record Sec 2(8), and Document Sec 2(8)'
    ],
    investigativeSteps: [
      'Check statutory definitions of child (under 18 years), electronic record, wrongful gain, and valuable security when framing FIR charges.'
    ],
    translations: {
      en: {
        title: 'Definitions (Child, Dishonestly, Document, Electronic Record, etc.)',
        description: 'Consolidates all key statutory definitions in alphabetical order, explicitly defining "child" as any person below the age of eighteen years and expanding "document" to include electronic and digital records.',
        punishment: 'Definitional Clause',
        aiCommentary: 'Replaces scattered IPC sections (8–52A) with a single unified clause and introduces a uniform definition of "child" (<18 years) across the Sanhita.'
      },
      hi: {
        title: 'परिभाषाएं (बालक, बेईमानी से, दस्तावेज, इलेक्ट्रॉनिक अभिलेख आदि)',
        description: 'संहिता की सभी प्रमुख विधिक परिभाषाओं को वर्णानुक्रम में समेकित करता है। इसमें 18 वर्ष से कम आयु के व्यक्ति को "बालक" परिभाषित किया गया है तथा इलेक्ट्रॉनिक और डिजिटल रिकॉर्ड को दस्तावेज में शामिल किया गया है।',
        punishment: 'परिभाषा खंड',
        aiCommentary: 'पुरानी आईपीसी की बिखरी हुई धाराओं (8 से 52A) को एक ही धारा में समेकित कर डिजिटल साक्ष्यों को स्पष्ट मान्यता देता है।'
      },
      te: {
        title: 'నిర్వచనాలు (బాలురు, నిజాయితీ లేకుండా, పత్రం, ఎలక్ట్రానిక్ రికార్డు మొదలైనవి)',
        description: 'సంహితలోని అన్ని కీలక నిర్వచనాలను అక్షర క్రమంలో పొందుపరిచింది. 18 ఏళ్లలోపు వారిని "బాలురు/బాలిక"గా నిర్వచించింది మరియు ఎలక్ట్రానిక్ రికార్డులను పత్రాలలో చేర్చింది.',
        punishment: 'నిర్వచన నిబంధన',
        aiCommentary: 'పాత IPC లోని వివిధ నిర్వచనాలను ఒకే సెక్షన్‌లోకి తీసుకువచ్చి డిజిటల్ రికార్డులకు చట్టబద్ధత కల్పించింది.'
      },
      or: {
        title: 'ସଂଜ୍ଞା (ଶିଶୁ, ଅସାଧୁ ଭାବରେ, ଦଲିଲ, ଇଲେକ୍ଟ୍ରୋନିକ୍ ରେକର୍ଡ ଇତ୍ୟାଦି)',
        description: 'ସଂହିତାର ସମସ୍ତ ପ୍ରମୁଖ ଆଇନଗତ ସଂଜ୍ଞାକୁ ଗୋଟିଏ ଧାରାରେ ଏକତ୍ରিত କରାଯାଇଛି। ୧୮ ବର୍ଷରୁ କମ୍ ବୟସର ବ୍ୟକ୍ତିଙ୍କୁ "ଶିଶୁ" ଭାବେ ଏବଂ ଇଲେକ୍ଟ୍ରୋନିକ୍ ରେକର୍ଡକୁ ଦଲିଲ ଭାବେ ଅନ୍ତର୍ଭୁକ୍ତ କରାଯାଇଛି।',
        punishment: 'ସଂଜ୍ଞା ଖଣ୍ଡ',
        aiCommentary: 'ପୁରୁଣା IPC ର ବିଭିନ୍ନ ସଂଜ୍ଞାକୁ ଗୋଟିଏ ଧାରାରେ ଏକତ୍ର କରି ଡିଜିଟାଲ୍ ପ୍ରମାଣକୁ ସ୍ପଷ୍ଟ ମାନ୍ୟତା ପ୍ରଦାନ କରେ।'
      }
    }
  },
  {
    chapter: 'II',
    chapterName: {
      en: 'Of Punishments',
      hi: 'दण्डों के विषय में',
      te: 'శిక్షల గురించి',
      or: 'ଦଣ୍ଡବିଧାନ ବିଷୟରେ'
    },
    section: '4',
    ipcEquivalent: 'IPC Sec 53 (Expanded)',
    category: 'Preliminary & Punishments',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'All Criminal Courts',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Read with Sec 23 BNSS 2023 defining scope of Community Service sentences.',
    bsaAdmissibility: 'Sentencing records and compliance certificates admissible as public documents.',
    ingredients: [
      'Six classes of statutory punishments: (a) Death, (b) Imprisonment for life, (c) Rigorous or simple imprisonment, (d) Forfeiture of property, (e) Fine, (f) Community Service'
    ],
    investigativeSteps: [
      'Identify whether minor offences (petty theft under Rs 5,000, public nuisance, defamation, etc.) qualify for Community Service sentencing.'
    ],
    translations: {
      en: {
        title: 'Punishments (Including Community Service)',
        description: 'The punishments to which offenders are liable under the provisions of this Sanhita are: (a) Death; (b) Imprisonment for life; (c) Imprisonment (rigorous or simple); (d) Forfeiture of property; (e) Fine; (f) Community Service.',
        punishment: 'Death, Life Imprisonment, Rigorous/Simple Imprisonment, Forfeiture, Fine, or Community Service',
        aiCommentary: 'Landmark reform introducing "Community Service" as a sixth statutory punishment for minor offences to promote reformative justice and reduce prison congestion.'
      },
      hi: {
        title: 'दण्ड (सामुदायिक सेवा सहित)',
        description: 'इस संहिता के उपबंधों के अधीन अपराधी जिन दण्डों से दण्डनीय हैं, वे हैं: (क) मृत्यु; (ख) आजीवन कारावास; (ग) कारावास (कठोर या सादा); (घ) संपत्ति का समपहरण; (ङ) जुर्माना; (च) सामुदायिक सेवा।',
        punishment: 'मृत्युदण्ड, आजीवन कारावास, कारावास, संपत्ति जब्ती, जुर्माना या सामुदायिक सेवा',
        aiCommentary: 'छोटे अपराधों में सुधारात्मक न्याय को बढ़ावा देने के लिए पहली बार "सामुदायिक सेवा" को छठे वैधानिक दण्ड के रूप में शामिल किया गया है।'
      },
      te: {
        title: 'శిక్షలు (సామాజిక సేవతో సహా)',
        description: 'ఈ సంహిత కింద నేరస్థులకు విధించే శిక్షలు: (ఎ) మరణశిక్ష; (బి) జీవిత ఖైదు; (సి) కఠిన లేదా సాధారణ జైలు శిక్ష; (డి) ఆస్తి జప్తు; (ఇ) జరిమానా; (ఎఫ్) సామాజిక సేవ (Community Service).',
        punishment: 'మరణశిక్ష, జీవిత ఖైదు, జైలు శిక్ష, ఆస్తి జప్తు, జరిమానా లేదా సామాజిక సేవ',
        aiCommentary: 'చిన్నపాటి నేరాలకు సంస్కరణాత్మక న్యాయం అందించడానికి "సామాజిక సేవ"ను కొత్త చట్టబద్ధమైన శిక్షగా ప్రవేశపెట్టారు.'
      },
      or: {
        title: 'ଦଣ୍ଡବିଧାନ (ସାମୁହିକ ସେବା ସହିତ)',
        description: 'ଏହି ସଂହିତା ଅଧୀନରେ ଅପରାଧୀମାନଙ୍କ ପାଇଁ ନିର୍ଦ୍ଧାରିତ ଦଣ୍ଡଗୁଡ଼ିକ ହେଲା: (କ) ମୃତ୍ୟୁଦଣ୍ଡ; (ଖ) ଆଜୀବନ କାରାବାସ; (ଗ) କାରାବାସ (କଠୋର କିମ୍ବା ସାଧାରଣ); (ଘ) ସମ୍ପତ୍ତି ବ୍ୟାଜ୍ୟାପ୍ତି; (ଙ) ଜରିମାନା; (ଚ) ସାମୁହିକ ସେବା।',
        punishment: 'ମୃତ୍ୟୁଦଣ୍ଡ, ଆଜୀବନ କାରାବାସ, କାରାବାସ, ସମ୍ପତ୍ତି ବ୍ୟାଜ୍ୟାପ୍ତି, ଜରିମାନା କିମ୍ବା ସାମୁହିକ ସେବା',
        aiCommentary: 'ଛୋଟ ଅପରାଧ କ୍ଷେତ୍ରରେ ସଂସ୍କାରମୂଳକ ନ୍ୟାୟ ପାଇଁ ପ୍ରଥମ ଥର "ସାମୁହିକ ସେବା"କୁ ଷଷ୍ଠ ବୈଧାନିକ ଦଣ୍ଡ ଭାବେ ଅନ୍ତର୍ଭୁକ୍ତ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'III',
    chapterName: {
      en: 'General Exceptions & Right of Private Defence',
      hi: 'साधारण अपवाद एवं निजी प्रतिरक्षा का अधिकार',
      te: 'సాధారణ మినహాయింపులు & ఆత్మరక్షణ హక్కు',
      or: 'ସାଧାରଣ ବ୍ୟତିକ୍ରମ ଏବଂ ଆତ୍ମରକ୍ଷା ଅଧିକାର'
    },
    section: '34',
    ipcEquivalent: 'IPC Sec 96–97',
    category: 'Exceptions & Abetment',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'All Courts',
    forensicMandatory7Yr: false,
    bnssProcedure: 'IO must objectively record defensive injuries and threat imminence in scene mahazar.',
    bsaAdmissibility: 'Burden of proving existence of circumstances within exceptions lies on accused under Sec 108 BSA.',
    ingredients: [
      'Nothing is an offence which is done in the exercise of the right of private defence of body or property',
      'Force used must be proportionate and not exceed what is necessary for defence'
    ],
    investigativeSteps: [
      'Document medico-legal defensive wounds on both complainant and accused.',
      'Reconstruct crime scene trajectory to verify proportionality of force.'
    ],
    translations: {
      en: {
        title: 'Things done in private defence (Right of Private Defence)',
        description: 'Nothing is an offence which is done in the exercise of the right of private defence. Every person has a right, subject to statutory restrictions, to defend their own body, the body of any other person, and movable or immovable property against theft, robbery, mischief or criminal trespass.',
        punishment: 'Statutory General Exception (No Offence if within legal limits)',
        aiCommentary: 'Protects citizens acting in bona fide self-defence of life or property against imminent unlawful aggression.'
      },
      hi: {
        title: 'निजी प्रतिरक्षा (आत्मरक्षा) में किए गए कार्य',
        description: 'कोई बात अपराध नहीं है जो निजी प्रतिरक्षा के अधिकार के प्रयोग में की जाती है। प्रत्येक व्यक्ति को अपने या किसी अन्य व्यक्ति के शरीर तथा चल या अचल संपत्ति की चोरी, लूट, रिष्टि या आपराधिक अतिचार से रक्षा करने का अधिकार है।',
        punishment: 'वैधानिक अपवाद (सीमा के भीतर कोई अपराध नहीं)',
        aiCommentary: 'तत्काल unlawful हमले के विरुद्ध जीवन और संपत्ति की सद्भावनापूर्ण आत्मरक्षा को विधिक संरक्षण प्रदान करता है।'
      },
      te: {
        title: 'ఆత్మరక్షణ (ప్రైవేట్ డిఫెన్స్) కోసం చేసిన చర్యలు',
        description: 'ఆత్మరక్షణ హక్కును వినియోగించుకుంటూ చేసే ఏ చర్యా నేరం కాదు. ప్రతి వ్యక్తికి తన శరీరాన్ని, ఇతరుల శరీరాన్ని మరియు ఆస్తిని దొంగతనం, దోపిడీ లేదా అతిక్రమణ నుండి రక్షించుకునే హక్కు ఉంది.',
        punishment: 'చట్టబద్ధమైన మినహాయింపు (నేరం కాదు)',
        aiCommentary: 'తక్షణ ప్రమాదం నుండి ప్రాణ, ఆస్తి రక్షణ కోసం చేసే ఆత్మరక్షణ చర్యలకు చట్టపరమైన రక్షణ కల్పిస్తుంది.'
      },
      or: {
        title: 'ବ୍ୟକ୍ତିଗତ ପ୍ରତିରକ୍ଷା (ଆତ୍ମରକ୍ଷା) ଅଧିକାରରେ କରାଯାଇଥିବା କାର୍ଯ୍ୟ',
        description: 'ବ୍ୟକ୍ତିଗତ ପ୍ରତିରକ୍ଷା ଅଧିକାର ପ୍ରୟୋଗ କରି କରାଯାଇଥିବା କୌଣସି କାର୍ଯ୍ୟ ଅପରାଧ ନୁହେଁ। ପ୍ରତ୍ୟେକ ବ୍ୟକ୍ତିଙ୍କୁ ନିଜର କିମ୍ବା ଅନ୍ୟର ଶରୀର ଏବଂ ସମ୍ପତ୍ତିକୁ ଚୋରି, ଡକାୟତି କିମ୍ବା ଅନୁପ୍ରବେଶରୁ ରକ୍ଷା କରିବାର ଅଧିକାର ଅଛି।',
        punishment: 'ବୈଧାନିକ ବ୍ୟତିକ୍ରମ (ଆଇନଗତ ସୀମା ମଧ୍ୟରେ ଅପରାଧ ନୁହେଁ)',
        aiCommentary: 'ତତ୍କାଳ ଆକ୍ରମଣ ବିରୁଦ୍ଧରେ ଜୀବନ ଓ ସମ୍ପତ୍ତିର ଆତ୍ମରକ୍ଷା ପାଇଁ ନାଗରିକଙ୍କୁ ଆଇନଗତ ସୁରକ୍ଷା ଦିଏ।'
      }
    }
  },
  {
    chapter: 'IV',
    chapterName: {
      en: 'Of Abetment, Criminal Conspiracy and Attempt',
      hi: 'दुष्प्रेरण, आपराधिक षड्यंत्र और प्रयत्न',
      te: 'ప్రేరేపణ, నేరపూరిత కుట్ర మరియు ప్రయత్నం',
      or: 'ପ୍ରରୋଚନା, ଅପରାଧିକ ଷଡ଼ଯନ୍ତ୍ର ଏବଂ ପ୍ରୟାସ'
    },
    section: '61',
    ipcEquivalent: 'IPC Sec 120A / 120B',
    category: 'Exceptions & Abetment',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court by which abetted offence is triable',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Call Detail Records (CDRs), financial trails, and encrypted chat logs must be seized under Sec 94 BNSS.',
    bsaAdmissibility: 'Things said or done by conspirator in reference to common design are relevant under Sec 8 BSA 2023.',
    ingredients: [
      'Agreement between two or more persons to do or cause to be done an illegal act',
      'Overt act pursuant to the agreement (for non-offence illegal acts)'
    ],
    investigativeSteps: [
      'Map communication graph and financial transfers between co-conspirators.',
      'Obtain BSA Sec 63 certificates for all seized mobile devices and cloud backups.'
    ],
    translations: {
      en: {
        title: 'Criminal conspiracy (Definition and Punishment)',
        description: 'When two or more persons agree with the common object to do, or cause to be done an illegal act, or an act which is not illegal by illegal means, such an agreement is designated a criminal conspiracy.',
        punishment: 'Same as abetment of the offence (if punishable with death/life/2+ years RI), or up to 6 months imprisonment / fine',
        aiCommentary: 'Combines IPC 120A and 120B into a single section. Essential for prosecuting masterminds and syndicate planners behind complex crimes.'
      },
      hi: {
        title: 'आपराधिक षड्यंत्र (परिभाषा और दण्ड)',
        description: 'जब दो या अधिक व्यक्ति किसी अवैध कार्य को करने या करवाने के सामान्य उद्देश्य से सहमत होते हैं, तो ऐसे समझौते को आपराधिक षड्यंत्र कहा जाता है।',
        punishment: 'मुख्य अपराध के दुष्प्रेरण के समान दण्ड, अथवा 6 माह तक कारावास या जुर्माना',
        aiCommentary: 'पुरानी आईपीसी की धारा 120A और 120B को एकीकृत करता है। संगठित और सुनियोजित अपराधों के सूत्रधारों पर कार्यवाही के लिए अत्यंत महत्वपूर्ण।'
      },
      te: {
        title: 'నేరపూరిత కుట్ర (నిర్వచనం మరియు శిక్ష)',
        description: 'ఇద్దరు లేదా అంతకంటే ఎక్కువ మంది వ్యక్తులు చట్టవిరుద్ధమైన చర్య చేయడానికి లేదా చేయించడానికి ఉమ్మడి ఉద్దేశ్యంతో అంగీకరించినప్పుడు, ఆ ఒప్పందాన్ని నేరపూరిత కుట్ర అంటారు.',
        punishment: 'ప్రధాన నేర ప్రేరేపణకు సమానమైన శిక్ష, లేదా 6 నెలల వరకు జైలు శిక్ష / జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్లు 120A మరియు 120B లను కలిపి ఒకే సెక్షన్‌గా రూపొందించారు. కుట్రదారులపై కేసు నమోదుకు ఇది కీలకం.'
      },
      or: {
        title: 'ଅପରାଧିକ ଷଡ଼ଯନ୍ତ୍ର (ସଂଜ୍ଞା ଏବଂ ଦଣ୍ଡ)',
        description: 'ଯେତେବେଳେ ଦୁଇ କିମ୍ବା তଦୂର୍ଦ୍ଧ୍ୱ ବ୍ୟକ୍ତି କୌଣସି ବେଆଇନ କାର୍ଯ୍ୟ କରିବାକୁ କିମ୍ବା କରାଇବାକୁ ସାଧାରଣ ଉଦ୍ଦେଶ୍ୟରେ ସହମତ ହୁଅନ୍ତି, ସେହି ସହମତିକୁ ଅପରାଧିକ ଷଡ଼ଯନ୍ତ୍ର କୁହାଯାଏ।',
        punishment: 'ମୂଳ ଅପରାଧର ପ୍ରରୋଚନା ସହ ସମାନ ଦଣ୍ଡ, କିମ୍ବା ୬ ମାସ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ / ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 120A ଏବଂ 120B କୁ ଏକତ୍ର କରେ। ଷଡ଼ଯନ୍ତ୍ରକାରୀଙ୍କ ବିରୁଦ୍ଧରେ ପ୍ରମାଣ ଯୋଗାଡ଼ ପାଇଁ ଏହା ମୁଖ୍ୟ ଧାରା।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '64',
    ipcEquivalent: 'IPC Sec 376',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'FIR must be recorded by a woman police officer under Sec 173(1) BNSS; audio-video statement under Sec 180 BNSS; medical exam within 24 hours under Sec 184 BNSS.',
    bsaAdmissibility: 'Character or previous sexual experience of victim is irrelevant under Sec 53A/48 BSA 2023.',
    ingredients: [
      'Commission of rape as defined under Section 63 BNS without consent or against will',
      'Aggravated punishment where perpetrator is police officer, public servant, relative, or person in authority'
    ],
    investigativeSteps: [
      'Ensure statement is recorded by a Woman Officer and Before Magistrate under Sec 183(6)(a) BNSS.',
      'Mandatory FSL forensic team crime scene inspection under Sec 176(3) BNSS and DNA profiling collection.'
    ],
    translations: {
      en: {
        title: 'Punishment for rape',
        description: 'Whoever commits rape shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.',
        punishment: 'Rigorous Imprisonment from 10 years to Life Imprisonment + Fine (Aggravated: Life till natural life or Death)',
        aiCommentary: 'Prioritized in Chapter V of BNS 2023. Mandates strict gender-sensitive BNSS recording protocols and compulsory forensic DNA chain of custody.'
      },
      hi: {
        title: 'बलात्संग के लिए दण्ड',
        description: 'जो कोई बलात्संग करेगा, वह दोनों में से किसी भांति के कठोर कारावास से, जिसकी अवधि दस वर्ष से कम नहीं होगी किंतु जो आजीवन कारावास तक की हो सकेगी, दण्डित किया जाएगा और जुर्माने से भी दण्डनीय होगा।',
        punishment: 'न्यूनतम 10 वर्ष से आजीवन कठोर कारावास + जुर्माना',
        aiCommentary: 'महिला पुलिस अधिकारी द्वारा बयान दर्ज कराना, 24 घंटे में मेडिकल परीक्षण और अनिवार्य फॉरेंसिक जांच (धारा 176(3) BNSS) आवश्यक है।'
      },
      te: {
        title: 'అత్యాచారానికి శిక్ష',
        description: 'అత్యాచారానికి పాల్పడిన వ్యక్తికి పదేళ్లకు తగ్గకుండా జీవిత ఖైదు వరకు కఠిన కారాగార శిక్ష మరియు జరిమానా విధించబడుతుంది.',
        punishment: 'కనీసం 10 సంవత్సరాల నుండి జీవిత ఖైదు వరకు కఠిన కారాగార శిక్ష + జరిమానా',
        aiCommentary: 'BNSS సెక్షన్ 173 & 183 ప్రకారం మహిళా పోలీసు అధికారి ద్వారా వాంగ్మూలం నమోదు మరియు తప్పనిసరి ఫోరెన్సిక్ DNA పరీక్ష అవసరం.'
      },
      or: {
        title: 'ବଳାତ୍କାର ପାଇଁ ଦଣ୍ଡ',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି ବଳାତ୍କାର କରେ, ତାକୁ ଅତି କମରେ ଦଶ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ ପର୍ଯ୍ୟନ୍ତ କଠୋର କାରାଦଣ୍ଡ ଏବଂ ଜରିମାନାରେ ଦଣ୍ଡିତ କରାଯିବ।',
        punishment: 'ଅତି କମରେ ୧୦ ବର୍ଷରୁ ଆଜୀବନ କଠୋର କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ମହିଳା ପୋଲିସ ଅଧିକାରୀଙ୍କ ଦ୍ୱାରା ବୟାନ ରେକର୍ଡ ଏବଂ BNSS ଧାରା 176(3) ଅନୁযାୟୀ ବାଧ୍ୟତାମୂଳକ ଫୋରେନ୍ସିକ୍ DNA ଯାଞ୍ଚ ଆବଶ୍ୟକ।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '69',
    ipcEquivalent: 'New Provision in BNS 2023',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory forensic inspection under Sec 176(3) BNSS as maximum punishment extends to 10 years.',
    bsaAdmissibility: 'Digital communications, matrimonial representations, and witness testimony admissible under Sec 63 BSA.',
    ingredients: [
      'Employment of deceitful means (suppression of identity, fake employment/promotion promise) OR promise to marry without intention of fulfilling it',
      'Sexual intercourse not amounting to the offence of rape'
    ],
    investigativeSteps: [
      'Preserve digital messages, identity documents, and communications proving deceit or false promise from inception.',
      'Record victim statement before Magistrate under Sec 183 BNSS.'
    ],
    translations: {
      en: {
        title: 'Sexual intercourse by employing deceitful means, etc.',
        description: 'Whoever, by deceitful means or by making promise to marry to a woman without any intention of fulfilling the same, has sexual intercourse with her, such sexual intercourse not amounting to the offence of rape, shall be punished with imprisonment up to ten years and fine. "Deceitful means" includes inducement for false promise of employment or promotion, or marrying by suppressing identity.',
        punishment: 'Imprisonment up to 10 years + Fine',
        aiCommentary: 'Newly codified standalone offence in BNS 2023 addressing false promises of marriage, employment inducement, or identity suppression.'
      },
      hi: {
        title: 'छलपूर्ण साधनों आदि का प्रयोग करके लैंगिक संभोग',
        description: 'जो कोई छलपूर्ण साधनों द्वारा या किसी महिला से विवाह करने का ऐसा वचन देकर, जिसे पूरा करने का उसका कोई आशय नहीं है, उसके साथ लैंगिक संभोग करता है, वह दस वर्ष तक के कारावास और जुर्माने से दण्डित किया जाएगा। "छलपूर्ण साधनों" में रोजगार/पदोन्नति का झूठा प्रलोभन या पहचान छिपाना शामिल है।',
        punishment: '10 वर्ष तक का कारावास + जुर्माना',
        aiCommentary: 'बीएनएस 2023 में जोड़ी गई नई विशिष्ट धारा जो विवाह के झूठे वादे, नौकरी के प्रलोभन या पहचान छिपाकर किए गए शोषण को दण्डनीय बनाती है।'
      },
      te: {
        title: 'మోసపూరిత మార్గాల ద్వారా లైంగిక సంభోగం',
        description: 'మోసపూరిత మార్గాల ద్వారా లేదా నెరవేర్చే ఉద్దేశ్యం లేకుండా వివాహం చేసుకుంటానని మహిళకు వాగ్దానం చేసి లైంగిక సంభోగం జరిపే వ్యక్తికి పదేళ్ల వరకు జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది. ఉద్యోగం/ప్రమోషన్ ఆశ చూపడం లేదా గుర్తింపు దాచడం ఇందులో భాగం.',
        punishment: '10 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'పెళ్లి పేరుతో మోసం చేయడం లేదా గుర్తింపు దాచిపెట్టడాన్ని BNS 2023లో ప్రత్యేక నేరంగా చేర్చారు.'
      },
      or: {
        title: 'ପ୍ରତାରଣାପୂର୍ଣ୍ଣ ଉପାୟ ଅବଲମ୍ବନ କରି ଯୌନ ସମ୍ପର୍କ',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି ପ୍ରତାରଣାପୂର୍ଣ୍ଣ ଉପାୟରେ କିମ୍ବା ପୂରଣ କରିବାର କୌଣସି ଉଦ୍ଦେଶ୍ୟ ନଥାଇ ବିବାହର ମିଥ୍ୟା ପ୍ରତିଶ୍ରୁତି ଦେଇ ମହିଳାଙ୍କ ସହ ଯୌନ ସମ୍ପର୍କ ସ୍ଥାପନ କରେ, ତାକୁ ଦଶ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ଓ ଜରିମାନା ହେବ। ପରିଚୟ ଲୁଚାଇବା କିମ୍ବା ଚାକିରି/ପଦୋନ୍ନତିର ମିଥ୍ୟା ପ୍ରଲୋଭନ ଏଥିରେ ଅନ୍ତର୍ଭୁକ୍ତ।',
        punishment: '୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ବିବାହର ମିଥ୍ୟା ପ୍ରତିଶ୍ରୁତି କିମ୍ବା ପରିଚୟ ଗୋପନ ରଖି ଶୋଷଣ ବିରୁଦ୍ଧରେ BNS ୨୦୨୩ ର ଏକ ନୂତନ ସ୍ୱତନ୍ତ୍ର ଧାରା।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '70',
    ipcEquivalent: 'IPC Sec 376D / 376DA / 376DB',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory FSL team scene inspection under Sec 176(3) BNSS; time-bound investigation within 2 months.',
    bsaAdmissibility: 'Forensic DNA profiling, electronic tower dumps, and Test Identification Parade (Sec 54 BNSS / Sec 7 BSA).',
    ingredients: [
      'Rape committed by one or more persons constituting a group or acting in furtherance of a common intention',
      'Sub-section (2): Victim under 18 years of age carries Life Imprisonment or Death Penalty'
    ],
    investigativeSteps: [
      'Conduct audio-video recorded Test Identification Parade (TIP) under Sec 54 BNSS.',
      'Collect multi-locus DNA samples and geo-location tower dump records of all suspects.'
    ],
    translations: {
      en: {
        title: 'Gang rape (Including minor victims under 18 years)',
        description: 'Where a woman is raped by one or more persons constituting a group or acting in furtherance of a common intention, each of those persons shall be deemed to have committed the offence of rape and shall be punished with rigorous imprisonment for not less than 20 years up to life. If the victim is under 18 years of age, punishable with life imprisonment or death.',
        punishment: '20 years RI to Life Imprisonment (Remainder of natural life) + Fine; Death Penalty if victim < 18 years',
        aiCommentary: 'Raises the threshold for capital punishment in gang rape cases to all minor victims under 18 years of age.'
      },
      hi: {
        title: 'सामूहिक बलात्संग (18 वर्ष से कम आयु की पीड़िता सहित)',
        description: 'जहां किसी महिला के साथ एक या अधिक व्यक्तियों के समूह द्वारा सामान्य आशय के अग्रसरण में बलात्संग किया जाता है, वहां प्रत्येक व्यक्ति कम से कम 20 वर्ष से आजीवन कारावास तक दण्डनीय होगा। यदि पीड़िता 18 वर्ष से कम आयु की है, तो आजीवन कारावास या मृत्युदण्ड का प्रावधान है।',
        punishment: '20 वर्ष से आजीवन कारावास (शेष प्राकृतिक जीवन) + जुर्माना; अवयस्क (<18 वर्ष) के मामले में मृत्युदण्ड तक',
        aiCommentary: '18 वर्ष से कम आयु की किसी भी अवयस्क पीड़िता के साथ सामूहिक बलात्संग के अपराध में मृत्युदण्ड तक का कठोर प्रावधान किया गया है।'
      },
      te: {
        title: 'సామూహిక అత్యాచారం (18 ఏళ్లలోపు మైనర్ బాధితులతో సహా)',
        description: 'ఉమ్మడి ఉద్దేశ్యంతో ఒకరు లేదా అంతకంటే ఎక్కువ మంది వ్యక్తుల బృందం మహిళపై అత్యాచారం చేస్తే, ప్రతి ఒక్కరికీ కనీసం 20 ఏళ్ల నుండి జీవిత ఖైదు వరకు శిక్ష పడుతుంది. బాధితురాలు 18 ఏళ్లలోపు ఉంటే జీవిత ఖైదు లేదా మరణశిక్ష విధించబడుతుంది.',
        punishment: '20 ఏళ్ల నుండి జీవిత ఖైదు + జరిమానా; 18 ఏళ్లలోపు బాధితురాలైతే మరణశిక్ష వరకు',
        aiCommentary: 'మైనర్ బాధితుల (18 ఏళ్లలోపు) సామూహిక అత్యాచార కేసుల్లో మరణశిక్ష విధించేలా చట్టాన్ని కఠినతరం చేశారు.'
      },
      or: {
        title: 'ଗଣବଳାତ୍କାର (୧୮ ବର୍ଷରୁ କମ୍ ନାବାଳିକା ପୀଡ଼ିତାଙ୍କ ସହିତ)',
        description: 'ସାଧାରଣ ଉଦ୍ଦେଶ୍ୟରେ ଏକାଧିକ ବ୍ୟକ୍ତିଙ୍କ ଦଳ ଦ୍ୱାରା ବଳାତ୍କାର କରାগଲେ ପ୍ରତ୍ୟେକ ବ୍ୟକ୍ତି ଅତି କମରେ ୨୦ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସରେ ଦଣ୍ଡିତ ହେବେ। ପୀଡ଼ିତା ୧୮ ବର୍ଷରୁ କମ୍ ହୋଇଥିଲେ ଆଜୀବନ କାରାବାସ କିମ୍ବା ମୃତ୍ୟୁଦଣ୍ଡ ହେବ।',
        punishment: '୨୦ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ + ଜରିମାନା; ୧୮ ବର୍ଷରୁ କମ୍ ପୀଡ଼ିତା କ୍ଷେତ୍ରରେ ମୃତ୍ୟୁଦଣ୍ଡ ପର୍ଯ୍ୟନ୍ତ',
        aiCommentary: '୧୮ ବର୍ଷରୁ କମ୍ ବୟସର ନାବାଳିକାଙ୍କ ସହ ଗଣବଳାତ୍କାର ମାମଲାରେ ମୃତ୍ୟୁଦଣ୍ଡ ପର୍ଯ୍ୟନ୍ତ କଠୋର ଦଣ୍ଡବିଧାନ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '74',
    ipcEquivalent: 'IPC Sec 354',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Prompt recording of victim statement by woman officer; CCTV preservation.',
    bsaAdmissibility: 'Contemporaneous eyewitness and CCTV footage admissible under Sec 4 & 63 BSA.',
    ingredients: [
      'Assault or use of criminal force to any woman',
      'Intention to outrage or knowledge that it will likely outrage her modesty'
    ],
    investigativeSteps: [
      'Secure surrounding CCTV footage and record eyewitness statements under Sec 180 BNSS.',
      'Ensure victim statement is recorded before Magistrate under Sec 183 BNSS.'
    ],
    translations: {
      en: {
        title: 'Assault or use of criminal force to woman with intent to outrage her modesty',
        description: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which shall not be less than one year but which may extend to five years, and shall also be liable to fine.',
        punishment: 'Imprisonment from 1 year to 5 years + Fine',
        aiCommentary: 'Mandatory minimum sentence of 1 year imprisonment extending up to 5 years for outraging the modesty of a woman.'
      },
      hi: {
        title: 'महिला की लज्जा भंग करने के आशय से उस पर हमला या आपराधिक बल का प्रयोग',
        description: 'जो कोई किसी महिला की लज्जा भंग करने के आशय से या यह संभाव्य जानते हुए कि वह उसकी लज्जा भंग करेगा, उस पर हमला करता है या आपराधिक बल का प्रयोग करता है, वह कम से कम एक वर्ष से पांच वर्ष तक के कारावास और जुर्माने से दण्डित किया जाएगा।',
        punishment: '1 वर्ष से 5 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'महिला की गरिमा और लज्जा की रक्षा हेतु न्यूनतम 1 वर्ष के अनिवार्य कारावास का प्रावधान है।'
      },
      te: {
        title: 'మహిళ ఆత్మగౌరవానికి భంగం కలిగించే ఉద్దేశ్యంతో దాడి లేదా నేరపూరిత బలప్రయోగం',
        description: 'మహిళ యొక్క మానమర్యాదలకు భంగం కలిగించే ఉద్దేశ్యంతో దాడి చేసినా లేదా నేరపూరిత బలప్రయోగం చేసినా కనీసం ఒక సంవత్సరం నుండి ఐదు సంవత్సరాల వరకు జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది.',
        punishment: '1 నుండి 5 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'మహిళల భద్రత కోసం కనీసం 1 సంవత్సరం జైలు శిక్షను తప్పనిసరి చేస్తుంది.'
      },
      or: {
        title: 'ମହିଳାଙ୍କ ଲଜ୍ଜା ଭଙ୍ଗ କରିବା ଉଦ୍ଦେଶ୍ୟରେ ଆକ୍ରମଣ କିମ୍ବା ଅପରାଧିକ ବଳ ପ୍ରୟୋଗ',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି କୌଣସି ମହିଳାଙ୍କ ଲଜ୍ଜା ଭଙ୍ଗ କରିବା ଉଦ୍ଦେଶ୍ୟରେ ଆକ୍ରମଣ କରେ କିମ୍ବା ଅପରାଧିକ ବଳ ପ୍ରୟୋଗ କରେ, ତାକୁ ଅତି କମରେ ୧ ବର୍ଷରୁ ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ଏବଂ ଜରିମାନା ହେବ।',
        punishment: '୧ ବର୍ଷରୁ ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ମହିଳାଙ୍କ ସମ୍ମାନ ଓ ସୁରକ୍ଷା ପାଇଁ ସର୍ବନିମ୍ନ ୧ ବର୍ଷ କାରାଦଣ୍ଡ ବାଧ୍ୟତାମୂଳକ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '78',
    ipcEquivalent: 'IPC Sec 354D',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'First conviction is Bailable; second or subsequent conviction is Non-Bailable.',
    bsaAdmissibility: 'Social media logs, emails, call logs, and spyware evidence admissible under Sec 63 BSA.',
    ingredients: [
      'Following a woman and contacting or attempting to contact her despite clear indication of disinterest',
      'Monitoring the use by a woman of the internet, email or any other form of electronic communication (Cyber Stalking)'
    ],
    investigativeSteps: [
      'Preserve screenshots, URLs, IP logs, and call history with hash values.',
      'Check CCTNS criminal antecedent database for any prior stalking conviction.'
    ],
    translations: {
      en: {
        title: 'Stalking (Physical and Cyber Stalking)',
        description: 'Any man who follows a woman and contacts, or attempts to contact such woman to foster personal interaction repeatedly despite a clear indication of disinterest by such woman; or monitors the use by a woman of the internet, email or any other form of electronic communication, commits the offence of stalking.',
        punishment: 'First Conviction: Up to 3 years Imprisonment + Fine; Subsequent Conviction: Up to 5 years Imprisonment + Fine',
        aiCommentary: 'Covers both physical following and online cyber-stalking across social media, messaging apps, and email.'
      },
      hi: {
        title: 'पीछा करना (भौतिक एवं साइबर स्टॉकिंग)',
        description: 'कोई पुरुष जो किसी महिला की स्पष्ट अनिच्छा के बावजूद बार-बार उसका पीछा करता है या संपर्क करने का प्रयास करता है; अथवा महिला द्वारा इंटरनेट, ईमेल या किसी अन्य इलेक्ट्रॉनिक संचार के उपयोग की निगरानी करता है, वह पीछा करने (स्टॉकिंग) का अपराध करता है।',
        punishment: 'प्रथम दोषसिद्धि: 3 वर्ष तक कारावास + जुर्माना; द्वितीय दोषसिद्धि: 5 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'इसमें सड़क पर पीछा करने के साथ-साथ सोशल मीडिया, ईमेल और डिजिटल प्लेटफॉर्म पर साइबर स्टॉकिंग भी शामिल है।'
      },
      te: {
        title: 'వెంబడించడం (భౌతిక మరియు సైబర్ స్టాకింగ్)',
        description: 'మహిళ ఇష్టం లేదని స్పష్టంగా తెలిపినప్పటికీ పదేపదే ఆమెను వెంబడించడం, సంప్రదించడానికి ప్రయత్నించడం లేదా ఆమె ఇంటర్నెట్, ఈమెయిల్, ఎలక్ట్రానిక్ కమ్యూనికేషన్ వినియోగాన్ని నిఘా పెట్టడం స్టాకింగ్ నేరం అవుతుంది.',
        punishment: 'మొదటి నేరం: 3 ఏళ్ల వరకు జైలు + జరిమానా; తదుపరి నేరం: 5 ఏళ్ల వరకు జైలు + జరిమానా',
        aiCommentary: 'భౌతికంగా వెంబడించడంతో పాటు ఆన్‌లైన్ మరియు సోషల్ మీడియా వేధింపులను కూడా ఈ సెక్షన్ కవర్ చేస్తుంది.'
      },
      or: {
        title: 'ପିଛା କରିବା (ଭୌତିକ ଏବଂ ସାଇବର ଷ୍ଟକିଂ)',
        description: 'କୌଣସି ମହିଳାଙ୍କ ସ୍ପଷ୍ଟ ଅନିଚ୍ଛା ସତ୍ତ୍ୱେ ବାରମ୍ବାର ତାଙ୍କୁ ପିଛା କରିବା ବା ଯୋଗାଯୋଗ କରିବାକୁ ଚେଷ୍ଟା କରିବା କିମ୍ବା ମହିଳାଙ୍କ ଇଣ୍ଟରନେଟ୍, ଇମେଲ୍ ବା ଇଲେକ୍ଟ୍ରୋନିକ୍ ଯୋଗାଯୋଗ ଉପରେ ନଜର ରଖିବା ଷ୍ଟକିଂ ଅପରାଧ ଅଟେ।',
        punishment: 'ପ୍ରଥମ ଦୋଷସିଦ୍ଧି: ୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା; ପରବର୍ତ୍ତୀ ଦୋଷସିଦ୍ଧି: ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ଏହା ଉଭୟ ଭୌତିକ ପିଛା କରିବା ଏବଂ ସୋସିଆଲ ମିଡିଆ/ଇଣ୍ଟରନେଟ୍ ସାଇବର ଷ୍ଟକିଂକୁ ଅନ୍ତର୍ଭୁକ୍ତ କରେ।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '80',
    ipcEquivalent: 'IPC Sec 304B',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory Executive Magistrate inquest under Sec 196 BNSS and mandatory FSL scene visit under Sec 176(3) BNSS.',
    bsaAdmissibility: 'Statutory presumption as to dowry death under Sec 118 Bharatiya Sakshya Adhiniyam, 2023.',
    ingredients: [
      'Death of a woman caused by burns, bodily injury, or otherwise than under normal circumstances within 7 years of marriage',
      'Subjected to cruelty or harassment by husband or relative soon before her death in connection with demand for dowry'
    ],
    investigativeSteps: [
      'Requisition Executive Magistrate inquest under Sec 196 BNSS and two-doctor videographed post-mortem.',
      'Seize marriage records, dowry demand communications, and banking transactions.'
    ],
    translations: {
      en: {
        title: 'Dowry death',
        description: 'Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry, such death shall be called "dowry death".',
        punishment: 'Imprisonment not less than 7 years, extendable to Imprisonment for Life',
        aiCommentary: 'Triggers mandatory statutory presumption under Sec 118 BSA 2023 and compulsory Executive Magistrate inquest.'
      },
      hi: {
        title: 'दहेज मृत्यु',
        description: 'जहां किसी महिला की मृत्यु विवाह के सात वर्ष के भीतर जलने या शारीरिक क्षति से या सामान्य परिस्थितियों से भिन्न होती है और यह दर्शित किया जाता है कि मृत्यु से कुछ पूर्व उसके पति या पति के नातेदार द्वारा दहेज की मांग के संबंध में उसके साथ क्रूरता या उत्पीड़न किया गया था, वहां ऐसी मृत्यु को "दहेज मृत्यु" कहा जाएगा।',
        punishment: 'न्यूनतम 7 वर्ष से आजीवन कारावास तक',
        aiCommentary: 'भारतीय साक्ष्य अधिनियम की धारा 118 के तहत दहेज मृत्यु की उपधारणा लागू होती है और कार्यपालक मजिस्ट्रेट द्वारा पंचनामा अनिवार्य है।'
      },
      te: {
        title: 'వరకట్న మరణం',
        description: 'వివాహమైన ఏడు సంవత్సరాలలోపు మహిళ కాలిన గాయాలు, శారీరక గాయం లేదా అసాధారణ పరిస్థితుల్లో మరణించి, మరణానికి ముందు భర్త లేదా అతని బంధువులు వరకట్నం కోసం వేధించినట్లు రుజువైతే దానిని "వరకట్న మరణం" అంటారు.',
        punishment: 'కనీసం 7 సంవత్సరాల నుండి జీవిత ఖైదు వరకు జైలు శిక్ష',
        aiCommentary: 'BSA 2023 సెక్షన్ 118 ప్రకారం చట్టబద్ధమైన భావన వర్తిస్తుంది మరియు ఎగ్జిక్యూటివ్ మేజిస్ట్రేట్ విచారణ తప్పనిసరి.'
      },
      or: {
        title: 'ଯୌତୁକ ମୃତ୍ୟୁ',
        description: 'ବିବାହର ସାତ ବର୍ଷ ମଧ୍ୟରେ କୌଣସି ମହିଳାଙ୍କର ପୋଡ଼ି ହୋଇ, ଶାରୀରିକ ଆଘାତ କିମ୍ବା ଅସ୍ୱାଭାବିକ ପରିସ୍ଥିତିରେ ମୃତ୍ୟୁ ଘଟିଲେ ଏବଂ ମୃତ୍ୟୁ ପୂର୍ବରୁ ଯୌତୁକ ଦାବି ପାଇଁ ସ୍ୱାମୀ ବା ତାଙ୍କ ସମ୍ପର୍କୀୟଙ୍କ ଦ୍ୱାରା ନିର୍ଯାତନା ଦିଆଯାଇଥିବା ପ୍ରମାଣିତ ହେଲେ ତାହାକୁ "ଯୌତୁକ ମୃତ୍ୟୁ" କୁହାযିବ।',
        punishment: 'ଅତି କମରେ ୭ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ ପର୍ଯ୍ୟନ୍ତ',
        aiCommentary: 'BSA ୨୦୨୩ ର ଧାରା ୧୧୮ ଅନୁযାୟୀ ବୈଧାନିକ ଅନୁମାନ ଏବଂ ମାଜିଷ୍ଟ୍ରେଟ୍ ତଦନ୍ତ ବାଧ୍ୟତାମୂଳକ ଅଟେ।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '85',
    ipcEquivalent: 'IPC Sec 498A',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Follow Arnesh Kumar & Sec 35(3) BNSS notice guidelines where punishment is up to 3 years.',
    bsaAdmissibility: 'Medical reports, audio/video recordings, and financial demands admissible under BSA.',
    ingredients: [
      'Husband or relative of husband of a woman subjecting such woman to cruelty',
      'Cruelty defined in Sec 86 BNS as wilful conduct likely to drive woman to suicide/grave injury OR harassment for unlawful property/dowry demand'
    ],
    investigativeSteps: [
      'Issue Sec 35(3) BNSS notice before arrest unless mandatory grounds for arrest are recorded in writing.',
      'Collect documentary, medical, and electronic evidence of harassment or unlawful demand.'
    ],
    translations: {
      en: {
        title: 'Husband or relative of husband of a woman subjecting her to cruelty',
        description: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine. (Read with Section 86 defining "Cruelty").',
        punishment: 'Imprisonment up to 3 years + Fine',
        aiCommentary: 'Replaces IPC 498A and brings domestic cruelty directly under Chapter V (Offences against Woman and Child).'
      },
      hi: {
        title: 'किसी महिला के पति या पति के नातेदार द्वारा उसके प्रति क्रूरता करना',
        description: 'जो कोई, किसी महिला का पति या पति का नातेदार होते हुए, ऐसी महिला के प्रति क्रूरता करेगा, वह तीन वर्ष तक के कारावास से दण्डित किया जाएगा और जुर्माने से भी दण्डनीय होगा। (धारा 86 में "क्रूरता" परिभाषित है)।',
        punishment: '3 वर्ष तक का कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 498A के स्थान पर महिला संरक्षण अध्याय में शामिल किया गया है।'
      },
      te: {
        title: 'భర్త లేదా భర్త బంధువులు మహిళను క్రూరత్వానికి గురిచేయడం',
        description: 'మహిళ యొక్క భర్త లేదా భర్త బంధువులు ఆమెను శారీరక లేదా మానసిక క్రూరత్వానికి గురిచేస్తే మూడు సంవత్సరాల వరకు జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది (సెక్షన్ 86 తో కలిపి చదవాలి).',
        punishment: '3 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్ 498A స్థానంలో మహిళలపై నేరాల అధ్యాయంలో చేర్చబడింది.'
      },
      or: {
        title: 'ମହିଳାଙ୍କ ସ୍ୱାମୀ କିମ୍ବା ସ୍ୱାମୀଙ୍କ ସମ୍ପର୍କୀୟଙ୍କ ଦ୍ୱାରା ନିଷ୍ଠୁରତା ଆଚରଣ',
        description: 'କୌଣସି ମହିଳାଙ୍କ ସ୍ୱାମୀ କିମ୍ବା ସ୍ୱାମୀଙ୍କ ସମ୍ପର୍କୀୟ ଯଦି ସେହି ମହିଳାଙ୍କ ପ୍ରତି ନିଷ୍ଠୁରତା (Cruelty) ଆଚରଣ କରନ୍ତି, ତେବେ ୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ଏବଂ ଜରିମାନାରେ ଦଣ୍ଡିତ ହେବେ।',
        punishment: '୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 498A ବଦଳରେ ମହିଳା ସୁରକ୍ଷା ଅଧ୍ୟାୟରେ ସ୍ଥାନିତ ହୋଇଛି।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '95',
    ipcEquivalent: 'New Provision in BNS 2023',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Child victim protection under JJ Act & BNSS; mandatory FSL scene visit under Sec 176(3) BNSS.',
    bsaAdmissibility: 'Age determination proof and digital recruitment records admissible under BSA.',
    ingredients: [
      'Hiring, employing, or engaging a child (person below 18 years of age) to commit an offence',
      'Perpetrator is liable for minimum 3 to 10 years plus the punishment for the committed offence'
    ],
    investigativeSteps: [
      'Produce the rescued child before the Child Welfare Committee (CWC) immediately.',
      'Investigate the adult syndicate or handler who engaged the minor.'
    ],
    translations: {
      en: {
        title: 'Hiring, employing or engaging a child to commit an offence',
        description: 'Whoever hires, employs or engages any child to commit an offence shall be punished with imprisonment of either description for a term which shall not be less than three years but which may extend to ten years, and with fine; and if the offence be committed, shall also be punished with the punishment provided for that offence as if the offence had been committed by such person himself.',
        punishment: '3 to 10 years Imprisonment + Fine + Full punishment prescribed for the underlying offence',
        aiCommentary: 'Major new statutory deterrent in BNS 2023 targeting syndicates that exploit juveniles to execute thefts, narcotics peddling, or violent crimes.'
      },
      hi: {
        title: 'अपराध करने के लिए किसी बालक को भाड़े पर लेना, नियोजित करना या लगाना',
        description: 'जो कोई किसी बालक (18 वर्ष से कम) को कोई अपराध करने के लिए भाड़े पर लेता है, नियोजित करता है या लगाता है, वह कम से कम तीन वर्ष से दस वर्ष तक के कारावास और जुर्माने से दण्डित किया जाएगा; और यदि अपराध कारित हो जाता है, तो उस अपराध के लिए निर्धारित दण्ड से भी दण्डित होगा।',
        punishment: '3 से 10 वर्ष का कारावास + जुर्माना + मुख्य अपराध का पूर्ण दण्ड',
        aiCommentary: 'नाबालिग बच्चों का उपयोग करके अपराध कराने वाले गिरोहों पर नकेल कसने के लिए बीएनएस 2023 की एक अत्यंत महत्वपूर्ण नई धारा।'
      },
      te: {
        title: 'నేరం చేయడానికి బాలుడిని/బాలికను కిరాయికి తీసుకోవడం లేదా నియమించడం',
        description: 'ఏదైనా నేరం చేయడానికి మైనర్ (18 ఏళ్లలోపు) పిల్లలను కిరాయికి తీసుకున్నా లేదా నియమించుకున్నా కనీసం 3 నుండి 10 సంవత్సరాల వరకు జైలు శిక్ష, జరిమానా మరియు ఆ నేరానికి వర్తించే పూర్తి శిక్ష విధించబడుతుంది.',
        punishment: '3 నుండి 10 ఏళ్ల జైలు శిక్ష + జరిమానా + అసలు నేరానికి ఉండే పూర్తి శిక్ష',
        aiCommentary: 'మైనర్లను నేరాలకు వాడుకునే ముఠాలను అరికట్టడానికి BNS 2023లో ప్రవేశపెట్టిన కొత్త కఠిన చట్టం.'
      },
      or: {
        title: 'ଅପରାଧ କରିବା ପାଇଁ ଶିଶୁକୁ ଭଡ଼ାରେ ନେବା କିମ୍ବା ନିୟୋଜିତ କରିବା',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି କୌଣସି ଅପରାଧ କରିବା ପାଇଁ ଶିଶୁ (୧୮ ବର୍ଷରୁ କମ୍) କୁ ନିୟୋଜିତ କରେ, ତାକୁ ୩ ରୁ ୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ, ଜରିମାନା ଏବଂ ସଂঘଟିତ ଅପରାଧର ସମ୍ପୂର୍ଣ୍ଣ ଦଣ୍ଡ ମିଳିବ।',
        punishment: '୩ ରୁ ୧୦ ବର୍ଷ କାରାବାସ + ଜରିମାନା + ମୂଳ ଅପରାଧର ଦଣ୍ଡ',
        aiCommentary: 'ନାବାଳକମାନଙ୍କୁ ଅପରାଧରେ ବ୍ୟବହାର କରୁଥିବା ଗ୍ୟାଙ୍ଗ୍ ବିରୁଦ୍ଧରେ BNS ୨୦୨୩ ର ଏକ ନୂତନ କଠୋର ଧାରା।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '103',
    ipcEquivalent: 'IPC Sec 302',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory FSL crime scene visit under Sec 176(3) BNSS; mandatory videographed search/seizure under Sec 105 BNSS; inquest under Sec 194 BNSS.',
    bsaAdmissibility: 'Dying declaration under Sec 26(a) BSA; weapon recovery discovery under Sec 23 BSA; electronic CCTV under Sec 63 BSA.',
    ingredients: [
      'Causing death with intention of causing death, or bodily injury known/sufficient in ordinary course of nature to cause death (Sec 101 BNS)',
      'Sub-section (2): Mob lynching by 5 or more persons on grounds of race, caste, community, sex, language, or personal belief'
    ],
    investigativeSteps: [
      'Cordon off crime scene immediately and summon Forensic Science Laboratory (FSL) mobile unit under Sec 176(3) BNSS.',
      'Conduct videographed inquest (Sec 194 BNSS) and recovery panchnama (Sec 105 BNSS).'
    ],
    translations: {
      en: {
        title: 'Punishment for murder (Including Mob Lynching under Sec 103(2))',
        description: 'Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. Under Sub-section (2), when a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other similar ground, each member shall be punished with death or imprisonment for life, and fine.',
        punishment: 'Death Penalty or Imprisonment for Life + Fine',
        aiCommentary: 'Replaces IPC Section 302 and explicitly codifies Mob Lynching under Section 103(2) with Death or Life Imprisonment.'
      },
      hi: {
        title: 'हत्या के लिए दण्ड (धारा 103(2) के अंतर्गत मॉब लिंचिंग सहित)',
        description: 'जो कोई हत्या करेगा, वह मृत्युदण्ड या आजीवन कारावास से दण्डित किया जाएगा और जुर्माने से भी दण्डनीय होगा। उपधारा (2) के अनुसार यदि पांच या अधिक व्यक्तियों का समूह नस्ल, जाति, समुदाय, लिंग, जन्मस्थान, भाषा या व्यक्तिगत विश्वास के आधार पर हत्या (मॉब लिंचिंग) करता है, तो प्रत्येक सदस्य मृत्यु या आजीवन कारावास से दण्डनीय होगा।',
        punishment: 'मृत्युदण्ड या आजीवन कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 302 का स्थान लेता है और धारा 103(2) में भीड़ द्वारा हत्या (मॉब लिंचिंग) के लिए स्पष्ट रूप से मृत्युदण्ड या आजीवन कारावास निर्धारित करता है।'
      },
      te: {
        title: 'హత్యకు శిక్ష (సెక్షన్ 103(2) కింద మూక దాడి / మాబ్ లించింగ్‌తో సహా)',
        description: 'హత్య చేసిన వ్యక్తికి మరణశిక్ష లేదా జీవిత ఖైదు మరియు జరిమానా విధించబడుతుంది. ఉప-సెక్షన్ (2) ప్రకారం ఐదుగురు లేదా అంతకంటే ఎక్కువ మంది వ్యక్తుల సమూహం కులం, మతం, లింగం, భాష లేదా వ్యక్తిగత నమ్మకాల ఆధారంగా హత్య (మాబ్ లించింగ్) చేస్తే ప్రతి సభ్యుడికి మరణశిక్ష లేదా జీవిత ఖైదు విధించబడుతుంది.',
        punishment: 'మరణశిక్ష లేదా జీవిత ఖైదు + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్ 302 స్థానంలో వచ్చింది మరియు సెక్షన్ 103(2) కింద మూక హత్యలకు (Mob Lynching) మరణశిక్ష లేదా జీవిత ఖైదును నిర్దేశిస్తుంది.'
      },
      or: {
        title: 'ହତ୍ୟା ପାଇଁ ଦଣ୍ଡ (ଧାରା 103(2) ଅଧୀନରେ ଭିଡ଼ ହିଂସା / ମବ୍ ଲିଞ୍ଚିଂ ସହିତ)',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି ହତ୍ୟା କରେ, ତାକୁ ମୃତ୍ୟୁଦଣ୍ଡ କିମ୍ବା ଆଜୀବନ କାରାବାସ ଏବଂ ଜରିମାନାରେ ଦଣ୍ଡିତ କରାଯିବ। ଉପ-ଧାରା (୨) ଅନୁସାରେ ୫ ବା ତଦୂର୍ଦ୍ଧ୍ୱ ବ୍ୟକ୍ତିଙ୍କ ଗୋଷ୍ଠୀ ଜାତି, ଧର୍ମ, ଲିଙ୍ଗ, ଭାଷା ବା ବ୍ୟକ୍ତିଗତ ବିଶ୍ୱାସ ଆଧାରରେ ହତ୍ୟା କଲେ ପ୍ରତ୍ୟେକ ସଦସ୍ୟଙ୍କୁ ମୃତ୍ୟୁଦଣ୍ଡ ବା ଆଜୀବନ କାରାବାସ ହେବ।',
        punishment: 'ମୃତ୍ୟୁଦଣ୍ଡ କିମ୍ବା ଆଜୀବନ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 302 ର ସ୍ଥାନ ନିଏ ଏବଂ ଧାରା 103(2) ରେ ମବ୍ ଲିଞ୍ଚିଂ ପାଇଁ ସ୍ୱତନ୍ତ୍ର ଦଣ୍ଡବିଧାନ କରେ।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '105',
    ipcEquivalent: 'IPC Sec 304',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory FSL scene visit under Sec 176(3) BNSS and post-mortem report.',
    bsaAdmissibility: 'Forensic pathology opinion admissible under Sec 39 BSA (Expert Opinion).',
    ingredients: [
      'Culpable homicide not amounting to murder with intention of causing death/likely bodily injury',
      'Or act done with knowledge that it is likely to cause death but without intention'
    ],
    investigativeSteps: [
      'Obtain weapon-injury compatibility opinion from autopsy surgeon.',
      'Examine sudden provocation or heat-of-passion exceptions under Sec 101 BNS.'
    ],
    translations: {
      en: {
        title: 'Punishment for culpable homicide not amounting to murder',
        description: 'Whoever commits culpable homicide not amounting to murder, shall be punished with imprisonment for life, or imprisonment of either description for a term which shall not be less than five years but which may extend to ten years, and shall also be liable to fine.',
        punishment: 'Life Imprisonment or 5 to 10 years Imprisonment + Fine',
        aiCommentary: 'Introduces a minimum mandatory sentence of 5 years where intention is present, replacing IPC Section 304.'
      },
      hi: {
        title: 'हत्या की कोटि में न आने वाले आपराधिक मानव वध के लिए दण्ड',
        description: 'जो कोई हत्या की कोटि में न आने वाला आपराधिक मानव वध करेगा, वह आजीवन कारावास से, या कम से कम पांच वर्ष से दस वर्ष तक के कारावास और जुर्माने से दण्डित किया जाएगा।',
        punishment: 'आजीवन कारावास या 5 से 10 वर्ष का कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 304 का स्थान लेता है और न्यूनतम 5 वर्ष के कारावास की सीमा निर्धारित करता है।'
      },
      te: {
        title: 'హత్య కిందకు రాని నేరపూరిత నరహత్యకు శిక్ష',
        description: 'హత్య కిందకు రాని నేరపూరిత నరహత్య చేసిన వ్యక్తికి జీవిత ఖైదు లేదా కనీసం 5 నుండి 10 సంవత్సరాల వరకు జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది.',
        punishment: 'జీవిత ఖైదు లేదా 5 నుండి 10 సంవత్సరాల జైలు శిక్ష + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్ 304 స్థానంలో కనీసం 5 ఏళ్ల జైలు శిక్ష నిబంధనతో ప్రవేశపెట్టబడింది.'
      },
      or: {
        title: 'ହତ୍ୟା ପର୍ଯ୍ୟାୟଭୁକ୍ତ ନଥିବା ଅପରାଧିକ ମାନବ ବଧ ପାଇଁ ଦଣ୍ଡ',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି ହତ୍ୟା ପର୍ଯ୍ୟାୟଭୁକ୍ତ ନଥିବା ଅପରାଧିକ ମାନବ ବଧ କରେ, ତାକୁ ଆଜୀବନ କାରାବାସ କିମ୍ବା ୫ ରୁ ୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ଏବଂ ଜରିମାନା ହେବ।',
        punishment: 'ଆଜୀବନ କାରାବାସ କିମ୍ବା ୫ ରୁ ୧୦ ବର୍ଷ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 304 ବଦଳରେ ସର୍ବନିମ୍ନ ୫ ବର୍ଷ କାରାଦଣ୍ଡ ବ୍ୟବସ୍ଥା କରେ।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '106',
    ipcEquivalent: 'IPC Sec 304A',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Motor vehicle mechanical inspection, blood alcohol/toxicology test, and highway CCTV seizure.',
    bsaAdmissibility: 'ANPR camera timestamps and dashcam electronic records admissible under Sec 63 BSA.',
    ingredients: [
      'Causing death of any person by doing any rash or negligent act not amounting to culpable homicide',
      'Special provision for registered medical practitioners during medical procedures (up to 2 years)'
    ],
    investigativeSteps: [
      'Conduct mechanical inspection of offending vehicle through RTO Motor Vehicle Inspector.',
      'Collect ANPR / toll plaza CCTV footage and skid-mark measurements.'
    ],
    translations: {
      en: {
        title: 'Causing death by negligence',
        description: 'Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide, shall be punished with imprisonment of either description for a term which may extend to five years, and shall also be liable to fine; and if such act is done by a registered medical practitioner while performing medical procedure, up to two years and fine.',
        punishment: 'Imprisonment up to 5 years + Fine (Medical procedure negligence: up to 2 years + Fine)',
        aiCommentary: 'Enhances general punishment for fatal rash/negligent acts from 2 years (under old IPC 304A) to 5 years under BNS 106(1).'
      },
      hi: {
        title: 'उपेक्षा (लापरवाही) द्वारा मृत्यु कारित करना',
        description: 'जो कोई उतावलेपन या उपेक्षापूर्ण कार्य से किसी व्यक्ति की मृत्यु कारित करता है, वह पांच वर्ष तक के कारावास और जुर्माने से दण्डित किया जाएगा (चिकित्सीय प्रक्रिया के दौरान पंजीकृत चिकित्सक के लिए दो वर्ष तक कारावास और जुर्माना)।',
        punishment: '5 वर्ष तक का कारावास + जुर्माना (चिकित्सकीय लापरवाही: 2 वर्ष तक + जुर्माना)',
        aiCommentary: 'पुरानी आईपीसी धारा 304A में 2 वर्ष के दण्ड को बढ़ाकर बीएनएस धारा 106(1) में 5 वर्ष कर दिया गया है।'
      },
      te: {
        title: 'నిర్లక్ష్యం వల్ల మరణానికి కారణమవ్వడం',
        description: 'అజాగ్రత్త లేదా నిర్లక్ష్యపూరిత చర్య వల్ల ఎవరి మరణానికైనా కారణమైతే ఐదు సంవత్సరాల వరకు జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది (వైద్య ప్రక్రియలో రిజిస్టర్డ్ వైద్యుడికి 2 ఏళ్ల వరకు).',
        punishment: '5 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'పాత IPC 304A లో ఉన్న 2 ఏళ్ల శిక్షను BNS 106(1) లో 5 సంవత్సరాలకు పెంచారు.'
      },
      or: {
        title: 'ଅବହେଳା ଦ୍ୱାରା ମୃତ୍ୟୁ ଘଟାଇବା',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି ବେପରୁଆ କିମ୍ବା ଅବହେଳାପୂର୍ଣ୍ଣ କାର୍ଯ୍ୟ ଦ୍ୱାରା କୌଣସି ବ୍ୟକ୍ତିଙ୍କ ମୃତ୍ୟୁ ଘଟାଏ, ତାକୁ ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ଏବଂ ଜରିମାନା ହେବ (ପଞ୍ଜୀକୃତ ଡାକ୍ତରଙ୍କ କ୍ଷେତ୍ରରେ ୨ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ)।',
        punishment: '୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC 304A ର ୨ ବର୍ଷ ଦଣ୍ଡକୁ ବୃଦ୍ଧି କରି BNS 106(1) ରେ ୫ ବର୍ଷ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '109',
    ipcEquivalent: 'IPC Sec 307',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory FSL scene inspection under Sec 176(3) BNSS; weapon & bloodstain seizure.',
    bsaAdmissibility: 'Medico-Legal Certificate (MLC) and ballistic/weapon reports admissible under Sec 39 BSA.',
    ingredients: [
      'Doing any act with such intention or knowledge and under such circumstances that if it caused death, the offender would be guilty of murder',
      'Higher tier of punishment if hurt is actually caused to any person by such act'
    ],
    investigativeSteps: [
      'Obtain immediate Medico-Legal Certificate (MLC) classifying nature of injuries (simple/grievous/dangerous to life).',
      'Seize blood-stained clothes and weapon of offence under videographed panchnama (Sec 105 BNSS).'
    ],
    translations: {
      en: {
        title: 'Attempt to murder',
        description: 'Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder, shall be punished with imprisonment up to ten years and fine; and if hurt is caused to any person by such act, the offender shall be liable either to imprisonment for life, or to such punishment as is hereinbefore mentioned.',
        punishment: 'Up to 10 years Imprisonment + Fine; if hurt caused: Life Imprisonment or up to 10 years + Fine',
        aiCommentary: 'Corresponds to IPC Section 307. Intention is deduced from the nature of weapon used, vital body part targeted, and severity of blow.'
      },
      hi: {
        title: 'हत्या करने का प्रयत्न (जानलेवा हमला)',
        description: 'जो कोई ऐसे आशय या ज्ञान से और ऐसी परिस्थितियों में कोई कार्य करता है कि यदि उससे मृत्यु कारित हो जाती तो वह हत्या का दोषी होता, वह दस वर्ष तक के कारावास और जुर्माने से दण्डित किया जाएगा; और यदि उपहति (चोट) कारित होती है, तो आजीवन कारावास तक से दण्डनीय होगा।',
        punishment: '10 वर्ष तक कारावास + जुर्माना; चोट लगने पर आजीवन कारावास तक',
        aiCommentary: 'पुरानी आईपीसी धारा 307 के समतुल्य। प्रयुक्त हथियार और शरीर के मर्मस्थल पर प्रहार से आशय का निर्धारण होता है।'
      },
      te: {
        title: 'హత్యాయత్నం (Attempt to Murder)',
        description: 'మరణం సంభవిస్తే హత్య నేరమయ్యే ఉద్దేశ్యంతో లేదా జ్ఞానంతో ఏదైనా చర్య చేస్తే పదేళ్ల వరకు జైలు శిక్ష మరియు జరిమానా; ఆ చర్య వల్ల గాయం కలిగితే జీవిత ఖైదు వరకు శిక్ష విధించబడుతుంది.',
        punishment: '10 ఏళ్ల వరకు జైలు + జరిమానా; గాయం కలిగితే జీవిత ఖైదు వరకు',
        aiCommentary: 'పాత IPC సెక్షన్ 307 కు సమానం. ఉపయోగించిన ఆయుధం మరియు శరీరంలోని కీలక భాగంపై దాడి ఆధారంగా నేర తీవ్రత నిర్ధారించబడుతుంది.'
      },
      or: {
        title: 'ହତ୍ୟା ଉଦ୍ୟମ (Attempt to Murder)',
        description: 'ଯେଉଁ କାର୍ଯ୍ୟ ଦ୍ୱାରା ମୃତ୍ୟୁ ଘଟିଥିଲେ ବ୍ୟକ୍ତି ହତ୍ୟା ଦୋଷୀ ହୋଇଥାନ୍ତା, ସେଭଳି ଉଦ୍ଦେଶ୍ୟରେ କାର୍ଯ୍ୟ କଲେ ୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ଓ ଜରିମାନା; ଏବଂ ଆଘାତ ଲାଗିଥିଲେ ଆଜୀବନ କାରାବାସ ପର୍ଯ୍ୟନ୍ତ ଦଣ୍ଡ ହେବ।',
        punishment: '୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା; ଆଘାତ ଲାଗିଥିଲେ ଆଜୀବନ କାରାବାସ ପର୍ଯ୍ୟନ୍ତ',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 307 ସହ ସମାନ। ବ୍ୟବହୃତ ମାରଣାସ୍ତ୍ର ଓ ଆଘାତର ସ୍ଥାନରୁ ହତ୍ୟା ଉଦ୍ଦେଶ୍ୟ ପ୍ରମାଣିତ ହୁଏ।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '111',
    ipcEquivalent: 'New Provision in BNS 2023 (MCOCA / GujCTOC Model)',
    category: 'Organised Crime & National Security',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Attachment and forfeiture of proceeds of crime under Sec 107 BNSS; mandatory FSL involvement.',
    bsaAdmissibility: 'Electronic intercepts, hawala/crypto ledgers, and syndicate charge-sheets admissible under BSA.',
    ingredients: [
      'Continuing unlawful activity including kidnapping, robbery, vehicle theft, extortion, land grabbing, contract killing, economic offences, cyber-crimes with severe consequences, trafficking',
      'Committed by a group of individuals acting in concert (singly or jointly) as member or on behalf of an organised crime syndicate using violence, threat, intimidation, or coercion'
    ],
    investigativeSteps: [
      'Verify history of 2 or more charge-sheets filed against the syndicate within the preceding 10 years.',
      'Initiate attachment of syndicate properties and bank accounts under Sec 107 BNSS.'
    ],
    translations: {
      en: {
        title: 'Organised crime',
        description: 'Any continuing unlawful activity including kidnapping, robbery, vehicle theft, extortion, land grabbing, contract killing, economic offence, cyber-crimes having severe consequences, trafficking in persons, drugs, weapons or illicit goods or services, by any person or group of persons acting in concert, singly or jointly, either as a member of an organised crime syndicate or on behalf of such syndicate.',
        punishment: 'If death caused: Death or Life Imprisonment + Min Rs 10 Lakh Fine; Other cases: 5 years to Life Imprisonment + Min Rs 5 Lakh Fine',
        aiCommentary: 'Pan-India statutory provision against mafia syndicates, contract killing gangs, and organised cyber-extortion networks.'
      },
      hi: {
        title: 'संगठित अपराध (Organised Crime)',
        description: 'अपहरण, लूट, वाहन चोरी, जबरन वसूली (रंगदारी), भूमि हड़पना, सुपारी किलिंग, आर्थिक अपराध, गंभीर परिणाम वाले साइबर अपराध, मानव/मादक पदार्थ/हथियार तस्करी सहित कोई भी सतत विधिविरुद्ध क्रियाकलाप जो संगठित अपराध सिंडिकेट के सदस्य के रूप में या उसकी ओर से हिंसा या धमकी द्वारा किया जाता है।',
        punishment: 'मृत्यु होने पर: मृत्युदण्ड या आजीवन कारावास + न्यूनतम 10 लाख रु. जुर्माना; अन्य मामलों में: 5 वर्ष से आजीवन कारावास + न्यूनतम 5 लाख रु. जुर्माना',
        aiCommentary: 'माफिया गिरोहों, सुपारी किलर्स और संगठित साइबर अपराध सिंडिकेट के विरुद्ध अखिल भारतीय स्तर पर बनाया गया नया सख्त कानून।'
      },
      te: {
        title: 'వ్యవస్థీకృత నేరం (Organised Crime)',
        description: 'కిడ్నాప్, దోపిడీ, వాహనాల దొంగతనం, బలవంతపు వసూళ్లు, భూకబ్జా, సుపారీ హత్యలు, ఆర్థిక నేరాలు, తీవ్రమైన సైబర్ నేరాలు, మానవ/డ్రగ్స్/ఆయుధాల అక్రమ రవాణా వంటి నిరంతర చట్టవిరుద్ధ కార్యకలాపాలను ముఠాగా లేదా సిండికేట్ తరపున చేయడం వ్యవస్థీకృత నేరం.',
        punishment: 'మరణం సంభవిస్తే: మరణశిక్ష లేదా జీవిత ఖైదు + కనీసం రూ. 10 లక్షల జరిమానా; ఇతర కేసుల్లో: 5 ఏళ్ల నుండి జీవిత ఖైదు + కనీసం రూ. 5 లక్షల జరిమానా',
        aiCommentary: 'మాఫియా సిండికేట్లు మరియు వ్యవస్థీకృత సైబర్ నేర ముఠాలపై దేశవ్యాప్తంగా వర్తించేలా BNS 2023లో తెచ్చిన కొత్త సెక్షన్.'
      },
      or: {
        title: 'ସଂଗଠିତ ଅପରାଧ (Organised Crime)',
        description: 'ଅପହରଣ, ଡକାୟତି, ଯାନବାହନ ଚୋରି, ବଟି ଆଦାୟ, ଜମି ହଡ଼ପ, ସୁପାରୀ କିଲିଂ, ଆର୍ଥିକ ଅପରାଧ, ଗୁରୁତର ସାଇବର ଅପରାଧ, ମାନବ/ଡ୍ରଗ୍ସ/ଅସ୍ତ୍ରଶସ୍ତ୍ର ଚାଲାଣ ଆଦି କୌଣସି ସଂଗଠିତ ଅପରାଧ ସିଣ୍ଡିକେଟ୍ ଦ୍ୱାରା କରାଗଲେ ତାହା ସଂଗଠିତ ଅପରାଧ ଅଟେ।',
        punishment: 'ମୃତ୍ୟୁ ଘଟିলে: ମୃତ୍ୟୁଦଣ୍ଡ ବା ଆଜୀବନ କାରାବାସ + ସର୍ବନିମ୍ନ ୧୦ ଲକ୍ଷ ଟଙ୍କା ଜରିମାନା; ଅନ୍ୟ କ୍ଷେତ୍ରରେ: ୫ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ + ସର୍ବନିମ୍ନ ୫ ଲକ୍ଷ ଟଙ୍କା ଜରିମାନା',
        aiCommentary: 'ମାଫିଆ ଗ୍ୟାଙ୍ଗ୍ ଏବଂ ସଂଗଠିତ ସାଇବର ଅପରାଧ ସିଣ୍ଡିକେଟ୍ ବିରୁଦ୍ଧରେ BNS ୨୦୨୩ ର ଏକ ଶକ୍ତିଶାଳୀ ନୂତନ ଧାରା।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '112',
    ipcEquivalent: 'New Provision in BNS 2023',
    category: 'Organised Crime & National Security',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Applicable to mobile gangs involved in pickpocketing, ATM theft, exam paper leaks, and ticket black-marketing.',
    bsaAdmissibility: 'CCTV footage, gang communication records, and seized contraband admissible under BSA.',
    ingredients: [
      'Being a member of a group or gang, singly or jointly, committing theft, snatching, cheating, unauthorized selling of tickets, unauthorized betting/gambling, or selling of public examination question papers'
    ],
    investigativeSteps: [
      'Establish group/gang linkage of suspects across multiple FIRs.',
      'Seize electronic devices, stolen articles, or leaked examination materials.'
    ],
    translations: {
      en: {
        title: 'Petty organised crime',
        description: 'Whoever, being a member of a group or gang, either singly or jointly, commits any act of theft, snatching, cheating, unauthorised selling of tickets, unauthorised betting or gambling, selling of public examination question papers or any other similar criminal act, is said to commit petty organised crime.',
        punishment: 'Imprisonment from 1 year to 7 years + Fine',
        aiCommentary: 'Specifically targets organized street gangs, snatching rings, ticket touts, and public exam paper leak rackets.'
      },
      hi: {
        title: 'छोटा संगठित अपराध (Petty Organised Crime)',
        description: 'जो कोई किसी समूह या गिरोह का सदस्य होते हुए चोरी, झपटमारी, छल, टिकटों की अनधिकृत बिक्री, अनधिकृत सट्टेबाजी/जुआ, या सार्वजनिक परीक्षा के प्रश्नपत्रों की बिक्री जैसा अपराध करता है, वह छोटा संगठित अपराध करता है।',
        punishment: '1 वर्ष से 7 वर्ष तक का कारावास + जुर्माना',
        aiCommentary: 'झपटमार गिरोहों, जेबकतरों के सिंडिकेट और प्रतियोगी परीक्षाओं के पेपर लीक गिरोहों पर सीधी कार्यवाही के लिए नई धारा।'
      },
      te: {
        title: 'చిన్న తరహా వ్యవస్థీకృత నేరం (Petty Organised Crime)',
        description: 'ఏదైనా ముఠా లేదా గ్యాంగ్ సభ్యుడిగా ఉంటూ దొంగతనం, చైన్ స్నాచింగ్, మోసం, అనధికారిక టికెట్ల విక్రయం, బెట్టింగ్ లేదా ప్రభుత్వ పరీక్షల ప్రశ్నాపత్రాల లీకేజీ/విక్రయం వంటి నేరాలకు పాల్పడితే చిన్న తరహా వ్యవస్థీకృత నేరంగా పరిగణించబడుతుంది.',
        punishment: '1 నుండి 7 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'స్నాచింగ్ గ్యాంగ్‌లు మరియు పరీక్షా పేపర్ల లీకేజీ ముఠాలను అరికట్టడానికి తెచ్చిన ప్రత్యేక సెక్షన్.'
      },
      or: {
        title: 'କ୍ଷୁଦ୍ର ସଂଗଠିତ ଅପରାଧ (Petty Organised Crime)',
        description: 'କୌଣସି ଗୋଷ୍ଠୀ ବା ଗ୍ୟାଙ୍ଗର ସଦସ୍ୟ ଭାବେ ଚୋରି, ଛିନତାଇ, ଠକେଇ, ବେଆଇନ ଟିକେଟ୍ ବିକ୍ରି, ଜୁଆ କିମ୍ବା ସରକାରୀ ପରୀକ୍ଷା ପ୍ରଶ୍ନପତ୍ର ବିକ୍ରି/ଲିକ୍ କରିବା କ୍ଷୁଦ୍ର ସଂଗଠିତ ଅପରାଧ ଅଟେ।',
        punishment: '୧ ବର୍ଷରୁ ୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ଛିନତାଇ ଗ୍ୟାଙ୍ଗ୍ ଏବଂ ପରୀକ୍ଷା ପ୍ରଶ୍ନପତ୍ର ଲିକ୍ ମାଫିଆଙ୍କ ବିରୁଦ୍ଧରେ BNS ୨୦୨୩ ର ଏକ ନୂତନ ଧାରା।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '113',
    ipcEquivalent: 'New in BNS 2023 (Aligned with UAPA Sec 15)',
    category: 'Organised Crime & National Security',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session / Special Court',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Officer not below the rank of Superintendent of Police (SP) must decide whether to register case under BNS Sec 113 or UAPA.',
    bsaAdmissibility: 'Forensic explosive analysis, encrypted telemetry, and terror financing trails admissible under BSA.',
    ingredients: [
      'Act with intent to threaten unity, integrity, sovereignty, security, or economic security of India',
      'Use of bombs, dynamite, firearms, lethal weapons, hazardous chemicals/biological substances, or damage to critical infrastructure / currency counterfeiting'
    ],
    investigativeSteps: [
      'Obtain statutory decision from Superintendent of Police (SP) under Sec 113 Explanation before registration.',
      'Engage Bomb Disposal / FSL and freeze terror-linked assets under Sec 107 BNSS.'
    ],
    translations: {
      en: {
        title: 'Terrorist act',
        description: 'Whoever does any act with the intent to threaten or likely to threaten the unity, integrity, sovereignty, security, or economic security of India or with the intent to strike terror or likely to strike terror in the people in India or in any foreign country using bombs, explosives, firearms, or damaging critical infrastructure.',
        punishment: 'If death results: Death or Life Imprisonment + Fine; Other cases: 5 years to Life Imprisonment + Fine',
        aiCommentary: 'Brings terrorism directly into the general penal code (BNS 2023). Requires SP-level authorization on whether to proceed under BNS 113 or UAPA.'
      },
      hi: {
        title: 'आतंकवादी कृत्य (Terrorist Act)',
        description: 'जो कोई भारत की एकता, अखंडता, संप्रभुता, सुरक्षा या आर्थिक सुरक्षा को संकट में डालने या जनता में आतंक फैलाने के आशय से बम, विस्फोटक, आग्नेयास्त्र या घातक पदार्थों का उपयोग करता है, वह आतंकवादी कृत्य करता है।',
        punishment: 'मृत्यु होने पर: मृत्युदण्ड या आजीवन कारावास + जुर्माना; अन्य मामलों में: 5 वर्ष से आजीवन कारावास + जुर्माना',
        aiCommentary: 'आतंकवाद को सामान्य दण्ड संहिता में शामिल करता है। पुलिस अधीक्षक (SP) स्तर के अधिकारी द्वारा निर्णय लिया जाता है कि मामला BNS 113 में चलेगा या UAPA में।'
      },
      te: {
        title: 'ఉగ్రవాద చర్య (Terrorist Act)',
        description: 'భారతదేశ ఐక్యత, సమగ్రత, సార్వభౌమాధికారం, భద్రత లేదా ఆర్థిక భద్రతకు ముప్పు కలిగించే ఉద్దేశ్యంతో లేదా ప్రజల్లో భయాందోళనలు సృష్టించడానికి బాంబులు, పేలుడు పదార్థాలు, తుపాకులు ఉపయోగించే చర్య ఉగ్రవాద చర్య అవుతుంది.',
        punishment: 'మరణం సంభవిస్తే: మరణశిక్ష లేదా జీవిత ఖైదు + జరిమానా; ఇతర కేసుల్లో: 5 ఏళ్ల నుండి జీవిత ఖైదు + జరిమానా',
        aiCommentary: 'ఉగ్రవాద చర్యను ప్రధాన చట్టంలో చేర్చారు. SP స్థాయి అధికారి అనుమతితో ఈ సెక్షన్ లేదా UAPA కింద కేసు నమోదు చేస్తారు.'
      },
      or: {
        title: 'ଆତଙ୍କବାଦୀ କାର୍ଯ୍ୟ (Terrorist Act)',
        description: 'ଭାରତର ଏକତା, ଅଖଣ୍ଡତା, ସାର୍ବଭୌମତ୍ୱ, ସୁରକ୍ଷା କିମ୍ବା ଆର୍ଥିକ ସୁରକ୍ଷା ପ୍ରତି ବିପଦ ସୃଷ୍ଟି କରିବା କିମ୍ବା ଲୋକଙ୍କ ମନରେ ଆତଙ୍କ ସୃଷ୍ଟି କରିବା ଉଦ୍ଦେଶ୍ୟରେ ବୋମା, ବିସ୍ଫୋରକ ବା ଆଗ୍ନେୟାସ୍ତ୍ର ବ୍ୟବହାର କରିବା ଆତଙ୍କବାଦୀ କାର୍ଯ୍ୟ ଅଟେ।',
        punishment: 'ମୃତ୍ୟୁ ଘଟିলে: ମୃତ୍ୟୁଦଣ୍ଡ ବା ଆଜୀବନ କାରାବାସ + ଜରିମାନା; ଅନ୍ୟ କ୍ଷେତ୍ରରେ: ୫ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ଆତଙ୍କବାଦକୁ ମୁଖ୍ୟ ଦଣ୍ଡ ସଂହିତାରେ ଅନ୍ତର୍ଭୁକ୍ତ କରାଯାଇଛି। SP ସ୍ତରୀୟ ଅଧିକାରୀଙ୍କ ନିଷ୍ପତ୍ତି କ୍ରମେ ମାମଲା ରୁଜୁ ହୁଏ।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '115',
    ipcEquivalent: 'IPC Sec 321 / 323',
    category: 'Offences Affecting Human Body',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Medical examination of injured victim and entry in Non-Cognizable Register (or FIR if clubbed with cognizable offence under Sec 174(4) BNSS).',
    bsaAdmissibility: 'Wound certificate / MLC admissible as medical evidence.',
    ingredients: [
      'Doing any act with the intention of thereby causing bodily pain, disease or infirmity to any person',
      'Or with the knowledge that he is likely thereby to cause hurt to any person'
    ],
    investigativeSteps: [
      'Refer injured complainant for immediate Medico-Legal Examination.',
      'Check if dangerous weapon was used (which upgrades offence to Cognizable under Sec 118 BNS).'
    ],
    translations: {
      en: {
        title: 'Voluntarily causing hurt',
        description: 'Whoever does any act with the intention of thereby causing hurt to any person, or with the knowledge that he is likely thereby to cause hurt to any person, and does thereby cause hurt to any person, is said "voluntarily to cause hurt".',
        punishment: 'Imprisonment up to 1 year, or Fine up to Rs 10,000, or both',
        aiCommentary: 'Increases maximum fine from Rs 1,000 (under old IPC 323) to Rs 10,000 under BNS 115(2).'
      },
      hi: {
        title: 'स्वेच्छया उपहति (चोट) कारित करना',
        description: 'जो कोई किसी व्यक्ति को उपहति कारित करने के आशय से या यह जानते हुए कि उससे उपहति कारित होना संभाव्य है, कोई कार्य करता है और उपहति कारित करता है, वह एक वर्ष तक के कारावास या दस हजार रुपये तक के जुर्माने या दोनों से दण्डित किया जाएगा।',
        punishment: '1 वर्ष तक का कारावास, या 10,000 रु. तक जुर्माना, या दोनों',
        aiCommentary: 'पुरानी आईपीसी धारा 323 में 1,000 रु. के जुर्माने को बढ़ाकर 10,000 रु. कर दिया गया है।'
      },
      te: {
        title: 'ఉద్దేశపూర్వకంగా గాయపరచడం (Voluntarily causing hurt)',
        description: 'ఎవరికైనా గాయం కలిగించే ఉద్దేశ్యంతో లేదా గాయం కలుగుతుందని తెలిసి దాడి చేసి గాయపరిస్తే ఒక సంవత్సరం వరకు జైలు శిక్ష లేదా రూ. 10,000 వరకు జరిమానా లేదా రెండూ విధించబడతాయి.',
        punishment: '1 సంవత్సరం వరకు జైలు శిక్ష లేదా రూ. 10,000 వరకు జరిమానా లేదా రెండూ',
        aiCommentary: 'పాత IPC సెక్షన్ 323 స్థానంలో జరిమానాను రూ. 10,000 కు పెంచారు.'
      },
      or: {
        title: 'ସ୍ୱେଚ୍ଛାକୃତ ଭାବେ ଆଘାତ ଦେବା (Voluntarily causing hurt)',
        description: 'କୌଣସି ବ୍ୟକ୍ତିଙ୍କୁ ଆଘାତ ଦେବା ଉଦ୍ଦେଶ୍ୟରେ କାର୍ଯ୍ୟ କରି ଶାରୀରିକ ଯନ୍ତ୍ରଣା ବା ଆଘାତ ଦେଲେ ୧ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ କିମ୍ବା ୧୦,୦୦୦ ଟଙ୍କା ପର୍ଯ୍ୟନ୍ତ ଜରିମାନା ବା ଉଭୟ ଦଣ୍ଡ ହେବ।',
        punishment: '୧ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ, କିମ୍ବା ୧୦,୦୦୦ ଟଙ୍କା ଜରିମାନା, କିମ୍ବା ଉଭୟ',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 323 ବଦଳରେ ଜରିମାନା ରାଶି ୧୦,୦୦୦ ଟଙ୍କାକୁ ବୃଦ୍ଧି କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '117',
    ipcEquivalent: 'IPC Sec 322 / 325',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate (Court of Session for permanent disability)',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Radiological X-Ray/CT scan report required to confirm fracture/dislocation or 15-day severe bodily pain (reduced from 20 days in IPC).',
    bsaAdmissibility: 'Radiologist report and hospital admission records admissible under BSA.',
    ingredients: [
      'Voluntarily causing grievous hurt (fracture, loss of sight/hearing, emasculation, permanent disfiguration, or 15 days severe bodily pain under Sec 116 BNS)',
      'Enhanced punishment under Sec 117(3) if victim suffers permanent disability or persistent vegetative state'
    ],
    investigativeSteps: [
      'Obtain final medical opinion with X-Ray/CT plates confirming grievous hurt under Sec 116 BNS.',
      'Note that BNS reduces the severe bodily pain threshold from 20 days (IPC) to 15 days.'
    ],
    translations: {
      en: {
        title: 'Voluntarily causing grievous hurt',
        description: 'Whoever voluntarily causes grievous hurt shall be punished with imprisonment up to seven years and fine. If such grievous hurt causes permanent disability or persistent vegetative state, punished with rigorous imprisonment not less than ten years up to imprisonment for life.',
        punishment: 'Up to 7 years Imprisonment + Fine (Permanent vegetative state/disability: 10 years RI to Life)',
        aiCommentary: 'Reduces the hospitalization/pain threshold for Grievous Hurt from 20 days to 15 days and adds severe penalties for causing vegetative state or mob-inflicted grievous hurt.'
      },
      hi: {
        title: 'स्वेच्छया घोर उपहति (गंभीर चोट) कारित करना',
        description: 'जो कोई स्वेच्छया घोर उपहति कारित करेगा, वह सात वर्ष तक के कारावास और जुर्माने से दण्डित किया जाएगा। यदि इससे स्थायी दिव्यांगता या कोमा (निष्क्रिय अवस्था) होती है, तो न्यूनतम 10 वर्ष से आजीवन कठोर कारावास तक का दण्ड होगा।',
        punishment: '7 वर्ष तक कारावास + जुर्माना (स्थायी विकलांगता/कोमा: 10 वर्ष से आजीवन कारावास)',
        aiCommentary: 'बीएनएस में गंभीर शारीरिक पीड़ा की अवधि को 20 दिन (आईपीसी) से घटाकर 15 दिन कर दिया गया है।'
      },
      te: {
        title: 'ఉద్దేశపూర్వకంగా తీవ్రమైన గాయం (Grievous Hurt) కలిగించడం',
        description: 'ఎవరైనా ఉద్దేశపూర్వకంగా తీవ్రమైన గాయం (ఎముక విరగడం, చూపు/వినికిడి కోల్పోవడం లేదా 15 రోజుల తీవ్ర నొప్పి) కలిగిస్తే 7 ఏళ్ల వరకు జైలు శిక్ష మరియు జరిమానా; శాశ్వత వైకల్యం లేదా కోమాలోకి వెళ్తే 10 ఏళ్ల నుండి జీవిత ఖైదు విధించబడుతుంది.',
        punishment: '7 ఏళ్ల వరకు జైలు శిక్ష + జరిమానా (శాశ్వత వైకల్యం: 10 ఏళ్ల నుండి జీవిత ఖైదు)',
        aiCommentary: 'తీవ్రమైన శారీరక బాధ గడువును పాత IPC లోని 20 రోజుల నుండి BNS లో 15 రోజులకు తగ్గించారు.'
      },
      or: {
        title: 'ସ୍ୱେଚ୍ଛାକୃତ ଭାବେ ଗୁରୁତର ଆଘାତ (Grievous Hurt) ଦେବା',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି ସ୍ୱେଚ୍ଛାକୃତ ଭାବେ ଗୁରୁତର ଆଘାତ (ହାଡ଼ ଭାଙ୍ଗିବା, ଦୃଷ୍ଟି/ଶ୍ରବଣ ଶକ୍ତି ହରାଇବା ବା ୧୫ ଦିନ তীব্র ଯନ୍ତ୍ରଣା) ଦିଏ, ତାକୁ ୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ଓ ଜରିମାନା; ସ୍ଥାୟୀ ଅକ୍ଷମତା କିମ୍ବା କୋମା ହେଲେ ୧୦ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ ହେବ।',
        punishment: '୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା (ସ୍ଥାୟୀ ଅକ୍ଷମତା: ୧୦ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ)',
        aiCommentary: 'ଗୁରୁତର ଶାରୀରିକ ଯନ୍ତ୍ରଣାର ସମୟସୀମାକୁ ପୁରୁଣା IPC ର ୨୦ ଦିନରୁ BNS ରେ ୧୫ ଦିନକୁ ହ୍ରାସ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '118',
    ipcEquivalent: 'IPC Sec 324 / 326',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class / Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Weapon seizure and FSL serology/DNA examination mandatory.',
    bsaAdmissibility: 'Recovery of weapon pursuant to disclosure statement admissible under Sec 23 BSA.',
    ingredients: [
      'Voluntarily causing hurt (Sec 118(1)) or grievous hurt (Sec 118(2)) by means of any instrument for shooting, stabbing or cutting, or any weapon likely to cause death, or fire, poison, corrosive or explosive substance'
    ],
    investigativeSteps: [
      'Seize and seal the dangerous weapon (knife, firearm, iron rod, corrosive agent) with videography under Sec 105 BNSS.',
      'Obtain doctor opinion on whether the seized weapon could cause the observed injuries.'
    ],
    translations: {
      en: {
        title: 'Voluntarily causing hurt or grievous hurt by dangerous weapons or means',
        description: 'Whoever voluntarily causes hurt or grievous hurt by means of any instrument for shooting, stabbing or cutting, or any instrument which, used as a weapon of offence, is likely to cause death, or by means of fire, poison, corrosive or explosive substance.',
        punishment: 'Hurt (Sec 118(1)): Up to 3 years or Rs 20,000 fine; Grievous Hurt (Sec 118(2)): Life Imprisonment or 1 to 10 years + Fine',
        aiCommentary: 'Combines IPC 324 (hurt by dangerous weapon) and IPC 326 (grievous hurt by dangerous weapon) into one unified section.'
      },
      hi: {
        title: 'खतरनाक आयुधों या साधनों द्वारा स्वेच्छया उपहति या घोर उपहति कारित करना',
        description: 'जो कोई गोली मारने, चाकू भोंकने या काटने के किसी उपकरण, या मृत्यु कारित करने की संभावना वाले किसी घातक हथियार, या आग, विष, संक्षारक या विस्फोटक पदार्थ द्वारा उपहति या घोर उपहति कारित करता है।',
        punishment: 'साधारण चोट (118(1)): 3 वर्ष तक कारावास; गंभीर चोट (118(2)): आजीवन कारावास या 1 से 10 वर्ष + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 324 और 326 को एक ही धारा में समेकित करता है। हथियार की जब्ती और फॉरेंसिक मिलान अनिवार्य है।'
      },
      te: {
        title: 'ప్రమాదకరమైన ఆయుధాలు లేదా సాధనాలతో గాయం లేదా తీవ్ర గాయం కలిగించడం',
        description: 'కాల్చడానికి, పొడవడానికి లేదా కోయడానికి ఉపయోగించే ఆయుధం, లేదా ప్రాణాంతక ఆయుధం, అగ్ని, విషం, పేలుడు పదార్థాల ద్వారా గాయం లేదా తీవ్రమైన గాయం కలిగించడం.',
        punishment: 'సాధారణ గాయం (118(1)): 3 ఏళ్ల వరకు జైలు; తీవ్ర గాయం (118(2)): జీవిత ఖైదు లేదా 1 నుండి 10 ఏళ్ల జైలు + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్లు 324 మరియు 326 లను కలిపి ఒకే సెక్షన్‌గా రూపొందించారు.'
      },
      or: {
        title: 'ବିପଜ୍ଜନକ ମାରଣାସ୍ତ୍ର କିମ୍ବା ମାଧ୍ୟମ ଦ୍ୱାରା ଆଘାତ ବା ଗୁରୁତର ଆଘାତ ଦେବା',
        description: 'ବନ୍ଧୁକ, ଛୁରୀ, ଧାରୁଆ ଅସ୍ତ୍ର, ନିଆଁ, ବିଷ କିମ୍ବା ବିସ୍ଫୋରକ ପଦାର୍ଥ ଭଳି ମାରাত্মক ଅସ୍ତ୍ର ଦ୍ୱାରା ଆଘାତ କିମ୍ବା ଗୁରୁତର ଆଘାତ ଦେବା।',
        punishment: 'ସାଧାରଣ ଆଘାତ (118(1)): ୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍; ଗୁରୁତର ଆଘାତ (118(2)): ଆଜୀବନ କାରାବାସ ବା ୧ ରୁ ୧୦ ବର୍ଷ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 324 ଏବଂ 326 କୁ ଗୋଟିଏ ଧାରାରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '124',
    ipcEquivalent: 'IPC Sec 326A / 326B',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Immediate free medical treatment to victim under Sec 397 BNSS; mandatory FSL chemical analysis.',
    bsaAdmissibility: 'Chemical examiner report and hospital burn records admissible under Sec 39 BSA.',
    ingredients: [
      'Causing permanent or partial damage, deformity, burns, maiming, disfigurement or disability by throwing or administering acid',
      'Sub-section (2) covers attempt to throw or administer acid (5 to 7 years RI)'
    ],
    investigativeSteps: [
      'Ensure immediate free medical treatment at any public or private hospital under Sec 397 BNSS.',
      'Trace source of acid purchase and collect chemical swabs from scene and clothing.'
    ],
    translations: {
      en: {
        title: 'Voluntarily causing grievous hurt by use of acid, etc.',
        description: 'Whoever causes permanent or partial damage or deformity to, or burns or maims or disfigures or disables, any part or parts of the body of a person by throwing acid on or by administering acid to that person. Fine shall be just and reasonable to meet medical expenses and paid to the victim.',
        punishment: 'Minimum 10 years RI extendable to Life Imprisonment + Fine paid to victim (Attempt: 5 to 7 years RI)',
        aiCommentary: 'Mandates that the fine imposed is paid directly to the victim to cover reconstructive medical expenses alongside free treatment under Sec 397 BNSS.'
      },
      hi: {
        title: 'अम्ल (एसिड) आदि के प्रयोग द्वारा स्वेच्छया घोर उपहति कारित करना',
        description: 'जो कोई किसी व्यक्ति पर अम्ल (एसिड) फेंककर या देकर उसके शरीर के किसी भाग को स्थायी या आंशिक क्षति, विरूपता या जलन कारित करता है, वह कम से कम 10 वर्ष से आजीवन कारावास और जुर्माने (जो पीड़िता को चिकित्सा व्यय हेतु दिया जाएगा) से दण्डनीय होगा।',
        punishment: 'न्यूनतम 10 वर्ष से आजीवन कारावास + पीड़िता को देय जुर्माना (प्रयत्न: 5 से 7 वर्ष कारावास)',
        aiCommentary: 'बीएनएसएस धारा 397 के अंतर्गत सभी सरकारी व निजी अस्पतालों में पीड़िता का निःशुल्क तुरंत उपचार अनिवार्य है।'
      },
      te: {
        title: 'యాసిడ్ దాడి ద్వారా తీవ్రమైన గాయం కలిగించడం',
        description: 'ఎవరిపైనైనా యాసిడ్ పోయడం ద్వారా శరీర భాగాలకు శాశ్వత లేదా పాక్షిక నష్టం, కాలిన గాయాలు లేదా వికలాంగత్వం కలిగిస్తే కనీసం 10 ఏళ్ల నుండి జీవిత ఖైదు మరియు బాధితురాలి వైద్య ఖర్చుల నిమిత్తం జరిమానా విధించబడుతుంది.',
        punishment: 'కనీసం 10 ఏళ్ల నుండి జీవిత ఖైదు + బాధితురాలికి జరిమానా చెల్లింపు (ప్రయత్నం: 5 నుండి 7 ఏళ్లు)',
        aiCommentary: 'BNSS సెక్షన్ 397 ప్రకారం బాధితులకు ప్రభుత్వ లేదా ప్రైవేట్ ఆసుపత్రుల్లో ఉచిత తక్షణ వైద్యం అందించాలి.'
      },
      or: {
        title: 'ଏସିଡ୍ (ଅମ୍ଳ) ପ୍ରୟୋଗ ଦ୍ୱାରା ଗୁରୁତର ଆଘାତ ଦେବା',
        description: 'କୌଣସି ବ୍ୟକ୍ତିଙ୍କ ଉପରେ ଏସିଡ୍ ଫିଙ୍ଗି ଶରୀରର କୌଣସି ଅଂଶକୁ ସ୍ଥାୟୀ ବା ଆଂଶିକ କ୍ଷତି, ପୋଡ଼ା ବା ବିକୃତି ଘଟାଇଲେ ଅତି କମରେ ୧୦ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ ଏବଂ ପୀଡ଼ିତାଙ୍କ ଚିକିତ୍ସା ପାଇଁ ଜରିମାନା ହେବ।',
        punishment: 'ସର୍ବନିମ୍ନ ୧୦ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ + ପୀଡ଼ିତାଙ୍କୁ ଜରିମାନା ପ୍ରଦାନ (ଉଦ୍ୟମ: ୫ ରୁ ୭ ବର୍ଷ)',
        aiCommentary: 'BNSS ଧାରା ୩୯୭ ଅନୁযାୟୀ ପୀଡ଼ିତାଙ୍କୁ ସମସ୍ତ ସରକାରୀ ଓ ବେସରକାରୀ ଡାକ୍ତରଖାନାରେ ମାଗଣା ତୁରନ୍ତ ଚିକିତ୍ସା ବାଧ୍ୟତାମୂଳକ।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '140',
    ipcEquivalent: 'IPC Sec 364 / 364A / 365',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Immediate cell-tower triangulation, ransom call interception, and FSL involvement.',
    bsaAdmissibility: 'Voice spectrography of ransom calls and CDR location logs admissible under Sec 39 & 63 BSA.',
    ingredients: [
      'Kidnapping or abducting in order to murder (Sec 140(1))',
      'Kidnapping or abducting for ransom, etc., causing reasonable apprehension of death or hurt (Sec 140(2))'
    ],
    investigativeSteps: [
      'Activate real-time CDR/IMEI location tracking and preserve ransom demand voice recordings.',
      'Coordinate inter-district/inter-state wireless alert and ANPR highway tracking.'
    ],
    translations: {
      en: {
        title: 'Kidnapping or abducting in order to murder or for ransom, etc.',
        description: 'Consolidates aggravated kidnapping offences: (1) Kidnapping/abducting in order to murder; (2) Kidnapping/abducting for ransom or to compel any person or Government to do or abstain from doing any act; (3) Kidnapping with intent secretly and wrongfully to confine.',
        punishment: 'For Ransom (Sec 140(2)): Death Penalty or Life Imprisonment + Fine; To Murder (140(1)): Life or up to 10 years RI',
        aiCommentary: 'Unifies IPC Sections 364, 364A, and 365 into a structured multi-tier provision for high-priority abduction cases.'
      },
      hi: {
        title: 'हत्या करने या फिरौती आदि के लिए व्यपहरण या अपहरण (Kidnapping for Ransom)',
        description: 'गंभीर अपहरण अपराधों को समेकित करता है: (1) हत्या करने के लिए अपहरण; (2) फिरौती या किसी कार्य को करने हेतु बाध्य करने के लिए अपहरण; (3) गुप्त रूप से सदोष परिरोध करने के आशय से अपहरण।',
        punishment: 'फिरौती हेतु अपहरण (140(2)): मृत्युदण्ड या आजीवन कारावास + जुर्माना; हत्या हेतु (140(1)): आजीवन कारावास या 10 वर्ष तक',
        aiCommentary: 'पुरानी आईपीसी की धाराओं 364, 364A और 365 को एक ही व्यापक धारा में समाहित किया गया है।'
      },
      te: {
        title: 'హత్య చేయడానికి లేదా విమోచన క్రయధనం (Ransom) కోసం కిడ్నాప్/అపహరణ',
        description: 'హత్య చేసే ఉద్దేశ్యంతో కిడ్నాప్ చేయడం (140(1)) లేదా డబ్బు (Ransom) కోసం బెదిరించి కిడ్నాప్ చేయడం (140(2)) మరియు రహస్యంగా బంధించడం (140(3)) ఈ సెక్షన్ కిందకు వస్తాయి.',
        punishment: 'రాన్సమ్ కిడ్నాప్ (140(2)): మరణశిక్ష లేదా జీవిత ఖైదు + జరిమానా; హత్య కోసం (140(1)): జీవిత ఖైదు లేదా 10 ఏళ్ల కఠిన కారాగార శిక్ష',
        aiCommentary: 'పాత IPC సెక్షన్లు 364, 364A మరియు 365 లను ఒకే సమగ్ర సెక్షన్‌లోకి తీసుకువచ్చారు.'
      },
      or: {
        title: 'ହତ୍ୟା କରିବା କିମ୍ବା ମୁକ୍ତିপণ (Ransom) ପାଇଁ ଅପହରଣ',
        description: 'ହତ୍ୟା କରିବା ଉଦ୍ଦେଶ୍ୟରେ ଅପହରଣ (140(1)) କିମ୍ବା ମୁକ୍ତିপণ (Ransom) ଦାବି ପାଇଁ ଅପହରଣ କରି ମୃତ୍ୟୁ ବା ଆଘାତର ଭୟ ସୃଷ୍ଟି କରିବା (140(2))।',
        punishment: 'ମୁକ୍ତିপণ ପାଇଁ ଅପହରଣ (140(2)): ମୃତ୍ୟୁଦଣ୍ଡ ବା ଆଜୀବନ କାରାବାସ + ଜରିମାନା; ହତ୍ୟା ପାଇଁ (140(1)): ଆଜୀବନ ବା ୧୦ ବର୍ଷ କାରାବାସ',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 364, 364A ଏବଂ 365 କୁ ଗୋଟିଏ ସମନ୍ୱିତ ଧାରାରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'VII',
    chapterName: {
      en: 'Of Offences Against the State',
      hi: 'राज्य के विरुद्ध अपराध',
      te: 'రాజ్యంపై నేరాలు',
      or: 'ରାଷ୍ଟ୍ର ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '152',
    ipcEquivalent: 'Replaces IPC Sec 124A (Focused on Sovereignty & Integrity)',
    category: 'Organised Crime & National Security',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Requires preliminary inquiry / sanction protocols under BNSS 2023; digital evidence preservation.',
    bsaAdmissibility: 'Electronic broadcasts, financial trails, and speeches admissible with Sec 63 BSA certificate.',
    ingredients: [
      'Purposely or knowingly exciting or attempting to excite secession, armed rebellion, or subversive activities',
      'Encouraging feelings of separatist activities or endangering sovereignty, unity and integrity of India (by words, signs, electronic communication, or financial means)'
    ],
    investigativeSteps: [
      'Preserve original unedited audio/video/electronic broadcast with SHA-256 hash and BSA Sec 63 certificate.',
      'Trace financial funding sources supporting secessionist or armed rebellion activities.'
    ],
    translations: {
      en: {
        title: 'Act endangering sovereignty, unity and integrity of India',
        description: 'Whoever, purposely or knowingly, by words, either spoken or written, or by signs, or by visible representation, or by electronic communication or by use of financial mean, or otherwise, excites or attempts to excite, secession or armed rebellion or subversive activities, or encourages feelings of separatist activities or endangers sovereignty or unity and integrity of India.',
        punishment: 'Imprisonment for Life or Imprisonment extendable to 7 years + Fine',
        aiCommentary: 'Replaces colonial-era sedition (IPC 124A) with a modern provision specifically protecting the sovereignty, unity, and integrity of India against secession and armed rebellion.'
      },
      hi: {
        title: 'भारत की संप्रभुता, एकता और अखंडता को खतरे में डालने वाला कृत्य',
        description: 'जो कोई जानबूझकर बोले या लिखे गए शब्दों, संकेतों, इलेक्ट्रॉनिक संचार या वित्तीय साधनों द्वारा अलगाव, सशस्त्र विद्रोह या विध्वंसक गतिविधियों को भड़काता है, या भारत की संप्रभुता, एकता और अखंडता को खतरे में डालता है।',
        punishment: 'आजीवन कारावास या 7 वर्ष तक का कारावास + जुर्माना',
        aiCommentary: 'औपनिवेशिक राजद्रोह कानून (आईपीसी 124A) को समाप्त कर राष्ट्र की संप्रभुता, एकता और अखंडता की रक्षा हेतु यह प्रावधान लाया गया है।'
      },
      te: {
        title: 'భారతదేశ సార్వభౌమాధికారం, ఐక్యత మరియు సమగ్రతకు భంగం కలిగించే చర్య',
        description: 'ఉద్దేశపూర్వకంగా మాటలు, రాతలు, సంకేతాలు, ఎలక్ట్రానిక్ కమ్యూనికేషన్ లేదా ఆర్థిక వనరుల ద్వారా వేర్పాటువాదం, సాయుధ తిరుగుబాటు లేదా విద్రోహ చర్యలను ప్రోత్సహించి భారతదేశ సార్వభౌమాధికారం, ఐక్యత మరియు సమగ్రతకు ముప్పు కలిగించడం.',
        punishment: 'జీవిత ఖైదు లేదా 7 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'వలసవాద రాజద్రోహం (IPC 124A) స్థానంలో దేశ సార్వభౌమాధికారం మరియు సమగ్రతను రక్షించడానికి ఈ సెక్షన్ ప్రవేశపెట్టారు.'
      },
      or: {
        title: 'ଭାରତର ସାର୍ବଭୌମତ୍ୱ, ଏକତା ଏବଂ ଅଖଣ୍ଡତା ପ୍ରତି ବିପଦ ସୃଷ୍ଟି କରୁଥିବା କାର୍ଯ୍ୟ',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି ଜାଣିଶୁଣି କଥା, ଲେଖା, ସଙ୍କେତ, ଇଲେକ୍ଟ୍ରୋନିକ୍ ଯୋଗାଯୋଗ କିମ୍ବା ଆର୍ଥିକ ମାଧ୍ୟମରେ ବିচ্ছিন্নତାବାଦ, ସଶସ୍ତ୍ର ବିଦ୍ରୋହ କିମ୍ବା ଭାରତର ସାର୍ବଭୌମତ୍ୱ, ଏକତା ଓ ଅଖଣ୍ଡତା ପ୍ରତି ବିପଦ ସୃଷ୍ଟି କରେ।',
        punishment: 'ଆଜୀବନ କାରାବାସ କିମ୍ବା ୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା ରାଜଦ୍ରୋହ ଆଇନ (IPC 124A) କୁ ଉଚ୍ଛେଦ କରି ରାଷ୍ଟ୍ରର ସାର୍ବଭୌମତ୍ୱ ଓ ଅଖଣ୍ଡତା ରକ୍ଷା ପାଇଁ ଏହି ଧାରା ପ୍ରণୟନ ହୋଇଛି।'
      }
    }
  },
  {
    chapter: 'XI',
    chapterName: {
      en: 'Of Offences Against the Public Tranquillity',
      hi: 'लोक प्रशांति के विरुद्ध अपराध',
      te: 'ప్రజా శాంతికి భంగం కలిగించే నేరాలు',
      or: 'ଜନ ଶାନ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '189',
    ipcEquivalent: 'IPC Sec 141 / 143 / 144',
    category: 'Public Order & Justice',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Dispersal of unlawful assembly under Sec 148–151 BNSS; videography of crowd dispersal.',
    bsaAdmissibility: 'Drone / bodycam / CCTV recordings admissible under Sec 63 BSA.',
    ingredients: [
      'Assembly of five or more persons with a common object to overawe by criminal force, resist execution of law, or commit mischief/criminal trespass/offence'
    ],
    investigativeSteps: [
      'Preserve body-worn camera, drone, and CCTV footage identifying members and weapons carried.',
      'Document dispersal warnings issued by Executive Magistrate or Station House Officer.'
    ],
    translations: {
      en: {
        title: 'Unlawful assembly',
        description: 'An assembly of five or more persons is designated an "unlawful assembly", if the common object of the persons composing that assembly is to overawe by criminal force the Government or public servant, resist execution of law, or commit any mischief or criminal trespass or other offence.',
        punishment: 'Being member: Up to 6 months Imprisonment / Fine; Armed with deadly weapon (Sec 189(4)): Up to 2 years + Fine',
        aiCommentary: 'Consolidates IPC Sections 141, 142, 143, 144, 145, and 150 into a single structured section on unlawful assemblies.'
      },
      hi: {
        title: 'विधिविरुद्ध जमाव (Unlawful Assembly)',
        description: 'पांच या अधिक व्यक्तियों का जमाव "विधिविरुद्ध जमाव" कहलाता है, यदि उन व्यक्तियों का सामान्य उद्देश्य आपराधिक बल द्वारा सरकार या लोक सेवक को आतंकित करना, विधि के निष्पादन का प्रतिरोध करना, या कोई अपराध करना हो।',
        punishment: 'सदस्य होना: 6 माह तक कारावास/जुर्माना; घातक आयुध से सज्जित होना (189(4)): 2 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी की धाराओं 141 से 145 को एक ही संगठित धारा 189 में समेकित किया गया है।'
      },
      te: {
        title: 'చట్టవిరుద్ధమైన కూటమి (Unlawful Assembly)',
        description: 'ఐదుగురు లేదా అంతకంటే ఎక్కువ మంది వ్యక్తులు ఉమ్మడి ఉద్దేశ్యంతో ప్రభుత్వంపై లేదా ప్రభుత్వ ఉద్యోగిపై నేరపూరిత బలప్రయోగం చేయడానికి, చట్ట అమలును అడ్డుకోవడానికి లేదా నేరం చేయడానికి గుమిగூడితే దానిని చట్టవిరుద్ధమైన కూటమి అంటారు.',
        punishment: 'సభ్యుడిగా ఉంటే: 6 నెలల వరకు జైలు/జరిమానా; ప్రాణాంతక ఆయుధంతో ఉంటే (189(4)): 2 ఏళ్ల వరకు జైలు + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్లు 141 నుండి 145 వరకు ఉన్న నిబంధనలను ఒకే సెక్షన్ కిందకు చేర్చారు.'
      },
      or: {
        title: 'ବେଆଇନ ସମାବେଶ (Unlawful Assembly)',
        description: 'ପାଞ୍ଚ କିମ୍ବା ତଦୂର୍ଦ୍ଧ୍ୱ ବ୍ୟକ୍ତିଙ୍କ ସମାବେଶକୁ "ବେଆଇନ ସମାବେଶ" କୁହାଯାଏ, ଯଦି ସେମାନଙ୍କର ସାଧାରଣ ଉଦ୍ଦେଶ୍ୟ ଅପରାଧିକ ବଳ ଦ୍ୱାରା ସରକାରୀ କର୍ମଚାରୀଙ୍କୁ ଭୟଭୀତ କରିବା, ଆଇନ କାର୍ଯ୍ୟକାରୀରେ ବାଧା ଦେବା ବା ଅପରାଧ କରିବା ହୁଏ।',
        punishment: 'ସଦସ୍ୟ ହେଲେ: ୬ ମାସ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍/ଜରିମାନା; ମାରଣାସ୍ତ୍ର ସହ ଥିଲେ (189(4)): ୨ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 141 ରୁ 145 କୁ ଗୋଟିଏ ଧାରା 189 ରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XI',
    chapterName: {
      en: 'Of Offences Against the Public Tranquillity',
      hi: 'लोक प्रशांति के विरुद्ध अपराध',
      te: 'ప్రజా శాంతికి భంగం కలిగించే నేరాలు',
      or: 'ଜନ ଶାନ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '191',
    ipcEquivalent: 'IPC Sec 146 / 147 / 148',
    category: 'Public Order & Justice',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Read with Sec 190 BNS (vicarious liability of every member of unlawful assembly).',
    bsaAdmissibility: 'Video recordings and damage assessment reports admissible under BSA.',
    ingredients: [
      'Use of force or violence by an unlawful assembly, or by any member thereof, in prosecution of the common object of such assembly',
      'Aggravated punishment under Sec 191(3) if armed with a deadly weapon'
    ],
    investigativeSteps: [
      'Identify individual rioters through CCTV/drone footage and recover weapons.',
      'Assess public/private property damage for restitution claims.'
    ],
    translations: {
      en: {
        title: 'Rioting (Including Rioting Armed with Deadly Weapon)',
        description: 'Whenever force or violence is used by an unlawful assembly, or by any member thereof, in prosecution of the common object of such assembly, every member of such assembly is guilty of the offence of rioting.',
        punishment: 'Rioting (191(2)): Up to 2 years + Fine; Armed with deadly weapon (191(3)): Up to 5 years + Fine',
        aiCommentary: 'Enhances punishment for rioting armed with a deadly weapon from 3 years (IPC 148) to 5 years (BNS 191(3)).'
      },
      hi: {
        title: 'बलवा करना (घातक आयुध से सज्जित होकर बलवा करने सहित)',
        description: 'जब कभी किसी विधिविरुद्ध जमाव द्वारा या उसके किसी सदस्य द्वारा ऐसे जमाव के सामान्य उद्देश्य के अग्रसरण में बल या हिंसा का प्रयोग किया जाता है, तब ऐसे जमाव का प्रत्येक सदस्य बलवा करने के अपराध का दोषी होता है।',
        punishment: 'बलवा (191(2)): 2 वर्ष तक कारावास; घातक हथियार सहित बलवा (191(3)): 5 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'घातक हथियार के साथ बलवा करने पर दण्ड को 3 वर्ष (आईपीसी 148) से बढ़ाकर 5 वर्ष (बीएनएस 191(3)) किया गया है।'
      },
      te: {
        title: 'అల్లర్లు / దొమ్మీ (మారణాయుధాలతో అల్లర్లతో సహా)',
        description: 'చట్టవిరుద్ధమైన కూటమి లేదా అందులోని ఏ సభ్యుడైనా ఉమ్మడి ఉద్దేశ్యంతో బలప్రయోగం లేదా హింసకు పాల్పడితే ఆ కూటమిలోని ప్రతి సభ్యుడు అల్లర్ల (Rioting) నేరానికి పాల్పడినట్లే.',
        punishment: 'అల్లర్లు (191(2)): 2 ఏళ్ల వరకు జైలు; మారణాయుధాలతో అల్లర్లు (191(3)): 5 ఏళ్ల వరకు జైలు + జరిమానా',
        aiCommentary: 'మారణాయుధాలతో అల్లర్లకు పాల్పడితే శిక్షను పాత IPC 148 లోని 3 ఏళ్ల నుండి 5 ఏళ్లకు పెంచారు.'
      },
      or: {
        title: 'ଦଙ୍ଗା କରିବା (ମାରଣାସ୍ତ୍ର ସହ ଦଙ୍ଗା ସହିତ)',
        description: 'ଯେତେବେଳେ କୌଣସି ବେଆଇନ ସମାବେଶ କିମ୍ବା ତାହାର କୌଣସି ସଦସ୍ୟ ସାଧାରଣ ଉଦ୍ଦେଶ୍ୟ ପୂରଣ ପାଇଁ ବଳ ବା ହିଂସା ପ୍ରୟୋଗ କରନ୍ତି, ତେବେ ପ୍ରତ୍ୟେକ ସଦସ୍ୟ ଦଙ୍ଗା ଅପରାଧରେ ଦୋଷୀ ହୁଅନ୍ତି।',
        punishment: 'ଦଙ୍ଗା (191(2)): ୨ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍; ମାରଣାସ୍ତ୍ର ସହ ଦଙ୍ଗା (191(3)): ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍ + ଜରିମାନା',
        aiCommentary: 'ମାରଣାସ୍ତ୍ର ସହ ଦଙ୍ଗା କ୍ଷେତ୍ରରେ ଦଣ୍ଡକୁ ୩ ବର୍ଷ (IPC 148) ରୁ ୫ ବର୍ଷକୁ ବୃଦ୍ଧି କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XI',
    chapterName: {
      en: 'Of Offences Against the Public Tranquillity',
      hi: 'लोक प्रशांति के विरुद्ध अपराध',
      te: 'ప్రజా శాంతికి భంగం కలిగించే నేరాలు',
      or: 'ଜନ ଶାନ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '195',
    ipcEquivalent: 'IPC Sec 152',
    category: 'Public Order & Justice',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Medical examination of injured public servant and duty roster certificate.',
    bsaAdmissibility: 'Official duty deployment order and bodycam recording admissible under BSA.',
    ingredients: [
      'Assaulting, threatening, or obstructing a public servant',
      'While the public servant is endeavouring in the discharge of duty to disperse an unlawful assembly or suppress a riot or affray'
    ],
    investigativeSteps: [
      'Attach official deployment order and duty certificate of the assaulted officer.',
      'Secure video recording and MLC of injured police/public personnel.'
    ],
    translations: {
      en: {
        title: 'Assaulting or obstructing public servant when suppressing riot, etc.',
        description: 'Whoever assaults or threatens to assault, or obstructs or attempts to obstruct, any public servant in the discharge of his duty as such public servant in endeavouring to disperse an unlawful assembly, or to suppress a riot or affray.',
        punishment: 'Imprisonment up to 3 years, or Fine not less than Rs 25,000, or both',
        aiCommentary: 'Introduces a statutory minimum fine of Rs 25,000 for assaulting or obstructing police/public servants during riot suppression.'
      },
      hi: {
        title: 'बलवा आदि दबाते समय लोक सेवक पर हमला करना या बाधा डालना',
        description: 'जो कोई किसी विधिविरुद्ध जमाव को तितर-बितर करने या बलवे या दंगे को दबाने के अपने कर्तव्य का निर्वहन कर रहे लोक सेवक पर हमला करता है या बाधा डालता है।',
        punishment: '3 वर्ष तक का कारावास, या न्यूनतम 25,000 रु. जुर्माना, या दोनों',
        aiCommentary: 'दंगा नियंत्रण के दौरान पुलिस या लोक सेवकों पर हमला करने पर न्यूनतम 25,000 रुपये के जुर्माने का नया प्रावधान किया गया है।'
      },
      te: {
        title: 'అల్లర్లను అణచివేస్తున్న ప్రభుత్వ ఉద్యోగిపై దాడి చేయడం లేదా అడ్డుకోవడం',
        description: 'చట్టవిరుద్ధమైన కూటమిని చెదరగొట్టడానికి లేదా అల్లర్లను అణచివేయడానికి విధి నిర్వహణలో ఉన్న ప్రభుత్వ ఉద్యోగిపై దాడి చేసినా, బెదిరించినా లేదా అడ్డుకున్నా శిక్షార్హులు.',
        punishment: '3 ఏళ్ల వరకు జైలు శిక్ష, లేదా కనీసం రూ. 25,000 జరిమానా, లేదా రెండూ',
        aiCommentary: 'విధి నిర్వహణలో ఉన్న పోలీసు/ప్రభుత్వ ఉద్యోగులపై దాడి చేస్తే కనీసం రూ. 25,000 జరిమానా విధించేలా చట్టాన్ని బలోపేతం చేశారు.'
      },
      or: {
        title: 'ଦଙ୍ଗା ଦମନ ସମୟରେ ସରକାରୀ କର୍ମଚାରୀଙ୍କୁ ଆକ୍ରମଣ କିମ୍ବା ବାଧା ଦେବା',
        description: 'ବେଆଇନ ସମାବେଶକୁ ଭାଙ୍ଗିବା କିମ୍ବା ଦଙ୍ଗା ଦମନ କରିବା ପାଇଁ କର୍ତ୍ତବ୍ୟରତ ସରକାରୀ କର୍ମଚାରୀଙ୍କୁ ଆକ୍ରମଣ କଲେ ବା ବାଧା ଦେଲେ ଦଣ୍ଡନୀୟ ଅଟେ।',
        punishment: '୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ, କିମ୍ବା ସର୍ବନିମ୍ନ ୨୫,୦୦୦ ଟଙ୍କା ଜରିମାନା, କିମ୍ବା ଉଭୟ',
        aiCommentary: 'ଦଙ୍ଗା ନିୟନ୍ତ୍ରଣ ସମୟରେ ପୋଲିସ ବା ସରକାରୀ କର୍ମଚାରୀଙ୍କୁ ବାଧା ଦେଲେ ସର୍ବନିମ୍ନ ୨୫,୦୦୦ ଟଙ୍କା ଜରିମାନା ଧାର୍ଯ୍ୟ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XI',
    chapterName: {
      en: 'Of Offences Against the Public Tranquillity',
      hi: 'लोक प्रशांति के विरुद्ध अपराध',
      te: 'ప్రజా శాంతికి భంగం కలిగించే నేరాలు',
      or: 'ଜନ ଶାନ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '196',
    ipcEquivalent: 'IPC Sec 153A',
    category: 'Public Order & Justice',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Prior sanction under Sec 217 BNSS required before Court takes cognizance.',
    bsaAdmissibility: 'Electronic social media posts and broadcasts admissible with Sec 63 BSA certificate.',
    ingredients: [
      'Promoting or attempting to promote disharmony or feelings of enmity, hatred or ill-will between different religious, racial, language or regional groups or castes or communities',
      'Explicitly includes commission "by electronic communication" under Sec 196(1)(a)'
    ],
    investigativeSteps: [
      'Preserve original electronic post/video with platform URL, timestamp, and SHA-256 hash.',
      'Obtain statutory sanction under Sec 217 BNSS prior to filing charge-sheet.'
    ],
    translations: {
      en: {
        title: 'Promoting enmity between different groups on grounds of religion, race, place of birth, residence, language, etc.',
        description: 'Whoever by words, either spoken or written, or by signs or by visible representations or through electronic communication or otherwise, promotes or attempts to promote disharmony or feelings of enmity, hatred or ill-will between different religious, racial, language or regional groups or castes or communities.',
        punishment: 'Up to 3 years Imprisonment or Fine or both (In place of worship: up to 5 years + Fine)',
        aiCommentary: 'Explicitly adds "through electronic communication" to IPC 153A to cover hate speech disseminated via social media and messaging networks.'
      },
      hi: {
        title: 'धर्म, मूलवंश, जन्मस्थान, निवास, भाषा आदि के आधार पर विभिन्न समूहों के बीच शत्रुता का संप्रवर्तन',
        description: 'जो कोई शब्दों, संकेतों, दृश्य रूपणों या इलेक्ट्रॉनिक संचार के माध्यम से विभिन्न धार्मिक, नस्लीय, भाषायी या क्षेत्रीय समूहों या जातियों या समुदायों के बीच वैमनस्य, शत्रुता या घृणा की भावनाएं बढ़ाता है।',
        punishment: '3 वर्ष तक कारावास या जुर्माना या दोनों (पूजा स्थल में: 5 वर्ष तक + जुर्माना)',
        aiCommentary: 'इसमें "इलेक्ट्रॉनिक संचार के माध्यम से" शब्दों को स्पष्ट रूप से जोड़ा गया है ताकि सोशल मीडिया पर नफरत फैलाने वालों पर सीधी कार्यवाही हो सके।'
      },
      te: {
        title: 'మతం, జాతి, జన్మస్థలం, భాష మొదలైన వాటి ఆధారంగా వివిధ వర్గాల మధ్య శత్రుత్వాన్ని ప్రోత్సహించడం',
        description: 'మాటలు, రాతలు, సంకేతాలు లేదా ఎలక్ట్రానిక్ కమ్యూనికేషన్ ద్వారా వివిధ మత, జాతి, భాషా లేదా ప్రాంతీయ వర్గాల మధ్య శత్రుత్వం, ద్వేషం లేదా అసమ్మతిని రెచ్చగొట్టడం.',
        punishment: '3 ఏళ్ల వరకు జైలు లేదా జరిమానా (ప్రార్థనా స్థలంలో: 5 ఏళ్ల వరకు + జరిమానా)',
        aiCommentary: 'సోషల్ మీడియా మరియు ఆన్‌లైన్ వేదికలపై విద్వేషపూరిత ప్రసంగాలను అరికట్టడానికి "ఎలక్ట్రానిక్ కమ్యూనికేషన్ ద్వారా" అనే పదాన్ని చేర్చారు.'
      },
      or: {
        title: 'ଧର୍ମ, ଜାତି, ଜନ୍ମସ୍ଥାନ, ଭାଷା ଆଦି ଆଧାରରେ ବିଭିନ୍ନ ଗୋଷ୍ଠୀ ମଧ୍ୟରେ ଶତ୍ରୁତା ସୃଷ୍ଟି କରିବା',
        description: 'କଥା, ଲେଖା, ସଙ୍କେତ କିମ୍ବା ଇଲେକ୍ଟ୍ରୋନିକ୍ ଯୋଗାଯୋଗ ମାଧ୍ୟମରେ ବିଭିନ୍ନ ଧାର୍ମିକ, ଜାତିଗତ ବା ଭାଷାଗତ ଗୋଷ୍ଠୀ ମଧ୍ୟରେ ଶତ୍ରୁତା ବା ଘୃଣା ସୃଷ୍ଟି କରିବା।',
        punishment: '୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ ବା ଜରିମାନା (ଉପାସନା ସ୍ଥଳରେ: ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ + ଜରିମାନା)',
        aiCommentary: 'ସୋସିଆଲ ମିଡିଆରେ ଘୃଣା ପ୍ରସାରକୁ ରୋକିବା ପାଇଁ "ଇଲେକ୍ଟ୍ରୋନିକ୍ ଯୋଗାଯୋଗ ମାଧ୍ୟମରେ" ଶବ୍ଦ ଯୋଡ଼ାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XIII',
    chapterName: {
      en: 'Of Contempts of the Lawful Authority of Public Servants',
      hi: 'लोक सेवकों के विधिपूर्ण प्राधिकार के अवमान के विषय में',
      te: 'ప్రభుత్వ ఉద్యోగుల చట్టబద్ధమైన అధికార ధిక్కరణ',
      or: 'ସରକାରୀ କର୍ମଚାରୀଙ୍କ ଆଇନଗତ କ୍ଷମତାର ଅବମାନନା'
    },
    section: '221',
    ipcEquivalent: 'IPC Sec 186',
    category: 'Public Order & Justice',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Written complaint of the public servant or administrative superior required under Sec 215 BNSS.',
    bsaAdmissibility: 'Official duty diary (Roznamcha) and video recording admissible under BSA.',
    ingredients: [
      'Voluntarily obstructing any public servant in the discharge of his public functions'
    ],
    investigativeSteps: [
      'Record General Diary (GD) entry and prepare written complaint under Sec 215 BNSS.'
    ],
    translations: {
      en: {
        title: 'Obstructing public servant in discharge of public functions',
        description: 'Whoever voluntarily obstructs any public servant in the discharge of his public functions, shall be punished with imprisonment of either description for a term which may extend to three months, or with fine which may extend to two thousand and five hundred rupees, or with both.',
        punishment: 'Imprisonment up to 3 months, or Fine up to Rs 2,500, or both',
        aiCommentary: 'Increases fine five-fold from Rs 500 (IPC 186) to Rs 2,500 under BNS 221.'
      },
      hi: {
        title: 'लोक कृत्यों के निर्वहन में लोक सेवक के काम में बाधा डालना',
        description: 'जो कोई किसी लोक सेवक के लोक कृत्यों के निर्वहन में स्वेच्छया बाधा डालेगा, वह तीन मास तक के कारावास या ढाई हजार रुपये तक के जुर्माने या दोनों से दण्डित किया जाएगा।',
        punishment: '3 माह तक कारावास, या 2,500 रु. तक जुर्माना, या दोनों',
        aiCommentary: 'पुरानी आईपीसी धारा 186 के समतुल्य; जुर्माने की राशि 500 रु. से बढ़ाकर 2,500 रु. की गई है।'
      },
      te: {
        title: 'ప్రభుత్వ విధుల నిర్వహణలో ప్రభుత్వ ఉద్యోగిని అడ్డుకోవడం',
        description: 'ప్రభుత్వ ఉద్యోగి తన ప్రభుత్వ విధులను నిర్వహిస్తుండగా ఉద్దేశపూర్వకంగా అడ్డుకుంటే 3 నెలల వరకు జైలు శిక్ష లేదా రూ. 2,500 వరకు జరిమానా లేదా రెండూ విధించబడతాయి.',
        punishment: '3 నెలల వరకు జైలు శిక్ష, లేదా రూ. 2,500 వరకు జరిమానా, లేదా రెండూ',
        aiCommentary: 'పాత IPC సెక్షన్ 186 కు సమానం; జరిమానాను రూ. 2,500 కు పెంచారు.'
      },
      or: {
        title: 'ସରକାରୀ କାର୍ଯ୍ୟ ସମ୍ପାଦନରେ ସରକାରୀ କର୍ମଚାରୀଙ୍କୁ ବାଧା ଦେବା',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି କୌଣସି ସରକାରୀ କର୍ମଚାରୀଙ୍କୁ ତାଙ୍କର ସରକାରୀ କର୍ତ୍ତବ୍ୟ ସମ୍ପାଦନରେ ସ୍ୱେଚ୍ଛାକୃତ ଭାବେ ବାଧା ଦିଏ, ତାକୁ ୩ ମାସ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ କିମ୍ବା ୨,୫୦୦ ଟଙ୍କା ଜରିମାନା ହେବ।',
        punishment: '୩ ମାସ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ, କିମ୍ବା ୨,୫୦୦ ଟଙ୍କା ଜରିମାନା, କିମ୍ବା ଉଭୟ',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 186 ସହ ସମାନ; ଜରିମାନା ରାଶି ୨,୫୦୦ ଟଙ୍କାକୁ ବୃଦ୍ଧି କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XIV',
    chapterName: {
      en: 'Of False Evidence and Offences Against Public Justice',
      hi: 'मिथ्या साक्ष्य और लोक न्याय के विरुद्ध अपराध',
      te: 'తప్పుడు సాక్ష్యం మరియు ప్రజా న్యాయంపై నేరాలు',
      or: 'ମିଥ୍ୟା ସାକ୍ଷ୍ୟ ଏବଂ ଲୋକ ନ୍ୟାୟ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '238',
    ipcEquivalent: 'IPC Sec 201',
    category: 'Public Order & Justice',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Court by which the main offence is triable',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Forensic recovery of destroyed/concealed evidence or deleted digital logs.',
    bsaAdmissibility: 'Forensic data recovery and luminol blood-trace detection admissible under Sec 39 BSA.',
    ingredients: [
      'Knowing or having reason to believe that an offence has been committed',
      'Causing any evidence of the commission of that offence to disappear with the intention of screening the offender from legal punishment'
    ],
    investigativeSteps: [
      'Conduct forensic luminol/trace examination at cleaned crime scenes and cyber forensic carving on formatted devices.'
    ],
    translations: {
      en: {
        title: 'Causing disappearance of evidence of offence, or giving false information to screen offender',
        description: 'Whoever, knowing or having reason to believe that an offence has been committed, causes any evidence of the commission of that offence to disappear, with the intention of screening the offender from legal punishment, or with that intention gives any information respecting the offence which he knows or believes to be false.',
        punishment: 'Capital Offence: Up to 7 years + Fine; Life Offence: Up to 3 years + Fine; Other: 1/4th of longest term',
        aiCommentary: 'Crucial ancillary section invoked whenever perpetrators destroy weapons, wipe CCTV DVR drives, or burn evidence after committing a crime.'
      },
      hi: {
        title: 'अपराध के साक्ष्य का विलोपन (नष्ट) करना, या अपराधी को बचाने के लिए मिथ्या सूचना देना',
        description: 'जो कोई यह जानते हुए कि कोई अपराध किया गया है, अपराधी को वैध दण्ड से बचाने के आशय से उस अपराध के किसी साक्ष्य को गायब/नष्ट करता है या झूठी सूचना देता है।',
        punishment: 'मृत्युदण्ड वाले अपराध में: 7 वर्ष तक कारावास + जुर्माना; आजीवन कारावास वाले में: 3 वर्ष तक + जुर्माना',
        aiCommentary: 'हथियार छिपाने, सीसीटीवी डीवीआर डिलीट करने या साक्ष्य मिटाने के मामलों में मुख्य धारा के साथ लगाई जाने वाली महत्वपूर्ण धारा।'
      },
      te: {
        title: 'నేర సాక్ష్యాధారాలను తారుమారు చేయడం / మాయం చేయడం',
        description: 'నేరం జరిగిందని తెలిసి, నేరస్థుడిని శిక్ష నుండి తప్పించే ఉద్దేశ్యంతో సాక్ష్యాధారాలను మాయం చేసినా లేదా తప్పుడు సమాచారం ఇచ్చినా ఈ సెక్షన్ కింద శిక్షార్హులు.',
        punishment: 'మరణశిక్ష నేరాల్లో: 7 ఏళ్ల వరకు జైలు + జరిమానా; జీవిత ఖైదు నేరాల్లో: 3 ఏళ్ల వరకు జైలు + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్ 201 కు సమానం. సీసీటీవీ ఫుటేజ్ డిలీట్ చేయడం లేదా ఆయుధాలను దాచిపెట్టడం వంటి కేసుల్లో ఇది వర్తిస్తుంది.'
      },
      or: {
        title: 'ଅପରାଧର ପ୍ରମାଣ ନଷ୍ଟ କରିବା କିମ୍ବା ଅପରାଧୀକୁ ବଞ୍ଚାଇବା ପାଇଁ ମିଥ୍ୟା ସୂଚନା ଦେବା',
        description: 'ଅପରାଧ ଘଟିଥିବା ଜାଣି ଅପରାଧୀକୁ ଆଇନଗତ ଦଣ୍ଡରୁ ରକ୍ଷା କରିବା ଉଦ୍ଦେଶ୍ୟରେ ପ୍ରମାଣ ନଷ୍ଟ କଲେ କିମ୍ବା ମିଥ୍ୟା ସୂଚନା ଦେଲେ ଦଣ୍ଡନୀୟ ହେବ।',
        punishment: 'ମୃତ୍ୟୁଦଣ୍ଡ ଅପରାଧ କ୍ଷେତ୍ରରେ: ୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍; ଆଜୀବନ କାରାବାସ କ୍ଷେତ୍ରରେ: ୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 201 ସହ ସମାନ। ପ୍ରମାଣ ନଷ୍ଟ ବା CCTV ଡିଲିଟ୍ କରିବା ମାମଲାରେ ଏହା ପ୍ରୟୋଗ ହୁଏ।'
      }
    }
  },
  {
    chapter: 'XV',
    chapterName: {
      en: 'Of Offences Affecting the Public Health, Safety, Convenience, Decency and Morals',
      hi: 'लोक स्वास्थ्य, क्षेम, सुविधा, शिष्टता और सदाचार पर प्रभाव डालने वाले अपराध',
      te: 'ప్రజారోగ్యం, భద్రత మరియు సౌకర్యాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ଜନସ୍ୱାସ୍ଥ୍ୟ, ସୁରକ୍ଷା ଏବଂ ସୁବିଧାକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '281',
    ipcEquivalent: 'IPC Sec 279',
    category: 'Public Order & Justice',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Seizure of offending vehicle, breathalyzer/blood test under MV Act, and scene sketch.',
    bsaAdmissibility: 'Traffic camera recordings and speed-radar logs admissible under Sec 63 BSA.',
    ingredients: [
      'Driving any vehicle, or riding, on any public way in a manner so rash or negligent as to endanger human life, or to be likely to cause hurt or injury to any other person'
    ],
    investigativeSteps: [
      'Prepare detailed site plan showing tyre skid marks, road width, and point of impact.',
      'Conduct Motor Vehicle Inspector (MVI) brake and mechanical examination.'
    ],
    translations: {
      en: {
        title: 'Rash driving or riding on a public way',
        description: 'Whoever drives any vehicle, or rides, on any public way in a manner so rash or negligent as to endanger human life, or to be likely to cause hurt or injury to any other person, shall be punished with imprisonment up to six months, or with fine up to one thousand rupees, or with both.',
        punishment: 'Imprisonment up to 6 months, or Fine up to Rs 1,000, or both',
        aiCommentary: 'Corresponds to IPC Section 279. Frequently invoked alongside BNS Section 106 (death by negligence) or Section 125 (act endangering life) in road traffic FIRs.'
      },
      hi: {
        title: 'लोक मार्ग पर उतावलेपन से वाहन चलाना या हांकना (Rash Driving)',
        description: 'जो कोई किसी लोक मार्ग पर ऐसे उतावलेपन या उपेक्षा से कोई वाहन चलाता है जिससे मानव जीवन संकट में पड़ जाए या किसी अन्य व्यक्ति को उपहति या क्षति कारित होना संभाव्य हो।',
        punishment: '6 माह तक का कारावास, या 1,000 रु. तक जुर्माना, या दोनों',
        aiCommentary: 'पुरानी आईपीसी धारा 279 के समतुल्य। सड़क दुर्घटना की प्राथमिकी (FIR) में सबसे अधिक प्रयुक्त होने वाली धारा।'
      },
      te: {
        title: 'ప్రభుత్వ రహదారిపై అజాగ్రత్తగా / వేగంగా వాహనం నడపడం (Rash Driving)',
        description: 'ప్రజల ప్రాణాలకు ముప్పు కలిగించే విధంగా లేదా ఇతరులకు గాయం కలిగేలా ప్రభుత్వ రహదారిపై అజాగ్రత్తగా లేదా నిర్లక్ష్యంగా వాహనం నడిపితే శిక్షార్హులు.',
        punishment: '6 నెలల వరకు జైలు శిక్ష, లేదా రూ. 1,000 వరకు జరిమానా, లేదా రెండూ',
        aiCommentary: 'పాత IPC సెక్షన్ 279 కు సమానం. రోడ్డు ప్రమాదాల FIR లలో ప్రాథమికంగా ఉపయోగించే సెక్షన్.'
      },
      or: {
        title: 'ସର୍ବସାଧାରଣ ରାସ୍ତାରେ ବେପରୁଆ ଗାଡ଼ି ଚାଳନା (Rash Driving)',
        description: 'ମଣିଷ ଜୀବନ ପ୍ରତି ବିପଦ ସୃଷ୍ଟି କରିବା ଭଳି କିମ୍ବା ଅନ୍ୟକୁ ଆଘାତ ଲାଗିବା ଭଳି ସର୍ବସାଧାରଣ ରାସ୍ତାରେ ବେପରୁଆ ବା ଅବହେଳାପୂର୍ଣ୍ଣ ଭାବେ ଗାଡ଼ି ଚଳାଇବା।',
        punishment: '୬ ମାସ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ, କିମ୍ବା ୧,୦୦୦ ଟଙ୍କା ପର୍ଯ୍ୟନ୍ତ ଜରିମାନା, କିମ୍ବା ଉଭୟ',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 279 ସହ ସମାନ। ସଡ଼କ ଦୁର୍ଘଟଣା FIR ରେ ସର୍ବାଧିକ ବ୍ୟବହୃତ ଧାରା।'
      }
    }
  },
  {
    chapter: 'XV',
    chapterName: {
      en: 'Of Offences Affecting the Public Health, Safety, Convenience, Decency and Morals',
      hi: 'लोक स्वास्थ्य, क्षेम, सुविधा, शिष्टता और सदाचार पर प्रभाव डालने वाले अपराध',
      te: 'ప్రజారోగ్యం, భద్రత మరియు సౌకర్యాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ଜନସ୍ୱାସ୍ଥ୍ୟ, ସୁରକ୍ଷା ଏବଂ ସୁବିଧାକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '293',
    ipcEquivalent: 'IPC Sec 268 / 290 / 291',
    category: 'Public Order & Justice',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Read with Sec 152 BNSS (Conditional order for removal of nuisance by Executive Magistrate).',
    bsaAdmissibility: 'Photographs, decibel/pollution readings, and public complaints admissible under BSA.',
    ingredients: [
      'Continuing or repeating a public nuisance after having been enjoined by any public servant who has lawful authority to issue such injunction not to repeat or continue such nuisance'
    ],
    investigativeSteps: [
      'Attach copy of prior prohibitory order issued under Sec 152/163 BNSS.',
      'Document continuing violation via timestamped photographs and independent witnesses.'
    ],
    translations: {
      en: {
        title: 'Continuance of nuisance after injunction to discontinue',
        description: 'Whoever repeats or continues a public nuisance, having been enjoined by any public servant who has lawful authority to issue such injunction not to repeat or continue such nuisance, shall be punished with simple imprisonment for a term which may extend to six months, or with fine which may extend to five thousand rupees, or with both.',
        punishment: 'Simple Imprisonment up to 6 months, or Fine up to Rs 5,000, or both',
        aiCommentary: 'Enforces compliance with public nuisance abatement orders issued by Magistrates and police authorities.'
      },
      hi: {
        title: 'लोक न्यूसेंस (Public Nuisance) को बंद करने के व्यादेश के पश्चात् उसका जारी रखना',
        description: 'जो कोई किसी लोक सेवक द्वारा लोक न्यूसेंस (सार्वजनिक उपताप) न दोहराने या जारी न रखने का वैध आदेश दिए जाने के पश्चात् भी उसे दोहराता या जारी रखता है।',
        punishment: '6 माह तक सादा कारावास, या 5,000 रु. तक जुर्माना, या दोनों',
        aiCommentary: 'सार्वजनिक बाधा या उपताप हटाने के प्रशासनिक आदेशों के उल्लंघन पर दण्ड सुनिश्चित करता है।'
      },
      te: {
        title: 'నిలిపివేయాలని ఆదేశించిన తర్వాత కూడా పబ్లిక్ న్యూసెన్స్ కొనసాగించడం',
        description: 'ప్రభుత్వ ఉద్యోగి చట్టబద్ధంగా జారీ చేసిన ఆదేశాలను ఉల్లంఘిస్తూ ప్రజలకు ఇబ్బంది కలిగించే చర్యను (Public Nuisance) కొనసాగిస్తే శిక్ష విధించబడుతుంది.',
        punishment: '6 నెలల వరకు సాధారణ జైలు శిక్ష, లేదా రూ. 5,000 వరకు జరిమానా, లేదా రెండూ',
        aiCommentary: 'ప్రజా అసౌకర్యాన్ని తొలగించే ప్రభుత్వ ఉత్తర్వుల అమలుకు ఈ సెక్షన్ ఉపయోగపడుతుంది.'
      },
      or: {
        title: 'ବନ୍ଦ କରିବାକୁ ଆଦେଶ ସତ୍ତ୍ୱେ ସର୍ବସାଧାରଣ ଉପଦ୍ରବ (Public Nuisance) ଜାରି ରଖିବା',
        description: 'କୌଣସି କ୍ଷମତାପ୍ରାପ୍ତ ସରକାରୀ କର୍ମଚାରୀଙ୍କ ନିଷେଧାଦେଶ ସତ୍ତ୍ୱେ ସର୍ବସାଧାରଣ ଉପଦ୍ରବ ବା ବାଧା ଜାରି ରଖିলে ଦଣ୍ଡନୀୟ ଅଟେ।',
        punishment: '୬ ମାସ ପର୍ଯ୍ୟନ୍ତ ସାଧାରଣ କାରାବାସ, କିମ୍ବା ୫,୦୦୦ ଟଙ୍କା ପର୍ଯ୍ୟନ୍ତ ଜରିମାନା, କିମ୍ବା ଉଭୟ',
        aiCommentary: 'ସର୍ବସାଧାରଣ ଶାନ୍ତି ଓ ସୁବିଧା ରକ୍ଷା ପାଇଁ ପ୍ରଶାସନିକ ଆଦେଶର ପାଳନ ସୁନିଶ୍ଚିତ କରେ।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '303',
    ipcEquivalent: 'IPC Sec 378 / 379',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Videographed seizure and recovery memo under Sec 105 BNSS; Community Service option if stolen property < Rs 5,000 is restored on first conviction.',
    bsaAdmissibility: 'Recovery discovery statement under Sec 23 BSA and ownership invoices.',
    ingredients: [
      'Intending to take dishonestly any movable property out of the possession of any person without that person’s consent',
      'Moving that property in order to such taking'
    ],
    investigativeSteps: [
      'Record exact description, IMEI/serial numbers, and valuation of stolen movable property.',
      'Check if property value is less than Rs 5,000 and restored by first-time offender (Community Service provision).'
    ],
    translations: {
      en: {
        title: 'Theft',
        description: 'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person’s consent, moves that property in order to such taking, is said to commit theft. Provided that where the value of stolen property is less than Rs 5,000 and a person is convicted for the first time, they shall be punished with community service upon return/restoration of property.',
        punishment: 'First conviction: Up to 3 years + Fine (Community Service if < Rs 5,000 restored); Subsequent conviction: 1 to 5 years RI + Fine',
        aiCommentary: 'Combines IPC 378 and 379, adds Community Service for petty first-time theft (<Rs 5,000) upon restitution, and introduces mandatory 1–5 year RI for repeat offenders.'
      },
      hi: {
        title: 'चोरी (Theft)',
        description: 'जो कोई किसी व्यक्ति के कब्जे में से, उस व्यक्ति की सम्मति के बिना, कोई जंगम (चल) संपत्ति बेईमानी से लेने का आशय रखते हुए वह संपत्ति हटाता है, वह चोरी करता है। यदि चोरी की संपत्ति का मूल्य 5,000 रु. से कम है और प्रथम बार अपराध पर संपत्ति लौटा दी जाती है, तो सामुदायिक सेवा का दण्ड दिया जाएगा।',
        punishment: 'प्रथम बार: 3 वर्ष तक कारावास + जुर्माना (5,000 रु. से कम संपत्ति लौटाने पर सामुदायिक सेवा); पुनरावृत्ति पर: 1 से 5 वर्ष कठोर कारावास',
        aiCommentary: 'पुरानी आईपीसी धारा 378 और 379 को एकीकृत करता है तथा 5,000 रु. से कम की पहली चोरी में संपत्ति वापसी पर सामुदायिक सेवा का सुधारात्मक प्रावधान जोड़ता है।'
      },
      te: {
        title: 'దొంగతనం (Theft)',
        description: 'ఒక వ్యక్తి అనుమతి లేకుండా అతని ఆధీనంలో ఉన్న చరాస్తిని నిజాయితీ లేకుండా తీసుకునే ఉద్దేశ్యంతో ఆ ఆస్తిని కదిలిస్తే అది దొంగతనం అవుతుంది. రూ. 5,000 లోపు విలువైన ఆస్తిని మొదటిసారి దొంగిలించి తిరిగి ఇచ్చేస్తే సామాజిక సేవ (Community Service) శిక్ష విధించబడుతుంది.',
        punishment: 'మొదటి నేరం: 3 ఏళ్ల వరకు జైలు + జరిమానా (రూ. 5,000 లోపు ఆస్తి తిరిగి ఇస్తే సామాజిక సేవ); రెండవసారి: 1 నుండి 5 ఏళ్ల కఠిన కారాగార శిక్ష',
        aiCommentary: 'పాత IPC 378 & 379 లను కలిపి, చిన్నపాటి మొదటిసారి దొంగతనాలకు సామాజిక సేవ మరియు పాత నేరస్థులకు కఠిన శిక్షను నిర్దేశిస్తుంది.'
      },
      or: {
        title: 'ଚୋରି (Theft)',
        description: 'କୌଣସି ବ୍ୟକ୍ତିଙ୍କ ବିନା ଅନୁମତିରେ ତାଙ୍କ ଦଖଲରୁ ଅସ୍ଥାବର ସମ୍ପତ୍ତି ଅସାଧୁ ଭାବେ ନେବା ଉଦ୍ଦେଶ୍ୟରେ ସ୍ଥାନାନ୍ତର କରିବା ଚୋରି ଅଟେ। ୫,୦୦୦ ଟଙ୍କାରୁ କମ୍ ମୂଲ୍ୟର ସମ୍ପତ୍ତି ପ୍ରଥମ ଥର ଚୋରି କରି ଫେରାଇ ଦେଲେ ସାମୁହିକ ସେବା (Community Service) ଦଣ୍ଡ ମିଳିବ।',
        punishment: 'ପ୍ରଥମ ଦୋଷସିଦ୍ଧି: ୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍ + ଜରିମାନା (<୫,୦୦୦ ଟଙ୍କା ଫେରସ୍ତ ହେଲେ ସାମୁହିକ ସେବା); ପୁନରାବୃତ୍ତି: ୧ ରୁ ୫ ବର୍ଷ କଠୋର କାରାବାସ',
        aiCommentary: 'ପୁରୁଣା IPC 378 ଓ 379 କୁ ଏକତ୍ର କରି କ୍ଷୁଦ୍ର ଚୋରିରେ ସଂସ୍କାରମୂଳକ ସାମୁହିକ ସେବା ଏବଂ ଅଭ୍ୟସ୍ତ ଅପରାଧୀଙ୍କ ପାଇଁ କଠୋର ଦଣ୍ଡ ବ୍ୟବସ୍ଥା କରେ।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '304',
    ipcEquivalent: 'New Standalone Offence in BNS 2023',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Immediate CCTV / ANPR tracking of two-wheeler or getaway vehicle; videographed recovery under Sec 105 BNSS.',
    bsaAdmissibility: 'Street CCTV footage and recovery panchnama admissible under Sec 63 & 23 BSA.',
    ingredients: [
      'In order to commit theft, suddenly or quickly or forcibly seizing or securing or grabbing or taking away from any person or from his possession any movable property'
    ],
    investigativeSteps: [
      'Collect street CCTV and ANPR camera logs along the escape route.',
      'Document neck/wrist injuries on the victim if force caused bodily hurt.'
    ],
    translations: {
      en: {
        title: 'Snatching (Chain Snatching / Mobile Snatching)',
        description: 'Theft is "snatching" if, in order to commit theft, the offender suddenly or quickly or forcibly seizes or secures or grabs or takes away from any person or from his possession any movable property. Whoever commits snatching shall be punished with imprisonment up to three years and shall also be liable to fine.',
        punishment: 'Imprisonment up to 3 years + Fine (Mandatory Non-Bailable)',
        aiCommentary: 'Landmark new standalone offence in BNS 2023 specifically targeting street chain-snatching and mobile-phone snatching.'
      },
      hi: {
        title: 'झपटमारी (Snatching - चेन या मोबाइल छीनना)',
        description: 'चोरी "झपटमारी" है यदि चोरी करने के लिए अपराधी अचानक या तेजी से या बलपूर्वक किसी व्यक्ति से या उसके कब्जे से कोई चल संपत्ति पकड़ता है या छीन कर ले जाता है।',
        punishment: '3 वर्ष तक का कारावास + जुर्माना (गैर-जमानतीय)',
        aiCommentary: 'चेन स्नैचिंग और मोबाइल छीनने की बढ़ती घटनाओं पर अंकुश लगाने के लिए बीएनएस 2023 में जोड़ी गई नई स्वतंत्र धारा।'
      },
      te: {
        title: 'స్నాచింగ్ (చైన్ స్నాచింగ్ / మొబైల్ లాక్కోవడం)',
        description: 'దొంగతనం చేయడానికి నేరస్థుడు అకస్మాత్తుగా, వేగంగా లేదా బలవంతంగా ఒక వ్యక్తి నుండి లేదా అతని ఆధీనం నుండి ఏదైనా చరాస్తిని లాక్కుంటే అది "స్నాచింగ్" నేరం అవుతుంది.',
        punishment: '3 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా (నాన్-బెయిలబుల్)',
        aiCommentary: 'చైన్ స్నాచింగ్ మరియు మొబైల్ స్నాచింగ్ నేరాలను అరికట్టడానికి BNS 2023లో కొత్తగా ప్రవేశపెట్టిన ప్రత్యేక సెక్షన్.'
      },
      or: {
        title: 'ଛିନତାଇ (Snatching - ଚେନ୍ ବା ମୋବାଇଲ୍ ଝାମ୍ပି ନେବା)',
        description: 'ଚୋରି କରିବା ଉଦ୍ଦେଶ୍ୟରେ ଅପରାଧୀ ଯଦି ହଠାତ୍, ଦ୍ରୁତ ଗତିରେ କିମ୍ବା ବଳପୂର୍ବକ କୌଣସି ବ୍ୟକ୍ତିଙ୍କଠାରୁ କୌଣସି ଅସ୍ଥାବର ସମ୍ପତ୍ତି ଝାମ୍ପି ନିଏ, ତେବେ ତାହା "ଛିନତାଇ" ଅପରାଧ ଅଟେ।',
        punishment: '୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା (ଜାମିନବିହୀନ)',
        aiCommentary: 'ଚେନ୍ ଓ ମୋବାଇଲ୍ ଛିନତାଇ ରୋକିବା ପାଇଁ BNS ୨୦୨୩ ରେ ସ୍ୱତନ୍ତ୍ର ଭାବେ ଯୋଡ଼ାଯାଇଥିବା ନୂତନ ଧାରା।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '308',
    ipcEquivalent: 'IPC Sec 383 / 384 / 386 / 387',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Preserve ransom/extortion call recordings, UPI/bank accounts, and digital threats.',
    bsaAdmissibility: 'Threatening messages, audio calls, and bank trails admissible under Sec 63 BSA.',
    ingredients: [
      'Intentionally putting any person in fear of any injury to that person or to any other',
      'Thereby dishonestly inducing the person so put in fear to deliver to any person any property or valuable security'
    ],
    investigativeSteps: [
      'Freeze beneficiary bank accounts / UPI IDs under Sec 107 BNSS.',
      'Conduct voice spectrography and IP/CDR tracing of extortion threats.'
    ],
    translations: {
      en: {
        title: 'Extortion',
        description: 'Whoever intentionally puts any person in fear of any injury to that person, or to any other, and thereby dishonestly induces the person so put in fear to deliver to any person any property, or valuable security or anything signed or sealed which may be converted into a valuable security, commits "extortion".',
        punishment: 'General Extortion (308(2)): Up to 7 years + Fine; Fear of death/grievous hurt (308(5)): Up to 10 years + Fine',
        aiCommentary: 'Increases punishment for general extortion from 3 years (IPC 384) to 7 years (BNS 308(2)), triggering mandatory forensic protocols.'
      },
      hi: {
        title: 'उद्यापन / जबरन वसूली (Extortion)',
        description: 'जो कोई किसी व्यक्ति को स्वयं या किसी अन्य व्यक्ति को क्षति के भय में साशय डालता है और इस प्रकार बेईमानी से उसे कोई संपत्ति या मूल्यवान प्रतिभूति देने के लिए उत्प्रेरित करता है, वह उद्यापन (जबरन वसूली) करता है।',
        punishment: 'सामान्य उद्यापन (308(2)): 7 वर्ष तक कारावास + जुर्माना; मृत्यु/गंभीर चोट के भय से (308(5)): 10 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'सामान्य रंगदारी/उद्यापन की सजा को 3 वर्ष (आईपीसी 384) से बढ़ाकर 7 वर्ष (बीएनएस 308(2)) कर दिया गया है।'
      },
      te: {
        title: 'బలవంతపు వసూళ్లు / దోపిడీ బెదిరింపు (Extortion)',
        description: 'ఎవరికైనా హాని కలిగిస్తానని ఉద్దేశపూర్వకంగా భయపెట్టి, ఆ భయంతో వారి నుండి ఏదైనా ఆస్తిని లేదా విలువైన పత్రాన్ని నిజాయితీ లేకుండా వసూలు చేస్తే అది ఎక్స్‌టార్షన్ నేరం అవుతుంది.',
        punishment: 'సాధారణ ఎక్స్‌టార్షన్ (308(2)): 7 ఏళ్ల వరకు జైలు + జరిమానా; మరణ భయం పెడితే (308(5)): 10 ఏళ్ల వరకు జైలు + జరిమానా',
        aiCommentary: 'పాత IPC 384 లో ఉన్న 3 ఏళ్ల శిక్షను BNS 308(2) లో 7 సంవత్సరాలకు పెంచారు.'
      },
      or: {
        title: 'ବଳପୂର୍ବକ ଆଦାୟ / ବଟି ଆଦାୟ (Extortion)',
        description: 'କୌଣସି ବ୍ୟକ୍ତିଙ୍କୁ କ୍ଷତି ପହଞ୍ଚାଇବାର ଭୟ ଦେଖାଇ ତାଙ୍କଠାରୁ ଅସାଧୁ ଭାବେ କୌଣସି ସମ୍ପତ୍ତି ବା ମୂଲ୍ୟବାନ ଦଲିଲ ଆଦାୟ କରିବା ଉଦ୍ୟାପନ (Extortion) ଅଟେ।',
        punishment: 'ସାଧାରଣ ବଟି ଆଦାୟ (308(2)): ୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍ + ଜରିମାନା; ମୃତ୍ୟୁ ଭୟ ଦେଖାଇଲେ (308(5)): ୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍',
        aiCommentary: 'ପୁରୁଣା IPC 384 ର ୩ ବର୍ଷ ଦଣ୍ଡକୁ ବୃଦ୍ଧି କରି BNS 308(2) ରେ ୭ ବର୍ଷ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '309',
    ipcEquivalent: 'IPC Sec 390 / 392 / 394',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory FSL scene inspection under Sec 176(3) BNSS; Test Identification Parade under Sec 54 BNSS.',
    bsaAdmissibility: 'TIP proceedings, CCTV footage, and weapon/loot recovery admissible under BSA.',
    ingredients: [
      'In all robbery there is either theft or extortion accompanied by instant death, instant hurt, or instant wrongful restraint (or fear thereof)'
    ],
    investigativeSteps: [
      'Summon FSL team to lift latent fingerprints and tool marks from the robbery scene.',
      'Conduct audio-video recorded Test Identification Parade (TIP) of arrested suspects.'
    ],
    translations: {
      en: {
        title: 'Robbery',
        description: 'In all robbery there is either theft or extortion. Theft is robbery if, in order to the committing of the theft, or in committing the theft, or in carrying away property obtained by the theft, the offender voluntarily causes or attempts to cause to any person death or hurt or wrongful restraint, or fear of instant death or instant hurt.',
        punishment: 'Rigorous Imprisonment up to 10 years + Fine (Highway robbery at night: up to 14 years RI; If hurt caused: Life or up to 10 years RI)',
        aiCommentary: 'Consolidates definition (IPC 390) and punishments (IPC 392, 393, 394) into Section 309 BNS.'
      },
      hi: {
        title: 'लूट (Robbery)',
        description: 'प्रत्येक लूट में या तो चोरी होती है या उद्यापन। यदि चोरी करने या चोरी की संपत्ति ले जाने में अपराधी किसी व्यक्ति को तत्काल मृत्यु, तत्काल उपहति या तत्काल सदोष अवरोध कारित करता है या उसका भय दिखाता है, तो वह लूट है।',
        punishment: '10 वर्ष तक कठोर कारावास + जुर्माना (रात्रि में राजमार्ग पर लूट: 14 वर्ष तक; चोट कारित होने पर: आजीवन कारावास तक)',
        aiCommentary: 'पुरानी आईपीसी की धाराओं 390, 392, 393 और 394 को एक ही धारा 309 में समेकित किया गया है।'
      },
      te: {
        title: 'దోపిడీ (Robbery)',
        description: 'ప్రతి దోపిడీలో దొంగతనం లేదా ఎక్స్‌టార్షన్ ఉంటుంది. దొంగతనం చేసేటప్పుడు నేరస్థుడు ఎవరికైనా తక్షణ మరణం, తక్షణ గాయం లేదా తక్షణ నిర్బంధం కలిగిస్తే లేదా ఆ భయాన్ని కలిగిస్తే అది దోపిడీ అవుతుంది.',
        punishment: '10 ఏళ్ల వరకు కఠిన కారాగార శిక్ష + జరిమానా (రాత్రిపూట రహదారిపై దోపిడీ: 14 ఏళ్ల వరకు; గాయపరిస్తే: జీవిత ఖైదు వరకు)',
        aiCommentary: 'పాత IPC సెక్షన్లు 390, 392, 393 మరియు 394 లను ఒకే సెక్షన్ 309 కిందకు చేర్చారు.'
      },
      or: {
        title: 'ଲୁଟ୍ (Robbery)',
        description: 'ପ୍ରତ୍ୟେକ ଲୁট୍‌ରେ ଚୋରି କିମ୍ବା ବଳପୂର୍ବକ ଆଦାୟ ଥାଏ। ଚୋରି କରିବା ସମୟରେ ଅପରାଧୀ ଯଦି କାହାକୁ ତତ୍କାଳ ମୃତ୍ୟୁ, ଆଘାତ ବା ଅବରୋଧ କରେ କିମ୍ବା ତାହାର ଭୟ ଦେଖାଏ, ତେବେ ତାହା ଲୁଟ୍ ଅଟେ।',
        punishment: '୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କଠୋର କାରାବାସ + ଜରିମାନା (ରାତିରେ ରାଜପଥରେ ଲୁଟ୍: ୧୪ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ; ଆଘାତ ଦେଲେ: ଆଜୀବନ କାରାବାସ ପର୍ଯ୍ୟନ୍ତ)',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 390, 392, 393 ଏବଂ 394 କୁ ଗୋଟିଏ ଧାରା 309 ରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '310',
    ipcEquivalent: 'IPC Sec 391 / 395 / 396',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory FSL scene inspection under Sec 176(3) BNSS; property attachment under Sec 107 BNSS.',
    bsaAdmissibility: 'Joint recovery panchnama, ballistic evidence, and TIP admissible under BSA.',
    ingredients: [
      'When five or more persons conjointly commit or attempt to commit a robbery, or where the whole number of persons conjointly committing or attempting to commit a robbery, and persons present and aiding such commission or attempt, amount to five or more'
    ],
    investigativeSteps: [
      'Establish presence and participation of 5 or more persons via CCTV, CDR tower dumps, and eyewitness TIP.',
      'Recover looted property under videographed Sec 105 BNSS panchnama.'
    ],
    translations: {
      en: {
        title: 'Dacoity (Including Dacoity with Murder)',
        description: 'When five or more persons conjointly commit or attempt to commit a robbery, every person so committing, attempting or aiding is said to commit "dacoity". Includes punishment for dacoity (310(2)), dacoity with murder (310(3)), making preparation to commit dacoity (310(4)), and assembling for dacoity (310(5)).',
        punishment: 'Dacoity: Life Imprisonment or up to 10 years RI + Fine; Dacoity with Murder (310(3)): Death, Life Imprisonment, or Min 10 years RI',
        aiCommentary: 'Consolidates IPC Sections 391, 395, 396, 399, and 402 into a comprehensive Dacoity code under Section 310 BNS.'
      },
      hi: {
        title: 'डकैती (हत्या सहित डकैती के उपबंधों सहित)',
        description: 'जब पांच या अधिक व्यक्ति संयुक्त रूप से लूट करते हैं या करने का प्रयत्न करते हैं, तो प्रत्येक व्यक्ति "डकैती" करता है। इसमें डकैती (310(2)), हत्या सहित डकैती (310(3)) और डकैती की तैयारी (310(4)) शामिल हैं।',
        punishment: 'डकैती: आजीवन कारावास या 10 वर्ष तक कठोर कारावास + जुर्माना; हत्या सहित डकैती (310(3)): मृत्युदण्ड या आजीवन कारावास',
        aiCommentary: 'पुरानी आईपीसी की धाराओं 391, 395, 396, 399 और 402 को एक ही धारा 310 में समेकित किया गया है।'
      },
      te: {
        title: 'బందిపోటు దొంగతనం / డకాయితీ (హత్యతో కూడిన డకాయితీతో సహా)',
        description: 'ఐదుగురు లేదా అంతకంటే ఎక్కువ మంది వ్యక్తులు కలిసి దోపిడీ చేస్తే లేదా ప్రయత్నిస్తే దానిని "డకాయితీ" (బందిపోటు దొంగతనం) అంటారు. ఇందులో డకాయితీ (310(2)), హత్యతో కూడిన డకాయితీ (310(3)) కూడా ఉన్నాయి.',
        punishment: 'డకాయితీ: జీవిత ఖైదు లేదా 10 ఏళ్ల కఠిన కారాగార శిక్ష + జరిమానా; హత్యతో కూడిన డకాయితీ (310(3)): మరణశిక్ష లేదా జీవిత ఖైదు',
        aiCommentary: 'పాత IPC సెక్షన్లు 391, 395, 396, 399 మరియు 402 లను ఒకే సెక్షన్ 310 లోకి చేర్చారు.'
      },
      or: {
        title: 'ଡକାୟତି (ହତ୍ୟା ସହିତ ଡକାୟତି ଅନ୍ତର୍ଭୁକ୍ତ)',
        description: 'ଯେତେବେଳେ ପାଞ୍ଚ କିମ୍ବା ତଦୂର୍ଦ୍ଧ୍ୱ ବ୍ୟକ୍ତି ମିଳିତ ଭାବେ ଲୁଟ୍ କରନ୍ତି ବା ଉଦ୍ୟମ କରନ୍ତି, ତାହାକୁ "ଡକାୟତି" କୁହାଯାଏ। ଏଥିରେ ଡକାୟତି (310(2)) ଏବଂ ହତ୍ୟା ସହ ଡକାୟତି (310(3)) ଅନ୍ତର୍ଭୁକ୍ତ।',
        punishment: 'ଡକାୟତି: ଆଜୀବନ କାରାବାସ ବା ୧୦ ବର୍ଷ କଠୋର କାରାବାସ + ଜରିମାନା; ହତ୍ୟା ସହ ଡକାୟତି (310(3)): ମୃତ୍ୟୁଦଣ୍ଡ ବା ଆଜୀବନ କାରାବାସ',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 391, 395, 396, 399 ଏବଂ 402 କୁ ଗୋଟିଏ ଧାରା 310 ରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '316',
    ipcEquivalent: 'IPC Sec 405 / 406 / 409',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Forensic accounting audit and attachment of misappropriated funds under Sec 107 BNSS.',
    bsaAdmissibility: 'Books of accounts and electronic banking ledgers admissible under Sec 28 & 63 BSA.',
    ingredients: [
      'Being in any manner entrusted with property, or with any dominion over property',
      'Dishonestly misappropriating or converting to own use that property in violation of law or legal contract'
    ],
    investigativeSteps: [
      'Seize entrustment contracts, audit ledgers, and bank account statements under Sec 94 BNSS.',
      'Note aggravated punishment under Sec 316(5) for public servants, bankers, merchants, or agents.'
    ],
    translations: {
      en: {
        title: 'Criminal breach of trust (Including by Public Servant, Banker or Agent)',
        description: 'Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to his own use that property, or dishonestly uses or disposes of that property in violation of any direction of law or legal contract.',
        punishment: 'General (316(2)): Up to 5 years + Fine; By Public Servant/Banker/Merchant/Agent (316(5)): Life Imprisonment or up to 10 years + Fine',
        aiCommentary: 'Increases punishment for general criminal breach of trust from 3 years (IPC 406) to 5 years (BNS 316(2)), and consolidates IPC 409 into Sec 316(5).'
      },
      hi: {
        title: 'आपराधिक न्यासभंग (लोक सेवक, बैंकर या अभिकर्ता द्वारा न्यासभंग सहित)',
        description: 'जो कोई संपत्ति या संपत्ति पर अख्तियार सौंपे जाने पर बेईमानी से उस संपत्ति का दुर्विनियोग करता है या उसे अपने उपयोग में संपरिवर्तित कर लेता है, वह आपराधिक न्यासभंग करता है।',
        punishment: 'सामान्य न्यासभंग (316(2)): 5 वर्ष तक कारावास + जुर्माना; लोक सेवक/बैंकर/एजेंट द्वारा (316(5)): आजीवन कारावास या 10 वर्ष तक + जुर्माना',
        aiCommentary: 'सामान्य अमानत में खयानत (IPC 406) की सजा को 3 वर्ष से बढ़ाकर 5 वर्ष किया गया है और धारा 409 को 316(5) में शामिल किया गया है।'
      },
      te: {
        title: 'నేరపూరిత నమ్మకద్రోహం (ప్రభుత్వ ఉద్యోగి, బ్యాంకర్ లేదా ఏజెంట్‌తో సహా)',
        description: 'తనకు అప్పగించిన ఆస్తిని లేదా ఆస్తిపై అధికారాన్ని నిజాయితీ లేకుండా సొంతానికి వాడుకోవడం లేదా చట్టబద్ధమైన ఒప్పందానికి విరుద్ధంగా దుర్వినియోగం చేయడం నేరపూరిత నమ్మకద్రోహం అవుతుంది.',
        punishment: 'సాధారణ నమ్మకద్రోహం (316(2)): 5 ఏళ్ల వరకు జైలు + జరిమానా; ప్రభుత్వ ఉద్యోగి/బ్యాంకర్ (316(5)): జీవిత ఖైదు లేదా 10 ఏళ్ల వరకు జైలు',
        aiCommentary: 'పాత IPC 406 శిక్షను 3 ఏళ్ల నుండి 5 ఏళ్లకు పెంచారు మరియు IPC 409 ని 316(5) లో విలీనం చేశారు.'
      },
      or: {
        title: 'ଅପରାଧିକ ବିଶ୍ୱାସଘାତକତା (ସରକାରୀ କର୍ମଚାରୀ, ବ୍ୟାଙ୍କର ବା ଏଜେଣ୍ଟଙ୍କ ସହିତ)',
        description: 'କୌଣସି ସମ୍ପତ୍ତିର ଦାୟିତ୍ୱ ନ୍ୟସ୍ତ ହୋଇଥିବା ବ୍ୟକ୍ତି ଯଦି ଅସାଧୁ ଭାବେ ସେହି ସମ୍ପତ୍ତିକୁ ଆତ୍ମସାତ୍ କରେ ବା ନିଜ ବ୍ୟବହାରରେ ଲଗାଏ, ତେବେ ତାହା ଅପରାଧିକ ବିଶ୍ୱାସଘାତକତା ଅଟେ।',
        punishment: 'ସାଧାରଣ (316(2)): ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍ + ଜରିମାନା; ସରକାରୀ କର୍ମଚାରୀ/ବ୍ୟାଙ୍କର (316(5)): ଆଜୀବନ ବା ୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍',
        aiCommentary: 'ପୁରୁଣା IPC 406 ର ୩ ବର୍ଷ ଦଣ୍ଡକୁ ୫ ବର୍ଷକୁ ବୃଦ୍ଧି କରାଯାଇଛି ଏବଂ IPC 409 କୁ 316(5) ରେ ଅନ୍ତର୍ଭୁକ୍ତ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '318',
    ipcEquivalent: 'IPC Sec 415 / 417 / 420',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Freeze fraudulent bank/UPI accounts under Sec 106/107 BNSS; NCRP 1930 cyber portal coordination.',
    bsaAdmissibility: 'Electronic banking logs, KYC records, and UPI transaction hashes admissible under Sec 63 BSA.',
    ingredients: [
      'Deceiving any person and fraudulently or dishonestly inducing the person so deceived to deliver any property (Sec 318(4))',
      'Fraudulent or dishonest intention must exist at the time of making the inducement'
    ],
    investigativeSteps: [
      'Obtain beneficiary KYC, IP login logs, and NPCI UPI money trail from banks.',
      'Initiate attachment and restitution of defrauded funds to victim under Sec 107 BNSS.'
    ],
    translations: {
      en: {
        title: 'Cheating (Including Cheating and dishonestly inducing delivery of property)',
        description: 'Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, commits "cheating". Under Sub-section (4) (equivalent to IPC 420), cheating and dishonestly inducing delivery of property or valuable security carries up to 7 years imprisonment.',
        punishment: 'Simple Cheating (318(2)): Up to 3 years + Fine; Inducing delivery of property (318(4)): Up to 7 years + Fine',
        aiCommentary: 'Replaces the iconic IPC Section 420 with BNS Section 318(4). Primary statutory charge for financial fraud, investment scams, and online payment fraud.'
      },
      hi: {
        title: 'छल / धोखाधड़ी (संपत्ति परिदत्त करने के लिए बेईमानी से उत्प्रेरित करने सहित)',
        description: 'जो कोई किसी व्यक्ति को प्रवंचित (धोखा देकर) करके कपटपूर्वक या बेईमानी से उस व्यक्ति को कोई संपत्ति किसी व्यक्ति को परिदत्त करने के लिए उत्प्रेरित करता है, वह "छल" करता है। उपधारा (4) (पूर्व आईपीसी 420 के समतुल्य) के अंतर्गत 7 वर्ष तक कारावास का प्रावधान है।',
        punishment: 'साधारण छल (318(2)): 3 वर्ष तक कारावास; संपत्ति की धोखाधड़ी (318(4)): 7 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'प्रसिद्ध आईपीसी धारा 420 का स्थान अब बीएनएस धारा 318(4) ने ले लिया है। वित्तीय धोखाधड़ी और साइबर ठगी में प्रयुक्त मुख्य धारा।'
      },
      te: {
        title: 'మోసం / చీటింగ్ (ఆస్తిని ఇచ్చేలా నిజాయితీ లేకుండా ప్రేరేపించడంతో సహా)',
        description: 'ఎవరినైనా మోసగించి, కుట్రపూరితంగా లేదా నిజాయితీ లేకుండా వారి నుండి ఆస్తిని లేదా విలువైన పత్రాన్ని రాబట్టుకోవడం "చీటింగ్" నేరం అవుతుంది. ఉప-సెక్షన్ (4) (పాత IPC 420 కి సమానం) కింద 7 ఏళ్ల వరకు జైలు శిక్ష పడుతుంది.',
        punishment: 'సాధారణ చీటింగ్ (318(2)): 3 ఏళ్ల వరకు జైలు; ఆస్తి మోసం (318(4)): 7 ఏళ్ల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'ప్రసిద్ధ IPC సెక్షన్ 420 స్థానంలో ఇప్పుడు BNS సెక్షన్ 318(4) అమలులోకి వచ్చింది. ఆర్థిక మరియు ఆన్‌లైన్ మోసాల కేసుల్లో ఇది ప్రధాన సెక్షన్.'
      },
      or: {
        title: 'ଠକେଇ / ପ୍ରତାରଣା (ସମ୍ପତ୍ତି ହସ୍ତାନ୍ତର ପାଇଁ ଅସାଧୁ ପ୍ରରୋଚନା ସହିତ)',
        description: 'କୌଣସି ବ୍ୟକ୍ତିଙ୍କୁ ପ୍ରତାରଣା କରି କপଟ ବା ଅସାଧୁ ଭାବେ ସମ୍ପତ୍ତି ହସ୍ତାନ୍ତର କରିବାକୁ ପ୍ରേരിତ କରିବା "ଠକେଇ" (Cheating) ଅଟେ। ଉପ-ଧାରା (୪) (ପୂର୍ବ IPC 420 ସହ ସମାନ) ଅନୁযାୟୀ ୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ହେବ।',
        punishment: 'ସାଧାରଣ ଠକେଇ (318(2)): ୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍; ସମ୍ପତ୍ତି ଠକେଇ (318(4)): ୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 420 ବଦଳରେ ଏବେ BNS ଧାରା 318(4) ଲାଗୁ ହୋଇଛି। ଆର୍ଥିକ ଓ ଅନଲାଇନ୍ ଠକେଇ ମାମଲାରେ ଏହା ମୁଖ୍ୟ ଧାରା।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '319',
    ipcEquivalent: 'IPC Sec 416 / 419',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Often read with Sec 66D of IT Act 2000 for online impersonation, OTP phishing, and "Digital Arrest" scams.',
    bsaAdmissibility: 'Spoofed caller IDs, fake profiles, and IP logs admissible under Sec 63 BSA.',
    ingredients: [
      'Cheating by pretending to be some other person, or by knowingly substituting one person for another, or representing that he or any other person is a person other than he or such other person really is'
    ],
    investigativeSteps: [
      'Collect telecom CDR/IPDR of spoofed calls and fake social media/WhatsApp profiles.',
      'Combine with BNS 318(4) and IT Act 66D for cyber impersonation frauds.'
    ],
    translations: {
      en: {
        title: 'Cheating by personation (Impersonation & Cyber Phishing)',
        description: 'A person is said to "cheat by personation" if he cheats by pretending to be some other person, or by knowingly substituting one person for another, or representing that he or any other person is a person other than he or such other person really is.',
        punishment: 'Imprisonment up to 5 years, or Fine, or both',
        aiCommentary: 'Enhances punishment from 3 years (IPC 419) to 5 years (BNS 319(2)) to combat cyber impersonation, fake police/official calls, and phishing.'
      },
      hi: {
        title: 'प्रतिरूपण द्वारा छल (भेष बदलकर या फर्जी पहचान से ठगी)',
        description: 'कोई व्यक्ति "प्रतिरूपण द्वारा छल" करता है यदि वह कोई अन्य व्यक्ति होने का स्वांग (ढोंग) करके, या जानबूझकर एक व्यक्ति के स्थान पर दूसरे व्यक्ति को रखकर छल करता है।',
        punishment: '5 वर्ष तक का कारावास, या जुर्माना, या दोनों',
        aiCommentary: 'साइबर प्रतिरूपण (फर्जी अधिकारी बनकर ठगी / डिजिटल अरेस्ट स्कैम) से निपटने के लिए सजा को 3 वर्ष (IPC 419) से बढ़ाकर 5 वर्ष किया गया है।'
      },
      te: {
        title: 'మారువేషం / నకిలీ గుర్తింపు ద్వారా మోసం (Cheating by Personation)',
        description: 'మరొక వ్యక్తిగా నటిస్తూ లేదా ఒక వ్యక్తికి బదులుగా మరొకరిని ప్రవేశపెట్టి లేదా నకిలీ గుర్తింపుతో మోసం చేస్తే దానిని "చీటింగ్ బై పర్సనేషన్" అంటారు.',
        punishment: '5 సంవత్సరాల వరకు జైలు శిక్ష, లేదా జరిమానా, లేదా రెండూ',
        aiCommentary: 'నకిలీ అధికారుల పేరుతో జరిగే సైబర్ మోసాలను అరికట్టడానికి పాత IPC 419 లోని 3 ఏళ్ల శిక్షను 5 ఏళ్లకు పెంచారు.'
      },
      or: {
        title: 'ଛଦ୍ମବେଶ / ନକଲି ପରିଚୟ ଦ୍ୱାରା ଠକେଇ (Cheating by Personation)',
        description: 'ଅନ୍ୟ କୌଣସି ବ୍ୟକ୍ତି ହେବାର ଅଭିନୟ କରି କିମ୍ବା ଜାଣିଶୁଣି ଜଣଙ୍କ ସ୍ଥାନରେ ଅନ୍ୟ ଜଣଙ୍କୁ ଉପସ୍ଥାପନ କରି ଠକେଇ କରିବା।',
        punishment: '୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ, କିମ୍ବା ଜରିମାନା, କିମ୍ବା ଉଭୟ',
        aiCommentary: 'ନକଲି ଅଧିକାରୀ ସାଜି ସାଇବର ଠକେଇ ରୋକିବା ପାଇଁ ଦଣ୍ଡକୁ ୩ ବର୍ଷ (IPC 419) ରୁ ୫ ବର୍ଷକୁ ବୃଦ୍ଧି କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '324',
    ipcEquivalent: 'IPC Sec 425 / 426 / 427 / 435 / 436',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate (Court of Session for Arson under 326)',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Damage valuation panchnama and photographs/video of destroyed property.',
    bsaAdmissibility: 'Valuation certificates and scene photographs admissible under BSA.',
    ingredients: [
      'With intent to cause, or knowing that he is likely to cause, wrongful loss or damage to the public or to any person, causing the destruction of any property or change in situation diminishing its value or utility'
    ],
    investigativeSteps: [
      'Conduct official loss/damage valuation to determine applicable sub-section (Rs 20,000 or Rs 1 Lakh thresholds).'
    ],
    translations: {
      en: {
        title: 'Mischief (Destruction or damage to property)',
        description: 'Whoever with intent to cause, or knowing that he is likely to cause, wrongful loss or damage to the public or to any person, causes the destruction of any property, or any such change in any property as destroys or diminishes its value or utility, commits "mischief".',
        punishment: 'General: Up to 6 months; Loss Rs 20,000 to Rs 1 Lakh (324(4)): Up to 2 years; Loss > Rs 1 Lakh (324(5)): Up to 5 years + Fine',
        aiCommentary: 'Updates archaic Rs 50 damage thresholds from IPC 427 to realistic modern thresholds of Rs 20,000 and Rs 1,00,000.'
      },
      hi: {
        title: 'रिष्टि (संपत्ति को नुकसान या तोड़फोड़ करना)',
        description: 'जो कोई लोक या किसी व्यक्ति को सदोष हानि या नुकसान कारित करने के आशय से किसी संपत्ति का नाश करता है या उसकी उपयोगिता या मूल्य कम करता है, वह "रिष्टि" (Mischief) करता है।',
        punishment: 'सामान्य: 6 माह तक; 20,000 से 1 लाख रु. की हानि (324(4)): 2 वर्ष तक; 1 लाख रु. से अधिक हानि (324(5)): 5 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 427 की 50 रुपये की सीमा को आधुनिक बनाते हुए 20,000 रु. और 1 लाख रु. के स्तर निर्धारित किए गए हैं।'
      },
      te: {
        title: 'ఆస్తి నష్టం / విధ్వంసం (Mischief)',
        description: 'ప్రజలకు లేదా ఏదైనా వ్యక్తికి నష్టం కలిగించే ఉద్దేశ్యంతో ఆస్తిని ధ్వంసం చేయడం లేదా దాని విలువ/ప్రయోజనాన్ని తగ్గించేలా మార్పు చేయడం "మిస్చీఫ్" నేరం అవుతుంది.',
        punishment: 'సాధారణ: 6 నెలలు; రూ. 20 వేల నుండి 1 లక్ష నష్టం (324(4)): 2 ఏళ్లు; రూ. 1 లక్ష పైబడి నష్టం (324(5)): 5 ఏళ్ల వరకు జైలు + జరిమానా',
        aiCommentary: 'పాత IPC 427 లోని రూ. 50 పరిమితిని మార్చి రూ. 20,000 మరియు రూ. 1 లక్ష ఆస్తి నష్టం శ్లాబులను ప్రవేశపెట్టారు.'
      },
      or: {
        title: 'ସମ୍ପତ୍ତି ନଷ୍ଟ ବା କ୍ଷତି ଘଟାଇବା (Mischief)',
        description: 'ଜନସାଧାରଣ ବା କୌଣସି ବ୍ୟକ୍ତିଙ୍କର କ୍ଷତି କରିବା ଉଦ୍ଦେଶ୍ୟରେ କୌଣସି ସମ୍ପତ୍ତିକୁ ନଷ୍ଟ କରିବା କିମ୍ବା ତାହାର ମୂଲ୍ୟ ଓ ଉପଯୋଗିତା ହ୍ରାସ କରିବା।',
        punishment: 'ସାଧାରଣ: ୬ ମାସ; ୨୦ ହଜାରରୁ ୧ ଲକ୍ଷ ଟଙ୍କା କ୍ଷତି (324(4)): ୨ ବର୍ଷ; ୧ ଲକ୍ଷ ଟଙ୍କାରୁ ଅଧିକ କ୍ଷତି (324(5)): ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC 427 ର ୫୦ ଟଙ୍କା ସୀମା ବଦଳରେ ୨୦,୦୦୦ ଟଙ୍କା ଓ ୧ ଲକ୍ଷ ଟଙ୍କାର ଆଧୁନିକ କ୍ଷତି ସୀମା ଧାର୍ଯ୍ୟ ହୋଇଛି।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '329',
    ipcEquivalent: 'IPC Sec 441 / 442 / 447 / 448',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Verify possession documents, boundary records, and CCTV of unlawful entry.',
    bsaAdmissibility: 'Revenue/municipal possession records and video footage admissible under BSA.',
    ingredients: [
      'Entering into or upon property in the possession of another with intent to commit an offence or to intimidate, insult or annoy any person in possession of such property',
      'Sub-section (2) defines House-trespass (entering any building, tent or vessel used as a human dwelling)'
    ],
    investigativeSteps: [
      'Verify actual physical possession of complainant and document forced entry signs.'
    ],
    translations: {
      en: {
        title: 'Criminal trespass and house-trespass',
        description: 'Whoever enters into or upon property in the possession of another with intent to commit an offence or to intimidate, insult or annoy any person in possession of such property, or having lawfully entered unlawfully remains there with such intent, commits "criminal trespass". Entering a human dwelling, place of worship, or custody of property is "house-trespass".',
        punishment: 'Criminal Trespass (329(3)): Up to 3 months or Rs 5,000 fine; House-Trespass (329(4)): Up to 1 year or Rs 5,000 fine',
        aiCommentary: 'Unifies IPC Sections 441, 442, 447, and 448 into a single comprehensive section on trespass and house-trespass.'
      },
      hi: {
        title: 'आपराधिक अतिचार और गृह-अतिचार (Criminal & House Trespass)',
        description: 'जो कोई किसी दूसरे के कब्जे वाली संपत्ति में कोई अपराध करने या कब्जाधारी को अपमानित, अभित्रासित या क्षुब्ध करने के आशय से प्रवेश करता है, वह "आपराधिक अतिचार" करता है। मानव निवास में ऐसा प्रवेश "गृह-अतिचार" है।',
        punishment: 'आपराधिक अतिचार (329(3)): 3 माह तक या 5,000 रु. जुर्माना; गृह-अतिचार (329(4)): 1 वर्ष तक कारावास या 5,000 रु. जुर्माना',
        aiCommentary: 'पुरानी आईपीसी की धाराओं 441, 442, 447 और 448 को एक ही धारा 329 में समेकित किया गया है।'
      },
      te: {
        title: 'నేరపూరిత అతిక్రమణ మరియు గృహ అతిక్రమణ (Criminal & House Trespass)',
        description: 'నేరం చేసే ఉద్దేశ్యంతో లేదా ఆస్తి కలిగి ఉన్న వ్యక్తిని బెదిరించడానికి, అవమానించడానికి ఇతరుల ఆస్తిలోకి ప్రవేశించడం "నేరపూరిత అతిక్రమణ". నివాస గృహంలోకి ఇలా ప్రవేశించడం "గృహ అతిక్రమణ" అవుతుంది.',
        punishment: 'నేరపూరిత అతిక్రమణ (329(3)): 3 నెలల జైలు లేదా రూ. 5,000 జరిమానా; గృహ అతిక్రమణ (329(4)): 1 ఏడాది జైలు లేదా రూ. 5,000 జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్లు 441, 442, 447 మరియు 448 లను ఒకే సెక్షన్ 329 కిందకు తీసుకువచ్చారు.'
      },
      or: {
        title: 'ଅପରାଧିକ ଅନୁପ୍ରବେଶ ଏବଂ ଗୃହ-ଅନୁପ୍ରବେଶ (Criminal & House Trespass)',
        description: 'ଅପରାଧ କରିବା କିମ୍ବା ଦଖଲదारଙ୍କୁ ଭୟଭୀତ ବା ଅପମାନିତ କରିବା ଉଦ୍ଦେଶ୍ୟରେ ଅନ୍ୟର ସମ୍ପତ୍ତିରେ ପ୍ରବେଶ କରିବା "ଅପରାଧିକ ଅନୁପ୍ରବେଶ" ଏବଂ ବାସଗୃହରେ ପ୍ରବେଶ କରିବା "ଗୃହ-ଅନୁପ୍ରବେଶ" ଅଟେ।',
        punishment: 'ଅପରାଧିକ ଅନୁପ୍ରବେଶ (329(3)): ୩ ମାସ ବା ୫,୦୦୦ ଟଙ୍କା ଜରିମାନା; ଗୃହ-ଅନୁପ୍ରବେଶ (329(4)): ୧ ବର୍ଷ ବା ୫,୦୦୦ ଟଙ୍କା ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 441, 442, 447 ଓ 448 କୁ ଗୋଟିଏ ଧାରା 329 ରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '331',
    ipcEquivalent: 'IPC Sec 453 / 454 / 456 / 457',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory FSL fingerprint and tool-mark lifting under Sec 176(3) BNSS where punishment exceeds 7 years.',
    bsaAdmissibility: 'Latent fingerprint comparison and tool-mark expert reports admissible under Sec 39 BSA.',
    ingredients: [
      'Committing lurking house-trespass or house-breaking (burglary) by day or by night',
      'Aggravated sentences where committed in order to commit an offence punishable with imprisonment or theft'
    ],
    investigativeSteps: [
      'Preserve broken locks, latches, and entry points untouched for FSL fingerprint/tool-mark lifting.',
      'Cross-match Modus Operandi (MO) with habitual burglary offender database.'
    ],
    translations: {
      en: {
        title: 'Punishment for house-trespass or house-breaking (Burglary by Day or Night)',
        description: 'Whoever commits lurking house-trespass or house-breaking shall be punished up to 2 years (or 3 years by night). If committed in order to commit theft, punishable up to 10 years (or up to 14 years if committed by night under Sec 331(4)).',
        punishment: 'General: 2 to 3 years; For Theft by Day (331(3)): Up to 10 years + Fine; For Theft by Night (331(4)): Up to 14 years + Fine',
        aiCommentary: 'Consolidates IPC Sections 453–458 into a single structured burglary statute.'
      },
      hi: {
        title: 'प्रच्छन्न गृह-अतिचार या गृह-भेदन (सेंधमारी / नकबजनी) के लिए दण्ड',
        description: 'जो कोई प्रच्छन्न गृह-अतिचार या गृह-भेदन (ताला तोड़कर या सेंध लगाकर घर में घुसना) करता है, वह दण्डनीय होगा। यदि चोरी करने के लिए दिन में किया जाए तो 10 वर्ष तक और रात्रि में किया जाए (331(4)) तो 14 वर्ष तक कारावास का दण्ड है।',
        punishment: 'सामान्य: 2 से 3 वर्ष; दिन में चोरी हेतु (331(3)): 10 वर्ष तक; रात्रि में चोरी हेतु (331(4)): 14 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी की धाराओं 453 से 458 (नकबजनी) को एक ही धारा 331 में समेकित किया गया है।'
      },
      te: {
        title: 'ఇల్లు పగలగొట్టి ప్రవేశించడం / కన్నం వేయడం (House-Breaking / Burglary)',
        description: 'రహస్యంగా లేదా తాళాలు పగలగొట్టి ఇంట్లోకి ప్రవేశించడం (గృహ భేదనం) నేరం. దొంగతనం కోసం పగటిపూట చేస్తే 10 ఏళ్ల వరకు, రాత్రిపూట చేస్తే (331(4)) 14 ఏళ్ల వరకు జైలు శిక్ష విధించబడుతుంది.',
        punishment: 'సాధారణ: 2-3 ఏళ్లు; పగటిపూట దొంగతనం కోసం (331(3)): 10 ఏళ్ల వరకు; రాత్రిపూట దొంగతనం కోసం (331(4)): 14 ఏళ్ల వరకు జైలు + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్లు 453 నుండి 458 వరకు ఉన్న గృహ భేదన చట్టాలను ఒకే సెక్షన్ 331 లోకి చేర్చారు.'
      },
      or: {
        title: 'ଗୃହ-ଭେଦନ / ସିନ୍ଧି ଚୋରି (House-Breaking / Burglary)',
        description: 'ଲୁଚିଛପି କିମ୍ବା ତାଲା ଭାଙ୍ଗି ଗୃହ-ଭେଦନ କରିବା ଦଣ୍ଡନୀୟ ଅଟେ। ଚୋରି କରିବା ଉଦ୍ଦେଶ୍ୟରେ ଦିନରେ କଲେ ୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଏବଂ ରାତିରେ କଲେ (331(4)) ୧୪ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ହେବ।',
        punishment: 'ସାଧାରଣ: ୨-୩ ବର୍ଷ; ଦିନରେ ଚୋରି ପାଇଁ (331(3)): ୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ; ରାତିରେ ଚୋରି ପାଇଁ (331(4)): ୧୪ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 453 ରୁ 458 କୁ ଗୋଟିଏ ଧାରା 331 ରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVIII',
    chapterName: {
      en: 'Of Offences Relating to Documents and to Property Marks',
      hi: 'दस्तावेजों और संपत्ति चिह्नों से संबंधित अपराध',
      te: 'పత్రాలు మరియు ఆస్తి గుర్తులకు సంబంధించిన నేరాలు',
      or: 'ଦଲିଲ ଏବଂ ସମ୍ପତ୍ତି ଚିହ୍ନ ସମ୍ବନ୍ଧୀୟ ଅପରାଧ'
    },
    section: '336',
    ipcEquivalent: 'IPC Sec 463 / 465 / 468 / 469',
    category: 'Forgery, Intimidation & Defamation',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Obtain specimen signatures/handwriting or digital hash under Sec 349 BNSS for FSL Questioned Document examination.',
    bsaAdmissibility: 'Handwriting/digital signature expert opinion admissible under Sec 39 & 41 BSA.',
    ingredients: [
      'Making any false document or false electronic record with intent to cause damage or injury to the public or to any person, or to support any claim or title, or with intent to commit fraud'
    ],
    investigativeSteps: [
      'Seize original questioned document / electronic record and obtain specimen signatures under Sec 349 BNSS.',
      'Submit to State/Central FSL Questioned Documents Division.'
    ],
    translations: {
      en: {
        title: 'Forgery (Including Forgery for purpose of Cheating)',
        description: 'Whoever makes any false document or false electronic record or part of a document or electronic record, with intent to cause damage or injury to the public or to any person, or to support any claim or title, or to cause any person to part with property, commits forgery. Under Sec 336(3) (formerly IPC 468), forgery for the purpose of cheating carries up to 7 years imprisonment.',
        punishment: 'Simple Forgery (336(2)): Up to 2 years + Fine; Forgery for Cheating (336(3)): Up to 7 years + Fine',
        aiCommentary: 'Consolidates IPC Sections 463, 465, 468, and 469, explicitly covering both physical documents and electronic/digital records.'
      },
      hi: {
        title: 'कूटकरण / जालसाजी (छल के प्रयोजन से कूटकरण सहित)',
        description: 'जो कोई लोक या किसी व्यक्ति को नुकसान या क्षति कारित करने या किसी दावे का समर्थन करने या कपट करने के आशय से कोई मिथ्या दस्तावेज या मिथ्या इलेक्ट्रॉनिक अभिलेख बनाता है, वह कूटकरण (जालसाजी) करता है।',
        punishment: 'साधारण कूटकरण (336(2)): 2 वर्ष तक; छल के प्रयोजन से कूटकरण (336(3)): 7 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी की धाराओं 463, 465, 468 और 469 को समेकित करता है तथा डिजिटल/इलेक्ट्रॉनिक रिकॉर्ड की जालसाजी को भी कवर करता है।'
      },
      te: {
        title: 'ఫోర్జరీ / నకిలీ పత్రాల సృష్టి (మోసం కోసం ఫోర్జరీతో సహా)',
        description: 'ప్రజలకు లేదా ఏదైనా వ్యక్తికి నష్టం కలిగించే ఉద్దేశ్యంతో లేదా మోసం చేయడానికి నకిలీ పత్రం లేదా నకిలీ ఎలక్ట్రానిక్ రికార్డును సృష్టిస్తే అది ఫోర్జరీ నేరం అవుతుంది.',
        punishment: 'సాధారణ ఫోర్జరీ (336(2)): 2 ఏళ్ల వరకు; చీటింగ్ కోసం ఫోర్జరీ (336(3)): 7 ఏళ్ల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్లు 463, 465, 468 మరియు 469 లను కలిపి భౌతిక మరియు ఎలక్ట్రానిక్ రికార్డుల ఫోర్జరీని కవర్ చేస్తుంది.'
      },
      or: {
        title: 'ଜାଲିଆତି / ଫୋର୍ଜରି (ଠକେଇ ଉଦ୍ଦେଶ୍ୟରେ ଜାଲିଆତି ସହିତ)',
        description: 'ଜନସାଧାରଣ ବା କୌଣସି ବ୍ୟକ୍ତିଙ୍କର କ୍ଷତି କରିବା କିମ୍ବା ଠକେଇ କରିବା ଉଦ୍ଦେଶ୍ୟରେ ମିଥ୍ୟା ଦଲିଲ ବା ମିଥ୍ୟା ଇଲେକ୍ଟ୍ରୋନିକ୍ ରେକର୍ଡ ତିଆରି କରିବା ଜାଲିଆତି (Forgery) ଅଟେ।',
        punishment: 'ସାଧାରଣ ଜାଲିଆତି (336(2)): ୨ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ; ଠକେଇ ପାଇଁ ଜାଲିଆତି (336(3)): ୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 463, 465, 468 ଓ 469 କୁ ଏକତ୍ର କରି କାଗଜପତ୍ର ଓ ଡିଜିଟାଲ୍ ରେକର୍ଡ ଜାଲିଆତିକୁ ଅନ୍ତର୍ଭୁକ୍ତ କରେ।'
      }
    }
  },
  {
    chapter: 'XIX',
    chapterName: {
      en: 'Of Criminal Intimidation, Insult, Annoyance, Defamation, etc.',
      hi: 'आपराधिक अभित्रास, अपमान, क्षोभ, मानहानि आदि',
      te: 'నేరపూరిత బెదిరింపు, అవమానం, పరువు నష్టం మొదలైనవి',
      or: 'ଅପରାଧିକ ଧମକ, ଅପମାନ, ମାନହାନି ଇତ୍ୟାଦି'
    },
    section: '351',
    ipcEquivalent: 'IPC Sec 503 / 506 / 507',
    category: 'Forgery, Intimidation & Defamation',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate (First Class for Death/Grievous Hurt threats)',
    forensicMandatory7Yr: false,
    bnssProcedure: 'If clubbed with any cognizable offence, the entire case is investigated as Cognizable under Sec 174(4) BNSS.',
    bsaAdmissibility: 'Threatening call recordings, messages, and witness statements admissible under BSA.',
    ingredients: [
      'Threatening another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person',
      'Enhanced punishment under Sec 351(3) if threat is to cause death or grievous hurt or destruction of property by fire'
    ],
    investigativeSteps: [
      'Preserve audio recordings, messages, or letters containing the threat.',
      'Assess immediate threat perception to victim/witness and provide witness protection if required.'
    ],
    translations: {
      en: {
        title: 'Criminal intimidation',
        description: 'Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person, or to cause that person to do any act which he is not legally bound to do, commits criminal intimidation.',
        punishment: 'General (351(2)): Up to 2 years or Fine; Threat to cause death or grievous hurt (351(3)): Up to 7 years, or Fine, or both',
        aiCommentary: 'Consolidates IPC Sections 503, 506, and 507 into Section 351 BNS.'
      },
      hi: {
        title: 'आपराधिक अभित्रास (जान-माल की धमकी देना)',
        description: 'जो कोई किसी दूसरे व्यक्ति को उसके शरीर, ख्याति या संपत्ति को क्षति पहुंचाने की धमकी इस आशय से देता है कि उसे संत्रास (भय) कारित हो, वह आपराधिक अभित्रास करता है।',
        punishment: 'सामान्य धमकी (351(2)): 2 वर्ष तक; जान से मारने या गंभीर चोट की धमकी (351(3)): 7 वर्ष तक कारावास या जुर्माना या दोनों',
        aiCommentary: 'पुरानी आईपीसी धारा 503, 506 और 507 को एक ही धारा 351 में समेकित किया गया है।'
      },
      te: {
        title: 'నేరపూరిత బెదిరింపు (Criminal Intimidation)',
        description: 'ఒక వ్యక్తిలో భయాందోళన కలిగించే ఉద్దేశ్యంతో అతని శరీరానికి, పరువుకు లేదా ఆస్తికి హాని కలిగిస్తానని బెదిరించడం నేరపూరిత బెదిరింపు అవుతుంది.',
        punishment: 'సాధారణ బెదిరింపు (351(2)): 2 ఏళ్ల వరకు జైలు; చంపుతానని లేదా తీవ్ర గాయం చేస్తానని బెదిరిస్తే (351(3)): 7 ఏళ్ల వరకు జైలు శిక్ష',
        aiCommentary: 'పాత IPC సెక్షన్లు 503, 506 మరియు 507 లను ఒకే సెక్షన్ 351 కిందకు చేర్చారు.'
      },
      or: {
        title: 'ଅପରାଧିକ ଧମକ (Criminal Intimidation)',
        description: 'କୌଣସି ବ୍ୟକ୍ତିଙ୍କୁ ଭୟଭୀତ କରିବା ଉଦ୍ଦେଶ୍ୟରେ ତାଙ୍କର ଶରୀର, ସମ୍ମାନ କିମ୍ବା ସମ୍ପତ୍ତିର କ୍ଷତି କରିବାକୁ ଧମକ ଦେବା ଅପରାଧିକ ଧମକ ଅଟେ।',
        punishment: 'ସାଧାରଣ ଧମକ (351(2)): ୨ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍; ଜୀବନରୁ ମାରିदेବା ବା ଗୁରୁତର ଆଘାତ ଧମକ (351(3)): ୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 503, 506 ଓ 507 କୁ ଗୋଟିଏ ଧାରା 351 ରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XIX',
    chapterName: {
      en: 'Of Criminal Intimidation, Insult, Annoyance, Defamation, etc.',
      hi: 'आपराधिक अभित्रास, अपमान, क्षोभ, मानहानि आदि',
      te: 'నేరపూరిత బెదిరింపు, అవమానం, పరువు నష్టం మొదలైనవి',
      or: 'ଅପରାଧିକ ଧମକ, ଅପମାନ, ମାନହାନି ଇତ୍ୟାଦି'
    },
    section: '353',
    ipcEquivalent: 'IPC Sec 505 (Expanded to include Fake News / Electronic Means)',
    category: 'Forgery, Intimidation & Defamation',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Preserve viral social media posts, deepfakes, or false broadcasts with hash certificates.',
    bsaAdmissibility: 'Electronic server logs and metadata admissible under Sec 63 BSA.',
    ingredients: [
      'Making, publishing or circulating any statement, false information, rumour, or report, including through electronic means',
      'With intent to cause fear or alarm to the public, or incite any class or community to commit an offence against another class or community'
    ],
    investigativeSteps: [
      'Issue notice to intermediary platform to preserve origin IP logs and account metadata.',
      'Document official fact-check refuting the false rumour.'
    ],
    translations: {
      en: {
        title: 'Statements conducing to public mischief (Including Fake News & Electronic Rumours)',
        description: 'Whoever makes, publishes or circulates any statement, false information, rumour, or report, including through electronic means, with intent to cause fear or alarm to the public, or to induce any person to commit an offence against the State or against the public tranquillity, or to incite any class or community.',
        punishment: 'Imprisonment up to 3 years, or Fine, or both (In place of worship: up to 5 years + Fine)',
        aiCommentary: 'Explicitly adds "false information... including through electronic means" to combat viral fake news and deepfakes designed to trigger public panic or communal unrest.'
      },
      hi: {
        title: 'लोक रिष्टि कारित करने वाले कथन (फेक न्यूज एवं इलेक्ट्रॉनिक अफवाहों सहित)',
        description: 'जो कोई इलेक्ट्रॉनिक माध्यमों सहित कोई ऐसा कथन, मिथ्या सूचना (फेक न्यूज), अफवाह या रिपोर्ट बनाता, प्रकाशित या परिचालित करता है जिसका आशय जनता में भय या संत्रास फैलाना या किसी वर्ग या समुदाय को अपराध के लिए उकसाना हो।',
        punishment: '3 वर्ष तक का कारावास, या जुर्माना, या दोनों (पूजा स्थल में: 5 वर्ष तक + जुर्माना)',
        aiCommentary: 'डिजिटल माध्यमों से फर्जी खबरें (Fake News) और अफवाहें फैलाकर सार्वजनिक अशांति पैदा करने वालों पर कार्यवाही के लिए विशेष प्रावधान।'
      },
      te: {
        title: 'ప్రజా అశాంతిని కలిగించే ప్రకటనలు (ఫేక్ న్యూస్ & ఎలక్ట్రానిక్ వదంతులతో సహా)',
        description: 'ప్రజల్లో భయాందోళనలు సృష్టించడానికి లేదా ఒక వర్గాన్ని మరొక వర్గంపై రెచ్చగొట్టడానికి ఎలక్ట్రానిక్ మాధ్యమాల ద్వారా సహా ఏదైనా తప్పుడు సమాచారం (ఫేక్ న్యూస్), పుకారు లేదా నివేదికను ప్రచురించడం లేదా ప్రచారం చేయడం.',
        punishment: '3 ఏళ్ల వరకు జైలు శిక్ష, లేదా జరిమానా, లేదా రెండూ (ప్రార్థనా స్థలంలో: 5 ఏళ్ల వరకు + జరిమానా)',
        aiCommentary: 'సోషల్ మీడియా ద్వారా ఫేక్ న్యూస్ మరియు పుకార్లు వ్యాప్తి చేసి శాంతిభద్రతలకు విఘాతం కలిగించే వారిపై చర్యకు ఈ సెక్షన్ ఉపయోగపడుతుంది.'
      },
      or: {
        title: 'ଜନ ଅଶାନ୍ତି ସୃଷ୍ଟି କରୁଥିବା ମନ୍ତବ୍ୟ (ଫେକ୍ ନ୍ୟୁଜ୍ ଏବଂ ଇଲେକ୍ଟ୍ରୋନିକ୍ ଗୁଜବ ସହିତ)',
        description: 'ଜନସାଧାରଣଙ୍କ ମଧ୍ୟରେ ଭୟ ସୃଷ୍ଟି କରିବା କିମ୍ବା ଗୋষ্ঠୀ ସଂଘର୍ଷ ଉସୁକାଇବା ଉଦ୍ଦେଶ୍ୟରେ ଇଲେକ୍ଟ୍ରୋନିକ୍ ମାଧ୍ୟମ ସହିତ କୌଣସି ମିଥ୍ୟା ସୂଚନା (Fake News) ବା ଗୁଜବ ପ୍ରଚାର କରିବା।',
        punishment: '୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ, କିମ୍ବା ଜରିମାନା, କିମ୍ବା ଉଭୟ (ଉପାସନା ସ୍ଥଳରେ: ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ + ଜରିମାନା)',
        aiCommentary: 'ଡିଜିଟାଲ୍ ମାଧ୍ୟମରେ ମିଥ୍ୟା ଖବର ଓ ଗୁଜବ ପ୍ରଚାର କରି ଅଶାନ୍ତି ସୃଷ୍ଟି କରୁଥିବା ବ୍ୟକ୍ତିଙ୍କ ବିରୁଦ୍ଧରେ କଠୋର ବ୍ୟବସ୍ଥା।'
      }
    }
  },
  {
    chapter: 'XIX',
    chapterName: {
      en: 'Of Criminal Intimidation, Insult, Annoyance, Defamation, etc.',
      hi: 'आपराधिक अभित्रास, अपमान, क्षोभ, मानहानि आदि',
      te: 'నేరపూరిత బెదిరింపు, అవమానం, పరువు నష్టం మొదలైనవి',
      or: 'ଅପରାଧିକ ଧମକ, ଅପମାନ, ମାନହାନି ଇତ୍ୟାଦି'
    },
    section: '356',
    ipcEquivalent: 'IPC Sec 499 / 500',
    category: 'Forgery, Intimidation & Defamation',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'Magistrate of the First Class / Court of Session',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Cognizance taken upon complaint made by the aggrieved person under Sec 222 BNSS.',
    bsaAdmissibility: 'Published print or electronic imputations admissible under BSA.',
    ingredients: [
      'By words either spoken or intended to be read, or by signs or by visible representations, making or publishing any imputation concerning any person intending to harm, or knowing that such imputation will harm, the reputation of such person (subject to 10 statutory exceptions)'
    ],
    investigativeSteps: [
      'Preserve published material/broadcast and verify applicability of the 10 statutory exceptions.'
    ],
    translations: {
      en: {
        title: 'Defamation',
        description: 'Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes in any manner any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said to defame that person.',
        punishment: 'Simple Imprisonment up to 2 years, or Fine, or both, or Community Service',
        aiCommentary: 'Consolidates IPC 499 and 500, and explicitly introduces "Community Service" as an alternative sentencing option for criminal defamation.'
      },
      hi: {
        title: 'मानहानि (Defamation - सामुदायिक सेवा दण्ड विकल्प सहित)',
        description: 'जो कोई बोले या पढ़े जाने के लिए आशयित शब्दों द्वारा या संकेतों या दृश्य रूपणों द्वारा किसी व्यक्ति के बारे में कोई लांछन इस आशय से लगाता या प्रकाशित करता है कि उससे उस व्यक्ति की ख्याति को अपहानि हो, वह मानहानि करता है।',
        punishment: '2 वर्ष तक सादा कारावास, या जुर्माना, या दोनों, अथवा सामुदायिक सेवा',
        aiCommentary: 'पुरानी आईपीसी धारा 499 और 500 को एकीकृत करता है तथा मानहानि के दण्ड में "सामुदायिक सेवा" का विकल्प जोड़ता है।'
      },
      te: {
        title: 'పరువు నష్టం (Defamation - సామాజిక సేవ శిక్ష ప్రత్యామ్నాయంతో)',
        description: 'మాటలు, రాతలు, సంకేతాలు లేదా దృశ్య రూపాల ద్వారా ఒక వ్యక్తి ప్రతిష్టకు భంగం కలిగించే ఉద్దేశ్యంతో ఏదైనా నిందను మోపడం లేదా ప్రచురించడం పరువు నష్టం నేరం అవుతుంది.',
        punishment: '2 ఏళ్ల వరకు సాధారణ జైలు శిక్ష, లేదా జరిమానా, లేదా రెండూ, లేదా సామాజిక సేవ (Community Service)',
        aiCommentary: 'పాత IPC సెక్షన్లు 499 మరియు 500 లను కలిపి, పరువు నష్టం కేసుల్లో "సామాజిక సేవ"ను శిక్షా ప్రత్యామ్నాయంగా చేర్చారు.'
      },
      or: {
        title: 'ମାନହାନି (Defamation - ସାମୁହିକ ସେବା ଦଣ୍ଡ ବିକଳ୍ପ ସହିତ)',
        description: 'କଥା, ଲେଖା, ସଙ୍କେତ କିମ୍ବା ଦୃଶ୍ୟ ମାଧ୍ୟମରେ କୌଣସି ବ୍ୟକ୍ତିଙ୍କ ସମ୍ମାନ ବା ଖ୍ୟାତି ହାନି କରିବା ଉଦ୍ଦେଶ୍ୟରେ କୌଣସି ଆରୋପ ଲଗାଇବା ବା ପ୍ରକାଶ କରିବା ମାନହାନି ଅଟେ।',
        punishment: '୨ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ସାଧାରଣ କାରାବାସ, କିମ୍ବା ଜରିମାନା, କିମ୍ବା ଉଭୟ, ଅଥବା ସାମୁହିକ ସେବା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 499 ଓ 500 କୁ ଏକତ୍ର କରି ମାନହାନି ମାମଲାରେ "ସାମୁହିକ ସେବା" ଦଣ୍ଡ ବିକଳ୍ପ ଯୋଡ଼ାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'IV',
    chapterName: {
      en: 'Of Abetment, Criminal Conspiracy and Attempt',
      hi: 'दुष्प्रेरण, आपराधिक षड्यंत्र और प्रयत्न',
      te: 'ప్రేరేపణ, నేరపూరిత కుట్ర మరియు ప్రయత్నం',
      or: 'ପ୍ରରୋଚନା, ଅପରାଧିକ ଷଡ଼ଯନ୍ତ୍ର ଏବଂ ପ୍ରୟାସ'
    },
    section: '45',
    ipcEquivalent: 'IPC Sec 107 / 109',
    category: 'Exceptions & Abetment',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Court by which abetted offence is triable',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Includes abetment in India of offences committed outside India (Sec 48 BNS).',
    bsaAdmissibility: 'Digital instigation messages, financial aid, and call logs admissible under Sec 63 BSA.',
    ingredients: [
      'Instigating any person to do that thing',
      'Engaging with one or more other persons in any conspiracy for the doing of that thing',
      'Intentionally aiding, by any act or illegal omission, the doing of that thing'
    ],
    investigativeSteps: [
      'Establish direct instigation or intentional aid prior to or at the time of commission of the offence.'
    ],
    translations: {
      en: {
        title: 'Abetment of a thing (Instigation, Conspiracy or Intentional Aid)',
        description: 'A person abets the doing of a thing, who: (a) instigates any person to do that thing; or (b) engages with one or more other person or persons in any conspiracy for the doing of that thing; or (c) intentionally aids, by any act or illegal omission, the doing of that thing.',
        punishment: 'Same punishment as provided for the offence (under Sec 49 BNS if no express provision)',
        aiCommentary: 'Foundational provision for prosecuting instigators, facilitators, and extraterritorial abettors (Sec 48 BNS).'
      },
      hi: {
        title: 'किसी बात का दुष्प्रेरण (उकसाना, षड्यंत्र या साशय सहायता)',
        description: 'कोई व्यक्ति किसी बात के किए जाने का दुष्प्रेरण करता है, जो: (क) किसी व्यक्ति को वह बात करने के लिए उकसाता है; या (ख) उस बात को करने के लिए किसी षड्यंत्र में सम्मिलित होता है; या (ग) किसी कार्य या अवैध लोप द्वारा उस बात के किए जाने में साशय सहायता करता है।',
        punishment: 'दुष्प्रेरित अपराध के लिए उपबंधित दण्ड के समान (धारा 49 बीएनएस)',
        aiCommentary: 'अपराध के लिए उकसाने या सहायता करने वालों तथा विदेश में बैठकर भारत में अपराध का दुष्प्रेरण करने वालों (धारा 48) पर लागू।'
      },
      te: {
        title: 'నేరానికి ప్రేరేపించడం / సహకరించడం (Abetment)',
        description: 'ఒక పని చేయడానికి మరొకరిని రెచ్చగొట్టడం (Instigation), కుట్రలో పాల్గొనడం లేదా ఉద్దేశపూర్వకంగా సహాయం చేయడం నేర ప్రేరేపణ (Abetment) అవుతుంది.',
        punishment: 'ప్రధాన నేరానికి నిర్దేశించిన శిక్షతో సమానం (సెక్షన్ 49 BNS)',
        aiCommentary: 'నేరానికి ప్రోత్సహించే వారిపై మరియు విదేశాల నుండి భారత్‌లో నేరాలను ప్రేరేపించే వారిపై (సెక్షన్ 48) చర్యకు కీలకం.'
      },
      or: {
        title: 'ଅପରାଧ ପାଇଁ ପ୍ରରୋଚନା ବା ସହାୟତା (Abetment)',
        description: 'କୌଣସି କାର୍ଯ୍ୟ କରିବା ପାଇଁ ଅନ୍ୟକୁ ଉସୁକାଇବା, ଷଡ଼ଯନ୍ତ୍ରରେ ସାମିଲ ହେବା କିମ୍ବା ଜାଣିଶୁଣି ସହାୟତା କରିବା ପ୍ରରୋଚନା (Abetment) ଅଟେ।',
        punishment: 'ମୂଳ ଅପରାଧ ପାଇଁ ନିର୍ଦ୍ଧାରିତ ଦଣ୍ଡ ସହ ସମାନ (ଧାରା 49 BNS)',
        aiCommentary: 'ଅପରାଧ ପାଇଁ ଉସୁକାଉଥିବା କିମ୍ବା ସହାୟତା କରୁଥିବା ବ୍ୟକ୍ତିଙ୍କ ବିରୁଦ୍ଧରେ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ପାଇଁ ମୌଳିକ ଧାରା।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '77',
    ipcEquivalent: 'IPC Sec 354C',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Immediate seizure of hidden cameras, mobile phones, and cloud storage; FSL cyber imaging.',
    bsaAdmissibility: 'Forensic image metadata and device storage hashes admissible under Sec 63 BSA.',
    ingredients: [
      'Watching, or capturing the image of a woman engaging in a private act in circumstances where she would usually have the expectation of not being observed',
      'Or disseminating such image without her consent'
    ],
    investigativeSteps: [
      'Seize recording devices in Faraday bags and issue immediate takedown notice to online platforms if disseminated.'
    ],
    translations: {
      en: {
        title: 'Voyeurism',
        description: 'Whoever watches, or captures the image of a woman engaging in a private act in circumstances where she would usually have the expectation of not being observed either by the perpetrator or by any other person at the behest of the perpetrator or disseminates such image.',
        punishment: 'First conviction: 1 to 3 years + Fine; Second or subsequent conviction: 3 to 7 years + Fine (Non-Bailable)',
        aiCommentary: 'Protects bodily privacy against hidden cameras, non-consensual recording, and unauthorized digital dissemination.'
      },
      hi: {
        title: 'दृश्यरतिकता (Voyeurism - निजी कृत्य को देखना या चित्रित करना)',
        description: 'जो कोई किसी महिला को ऐसे निजी कृत्य में संलग्न होते हुए देखता है या उसका चित्र/वीडियो लेता है जहां वह सामान्यतः यह अपेक्षा रखती है कि उसे नहीं देखा जा रहा है, या ऐसे चित्र को प्रसारित करता है।',
        punishment: 'प्रथम दोषसिद्धि: 1 से 3 वर्ष कारावास + जुर्माना; द्वितीय दोषसिद्धि: 3 से 7 वर्ष कारावास + जुर्माना',
        aiCommentary: 'छिपे हुए कैमरों और बिना सहमति निजी वीडियो रिकॉर्ड या वायरल करने के अपराधों के विरुद्ध सख्त प्रावधान।'
      },
      te: {
        title: 'గోప్యతా భంగం / వాయరిజం (Voyeurism)',
        description: 'మహిళ తన వ్యక్తిగత సమయంలో ఎవరూ చూడటం లేదనే నమ్మకంతో ఉన్నప్పుడు రహస్యంగా చూడటం, ఫోటోలు/వీడియోలు తీయడం లేదా వాటిని వ్యాప్తి చేయడం నేరం.',
        punishment: 'మొదటి నేరం: 1 నుండి 3 ఏళ్ల జైలు + జరిమానా; రెండవసారి: 3 నుండి 7 ఏళ్ల జైలు + జరిమానా',
        aiCommentary: 'రహస్య కెమెరాలు మరియు అనుమతి లేకుండా వ్యక్తిగత ఫోటోలు/వీడియోలు తీసి వ్యాప్తి చేయడాన్ని కఠినంగా శిక్షిస్తుంది.'
      },
      or: {
        title: 'ଗୋପନୀୟତା ଭଙ୍ଗ / ଭଏରିଜିମ୍ (Voyeurism)',
        description: 'କୌଣସି ମହିଳାଙ୍କ ବ୍ୟକ୍ତିଗତ ମୁହୂର୍ତ୍ତକୁ ଲୁଚିକରି ଦେଖିବା, ଫଟୋ/ଭିଡିଓ ଉଠାଇବା କିମ୍ବା ତାହାକୁ ପ୍ରସାର କରିବା ଦଣ୍ଡନୀୟ ଅପରାଧ ଅଟେ।',
        punishment: 'ପ୍ରଥମ ଦୋଷସିଦ୍ଧି: ୧ ରୁ ୩ ବର୍ଷ ଜେଲ୍ + ଜରିମାନା; ଦ୍ୱିତୀୟ ଦୋଷସିଦ୍ଧି: ୩ ରୁ ୭ ବର୍ଷ ଜେଲ୍ + ଜରିମାନା',
        aiCommentary: 'ଗୁପ୍ତ କ୍ୟାମେରା ଏବଂ ବିନା ଅନୁମତିରେ ବ୍ୟକ୍ତିଗତ ଭିଡିଓ ରେକର୍ଡ ବା ଭାଇରାଲ୍ ବିରୁଦ୍ଧରେ କଠୋର ଧାରା।'
      }
    }
  },
  {
    chapter: 'V',
    chapterName: {
      en: 'Of Offences Against Woman and Child',
      hi: 'महिला एवं बालक के विरुद्ध अपराध',
      te: 'మహిళలు మరియు పిల్లలపై నేరాలు',
      or: 'ମହିଳା ଏବଂ ଶିଶୁଙ୍କ ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '79',
    ipcEquivalent: 'IPC Sec 509',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Audio/video evidence or digital messages insulting modesty of a woman.',
    bsaAdmissibility: 'Electronic messages, audio clips, and eyewitness testimony admissible under BSA.',
    ingredients: [
      'Intending to insult the modesty of any woman, uttering any words, making any sound or gesture, or exhibiting any object, intending that such word or sound shall be heard, or that such gesture or object shall be seen, by such woman, or intruding upon the privacy of such woman'
    ],
    investigativeSteps: [
      'Record victim statement and preserve any audio/video or digital communication.'
    ],
    translations: {
      en: {
        title: 'Word, gesture or act intended to insult the modesty of a woman',
        description: 'Whoever, intending to insult the modesty of any woman, utters any words, makes any sound or gesture, or exhibits any object in any form, intending that such word or sound shall be heard, or that such gesture or object shall be seen, by such woman, or intrudes upon the privacy of such woman.',
        punishment: 'Simple Imprisonment up to 3 years + Fine',
        aiCommentary: 'Moved from the last chapter of IPC (Sec 509) into Chapter V (Offences against Woman and Child) with explicit inclusion of "in any form" (covering digital media).'
      },
      hi: {
        title: 'किसी महिला की लज्जा का अनादर करने के आशय से शब्द, अंगविक्षेप या कार्य',
        description: 'जो कोई किसी महिला की लज्जा का अनादर करने के आशय से कोई शब्द कहेगा, कोई ध्वनि या इशारा करेगा, या किसी भी रूप में कोई वस्तु प्रदर्शित करेगा, या महिला की एकांतता में दखल देगा।',
        punishment: '3 वर्ष तक का सादा कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 509 को महिला अपराध अध्याय में स्थानांतरित किया गया है और डिजिटल माध्यमों ("किसी भी रूप में") को शामिल किया गया है।'
      },
      te: {
        title: 'మహిళ ఆత్మగౌరవాన్ని అవమానించే ఉద్దేశ్యంతో మాటలు, సంజ్ఞలు లేదా చర్యలు',
        description: 'మహిళ యొక్క మానమర్యాదలను అవమానించే ఉద్దేశ్యంతో ఏవైనా మాటలు మాట్లాడటం, శబ్దాలు లేదా సంజ్ఞలు చేయడం, ఏ రూపంలోనైనా వస్తువును ప్రదర్శించడం లేదా ఆమె వ్యక్తిగత గోప్యతకు భంగం కలిగించడం.',
        punishment: '3 సంవత్సరాల వరకు సాధారణ జైలు శిక్ష + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్ 509 ని మహిళల అధ్యాయంలోకి మార్చి డిజిటల్ మాధ్యమాలను కూడా ఇందులో చేర్చారు.'
      },
      or: {
        title: 'ମହିଳାଙ୍କ ସମ୍ମାନ ହାନି କରିବା ଉଦ୍ଦେଶ୍ୟରେ ଶବ୍ଦ, ଇଙ୍ଗିତ ବା କାର୍ଯ୍ୟ',
        description: 'କୌଣସି ମହିଳାଙ୍କ ଲଜ୍ଜା ବା ସମ୍ମାନର ଅପମାନ କରିବା ଉଦ୍ଦେଶ୍ୟରେ କୌଣସି ଶବ୍ଦ କହିବା, ଇଙ୍ଗିତ କରିବା କିମ୍ବା ତାଙ୍କର ବ୍ୟକ୍ତିଗତ ଗୋପନୀୟତାରେ ହସ୍ତକ୍ଷେପ କରିବା।',
        punishment: '୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ସାଧାରଣ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 509 କୁ ମହିଳା ସୁରକ୍ଷା ଅଧ୍ୟାୟରେ ସାମିଲ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '108',
    ipcEquivalent: 'IPC Sec 306',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Inquest under Sec 194 BNSS; mandatory FSL scene visit under Sec 176(3) BNSS; seizure of suicide note and mobile device.',
    bsaAdmissibility: 'Suicide note handwriting verification (Sec 39/45 BSA) and digital messages (Sec 63 BSA).',
    ingredients: [
      'Commission of suicide by any person',
      'Direct abetment / instigation / intentional aid by the accused driving the deceased to commit suicide'
    ],
    investigativeSteps: [
      'Seize suicide note along with admitted contemporaneous handwriting samples of deceased for FSL comparison.',
      'Extract mobile chat logs, call recordings, and financial harassment evidence.'
    ],
    translations: {
      en: {
        title: 'Abetment of suicide',
        description: 'If any person commits suicide, whoever abets the commission of such suicide, shall be punished with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.',
        punishment: 'Imprisonment up to 10 years + Fine',
        aiCommentary: 'Corresponds to IPC Section 306. Requires proximate instigation or persistent harassment leaving the victim with no alternative.'
      },
      hi: {
        title: 'आत्महत्या का दुष्प्रेरण (Abetment of Suicide)',
        description: 'यदि कोई व्यक्ति आत्महत्या करता है, तो जो कोई ऐसी आत्महत्या के किए जाने का दुष्प्रेरण करेगा, वह दस वर्ष तक के कारावास और जुर्माने से दण्डित किया जाएगा।',
        punishment: '10 वर्ष तक का कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 306 के समतुल्य। सुसाइड नोट का हस्तलेख मिलान और डिजिटल साक्ष्य की फॉरेंसिक जांच अनिवार्य है।'
      },
      te: {
        title: 'ఆత్మహత్యకు ప్రేరేపించడం (Abetment of Suicide)',
        description: 'ఎవరైనా ఆత్మహత్య చేసుకుంటే, ఆ ఆత్మహత్యకు ప్రేరేపించిన వ్యక్తికి పదేళ్ల వరకు జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది.',
        punishment: '10 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్ 306 కు సమానం. సూసైడ్ నోట్ ఫోరెన్సిక్ పరీక్ష మరియు మొబైల్ డేటా విశ్లేషణ కీలకం.'
      },
      or: {
        title: 'ଆତ୍ମହତ୍ୟା ପାଇଁ ପ୍ରରୋଚନା (Abetment of Suicide)',
        description: 'ଯଦି କୌଣସି ବ୍ୟକ୍ତି ଆତ୍ମହତ୍ୟା କରନ୍ତି, ତେବେ ଏଥିପାଇଁ ପ୍ରରୋଚନା ଦେଇଥିବା ବ୍ୟକ୍ତିଙ୍କୁ ୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ଏବଂ ଜରିମାନା ହେବ।',
        punishment: '୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 306 ସହ ସମାନ। ସୁସାଇଡ୍ ନୋଟ୍ ଓ ମୋବାଇଲ୍ ତଥ୍ୟର ଫୋରେନ୍ସିକ୍ ଯାଞ୍ଚ ଆବଶ୍ୟକ।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '127',
    ipcEquivalent: 'IPC Sec 340 / 342 / 343 / 344',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Search warrant for wrongfully confined person under Sec 100 BNSS.',
    bsaAdmissibility: 'Site panchnama of confinement premises and victim statement admissible under BSA.',
    ingredients: [
      'Wrongfully restraining any person in such a manner as to prevent that person from proceeding beyond certain circumscribing limits'
    ],
    investigativeSteps: [
      'Inspect and photograph locks/bolts of the room or premises where the victim was confined.'
    ],
    translations: {
      en: {
        title: 'Wrongful confinement',
        description: 'Whoever wrongfully restrains any person in such a manner as to prevent that person from proceeding beyond certain circumscribing limits, is said "wrongfully to confine" that person.',
        punishment: 'General (127(2)): Up to 1 year or Rs 5,000 fine; 3+ days (127(3)): Up to 3 years + Rs 10,000 fine; 10+ days (127(4)): Up to 5 years + Min Rs 10,000 fine',
        aiCommentary: 'Consolidates IPC Sections 340 and 342–348 into Section 127 BNS with enhanced sentences for prolonged confinement.'
      },
      hi: {
        title: 'सदोष परिरोध (अवैध रूप से बंधक बनाकर रखना)',
        description: 'जो कोई किसी व्यक्ति का इस प्रकार सदोष अवरोध करता है कि वह निश्चित परिसीमाओं से बाहर न जा सके, वह उस व्यक्ति का "सदोष परिरोध" करता है।',
        punishment: 'सामान्य (127(2)): 1 वर्ष तक या 5,000 रु. जुर्माना; 3+ दिन (127(3)): 3 वर्ष तक; 10+ दिन (127(4)): 5 वर्ष तक कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी की धाराओं 340 तथा 342 से 348 को एक ही धारा 127 में समेकित किया गया है।'
      },
      te: {
        title: 'అక్రమ నిర్బంధం (Wrongful Confinement)',
        description: 'ఒక వ్యక్తిని నిర్దిష్ట సరిహద్దుల దాటి వెళ్లకుండా అక్రమంగా బంధిస్తే దానిని "అక్రమ నిర్బంధం" అంటారు.',
        punishment: 'సాధారణ (127(2)): 1 ఏడాది జైలు లేదా రూ. 5,000 జరిమానా; 3+ రోజులు: 3 ఏళ్ల వరకు; 10+ రోజులు: 5 ఏళ్ల వరకు జైలు + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్లు 340 మరియు 342–348 లను ఒకే సెక్షన్ 127 కిందకు చేర్చారు.'
      },
      or: {
        title: 'ବେଆଇନ ଆବଦ୍ଧ / ବନ୍ଦୀ (Wrongful Confinement)',
        description: 'କୌଣସି ବ୍ୟକ୍ତିଙ୍କୁ ଏକ ନିର୍ଦ୍ଦିଷ୍ଟ ସୀମା ବାହାରକୁ ଯିବାରୁ ଅଟକାଇ ବେଆଇନ ଭାବେ ବନ୍ଦୀ କରି ରଖିବା।',
        punishment: 'ସାଧାରଣ (127(2)): ୧ ବର୍ଷ ଜେଲ୍ ବା ୫,୦୦୦ ଟଙ୍କା ଜରିମାନା; ୩+ ଦିନ: ୩ ବର୍ଷ; ୧୦+ ଦିନ: ୫ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 340 ଓ 342-348 କୁ ଗୋଟିଏ ଧାରା 127 ରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '137',
    ipcEquivalent: 'IPC Sec 359 / 360 / 361 / 363',
    category: 'Offences Affecting Human Body',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Gender-neutral age of 18 years for any child (previously 16 for boys and 18 for girls under IPC 361).',
    bsaAdmissibility: 'School matriculation / birth certificate admissible for age proof under JJ Act & BSA.',
    ingredients: [
      'Taking or enticing any child (under 18 years of age, regardless of gender) or any person of unsound mind, out of the keeping of the lawful guardian without such guardian’s consent'
    ],
    investigativeSteps: [
      'Issue immediate wireless/missing child alert and verify age via birth/school certificate.',
      'Note that BNS 137 makes the age threshold gender-neutral (under 18 years for both boys and girls).'
    ],
    translations: {
      en: {
        title: 'Kidnapping (Gender-Neutral Age Threshold of 18 Years)',
        description: 'Whoever takes or entices any child (any person below eighteen years of age) or any person of unsound mind, out of the keeping of the lawful guardian of such child or person of unsound mind, without the consent of such guardian, is said to kidnap such child or person from lawful guardianship.',
        punishment: 'Imprisonment up to 7 years + Fine',
        aiCommentary: 'Removes gender disparity from IPC 361 (which set 16 years for boys and 18 for girls) by establishing a uniform 18-year threshold for all children.'
      },
      hi: {
        title: 'व्यपहरण / अपहरण (Kidnapping - बालक/बालिका दोनों के लिए 18 वर्ष की समान आयु)',
        description: 'जो कोई किसी बालक (18 वर्ष से कम आयु के किसी भी व्यक्ति) या विकृतचित्त व्यक्ति को उसके विधिपूर्ण संरक्षक की सम्मति के बिना संरक्षकता में से ले जाता है या बहका ले जाता है, वह व्यपहरण करता है।',
        punishment: '7 वर्ष तक का कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 361 के लिंग भेद (बालक 16 वर्ष, बालिका 18 वर्ष) को समाप्त कर सभी बच्चों के लिए समान 18 वर्ष की आयु सीमा लागू की गई है।'
      },
      te: {
        title: 'కిడ్నాపింగ్ (బాలురు మరియు బాలికలకు 18 ఏళ్ల సమాన వయోపరిమితి)',
        description: 'చట్టబద్ధమైన సంరక్షకుని అనుమతి లేకుండా 18 ఏళ్లలోపు ఉన్న ఏ బాలుడిని/బాలికను లేదా మానసిక వికలాంగులను తీసుకువెళ్లడం లేదా ప్రలోభపెట్టి తీసుకెళ్లడం కిడ్నాపింగ్ అవుతుంది.',
        punishment: '7 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'పాత IPC 361 లో బాలురకు 16 ఏళ్లు, బాలికలకు 18 ఏళ్లుగా ఉన్న తేడాను తొలగించి అందరికీ 18 ఏళ్ల సమాన పరిమితిని నిర్ణయించారు.'
      },
      or: {
        title: 'ଅପହରଣ / କିଡନାପିଂ (ବାଳକ ଓ ବାଳିକା উভୟଙ୍କ ପାଇଁ ୧୮ ବର୍ଷ ସମାନ ବୟସ ସୀମା)',
        description: 'ଆଇନଗତ ଅଭିଭାବକଙ୍କ ବିନା ଅନୁମତିରେ ୧୮ ବର୍ଷରୁ କମ୍ ବୟସର କୌଣସି ଶିଶୁ କିମ୍ବା ମାନସିକ ବିକୃତ ବ୍ୟକ୍ତିଙ୍କୁ ନେଇଯିବା ବା ପ୍ରଲୋଭିତ କରି ନେବା ଅପହରଣ ଅଟେ।',
        punishment: '୭ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC 361 ର ଲିଙ୍ଗଗତ ପାର୍ଥକ୍ୟ (ବାଳକ ୧୬, ବାଳିକା ୧୮) ଦୂର କରି ସମସ୍ତ ଶିଶୁଙ୍କ ପାଇଁ ୧୮ ବର୍ଷ ସमान ସୀମା ଧାର୍ଯ୍ୟ ହୋଇଛି।'
      }
    }
  },
  {
    chapter: 'VI',
    chapterName: {
      en: 'Of Offences Affecting the Human Body',
      hi: 'मानव शरीर पर प्रभाव डालने वाले अपराध',
      te: 'మానవ శరీరాన్ని ప్రభావితం చేసే నేరాలు',
      or: 'ମାନବ ଶରୀରକୁ ପ୍ରଭାବିତ କରୁଥିବା ଅପରାଧ'
    },
    section: '143',
    ipcEquivalent: 'IPC Sec 370',
    category: 'Offences Against Women & Children',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory FSL involvement, Anti-Human Trafficking Unit (AHTU) coordination, and victim rehabilitation.',
    bsaAdmissibility: 'Travel tickets, financial transfers, and victim Sec 183 BNSS statements admissible.',
    ingredients: [
      'Recruiting, transporting, harbouring, transferring, or receiving a person for exploitation by using threats, force, abduction, fraud, deception, abuse of power, or inducement'
    ],
    investigativeSteps: [
      'Coordinate with Anti-Human Trafficking Unit (AHTU) and record victim statement under Sec 183 BNSS.',
      'Seize transport logs, shelter registers, and syndicate proceeds under Sec 107 BNSS.'
    ],
    translations: {
      en: {
        title: 'Trafficking of person (Human Trafficking & Child Trafficking)',
        description: 'Whoever, for the purpose of exploitation, recruits, transports, harbours, transfers, or receives a person by using threats, force, coercion, abduction, fraud, deception, or abuse of power commits the offence of trafficking.',
        punishment: '7 to 10 years RI + Fine (Trafficking of child: 10 years RI to Life; Trafficking of more than one child: Life Imprisonment)',
        aiCommentary: 'Comprehensive anti-trafficking provision imposing mandatory minimum 7–10 years RI (and Life Imprisonment for trafficking multiple children).'
      },
      hi: {
        title: 'व्यक्ति का दुर्व्यापार (मानव तस्करी एवं बाल तस्करी)',
        description: 'जो कोई शोषण के प्रयोजन के लिए धमकी, बल, अपहरण, कपट, छल या शक्ति के दुरुपयोग द्वारा किसी व्यक्ति की भर्ती करता है, परिवहन करता है, आश्रय देता है या प्राप्त करता है, वह मानव दुर्व्यापार (तस्करी) का अपराध करता है।',
        punishment: '7 से 10 वर्ष कठोर कारावास + जुर्माना (बाल तस्करी: 10 वर्ष से आजीवन कारावास; एक से अधिक बालक: आजीवन कारावास)',
        aiCommentary: 'मानव तस्करी और बाल तस्करी सिंडिकेट के विरुद्ध अत्यंत कठोर दण्ड का प्रावधान करता है।'
      },
      te: {
        title: 'మానవ అక్రమ రవాణా (Human & Child Trafficking)',
        description: 'దోపిడీ/శోషణ కోసం బెదిరింపులు, బలప్రయోగం, కిడ్నాప్, మోసం లేదా అధికార దుర్వినియోగం ద్వారా వ్యక్తులను నియమించడం, రవాణా చేయడం లేదా ఆశ్రయం కల్పించడం మానవ అక్రమ రవాణా నేరం.',
        punishment: '7 నుండి 10 ఏళ్ల కఠిన కారాగార శిక్ష + జరిమానా (పిల్లల అక్రమ రవాణా: 10 ఏళ్ల నుండి జీవిత ఖైదు)',
        aiCommentary: 'మానవ మరియు పిల్లల అక్రమ రవాణా ముఠాలపై కఠిన చర్యలకు ఈ సెక్షన్ వర్తిస్తుంది.'
      },
      or: {
        title: 'ମାନବ ଚାଲାଣ (Human & Child Trafficking)',
        description: 'ଶୋଷଣ ଉଦ୍ଦେଶ୍ୟରେ ଧମକ, ବଳପ୍ରୟୋଗ, ଅପହରଣ ବା ପ୍ରତାରଣା ଦ୍ୱାରା କୌଣସି ବ୍ୟକ୍ତିଙ୍କୁ ନିଯୁକ୍ତ କରିବା, ପରିବହନ କରିବା ବା ଆଶ୍ରୟ ଦେବା ମାନବ ଚାଲାଣ ଅପରାଧ ଅଟେ।',
        punishment: '୭ ରୁ ୧୦ ବର୍ଷ କଠୋର କାରାବାସ + ଜରିମାନା (ଶିଶୁ ଚାଲାଣ: ୧୦ ବର୍ଷରୁ ଆଜୀବନ କାରାବାସ)',
        aiCommentary: 'ମାନବ ଓ ଶିଶୁ ଚାଲାଣ ରୋକିବା ପାଇଁ କଠୋର ଦଣ୍ଡବିଧାନ ବ୍ୟବସ୍ଥା କରେ।'
      }
    }
  },
  {
    chapter: 'X',
    chapterName: {
      en: 'Of Offences Relating to Coin, Currency-Notes, Bank-Notes, and Government Stamps',
      hi: 'सिक्कों, करेंसी नोटों, बैंक नोटों और सरकारी स्टाम्पों से संबंधित अपराध',
      te: 'నాణేలు, కరెన్సీ నోట్లు మరియు ప్రభుత్వ స్టాంపులకు సంబంధించిన నేరాలు',
      or: 'ମୁଦ୍ରା, କରେନ୍ସି ନୋଟ୍ ଏବଂ ସରକାରୀ ଷ୍ଟାମ୍ପ ସମ୍ବନ୍ଧୀୟ ଅପରାଧ'
    },
    section: '178',
    ipcEquivalent: 'IPC Sec 489A',
    category: 'Organised Crime & National Security',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Court of Session',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Mandatory examination of seized Fake Indian Currency Notes (FICN) at Government Currency Note Press / FSL.',
    bsaAdmissibility: 'Currency Note Press / Mint expert report admissible under Sec 39/40 BSA.',
    ingredients: [
      'Counterfeiting, or knowingly performing any part of the process of counterfeiting, any coin, currency-note or bank-note'
    ],
    investigativeSteps: [
      'Record serial numbers and denominations of all seized FICN notes in videographed panchnama and forward to Currency Note Press, Nashik/Dewas.'
    ],
    translations: {
      en: {
        title: 'Counterfeiting coin, Government stamps, currency-notes or bank-notes',
        description: 'Whoever counterfeits, or knowingly performs any part of the process of counterfeiting, any coin, stamp issued by Government for the purpose of revenue, currency-note or bank-note, shall be punished with imprisonment for life, or with imprisonment up to ten years, and fine.',
        punishment: 'Imprisonment for Life or up to 10 years + Fine',
        aiCommentary: 'Unified provision consolidating counterfeiting of coins, revenue stamps, and currency/bank notes (FICN).'
      },
      hi: {
        title: 'सिक्कों, सरकारी स्टाम्पों, करेंसी नोटों या बैंक नोटों का कूटकरण (जाली नोट)',
        description: 'जो कोई किसी सिक्के, राजस्व हेतु सरकार द्वारा जारी स्टाम्प, करेंसी नोट या बैंक नोट का कूटकरण (नकली नोट बनाना) करता है या उसकी प्रक्रिया के किसी भाग को जानबूझकर करता है।',
        punishment: 'आजीवन कारावास या 10 वर्ष तक का कारावास + जुर्माना',
        aiCommentary: 'जाली भारतीय मुद्रा (FICN), सिक्कों और सरकारी स्टाम्पों के कूटकरण के विरुद्ध एकीकृत कठोर धारा।'
      },
      te: {
        title: 'నాణేలు, ప్రభుత్వ స్టాంపులు లేదా కరెన్సీ నోట్ల నకిలీ తయారీ (Counterfeiting)',
        description: 'నాణేలు, ప్రభుత్వ రెవెన్యూ స్టాంపులు, కరెన్సీ నోట్లు లేదా బ్యాంకు నోట్లను నకిలీవి తయారు చేసినా లేదా ఆ ప్రక్రియలో పాల్గొన్నా జీవిత ఖైదు లేదా 10 ఏళ్ల వరకు జైలు శిక్ష పడుతుంది.',
        punishment: 'జీవిత ఖైదు లేదా 10 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'నకిలీ కరెన్సీ నోట్లు (FICN), నాణేలు మరియు స్టాంపుల తయారీని అరికట్టే సమగ్ర సెక్షన్.'
      },
      or: {
        title: 'ମୁଦ୍ରା, ସରକାରୀ ଷ୍ଟାମ୍ପ କିମ୍ବା କରେନ୍ସି ନୋଟ୍ ଜାଲିଆତି (Counterfeiting)',
        description: 'କୌଣସି ମୁଦ୍ରା, ସରକାରୀ ରାଜସ୍ୱ ଷ୍ଟାମ୍ପ, କରେନ୍ସି ନୋଟ୍ ବା ବ୍ୟାଙ୍କ ନୋଟ୍‌ର ନକଲି ପ୍ରସ୍ତୁତ କରିବା କିମ୍ବା ଜାଣିଶୁଣି ସେହି ପ୍ରକ୍ରିୟାରେ ସାମିଲ ହେବା।',
        punishment: 'ଆଜୀବନ କାରାବାସ କିମ୍ବା ୧୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ଜାଲି ନୋଟ୍ (FICN), ମୁଦ୍ରା ଓ ସରକାରୀ ଷ୍ଟାମ୍ପ ପ୍ରସ୍ତୁତି ବିରୁଦ୍ଧରେ କଠୋର ଏକୀକୃତ ଧାରା।'
      }
    }
  },
  {
    chapter: 'XIII',
    chapterName: {
      en: 'Of Contempts of the Lawful Authority of Public Servants',
      hi: 'लोक सेवकों के विधिपूर्ण प्राधिकार के अवमान के विषय में',
      te: 'ప్రభుత్వ ఉద్యోగుల చట్టబద్ధమైన అధికార ధిక్కరణ',
      or: 'ସରକାରୀ କର୍ମଚାରୀଙ୍କ ଆଇନଗତ କ୍ଷମତାର ଅବମାନନା'
    },
    section: '217',
    ipcEquivalent: 'IPC Sec 182',
    category: 'Public Order & Justice',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Written complaint of public servant under Sec 215 BNSS required for cognizance.',
    bsaAdmissibility: 'False report record and investigation closure report admissible under BSA.',
    ingredients: [
      'Giving to any public servant any information which the person knows or believes to be false',
      'Intending thereby to cause, or knowing it to be likely that he will thereby cause, such public servant to use his lawful power to the injury or annoyance of any person'
    ],
    investigativeSteps: [
      'Document falsehood of the complaint through objective investigation and file Sec 215 BNSS complaint.'
    ],
    translations: {
      en: {
        title: 'False information, with intent to cause public servant to use his lawful power to the injury of another person',
        description: 'Whoever gives to any public servant any information which he knows or believes to be false, intending thereby to cause, or knowing it to be likely that he will thereby cause, such public servant to do or omit anything which such public servant ought not to do or omit, or to use his lawful power to the injury or annoyance of any person.',
        punishment: 'Imprisonment up to 1 year, or Fine up to Rs 10,000, or both',
        aiCommentary: 'Doubles the imprisonment term (from 6 months in IPC 182 to 1 year) and increases the fine 10-fold (to Rs 10,000) to deter malicious false complaints.'
      },
      hi: {
        title: 'लोक सेवक द्वारा अपनी विधिपूर्ण शक्ति का प्रयोग दूसरे व्यक्ति की क्षति के लिए कराने के आशय से मिथ्या सूचना देना',
        description: 'जो कोई किसी लोक सेवक को कोई ऐसी सूचना देता है जिसके मिथ्या (झूठी) होने का उसे ज्ञान या विश्वास है, ताकि लोक सेवक किसी व्यक्ति की क्षति या क्षोभ के लिए अपनी शक्ति का प्रयोग करे।',
        punishment: '1 वर्ष तक का कारावास, या 10,000 रु. तक जुर्माना, या दोनों',
        aiCommentary: 'झूठी शिकायत दर्ज कराने वालों को रोकने के लिए सजा को 6 माह (IPC 182) से बढ़ाकर 1 वर्ष और जुर्माना 10,000 रु. किया गया है।'
      },
      te: {
        title: 'ఇతరులకు హాని కలిగించడానికి ప్రభుత్వ ఉద్యోగికి తప్పుడు సమాచారం ఇవ్వడం',
        description: 'ప్రభుత్వ ఉద్యోగి తన అధికారంతో మరొకరికి హాని లేదా ఇబ్బంది కలిగించేలా చేసే ఉద్దేశ్యంతో, అబద్ధమని తెలిసినా ఉద్దేశపూర్వకంగా తప్పుడు సమాచారం/ఫిర్యాదు ఇవ్వడం.',
        punishment: '1 సంవత్సరం వరకు జైలు శిక్ష, లేదా రూ. 10,000 వరకు జరిమానా, లేదా రెండూ',
        aiCommentary: 'తప్పుడు ఫిర్యాదులను అరికట్టడానికి పాత IPC 182 లోని 6 నెలల శిక్షను 1 ఏడాదికి మరియు జరిమానాను రూ. 10,000 కు పెంచారు.'
      },
      or: {
        title: 'ଅନ୍ୟର କ୍ଷତି କରିବା ଉଦ୍ଦେଶ୍ୟରେ ସରକାରୀ କର୍ମଚାରୀଙ୍କୁ ମିଥ୍ୟା ସୂଚନା ଦେବା',
        description: 'ସରକାରୀ କର୍ମଚାରୀ తన କ୍ଷମତା ପ୍ରୟୋଗ କରି ଅନ୍ୟ ଜଣଙ୍କର କ୍ଷତି କରନ୍ତୁ ବୋଲି ଉଦ୍ଦେଶ୍ୟ ରଖି ଜାଣିଶୁଣି ମିଥ୍ୟା ସୂଚନା ବା ଅଭିଯୋଗ ଦେବା।',
        punishment: '୧ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ, କିମ୍ବା ୧୦,୦୦୦ ଟଙ୍କା ପର୍ଯ୍ୟନ୍ତ ଜରିମାନା, କିମ୍ବା ଉଭୟ',
        aiCommentary: 'ମିଥ୍ୟା ଅଭିଯୋଗ ରୋକିବା ପାଇଁ ଦଣ୍ଡକୁ ୬ ମାସ (IPC 182) ରୁ ୧ ବର୍ଷ ଏବଂ ଜରିମାନା ୧୦,୦୦୦ ଟଙ୍କାକୁ ବୃଦ୍ଧି କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVI',
    chapterName: {
      en: 'Of Offences Relating to Religion',
      hi: 'धर्म से संबंधित अपराध',
      te: 'మతానికి సంబంధించిన నేరాలు',
      or: 'ଧର୍ମ ସମ୍ବନ୍ଧୀୟ ଅପରାଧ'
    },
    section: '299',
    ipcEquivalent: 'IPC Sec 295A',
    category: 'Public Order & Justice',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Requires statutory sanction under Sec 217 BNSS before cognizance; explicitly includes electronic means.',
    bsaAdmissibility: 'Audio/video/social media posts admissible with Sec 63 BSA certificate.',
    ingredients: [
      'With deliberate and malicious intention of outraging the religious feelings of any class of citizens of India',
      'By words, either spoken or written, or by signs or by visible representations or through electronic means, insulting or attempting to insult the religion or religious beliefs of that class'
    ],
    investigativeSteps: [
      'Preserve electronic evidence with hash values and obtain government sanction under Sec 217 BNSS.'
    ],
    translations: {
      en: {
        title: 'Deliberate and malicious acts, intended to outrage religious feelings of any class by insulting its religion or religious beliefs',
        description: 'Whoever, with deliberate and malicious intention of outraging the religious feelings of any class of citizens of India, by words, either spoken or written, or by signs or by visible representations or through electronic means or otherwise, insults or attempts to insult the religion or the religious beliefs of that class.',
        punishment: 'Imprisonment up to 3 years, or Fine, or both',
        aiCommentary: 'Corresponds to IPC Section 295A and explicitly adds "through electronic means" to cover online religious insults.'
      },
      hi: {
        title: 'किसी वर्ग के धर्म या धार्मिक विश्वासों का अपमान करके उसकी धार्मिक भावनाओं को आहत करने के आशय से विमर्शित और विद्वेषपूर्ण कार्य',
        description: 'जो कोई भारत के नागरिकों के किसी वर्ग की धार्मिक भावनाओं को आहत करने के विमर्शित और विद्वेषपूर्ण आशय से शब्दों, संकेतों या इलेक्ट्रॉनिक माध्यमों द्वारा उस वर्ग के धर्म या धार्मिक विश्वासों का अपमान करता है।',
        punishment: '3 वर्ष तक का कारावास, या जुर्माना, या दोनों',
        aiCommentary: 'पुरानी आईपीसी धारा 295A के समतुल्य, जिसमें "इलेक्ट्रॉनिक माध्यमों द्वारा" स्पष्ट रूप से जोड़ा गया है।'
      },
      te: {
        title: 'మతపరమైన మనోభావాలను దెబ్బతీసే ఉద్దేశ్యంతో ఉద్దేశపూర్వక మరియు దురుద్దేశపూరిత చర్యలు',
        description: 'భారత పౌరుల ఏదైనా వర్గం యొక్క మతపరమైన మనోభావాలను దెబ్బతీసే దురుద్దేశ్యంతో మాటలు, రాతలు, సంకేతాలు లేదా ఎలక్ట్రానిక్ మాధ్యమాల ద్వారా వారి మతాన్ని లేదా మత విశ్വാസాలను అవమానించడం.',
        punishment: '3 సంవత్సరాల వరకు జైలు శిక్ష, లేదా జరిమానా, లేదా రెండూ',
        aiCommentary: 'పాత IPC సెక్షన్ 295A కు సమానం; ఆన్‌లైన్ మాధ్యమాలను కవర్ చేయడానికి "ఎలక్ట్రానిక్ మాధ్యమాల ద్వారా" అని చేర్చారు.'
      },
      or: {
        title: 'ଧାର୍ମିକ ଭାବନାକୁ ଆଘାତ ଦେବା ଉଦ୍ଦେଶ୍ୟରେ ଉଦ୍ଦେଶ୍ୟମୂଳକ ଏବଂ ବିଦ୍ୱେଷପୂର୍ଣ୍ଣ କାର୍ଯ୍ୟ',
        description: 'ଭାରତର ନାଗରିକଙ୍କ କୌଣସି ବର୍ଗର ଧାର୍ମିକ ଭାବନାକୁ ଆଘାତ ଦେବା ଉଦ୍ଦେଶ୍ୟରେ କଥା, ଲେଖା, ସଙ୍କେତ କିମ୍ବା ଇଲେକ୍ଟ୍ରୋନିକ୍ ମାଧ୍ୟମରେ ସେମାନଙ୍କ ଧର୍ମ ବା ଧାର୍ମିକ ବିଶ୍ୱାସକୁ ଅପମାନିତ କରିବା।',
        punishment: '୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ, କିମ୍ବା ଜରିମାନା, କିମ୍ବା ଉଭୟ',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 295A ସହ ସମାନ; ଏଥିରେ "ଇଲେକ୍ଟ୍ରୋନିକ୍ ମାଧ୍ୟମ" ସ୍ପଷ୍ଟ ଭାବେ ଯୋଡ଼ାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '314',
    ipcEquivalent: 'IPC Sec 403 / 404',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Non-Cognizable',
    bailable: 'Bailable',
    triableBy: 'Any Magistrate',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Trace conversion or retention of movable property; aggravated if property belonged to a deceased person (Sec 315 BNS).',
    bsaAdmissibility: 'Transaction logs and possession records admissible under BSA.',
    ingredients: [
      'Dishonestly misappropriating or converting to one’s own use any movable property'
    ],
    investigativeSteps: [
      'Verify how the accused came into neutral possession of the movable property and subsequent dishonest conversion.'
    ],
    translations: {
      en: {
        title: 'Dishonest misappropriation of property',
        description: 'Whoever dishonestly misappropriates or converts to his own use any movable property, shall be punished with imprisonment of either description for a term which shall not be less than six months but which may extend to two years and with fine.',
        punishment: 'Imprisonment from 6 months to 2 years + Fine',
        aiCommentary: 'Introduces a mandatory minimum sentence of 6 months imprisonment (compared to no minimum under IPC 403).'
      },
      hi: {
        title: 'संपत्ति का बेईमानी से दुर्विनियोग (Dishonest Misappropriation)',
        description: 'जो कोई किसी जंगम (चल) संपत्ति का बेईमानी से दुर्विनियोग करता है या उसे अपने उपयोग में संपरिवर्तित कर लेता है, वह कम से कम छह मास से दो वर्ष तक के कारावास और जुर्माने से दण्डित किया जाएगा।',
        punishment: '6 माह से 2 वर्ष तक का कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 403 के स्थान पर न्यूनतम 6 माह के कारावास और अनिवार्य जुर्माने का प्रावधान करता है।'
      },
      te: {
        title: 'ఆస్తిని నిజాయితీ లేకుండా సొంతానికి వాడుకోవడం (Dishonest Misappropriation)',
        description: 'ఏదైనా చరాస్తిని నిజాయితీ లేకుండా దుర్వినియోగం చేసినా లేదా తన సొంత అవసరాలకు మార్చుకున్నా కనీసం 6 నెలల నుండి 2 సంవత్సరాల వరకు జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది.',
        punishment: '6 నెలల నుండి 2 సంవత్సరాల వరకు జైలు శిక్ష + జరిమానా',
        aiCommentary: 'పాత IPC సెక్షన్ 403 స్థానంలో కనీసం 6 నెలల జైలు శిక్షను తప్పనిసరి చేసింది.'
      },
      or: {
        title: 'ସମ୍ପତ୍ତିର ଅସାଧୁ ଆତ୍ମସାତ୍ (Dishonest Misappropriation)',
        description: 'ଯେଉଁ ବ୍ୟକ୍ତି କୌଣସି ଅସ୍ଥାବର ସମ୍ପତ୍ତିକୁ ଅସାଧୁ ଭାବେ ଆତ୍ମସାତ୍ କରେ ବା ନିଜ ବ୍ୟବହାରରେ ଲଗାଏ, ତାକୁ ୬ ମାସରୁ ୨ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାଦଣ୍ଡ ଏବଂ ଜରିମାନା ହେବ।',
        punishment: '୬ ମାସରୁ ୨ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ କାରାବାସ + ଜରିମାନା',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 403 ବଦଳରେ ସର୍ବନିମ୍ନ ୬ ମାସ କାରାଦଣ୍ଡ ବାଧ୍ୟତାମୂଳକ କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVII',
    chapterName: {
      en: 'Of Offences Against Property',
      hi: 'संपत्ति के विरुद्ध अपराध',
      te: 'ఆస్తిపై నేరాలు',
      or: 'ସମ୍ପତ୍ତି ବିରୁଦ୍ଧରେ ଅପରାଧ'
    },
    section: '317',
    ipcEquivalent: 'IPC Sec 410 / 411 / 412 / 413',
    category: 'Property, Cyber & Financial Crimes',
    cognizable: 'Cognizable',
    bailable: 'Non-Bailable',
    triableBy: 'Any Magistrate (Court of Session for Dacoity Property / Habitual Dealing)',
    forensicMandatory7Yr: true,
    bnssProcedure: 'Videographed seizure of stolen property under Sec 105 BNSS; restoration to rightful owner under Sec 497 BNSS within 14 days.',
    bsaAdmissibility: 'Presumption of theft/receiving stolen property from recent unexplained possession under Sec 119 Illustration (a) BSA.',
    ingredients: [
      'Dishonestly receiving or retaining any stolen property, knowing or having reason to believe the same to be stolen property'
    ],
    investigativeSteps: [
      'Prepare videographed seizure panchnama under Sec 105 BNSS and photograph property for fast-track release to owner under Sec 497 BNSS.'
    ],
    translations: {
      en: {
        title: 'Stolen property (Dishonestly receiving or retaining stolen property)',
        description: 'Property, the possession whereof has been transferred by theft, extortion, robbery, criminal misappropriation or criminal breach of trust, is designated "stolen property". Dishonestly receiving or retaining stolen property is punishable up to 3 years (or up to 10 years/Life if obtained by dacoity or habitually dealt with).',
        punishment: 'General (317(2)): Up to 3 years or Fine; Dacoity property / Habitual dealer (317(3)/(4)): Life Imprisonment or up to 10 years RI + Fine',
        aiCommentary: 'Consolidates IPC Sections 410–414 into a single section. Read with Sec 497 BNSS for fast-track custody/return of property to victims.'
      },
      hi: {
        title: 'चुराई हुई संपत्ति (बेईमानी से प्राप्त करना या रखना)',
        description: 'वह संपत्ति जिसका कब्जा चोरी, उद्यापन, लूट या आपराधिक न्यासभंग द्वारा अंतरित किया गया है, "चुराई हुई संपत्ति" कहलाती है। इसे बेईमानी से प्राप्त करने या रखने पर 3 वर्ष तक कारावास (डकैती की संपत्ति या आदतन व्यापार पर आजीवन या 10 वर्ष तक) का दण्ड है।',
        punishment: 'सामान्य (317(2)): 3 वर्ष तक कारावास; डकैती की संपत्ति/आदतन (317(3)/(4)): आजीवन या 10 वर्ष तक कठोर कारावास + जुर्माना',
        aiCommentary: 'पुरानी आईपीसी धारा 410 से 414 को एक ही धारा 317 में समेकित किया गया है।'
      },
      te: {
        title: 'దొంగిలించబడిన ఆస్తి (నిజాయితీ లేకుండా స్వీకరించడం లేదా ఉంచుకోవడం)',
        description: 'దొంగతనం, దోపిడీ లేదా నమ్మకద్రోహం ద్వారా బదిలీ అయిన ఆస్తిని "దొంగిలించబడిన ఆస్తి" అంటారు. దానిని తెలిసి స్వీకరించినా లేదా ఉంచుకున్నా 3 ఏళ్ల వరకు జైలు శిక్ష (డకాయితీ ఆస్తి లేదా అలవాటుగా కొనుగోలు చేస్తే జీవిత ఖైదు లేదా 10 ఏళ్లు) పడుతుంది.',
        punishment: 'సాధారణ (317(2)): 3 ఏళ్ల వరకు జైలు; డకాయితీ ఆస్తి / అలవాటుగా చేసేవారు (317(3)/(4)): జీవిత ఖైదు లేదా 10 ఏళ్ల కఠిన కారాగార శిక్ష',
        aiCommentary: 'పాత IPC సెక్షన్లు 410 నుండి 414 వరకు ఉన్న నిబంధనలను ఒకే సెక్షన్ 317 లోకి చేర్చారు.'
      },
      or: {
        title: 'ଚୋରା ସମ୍ପତ୍ତି (ଅସାଧୁ ଭାବେ ଗ୍ରହଣ କରିବା କିମ୍ବା ରଖିବା)',
        description: 'ଚୋରି, ଲୁଟ୍ ବା ବିଶ୍ୱାସଘାତକତା ଦ୍ୱାରା ପ୍ରାପ୍ତ ସମ୍ପତ୍ତିକୁ ଜାଣିଶୁଣି ଗ୍ରହଣ କରିବା ବା ରଖିବା ଦଣ୍ଡନୀୟ ଅପରାଧ ଅଟେ।',
        punishment: 'ସାଧାରଣ (317(2)): ୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଜେଲ୍; ଡକାୟତି ସମ୍ପତ୍ତି/ଅଭ୍ୟସ୍ତ ବ୍ୟবସାୟୀ (317(3)/(4)): ଆଜୀବନ ବା ୧୦ ବର୍ଷ କଠୋର କାରାବାସ',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 410 ରୁ 414 କୁ ଗୋଟିଏ ଧାରା 317 ରେ ଏକତ୍ର କରାଯାଇଛି।'
      }
    }
  },
  {
    chapter: 'XVIII',
    chapterName: {
      en: 'Of Offences Relating to Documents and to Property Marks',
      hi: 'दस्तावेजों और संपत्ति चिह्नों से संबंधित अपराध',
      te: 'పత్రాలు మరియు ఆస్తి గుర్తులకు సంబంధించిన నేరాలు',
      or: 'ଦଲିଲ ଏବଂ ସମ୍ପତ୍ତି ଚିହ୍ନ ସମ୍ବନ୍ଧୀୟ ଅପରାଧ'
    },
    section: '340',
    ipcEquivalent: 'IPC Sec 470 / 471',
    category: 'Forgery, Intimidation & Defamation',
    cognizable: 'Cognizable',
    bailable: 'Bailable',
    triableBy: 'Magistrate of the First Class',
    forensicMandatory7Yr: false,
    bnssProcedure: 'Seize original forged document or electronic record and trace where it was tendered as genuine.',
    bsaAdmissibility: 'FSL document/cyber report and BSA Sec 63 certificate for electronic records.',
    ingredients: [
      'Fraudulently or dishonestly using as genuine any document or electronic record',
      'Which the person knows or has reason to believe to be a forged document or forged electronic record'
    ],
    investigativeSteps: [
      'Collect official receipt/submission record proving the accused tendered the forged document/electronic file as genuine.'
    ],
    translations: {
      en: {
        title: 'Forged document or electronic record and using it as genuine',
        description: 'A false document or electronic record made wholly or in part by forgery is designated a "forged document or electronic record". Whoever fraudulently or dishonestly uses as genuine any document or electronic record which he knows or has reason to believe to be forged, shall be punished in the same manner as if he had forged such document or electronic record.',
        punishment: 'Same punishment as if the offender had forged such document or electronic record (Up to 2 to 7 years / Life depending on document)',
        aiCommentary: 'Replaces IPC Sections 470 and 471, holding users of forged physical or electronic documents equally liable as the creator of the forgery.'
      },
      hi: {
        title: 'कूटरचित (जाली) दस्तावेज या इलेक्ट्रॉनिक अभिलेख और उसे असली के रूप में उपयोग में लाना',
        description: 'जो कोई किसी ऐसे दस्तावेज या इलेक्ट्रॉनिक अभिलेख को, जिसके कूटरचित (जाली) होने का उसे ज्ञान या विश्वास है, कपटपूर्वक या बेईमानी से असली के रूप में उपयोग में लाता है, वह उसी प्रकार दण्डित किया जाएगा मानो उसने स्वयं वह कूटरचना की हो।',
        punishment: 'उसी प्रकार दण्डित मानो उसने स्वयं उस दस्तावेज या इलेक्ट्रॉनिक अभिलेख की कूटरचना की हो (2 से 7 वर्ष / आजीवन कारावास)',
        aiCommentary: 'पुरानी आईपीसी धारा 470 और 471 का स्थान लेता है और फर्जी डिजिटल/भौतिक दस्तावेज का उपयोग करने वाले को समान रूप से दण्डित करता है।'
      },
      te: {
        title: 'నకిలీ పత్రం లేదా ఎలక్ట్రానిక్ రికార్డును అసలైనదిగా ఉపయోగించడం',
        description: 'ఫోర్జరీ చేసిన పత్రం లేదా ఎలక్ట్రానిక్ రికార్డు అని తెలిసినప్పటికీ దానిని నిజాయితీ లేకుండా అసలైనదిగా ఉపయోగిస్తే, స్వయంగా ఫోర్జరీ చేసిన వ్యక్తికి విధించే శిక్షే విధించబడుతుంది.',
        punishment: 'ఆ పత్రాన్ని స్వయంగా ఫోర్జరీ చేసినట్లుగానే సమానమైన శిక్ష (2 నుండి 7 ఏళ్లు / జీవిత ఖైదు)',
        aiCommentary: 'పాత IPC సెక్షన్లు 470 మరియు 471 స్థానంలో వచ్చింది. నకిలీ పత్రాలను లేదా డిజిటల్ రికార్డులను వాడేవారికి కూడా సమాన శిక్ష విధిస్తుంది.'
      },
      or: {
        title: 'ଜାଲ୍ ଦଲିଲ ବା ଇଲେକ୍ଟ୍ରୋନିକ୍ ରେକର୍ଡକୁ ଅସଲି ଭାବେ ବ୍ୟବହାର କରିବା',
        description: 'କୌଣସି ଦଲିଲ ବା ଇଲେକ୍ଟ୍ରୋନିକ୍ ରେକର୍ଡ ଜାଲ୍ ବୋଲି ଜାଣି ମଧ୍ୟ ତାହାକୁ କପଟ ବା ଅସାଧୁ ଭାବେ ଅସଲି ରୂପେ ବ୍ୟବହାର କଲେ, ନିଜେ ଜାଲିଆତି କରିଥିବା ଭଳି ସମାନ ଦଣ୍ଡ ମିଳିବ।',
        punishment: 'ସେହି ଦଲିଲ ବା ଇଲେକ୍ଟ୍ରୋନିକ୍ ରେକର୍ଡ ନିଜେ ଜାଲିଆତି କରିଥିବା ଭଳି ସମାନ ଦଣ୍ଡ (୨ ରୁ ୭ ବର୍ଷ / ଆଜୀବନ କାରାବାସ)',
        aiCommentary: 'ପୁରୁଣା IPC ଧାରା 470 ଓ 471 ର ସ୍ଥାନ ନିଏ ଏବଂ ଜାଲ୍ ଡିଜିଟାଲ୍/ଭୌତିକ ଦଲିଲ ବ୍ୟବହାରକାରୀଙ୍କୁ ସମାନ ଭାବେ ଦଣ୍ଡିତ କରେ।'
      }
    }
  }
];

