import { useEffect, useRef, useState } from 'react';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

type Lang = { code: 'ru' | 'uk' | 'en'; label: string };

const LANGS: Lang[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
  { code: 'en', label: 'English' },
];

export default function LanguageDropdown() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(i18n.language as 'ru' | 'uk' | 'en');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const change = async (code: 'ru' | 'uk' | 'en') => {
    await i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    setCurrent(code);
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 rounded-xl border border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
  aria-haspopup="menu"
  aria-controls="lang-menu"
      >
        {t('language')}: {LANGS.find(l => l.code === current)?.label}
      </button>

      {open && (
        <div
          id="lang-menu"
          role="menu"
          className="absolute z-50 mt-2 w-48 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-white dark:bg-zinc-800 shadow-lg"
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              role="menuitem"
              onClick={() => change(l.code)}
              className={`w-full text-left px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 ${
                current === l.code ? 'font-semibold' : ''
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
