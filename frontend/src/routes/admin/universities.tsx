import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { read, utils } from "xlsx";
import { api } from "../../services/api";
import { AdminLayout } from "../../components/layout/AdminLayout";

export const Route = createFileRoute("/admin/universities")({
  component: () => (
    <AdminLayout activeItem="/admin/universities">
      <AdminUniversities />
    </AdminLayout>
  ),
});

function AdminUniversities() {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: universities = [], isLoading } = useQuery({
    queryKey: ["universities"],
    queryFn: async () => {
      const res = await api.get("/api/universities");
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  const [customSheetName, setCustomSheetName] = useState("General");

  const syncMutation = useMutation({
    mutationFn: async ({ data, sheetName }: { data: any[]; sheetName: string }) => {
      const res = await api.put("/api/universities/sync", { universities: data, sheetName });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      alert("Universities synced successfully!");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || err.message;
      alert("Failed to sync universities: " + msg);
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: any[] = utils.sheet_to_json(sheet);

        // Map spreadsheet columns to DB fields
        const mappedData = jsonData.map((row, idx) => ({
          uniId: parseInt(row["ID"] || row["id"]) || idx + 1,
          name: row["University Name"] || row["Name"] || row["name"] || "Unknown",
          country: row["Country"] || row["country"] || "Unknown",
          city: row["City"] || row["city"] || "Unknown",
          ranking: parseInt(row["QS Ranking"] || row["Ranking"] || row["ranking"]) || 999,
          acceptRate: parseFloat(row["Accept Rate (%)"] || row["Acceptance Rate"] || row["acceptRate"]) || 50,
          minGPA: parseFloat(row["Min GPA"] || row["minGPA"]) || 3.0,
          avgSAT: parseInt(row["Avg SAT"] || row["avgSAT"]) || null,
          minIELTS: parseFloat(row["Min IELTS"] || row["minIELTS"]) || null,
          minTOEFL: parseInt(row["Min TOEFL"] || row["minTOEFL"]) || null,
          tuition: parseInt(row["Tuition (USD)"] || row["Tuition"] || row["tuition"]) || 30000,
          scholarships: row["Scholarships"] || row["scholarships"] || "None",
          programs: (row["Programs"] || row["programs"] || "General").split(",").map((s: string) => s.trim()),
          deadline: row["Deadline"] || row["deadline"] || "Rolling",
          type: row["Type"] || row["type"] || "Public",
          logo: row["Flag"] || row["Logo"] || row["logo"] || "🎓",
        }));

        syncMutation.mutate({ data: mappedData, sheetName: customSheetName || sheetName });
      } catch (err) {
        alert("Error parsing spreadsheet. Make sure the format matches.");
        setIsUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset file input
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-on-surface">University Database</h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Manage the list of universities used in the Matcher System.
          </p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Import Sheet Name</label>
            <input
              type="text"
              value={customSheetName}
              onChange={(e) => setCustomSheetName(e.target.value)}
              className="px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs outline-none focus:border-primary max-w-[150px] font-semibold"
              placeholder="Sheet Name"
            />
          </div>
          <div className="relative mt-5">
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <button 
              disabled={isUploading}
              className="px-5 py-2.5 bg-accent text-on-primary font-bold rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:bg-accent/90 transition-colors pointer-events-none text-xs"
            >
              {isUploading ? "Syncing..." : "Upload Spreadsheet"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface-variant">
            <thead className="bg-surface-container-low text-xs uppercase text-on-surface border-b border-outline-variant/30">
              <tr>
                <th className="px-6 py-4 font-bold">University</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">QS Rank</th>
                <th className="px-6 py-4 font-bold">Tuition</th>
                <th className="px-6 py-4 font-bold">Deadline</th>
                <th className="px-6 py-4 font-bold">Sheet Name</th>
                <th className="px-6 py-4 font-bold">Programs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    Loading universities...
                  </td>
                </tr>
              ) : universities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    No universities found. Please upload a spreadsheet.
                  </td>
                </tr>
              ) : (
                universities.map((uni: any) => (
                  <tr key={uni._id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{uni.logo}</span>
                        <div className="font-semibold text-on-surface">{uni.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {uni.city}, {uni.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      #{uni.ranking}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-400 font-mono">
                      ${uni.tuition.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-error/10 text-error rounded-lg text-xs font-semibold">
                        {uni.deadline}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                      {uni.sheetName || "General"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {uni.programs.slice(0, 3).map((p: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-semibold">
                            {p}
                          </span>
                        ))}
                        {uni.programs.length > 3 && (
                          <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant rounded-full text-[10px] font-semibold">
                            +{uni.programs.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
