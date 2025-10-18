'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
  snippet: string;
}

interface Subscription {
  name: string;
  startDate: string;
  nextRenewal: string;
  link: string;
  senderEmail: string;
}

export default function SubscriptionsTable() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/gmail', {
        cache: 'no-store',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch emails');
      }

      const data = await response.json();
      
      if (!data.emails || data.emails.length === 0) {
        setError('No emails found. Please make sure you have granted Gmail access.');
        return;
      }
      
      setEmails(data.emails);
      
      // Parse subscriptions from emails
      const parsedSubscriptions = parseSubscriptions(data.emails);
      setSubscriptions(parsedSubscriptions);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const parseSubscriptions = (emails: Email[]): Subscription[] => {
    const subscriptionMap = new Map<string, Subscription>();

    emails.forEach(email => {
      const senderEmail = extractEmail(email.from);
      const text = `${email.subject} ${email.body} ${email.snippet}`.toLowerCase();
      
      // Check if it's a subscription-related email
      const isSubscription = 
        text.includes('subscription') ||
        text.includes('renewal') ||
        text.includes('membership') ||
        text.includes('billing') ||
        text.includes('invoice');

      if (isSubscription) {
        // Extract company name from sender
        const companyName = extractCompanyName(email.from);
        
        // Extract dates
        const dates = extractDates(email.body + email.snippet);
        
        // Extract links
        const links = extractLinks(email.body);
        
        const key = `${senderEmail}-${companyName}`;
        
        if (!subscriptionMap.has(key)) {
          subscriptionMap.set(key, {
            name: companyName,
            startDate: dates.startDate || formatDate(email.date),
            nextRenewal: dates.nextRenewal || 'N/A',
            link: links[0] || 'N/A',
            senderEmail: senderEmail,
          });
        }
      }
    });

    return Array.from(subscriptionMap.values());
  };

  const extractEmail = (from: string): string => {
    const match = from.match(/<(.+?)>/);
    return match ? match[1] : from;
  };

  const extractCompanyName = (from: string): string => {
    // Extract name before email
    const match = from.match(/^([^<]+)/);
    if (match) {
      return match[1].trim().replace(/"/g, '');
    }
    
    // Fallback to domain name
    const emailMatch = from.match(/@([^.]+)/);
    return emailMatch ? capitalizeFirst(emailMatch[1]) : 'Unknown';
  };

  const extractDates = (text: string): { startDate?: string; nextRenewal?: string } => {
    const dates: { startDate?: string; nextRenewal?: string } = {};
    
    // Look for renewal date patterns
    const renewalPatterns = [
      /renew(?:al|s)?\s+(?:on|date)?\s*:?\s*(\w+\s+\d{1,2},?\s+\d{4})/i,
      /next\s+(?:billing|payment|charge)\s+(?:date|on)?\s*:?\s*(\w+\s+\d{1,2},?\s+\d{4})/i,
      /(?:expires|expiry)\s+(?:on|date)?\s*:?\s*(\w+\s+\d{1,2},?\s+\d{4})/i,
    ];

    for (const pattern of renewalPatterns) {
      const match = text.match(pattern);
      if (match) {
        dates.nextRenewal = match[1];
        break;
      }
    }

    return dates;
  };

  const extractLinks = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s<>"]+)/g;
    const matches = text.match(urlRegex);
    return matches || [];
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-12"
      >
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-mono text-sm">SCANNING INBOX...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-red-400 font-mono text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            ERROR DETECTED
          </h3>
          <p className="text-red-300 text-sm mb-4 font-mono">{error}</p>
          {error.includes('Unauthorized') && (
            <p className="text-red-400/70 text-xs font-mono mb-4">
              → AUTHENTICATION REQUIRED: Please sign out and sign in again
            </p>
          )}
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchEmails();
            }}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-mono text-xs border border-red-500/40 transition-all"
          >
            RETRY SCAN
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Emails Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-primary" />
          <h2 className="text-foreground font-mono text-sm">EMAIL SURVEILLANCE</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <span className="text-xs font-mono text-muted-foreground">{emails.length} MESSAGES</span>
        </div>
        
        <div className="bg-card/10 backdrop-blur-sm border border-card-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-card-border bg-card/5">
                  <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    SENDER
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    SUBJECT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    DATE
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {emails.map((email, index) => (
                  <motion.tr 
                    key={email.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-mono">
                      {extractEmail(email.from)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {email.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                      {formatDate(email.date)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Subscriptions Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-foreground font-mono text-sm">SUBSCRIPTION TRACKER</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <span className="text-xs font-mono text-muted-foreground">{subscriptions.length} ACTIVE</span>
        </div>
        
        <div className="bg-card/10 backdrop-blur-sm border border-card-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-card-border bg-card/5">
                  <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    START DATE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    NEXT RENEWAL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    LINKS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    SENDER
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {subscriptions.length > 0 ? (
                  subscriptions.map((sub, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground font-mono">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                        {sub.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                        {sub.nextRenewal}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {sub.link !== 'N/A' ? (
                          <a 
                            href={sub.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono text-xs"
                          >
                            <LinkIcon className="w-3 h-3" />
                            VIEW
                          </a>
                        ) : (
                          <span className="text-muted-foreground/50 font-mono text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                        {sub.senderEmail}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground font-mono">
                      <div className="flex flex-col items-center gap-2">
                        <Calendar className="w-8 h-8 text-muted-foreground/30" />
                        <p>NO SUBSCRIPTIONS DETECTED</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}