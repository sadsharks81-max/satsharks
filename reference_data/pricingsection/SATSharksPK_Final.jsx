import { useState } from "react";

/* ─── ICONS ─── */
const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className="flex-shrink-0 mt-0.5"
  >
    <circle cx="10" cy="10" r="10" fill="#0ea5e9" opacity="0.15" />
    <path
      d="M6 10.5l2.5 2.5 5.5-5.5"
      stroke="#0ea5e9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const StarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className="flex-shrink-0 mt-0.5"
  >
    <path
      d="M10 2l2.35 4.76 5.25.77-3.8 3.7.9 5.24L10 13.97l-4.7 2.5.9-5.24-3.8-3.7 5.25-.77L10 2z"
      fill="#f59e0b"
    />
  </svg>
);
const WAIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevDown = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: "transform 0.3s",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const WA = "923164514334";

/* ─── COUNTRY DATA ─── */
const countries = [
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    t1: "4,00,000",
    t2: "8,00,000",
    t1l: "4 Lac",
    t2l: "8 Lac",
    tagline:
      "The most competitive admissions process in the world. We make it yours.",
    ecHighlight:
      "We build research internships, hackathon portfolios, Model UN leadership, and community impact projects that Top 30 schools specifically look for",
    guided: [
      {
        cat: "Personal Statement, Collaborative Deep Dive",
        items: [
          "Work one on one with a counsellor who has placed Pakistani students in Top 30 US schools",
          "Uncover the story admissions officers haven't read a thousand times",
          "Shape raw experiences into a narrative that sticks",
          "4 rounds of detailed feedback until every sentence earns its spot",
        ],
      },
      {
        cat: "Extracurricular and Awards Rewrite",
        items: [
          "Every activity entry rewritten to lead with leadership and outcomes",
          "Character count optimized with zero filler and maximum punch",
          "Strategic ordering so your strongest cards are played first",
        ],
      },
      {
        cat: "Application Narrative Alignment",
        items: [
          "Your Personal Statement, Extracurriculars, and Awards woven into one coherent story",
          "Contradictions and dead weight eliminated across all sections",
          "Admissions committees see one clear, intentional applicant",
        ],
      },
    ],
    complete: [
      {
        cat: "Personal Statement, Crafted For You",
        items: [
          "We write your entire Personal Statement from scratch",
          "Got a draft? We will rebuild it into something admissions teams remember",
          "Deep one on one interviews to capture your real voice, not ours",
          "Unlimited revisions until you would proudly read it out loud",
        ],
      },
      {
        cat: "Full Extracurricular and Awards Build Out",
        items: [
          "Every extracurricular and award description written from the ground up",
          "Gap analysis to surface hidden strengths you did not know you had",
          "Activities positioned for maximum admissions impact, not just listed",
        ],
      },
      {
        cat: "Extracurricular Development and Profile Building",
        items: [
          "Our dedicated EC developers design and guide you through research projects, competitions, and leadership roles",
          "Build a published research paper, launch a community initiative, or lead a national competition",
          "We don't just describe your activities, we help you create them from scratch",
          "Real, verifiable achievements that make admissions officers stop and pay attention",
        ],
      },
      {
        cat: "School Selection and Scholarship Strategy",
        items: [
          "Data backed school list with reaches, targets, and safeties that actually fit",
          "Application strategy tailored to your profile and ambitions",
          "Scholarship identification and financial aid positioning across every target school",
        ],
      },
    ],
    scholarships: [
      {
        name: "USEFP Fulbright Scholarship",
        detail:
          "Fully funded Masters and PhD. Covers tuition, living stipend, airfare, and health insurance",
      },
      {
        name: "HEC US Pakistan Knowledge Corridor",
        detail:
          "Fully funded PhD at Top 300 QS ranked US universities including Harvard, MIT, and Stanford",
      },
      {
        name: "Global UGRAD Program",
        detail:
          "US Department of State funded. One full semester at a US university, fully covered",
      },
      {
        name: "Harvard University Financial Aid",
        detail:
          "Need blind admissions. Families earning under $85,000 pay nothing",
      },
      {
        name: "Yale University Financial Aid",
        detail:
          "Need blind for all international applicants. Meets 100% of demonstrated need",
      },
      {
        name: "MIT Financial Aid",
        detail:
          "Need blind admissions. Over 60% of undergraduates receive need based aid",
      },
      {
        name: "Stamps Scholarship",
        detail:
          "Available at 40+ partner universities. Covers full cost of attendance plus enrichment funds",
      },
      {
        name: "American University Emerging Global Leader",
        detail: "Full tuition, room, and board for up to four years",
      },
    ],
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    t1: "2,50,000",
    t2: "4,50,000",
    t1l: "2.5 Lac",
    t2l: "4.5 Lac",
    tagline:
      "World class education with a clear path to permanent residency. We position you to get in.",
    ecHighlight:
      "We develop community leadership initiatives, volunteer portfolios, and undergraduate research projects that Canadian schools value most",
    guided: [
      {
        cat: "Personal Profile, Collaborative Deep Dive",
        items: [
          "Craft a compelling personal profile that Canadian universities specifically look for",
          "Move beyond generic responses that admissions committees skim past",
          "Multiple rounds of feedback until your profile is polished and sharp",
        ],
      },
      {
        cat: "Supplemental Essay Guidance",
        items: [
          "Guided approach to school specific supplementals for UBC, Waterloo, McGill, and more",
          "Each response crafted to reflect what individual programs value",
          "Strategic emphasis on community involvement and leadership",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Your personal profile, supplementals, and extracurriculars presented as one cohesive story",
          "Every section reinforces a single compelling applicant narrative",
        ],
      },
    ],
    complete: [
      {
        cat: "Personal Profile and Essays, Written For You",
        items: [
          "We craft your complete personal profile and all supplemental essays from scratch",
          "Deep interviews to understand your journey and capture your authentic voice",
          "Unlimited revisions across all written components",
        ],
      },
      {
        cat: "Extracurricular Development",
        items: [
          "Our EC developers help you build meaningful community projects and volunteer leadership roles",
          "Design research collaborations and academic initiatives Canadian schools value",
          "Create the achievements first, then describe them powerfully",
        ],
      },
      {
        cat: "University Selection and Scholarship Strategy",
        items: [
          "Strategic school list covering programs that match your academic and career goals",
          "Identification of entrance scholarships and financial awards at each target school",
          "Application timing and strategy optimized per institution",
        ],
      },
      {
        cat: "Research and Portfolio Preparation",
        items: [
          "Guidance on highlighting research and project work for STEM applicants",
          "Portfolio preparation support for programs requiring creative submissions",
          "Letters of recommendation strategy and guidance",
        ],
      },
    ],
    scholarships: [
      {
        name: "Lester B. Pearson Scholarship (University of Toronto)",
        detail:
          "Covers tuition, books, incidental fees, and full residence support for four years",
      },
      {
        name: "Schulich Leader Scholarships",
        detail:
          "Up to $120,000 for STEM students at 20 participating Canadian universities",
      },
      {
        name: "University of British Columbia International Scholars",
        detail: "Multiple awards ranging from $10,000 to full tuition",
      },
      {
        name: "McGill University Entrance Scholarships",
        detail:
          "Automatic consideration for merit awards up to $12,000 per year",
      },
      {
        name: "Vanier Canada Graduate Scholarships",
        detail: "$50,000 per year for up to three years for doctoral students",
      },
      {
        name: "University of Waterloo Merit Scholarships",
        detail:
          "Awards from $5,000 to $25,000 for high achieving international applicants",
      },
    ],
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    t1: "2,00,000",
    t2: "4,00,000",
    t1l: "2 Lac",
    t2l: "4 Lac",
    tagline:
      "One personal statement, five choices, zero room for error. We make every word count.",
    ecHighlight:
      "We build academic olympiad participation, extended research projects, and subject specific supercurriculars that Oxford and Cambridge admissions tutors look for",
    guided: [
      {
        cat: "UCAS Personal Statement, Collaborative Deep Dive",
        items: [
          "Build a subject focused statement that demonstrates genuine academic curiosity",
          "Structure your statement to stand out across all five UCAS choices",
          "Multiple rounds of feedback until every paragraph serves a purpose",
        ],
      },
      {
        cat: "Supercurricular Development",
        items: [
          "Relevant reading, research, and projects woven into your academic profile",
          "Supercurricular activities highlighted to show depth of subject interest",
          "Wider participation presented to demonstrate a well rounded applicant",
        ],
      },
      {
        cat: "Course Selection Strategy",
        items: [
          "Strategic selection of five UCAS choices that balance ambition with realistic targets",
          "Personal Statement aligned to work across multiple programs",
        ],
      },
    ],
    complete: [
      {
        cat: "UCAS Personal Statement, Written For You",
        items: [
          "We write your complete UCAS Personal Statement from scratch",
          "Deep interviews to surface your academic passion and intellectual journey",
          "Unlimited revisions until you and your school are fully confident",
        ],
      },
      {
        cat: "Extracurricular and Supercurricular Development",
        items: [
          "Our EC developers design extended research projects and academic initiatives in your subject area",
          "Build participation in subject olympiads, essay competitions, and academic conferences",
          "Create supercurricular depth that separates you from thousands of similar applicants",
        ],
      },
      {
        cat: "Oxbridge and Top University Strategy",
        items: [
          "Application strategy for Oxford, Cambridge, Imperial, UCL, and LSE",
          "Guidance on admissions tests, written assessments, and interview preparation",
          "Subject specific advice on how to demonstrate academic depth",
        ],
      },
      {
        cat: "Scholarship and Financial Support Strategy",
        items: [
          "Identification of university specific scholarships and bursaries",
          "Chevening, Commonwealth, and named scholarship application guidance",
          "Funding strategy to reduce your overall cost of attendance",
        ],
      },
    ],
    scholarships: [
      {
        name: "Chevening Scholarships",
        detail:
          "UK Government funded. Full tuition, living expenses, and travel for one year Masters",
      },
      {
        name: "Commonwealth Scholarships",
        detail:
          "Fully funded through HEC Pakistan for Masters and PhD at UK universities",
      },
      {
        name: "Gates Cambridge Scholarship",
        detail:
          "Full cost of study at Cambridge including tuition, maintenance, and travel",
      },
      {
        name: "Rhodes Scholarship (Oxford)",
        detail:
          "Fully funded postgraduate study at Oxford for up to three years",
      },
      {
        name: "Clarendon Fund (Oxford)",
        detail: "Covers tuition and living expenses for graduate students",
      },
      {
        name: "Think Big Scholarships (Bristol)",
        detail: "Awards up to full tuition for international students",
      },
    ],
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    t1: "2,50,000",
    t2: "5,00,000",
    t1l: "2.5 Lac",
    t2l: "5 Lac",
    tagline:
      "Tuition free education at world class universities. We navigate the complex process for you.",
    ecHighlight:
      "We develop technical research projects, lab internships, and STEM certifications that strengthen your profile for German engineering and science programs",
    guided: [
      {
        cat: "Motivation Letter, Collaborative Deep Dive",
        items: [
          "Craft a compelling motivation letter that German universities specifically require",
          "Demonstrate academic readiness and genuine interest in your chosen program",
          "Multiple rounds of feedback aligned to German academic expectations",
        ],
      },
      {
        cat: "APS and Uni Assist Guidance",
        items: [
          "Step by step support through the APS certification process",
          "Guidance on documents for the uni-assist portal",
          "Academic credential evaluation and preparation",
        ],
      },
      {
        cat: "Application Portfolio Alignment",
        items: [
          "Your motivation letter, academic profile, and extracurriculars presented cohesively",
          "Every element reinforces your readiness for the German academic system",
        ],
      },
    ],
    complete: [
      {
        cat: "Motivation Letter, Written For You",
        items: [
          "We write your complete motivation letter from scratch for each target university",
          "Deep interviews to capture your academic journey and career vision",
          "Unlimited revisions across all written materials",
        ],
      },
      {
        cat: "Extracurricular and Technical Profile Development",
        items: [
          "Our EC developers guide you through technical projects, coding portfolios, and research initiatives",
          "Build verifiable STEM achievements that German universities value",
          "Create industry relevant certifications and project documentation",
        ],
      },
      {
        cat: "Full APS and Application Management",
        items: [
          "Complete APS certification support from start to finish",
          "All uni-assist applications prepared and reviewed",
          "Document preparation, translation coordination, and deadline management",
        ],
      },
      {
        cat: "Scholarship Applications",
        items: [
          "DAAD, Erasmus, and university specific scholarship identification",
          "All scholarship essays and documents prepared",
          "Financial planning for living in Germany",
        ],
      },
    ],
    scholarships: [
      {
        name: "DAAD Scholarships",
        detail:
          "Germany's largest scholarship organization with programs at all academic levels",
      },
      {
        name: "Erasmus Mundus Joint Masters",
        detail:
          "EU funded covering tuition, travel, and living costs across European universities",
      },
      {
        name: "Deutschlandstipendium",
        detail: "€300 per month merit scholarship at most German universities",
      },
      {
        name: "Heinrich Boll Foundation",
        detail:
          "Full funding for international students aligned with ecology and democracy values",
      },
      {
        name: "Friedrich Ebert Foundation",
        detail:
          "Monthly stipend plus tuition for committed international students",
      },
    ],
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    t1: "2,50,000",
    t2: "5,00,000",
    t1l: "2.5 Lac",
    t2l: "5 Lac",
    tagline:
      "MEXT, world class universities, and a culture of academic excellence. We open the door.",
    ecHighlight:
      "We help you develop published research papers, academic conference presentations, and faculty collaboration projects that MEXT reviewers and Japanese professors specifically look for",
    guided: [
      {
        cat: "Research Proposal, Collaborative Deep Dive",
        items: [
          "Craft a compelling research proposal aligned with Japanese faculty interests",
          "Demonstrate clear research direction and academic potential",
          "Multiple rounds of feedback from counsellors experienced with Japanese admissions",
        ],
      },
      {
        cat: "Faculty Contact Strategy",
        items: [
          "Guidance on identifying and approaching potential research supervisors",
          "Professional communication strategy for initial faculty outreach",
          "Building genuine academic connection before formal application",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Research proposal, statement of purpose, and academic profile presented cohesively",
          "Every element demonstrates your fit for the Japanese academic environment",
        ],
      },
    ],
    complete: [
      {
        cat: "Research Proposal, Written For You",
        items: [
          "We write your complete research proposal and statement of purpose from scratch",
          "Deep interviews to understand your research interests",
          "Unlimited revisions until your proposal is faculty ready",
        ],
      },
      {
        cat: "Research Profile Development",
        items: [
          "Our team guides you through publishing a research paper or presenting at an academic conference",
          "Build a credible research portfolio before you even apply",
          "Create the academic track record that makes professors want to supervise you",
        ],
      },
      {
        cat: "Full MEXT Application Support",
        items: [
          "Complete MEXT scholarship application prepared from start to finish",
          "Study plan, research plan, and all supporting documents polished",
          "Embassy and university recommendation track strategy",
        ],
      },
      {
        cat: "Scholarship and Funding Strategy",
        items: [
          "MEXT, JASSO, and university specific scholarship identification",
          "All scholarship essays and documents prepared",
          "Financial planning for living in Japan",
        ],
      },
    ],
    scholarships: [
      {
        name: "MEXT Scholarship (Japanese Government)",
        detail:
          "Fully funded. Covers tuition, monthly stipend of 143,000+ yen, and round trip airfare",
      },
      {
        name: "JASSO Student Exchange Support",
        detail: "Monthly stipend of 80,000 yen for international students",
      },
      {
        name: "ADB Japan Scholarship Program",
        detail:
          "Full tuition and living for students from ADB member countries including Pakistan",
      },
      {
        name: "University of Tokyo PEAK Scholarships",
        detail: "Full tuition waiver and monthly stipend for undergraduates",
      },
      {
        name: "Kyoto University International Scholarships",
        detail: "Multiple programs for international graduate students",
      },
    ],
  },
  {
    id: "korea",
    name: "South Korea",
    flag: "🇰🇷",
    t1: "2,50,000",
    t2: "5,00,000",
    t1l: "2.5 Lac",
    t2l: "5 Lac",
    tagline:
      "KGSP, world ranked universities, and a thriving student culture. We get you there.",
    ecHighlight:
      "We build innovation projects, entrepreneurship portfolios, and cultural exchange initiatives that Korean universities and KGSP reviewers value",
    guided: [
      {
        cat: "Statement of Purpose, Collaborative Deep Dive",
        items: [
          "Craft a compelling statement that Korean universities specifically look for",
          "Demonstrate academic motivation and genuine interest in studying in Korea",
          "Multiple rounds of feedback aligned to Korean admissions standards",
        ],
      },
      {
        cat: "Study Plan Development",
        items: [
          "Detailed study plan showing clear academic and career direction",
          "Research interest alignment with available programs and faculty",
          "Language learning plan and cultural integration strategy",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Statement, study plan, and academic profile as one cohesive package",
          "Every element reinforces your commitment to academic excellence",
        ],
      },
    ],
    complete: [
      {
        cat: "Statement and Study Plan, Written For You",
        items: [
          "We write your complete statement of purpose and study plan from scratch",
          "Deep interviews to capture your motivations and aspirations",
          "Unlimited revisions until every document is submission ready",
        ],
      },
      {
        cat: "Extracurricular and Innovation Profile",
        items: [
          "Our EC developers help you build innovation, tech, or social impact projects",
          "Create entrepreneurship or cultural exchange initiatives that stand out",
          "Develop verifiable achievements Korean universities specifically value",
        ],
      },
      {
        cat: "Full KGSP Application Support",
        items: [
          "Complete Korean Government Scholarship application prepared",
          "All essays, study plans, and documents polished",
          "Embassy track and university track application strategy",
        ],
      },
      {
        cat: "Scholarship Strategy",
        items: [
          "KGSP, university merit, and private foundation scholarships",
          "All application materials prepared",
          "Financial planning for South Korea",
        ],
      },
    ],
    scholarships: [
      {
        name: "Korean Government Scholarship Program (KGSP)",
        detail:
          "Fully funded. Covers tuition, stipend, airfare, settlement, and Korean language training",
      },
      {
        name: "Korea University International Scholarship",
        detail:
          "Up to full tuition waiver for outstanding international students",
      },
      {
        name: "Yonsei University Global Leader Fellowship",
        detail: "Full tuition coverage for top international applicants",
      },
      {
        name: "KAIST International Student Scholarship",
        detail: "Full tuition plus monthly living allowance",
      },
      {
        name: "Seoul National University Development Scholarship",
        detail: "Partial to full tuition for international graduates",
      },
    ],
  },
  {
    id: "china",
    name: "China",
    flag: "🇨🇳",
    t1: "1,50,000",
    t2: "3,00,000",
    t1l: "1.5 Lac",
    t2l: "3 Lac",
    tagline:
      "Affordable world class education with generous government scholarships. Your gateway to Asia.",
    ecHighlight:
      "We help you develop academic competition results and community development projects that strengthen your CSC scholarship application",
    guided: [
      {
        cat: "Study Plan, Collaborative Deep Dive",
        items: [
          "Craft a clear and compelling study plan that Chinese universities require",
          "Demonstrate your academic goals and reasons for choosing China",
          "Feedback rounds until your study plan meets CSC standards",
        ],
      },
      {
        cat: "Personal Statement Support",
        items: [
          "Personal statement tailored to Chinese university expectations",
          "Academic achievements and extracurriculars presented effectively",
          "Motivation clearly connected to your chosen program",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Study plan, personal statement, and documents aligned as a cohesive package",
          "Every section reinforces your seriousness and academic readiness",
        ],
      },
    ],
    complete: [
      {
        cat: "Study Plan and Personal Statement, Written For You",
        items: [
          "We write your complete study plan and personal statement from scratch",
          "Deep interviews to understand your goals and capture your voice",
          "Unlimited revisions across all written components",
        ],
      },
      {
        cat: "Profile Strengthening",
        items: [
          "Our team helps you build academic competition results and community projects",
          "Create achievements that make your CSC application stand out from thousands",
          "Develop a profile that shows leadership and academic commitment",
        ],
      },
      {
        cat: "Full CSC Application Support",
        items: [
          "Complete Chinese Scholarship Council application prepared end to end",
          "University acceptance letter strategy and coordination",
          "All essays and documents written and polished",
        ],
      },
      {
        cat: "Scholarship Strategy",
        items: [
          "CSC, Confucius Institute, provincial, and university scholarships",
          "All application materials prepared",
          "Financial planning for China",
        ],
      },
    ],
    scholarships: [
      {
        name: "Chinese Government Scholarship (CSC)",
        detail:
          "Fully funded. Covers tuition, accommodation, stipend, and medical insurance",
      },
      {
        name: "Confucius Institute Scholarship",
        detail: "Full or partial funding for Chinese language programs",
      },
      {
        name: "Chinese Provincial Government Scholarships",
        detail: "Regional scholarships with significant funding",
      },
      {
        name: "Tsinghua University Scholarship",
        detail: "Full tuition waiver and living stipend",
      },
      {
        name: "Peking University International Scholarships",
        detail: "Multiple programs covering tuition and living",
      },
    ],
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    t1: "2,00,000",
    t2: "4,00,000",
    t1l: "2 Lac",
    t2l: "4 Lac",
    tagline:
      "Top ranked universities with strong post study work rights. We position your application for success.",
    ecHighlight:
      "We develop research initiatives and leadership portfolios that strengthen scholarship applications for Australian merit awards",
    guided: [
      {
        cat: "Personal Statement, Collaborative Deep Dive",
        items: [
          "Craft a compelling statement of purpose for Australian admissions",
          "Demonstrate your academic goals and reasons for choosing Australia",
          "Multiple rounds of feedback until polished",
        ],
      },
      {
        cat: "Academic Profile Optimization",
        items: [
          "Achievements highlighted for Australian university standards",
          "Relevant experience and extracurriculars positioned effectively",
          "Professional references strategy and guidance",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "All materials presented as one cohesive professional package",
          "Every section reinforces your fit for Australian standards",
        ],
      },
    ],
    complete: [
      {
        cat: "Personal Statement, Written For You",
        items: [
          "We write your complete statement of purpose from scratch",
          "Deep interviews to understand your motivations",
          "Unlimited revisions until fully confident",
        ],
      },
      {
        cat: "Research and Leadership Development",
        items: [
          "Our EC developers help you build research projects and leadership roles",
          "Create scholarship worthy achievements that set you apart",
          "Develop a profile that competes for Australia's top merit awards",
        ],
      },
      {
        cat: "University Selection and Scholarship Strategy",
        items: [
          "Strategic list based on rankings, location, and scholarship availability",
          "Identification of university merit awards and research scholarships",
          "Strategy optimized per institution and intake cycle",
        ],
      },
      {
        cat: "Scholarship Applications",
        items: [
          "Australia Awards, Endeavour, and university specific scholarships",
          "All application essays and documents prepared",
          "Financial planning for Australia",
        ],
      },
    ],
    scholarships: [
      {
        name: "Australia Awards Scholarships",
        detail:
          "Fully funded by the Australian Government covering tuition, travel, and living",
      },
      {
        name: "University of Melbourne International Scholarships",
        detail: "Up to full fee remission for high achieving students",
      },
      {
        name: "University of Sydney International Scholarships",
        detail: "Merit based awards covering up to full tuition",
      },
      {
        name: "Monash University Merit Scholarships",
        detail: "Awards up to $50,000 across the duration of study",
      },
    ],
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    t1: "2,00,000",
    t2: "4,00,000",
    t1l: "2 Lac",
    t2l: "4 Lac",
    tagline:
      "World renowned universities with surprisingly affordable tuition. We handle Campus France.",
    ecHighlight:
      "We build academic research projects and cultural exchange initiatives that strengthen Eiffel and Grandes Ecoles applications",
    guided: [
      {
        cat: "Motivation Letter, Collaborative Deep Dive",
        items: [
          "Craft a compelling motivation letter in the style French universities expect",
          "Demonstrate genuine academic interest and career direction",
          "Feedback rounds until your letter meets French standards",
        ],
      },
      {
        cat: "Campus France Guidance",
        items: [
          "Step by step support through the Campus France portal",
          "Credential evaluation and document preparation",
          "Interview preparation for Campus France",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Motivation letter and academic profile as one cohesive package",
          "Every element demonstrates readiness for the French system",
        ],
      },
    ],
    complete: [
      {
        cat: "Motivation Letter, Written For You",
        items: [
          "We write your letter from scratch for each target university",
          "Deep interviews to capture your journey",
          "Unlimited revisions",
        ],
      },
      {
        cat: "Profile and Extracurricular Development",
        items: [
          "Our team helps you develop research and cultural exchange initiatives",
          "Build achievements that French admissions committees value",
          "Create a profile worthy of Eiffel and Grandes Ecoles selection",
        ],
      },
      {
        cat: "Full Campus France Application",
        items: [
          "Complete application prepared start to finish",
          "All university applications prepared and reviewed",
          "Timeline management",
        ],
      },
      {
        cat: "Scholarship Applications",
        items: [
          "Eiffel, Erasmus, and university awards",
          "All materials prepared",
          "Financial planning for France",
        ],
      },
    ],
    scholarships: [
      {
        name: "Eiffel Excellence Scholarship",
        detail:
          "French Government funded. Monthly allowance, travel, and housing",
      },
      {
        name: "Erasmus Mundus Joint Masters",
        detail: "EU funded covering tuition, travel, and living",
      },
      {
        name: "Sciences Po Emile Boutroux Scholarship",
        detail: "Full tuition waiver for outstanding undergraduates",
      },
      {
        name: "Campus France Excellence Scholarships",
        detail:
          "Various awards through the French Embassy for Pakistani students",
      },
    ],
  },
  {
    id: "netherlands",
    name: "Netherlands",
    flag: "🇳🇱",
    t1: "2,00,000",
    t2: "4,00,000",
    t1l: "2 Lac",
    t2l: "4 Lac",
    tagline:
      "English taught programs at globally ranked universities. Applications that stand out.",
    ecHighlight:
      "We develop innovation projects and academic initiatives that Dutch universities with their interactive learning culture specifically value",
    guided: [
      {
        cat: "Motivation Letter, Collaborative Deep Dive",
        items: [
          "Program specific motivation letters for Dutch universities",
          "Demonstrate clear academic fit and career direction",
          "Multiple rounds of feedback aligned to Dutch expectations",
        ],
      },
      {
        cat: "Academic Profile Optimization",
        items: [
          "Achievements positioned for Dutch standards",
          "Relevant experience highlighted",
          "Professional references strategy",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Letters and profile aligned across all targets",
          "Every element reinforces your fit",
        ],
      },
    ],
    complete: [
      {
        cat: "Motivation Letters, Written For You",
        items: [
          "Separate letters for each program from scratch",
          "Deep interviews to understand your goals",
          "Unlimited revisions",
        ],
      },
      {
        cat: "Innovation and Project Development",
        items: [
          "Our EC developers help you build innovation or social enterprise projects",
          "Create initiatives that reflect the Dutch emphasis on problem solving and collaboration",
          "Develop achievements that strengthen scholarship applications",
        ],
      },
      {
        cat: "Full Application Management",
        items: [
          "All Studielink and portal applications prepared",
          "Document preparation and credential evaluation",
          "Timeline management",
        ],
      },
      {
        cat: "Scholarship Applications",
        items: [
          "Holland Scholarship, Orange Tulip, and university awards",
          "All materials prepared",
          "Financial planning for the Netherlands",
        ],
      },
    ],
    scholarships: [
      {
        name: "Holland Scholarship",
        detail: "€5,000 for students from outside the EEA",
      },
      {
        name: "Orange Tulip Scholarship",
        detail:
          "Scholarships specifically for Pakistani students at Dutch universities",
      },
      {
        name: "Erasmus University Rotterdam Scholarship",
        detail: "Full tuition plus living expenses",
      },
      {
        name: "Delft University of Technology Scholarships",
        detail: "Full tuition for excellent MSc students",
      },
    ],
  },
  {
    id: "ireland",
    name: "Ireland",
    flag: "🇮🇪",
    t1: "2,00,000",
    t2: "4,00,000",
    t1l: "2 Lac",
    t2l: "4 Lac",
    tagline:
      "English speaking, globally ranked, generous post study work. We build your application.",
    ecHighlight:
      "We develop academic leadership and community engagement projects valued by Trinity, UCD, and other top Irish institutions",
    guided: [
      {
        cat: "Personal Statement, Collaborative Deep Dive",
        items: [
          "Compelling personal statement for Irish admissions",
          "Demonstrate academic motivation and genuine interest",
          "Feedback until polished",
        ],
      },
      {
        cat: "Academic Profile Optimization",
        items: [
          "Achievements positioned for Irish requirements",
          "Extracurriculars and leadership highlighted",
          "References strategy",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Statement and profile presented cohesively",
          "Every section reinforces your fit",
        ],
      },
    ],
    complete: [
      {
        cat: "Personal Statement, Written For You",
        items: [
          "Written from scratch",
          "Deep interviews",
          "Unlimited revisions",
        ],
      },
      {
        cat: "Extracurricular Development",
        items: [
          "Our EC developers build academic and community projects for your profile",
          "Create leadership roles and initiatives Irish universities value",
          "Develop a well rounded applicant profile beyond just grades",
        ],
      },
      {
        cat: "University Selection and Scholarship Strategy",
        items: [
          "Strategic list covering Trinity, UCD, NUI Galway, and more",
          "Scholarship identification at each target",
          "Application strategy per institution",
        ],
      },
      {
        cat: "Full Application Management",
        items: [
          "All applications prepared and reviewed",
          "Document preparation",
          "Timeline management",
        ],
      },
    ],
    scholarships: [
      {
        name: "Government of Ireland International Scholarships",
        detail: "€10,000 per year plus full tuition waiver",
      },
      {
        name: "Trinity College Dublin Global Excellence",
        detail: "Significant fee reductions for outstanding students",
      },
      {
        name: "UCD Global Scholarships",
        detail: "Partial to full tuition for high achievers",
      },
      {
        name: "NUI Galway International Scholarships",
        detail: "Merit based awards",
      },
    ],
  },
  {
    id: "turkey",
    name: "Turkey",
    flag: "🇹🇷",
    t1: "1,50,000",
    t2: "3,00,000",
    t1l: "1.5 Lac",
    t2l: "3 Lac",
    tagline:
      "Turkiye Burslari and top universities at your doorstep. We handle everything.",
    ecHighlight:
      "We build volunteer leadership roles and social impact projects that Turkiye Burslari reviewers specifically evaluate during selection",
    guided: [
      {
        cat: "Statement of Purpose, Collaborative Deep Dive",
        items: [
          "Statement aligned to Turkiye Burslari requirements",
          "Demonstrate clear academic and career motivation",
          "Feedback until scholarship standards met",
        ],
      },
      {
        cat: "Study Plan and Essay Support",
        items: [
          "Detailed study plan showing direction",
          "Supporting essays crafted to strengthen overall application",
          "Extracurricular profile positioned for Turkish standards",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Statement, study plan, and essays as one cohesive package",
          "Every element reinforces readiness",
        ],
      },
    ],
    complete: [
      {
        cat: "All Essays and Plans, Written For You",
        items: [
          "Everything written from scratch",
          "Deep interviews to understand goals",
          "Unlimited revisions",
        ],
      },
      {
        cat: "Extracurricular and Volunteer Development",
        items: [
          "Our EC developers design volunteer, social impact, and leadership projects",
          "Build the community engagement profile that Turkiye Burslari reviewers prioritize",
          "Create verifiable achievements before you even apply",
        ],
      },
      {
        cat: "Full Turkiye Burslari Application",
        items: [
          "Complete scholarship application prepared",
          "All documents organized and reviewed",
          "Interview preparation and strategy",
        ],
      },
      {
        cat: "University Selection",
        items: [
          "Strategic list based on scholarship success rates",
          "Application strategy across universities",
          "Program matching",
        ],
      },
    ],
    scholarships: [
      {
        name: "Turkiye Burslari",
        detail:
          "Fully funded. Tuition, accommodation, stipend, insurance, and Turkish language course",
      },
      {
        name: "Sabanci University International Scholarships",
        detail: "Full and partial tuition waivers",
      },
      {
        name: "Koc University Scholarships",
        detail: "Merit based covering tuition and living",
      },
      {
        name: "Bilkent University Full Tuition",
        detail: "100% tuition waiver for high achievers",
      },
    ],
  },
  {
    id: "italy",
    name: "Italy",
    flag: "🇮🇹",
    t1: "1,50,000",
    t2: "3,00,000",
    t1l: "1.5 Lac",
    t2l: "3 Lac",
    tagline:
      "Affordable tuition, rich culture, growing international programs. We get you in.",
    ecHighlight:
      "We develop design portfolios, technical projects, and academic initiatives for programs at Politecnico di Milano, Bocconi, and beyond",
    guided: [
      {
        cat: "Motivation Letter, Collaborative Deep Dive",
        items: [
          "Letter aligned to Italian expectations",
          "Demonstrate academic interest and career goals",
          "Feedback until polished",
        ],
      },
      {
        cat: "Application Support",
        items: [
          "Pre enrollment guidance and document preparation",
          "Credential evaluation",
          "Timeline management",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Letter and profile presented cohesively",
          "Every element reinforces readiness",
        ],
      },
    ],
    complete: [
      {
        cat: "Motivation Letter, Written For You",
        items: [
          "Written from scratch",
          "Deep interviews",
          "Unlimited revisions",
        ],
      },
      {
        cat: "Portfolio and Project Development",
        items: [
          "Our EC developers help build design portfolios, technical projects, or research papers",
          "Create achievements that top Italian programs specifically value",
          "Develop a profile that competes for merit scholarships",
        ],
      },
      {
        cat: "University Selection",
        items: [
          "Strategic list covering Politecnico, Bocconi, Bologna and more",
          "Program matching",
          "Scholarship identification",
        ],
      },
      {
        cat: "Full Application and Scholarship Support",
        items: [
          "All applications prepared",
          "Invest Your Talent in Italy, DSU, and university award applications",
          "Financial planning",
        ],
      },
    ],
    scholarships: [
      {
        name: "Invest Your Talent in Italy",
        detail:
          "Italian Government scholarships for students from selected countries",
      },
      {
        name: "DSU Regional Scholarships",
        detail: "Need based covering tuition, accommodation, and meals",
      },
      {
        name: "Politecnico di Milano Merit Scholarships",
        detail: "Full tuition waiver plus €5,000 per year",
      },
      {
        name: "Bocconi University Merit Awards",
        detail: "Tuition waivers up to 100%",
      },
    ],
  },
  {
    id: "nordics",
    name: "Sweden, Finland, Denmark",
    flag: "🇸🇪",
    t1: "2,00,000",
    t2: "4,00,000",
    t1l: "2 Lac",
    t2l: "4 Lac",
    tagline:
      "Innovation driven education with tuition free opportunities. We navigate the Nordic system.",
    ecHighlight:
      "We build sustainability projects, innovation initiatives, and social entrepreneurship profiles that Nordic universities with their progressive values prioritize",
    guided: [
      {
        cat: "Motivation Letter, Collaborative Deep Dive",
        items: [
          "Program specific letters for Nordic applications",
          "Demonstrate genuine fit and career direction",
          "Feedback aligned to Scandinavian standards",
        ],
      },
      {
        cat: "Academic Profile Optimization",
        items: [
          "Achievements positioned for Nordic expectations",
          "Projects and leadership highlighted",
          "References strategy",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "Letters and profile aligned across targets",
          "Every element reinforces fit",
        ],
      },
    ],
    complete: [
      {
        cat: "Motivation Letters, Written For You",
        items: [
          "Separate letters for each program",
          "Deep interviews",
          "Unlimited revisions",
        ],
      },
      {
        cat: "Sustainability and Innovation Profile",
        items: [
          "Our EC developers help build sustainability, innovation, or social enterprise projects",
          "Create initiatives aligned with Nordic values of equality, sustainability, and innovation",
          "Develop achievements that make scholarship committees take notice",
        ],
      },
      {
        cat: "University Selection",
        items: [
          "Strategic list across Sweden, Finland, and Denmark",
          "Tuition free programs at Finnish universities identified",
          "Scholarship identification per school",
        ],
      },
      {
        cat: "Scholarship Applications",
        items: [
          "SI Scholarships, EDUFI, and university awards",
          "All materials prepared",
          "Financial planning for Nordic living",
        ],
      },
    ],
    scholarships: [
      {
        name: "Swedish Institute Scholarships",
        detail:
          "Full tuition, living, and travel for Masters students from developing countries",
      },
      {
        name: "Finnish Government EDUFI Fellowships",
        detail: "Monthly grant for doctoral and postdoctoral research",
      },
      {
        name: "University of Helsinki Scholarships",
        detail: "Full tuition waiver for outstanding Masters students",
      },
      {
        name: "Denmark Government Scholarships",
        detail: "Tuition waivers and monthly grants",
      },
      {
        name: "KTH Scholarships",
        detail: "Full tuition waiver for top engineering applicants",
      },
    ],
  },
  {
    id: "easteurope",
    name: "Hungary, Poland, Czech Republic",
    flag: "🇭🇺",
    t1: "1,50,000",
    t2: "3,00,000",
    t1l: "1.5 Lac",
    t2l: "3 Lac",
    tagline:
      "Quality European education at accessible prices. Popular for medical and engineering programs.",
    ecHighlight:
      "We develop clinical volunteering, medical shadowing portfolios, and academic projects specifically for medical school and engineering program applications",
    guided: [
      {
        cat: "Motivation Letter, Collaborative Deep Dive",
        items: [
          "Compelling letter for Eastern European universities",
          "Demonstrate academic readiness and career goals",
          "Feedback until polished",
        ],
      },
      {
        cat: "Application Support",
        items: [
          "University portal guidance and document preparation",
          "Credential evaluation",
          "Entrance exam guidance for medical programs",
        ],
      },
      {
        cat: "Application Alignment",
        items: [
          "All materials presented cohesively",
          "Every section reinforces readiness",
        ],
      },
    ],
    complete: [
      {
        cat: "Motivation Letter, Written For You",
        items: [
          "Written from scratch",
          "Deep interviews",
          "Unlimited revisions",
        ],
      },
      {
        cat: "Medical and Technical Profile Development",
        items: [
          "Our EC developers help build clinical volunteering, hospital shadowing, and lab research portfolios",
          "Create the medical or engineering extracurricular profile that competitive programs require",
          "Develop achievements that set you apart from other international applicants",
        ],
      },
      {
        cat: "University Selection",
        items: [
          "Strategic list across Hungary, Poland, and Czech Republic",
          "Focus on medical, engineering, and business programs",
          "Scholarship identification",
        ],
      },
      {
        cat: "Full Application and Scholarship Support",
        items: [
          "All applications prepared",
          "Stipendium Hungaricum, NAWA, and Czech Government applications",
          "Entrance exam strategy",
        ],
      },
    ],
    scholarships: [
      {
        name: "Stipendium Hungaricum",
        detail:
          "Fully funded. Tuition, accommodation, stipend, and medical insurance",
      },
      {
        name: "NAWA Polish Government Scholarships",
        detail: "Tuition and living at Polish universities",
      },
      {
        name: "Czech Government Scholarships",
        detail: "Full tuition waiver and monthly stipend",
      },
      {
        name: "University of Warsaw International Scholarships",
        detail: "Merit based tuition waivers",
      },
      {
        name: "Semmelweis University Scholarships",
        detail: "Partial tuition for international medical students",
      },
    ],
  },
];

/* ─── ACCORDION ─── */
function ScholarshipAccordion({ items, ecNote }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#ecfdf5" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#059669"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold" style={{ color: "#0f1b2d" }}>
            Scholarships, Financial Aid, and Extracurricular Strategy
          </h4>
        </div>
        <ChevDown open={open} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          {/* EC Highlight */}
          <div
            className="p-3 rounded-xl mb-4 flex gap-3 items-start"
            style={{ backgroundColor: "#fefce8" }}
          >
            <span className="text-lg flex-shrink-0">🚀</span>
            <div>
              <h5
                className="text-xs font-bold mb-0.5"
                style={{ color: "#92400e" }}
              >
                Extracurricular Edge
              </h5>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#a16207" }}
              >
                {ecNote}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {items.map((s, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-3 rounded-xl"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: "#059669" }}
                >
                  {i + 1}
                </div>
                <div>
                  <h5
                    className="text-sm font-semibold"
                    style={{ color: "#0f1b2d" }}
                  >
                    {s.name}
                  </h5>
                  <p
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{ color: "#64748b" }}
                  >
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p
            className="text-center text-xs font-semibold mt-4 py-2 rounded-lg"
            style={{ backgroundColor: "#f0fdf4", color: "#166534" }}
          >
            ✦ And many more scholarships and financial aid opportunities
            available. We match you with the ones that fit your profile best.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ─── */
export default function SATSharksPKFinal() {
  const [selected, setSelected] = useState(null);
  const [showReg, setShowReg] = useState(false);
  const [selTier, setSelTier] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    year: "",
  });
  const [done, setDone] = useState(false);

  const c = selected ? countries.find((x) => x.id === selected) : null;
  const openReg = (tier) => {
    setSelTier(tier);
    setShowReg(true);
    setDone(false);
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}
    >
      {/* Nav */}
      <nav className="bg-white px-5 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: "#0f1b2d" }}
          >
            SAT
          </span>
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: "#0ea5e9" }}
          >
            Sharks
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-sm font-semibold px-4 py-2 rounded-full"
            style={{ backgroundColor: "#0f1b2d", color: "white" }}
            onClick={() => openReg("")}
          >
            Register
          </button>
          <button
            className="text-sm font-semibold px-4 py-2 rounded-full text-white flex items-center gap-1.5"
            style={{ backgroundColor: "#25D366" }}
            onClick={() => window.open(`https://wa.me/${WA}`, "_blank")}
          >
            <WAIcon />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="px-5 pt-12 pb-14 text-center"
        style={{
          background:
            "linear-gradient(165deg, #0f1b2d 0%, #1a2744 50%, #1e3054 100%)",
        }}
      >
        <span
          className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
          style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
        >
          Admissions Counselling for Pakistani Students
        </span>
        <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">
          Pakistan Se Duniya Tak.
        </h1>
        <h1
          className="text-3xl font-extrabold leading-tight mb-5"
          style={{ color: "#f59e0b" }}
        >
          Your Dream University Awaits.
        </h1>
        <p
          className="text-sm leading-relaxed max-w-md mx-auto mb-6"
          style={{ color: "#94a3b8" }}
        >
          We don't just write essays. We build your entire profile from scratch.
          Extracurriculars, research, competitions, personal statements, school
          selection, scholarship strategy. Everything except the visa. From zero
          to acceptance letter.
        </p>
        <div className="flex justify-center gap-6 mb-8">
          {[
            { num: "50+", label: "Students Placed" },
            { num: "15", label: "Countries" },
            { num: "95%", label: "Satisfaction" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-white">{s.num}</div>
              <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <button
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wide"
          style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
          onClick={() => openReg("")}
        >
          Register for Free Consultation
        </button>
      </section>

      {/* What Sets Us Apart */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <h2
          className="text-center text-xl font-bold mb-2"
          style={{ color: "#0f1b2d" }}
        >
          We Don't Just Write Essays. We Build Profiles.
        </h2>
        <p
          className="text-center text-sm mb-8 max-w-lg mx-auto"
          style={{ color: "#64748b" }}
        >
          Most consultancies take what you have and rewrite it. We take who you
          are and build an applicant that top universities cannot ignore.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "🔬",
              title: "Extracurricular Developers",
              desc: "Dedicated EC strategists who design, plan, and guide you through research projects, competitions, community initiatives, and leadership roles. We create the achievements, not just describe them.",
            },
            {
              icon: "✍️",
              title: "Expert Essay Crafting",
              desc: "Counsellors who have helped students break into the world's most selective universities. We don't use templates. Every word is written for you, about you, in your voice.",
            },
            {
              icon: "🎯",
              title: "Strategic School Matching",
              desc: "Data backed university selection that goes beyond rankings. We match you with schools and programs where your specific profile has the highest chance of admission and scholarships.",
            },
            {
              icon: "💰",
              title: "Scholarship Hunters",
              desc: "We don't just find scholarships. We build the profile that wins them. From identifying opportunities to crafting applications, we maximize your chances of funded education.",
            },
          ].map((d, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-3">{d.icon}</div>
              <h3
                className="text-sm font-bold mb-2"
                style={{ color: "#0f1b2d" }}
              >
                {d.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#64748b" }}
              >
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Country Selector */}
      <section className="px-4 py-6 max-w-5xl mx-auto">
        <h2
          className="text-center text-xl font-bold mb-1"
          style={{ color: "#0f1b2d" }}
        >
          Where Do You Want to Study?
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: "#64748b" }}>
          Select a destination to see pricing, services, and scholarships
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {countries.map((co) => (
            <button
              key={co.id}
              onClick={() => {
                setSelected(co.id);
                setTimeout(
                  () =>
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  100,
                );
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all"
              style={{
                borderColor: selected === co.id ? "#f59e0b" : "#e5e7eb",
                backgroundColor: selected === co.id ? "#fffbeb" : "white",
                boxShadow:
                  selected === co.id
                    ? "0 0 0 3px rgba(245,158,11,0.15)"
                    : "none",
              }}
            >
              <span className="text-2xl">{co.flag}</span>
              <span
                className="text-xs font-semibold text-center leading-tight"
                style={{ color: "#0f1b2d" }}
              >
                {co.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Pricing */}
      {c && (
        <section className="px-4 pb-10 max-w-5xl mx-auto" id="pricing">
          <div className="text-center mb-6">
            <span className="text-3xl mb-2 block">{c.flag}</span>
            <h2 className="text-xl font-bold" style={{ color: "#0f1b2d" }}>
              {c.name}
            </h2>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>
              {c.tagline}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-5 items-stretch">
            {/* Guided */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#e0f2fe" }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "#0f1b2d" }}
                  >
                    Guided Support
                  </h3>
                </div>
                <p className="text-xs mb-4" style={{ color: "#64748b" }}>
                  We guide, you write, with expert eyes on every draft.
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="text-3xl font-extrabold"
                    style={{ color: "#0f1b2d" }}
                  >
                    Rs. {c.t1}
                  </span>
                </div>
                <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>
                  {c.t1l} PKR
                </p>
              </div>
              <div className="px-6 pb-6 flex-1 flex flex-col">
                {c.guided.map((s, i) => (
                  <div key={i} className={i > 0 ? "mt-4" : ""}>
                    <h4
                      className="text-sm font-bold mb-2"
                      style={{ color: "#0f1b2d" }}
                    >
                      {s.cat}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {s.items.map((it, j) => (
                        <div key={j} className="flex gap-2.5 items-start">
                          <CheckIcon />
                          <span
                            className="text-sm leading-snug"
                            style={{ color: "#475569" }}
                          >
                            {it}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-auto pt-6 flex flex-col gap-2.5">
                  <button
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: "#0f1b2d" }}
                    onClick={() => openReg(`Guided Support — ${c.name}`)}
                  >
                    Register Now
                  </button>
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: "#25D366" }}
                    onClick={() =>
                      window.open(
                        `https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'm interested in the Guided Support package for ${c.name}.`)}`,
                        "_blank",
                      )
                    }
                  >
                    <WAIcon />
                    Chat on WhatsApp
                  </button>
                </div>
              </div>
            </div>
            {/* Complete */}
            <div
              className="flex-1 rounded-2xl overflow-hidden flex flex-col relative"
              style={{ border: "2px solid #f59e0b", background: "white" }}
            >
              <div
                className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
              >
                Most Popular
              </div>
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#fef9c3" }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#f59e0b"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "#0f1b2d" }}
                  >
                    Complete Package
                  </h3>
                </div>
                <p className="text-xs mb-4" style={{ color: "#64748b" }}>
                  We handle everything. You just show up and get accepted.
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="text-3xl font-extrabold"
                    style={{ color: "#0f1b2d" }}
                  >
                    Rs. {c.t2}
                  </span>
                </div>
                <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>
                  {c.t2l} PKR
                </p>
              </div>
              <div className="px-6 pb-6 flex-1 flex flex-col">
                {c.complete.map((s, i) => (
                  <div key={i} className={i > 0 ? "mt-4" : ""}>
                    <h4
                      className="text-sm font-bold mb-2"
                      style={{ color: "#0f1b2d" }}
                    >
                      {s.cat}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {s.items.map((it, j) => (
                        <div key={j} className="flex gap-2.5 items-start">
                          <StarIcon />
                          <span
                            className="text-sm leading-snug"
                            style={{ color: "#475569" }}
                          >
                            {it}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-auto pt-6 flex flex-col gap-2.5">
                  <button
                    className="w-full py-3.5 rounded-xl font-semibold text-sm"
                    style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
                    onClick={() => openReg(`Complete Package — ${c.name}`)}
                  >
                    Register Now
                  </button>
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: "#25D366" }}
                    onClick={() =>
                      window.open(
                        `https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'm interested in the Complete Package for ${c.name}.`)}`,
                        "_blank",
                      )
                    }
                  >
                    <WAIcon />
                    Chat on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ScholarshipAccordion items={c.scholarships} ecNote={c.ecHighlight} />
        </section>
      )}

      {/* Why Families Trust Us */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <h2
          className="text-center text-xl font-bold mb-6"
          style={{ color: "#0f1b2d" }}
        >
          Why Families Trust SAT Sharks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "💰",
              title: "Milestone Based Payments",
              desc: "You do not pay everything upfront. Fees are divided into milestones. If you are satisfied with the previous milestone, only then do you pay for the next. If not, you stop. Zero risk.",
            },
            {
              icon: "🎯",
              title: "Honest Tier Recommendation",
              desc: "We do not automatically push the Complete Package. We first assess your profile, scholarship needs, and the level of support you genuinely require. If Guided Support is enough, that is what we recommend.",
            },
            {
              icon: "🏆",
              title: "Strategy, Not Just Admission",
              desc: "Our goal is not simply to secure any admission offer. We build a focused strategy around universities and scholarships where your profile can compete most effectively.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className="text-2xl mb-3">{t.icon}</div>
              <h3
                className="text-sm font-bold mb-2"
                style={{ color: "#0f1b2d" }}
              >
                {t.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#64748b" }}
              >
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="px-5 py-10 text-center"
        style={{ backgroundColor: "#0f1b2d" }}
      >
        <h3 className="text-white font-bold text-lg mb-2">
          Everyone Else Polishes Applications. We Build Applicants.
        </h3>
        <p
          className="text-xs leading-relaxed max-w-md mx-auto mb-6"
          style={{ color: "#94a3b8" }}
        >
          From Lahore to Karachi, Islamabad to Peshawar. We have helped students
          across Pakistan build profiles, win scholarships, and land admits at
          dream schools in 15 countries. We cover everything except the visa. We
          don't do cookie cutter. Neither should you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
            style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
            onClick={() => openReg("")}
          >
            Register Now
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm"
            style={{ backgroundColor: "#25D366" }}
            onClick={() => window.open(`https://wa.me/${WA}`, "_blank")}
          >
            <WAIcon />
            Chat on WhatsApp
          </button>
        </div>
      </section>

      <footer className="px-5 py-6 text-center bg-white border-t border-gray-100">
        <p className="text-xs" style={{ color: "#94a3b8" }}>
          © 2026 SAT Sharks. All rights reserved.
        </p>
      </footer>

      {/* Registration Modal */}
      {showReg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(15,27,45,0.7)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReg(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative max-h-screen overflow-y-auto">
            <div
              className="px-6 pt-6 pb-4"
              style={{ background: "linear-gradient(135deg,#0f1b2d,#1a2744)" }}
            >
              <button
                onClick={() => setShowReg(false)}
                className="absolute top-4 right-4 text-white opacity-60 hover:opacity-100"
              >
                <CloseIcon />
              </button>
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
              >
                {selTier || "Get Started"}
              </span>
              <h3 className="text-xl font-bold text-white">
                Register Your Interest
              </h3>
              <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                Fill in your details and our team will reach out within 24
                hours.
              </p>
            </div>
            {!done ? (
              <div className="px-6 py-6 flex flex-col gap-4">
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    Full Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    WhatsApp Number
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="03XX XXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    City *
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 bg-white"
                  >
                    <option value="">Select city</option>
                    {[
                      "Lahore",
                      "Karachi",
                      "Islamabad",
                      "Rawalpindi",
                      "Peshawar",
                      "Faisalabad",
                      "Multan",
                      "Quetta",
                      "Other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    Target Year
                  </label>
                  <select
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 bg-white"
                  >
                    <option value="">Select year</option>
                    {[
                      "Fall 2026",
                      "Fall 2027",
                      "Fall 2028",
                      "Not sure yet",
                    ].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                {selTier && (
                  <div
                    className="px-4 py-3 rounded-xl text-xs"
                    style={{ backgroundColor: "#f0f9ff", color: "#0369a1" }}
                  >
                    Selected: <strong>{selTier}</strong>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (form.name && form.email && form.city) setDone(true);
                  }}
                  disabled={!form.name || !form.email || !form.city}
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-sm mt-1 disabled:opacity-40"
                  style={{ backgroundColor: "#0f1b2d" }}
                >
                  Submit Registration
                </button>
              </div>
            ) : (
              <div className="px-6 py-10 text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: "#d1fae5" }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "#0f1b2d" }}
                >
                  You're Registered!
                </h3>
                <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                  Thanks {form.name}! Our team will reach out within 24 hours.
                </p>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm"
                  style={{ backgroundColor: "#25D366" }}
                  onClick={() =>
                    window.open(
                      `https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I just registered. My name is ${form.name} from ${form.city}.`)}`,
                      "_blank",
                    )
                  }
                >
                  <WAIcon />
                  Message Us Directly
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
