"use client";

import { useEffect, useState } from "react";
import { news as defaultNews, type NewsItem } from "@/data/news";
import { rules as defaultRules, ruleCategories, type Rule } from "@/data/rules";

const NEWS_STORAGE_KEY = "blackout-rp-news-v2";
const RULES_STORAGE_KEY = "blackout-rp-rules-v1";
const CONTENT_VERSION_KEY = "blackout-rp-content-version";
const PIN = "2332";

function cloneRules() {
  return JSON.parse(JSON.stringify(defaultRules)) as Rule[];
}

export default function AdminNews() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"news" | "rules">("news");
  const [items, setItems] = useState<NewsItem[]>(defaultNews.map((item) => ({ ...item })));
  const [siteRules, setSiteRules] = useState<Rule[]>(cloneRules());
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<NewsItem>({
    date: new Date().toLocaleDateString("de-DE"),
    title: "",
    text: "",
    image: "/media/hero-blackout.webp"
  });

  useEffect(() => {
    try {
      const savedNews = localStorage.getItem(NEWS_STORAGE_KEY);
      const savedRules = localStorage.getItem(RULES_STORAGE_KEY);
      if (savedNews) setItems(JSON.parse(savedNews));
      if (savedRules) setSiteRules(JSON.parse(savedRules));
    } catch {}
  }, []);

  function login() {
    if (pin === PIN) {
      setUnlocked(true);
      setLoginError("");
      return;
    }
    setLoginError("Falscher Admin-PIN.");
  }

  function markChanged() {
    setDirty(true);
    setMessage("");
  }

  function updateNews(index: number, patch: Partial<NewsItem>) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
    markChanged();
  }

  function addNews() {
    if (!form.title.trim()) return;
    setItems((current) => [{ ...form }, ...current]);
    setForm((current) => ({ ...current, title: "", text: "" }));
    markChanged();
  }

  function removeNews(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    markChanged();
  }

  function updateRule(index: number, patch: Partial<Rule>) {
    setSiteRules((current) => current.map((rule, ruleIndex) => ruleIndex === index ? { ...rule, ...patch } : rule));
    markChanged();
  }

  function updateRuleItems(index: number, value: string) {
    updateRule(index, { items: value.split("\n").map((item) => item.trim()).filter(Boolean) });
  }

  function updateSection(ruleIndex: number, sectionIndex: number, title: string, items: string) {
    setSiteRules((current) => current.map((rule, currentRuleIndex) => {
      if (currentRuleIndex !== ruleIndex || !rule.sections) return rule;
      return {
        ...rule,
        sections: rule.sections.map((section, currentSectionIndex) => currentSectionIndex === sectionIndex
          ? { title, items: items.split("\n").map((item) => item.trim()).filter(Boolean) }
          : section)
      };
    }));
    markChanged();
  }

  function addRule() {
    setSiteRules((current) => [...current, {
      number: `§${current.length + 1}`,
      title: "Neue Regel",
      category: "Allgemeines",
      items: ["Regeltext hier eintragen."]
    }]);
    markChanged();
  }

  function removeRule(index: number) {
    setSiteRules((current) => current.filter((_, ruleIndex) => ruleIndex !== index));
    markChanged();
  }

  function publishChanges() {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(siteRules));
    localStorage.setItem(CONTENT_VERSION_KEY, String(Date.now()));
    setDirty(false);
    setMessage("Änderungen wurden veröffentlicht.");
  }

  function restoreDefaults() {
    setItems(defaultNews.map((item) => ({ ...item })));
    setSiteRules(cloneRules());
    markChanged();
  }

  if (!unlocked) {
    return (
      <main className="adminLogin">
        <img src="/media/brand-mark.webp" alt="Blackout RP" />
        <p className="eyebrow">GESCHÜTZTER BEREICH</p>
        <h1>INHALTS-ADMIN</h1>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && login()}
          placeholder="Admin-PIN"
          aria-label="Admin-PIN"
        />
        {loginError && <p className="adminError">{loginError}</p>}
        <button onClick={login}>ANMELDEN</button>
        <a href="/">Zurück zur Website</a>
      </main>
    );
  }

  return (
    <main className="adminPanel">
      <div className="adminHeader">
        <div><p>BLACKOUT RP</p><h1>Inhaltsverwaltung</h1><small>News und Serverregeln bearbeiten</small></div>
        <a href="/" target="_blank" rel="noreferrer">Website öffnen ↗</a>
      </div>

      <div className="adminTabs">
        <button className={activeTab === "news" ? "active" : ""} onClick={() => setActiveTab("news")}>NEWS</button>
        <button className={activeTab === "rules" ? "active" : ""} onClick={() => setActiveTab("rules")}>SERVERREGELN</button>
      </div>

      {activeTab === "news" && (
        <>
          <section className="adminEditor">
            <div className="adminSectionTitle"><div><p>NEUER EINTRAG</p><h2>News hinzufügen</h2></div></div>
            <div className="adminFormGrid">
              <label>Datum<input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} placeholder="Datum" /></label>
              <label>Bildpfad<input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="/media/bild.webp" /></label>
            </div>
            <label>Titel<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Titel" /></label>
            <label>Beschreibung<textarea value={form.text} onChange={(event) => setForm({ ...form, text: event.target.value })} placeholder="Beschreibung" /></label>
            <button onClick={addNews}>NEWS ZUM ENTWURF HINZUFÜGEN</button>
          </section>

          <section className="adminList adminNewsList">
            <div className="adminSectionTitle"><div><p>ENTWURF</p><h2>News bearbeiten</h2></div><span>{items.length} Einträge</span></div>
            {items.map((item, index) => (
              <article key={`${index}-${item.title}`}>
                <img src={item.image} alt="" />
                <div className="adminEntryFields">
                  <div className="adminFormGrid">
                    <label>Datum<input value={item.date} onChange={(event) => updateNews(index, { date: event.target.value })} /></label>
                    <label>Bildpfad<input value={item.image} onChange={(event) => updateNews(index, { image: event.target.value })} /></label>
                  </div>
                  <label>Titel<input value={item.title} onChange={(event) => updateNews(index, { title: event.target.value })} /></label>
                  <label>Beschreibung<textarea value={item.text} onChange={(event) => updateNews(index, { text: event.target.value })} /></label>
                </div>
                <button className="dangerButton" onClick={() => removeNews(index)}>Löschen</button>
              </article>
            ))}
          </section>
        </>
      )}

      {activeTab === "rules" && (
        <section className="adminList adminRulesList">
          <div className="adminSectionTitle"><div><p>REGELWERK</p><h2>Serverregeln bearbeiten</h2></div><button onClick={addRule}>+ REGEL HINZUFÜGEN</button></div>
          {siteRules.map((rule, ruleIndex) => (
            <article key={`${ruleIndex}-${rule.number}`}>
              <div className="ruleEditorTop">
                <label>Nummer<input value={rule.number} onChange={(event) => updateRule(ruleIndex, { number: event.target.value })} /></label>
                <label>Titel<input value={rule.title} onChange={(event) => updateRule(ruleIndex, { title: event.target.value })} /></label>
                <label>Kategorie<select value={rule.category} onChange={(event) => updateRule(ruleIndex, { category: event.target.value })}>
                  {ruleCategories.filter((item) => item !== "Alle").map((item) => <option key={item}>{item}</option>)}
                </select></label>
                <label className="checkboxLabel"><input type="checkbox" checked={Boolean(rule.important)} onChange={(event) => updateRule(ruleIndex, { important: event.target.checked })} /> Wichtig markieren</label>
              </div>

              {rule.items && (
                <label>Regelpunkte – ein Punkt pro Zeile
                  <textarea value={rule.items.join("\n")} onChange={(event) => updateRuleItems(ruleIndex, event.target.value)} />
                </label>
              )}

              {rule.sections?.map((section, sectionIndex) => (
                <div className="ruleSectionEditor" key={`${sectionIndex}-${section.title}`}>
                  <label>Abschnitt<input value={section.title} onChange={(event) => updateSection(ruleIndex, sectionIndex, event.target.value, section.items.join("\n"))} /></label>
                  <label>Regelpunkte – ein Punkt pro Zeile<textarea value={section.items.join("\n")} onChange={(event) => updateSection(ruleIndex, sectionIndex, section.title, event.target.value)} /></label>
                </div>
              ))}

              <button className="dangerButton" onClick={() => removeRule(ruleIndex)}>Regel löschen</button>
            </article>
          ))}
        </section>
      )}

      <div className="publishBar">
        <div><b>{dirty ? "Nicht veröffentlichte Änderungen" : "Alles veröffentlicht"}</b>{message && <span>{message}</span>}</div>
        <div className="publishActions"><button className="resetButton" onClick={restoreDefaults}>Standard wiederherstellen</button><button className="publishButton" disabled={!dirty} onClick={publishChanges}>ÄNDERUNGEN VERÖFFENTLICHEN</button></div>
      </div>
    </main>
  );
}
