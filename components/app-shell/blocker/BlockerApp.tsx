"use client";

import { FormEvent, useEffect, useState } from "react";

type Category = { id: string; label: string; enabled: boolean; sites: string[] };
type Site = { id: string; domain: string };

const inputStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid #EAE6F6",
  fontSize: "0.86rem",
  fontFamily: "var(--font-body)",
};

export default function BlockerApp() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [customSites, setCustomSites] = useState<Site[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySites, setNewCategorySites] = useState("");
  const [newSite, setNewSite] = useState("");

  useEffect(() => {
    fetch("/api/blocked-categories")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories)
      .catch(() => {});
    fetch("/api/blocked-sites")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setCustomSites(data.customSites))
      .catch(() => {});
  }, []);

  async function toggleCategory(id: string) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
    await fetch(`/api/blocked-categories/${id}`, { method: "PATCH" }).catch(() => {});
  }

  async function removeCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/blocked-categories/${id}`, { method: "DELETE" }).catch(() => {});
  }

  async function addCategory(e: FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim() || !newCategorySites.trim()) return;

    const res = await fetch("/api/blocked-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newCategoryName.trim(), domains: newCategorySites }),
    });
    if (res.ok) {
      const category = await res.json();
      setCategories((prev) => [...prev, category]);
      setNewCategoryName("");
      setNewCategorySites("");
    }
  }

  async function addSite(e: FormEvent) {
    e.preventDefault();
    const domain = newSite.trim().toLowerCase();
    if (!domain) return;

    const res = await fetch("/api/blocked-sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });
    if (res.ok) {
      const site = await res.json();
      setCustomSites((prev) => [...prev, site]);
      setNewSite("");
    }
  }

  async function removeSite(id: string) {
    setCustomSites((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/blocked-sites/${id}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <>
      <div>
        <div style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
          Site Blocker
        </div>
        <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E1B33" }}>Situs yang Diblokir Saat Sesi Fokus</div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #EAE6F6", borderRadius: 18, padding: 22 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E1B33", marginBottom: 4 }}>Kategori</div>
        <p style={{ fontSize: "0.82rem", color: "#9C97B5", margin: "0 0 16px" }}>
          Buat kategori sendiri untuk mengelompokkan situs yang ingin diblokir.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: categories.length === 0 ? 0 : 4 }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px", gap: 10 }}>
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", flex: 1, minWidth: 0 }}
              >
                <div
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 100,
                    background: cat.enabled ? "#3A3170" : "#EAE6F6",
                    padding: 2,
                    display: "flex",
                    justifyContent: cat.enabled ? "flex-end" : "flex-start",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E1B33" }}>{cat.label}</div>
                  <div style={{ fontSize: "0.78rem", color: "#9C97B5", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {cat.sites.join(", ")}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => removeCategory(cat.id)}
                aria-label={`Hapus kategori ${cat.label}`}
                style={{ width: 24, height: 24, borderRadius: "50%", background: "#F3F1FA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7A7593" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <div style={{ fontSize: "0.82rem", color: "#9C97B5", padding: "8px 4px" }}>Belum ada kategori. Tambahkan di bawah.</div>
          )}
        </div>

        <form onSubmit={addCategory} style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #F1EFF9", paddingTop: 16 }}>
          <input
            type="text"
            required
            placeholder="Nama kategori (mis. Media Sosial)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              required
              placeholder="Domain, pisahkan koma (mis. instagram.com, tiktok.com)"
              value={newCategorySites}
              onChange={(e) => setNewCategorySites(e.target.value)}
              style={{ ...inputStyle, flex: 1, minWidth: 0 }}
            />
            <button
              type="submit"
              style={{ background: "#3A3170", color: "#fff", fontWeight: 700, fontSize: "0.85rem", padding: "11px 18px", borderRadius: 10, whiteSpace: "nowrap" }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div style={{ background: "#fff", border: "1px solid #EAE6F6", borderRadius: 18, padding: 22 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E1B33", marginBottom: 14 }}>Tambah Situs Kustom</div>
        <form onSubmit={addSite} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            required
            placeholder="misal: reddit.com"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 0, fontSize: "0.88rem" }}
          />
          <button
            type="submit"
            style={{ background: "#3A3170", color: "#fff", fontWeight: 700, fontSize: "0.85rem", padding: "11px 18px", borderRadius: 10, whiteSpace: "nowrap" }}
          >
            Submit
          </button>
        </form>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {customSites.map((site) => (
            <span
              key={site.id}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#FBF2F0", color: "#9A5347", fontSize: "0.82rem", fontWeight: 600, padding: "7px 8px 7px 12px", borderRadius: 100 }}
            >
              {site.domain}
              <button
                type="button"
                onClick={() => removeSite(site.id)}
                aria-label={`Hapus ${site.domain}`}
                style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(154,83,71,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#9A5347" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          ))}
          {customSites.length === 0 && <span style={{ fontSize: "0.82rem", color: "#9C97B5" }}>Belum ada situs kustom ditambahkan.</span>}
        </div>
      </div>

      <p style={{ fontSize: "0.8rem", color: "#9C97B5", margin: 0, lineHeight: 1.6 }}>
        Daftar ini otomatis dipakai oleh ekstensi StudyBuddy di browser saat sesi fokus berjalan. Pastikan ekstensi
        sudah terpasang agar pemblokiran aktif.
      </p>
    </>
  );
}
