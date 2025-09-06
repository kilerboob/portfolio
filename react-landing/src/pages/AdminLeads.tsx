import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiGet } from '../lib/api';

type Lead = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

export default function AdminLeads() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Lead[]>("/api/leads")
      .then(setItems)
      .catch((e) => setError((e as Error).message));
  }, []);

  return (
    <div className="p-6">
  <h1 className="text-2xl font-bold mb-4">{t('leads')}</h1>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
      <th className="p-2">{t('date')}</th>
      <th className="p-2">{t('name')}</th>
  <th className="p-2">{t('email')}</th>
      <th className="p-2">{t('subject')}</th>
      <th className="p-2">{t('message')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-b align-top">
                <td className="p-2 whitespace-nowrap">{new Date(x.created_at).toLocaleString()}</td>
                <td className="p-2 whitespace-nowrap">{x.name}</td>
                <td className="p-2 whitespace-nowrap">{x.email}</td>
                <td className="p-2 whitespace-nowrap">{x.subject}</td>
                <td className="p-2 max-w-xl">
                  <div className="whitespace-pre-wrap break-words">{x.message}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
