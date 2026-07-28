import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Badge } from "../ui/Badge";

export function StudentProgressReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [daily, setDaily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"7" | "30" | "CUSTOM">("7");
  const today = new Date().toISOString().slice(0, 10);
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd] = useState(today);

  const loadReports = (selectedRange = range) => {
    setLoading(true);
    const end = selectedRange === "CUSTOM" ? customEnd : today;
    const startDate = selectedRange === "CUSTOM"
      ? customStart
      : new Date(Date.now() - (Number(selectedRange) - 1) * 86400000).toISOString().slice(0, 10);
    api.get(`/api/analytics/student-reports?start=${startDate}&end=${end}`).then((res) => {
      if (res.success) {
        setReports(res.reports || []);
        setDaily(res.daily || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadReports("7");
  }, []);

  const selectRange = (value: "7" | "30" | "CUSTOM") => {
    setRange(value);
    if (value !== "CUSTOM") loadReports(value);
  };
  const maxActivity = Math.max(1, ...daily.map((item) => item.tests + item.practice));

  return (
    <div>
      <h1 className="text-3xl font-bold">Student Progress Reports</h1>
      <p className="mb-8 mt-1 text-sm text-on-surface-variant">A complete progress summary for parent and student review.</p>
      <div className="mb-6 rounded-2xl border border-outline-variant/40 bg-surface p-5 shark-shadow">
        <div className="flex flex-wrap items-end gap-3">
          {(["7", "30", "CUSTOM"] as const).map((value) => (
            <button key={value} onClick={() => selectRange(value)} className={`rounded-xl px-4 py-2 text-xs font-bold ${range === value ? "bg-primary text-on-primary" : "bg-surface-container-low"}`}>
              {value === "7" ? "Last 7 Days" : value === "30" ? "Last 30 Days" : "Custom Range"}
            </button>
          ))}
          {range === "CUSTOM" && (
            <>
              <label className="text-xs font-bold text-on-surface-variant">From<input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="ml-2 rounded-lg border border-outline-variant bg-surface px-2 py-1.5" /></label>
              <label className="text-xs font-bold text-on-surface-variant">To<input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="ml-2 rounded-lg border border-outline-variant bg-surface px-2 py-1.5" /></label>
              <button onClick={() => loadReports("CUSTOM")} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-on-primary">Apply</button>
            </>
          )}
        </div>
      </div>
      <div className="mb-8 rounded-2xl border border-outline-variant/40 bg-surface p-6 shark-shadow">
        <div className="mb-6">
          <h2 className="font-bold">Daily Student Activity</h2>
          <p className="text-xs text-on-surface-variant">Full tests and practice questions completed by all students.</p>
        </div>
        <div className="flex h-64 items-end gap-1 overflow-x-auto border-b border-outline-variant/40 px-2 pt-6">
          {daily.map((item) => {
            const activity = item.tests + item.practice;
            return (
              <div key={item.date} className="group flex min-w-[28px] flex-1 flex-col items-center justify-end gap-1" title={`${item.date}: ${item.tests} tests, ${item.practice} practice questions, ${item.averageScore}% average score`}>
                <div className="text-[9px] font-bold opacity-0 transition-opacity group-hover:opacity-100">{activity}</div>
                <div className="w-full max-w-8 rounded-t-lg bg-primary transition-all group-hover:bg-accent" style={{ height: `${Math.max(activity ? 8 : 2, (activity / maxActivity) * 190)}px` }} />
                <div className="whitespace-nowrap text-[8px] text-on-surface-variant">{new Date(`${item.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-xs text-on-surface-variant">
          <span>Total tests: <strong className="text-on-surface">{daily.reduce((sum, item) => sum + item.tests, 0)}</strong></span>
          <span>Practice questions: <strong className="text-on-surface">{daily.reduce((sum, item) => sum + item.practice, 0)}</strong></span>
          <span>Correct practice answers: <strong className="text-on-surface">{daily.reduce((sum, item) => sum + item.correct, 0)}</strong></span>
        </div>
      </div>
      {loading && <div className="py-10 text-center text-sm text-on-surface-variant">Updating reports...</div>}
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.student._id} className="rounded-2xl border border-outline-variant/40 bg-surface p-6 shark-shadow">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-lg font-bold">{report.student.name}</h2><p className="text-xs text-on-surface-variant">{report.student.email}</p></div>
              <Badge variant={report.improvement >= 0 ? "success" : "error"}>{report.improvement >= 0 ? "+" : ""}{report.improvement}% improvement</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
              {[
                ["Full Tests", report.fullTests],
                ["First Score", `${report.firstScore}%`],
                ["Latest Score", `${report.latestScore}%`],
                ["Average", `${report.averageScore}%`],
                ["Practice", report.practiceTotal],
                ["Practice Accuracy", `${report.practiceAccuracy}%`],
                ["Vocab Accuracy", `${report.vocabAccuracy}%`],
              ].map(([label, value]) => <div key={label} className="rounded-xl bg-surface-container-low p-3"><div className="text-lg font-bold text-primary">{value}</div><div className="text-[10px] font-bold uppercase text-on-surface-variant">{label}</div></div>)}
            </div>
          </div>
        ))}
        {!reports.length && <div className="rounded-xl bg-surface-container-low p-8 text-center text-sm">No student activity is available yet.</div>}
      </div>
    </div>
  );
}
