import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 gradient-text">{t("register")}</h1>
      <RegisterForm onSuccess={() => navigate("/services", { replace: true })} />
    </div>
  );
}
