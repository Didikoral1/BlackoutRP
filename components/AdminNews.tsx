"use client";

import { useEffect, useState } from "react";
import { news as defaultNews, type NewsItem } from "@/data/news";

const STORAGE_KEY = "blackout-rp-news-v2";
const PIN = "2407";

export default function AdminNews() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [items, setItems] = useState<NewsItem[]>(defaultNews);
  const [form, setForm] = useState<NewsItem>({
    date: new Date().toLocaleDateString("de-DE"),
    title: "",
    text: "",
    image: "/media/blackout-ai-hero.png"
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  function save(next: NewsItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  if (!unlocked) {
    return (
      <main className="adminLogin">
        <img src="/blackout-logo.png" alt="Blackout RP" />
        <h1>NEWS ADMIN</h1>
        <p>Standard-PIN: 2407 – ändere sie später in components/AdminNews.tsx.</p>
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Admin-PIN" />
        <button onClick={() => pin === PIN && setUnlocked(true)}>ANMELDEN</button>
        <a href="/">Zurück zur Website</a>
      </main>
    );
  }

  return (
    <main className="adminPanel">
      <div className="adminHeader"><div><p>BLACKOUT RP</p><h1>News-Verwaltung</h1></div><a href="/">Website öffnen</a></div>

      <section className="adminEditor">
        <h2>Neue News erstellen</h2>
        <input value={form.date} onChange={(e) => setForm({...form,date:e.target.value})} placeholder="Datum" />
        <input value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} placeholder="Titel" />
        <textarea value={form.text} onChange={(e) => setForm({...form,text:e.target.value})} placeholder="Beschreibung" />
        <input value={form.image} onChange={(e) => setForm({...form,image:e.target.value})} placeholder="Bild-URL" />
        <button onClick={() => {
          if (!form.title.trim()) return;
          save([form, ...items]);
          setForm({...form,title:"",text:""});
        }}>NEWS VERÖFFENTLICHEN</button>
      </section>

      <section className="adminList">
        <h2>Aktuelle Einträge</h2>
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`}>
            <img src={item.image} alt="" />
            <div><small>{item.date}</small><h3>{item.title}</h3><p>{item.text}</p></div>
            <button onClick={() => save(items.filter((_,i) => i !== index))}>Löschen</button>
          </article>
        ))}
        <button className="resetButton" onClick={() => save(defaultNews)}>Standard-News wiederherstellen</button>
      </section>
    </main>
  );
}
