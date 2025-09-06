import { useTranslation } from 'react-i18next';
import { useTheme } from '../providers/ThemeContext';

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="px-3 py-2 rounded-xl border border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
      title={t('theme') ?? 'Theme'}
      data-testid="theme-toggle"
    >
      {theme === 'dark' ? t('light') : t('dark')}
    </button>
  );
}
