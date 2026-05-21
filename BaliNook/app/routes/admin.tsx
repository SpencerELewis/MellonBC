import { useState, useEffect, useCallback } from "react";
import { SetupModal } from "~/components/SetupModal";
import { fetchBookClubData, saveBookClubData } from "~/lib/github";
import { getRepoConfig, getPAT, setPAT, clearPAT } from "~/lib/storage";
import type { Book, BookClubData, RepoConfig } from "~/lib/types";

export function meta() {
  return [{ title: "Admin – BaliNook Book Club" }];
}

const EMPTY_BOOK: Omit<Book, "id"> = {
  title: "",
  author: "",
  coverUrl: "",
  startDate: "",
  endDate: "",
  description: "",
  notes: "",
};

function generateId() {
  return `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function Admin() {
  const [repoConfig, setRepoConfig] = useState<RepoConfig | null>(null);
  const [pat, setPATState] = useState<string>("");
  const [patInput, setPatInput] = useState("");
  const [showPat, setShowPat] = useState(false);
  const [patSaved, setPatSaved] = useState(false);

  const [data, setData] = useState<BookClubData | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Book, "id">>(EMPTY_BOOK);
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<Omit<Book, "id">>(EMPTY_BOOK);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setRepoConfig(getRepoConfig());
    const stored = getPAT();
    if (stored) { setPATState(stored); setPatInput(stored); setPatSaved(true); }
  }, []);

  const loadData = useCallback(async (config: RepoConfig) => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data: fetched, sha: fetchedSha } = await fetchBookClubData(config.owner, config.repo);
      setData(fetched);
      setSha(fetchedSha);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.startsWith("DATA_NOT_FOUND")) {
        // Initialize empty data
        setData({ currentBookId: null, books: [] });
        setSha(null);
      } else {
        setFetchError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (repoConfig) loadData(repoConfig);
    else setLoading(false);
  }, [repoConfig, loadData]);

  function savePAT() {
    setPAT(patInput.trim());
    setPATState(patInput.trim());
    setPatSaved(true);
  }

  function removePAT() {
    clearPAT();
    setPATState("");
    setPatInput("");
    setPatSaved(false);
  }

  async function handleSave(newData: BookClubData) {
    if (!repoConfig || !pat) {
      setSaveError("No GitHub PAT configured. Enter your Personal Access Token above.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const newSha = await saveBookClubData(repoConfig.owner, repoConfig.repo, pat, newData, sha);
      setSha(newSha);
      setData(newData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(book: Book) {
    setEditingId(book.id);
    setEditForm({ title: book.title, author: book.author, coverUrl: book.coverUrl, startDate: book.startDate, endDate: book.endDate, description: book.description, notes: book.notes });
    setAddingNew(false);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function submitEdit() {
    if (!data || !editingId) return;
    const updated: BookClubData = {
      ...data,
      books: data.books.map((b) => (b.id === editingId ? { id: b.id, ...editForm } : b)),
    };
    await handleSave(updated);
    setEditingId(null);
  }

  async function submitNew() {
    if (!data) return;
    const newBook: Book = { id: generateId(), ...newForm };
    const updated: BookClubData = { ...data, books: [...data.books, newBook] };
    await handleSave(updated);
    setAddingNew(false);
    setNewForm(EMPTY_BOOK);
  }

  async function setCurrentBook(id: string) {
    if (!data) return;
    await handleSave({ ...data, currentBookId: id });
  }

  async function deleteBook(id: string) {
    if (!data) return;
    const updated: BookClubData = {
      currentBookId: data.currentBookId === id ? null : data.currentBookId,
      books: data.books.filter((b) => b.id !== id),
    };
    await handleSave(updated);
  }

  if (!repoConfig) {
    return <SetupModal onComplete={(config) => setRepoConfig(config)} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin</h1>

      {/* PAT config */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-800 mb-1">GitHub Personal Access Token</h2>
        <p className="text-xs text-gray-500 mb-3">
          Required to save changes. Must have <code>contents:write</code> permission on{" "}
          <strong>{repoConfig.owner}/{repoConfig.repo}</strong>. Stored only in your browser.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showPat ? "text" : "password"}
              value={patInput}
              onChange={(e) => { setPatInput(e.target.value); setPatSaved(false); }}
              placeholder="ghp_…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={() => setShowPat((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              {showPat ? "Hide" : "Show"}
            </button>
          </div>
          <button
            onClick={savePAT}
            disabled={!patInput.trim() || patSaved}
            className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-900 disabled:opacity-40 transition-colors"
          >
            {patSaved ? "Saved" : "Save"}
          </button>
          {pat && (
            <button
              onClick={removePAT}
              className="text-red-600 hover:text-red-800 text-sm px-2"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Repo info + refresh */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Repo: <strong>{repoConfig.owner}/{repoConfig.repo}</strong>
          {sha && <> · SHA: <code className="font-mono text-xs">{sha.slice(0, 7)}</code></>}
        </p>
        <button
          onClick={() => loadData(repoConfig)}
          className="text-xs text-amber-700 hover:text-amber-900 underline"
        >
          Refresh data
        </button>
      </div>

      {loading && <p className="text-gray-400 text-sm text-center py-8">Loading…</p>}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {fetchError}
        </div>
      )}

      {/* Save feedback */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold text-sm">Save failed</p>
          <p className="text-red-600 text-sm mt-1">{saveError}</p>
          {saveError.includes("CONFLICT") && (
            <button
              onClick={() => loadData(repoConfig)}
              className="mt-2 text-xs text-red-700 underline"
            >
              Refresh and discard your changes
            </button>
          )}
        </div>
      )}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-medium">
          ✓ Saved successfully! Changes are now live for everyone after refresh.
        </div>
      )}

      {!loading && !fetchError && data && (
        <>
          {/* Book list */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">Books</h2>
              <button
                onClick={() => { setAddingNew(true); setEditingId(null); }}
                className="text-sm bg-amber-800 text-white px-3 py-1.5 rounded-lg hover:bg-amber-900 transition-colors"
              >
                + Add Book
              </button>
            </div>

            {data.books.length === 0 && !addingNew && (
              <p className="text-gray-400 text-sm text-center py-6">
                No books yet. Add one to get started.
              </p>
            )}

            <div className="space-y-3">
              {data.books
                .slice()
                .sort((a, b) => b.startDate.localeCompare(a.startDate))
                .map((book) => (
                  <div key={book.id}>
                    {editingId === book.id ? (
                      <BookForm
                        form={editForm}
                        onChange={setEditForm}
                        onSubmit={submitEdit}
                        onCancel={cancelEdit}
                        saving={saving}
                        label="Save Changes"
                      />
                    ) : (
                      <div className="border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4 bg-white">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{book.title}</p>
                            {data.currentBookId === book.id && (
                              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{book.author}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {book.startDate} – {book.endDate}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {data.currentBookId !== book.id && (
                            <button
                              onClick={() => setCurrentBook(book.id)}
                              disabled={saving}
                              className="text-xs text-amber-700 hover:text-amber-900 underline disabled:opacity-50"
                            >
                              Set Current
                            </button>
                          )}
                          <button
                            onClick={() => startEdit(book)}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${book.title}"?`)) deleteBook(book.id);
                            }}
                            disabled={saving}
                            className="text-xs text-red-600 hover:text-red-800 underline disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

              {/* Add new form */}
              {addingNew && (
                <BookForm
                  form={newForm}
                  onChange={setNewForm}
                  onSubmit={submitNew}
                  onCancel={() => { setAddingNew(false); setNewForm(EMPTY_BOOK); }}
                  saving={saving}
                  label="Add Book"
                />
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ── Reusable book form ──────────────────────────────────────────────────────

interface BookFormProps {
  form: Omit<Book, "id">;
  onChange: (form: Omit<Book, "id">) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
  label: string;
}

function BookForm({ form, onChange, onSubmit, onCancel, saving, label }: BookFormProps) {
  function field(key: keyof Omit<Book, "id">) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...form, [key]: e.target.value });
  }

  return (
    <div className="border-2 border-amber-300 rounded-xl p-4 bg-amber-50 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-0.5">Title *</label>
          <input
            value={form.title}
            onChange={field("title")}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-0.5">Author *</label>
          <input
            value={form.author}
            onChange={field("author")}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-0.5">Start Date *</label>
          <input
            type="date"
            value={form.startDate}
            onChange={field("startDate")}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-0.5">End Date *</label>
          <input
            type="date"
            value={form.endDate}
            onChange={field("endDate")}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-0.5">Cover Image URL</label>
        <input
          value={form.coverUrl}
          onChange={field("coverUrl")}
          placeholder="https://…"
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-0.5">Description</label>
        <textarea
          value={form.description}
          onChange={field("description")}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-0.5">Club Notes</label>
        <textarea
          value={form.notes}
          onChange={field("notes")}
          rows={2}
          placeholder="Discussion date, meeting location, etc."
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={saving || !form.title || !form.author || !form.startDate || !form.endDate}
          className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-900 disabled:opacity-40 transition-colors"
        >
          {saving ? "Saving…" : label}
        </button>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
