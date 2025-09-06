import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-extrabold mb-4 gradient-text">404</h1>
      <p className="text-muted mb-8">{t("not_found_message")}</p>
      <a href="/" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet text-white font-medium">
        {t("go_home")}
      </a>
    </div>
  );
}
