import "./index.css";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 gradient-text">{t("app_name")}</h1>
  <p className="text-muted mb-8">{t("hero_tagline")}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/services" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet text-white font-medium shadow-xl shadow-black/30 transition-transform hover:scale-[1.02]">
            {t("services")}
          </a>
          <a href="/contact" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-card/50 hover:bg-card border border-white/10">
            {t("contact")}
          </a>
        </div>
      </div>
    </div>
  );
}

