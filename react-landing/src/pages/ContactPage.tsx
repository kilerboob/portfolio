import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiPost } from "../lib/api";
import { motion } from "framer-motion";

type Form = { name: string; email: string; subject: string; message: string; source?: string; utm?: string };
const initial: Form = { name: "", email: "", subject: "", message: "", source: "contact_page" };

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<Form>(initial);
  const [status, setStatus] = useState<null | { kind: "ok" | "err"; msg: string }>(null);
  const [busy, setBusy] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    // простая валидация
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus({ kind: "err", msg: t("fill_all_fields") });
      return;
    }
    setBusy(true);
    setStatus({ kind: "ok", msg: t("sending") });
    try {
  // enrich payload with UTM map if present in URL
  const params = new URLSearchParams(window.location.search);
  const utmEntries = Array.from(params.entries());
  const utm = utmEntries.length ? Object.fromEntries(utmEntries) : undefined;
  await apiPost("/api/contact", { ...form, utm });
  setStatus({ kind: "ok", msg: t("message_sent") });
      setForm(initial);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus({ kind: "err", msg });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 gradient-text">{t("contact")}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
     <input name="name" placeholder={t("your_name")} value={form.name} onChange={onChange}
                 className="w-full p-3 rounded-2xl bg-card/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
     <input name="email" type="email" placeholder={t("email")} value={form.email} onChange={onChange}
                 className="w-full p-3 rounded-2xl bg-card/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
     <input name="subject" placeholder={t("subject")} value={form.subject} onChange={onChange}
                 className="w-full p-3 rounded-2xl bg-card/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          <textarea name="message" placeholder={t("message")} value={form.message} onChange={onChange}
                    className="w-full p-3 rounded-2xl bg-card/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 h-40" required />
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            disabled={busy}
            className="w-full py-3 rounded-xl font-medium disabled:opacity-60 disabled:cursor-not-allowed
              bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet shadow-xl shadow-black/30"
          >
            {busy ? t("sending") : t("send")}
          </motion.button>
        </form>
        {status && (
          <div className="mt-4">
            <p className={`text-sm ${status.kind === "ok" ? "text-green-400" : "text-red-400"}`}>
              {status.msg}
            </p>
            {status.kind === "ok" && (
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://t.me/FullstackSashkaBot?start=from_contact_success"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-card/50 hover:bg-card border border-white/10"
                >
                  {t("open_telegram")}
                </a>
                <a
                  href="/services"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet"
                >
                  {t("back_to_services")}
                </a>
              </div>
            )}
          </div>
        )}
  <p className="mt-6 text-xs text-muted">{t("we_will_contact_24h")}</p>
  </div>
  );
}
