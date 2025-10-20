'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
}

export default function GmailTable() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data.session;
        const accessToken = session?.provider_token;
        if (!accessToken) {
          throw new Error('No Google access token found — please sign in again.');
        }

        // Fetch latest Gmail messages directly
        const res = await fetch(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10',
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const list = await res.json();
        if (!list.messages) {
          setEmails([]);
          setLoading(false);
          return;
        }

        const detailed = await Promise.all(
          list.messages.map(async (m: any) => {
            const msg = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            ).then((r) => r.json());
            const headers = msg.payload.headers;
            const get = (n: string) =>
              headers.find((h: any) => h.name === n)?.value || '';
            return {
              id: m.id,
              from: get('From'),
              subject: get('Subject'),
              snippet: msg.snippet,
              date: get('Date'),
            };
          })
        );

        setEmails(detailed);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading emails...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (emails.length === 0) return <p className="p-4">No emails found.</p>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border text-sm border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">From</th>
            <th className="border px-3 py-2 text-left">Subject</th>
            <th className="border px-3 py-2 text-left">Snippet</th>
            <th className="border px-3 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((e) => (
            <tr key={e.id}>
              <td className="border px-3 py-1">{e.from}</td>
              <td className="border px-3 py-1">{e.subject}</td>
              <td className="border px-3 py-1">{e.snippet}</td>
              <td className="border px-3 py-1">{e.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
