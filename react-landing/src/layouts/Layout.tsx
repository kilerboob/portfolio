import { Outlet } from "react-router-dom";
import { Header } from "../shared/Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg text-fg transition-colors">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 text-center py-6 text-sm text-muted">
        2025 Portfolio
      </footer>
    </div>
  );
}
