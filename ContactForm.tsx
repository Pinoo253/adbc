"use client";

import { useState } from "react";
import { Send } from "lucide-react";

/** Membuka aplikasi email pengguna dengan pesan yang sudah terisi (tanpa server tambahan). */
export function ContactForm({ email }: { email: string | null }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const body = `${message}\n\n—\n${name}${from ? ` (${from})` : ""}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject || "Pesan dari website")}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">Nama</label>
          <input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Nama lengkap" />
        </div>
        <div>
          <label htmlFor="c-email" className="label">Email Anda</label>
          <input id="c-email" type="email" value={from} onChange={(e) => setFrom(e.target.value)} className="input" placeholder="nama@email.com" />
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="label">Subjek</label>
        <input id="c-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="input" placeholder="Kolaborasi, pertanyaan, dll." />
      </div>
      <div>
        <label htmlFor="c-msg" className="label">Pesan</label>
        <textarea id="c-msg" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="input resize-y" placeholder="Tulis pesan Anda…" />
      </div>
      <button type="submit" disabled={!email} className="btn btn-primary w-full sm:w-auto">
        Kirim lewat Email <Send className="h-4 w-4" />
      </button>
      {!email && <p className="text-xs text-amber-600">Email tujuan belum diatur oleh admin.</p>}
    </form>
  );
}
