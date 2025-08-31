import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import "./index.css";

type Theme = "light" | "dark";
const readTheme = (): Theme => (localStorage.getItem("theme") === "dark" ? "dark" : "light");
const applyTheme = (t: Theme) => {
  document.documentElement.classList.toggle("dark", t === "dark");
  localStorage.setItem("theme", t);
};

export default function App() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const { t, i18n } = useTranslation();

  useEffect(() => { applyTheme(theme); }, [theme]);

  return (
    <div className="page">
      <header className="header">
        <div className="container header-row">
          <div className="brand">React Landing</div>
          <div className="controls">
            <select
              className="select"
              defaultValue={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="ua">UA</option>
            </select>
            <button
              className="btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="container" style={{ textAlign: "center" }}>
            <h1>{t("welcome")}</h1>
            <p className="lead">{t("description")}</p>
            <div className="cta">
              <a className="btn btn-primary" href="https://github.com/kilerboob/portfolio" target="_blank">View on GitHub</a>
              <button className="btn" onClick={() => alert("Contact action")}>Contact</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container"> {new Date().getFullYear()} Portfolio</div>
      </footer>
    </div>
  );
}
