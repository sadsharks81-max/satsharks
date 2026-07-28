import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/common/Icon";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../services/api";

export const Route = createFileRoute("/admin/vocabulary")({
  component: AdminVocabularyPage,
});

interface VocabularyWord {
  _id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  frequency: number;
  isActive: boolean;
}

const blankForm = {
  word: "",
  partOfSpeech: "",
  definition: "",
  example: "",
  synonyms: "",
  frequency: "0",
  isActive: true,
};

function AdminVocabularyPage() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadWords = async () => {
    setLoading(true);
    const res = await api.get("/api/vocabulary/admin");
    if (res.success) setWords(res.words || []);
    else setError(res.error || "Could not load vocabulary.");
    setLoading(false);
  };

  useEffect(() => {
    loadWords();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return words;
    return words.filter((item) =>
      [item.word, item.partOfSpeech, item.definition, item.synonyms.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [words, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(blankForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item: VocabularyWord) => {
    setEditingId(item._id);
    setForm({
      word: item.word,
      partOfSpeech: item.partOfSpeech,
      definition: item.definition,
      example: item.example || "",
      synonyms: item.synonyms.join(", "),
      frequency: String(item.frequency || 0),
      isActive: item.isActive,
    });
    setError("");
    setModalOpen(true);
  };

  const saveWord = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      synonyms: form.synonyms.split(",").map((item) => item.trim()).filter(Boolean),
      frequency: Number(form.frequency) || 0,
    };
    const res = editingId
      ? await api.put(`/api/vocabulary/admin/${editingId}`, payload)
      : await api.post("/api/vocabulary/admin", payload);
    if (res.success) {
      setModalOpen(false);
      await loadWords();
    } else {
      setError(res.error || "Could not save vocabulary word.");
    }
    setSaving(false);
  };

  const deleteWord = async (item: VocabularyWord) => {
    if (!confirm(`Delete “${item.word}” from vocabulary practice?`)) return;
    const res = await api.delete(`/api/vocabulary/admin/${item._id}`);
    if (res.success) setWords((current) => current.filter((word) => word._id !== item._id));
    else alert(res.error || "Could not delete vocabulary word.");
  };

  return (
    <AdminLayout activeItem="/admin/vocabulary">
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold text-on-surface">Vocabulary Library</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Manage the words used in student flashcards, challenges, and review.
            </p>
          </div>
          <button onClick={openCreate} className="btn-shimmer inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary shark-shadow hover:bg-accent">
            <Icon name="add" className="text-lg" /> Add Word
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-outline-variant/40 bg-surface p-5 shark-shadow">
            <div className="text-2xl font-extrabold text-primary">{words.length}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Words</div>
          </div>
          <div className="rounded-2xl border border-outline-variant/40 bg-surface p-5 shark-shadow">
            <div className="text-2xl font-extrabold text-success">{words.filter((word) => word.isActive).length}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Active</div>
          </div>
          <div className="rounded-2xl border border-outline-variant/40 bg-surface p-5 shark-shadow">
            <div className="text-2xl font-extrabold text-on-surface">{words.filter((word) => !word.isActive).length}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Hidden</div>
          </div>
        </div>

        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search words, definitions, or synonyms..."
            className="w-full rounded-xl border border-outline-variant bg-surface py-3 pl-12 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-on-surface-variant">Loading vocabulary...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="spellcheck" title="No vocabulary words found" description="Add a word or adjust your search." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface shark-shadow">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b border-outline-variant/40 bg-surface-container-low text-[11px] uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th className="p-4">Word</th>
                    <th className="p-4">Definition</th>
                    <th className="p-4">Synonyms</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filtered.map((item) => (
                    <tr key={item._id} className="hover:bg-surface-container-low/40">
                      <td className="p-4">
                        <div className="font-display text-base font-bold text-on-surface">{item.word}</div>
                        <div className="text-xs italic text-primary">{item.partOfSpeech}</div>
                      </td>
                      <td className="max-w-md p-4 text-sm text-on-surface-variant">{item.definition}</td>
                      <td className="p-4 text-xs text-on-surface-variant">{item.synonyms.join(", ") || "None"}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${item.isActive ? "bg-success/10 text-success" : "bg-surface-container-high text-on-surface-variant"}`}>
                          {item.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(item)} className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20" aria-label={`Edit ${item.word}`}>
                            <Icon name="edit" className="text-lg" />
                          </button>
                          <button onClick={() => deleteWord(item)} className="rounded-lg bg-error/10 p-2 text-error hover:bg-error/20" aria-label={`Delete ${item.word}`}>
                            <Icon name="delete" className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Vocabulary Word" : "Add Vocabulary Word"}
        icon="spellcheck"
        maxWidth="max-w-2xl"
      >
        {error && <div className="mb-4 rounded-xl border border-error/25 bg-error/10 p-3 text-sm text-error">{error}</div>}
        <form onSubmit={saveWord} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Word *" value={form.word} onChange={(event) => setForm({ ...form, word: event.target.value })} required />
            <Input label="Part of Speech *" value={form.partOfSpeech} onChange={(event) => setForm({ ...form, partOfSpeech: event.target.value })} placeholder="noun, verb, adjective..." required />
          </div>
          <Textarea label="Definition *" value={form.definition} onChange={(event) => setForm({ ...form, definition: event.target.value })} rows={3} required />
          <Textarea label="Example Sentence" value={form.example} onChange={(event) => setForm({ ...form, example: event.target.value })} rows={3} />
          <Input label="Synonyms (comma separated)" value={form.synonyms} onChange={(event) => setForm({ ...form, synonyms: event.target.value })} placeholder="traditional, customary, orthodox" />
          <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
            <Input label="SAT Frequency" type="number" min="0" value={form.frequency} onChange={(event) => setForm({ ...form, frequency: event.target.value })} />
            <label className="flex h-[46px] items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 text-sm font-semibold text-on-surface">
              <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="h-4 w-4 accent-primary" />
              Show to students
            </label>
          </div>
          <div className="flex gap-3 border-t border-outline-variant/30 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-xl border border-outline-variant py-3 text-sm font-bold hover:bg-surface-container-low">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary hover:bg-accent disabled:opacity-50">
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Word"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
