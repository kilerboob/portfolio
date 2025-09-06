// Современная навигация: sticky + blur + градиентные hover
import theme from "../theme";
import { useTranslation } from "react-i18next";

export default function Nav() {
  const { t } = useTranslation();
  const { useTheme } = theme;
  const { theme: cur, toggle } = useTheme();
  const linkClass =
    "relative px-3 py-2 rounded-lg transition-colors duration-300 text-gray-300 hover:text-white " +
    "hover:bg-gradient-to-r hover:from-brand-blue/20 hover:via-brand-cyan/20 hover:to-brand-violet/20";
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[#0b0f19]/70 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-bold gradient-text text-lg">{t("app_name")}</a>
        <nav className="flex items-center gap-2 text-sm">
          <a href="/services" className={linkClass}>{t("services")}</a>
          <a href="/contact" className={linkClass}>{t("contact")}</a>
          <a href="/login" className={linkClass}>{t("login")}</a>
          <a href="/register" className={linkClass}>{t("register")}</a>
          <button onClick={toggle} className="ml-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white border border-white/10 hover:bg-white/5">
            {cur === "dark" ? t("dark") : t("light")}
          </button>
          <a
            href="https://t.me/FullstackSashkaBot"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet text-white shadow-lg shadow-black/30 hover:opacity-95"
            aria-label={t("open_telegram")}
          >
            {t("telegram")}
          </a>
        </nav>
      </div>
    </header>
  );
}
