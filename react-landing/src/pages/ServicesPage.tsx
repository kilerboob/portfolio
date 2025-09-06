import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiGet, apiPost, type Service } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function ServicesPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
      apiGet<Service[]>("/api/services")
        .then((data) => { if (alive) setItems(data); })
        .catch((e) => { if (alive) setError((e as Error)?.message || t('error_loading')); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [t]);

  const skeleton = (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-panel card-hover h-56 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div>
      <div className="py-16">
  <h1 className="text-4xl md:text-5xl font-extrabold mb-10 gradient-text">{t("services")}</h1>
        {loading && skeleton}
  {error && <p className="text-red-400">{t("error")}: {error}</p>}
        {!loading && !error && (
          <>
            {items.length === 0 ? (
              <div className="glass-panel p-10 text-center">
    <p className="text-muted mb-6">{t("services_empty_note")}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a href="/contact" className="inline-flex items-center justify-center px-5 py-3 rounded-xl 
                  bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet text-white font-medium shadow-xl shadow-black/30 
                  transition-transform hover:scale-[1.02]">
        {t("contact_action")}
                  </a>
                  <a
                    href="https://t.me/FullstackSashkaBot?start=from_services_empty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-card/50 hover:bg-card border border-white/10"
                  >
        {t("open_telegram")}
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                  {items.map((s, idx) => (
                    <motion.article
                      key={s.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      className="glass-panel card-hover p-5"
                    >
                      {(() => {
                        const title = t(`services_catalog.${s.slug}.title`, { defaultValue: s.title });
                        const summary = s.summary ? t(`services_catalog.${s.slug}.summary`, { defaultValue: s.summary }) : null;
                        return (
                          <>
                            <h2 className="text-xl font-semibold mb-2">{title}</h2>
                            {summary && (
                              <p className="text-muted mb-3 line-clamp-3">{summary}</p>
                            )}
                          </>
                        );
                      })()}
                      <div className="text-sm text-muted space-y-1">
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await apiPost("/api/contact", {
                                  name: t("site"),
                                  email: "lead@site.local",
                                  subject: `${t("lead_subject")}: ${s.title}`,
                                  message: `${t("lead_interest")}: ${s.slug}`,
                                  source: "services_page",
                                  utm: { service: s.slug }
                                });
                                alert(t("lead_sent"));
                              } catch (e) {
                                alert(t("lead_failed") + ": " + (e as Error).message);
                              }
                            }}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet hover:opacity-95"
                          >
                            {t("leave_request")}
                          </button>
                          <a
                            href={`https://t.me/FullstackSashkaBot?start=lead_${s.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-card/50 hover:bg-card border border-white/10"
                          >
                            {t("telegram")}
                          </a>
                        </div>
                        {s.delivery_days ? <div>{t("delivery_term")}: {s.delivery_days} {t("days_short")}.</div> : null}
                      </div>
                      <a href="/contact" className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-card/50 hover:bg-card border border-white/10">{t("contact_action")}</a>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
