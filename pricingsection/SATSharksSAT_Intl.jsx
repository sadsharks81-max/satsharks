import { useState } from "react";

const CheckIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5"><circle cx="10" cy="10" r="10" fill="#7c3aed" opacity="0.12"/><path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const PortalIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5"><circle cx="10" cy="10" r="10" fill="#0ea5e9" opacity="0.12"/><path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const FireIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5"><circle cx="10" cy="10" r="10" fill="#f59e0b" opacity="0.15"/><path d="M10 3c0 3-2 4.5-2 7a4 4 0 0 0 4 4 4 4 0 0 0 4-4c0-3-4-5-4-7a6 6 0 0 1-2 0z" fill="#f59e0b" opacity="0.6"/></svg>);
const WAIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>);
const CloseIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

const WA = "923164514334";

const portalOnlyFeatures = [
  { cat:"Full Adaptive Testing Engine", items:["10 full length adaptive SAT papers that mirror the real digital SAT exactly","Every single question and section is timed, just like test day","The exam screen, layout, and interface is identical to the actual SAT, no surprises when you sit the real thing"] },
  { cat:"5,000+ Topical Question Bank", items:["Questions sorted by topic across every SAT subject area","Three difficulty levels: easy, medium, and hard","Filter by topic and difficulty to focus on exactly what you need"] },
  { cat:"Build Your Own Practice Tests", items:["Create custom timed tests where you decide the number of questions and time limit","Mix topics and difficulty levels to simulate your personal weak areas","Everything is timed so you always practice under real pressure"] },
  { cat:"Smart Analytics and Improvement Engine", items:["Detailed analytics showing your weak areas by topic and question type","The portal suggests exactly what to work on next based on your performance","Track your progress over time and watch your weak spots become strengths"] },
  { cat:"Interactive Vocabulary Games", items:["Learn SAT vocabulary through engaging games, not boring flashcards","Retention is higher when learning feels like playing","Builds the reading and writing foundation that separates 1400 from 1500+"] },
  { cat:"Leaderboard and Community", items:["See how you rank against other SAT Sharks students worldwide","Healthy competition drives better scores and keeps motivation high","Report any issue directly through the portal and our 24/7 dedicated support team will resolve it"] }
];

const groupFeatures = [
  { cat:"Intensive Weekly Schedule", items:["6 live online sessions every week, 3 English and 3 Math","23 sessions per month with 7 dedicated practice tests","Consistent structure that builds momentum week after week"] },
  { cat:"Real SAT Practice, Not Random Questions", items:["Weekly full length tests using actual past SAT papers","You practice under real conditions so there are no surprises on test day","Detailed score analysis after every test to track your growth"] },
  { cat:"Desmos, Shortcuts, and Strategy", items:["Dedicated time mastering Desmos, the graphing calculator allowed in SAT Math","English shortcuts and tricks that save critical minutes per section","Math strategies that turn hard problems into quick wins"] },
  { cat:"Full Support, Nothing Extra to Buy", items:["All study materials, books, past papers, and question banks provided","Your instructor's number is yours, ask questions anytime after class","After your first month, you get a personal one on one session with your instructor"] }
];

const oneOnOneFeatures = [
  { cat:"Your Own Dedicated Tutor", items:["Every session is built around your specific strengths and weaknesses","Diagnostic test on day one to build a custom study roadmap","Flexible scheduling, sessions happen when they work for you"] },
  { cat:"The Same Proven Curriculum, Personalized", items:["Same 6 session weekly intensity, 3 English and 3 Math","Full length SAT past papers every week under timed conditions","Individual score breakdowns with targeted action plans after each test"] },
  { cat:"Deeper Desmos and Strategy Training", items:["One on one Desmos walkthroughs tailored to the question types you struggle with","Personalized shortcut toolkit for both English and Math","Advanced techniques for students targeting 1500+"] },
  { cat:"Always On Access and Materials", items:["All books, past papers, and resources included, nothing extra to buy","Direct WhatsApp access to your tutor, not a group chat, just you","Continuous progress tracking and strategy adjustments between sessions"] }
];

export default function SATSharksSTIntl() {
  const [showReg, setShowReg] = useState(false);
  const [selTier, setSelTier] = useState("");
  const [form, setForm] = useState({ name:"", email:"", phone:"", city:"", score:"" });
  const [done, setDone] = useState(false);
  const openReg = (tier) => { setSelTier(tier); setShowReg(true); setDone(false); };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>

      <nav className="bg-white px-5 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2"><span className="text-lg font-black tracking-tight" style={{ color: "#0f1b2d" }}>SAT</span><span className="text-lg font-black tracking-tight" style={{ color: "#7c3aed" }}>Sharks</span></div>
        <div className="flex items-center gap-2">
          <button className="text-sm font-semibold px-4 py-2 rounded-full" style={{ backgroundColor: "#0f1b2d", color: "white" }} onClick={() => openReg("")}>Register</button>
          <button className="text-sm font-semibold px-4 py-2 rounded-full text-white flex items-center gap-1.5" style={{ backgroundColor: "#25D366" }} onClick={() => window.open(`https://wa.me/${WA}`, "_blank")}><WAIcon /><span className="hidden sm:inline">Chat</span></button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 pt-12 pb-14 text-center" style={{ background: "linear-gradient(165deg, #1a0533 0%, #2d1054 50%, #1a0533 100%)" }}>
        <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}>SAT Preparation for International Students</span>
        <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">Your SAT Score</h1>
        <h1 className="text-3xl font-extrabold leading-tight mb-5" style={{ color: "#f59e0b" }}>Is Not a Talent Test. It's a Strategy Test.</h1>
        <p className="text-sm leading-relaxed max-w-md mx-auto mb-6" style={{ color: "#a78bfa" }}>The students who score 1500+ are not smarter. They practiced the right way, with the right materials, under real conditions. That is exactly what we do.</p>
        <div className="flex justify-center gap-6 mb-8">
          {[{ num:"200+", label:"Avg Score Increase" },{ num:"1500+", label:"Top Scorers" },{ num:"95%", label:"Score Improvement" }].map(s => (
            <div key={s.label} className="text-center"><div className="text-2xl font-extrabold text-white">{s.num}</div><div className="text-xs mt-0.5" style={{ color: "#7c3aed" }}>{s.label}</div></div>
          ))}
        </div>
        <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wide" style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }} onClick={() => openReg("")}>Register for Free Demo Class</button>
      </section>

      {/* Track Record */}
      <section className="px-4 py-6" style={{ backgroundColor: "#120825" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h3 className="text-xs font-bold tracking-widest uppercase" style={{ color: "#a78bfa" }}>Our Students' Track Record</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["Students scoring 1500+ consistently","Average improvement of 200+ points","Perfect 800 Math scorers","Perfect 800 English scorers","Students accepted to Top 30 US universities","Scholarship recipients through SAT scores"].map((p,i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: "rgba(124,58,237,0.15)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.3)" }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SAT Portal Section */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: "#ede9fe", color: "#7c3aed" }}>Your Secret Weapon</span>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: "#0f1b2d" }}>The SAT Sharks Portal</h2>
          <p className="text-sm max-w-lg mx-auto mb-1" style={{ color: "#64748b" }}>A full SAT preparation platform built to mirror the real digital SAT exactly. Every question timed. Every weak area tracked. Every improvement measured.</p>
          <p className="text-xs max-w-lg mx-auto font-semibold" style={{ color: "#7c3aed" }}>Available as standalone access or included free with Group and One on One plans.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon:"📝", title:"10 Full Length Adaptive Papers", desc:"Complete SAT simulations that adapt to your level. The exam screen, layout, and interface is identical to the real digital SAT. No surprises on test day." },
            { icon:"📚", title:"5,000+ Topical Questions", desc:"Easy, medium, and hard difficulty across every SAT topic. Filter by subject and difficulty to practice exactly what you need." },
            { icon:"⏱️", title:"Build Your Own Timed Tests", desc:"Create custom practice tests where you decide the number of questions and time limit. Mix topics and difficulty levels. Everything is timed." },
            { icon:"📊", title:"Smart Analytics Engine", desc:"Detailed analytics showing your weak areas by topic and question type. The portal suggests exactly what to work on next based on your performance." },
            { icon:"🎮", title:"Interactive Vocabulary Games", desc:"Learn SAT vocabulary through engaging games. Retention is higher when learning feels like playing. Builds the foundation that separates 1400 from 1500+." },
            { icon:"🏆", title:"Leaderboard and 24/7 Support", desc:"Rank against other students. Report any issue directly through the portal and our 24/7 dedicated support team resolves it." }
          ].map((f,i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">{f.icon}</div><h3 className="text-sm font-bold mb-2" style={{ color: "#0f1b2d" }}>{f.title}</h3><p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-10 max-w-6xl mx-auto">
        <h2 className="text-center text-xl font-bold mb-1" style={{ color: "#0f1b2d" }}>Choose Your Plan</h2>
        <p className="text-center text-sm mb-8" style={{ color: "#64748b" }}>From self study to fully personalized tutoring. Pick the style that fits your learning.</p>

        <div className="flex flex-col lg:flex-row gap-5 items-stretch">

          {/* Portal Only */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#e0f2fe" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <h3 className="text-lg font-bold" style={{ color: "#0f1b2d" }}>Portal Only</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: "#64748b" }}>Self study at your own pace with the most powerful SAT prep platform available anywhere.</p>
              <div className="flex items-baseline gap-1 mb-1"><span className="text-3xl font-extrabold" style={{ color: "#0f1b2d" }}>$70</span></div>
              <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>Per month</p>
            </div>
            <div className="px-6 pb-6 flex-1 flex flex-col">
              {portalOnlyFeatures.map((s,i) => (<div key={i} className={i>0?"mt-4":""}><h4 className="text-sm font-bold mb-2" style={{ color: "#0f1b2d" }}>{s.cat}</h4><div className="flex flex-col gap-2">{s.items.map((it,j) => (<div key={j} className="flex gap-2.5 items-start"><PortalIcon /><span className="text-sm leading-snug" style={{ color: "#475569" }}>{it}</span></div>))}</div></div>))}
              <div className="mt-auto pt-6 flex flex-col gap-2.5">
                <button className="w-full py-3.5 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: "#0ea5e9" }} onClick={() => openReg("Portal Only")}>Start Self Study</button>
                <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: "#25D366" }} onClick={() => window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'm interested in Portal Only access for SAT prep.")}`, "_blank")}><WAIcon />Chat on WhatsApp</button>
              </div>
            </div>
          </div>

          {/* Group Sessions */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#ede9fe" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="text-lg font-bold" style={{ color: "#0f1b2d" }}>Group Sessions</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: "#64748b" }}>Learn alongside peers in a structured, high intensity program designed to push everyone forward.</p>
              <div className="flex items-baseline gap-1 mb-1"><span className="text-3xl font-extrabold" style={{ color: "#0f1b2d" }}>$300</span></div>
              <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>Full course</p>
            </div>
            <div className="px-6 pb-6 flex-1 flex flex-col">
              {groupFeatures.map((s,i) => (<div key={i} className={i>0?"mt-4":""}><h4 className="text-sm font-bold mb-2" style={{ color: "#0f1b2d" }}>{s.cat}</h4><div className="flex flex-col gap-2">{s.items.map((it,j) => (<div key={j} className="flex gap-2.5 items-start"><CheckIcon /><span className="text-sm leading-snug" style={{ color: "#475569" }}>{it}</span></div>))}</div></div>))}
              <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: "#f5f3ff" }}><p className="text-xs font-semibold" style={{ color: "#7c3aed" }}>✦ Full SAT Sharks Portal access included free</p></div>
              <div className="mt-auto pt-6 flex flex-col gap-2.5">
                <button className="w-full py-3.5 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: "#7c3aed" }} onClick={() => openReg("Group Sessions")}>Register Now</button>
                <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: "#25D366" }} onClick={() => window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'm interested in SAT Group Sessions.")}`, "_blank")}><WAIcon />Chat on WhatsApp</button>
              </div>
            </div>
          </div>

          {/* One on One */}
          <div className="flex-1 rounded-2xl overflow-hidden flex flex-col relative" style={{ border: "2px solid #f59e0b", background: "white" }}>
            <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>Maximum Results</div>
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#fef9c3" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <h3 className="text-lg font-bold" style={{ color: "#0f1b2d" }}>One on One Sessions</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: "#64748b" }}>Every session built around you, your weaknesses, your pace, your target score.</p>
              <div className="flex items-baseline gap-1 mb-1"><span className="text-3xl font-extrabold" style={{ color: "#0f1b2d" }}>$500</span></div>
              <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>Per month</p>
            </div>
            <div className="px-6 pb-6 flex-1 flex flex-col">
              {oneOnOneFeatures.map((s,i) => (<div key={i} className={i>0?"mt-4":""}><h4 className="text-sm font-bold mb-2" style={{ color: "#0f1b2d" }}>{s.cat}</h4><div className="flex flex-col gap-2">{s.items.map((it,j) => (<div key={j} className="flex gap-2.5 items-start"><FireIcon /><span className="text-sm leading-snug" style={{ color: "#475569" }}>{it}</span></div>))}</div></div>))}
              <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: "#fefce8" }}><p className="text-xs font-semibold" style={{ color: "#92400e" }}>✦ Full SAT Sharks Portal access included free</p></div>
              <div className="mt-auto pt-6 flex flex-col gap-2.5">
                <button className="w-full py-3.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }} onClick={() => openReg("One on One Sessions")}>Register Now</button>
                <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: "#25D366" }} onClick={() => window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'm interested in SAT One on One Sessions.")}`, "_blank")}><WAIcon />Chat on WhatsApp</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SAT Sharks */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <h2 className="text-center text-xl font-bold mb-6" style={{ color: "#0f1b2d" }}>Why Students Choose SAT Sharks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon:"🧠", title:"Strategy Over Memorization", desc:"We don't make you memorize thousands of rules. We teach you how to think through any question type, recognize patterns, and use shortcuts that save minutes on test day." },
            { icon:"📊", title:"Real Data, Real Papers", desc:"Every practice test is a real past SAT paper done under timed conditions. No generic question banks. No watered down material. You practice what you will actually face." },
            { icon:"🚀", title:"The Portal Advantage", desc:"No other SAT prep globally gives you a full adaptive testing portal with 5,000+ questions, smart analytics, custom test builder, vocabulary games, leaderboard, and an interface identical to the real digital SAT." }
          ].map((t,i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5"><div className="text-2xl mb-3">{t.icon}</div><h3 className="text-sm font-bold mb-2" style={{ color: "#0f1b2d" }}>{t.title}</h3><p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{t.desc}</p></div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-10 text-center" style={{ background: "linear-gradient(135deg, #1a0533, #2d1054)" }}>
        <h3 className="text-white font-bold text-lg mb-2">Everyone Else Teaches the SAT. We Train You to Beat It.</h3>
        <p className="text-xs leading-relaxed max-w-md mx-auto mb-6" style={{ color: "#a78bfa" }}>Real papers. Real conditions. Real strategies. A portal that knows your weak spots better than you do. From Dubai to London, Singapore to Riyadh, our students don't just improve, they dominate.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm" style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }} onClick={() => openReg("")}>Register for Free Demo</button>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm" style={{ backgroundColor: "#25D366" }} onClick={() => window.open(`https://wa.me/${WA}`, "_blank")}><WAIcon />Chat on WhatsApp</button>
        </div>
      </section>

      <footer className="px-5 py-6 text-center bg-white border-t border-gray-100"><p className="text-xs" style={{ color: "#94a3b8" }}>© 2026 SAT Sharks. All rights reserved.</p></footer>

      {/* Registration Modal */}
      {showReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(26,5,51,0.8)", backdropFilter: "blur(4px)" }} onClick={e => { if (e.target === e.currentTarget) setShowReg(false); }}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative max-h-screen overflow-y-auto">
            <div className="px-6 pt-6 pb-4" style={{ background: "linear-gradient(135deg,#1a0533,#2d1054)" }}>
              <button onClick={() => setShowReg(false)} className="absolute top-4 right-4 text-white opacity-60 hover:opacity-100"><CloseIcon /></button>
              <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3" style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}>{selTier || "SAT Preparation"}</span>
              <h3 className="text-xl font-bold text-white">Register Your Interest</h3>
              <p className="text-xs mt-1" style={{ color: "#a78bfa" }}>Fill in your details and our team will reach out within 24 hours.</p>
            </div>
            {!done ? (
              <div className="px-6 py-6 flex flex-col gap-4">
                <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#0f1b2d" }}>Student Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Enter student's full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#0f1b2d" }}>Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#0f1b2d" }}>WhatsApp Number</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 234 567 8900" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400" /></div>
                <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#0f1b2d" }}>Country *</label>
                  <select value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-white">
                    <option value="">Select country</option>{["UAE","Saudi Arabia","Qatar","Kuwait","Bahrain","Oman","UK","Singapore","Malaysia","Other"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#0f1b2d" }}>Current SAT Score (if taken before)</label><input value={form.score} onChange={e => setForm({...form, score: e.target.value})} placeholder="e.g. 1200, or First time" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400" /></div>
                {selTier && <div className="px-4 py-3 rounded-xl text-xs" style={{ backgroundColor: "#f5f3ff", color: "#6d28d9" }}>Selected: <strong>{selTier}</strong></div>}
                <button onClick={() => { if (form.name && form.email && form.city) setDone(true); }} disabled={!form.name || !form.email || !form.city} className="w-full py-3.5 rounded-xl text-white font-semibold text-sm mt-1 disabled:opacity-40" style={{ backgroundColor: "#7c3aed" }}>Submit Registration</button>
              </div>
            ) : (
              <div className="px-6 py-10 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#ede9fe" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#0f1b2d" }}>You're Registered!</h3>
                <p className="text-sm mb-6" style={{ color: "#64748b" }}>Thanks {form.name}! We will reach out within 24 hours to schedule your free demo class.</p>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm" style={{ backgroundColor: "#25D366" }} onClick={() => window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I just registered for SAT prep. My name is ${form.name} from ${form.city}.`)}`, "_blank")}><WAIcon />Message Us Directly</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
