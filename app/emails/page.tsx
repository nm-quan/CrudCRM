// app/emails/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Email {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gmail');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch emails');
      }
      
      const data = await response.json();
      setEmails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading emails...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={fetchEmails}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Recent Emails</h1>
          <button
            onClick={fetchEmails}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
        
        {emails.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
            No emails found
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 flex-1">
                    {email.subject || '(No Subject)'}
                  </h2>
                  <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                    {email.date}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  From: {email.from}
                </p>
                
                <p className="text-gray-700">{email.snippet}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}