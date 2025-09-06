import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "../components/LanguageDropdown";
import ThemeToggle from "../components/ThemeToggle";

export function Header() {
	const { t } = useTranslation();
	return (
	<header className="sticky top-0 z-50 backdrop-blur bg-card/30 border-b border-white/10">
			<div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
				<Link to="/" className="font-extrabold">
					<span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
						{t("app_name")}
					</span>
				</Link>
						<nav className="flex items-center gap-4 text-sm text-muted">
					<NavLink to="/services" className={({isActive})=>isActive?"text-fg":"text-muted"}>{t("services")}</NavLink>
					<NavLink to="/contact"  className={({isActive})=>isActive?"text-fg":"text-muted"}>{t("contact")}</NavLink>
							<NavLink to="/login"    className="text-muted">{t("login")}</NavLink>
							<NavLink to="/register" className="text-muted">{t("register")}</NavLink>

					<LanguageDropdown />
					<ThemeToggle />

				<a
									href="https://t.me/FullstackSashkaBot"
									target="_blank" rel="noreferrer noopener"
			className="px-3 py-1 rounded-lg bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet text-white"
					>
						{t("telegram")}
					</a>
				</nav>
			</div>
		</header>
	);
}

