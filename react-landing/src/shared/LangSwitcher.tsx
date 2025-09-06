import { useTranslation } from "react-i18next";

export function LangSwitcher() {
	const { i18n } = useTranslation();
	const toggle = () => {
		const next = i18n.language === "ru" ? "en" : "ru";
		i18n.changeLanguage(next);
		try { localStorage.setItem("app.lang", next); } catch { /* ignore */ }
	};
	return (
		<button
			onClick={toggle}
			className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
			title="Сменить язык"
		>
			{i18n.language.toUpperCase()}
		</button>
	);
}

