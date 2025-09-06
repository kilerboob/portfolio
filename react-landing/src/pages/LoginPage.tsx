import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 gradient-text">{t("login")}</h1>
      <LoginForm onSuccess={() => navigate("/services", { replace: true })} />
    </div>
  );
}
