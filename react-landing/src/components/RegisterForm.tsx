import { useState } from "react";
import { useTranslation } from "react-i18next";
import { register, login, type Tokens } from "../api";

type Props = {
  onSuccess?: (tokens: Tokens) => void;
};

export default function RegisterForm({ onSuccess }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      // Сначала регистрация
      await register(email, password);
      // Потом авто-логин
      const tokens = await login(email, password);
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);
      onSuccess?.(tokens);
    } catch (err) {
      const msg = (err as Error)?.message || t("registrationFailed");
      setError(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label className="label">{t("email")}</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          placeholder={t("email")}
          title={t("email")}
        />
      </div>
      <div className="field">
        <label className="label">{t("password")}</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder={t("password")}
          title={t("password")}
        />
      </div>

  {error && <div className="error">{error}</div>}

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? t("registering") : t("register")}
      </button>
    </form>
  );
}
