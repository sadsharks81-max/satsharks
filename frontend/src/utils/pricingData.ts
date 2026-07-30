export interface FeatureCategory {
  cat: string;
  items: string[];
}

export interface Scholarship {
  name: string;
  detail: string;
}

export interface CountryData {
  id: string;
  name: string;
  flag: string;
  t1: string;
  t2: string;
  t1l?: string;
  t2l?: string;
  tagline: string;
  ecHighlight: string;
  guided: FeatureCategory[];
  complete: FeatureCategory[];
  scholarships: Scholarship[];
}

export const PORTAL_FEATURES: FeatureCategory[] = [
  { cat: "Full Adaptive Testing Engine", items: ["10 full length adaptive SAT papers that mirror the real digital SAT exactly", "Every single question and section is timed, just like test day", "The exam screen, layout, and interface is identical to the actual SAT, no surprises when you sit the real thing"] },
  { cat: "5,000+ Topical Question Bank", items: ["Questions sorted by topic across every SAT subject area", "Three difficulty levels: easy, medium, and hard", "Filter by topic and difficulty to focus on exactly what you need"] },
  { cat: "Build Your Own Practice Tests", items: ["Create custom timed tests where you decide the number of questions and time limit", "Mix topics and difficulty levels to simulate your personal weak areas", "Everything is timed so you always practice under real pressure"] },
  { cat: "Smart Analytics and Improvement Engine", items: ["Detailed analytics showing your weak areas by topic and question type", "The portal suggests exactly what to work on next based on your performance", "Track your progress over time and watch your weak spots become strengths"] },
  { cat: "Interactive Vocabulary Games", items: ["Learn SAT vocabulary through engaging games, not boring flashcards", "Retention is higher when learning feels like playing", "Builds the reading and writing foundation that separates 1400 from 1500+"] },
  { cat: "Leaderboard and Community", items: ["See how you rank against other SAT Sharks students", "Healthy competition drives better scores and keeps motivation high", "Report any issue directly through the portal and our 24/7 dedicated support team will resolve it"] }
];

export const LUMS_SCHOLARSHIPS: Scholarship[] = [
  { name: "National Outreach Programme (NOP)", detail: "LUMS flagship full ride scholarship. Covers 100% tuition, hostel accommodation, meals, and living stipends for talented students from financially disadvantaged backgrounds across Pakistan" },
  { name: "Sekha Scholarship", detail: "100% tuition fee waiver for the entire undergraduate degree at SBASSE for FSc top 10 position holders from any of the 23 national boards" },
  { name: "PHEC Honhaar Undergraduate Scholarship", detail: "Joint initiative between LUMS and Punjab Higher Education Commission providing support to high achieving students to pursue undergraduate studies without financial burden" },
  { name: "Punjab Educational Endowment Fund (PEEF)", detail: "External scholarship available to LUMS students from Punjab providing financial support based on merit and need" },
  { name: "LUMS Merit Scholarships", detail: "100 scholarships for top ranked students on the admissions evaluation list. Covers partial to full tuition for one year, renewed based on CGPA and Dean's Honour List" },
  { name: "Need Based Tuition Fee Waiver", detail: "Covers 20% to 100% of tuition fees based on demonstrated financial need. Over 40% of LUMS students receive some form of financial aid" },
  { name: "SBASSE Honorific Fellowships", detail: "50% tuition waiver for top students majoring in Biology, Chemistry, Mathematics, and Physics. Awarded to sophomores, juniors, and seniors. Named fellowships include Bilqees Mujeeb (Biology), Ahmed H. Zewail (Chemistry), and Chandrasekhar (Physics)" },
  { name: "Teaching Assistantships and Research Assistantships", detail: "Paid positions for graduate and senior undergraduate students providing stipends and valuable academic experience working alongside LUMS faculty" },
  { name: "Shahid Hussain Foundation Scholarships", detail: "Financial support specifically for international students applying to LUMS" },
  { name: "Alumni and External Donor Funding", detail: "LUMS collaborates with various alumni and corporate donors to facilitate students through a range of named scholarships and financial support programs" }
];

export const LUMS_PROGRAMS = [
  { school: "Suleman Dawood School of Business (SDSB)", progs: "BBA, MBA, Executive MBA, MS Healthcare Management, MS Technology Management, MS Business and Public Policy, MS Financial Management, MS Accounting and Analytics, PhD" },
  { school: "Syed Babar Ali School of Science and Engineering (SBASSE)", progs: "BSc Computer Science, BSc Electrical Engineering, BSc Mathematics, BSc Physics, BSc Chemistry, BSc Biology, BSc Economics and Mathematics, MS, PhD" },
  { school: "Mushtaq Ahmad Gurmani School of Humanities and Social Sciences (MGSHSS)", progs: "BA Economics, BA Political Science, BA Sociology, BA Psychology, BA History, BA English, BA Comparative Literary and Cultural Studies, MA, PhD" },
  { school: "Shaikh Ahmad Hassan School of Law (SAHSOL)", progs: "BA LLB (Hons), LLM" },
  { school: "Syed Ahsan Ali and Syed Maratib Ali School of Education (SOE)", progs: "BS Educational Psychology (New), MPhil Education Leadership and Management, Executive MPhil Education Leadership and Management, Undergraduate Minors in Education" }
];

export const LUMS_FEATURES_GUIDED: FeatureCategory[] = [
  { cat: "Personal Statement, Collaborative Deep Dive", items: ["Work one on one with a counsellor who knows exactly what LUMS admissions looks for", "Uncover the real story behind your experiences, not the version everyone else writes", "Shape your narrative until it is sharp, authentic, and impossible to forget", "Multiple rounds of feedback until your voice comes through on every line"] },
  { cat: "Extracurricular and Awards Descriptions", items: ["Rewrite every entry to highlight leadership, initiative, and measurable impact", "Position activities strategically because LUMS values depth over breadth", "Optimized phrasing that makes the most of every character"] },
  { cat: "Cohesive Application Narrative", items: ["Connect your Personal Statement, Extracurriculars, and Awards into one unified, intentional story", "Eliminate contradictions and repetition across sections", "Ensure the admissions committee sees a focused applicant with clear direction"] }
];

export const LUMS_FEATURES_COMPLETE: FeatureCategory[] = [
  { cat: "Personal Statement, Written For You", items: ["We craft your entire LUMS Personal Statement from the ground up", "Already have a draft? We will transform it into something compelling", "Built on deep interviews to capture your authentic voice", "Unlimited revisions until you are fully confident in the result"] },
  { cat: "Complete Extracurricular and Awards Build Out", items: ["All extracurricular and awards descriptions written from scratch", "Profile analysis to identify hidden strengths and fill gaps", "Strategic positioning of activities to match what LUMS values most"] },
  { cat: "Extracurricular Development", items: ["Our dedicated EC developers design and guide you through competitions, research projects, and leadership roles LUMS actually cares about", "Build Math Olympiad preparation, Science competition entries, MUN participation, or hackathon projects from scratch", "We don't just describe your activities. We help you create them before you even apply", "Real, verifiable achievements that make your application impossible to ignore"] },
  { cat: "Opportunity and Competition Guidance", items: ["Curated recommendations for competitions and programs that elevate your profile", "Guidance on national and international opportunities that LUMS respects", "Support from registration through to winning", "Build real, verifiable achievements before your application goes in"] }
];

export const ADMISSION_COUNTRIES_PK: CountryData[] = [
  {
    id: "usa", name: "United States", flag: "🇺🇸", t1: "4,00,000", t2: "8,00,000", t1l: "4 Lac", t2l: "8 Lac",
    tagline: "The most competitive admissions process in the world. We make it yours.",
    ecHighlight: "We build research internships, hackathon portfolios, Model UN leadership, and community impact projects that Top 30 schools specifically look for",
    guided: [
      { cat: "Personal Statement, Collaborative Deep Dive", items: ["Work one on one with a counsellor who has placed Pakistani students in Top 30 US schools", "Uncover the story admissions officers haven't read a thousand times", "Shape raw experiences into a narrative that sticks", "4 rounds of detailed feedback until every sentence earns its spot"] },
      { cat: "Extracurricular and Awards Rewrite", items: ["Every activity entry rewritten to lead with leadership and outcomes", "Character count optimized with zero filler and maximum punch", "Strategic ordering so your strongest cards are played first"] },
      { cat: "Application Narrative Alignment", items: ["Your Personal Statement, Extracurriculars, and Awards woven into one coherent story", "Contradictions and dead weight eliminated across all sections", "Admissions committees see one clear, intentional applicant"] }
    ],
    complete: [
      { cat: "Personal Statement, Crafted For You", items: ["We write your entire Personal Statement from scratch", "Got a draft? We will rebuild it into something admissions teams remember", "Deep one on one interviews to capture your real voice, not ours", "Unlimited revisions until you would proudly read it out loud"] },
      { cat: "Full Extracurricular and Awards Build Out", items: ["Every extracurricular and award description written from the ground up", "Gap analysis to surface hidden strengths you did not know you had", "Activities positioned for maximum admissions impact, not just listed"] },
      { cat: "Extracurricular Development and Profile Building", items: ["Our dedicated EC developers design and guide you through research projects, competitions, and leadership roles", "Build a published research paper, launch a community initiative, or lead a national competition", "We don't just describe your activities, we help you create them from scratch", "Real, verifiable achievements that make admissions officers stop and pay attention"] },
      { cat: "School Selection and Scholarship Strategy", items: ["Data backed school list with reaches, targets, and safeties that actually fit", "Application strategy tailored to your profile and ambitions", "Scholarship identification and financial aid positioning across every target school"] }
    ],
    scholarships: [
      { name: "USEFP Fulbright Scholarship", detail: "Fully funded Masters and PhD. Covers tuition, living stipend, airfare, and health insurance" },
      { name: "HEC US Pakistan Knowledge Corridor", detail: "Fully funded PhD at Top 300 QS ranked US universities including Harvard, MIT, and Stanford" },
      { name: "Global UGRAD Program", detail: "US Department of State funded. One full semester at a US university, fully covered" },
      { name: "Harvard University Financial Aid", detail: "Need blind admissions. Families earning under $85,000 pay nothing" },
      { name: "Yale University Financial Aid", detail: "Need blind for all international applicants. Meets 100% of demonstrated need" },
      { name: "MIT Financial Aid", detail: "Need blind admissions. Over 60% of undergraduates receive need based aid" },
      { name: "Stamps Scholarship", detail: "Available at 40+ partner universities. Covers full cost of attendance plus enrichment funds" },
      { name: "American University Emerging Global Leader", detail: "Full tuition, room, and board for up to four years" }
    ]
  },
  {
    id: "canada", name: "Canada", flag: "🇨🇦", t1: "2,50,000", t2: "4,50,000", t1l: "2.5 Lac", t2l: "4.5 Lac",
    tagline: "World class education with a clear path to permanent residency. We position you to get in.",
    ecHighlight: "We develop community leadership initiatives, volunteer portfolios, and undergraduate research projects that Canadian schools value most",
    guided: [
      { cat: "Personal Profile, Collaborative Deep Dive", items: ["Craft a compelling personal profile that Canadian universities specifically look for", "Move beyond generic responses that admissions committees skim past", "Multiple rounds of feedback until your profile is polished and sharp"] },
      { cat: "Supplemental Essay Guidance", items: ["Guided approach to school specific supplementals for UBC, Waterloo, McGill, and more", "Each response crafted to reflect what individual programs value", "Strategic emphasis on community involvement and leadership"] },
      { cat: "Application Alignment", items: ["Your personal profile, supplementals, and extracurriculars presented as one cohesive story", "Every section reinforces a single compelling applicant narrative"] }
    ],
    complete: [
      { cat: "Personal Profile and Essays, Written For You", items: ["We craft your complete personal profile and all supplemental essays from scratch", "Deep interviews to understand your journey and capture your authentic voice", "Unlimited revisions across all written components"] },
      { cat: "Extracurricular Development", items: ["Our EC developers help you build meaningful community projects and volunteer leadership roles", "Design research collaborations and academic initiatives Canadian schools value", "Create the achievements first, then describe them powerfully"] },
      { cat: "University Selection and Scholarship Strategy", items: ["Strategic school list covering programs that match your academic and career goals", "Identification of entrance scholarships and financial awards at each target school", "Application timing and strategy optimized per institution"] },
      { cat: "Research and Portfolio Preparation", items: ["Guidance on highlighting research and project work for STEM applicants", "Portfolio preparation support for programs requiring creative submissions", "Letters of recommendation strategy and guidance"] }
    ],
    scholarships: [
      { name: "Lester B. Pearson Scholarship (University of Toronto)", detail: "Covers tuition, books, incidental fees, and full residence support for four years" },
      { name: "Schulich Leader Scholarships", detail: "Up to $120,000 for STEM students at 20 participating Canadian universities" },
      { name: "University of British Columbia International Scholars", detail: "Multiple awards ranging from $10,000 to full tuition" },
      { name: "McGill University Entrance Scholarships", detail: "Automatic consideration for merit awards up to $12,000 per year" },
      { name: "Vanier Canada Graduate Scholarships", detail: "$50,000 per year for up to three years for doctoral students" },
      { name: "University of Waterloo Merit Scholarships", detail: "Awards from $5,000 to $25,000 for high achieving international applicants" }
    ]
  },
  {
    id: "uk", name: "United Kingdom", flag: "🇬🇧", t1: "2,00,000", t2: "4,00,000", t1l: "2 Lac", t2l: "4 Lac",
    tagline: "One personal statement, five choices, zero room for error. We make every word count.",
    ecHighlight: "We build academic olympiad participation, extended research projects, and subject specific supercurriculars that Oxford and Cambridge admissions tutors look for",
    guided: [
      { cat: "UCAS Personal Statement, Collaborative Deep Dive", items: ["Build a subject focused statement that demonstrates genuine academic curiosity", "Structure your statement to stand out across all five UCAS choices", "Multiple rounds of feedback until every paragraph serves a purpose"] },
      { cat: "Supercurricular Development", items: ["Relevant reading, research, and projects woven into your academic profile", "Supercurricular activities highlighted to show depth of subject interest", "Wider participation presented to demonstrate a well rounded applicant"] },
      { cat: "Course Selection Strategy", items: ["Strategic selection of five UCAS choices that balance ambition with realistic targets", "Personal Statement aligned to work across multiple programs"] }
    ],
    complete: [
      { cat: "UCAS Personal Statement, Written For You", items: ["We write your complete UCAS Personal Statement from scratch", "Deep interviews to surface your academic passion and intellectual journey", "Unlimited revisions until you and your school are fully confident"] },
      { cat: "Extracurricular and Supercurricular Development", items: ["Our EC developers design extended research projects and academic initiatives in your subject area", "Build participation in subject olympiads, essay competitions, and academic conferences", "Create supercurricular depth that separates you from thousands of similar applicants"] },
      { cat: "Oxbridge and Top University Strategy", items: ["Application strategy for Oxford, Cambridge, Imperial, UCL, and LSE", "Guidance on admissions tests, written assessments, and interview preparation", "Subject specific advice on how to demonstrate academic depth"] },
      { cat: "Scholarship and Financial Support Strategy", items: ["Identification of university specific scholarships and bursaries", "Chevening, Commonwealth, and named scholarship application guidance", "Funding strategy to reduce your overall cost of attendance"] }
    ],
    scholarships: [
      { name: "Chevening Scholarships", detail: "UK Government funded. Full tuition, living expenses, and travel for one year Masters" },
      { name: "Commonwealth Scholarships", detail: "Fully funded through HEC Pakistan for Masters and PhD at UK universities" },
      { name: "Gates Cambridge Scholarship", detail: "Full cost of study at Cambridge including tuition, maintenance, and travel" },
      { name: "Rhodes Scholarship (Oxford)", detail: "Fully funded postgraduate study at Oxford for up to three years" },
      { name: "Clarendon Fund (Oxford)", detail: "Covers tuition and living expenses for graduate students" },
      { name: "Think Big Scholarships (Bristol)", detail: "Awards up to full tuition for international students" }
    ]
  },
  {
    id: "germany", name: "Germany", flag: "🇩🇪", t1: "2,50,000", t2: "5,00,000", t1l: "2.5 Lac", t2l: "5 Lac",
    tagline: "Tuition free education at world class universities. We navigate the complex process for you.",
    ecHighlight: "We develop technical research projects, lab internships, and STEM certifications that strengthen your profile for German engineering and science programs",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Craft a compelling motivation letter that German universities specifically require", "Demonstrate academic readiness and genuine interest in your chosen program", "Multiple rounds of feedback aligned to German academic expectations"] },
      { cat: "APS and Uni Assist Guidance", items: ["Step by step support through the APS certification process", "Guidance on documents for the uni-assist portal", "Academic credential evaluation and preparation"] },
      { cat: "Application Portfolio Alignment", items: ["Your motivation letter, academic profile, and extracurriculars presented cohesively", "Every element reinforces your readiness for the German academic system"] }
    ],
    complete: [
      { cat: "Motivation Letter, Written For You", items: ["We write your complete motivation letter from scratch for each target university", "Deep interviews to capture your academic journey and career vision", "Unlimited revisions across all written materials"] },
      { cat: "Extracurricular and Technical Profile Development", items: ["Our EC developers guide you through technical projects, coding portfolios, and research initiatives", "Build verifiable STEM achievements that German universities value", "Create industry relevant certifications and project documentation"] },
      { cat: "Full APS and Application Management", items: ["Complete APS certification support from start to finish", "All uni-assist applications prepared and reviewed", "Document preparation, translation coordination, and deadline management"] },
      { cat: "Scholarship Applications", items: ["DAAD, Erasmus, and university specific scholarship identification", "All scholarship essays and documents prepared", "Financial planning for living in Germany"] }
    ],
    scholarships: [
      { name: "DAAD Scholarships", detail: "Germany's largest scholarship organization with programs at all academic levels" },
      { name: "Erasmus Mundus Joint Masters", detail: "EU funded covering tuition, travel, and living costs across European universities" },
      { name: "Deutschlandstipendium", detail: "€300 per month merit scholarship at most German universities" },
      { name: "Heinrich Boll Foundation", detail: "Full funding for international students aligned with ecology and democracy values" },
      { name: "Friedrich Ebert Foundation", detail: "Monthly stipend plus tuition for committed international students" }
    ]
  },
  {
    id: "japan", name: "Japan", flag: "🇯🇵", t1: "2,50,000", t2: "5,00,000", t1l: "2.5 Lac", t2l: "5 Lac",
    tagline: "MEXT, world class universities, and a culture of academic excellence. We open the door.",
    ecHighlight: "We help you develop published research papers, academic conference presentations, and faculty collaboration projects that MEXT reviewers and Japanese professors specifically look for",
    guided: [
      { cat: "Research Proposal, Collaborative Deep Dive", items: ["Craft a compelling research proposal aligned with Japanese faculty interests", "Demonstrate clear research direction and academic potential", "Multiple rounds of feedback from counsellors experienced with Japanese admissions"] },
      { cat: "Faculty Contact Strategy", items: ["Guidance on identifying and approaching potential research supervisors", "Professional communication strategy for initial faculty outreach", "Building genuine academic connection before formal application"] },
      { cat: "Application Alignment", items: ["Research proposal, statement of purpose, and academic profile presented cohesively", "Every element demonstrates your fit for the Japanese academic environment"] }
    ],
    complete: [
      { cat: "Research Proposal, Written For You", items: ["We write your complete research proposal and statement of purpose from scratch", "Deep interviews to understand your research interests", "Unlimited revisions until your proposal is faculty ready"] },
      { cat: "Research Profile Development", items: ["Our team guides you through publishing a research paper or presenting at an academic conference", "Build a credible research portfolio before you even apply", "Create the academic track record that makes professors want to supervise you"] },
      { cat: "Full MEXT Application Support", items: ["Complete MEXT scholarship application prepared from start to finish", "Study plan, research plan, and all supporting documents polished", "Embassy and university recommendation track strategy"] },
      { cat: "Scholarship and Funding Strategy", items: ["MEXT, JASSO, and university specific scholarship identification", "All scholarship essays and documents prepared", "Financial planning for living in Japan"] }
    ],
    scholarships: [
      { name: "MEXT Scholarship (Japanese Government)", detail: "Fully funded. Covers tuition, monthly stipend of 143,000+ yen, and round trip airfare" },
      { name: "JASSO Student Exchange Support", detail: "Monthly stipend of 80,000 yen for international students" },
      { name: "ADB Japan Scholarship Program", detail: "Full tuition and living for students from ADB member countries including Pakistan" },
      { name: "University of Tokyo PEAK Scholarships", detail: "Full tuition waiver and monthly stipend for undergraduates" },
      { name: "Kyoto University International Scholarships", detail: "Multiple programs for international graduate students" }
    ]
  },
  {
    id: "korea", name: "South Korea", flag: "🇰🇷", t1: "2,50,000", t2: "5,00,000", t1l: "2.5 Lac", t2l: "5 Lac",
    tagline: "KGSP, world ranked universities, and a thriving student culture. We get you there.",
    ecHighlight: "We build innovation projects, entrepreneurship portfolios, and cultural exchange initiatives that Korean universities and KGSP reviewers value",
    guided: [
      { cat: "Statement of Purpose, Collaborative Deep Dive", items: ["Craft a compelling statement that Korean universities specifically look for", "Demonstrate academic motivation and genuine interest in studying in Korea", "Multiple rounds of feedback aligned to Korean admissions standards"] },
      { cat: "Study Plan Development", items: ["Detailed study plan showing clear academic and career direction", "Research interest alignment with available programs and faculty", "Language learning plan and cultural integration strategy"] },
      { cat: "Application Alignment", items: ["Statement, study plan, and academic profile as one cohesive package", "Every element reinforces your commitment to academic excellence"] }
    ],
    complete: [
      { cat: "Statement and Study Plan, Written For You", items: ["We write your complete statement of purpose and study plan from scratch", "Deep interviews to capture your motivations and aspirations", "Unlimited revisions until every document is submission ready"] },
      { cat: "Extracurricular and Innovation Profile", items: ["Our EC developers help you build innovation, tech, or social impact projects", "Create entrepreneurship or cultural exchange initiatives that stand out", "Develop verifiable achievements Korean universities specifically value"] },
      { cat: "Full KGSP Application Support", items: ["Complete Korean Government Scholarship application prepared", "All essays, study plans, and documents polished", "Embassy track and university track application strategy"] },
      { cat: "Scholarship Strategy", items: ["KGSP, university merit, and private foundation scholarships", "All application materials prepared", "Financial planning for South Korea"] }
    ],
    scholarships: [
      { name: "Korean Government Scholarship Program (KGSP)", detail: "Fully funded. Covers tuition, stipend, airfare, settlement, and Korean language training" },
      { name: "Korea University International Scholarship", detail: "Up to full tuition waiver for outstanding international students" },
      { name: "Yonsei University Global Leader Fellowship", detail: "Full tuition coverage for top international applicants" },
      { name: "KAIST International Student Scholarship", detail: "Full tuition plus monthly living allowance" },
      { name: "Seoul National University Development Scholarship", detail: "Partial to full tuition for international graduates" }
    ]
  },
  {
    id: "china", name: "China", flag: "🇨🇳", t1: "1,50,000", t2: "3,00,000", t1l: "1.5 Lac", t2l: "3 Lac",
    tagline: "Affordable world class education with generous government scholarships. Your gateway to Asia.",
    ecHighlight: "We help you develop academic competition results and community development projects that strengthen your CSC scholarship application",
    guided: [
      { cat: "Study Plan, Collaborative Deep Dive", items: ["Craft a clear and compelling study plan that Chinese universities require", "Demonstrate your academic goals and reasons for choosing China", "Feedback rounds until your study plan meets CSC standards"] },
      { cat: "Personal Statement Support", items: ["Personal statement tailored to Chinese university expectations", "Academic achievements and extracurriculars presented effectively", "Motivation clearly connected to your chosen program"] },
      { cat: "Application Alignment", items: ["Study plan, personal statement, and documents aligned as a cohesive package", "Every section reinforces your seriousness and academic readiness"] }
    ],
    complete: [
      { cat: "Study Plan and Personal Statement, Written For You", items: ["We write your complete study plan and personal statement from scratch", "Deep interviews to understand your goals and capture your voice", "Unlimited revisions across all written components"] },
      { cat: "Profile Strengthening", items: ["Our team helps you build academic competition results and community projects", "Create achievements that make your CSC application stand out from thousands", "Develop a profile that shows leadership and academic commitment"] },
      { cat: "Full CSC Application Support", items: ["Complete Chinese Scholarship Council application prepared end to end", "University acceptance letter strategy and coordination", "All essays and documents written and polished"] },
      { cat: "Scholarship Strategy", items: ["CSC, Confucius Institute, provincial, and university scholarships", "All application materials prepared", "Financial planning for China"] }
    ],
    scholarships: [
      { name: "Chinese Government Scholarship (CSC)", detail: "Fully funded. Covers tuition, accommodation, stipend, and medical insurance" },
      { name: "Confucius Institute Scholarship", detail: "Full or partial funding for Chinese language programs" },
      { name: "Chinese Provincial Government Scholarships", detail: "Regional scholarships with significant funding" },
      { name: "Tsinghua University Scholarship", detail: "Full tuition waiver and living stipend" },
      { name: "Peking University International Scholarships", detail: "Multiple programs covering tuition and living" }
    ]
  },
  {
    id: "australia", name: "Australia", flag: "🇦🇺", t1: "2,00,000", t2: "4,00,000", t1l: "2 Lac", t2l: "4 Lac",
    tagline: "Top ranked universities with strong post study work rights. We position your application for success.",
    ecHighlight: "We develop research initiatives and leadership portfolios that strengthen scholarship applications for Australian merit awards",
    guided: [
      { cat: "Personal Statement, Collaborative Deep Dive", items: ["Craft a compelling statement of purpose for Australian admissions", "Demonstrate your academic goals and reasons for choosing Australia", "Multiple rounds of feedback until polished"] },
      { cat: "Academic Profile Optimization", items: ["Achievements highlighted for Australian university standards", "Relevant experience and extracurriculars positioned effectively", "Professional references strategy and guidance"] },
      { cat: "Application Alignment", items: ["All materials presented as one cohesive professional package", "Every section reinforces your fit for Australian standards"] }
    ],
    complete: [
      { cat: "Personal Statement, Written For You", items: ["We write your complete statement of purpose from scratch", "Deep interviews to understand your motivations", "Unlimited revisions until fully confident"] },
      { cat: "Research and Leadership Development", items: ["Our EC developers help you build research projects and leadership roles", "Create scholarship worthy achievements that set you apart", "Develop a profile that competes for Australia's top merit awards"] },
      { cat: "University Selection and Scholarship Strategy", items: ["Strategic list based on rankings, location, and scholarship availability", "Identification of university merit awards and research scholarships", "Strategy optimized per institution and intake cycle"] },
      { cat: "Scholarship Applications", items: ["Australia Awards, Endeavour, and university specific scholarships", "All application essays and documents prepared", "Financial planning for Australia"] }
    ],
    scholarships: [
      { name: "Australia Awards Scholarships", detail: "Fully funded by the Australian Government covering tuition, travel, and living" },
      { name: "University of Melbourne International Scholarships", detail: "Up to full fee remission for high achieving students" },
      { name: "University of Sydney International Scholarships", detail: "Merit based awards covering up to full tuition" },
      { name: "Monash University Merit Scholarships", detail: "Awards up to $50,000 across the duration of study" }
    ]
  },
  {
    id: "france", name: "France", flag: "🇫🇷", t1: "2,00,000", t2: "4,00,000", t1l: "2 Lac", t2l: "4 Lac",
    tagline: "World renowned universities with surprisingly affordable tuition. We handle Campus France.",
    ecHighlight: "We build academic research projects and cultural exchange initiatives that strengthen Eiffel and Grandes Ecoles applications",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Craft a compelling motivation letter in the style French universities expect", "Demonstrate genuine academic interest and career direction", "Feedback rounds until your letter meets French standards"] },
      { cat: "Campus France Guidance", items: ["Step by step support through the Campus France portal", "Credential evaluation and document preparation", "Interview preparation for Campus France"] },
      { cat: "Application Alignment", items: ["Motivation letter and academic profile as one cohesive package", "Every element demonstrates readiness for the French system"] }
    ],
    complete: [
      { cat: "Motivation Letter, Written For You", items: ["We write your letter from scratch for each target university", "Deep interviews to capture your journey", "Unlimited revisions"] },
      { cat: "Profile and Extracurricular Development", items: ["Our team helps you develop research and cultural exchange initiatives", "Build achievements that French admissions committees value", "Create a profile worthy of Eiffel and Grandes Ecoles selection"] },
      { cat: "Full Campus France Application", items: ["Complete application prepared start to finish", "All university applications prepared and reviewed", "Timeline management"] },
      { cat: "Scholarship Applications", items: ["Eiffel, Erasmus, and university awards", "All materials prepared", "Financial planning for France"] }
    ],
    scholarships: [
      { name: "Eiffel Excellence Scholarship", detail: "French Government funded. Monthly allowance, travel, and housing" },
      { name: "Erasmus Mundus Joint Masters", detail: "EU funded covering tuition, travel, and living" },
      { name: "Sciences Po Emile Boutroux Scholarship", detail: "Full tuition waiver for outstanding undergraduates" },
      { name: "Campus France Excellence Scholarships", detail: "Various awards through the French Embassy for Pakistani students" }
    ]
  },
  {
    id: "netherlands", name: "Netherlands", flag: "🇳🇱", t1: "2,00,000", t2: "4,00,000", t1l: "2 Lac", t2l: "4 Lac",
    tagline: "English taught programs at globally ranked universities. Applications that stand out.",
    ecHighlight: "We develop innovation projects and academic initiatives that Dutch universities with their interactive learning culture specifically value",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Program specific motivation letters for Dutch universities", "Demonstrate clear academic fit and career direction", "Multiple rounds of feedback aligned to Dutch expectations"] },
      { cat: "Academic Profile Optimization", items: ["Achievements positioned for Dutch standards", "Relevant experience highlighted", "Professional references strategy"] },
      { cat: "Application Alignment", items: ["Letters and profile aligned across all targets", "Every element reinforces your fit"] }
    ],
    complete: [
      { cat: "Motivation Letters, Written For You", items: ["Separate letters for each program from scratch", "Deep interviews to understand your goals", "Unlimited revisions"] },
      { cat: "Innovation and Project Development", items: ["Our EC developers help you build innovation or social enterprise projects", "Create initiatives that reflect the Dutch emphasis on problem solving and collaboration", "Develop achievements that strengthen scholarship applications"] },
      { cat: "Full Application Management", items: ["All Studielink and portal applications prepared", "Document preparation and credential evaluation", "Timeline management"] },
      { cat: "Scholarship Applications", items: ["Holland Scholarship, Orange Tulip, and university awards", "All materials prepared", "Financial planning for the Netherlands"] }
    ],
    scholarships: [
      { name: "Holland Scholarship", detail: "€5,000 for students from outside the EEA" },
      { name: "Orange Tulip Scholarship", detail: "Scholarships specifically for Pakistani students at Dutch universities" },
      { name: "Erasmus University Rotterdam Scholarship", detail: "Full tuition plus living expenses" },
      { name: "Delft University of Technology Scholarships", detail: "Full tuition for excellent MSc students" }
    ]
  },
  {
    id: "ireland", name: "Ireland", flag: "🇮🇪", t1: "2,00,000", t2: "4,00,000", t1l: "2 Lac", t2l: "4 Lac",
    tagline: "English speaking, globally ranked, generous post study work. We build your application.",
    ecHighlight: "We develop academic leadership and community engagement projects valued by Trinity, UCD, and other top Irish institutions",
    guided: [
      { cat: "Personal Statement, Collaborative Deep Dive", items: ["Compelling personal statement for Irish admissions", "Demonstrate academic motivation and genuine interest", "Feedback until polished"] },
      { cat: "Academic Profile Optimization", items: ["Achievements positioned for Irish requirements", "Extracurriculars and leadership highlighted", "References strategy"] },
      { cat: "Application Alignment", items: ["Statement and profile presented cohesively", "Every section reinforces your fit"] }
    ],
    complete: [
      { cat: "Personal Statement, Written For You", items: ["Written from scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Extracurricular Development", items: ["Our EC developers build academic and community projects for your profile", "Create leadership roles and initiatives Irish universities value", "Develop a well rounded applicant profile beyond just grades"] },
      { cat: "University Selection and Scholarship Strategy", items: ["Strategic list covering Trinity, UCD, NUI Galway, and more", "Scholarship identification at each target", "Application strategy per institution"] },
      { cat: "Full Application Management", items: ["All applications prepared and reviewed", "Document preparation", "Timeline management"] }
    ],
    scholarships: [
      { name: "Government of Ireland International Scholarships", detail: "€10,000 per year plus full tuition waiver" },
      { name: "Trinity College Dublin Global Excellence", detail: "Significant fee reductions for outstanding students" },
      { name: "UCD Global Scholarships", detail: "Partial to full tuition for high achievers" },
      { name: "NUI Galway International Scholarships", detail: "Merit based awards" }
    ]
  },
  {
    id: "turkey", name: "Turkey", flag: "🇹🇷", t1: "1,50,000", t2: "3,00,000", t1l: "1.5 Lac", t2l: "3 Lac",
    tagline: "Turkiye Burslari and top universities at your doorstep. We handle everything.",
    ecHighlight: "We build volunteer leadership roles and social impact projects that Turkiye Burslari reviewers specifically evaluate during selection",
    guided: [
      { cat: "Statement of Purpose, Collaborative Deep Dive", items: ["Statement aligned to Turkiye Burslari requirements", "Demonstrate clear academic and career motivation", "Feedback until scholarship standards met"] },
      { cat: "Study Plan and Essay Support", items: ["Detailed study plan showing direction", "Supporting essays crafted to strengthen overall application", "Extracurricular profile positioned for Turkish standards"] },
      { cat: "Application Alignment", items: ["Statement, study plan, and essays as one cohesive package", "Every element reinforces readiness"] }
    ],
    complete: [
      { cat: "All Essays and Plans, Written For You", items: ["Everything written from scratch", "Deep interviews to understand goals", "Unlimited revisions"] },
      { cat: "Extracurricular and Volunteer Development", items: ["Our EC developers design volunteer, social impact, and leadership projects", "Build the community engagement profile that Turkiye Burslari reviewers prioritize", "Create verifiable achievements before you even apply"] },
      { cat: "Full Turkiye Burslari Application", items: ["Complete scholarship application prepared", "All documents organized and reviewed", "Interview preparation and strategy"] },
      { cat: "University Selection", items: ["Strategic list based on scholarship success rates", "Application strategy across universities", "Program matching"] }
    ],
    scholarships: [
      { name: "Turkiye Burslari", detail: "Fully funded. Tuition, accommodation, stipend, insurance, and Turkish language course" },
      { name: "Sabanci University International Scholarships", detail: "Full and partial tuition waivers" },
      { name: "Koc University Scholarships", detail: "Merit based covering tuition and living" },
      { name: "Bilkent University Full Tuition", detail: "100% tuition waiver for high achievers" }
    ]
  },
  {
    id: "italy", name: "Italy", flag: "🇮🇹", t1: "1,50,000", t2: "3,00,000", t1l: "1.5 Lac", t2l: "3 Lac",
    tagline: "Affordable tuition, rich culture, growing international programs. We get you in.",
    ecHighlight: "We develop design portfolios, technical projects, and academic initiatives for programs at Politecnico di Milano, Bocconi, and beyond",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Letter aligned to Italian expectations", "Demonstrate academic interest and career goals", "Feedback until polished"] },
      { cat: "Application Support", items: ["Pre enrollment guidance and document preparation", "Credential evaluation", "Timeline management"] },
      { cat: "Application Alignment", items: ["Letter and profile presented cohesively", "Every element reinforces readiness"] }
    ],
    complete: [
      { cat: "Motivation Letter, Written For You", items: ["Written from scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Portfolio and Project Development", items: ["Our EC developers help build design portfolios, technical projects, or research papers", "Create achievements that top Italian programs specifically value", "Develop a profile that competes for merit scholarships"] },
      { cat: "University Selection", items: ["Strategic list covering Politecnico, Bocconi, Bologna and more", "Program matching", "Scholarship identification"] },
      { cat: "Full Application and Scholarship Support", items: ["All applications prepared", "Invest Your Talent in Italy, DSU, and university award applications", "Financial planning"] }
    ],
    scholarships: [
      { name: "Invest Your Talent in Italy", detail: "Italian Government scholarships for students from selected countries" },
      { name: "DSU Regional Scholarships", detail: "Need based covering tuition, accommodation, and meals" },
      { name: "Politecnico di Milano Merit Scholarships", detail: "Full tuition waiver plus €5,000 per year" },
      { name: "Bocconi University Merit Awards", detail: "Tuition waivers up to 100%" }
    ]
  },
  {
    id: "nordics", name: "Sweden, Finland, Denmark", flag: "🇸🇪", t1: "2,00,000", t2: "4,00,000", t1l: "2 Lac", t2l: "4 Lac",
    tagline: "Innovation driven education with tuition free opportunities. We navigate the Nordic system.",
    ecHighlight: "We build sustainability projects, innovation initiatives, and social entrepreneurship profiles that Nordic universities with their progressive values prioritize",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Program specific letters for Nordic applications", "Demonstrate genuine fit and career direction", "Feedback aligned to Scandinavian standards"] },
      { cat: "Academic Profile Optimization", items: ["Achievements positioned for Nordic expectations", "Projects and leadership highlighted", "References strategy"] },
      { cat: "Application Alignment", items: ["Letters and profile aligned across targets", "Every element reinforces fit"] }
    ],
    complete: [
      { cat: "Motivation Letters, Written For You", items: ["Separate letters for each program", "Deep interviews", "Unlimited revisions"] },
      { cat: "Sustainability and Innovation Profile", items: ["Our EC developers help build sustainability, innovation, or social enterprise projects", "Create initiatives aligned with Nordic values of equality, sustainability, and innovation", "Develop achievements that make scholarship committees take notice"] },
      { cat: "University Selection", items: ["Strategic list across Sweden, Finland, and Denmark", "Tuition free programs at Finnish universities identified", "Scholarship identification per school"] },
      { cat: "Scholarship Applications", items: ["SI Scholarships, EDUFI, and university awards", "All materials prepared", "Financial planning for Nordic living"] }
    ],
    scholarships: [
      { name: "Swedish Institute Scholarships", detail: "Full tuition, living, and travel for Masters students from developing countries" },
      { name: "Finnish Government EDUFI Fellowships", detail: "Monthly grant for doctoral and postdoctoral research" },
      { name: "University of Helsinki Scholarships", detail: "Full tuition waiver for outstanding Masters students" },
      { name: "Denmark Government Scholarships", detail: "Tuition waivers and monthly grants" },
      { name: "KTH Scholarships", detail: "Full tuition waiver for top engineering applicants" }
    ]
  },
  {
    id: "easteurope", name: "Hungary, Poland, Czech Republic", flag: "🇭🇺", t1: "1,50,000", t2: "3,00,000", t1l: "1.5 Lac", t2l: "3 Lac",
    tagline: "Quality European education at accessible prices. Popular for medical and engineering programs.",
    ecHighlight: "We develop clinical volunteering, medical shadowing portfolios, and academic projects specifically for medical school and engineering program applications",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Compelling letter for Eastern European universities", "Demonstrate academic readiness and career goals", "Feedback until polished"] },
      { cat: "Application Support", items: ["University portal guidance and document preparation", "Credential evaluation", "Entrance exam guidance for medical programs"] },
      { cat: "Application Alignment", items: ["All materials presented cohesively", "Every section reinforces readiness"] }
    ],
    complete: [
      { cat: "Motivation Letter, Written For You", items: ["Written from scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Medical and Technical Profile Development", items: ["Our EC developers help build clinical volunteering, hospital shadowing, and lab research portfolios", "Create the medical or engineering extracurricular profile that competitive programs require", "Develop achievements that set you apart from other international applicants"] },
      { cat: "University Selection", items: ["Strategic list across Hungary, Poland, and Czech Republic", "Focus on medical, engineering, and business programs", "Scholarship identification"] },
      { cat: "Full Application and Scholarship Support", items: ["All applications prepared", "Stipendium Hungaricum, NAWA, and Czech Government applications", "Entrance exam strategy"] }
    ],
    scholarships: [
      { name: "Stipendium Hungaricum", detail: "Fully funded. Tuition, accommodation, stipend, and medical insurance" },
      { name: "NAWA Polish Government Scholarships", detail: "Tuition and living at Polish universities" },
      { name: "Czech Government Scholarships", detail: "Full tuition waiver and monthly stipend" },
      { name: "University of Warsaw International Scholarships", detail: "Merit based tuition waivers" },
      { name: "Semmelweis University Scholarships", detail: "Partial tuition for international medical students" }
    ]
  }
];

export const ADMISSION_COUNTRIES_INTL: CountryData[] = [
  {
    id: "usa", name: "United States", flag: "🇺🇸", t1: "$2,000", t2: "$4,500",
    tagline: "The most competitive admissions process in the world. We make it yours.",
    ecHighlight: "We build research internships, hackathon portfolios, Model UN leadership, and community impact projects that Top 30 schools specifically look for",
    guided: [
      { cat: "Personal Statement, Collaborative Deep Dive", items: ["Work one on one with a counsellor who has placed students in Top 30 US schools", "Uncover the story admissions officers haven't read a thousand times", "Shape raw experiences into a narrative that sticks", "4 rounds of detailed feedback until every sentence earns its spot"] },
      { cat: "Extracurricular and Awards Rewrite", items: ["Every activity entry rewritten to lead with leadership and outcomes", "Character count optimized with zero filler and maximum punch", "Strategic ordering so your strongest cards are played first"] },
      { cat: "Application Narrative Alignment", items: ["Your Personal Statement, Extracurriculars, and Awards woven into one coherent story", "Contradictions and dead weight eliminated across all sections", "Admissions committees see one clear, intentional applicant"] }
    ],
    complete: [
      { cat: "Personal Statement, Crafted For You", items: ["We write your entire Personal Statement from scratch", "Got a draft? We will rebuild it into something admissions teams remember", "Deep one on one interviews to capture your real voice, not ours", "Unlimited revisions until you would proudly read it out loud"] },
      { cat: "Full Extracurricular and Awards Build Out", items: ["Every extracurricular and award description written from the ground up", "Gap analysis to surface hidden strengths you did not know you had", "Activities positioned for maximum admissions impact, not just listed"] },
      { cat: "Extracurricular Development and Profile Building", items: ["Our dedicated EC developers design and guide you through research projects, competitions, and leadership roles", "Build a published research paper, launch a community initiative, or lead a national competition", "We don't just describe your activities, we help you create them from scratch", "Real, verifiable achievements that make admissions officers stop and pay attention"] },
      { cat: "School Selection and Scholarship Strategy", items: ["Data backed school list with reaches, targets, and safeties that actually fit", "Application strategy tailored to your profile and ambitions", "Scholarship identification and financial aid positioning across every target school"] }
    ],
    scholarships: [
      { name: "Harvard University Financial Aid", detail: "Need blind admissions. Families earning under $85,000 pay nothing" },
      { name: "Yale University Financial Aid", detail: "Need blind for all international applicants. Meets 100% of demonstrated need" },
      { name: "MIT Financial Aid", detail: "Need blind admissions. Over 60% of undergraduates receive need based aid" },
      { name: "Princeton University Financial Aid", detail: "Provides grants, not loans. Same policy for all students" },
      { name: "Stamps Scholarship", detail: "Available at 40+ partner universities. Full cost of attendance plus enrichment funds" },
      { name: "American University Emerging Global Leader", detail: "Full tuition, room, and board for up to four years" },
      { name: "Knight Hennessy Scholars at Stanford", detail: "Full funding for graduate studies. Open to all countries" },
      { name: "Duke Karsh International Scholarship", detail: "Full cost of attendance for four years" }
    ]
  },
  {
    id: "canada", name: "Canada", flag: "🇨🇦", t1: "$1,500", t2: "$3,000",
    tagline: "World class education with a clear path to permanent residency. We position you to get in.",
    ecHighlight: "We develop community leadership initiatives, volunteer portfolios, and undergraduate research projects that Canadian schools value most",
    guided: [
      { cat: "Personal Profile, Collaborative Deep Dive", items: ["Craft a compelling profile Canadian universities specifically look for", "Move beyond generic responses committees skim past", "Multiple rounds of feedback until polished"] },
      { cat: "Supplemental Essay Guidance", items: ["Guided approach to supplementals for UBC, Waterloo, McGill, and more", "Each response reflects what individual programs value", "Strategic emphasis on community and leadership"] },
      { cat: "Application Alignment", items: ["Profile, supplementals, and extracurriculars as one cohesive story", "Every section reinforces one compelling narrative"] }
    ],
    complete: [
      { cat: "Personal Profile and Essays, Written For You", items: ["Complete profile and all supplementals from scratch", "Deep interviews to capture your authentic voice", "Unlimited revisions"] },
      { cat: "Extracurricular Development", items: ["Our EC developers help you build meaningful community projects and volunteer leadership", "Design research collaborations Canadian schools value", "Create the achievements first, then describe them powerfully"] },
      { cat: "University Selection and Scholarship Strategy", items: ["Strategic list matching your academic and career goals", "Entrance scholarship identification at each target", "Timing and strategy optimized per institution"] },
      { cat: "Research and Portfolio Preparation", items: ["Research and project work guidance for STEM applicants", "Portfolio support for creative programs", "Recommendation strategy and guidance"] }
    ],
    scholarships: [
      { name: "Lester B. Pearson Scholarship (University of Toronto)", detail: "Covers tuition, books, fees, and residence for four years" },
      { name: "Schulich Leader Scholarships", detail: "Up to $120,000 for STEM students at 20 Canadian universities" },
      { name: "UBC International Scholars", detail: "Awards from $10,000 to full tuition" },
      { name: "McGill Entrance Scholarships", detail: "Merit awards up to $12,000 per year" },
      { name: "Vanier Canada Graduate Scholarships", detail: "$50,000 per year for up to three years for doctoral students" },
      { name: "Waterloo Merit Scholarships", detail: "$5,000 to $25,000 for high achieving applicants" }
    ]
  },
  {
    id: "uk", name: "United Kingdom", flag: "🇬🇧", t1: "$1,200", t2: "$2,500",
    tagline: "One personal statement, five choices, zero room for error. We make every word count.",
    ecHighlight: "We build academic olympiad participation, extended research projects, and subject specific supercurriculars that Oxford and Cambridge admissions tutors look for",
    guided: [
      { cat: "UCAS Personal Statement, Collaborative Deep Dive", items: ["Subject focused statement demonstrating genuine academic curiosity", "Structured to stand out across all five UCAS choices", "Feedback until every paragraph serves a purpose"] },
      { cat: "Supercurricular Development", items: ["Reading, research, and projects woven into your academic profile", "Supercurriculars showing depth of subject interest", "Wider participation demonstrating a well rounded applicant"] },
      { cat: "Course Selection Strategy", items: ["Strategic five UCAS choices balancing ambition with realistic targets", "Statement aligned across multiple programs"] }
    ],
    complete: [
      { cat: "UCAS Personal Statement, Written For You", items: ["Complete statement from scratch", "Deep interviews to surface academic passion", "Unlimited revisions"] },
      { cat: "Extracurricular and Supercurricular Development", items: ["Our EC developers design extended research projects and academic initiatives", "Build olympiad participation, essay competitions, and conference presentations", "Create supercurricular depth that separates you from thousands"] },
      { cat: "Oxbridge and Top University Strategy", items: ["Strategy for Oxford, Cambridge, Imperial, UCL, and LSE", "Admissions test, assessment, and interview preparation", "Subject specific advice on demonstrating academic depth"] },
      { cat: "Scholarship Strategy", items: ["University specific scholarships and bursaries identified", "Chevening, Commonwealth, and named scholarship guidance", "Funding strategy to reduce cost of attendance"] }
    ],
    scholarships: [
      { name: "Chevening Scholarships", detail: "UK Government funded. Full tuition, living, and travel for one year Masters" },
      { name: "Gates Cambridge Scholarship", detail: "Full cost at Cambridge including tuition, maintenance, and travel" },
      { name: "Rhodes Scholarship (Oxford)", detail: "Fully funded postgraduate study for up to three years" },
      { name: "Clarendon Fund (Oxford)", detail: "Tuition and living for graduate students" },
      { name: "Think Big Scholarships (Bristol)", detail: "Awards up to full tuition" },
      { name: "Edinburgh Global Scholarships", detail: "Significant tuition reductions for Masters students" }
    ]
  },
  {
    id: "germany", name: "Germany", flag: "🇩🇪", t1: "$1,500", t2: "$3,000",
    tagline: "Tuition free education at world class universities. We navigate the complex process for you.",
    ecHighlight: "We develop technical research projects, lab internships, and STEM certifications that strengthen your profile for German engineering and science programs",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Compelling letter German universities require", "Academic readiness and genuine interest demonstrated", "Feedback aligned to German expectations"] },
      { cat: "APS and Uni Assist Guidance", items: ["Step by step APS certification support", "Uni-assist portal document preparation", "Credential evaluation"] },
      { cat: "Application Alignment", items: ["Letter, profile, and extracurriculars presented cohesively", "Every element reinforces readiness for German academia"] }
    ],
    complete: [
      { cat: "Motivation Letter, Written For You", items: ["Complete letter from scratch per university", "Deep interviews capturing your vision", "Unlimited revisions"] },
      { cat: "Technical Profile Development", items: ["Our EC developers guide you through technical projects, coding portfolios, and research", "Build verifiable STEM achievements German universities value", "Create industry relevant certifications and documentation"] },
      { cat: "Full APS and Application Management", items: ["Complete APS support start to finish", "All uni-assist applications prepared", "Document preparation, translation, and deadline management"] },
      { cat: "Scholarship Applications", items: ["DAAD, Erasmus, and university scholarships identified", "All essays and documents prepared", "Financial planning for Germany"] }
    ],
    scholarships: [
      { name: "DAAD Scholarships", detail: "Germany's largest scholarship organization with programs at all levels" },
      { name: "Erasmus Mundus Joint Masters", detail: "EU funded covering tuition, travel, and living" },
      { name: "Deutschlandstipendium", detail: "€300 per month merit scholarship" },
      { name: "Heinrich Boll Foundation", detail: "Full funding for international students" },
      { name: "Friedrich Ebert Foundation", detail: "Monthly stipend plus tuition" }
    ]
  },
  {
    id: "japan", name: "Japan", flag: "🇯🇵", t1: "$1,500", t2: "$3,500",
    tagline: "MEXT, world class universities, and academic excellence. We open the door.",
    ecHighlight: "We help you develop published research papers, conference presentations, and faculty collaboration projects that MEXT reviewers and Japanese professors specifically look for",
    guided: [
      { cat: "Research Proposal, Collaborative Deep Dive", items: ["Proposal aligned with Japanese faculty interests", "Clear research direction and potential demonstrated", "Feedback from counsellors experienced with Japanese admissions"] },
      { cat: "Faculty Contact Strategy", items: ["Identifying and approaching potential supervisors", "Professional communication strategy", "Building academic connection before formal application"] },
      { cat: "Application Alignment", items: ["Proposal, statement, and profile presented cohesively", "Every element demonstrates fit for Japanese academia"] }
    ],
    complete: [
      { cat: "Research Proposal, Written For You", items: ["Complete proposal and statement from scratch", "Deep interviews on your research interests", "Unlimited revisions until faculty ready"] },
      { cat: "Research Profile Development", items: ["Our team guides you through publishing a research paper or presenting at a conference", "Build a credible research portfolio before you apply", "Create the track record that makes professors want to supervise you"] },
      { cat: "Full MEXT Application Support", items: ["Complete MEXT application prepared start to finish", "Study plan, research plan, and documents polished", "Embassy and university track strategy"] },
      { cat: "Scholarship Strategy", items: ["MEXT, JASSO, and university scholarships identified", "All materials prepared", "Financial planning for Japan"] }
    ],
    scholarships: [
      { name: "MEXT Scholarship (Japanese Government)", detail: "Fully funded. Tuition, 143,000+ yen monthly stipend, and airfare" },
      { name: "JASSO Student Exchange Support", detail: "80,000 yen monthly stipend" },
      { name: "University of Tokyo PEAK Scholarships", detail: "Full tuition and monthly stipend for undergraduates" },
      { name: "ADB Japan Scholarship", detail: "Full tuition and living for ADB member country students" },
      { name: "Kyoto University International Scholarships", detail: "Multiple programs for graduate students" }
    ]
  },
  {
    id: "korea", name: "South Korea", flag: "🇰🇷", t1: "$1,500", t2: "$3,000",
    tagline: "KGSP, world ranked universities, and a thriving student culture. We get you there.",
    ecHighlight: "We build innovation projects, entrepreneurship portfolios, and cultural exchange initiatives that Korean universities and KGSP reviewers value",
    guided: [
      { cat: "Statement of Purpose, Collaborative Deep Dive", items: ["Statement Korean universities look for", "Academic motivation and genuine interest demonstrated", "Feedback aligned to Korean standards"] },
      { cat: "Study Plan Development", items: ["Detailed plan showing academic and career direction", "Research alignment with programs and faculty", "Language and cultural integration strategy"] },
      { cat: "Application Alignment", items: ["Statement, plan, and profile as one cohesive package", "Every element reinforces commitment"] }
    ],
    complete: [
      { cat: "Statement and Study Plan, Written For You", items: ["Complete statement and plan from scratch", "Deep interviews capturing motivations", "Unlimited revisions"] },
      { cat: "Innovation and Project Development", items: ["Our EC developers help build innovation, tech, or social impact projects", "Create entrepreneurship or cultural initiatives that stand out", "Develop achievements Korean universities specifically value"] },
      { cat: "Full KGSP Application Support", items: ["Complete KGSP application prepared", "All documents polished", "Embassy and university track strategy"] },
      { cat: "Scholarship Strategy", items: ["KGSP, university, and foundation scholarships", "All materials prepared", "Financial planning for Korea"] }
    ],
    scholarships: [
      { name: "KGSP", detail: "Fully funded. Tuition, stipend, airfare, settlement, and Korean language training" },
      { name: "Korea University International Scholarship", detail: "Up to full tuition waiver" },
      { name: "Yonsei Global Leader Fellowship", detail: "Full tuition for top applicants" },
      { name: "KAIST International Scholarship", detail: "Full tuition plus monthly allowance" },
      { name: "Seoul National University Scholarship", detail: "Partial to full tuition for graduates" }
    ]
  },
  {
    id: "china", name: "China", flag: "🇨🇳", t1: "$800", t2: "$1,50,00",
    tagline: "Affordable world class education with generous government scholarships. Your gateway to Asia.",
    ecHighlight: "We help you develop academic competition results and community development projects that strengthen your CSC scholarship application",
    guided: [
      { cat: "Study Plan, Collaborative Deep Dive", items: ["Clear study plan meeting CSC standards", "Academic goals and reasons for China demonstrated", "Feedback until polished"] },
      { cat: "Personal Statement Support", items: ["Statement tailored to Chinese expectations", "Achievements presented effectively", "Motivation connected to your program"] },
      { cat: "Application Alignment", items: ["Plan, statement, and documents aligned cohesively", "Every section reinforces readiness"] }
    ],
    complete: [
      { cat: "Study Plan and Statement, Written For You", items: ["Complete plan and statement from scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Profile Strengthening", items: ["Our team helps build academic competition results and community projects", "Create achievements that make your CSC application stand out", "Develop leadership and academic commitment"] },
      { cat: "Full CSC Application Support", items: ["Complete CSC application prepared end to end", "University acceptance letter strategy", "All documents polished"] },
      { cat: "Scholarship Strategy", items: ["CSC, Confucius, provincial, and university scholarships", "All materials prepared", "Financial planning for China"] }
    ],
    scholarships: [
      { name: "Chinese Government Scholarship (CSC)", detail: "Fully funded. Tuition, accommodation, stipend, and insurance" },
      { name: "Confucius Institute Scholarship", detail: "Full or partial funding for language programs" },
      { name: "Provincial Government Scholarships", detail: "Regional scholarships with significant funding" },
      { name: "Tsinghua University Scholarship", detail: "Full tuition and living stipend" },
      { name: "Peking University Scholarships", detail: "Multiple programs covering tuition and living" }
    ]
  },
  {
    id: "australia", name: "Australia", flag: "🇦🇺", t1: "$1,200", t2: "$2,500",
    tagline: "Top ranked universities with strong post study work rights. We position your application.",
    ecHighlight: "We develop research initiatives and leadership portfolios that strengthen scholarship applications for Australian merit awards",
    guided: [
      { cat: "Personal Statement, Collaborative Deep Dive", items: ["Compelling statement for Australian admissions", "Academic goals and reasons demonstrated", "Feedback until polished"] },
      { cat: "Academic Profile Optimization", items: ["Achievements highlighted for Australian standards", "Experience positioned effectively", "References strategy"] },
      { cat: "Application Alignment", items: ["All materials as one cohesive package", "Every section reinforces fit"] }
    ],
    complete: [
      { cat: "Personal Statement, Written For You", items: ["Complete statement from scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Research and Leadership Development", items: ["Our EC developers build research projects and leadership roles", "Create scholarship worthy achievements", "Develop a profile competing for top merit awards"] },
      { cat: "University Selection and Scholarship Strategy", items: ["Strategic list based on rankings and scholarship availability", "Merit awards and research scholarships identified", "Strategy optimized per institution"] },
      { cat: "Scholarship Applications", items: ["Australia Awards and university scholarships", "All materials prepared", "Financial planning"] }
    ],
    scholarships: [
      { name: "Australia Awards Scholarships", detail: "Fully funded. Tuition, travel, and living" },
      { name: "University of Melbourne Scholarships", detail: "Up to full fee remission" },
      { name: "University of Sydney Scholarships", detail: "Merit based up to full tuition" },
      { name: "Monash Merit Scholarships", detail: "Awards up to $50,000" },
      { name: "Destination Australia", detail: "$15,000 per year for regional study" }
    ]
  },
  {
    id: "france", name: "France", flag: "🇫🇷", t1: "$1,200", t2: "$2,500",
    tagline: "World renowned universities with affordable tuition. We handle Campus France.",
    ecHighlight: "We build academic research projects and cultural exchange initiatives that strengthen Eiffel and Grandes Ecoles applications",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Letter in the style French universities expect", "Genuine interest and direction demonstrated", "Feedback until it meets French standards"] },
      { cat: "Campus France Guidance", items: ["Step by step Campus France support", "Credential evaluation and documents", "Interview preparation"] },
      { cat: "Application Alignment", items: ["Letter and profile as one cohesive package", "Every element demonstrates readiness"] }
    ],
    complete: [
      { cat: "Motivation Letter, Written For You", items: ["Letter from scratch per university", "Deep interviews", "Unlimited revisions"] },
      { cat: "Profile Development", items: ["Our team helps develop research and cultural exchange initiatives", "Build achievements French committees value", "Create an Eiffel worthy profile"] },
      { cat: "Full Campus France Application", items: ["Complete application start to finish", "All university applications prepared", "Timeline management"] },
      { cat: "Scholarship Applications", items: ["Eiffel, Erasmus, and university awards", "All materials prepared", "Financial planning"] }
    ],
    scholarships: [
      { name: "Eiffel Excellence Scholarship", detail: "French Government funded. Allowance, travel, and housing" },
      { name: "Erasmus Mundus Joint Masters", detail: "EU funded covering tuition, travel, and living" },
      { name: "Sciences Po Emile Boutroux Scholarship", detail: "Full tuition waiver for undergraduates" },
      { name: "HEC Paris MBA Scholarships", detail: "Multiple merit and need based awards" }
    ]
  },
  {
    id: "netherlands", name: "Netherlands", flag: "🇳🇱", t1: "$1,200", t2: "$2,500",
    tagline: "English taught programs at globally ranked universities. Applications that stand out.",
    ecHighlight: "We develop innovation projects and academic initiatives that Dutch universities with their interactive learning culture specifically value",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Program specific letters for Dutch universities", "Clear academic fit demonstrated", "Feedback aligned to Dutch expectations"] },
      { cat: "Academic Profile Optimization", items: ["Achievements positioned for Dutch standards", "Experience highlighted", "References strategy"] },
      { cat: "Application Alignment", items: ["Letters and profile aligned across targets", "Every element reinforces fit"] }
    ],
    complete: [
      { cat: "Motivation Letters, Written For You", items: ["Separate letters per program from scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Innovation Profile Development", items: ["Our EC developers help build innovation or social enterprise projects", "Create initiatives reflecting Dutch problem solving culture", "Develop scholarship strengthening achievements"] },
      { cat: "Full Application Management", items: ["Studielink and portal applications prepared", "Credential evaluation", "Timeline management"] },
      { cat: "Scholarship Applications", items: ["Holland Scholarship, Orange Tulip, and university awards", "All materials prepared", "Financial planning"] }
    ],
    scholarships: [
      { name: "Holland Scholarship", detail: "€5,000 for non-EEA students" },
      { name: "Erasmus University Rotterdam Scholarship", detail: "Full tuition plus living" },
      { name: "Delft University Scholarships", detail: "Full tuition for MSc students" },
      { name: "University of Amsterdam Excellence", detail: "Full or partial tuition waiver" }
    ]
  },
  {
    id: "ireland", name: "Ireland", flag: "🇮🇪", t1: "$1,200", t2: "$2,500",
    tagline: "English speaking, globally ranked, generous post study work. We build your application.",
    ecHighlight: "We develop academic leadership and community engagement projects valued by Trinity, UCD, and other top Irish institutions",
    guided: [
      { cat: "Personal Statement, Collaborative Deep Dive", items: ["Compelling statement for Irish admissions", "Academic motivation demonstrated", "Feedback until polished"] },
      { cat: "Academic Profile Optimization", items: ["Achievements positioned for Irish requirements", "Leadership highlighted", "References strategy"] },
      { cat: "Application Alignment", items: ["Statement and profile presented cohesively", "Every section reinforces fit"] }
    ],
    complete: [
      { cat: "Personal Statement, Written For You", items: ["Written from scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Extracurricular Development", items: ["Our EC developers build academic and community projects", "Create leadership initiatives Irish universities value", "Develop a profile beyond just grades"] },
      { cat: "University Selection and Scholarship Strategy", items: ["Strategic list covering Trinity, UCD, NUI Galway and more", "Scholarship identification per target", "Application strategy per institution"] },
      { cat: "Full Application Management", items: ["All applications prepared", "Document preparation", "Timeline management"] }
    ],
    scholarships: [
      { name: "Government of Ireland Scholarships", detail: "€10,000 per year plus full tuition waiver" },
      { name: "Trinity College Dublin Global Excellence", detail: "Significant fee reductions" },
      { name: "UCD Global Scholarships", detail: "Partial to full tuition" },
      { name: "NUI Galway International Scholarships", detail: "Merit based awards" }
    ]
  },
  {
    id: "turkey", name: "Turkey", flag: "🇹🇷", t1: "$800", t2: "$1,500",
    tagline: "Turkiye Burslari and top universities at accessible prices. We handle everything.",
    ecHighlight: "We build volunteer leadership roles and social impact projects that Turkiye Burslari reviewers specifically evaluate during selection",
    guided: [
      { cat: "Statement of Purpose, Collaborative Deep Dive", items: ["Statement aligned to Turkiye Burslari requirements", "Clear motivation demonstrated", "Feedback until standards met"] },
      { cat: "Study Plan and Essay Support", items: ["Detailed study plan", "Supporting essays", "Extracurricular profile positioned"] },
      { cat: "Application Alignment", items: ["Statement, plan, and essays as one package", "Every element reinforces readiness"] }
    ],
    complete: [
      { cat: "All Essays and Plans, Written For You", items: ["Everything from scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Volunteer and Leadership Development", items: ["Our EC developers design volunteer, social impact, and leadership projects", "Build community engagement Turkiye Burslari reviewers prioritize", "Create verifiable achievements before you apply"] },
      { cat: "Full Turkiye Burslari Application", items: ["Complete application prepared", "Documents organized", "Interview preparation"] },
      { cat: "University Selection", items: ["Strategic list by scholarship success rates", "Application strategy", "Program matching"] }
    ],
    scholarships: [
      { name: "Turkiye Burslari", detail: "Fully funded. Tuition, accommodation, stipend, insurance, and language course" },
      { name: "Sabanci University Scholarships", detail: "Full and partial tuition waivers" },
      { name: "Koc University Scholarships", detail: "Merit based covering tuition and living" },
      { name: "Bilkent University Full Tuition", detail: "100% waiver for high achievers" }
    ]
  },
  {
    id: "italy", name: "Italy", flag: "🇮🇹", t1: "$1,000", t2: "$2,000",
    tagline: "Affordable tuition, rich culture, growing international programs. We get you in.",
    ecHighlight: "We develop design portfolios, technical projects, and academic initiatives for Politecnico di Milano, Bocconi, and beyond",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Letter aligned to Italian expectations", "Academic interest demonstrated", "Feedback until polished"] },
      { cat: "Application Support", items: ["Pre enrollment guidance", "Credential evaluation", "Timeline management"] },
      { cat: "Application Alignment", items: ["Letter and profile presented cohesively", "Every element reinforces readiness"] }
    ],
    complete: [
      { cat: "Motivation Letter, Written For You", items: ["From scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Portfolio and Project Development", items: ["Our EC developers help build design portfolios, technical projects, or research", "Create achievements top Italian programs value", "Develop a merit scholarship competitive profile"] },
      { cat: "University Selection", items: ["Politecnico, Bocconi, Bologna and more", "Program matching", "Scholarship identification"] },
      { cat: "Scholarship Applications", items: ["Invest Your Talent in Italy, DSU, and university awards", "All materials prepared", "Financial planning"] }
    ],
    scholarships: [
      { name: "Invest Your Talent in Italy", detail: "Italian Government scholarships" },
      { name: "DSU Regional Scholarships", detail: "Tuition, accommodation, and meals" },
      { name: "Politecnico di Milano Merit", detail: "Full tuition plus €5,000 per year" },
      { name: "Bocconi Merit Awards", detail: "Up to 100% tuition waiver" }
    ]
  },
  {
    id: "nordics", name: "Sweden, Finland, Denmark", flag: "🇸🇪", t1: "$1,200", t2: "$2,500",
    tagline: "Innovation driven education with tuition free opportunities. We navigate the Nordic system.",
    ecHighlight: "We build sustainability projects, innovation initiatives, and social entrepreneurship profiles that Nordic universities prioritize",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Program specific letters for Nordic applications", "Genuine fit demonstrated", "Feedback aligned to Scandinavian standards"] },
      { cat: "Profile Optimization", items: ["Achievements positioned for Nordic expectations", "Projects and leadership highlighted", "References strategy"] },
      { cat: "Application Alignment", items: ["Letters and profile aligned across targets", "Every element reinforces fit"] }
    ],
    complete: [
      { cat: "Motivation Letters, Written For You", items: ["Separate letters per program", "Deep interviews", "Unlimited revisions"] },
      { cat: "Sustainability and Innovation Profile", items: ["Our EC developers help build sustainability, innovation, or social enterprise projects", "Create initiatives aligned with Nordic values", "Develop scholarship winning achievements"] },
      { cat: "University Selection", items: ["Strategic list across Sweden, Finland, Denmark", "Tuition free Finnish programs identified", "Scholarship identification per school"] },
      { cat: "Scholarship Applications", items: ["SI Scholarships, EDUFI, and university awards", "All materials prepared", "Financial planning for Nordic living"] }
    ],
    scholarships: [
      { name: "Swedish Institute Scholarships", detail: "Full tuition, living, and travel for Masters" },
      { name: "EDUFI Fellowships (Finland)", detail: "Monthly grant for doctoral research" },
      { name: "University of Helsinki Scholarships", detail: "Full tuition waiver for Masters" },
      { name: "Denmark Government Scholarships", detail: "Tuition waivers and monthly grants" },
      { name: "KTH Scholarships", detail: "Full tuition for engineering applicants" }
    ]
  },
  {
    id: "easteurope", name: "Hungary, Poland, Czech Republic", flag: "🇭🇺", t1: "$800", t2: "$1,500",
    tagline: "Quality European education at accessible prices. Popular for medical and engineering programs.",
    ecHighlight: "We develop clinical volunteering, medical shadowing portfolios, and academic projects specifically for medical school and engineering applications",
    guided: [
      { cat: "Motivation Letter, Collaborative Deep Dive", items: ["Compelling letter for Eastern European universities", "Academic readiness demonstrated", "Feedback until polished"] },
      { cat: "Application Support", items: ["Portal guidance and documents", "Credential evaluation", "Entrance exam guidance for medical programs"] },
      { cat: "Application Alignment", items: ["All materials presented cohesively", "Every section reinforces readiness"] }
    ],
    complete: [
      { cat: "Motivation Letter, Written For You", items: ["From scratch", "Deep interviews", "Unlimited revisions"] },
      { cat: "Medical and Technical Profile Development", items: ["Our EC developers build clinical volunteering, hospital shadowing, and lab research portfolios", "Create the medical or engineering extracurricular profile competitive programs require","Develop achievements setting you apart from other internationals"] },
      { cat: "University Selection", items: ["Strategic list across Hungary, Poland, Czech Republic", "Medical, engineering, and business focus", "Scholarship identification"] },
      { cat: "Scholarship Applications", items: ["Stipendium Hungaricum, NAWA, Czech Government scholarships", "All materials prepared", "Entrance exam strategy"] }
    ],
    scholarships: [
      { name: "Stipendium Hungaricum", detail: "Fully funded. Tuition, accommodation, stipend, and insurance" },
      { name: "NAWA Polish Scholarships", detail: "Tuition and living at Polish universities" },
      { name: "Czech Government Scholarships", detail: "Full tuition and monthly stipend" },
      { name: "University of Warsaw Scholarships", detail: "Merit based tuition waivers" },
      { name: "Semmelweis University Scholarships", detail: "Partial tuition for medical students" }
    ]
  }
];
