'use client';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calendar, RefreshCw, ExternalLink, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';

const supabase = createClient();

interface Subscription {
  id: string;
  name: string;
  startDate: string;
  nextRenewal: string;
  links: string[];
}
interface GmailListMessage {
  id: string;
  threadId?: string;
}
/* ------------------------------------------------------------
   Regex parser for subscription confirmations (e.g. Prime Video)
------------------------------------------------------------ */
function parseSubscriptionEmail(email: { subject: string; snippet: string; from: string; date: string }): Subscription | null {
  const combined = `${email.subject} ${email.snippet} ${email.from}`
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'") // normalize curly quotes
    .replace(/\s+/g, ' ')
    .toLowerCase();

  // 1️⃣ must mention "subscription"
  if (!combined.includes('subscription')) return null;

  // 2️⃣ detect likely service name
  let name: string | null = null;

  // Try subject-based extraction first (most reliable)
  const subjectMatch = email.subject.match(/welcome (?:to|back to|to your)\s+([A-Za-z0-9+&\-\s]+)/i);
  if (subjectMatch) name = subjectMatch[1].trim();

  // Fallback: detect "enjoying your X subscription"
  if (!name) {
    const enjoyMatch = combined.match(/enjoying your\s+([a-z0-9+&\-\s]+)\s+subscription/i);
    if (enjoyMatch) name = enjoyMatch[1].trim();
  }

  // Fallback: detect "your X subscription"
  if (!name) {
    const genericMatch = combined.match(/your\s+([a-z0-9+&\-\s]+)\s+subscription/i);
    if (genericMatch) name = genericMatch[1].trim();
  }

  // Fallback: brand from sender
  if (!name) {
    const fromMatch = email.from.match(/([A-Z][a-zA-Z0-9+&\-\s]+)/);
    if (fromMatch) name = fromMatch[1].trim();
  }

  if (!name) name = 'Unknown Subscription';

  // Dates
  const d = new Date(email.date);
  const iso = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();

  return {
    id: crypto.randomUUID(),
    name: name.replace(/\s+subscription$/i, '').trim(),
    startDate: iso,
    nextRenewal: new Date(new Date(iso).setFullYear(new Date(iso).getFullYear() + 1)).toISOString(),
    links: [],
  };
}


/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */
export default function SubscriptionTracker() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const accessToken = data.session?.provider_token;
        if (!accessToken) throw new Error('No Google access token found — please sign in again.');

        const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=25', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const list = await res.json();
        if (!list.messages) {
          setSubscriptions([]);
          setLoading(false);
          return;
        }

        const detailed = await Promise.all(
          list.messages.map(async (m: GmailListMessage) => {
            const msg = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            ).then((r) => r.json());

            const headers = msg.payload.headers;
            const get = (n: string) => headers.find((h: {name:string, value:string}) => h.name === n)?.value || '';
            return {
              id: m.id,
              from: get('From'),
              subject: get('Subject'),
              snippet: msg.snippet,
              date: get('Date'),
            };
          })
        );

        const parsed = detailed
          .map(parseSubscriptionEmail)
          .filter((s): s is NonNullable<ReturnType<typeof parseSubscriptionEmail>> => !!s)
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

        setSubscriptions(parsed);
      } catch (err: unknown) {
        if (err instanceof Error){
        console.error(err);
        setError(err.message);
      }} finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRenewalStatus = (renewalDate: string) => {
    const days = getDaysUntilRenewal(renewalDate);
    if (days < 0) return { text: 'Expired', color: 'text-red-500' };
    if (days < 30) return { text: `${days} days`, color: 'text-yellow-500' };
    return { text: `${days} days`, color: 'text-green-500' };
  };

  if (loading) return <p className="p-4 text-gray-600">Loading subscriptions...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-foreground font-mono">SUBSCRIPTIONS</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
            </div>

            <div className="rounded-xl border border-border/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-card/30 hover:bg-card/40 border-border/30">
                    <TableHead className="font-mono text-muted-foreground">SERVICE</TableHead>
                    <TableHead className="font-mono text-muted-foreground">START DATE</TableHead>
                    <TableHead className="font-mono text-muted-foreground">NEXT RENEWAL</TableHead>
                    <TableHead className="font-mono text-muted-foreground">LINKS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub, index) => {
                    const renewal = getRenewalStatus(sub.nextRenewal);
                    return (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-border/30 hover:bg-card/20 transition-colors"
                      >
                        <TableCell className="font-mono text-foreground">{sub.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(sub.startDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{formatDate(sub.nextRenewal)}</span>
                            <span className={`text-sm font-mono ${renewal.color}`}>({renewal.text})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {sub.links.length === 0 && (
                              <span className="text-xs text-muted-foreground italic">No links found</span>
                            )}
                            {sub.links.map((link, i) => (
                              <Button
                                key={i}
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs hover:bg-primary/10"
                                asChild
                              >
                                <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  Link {i + 1}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-card/20 rounded-xl border border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">TOTAL SUBSCRIPTIONS</span>
                  <span className="text-2xl font-mono text-foreground">{subscriptions.length}</span>
                </div>
              </div>
              <div className="p-4 bg-card/20 rounded-xl border border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">RENEWING SOON</span>
                  <span className="text-2xl font-mono text-yellow-500">
                    {subscriptions.filter(s => {
                      const days = getDaysUntilRenewal(s.nextRenewal);
                      return days > 0 && days < 30;
                    }).length}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-card/20 rounded-xl border border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">ACTIVE</span>
                  <span className="text-2xl font-mono text-green-500">
                    {subscriptions.filter(s => getDaysUntilRenewal(s.nextRenewal) > 0).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
