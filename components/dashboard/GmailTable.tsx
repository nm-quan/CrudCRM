'use client';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Briefcase, Calendar } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const supabase = createClient();

interface Job {
  id: string;
  position: string;
  company: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';
  dateApplied: string;
  lastUpdate: string;
}
interface GmailListMessage {
  id: string;
  threadId?: string;
}


/* ------------------------------------------------------------
   SEEK-only parser with cleanup for "Hi Chris" etc.
------------------------------------------------------------ */

function cleanCompanyName(company: string): string {
  return company
    .replace(/seek.*$/i, '') // remove trailing "seek ..." text
    .replace(/hi\s+[A-Z][a-z]+.*$/i, '') // remove "Hi Chris," or similar
    .replace(/thanks.*$/i, '')
    .replace(/[,.\-]+$/g, '') // remove trailing punctuation
    .trim();
}

function parseJobApplication(email: { subject: string; snippet: string; from: string; date: string }): Job | null {
  const combined = `${email.subject} ${email.snippet}`.replace(/\s+/g, ' ');

  const pattern =
    /application for\s+(.+?)\s+(?:was|has)\s+(?:successfully\s+)?submitted\s+to\s+([A-Z][a-zA-Z0-9&\-\s]+)/i;

  const m = combined.match(pattern);
  if (!m) return null;

  const position = m[1].trim();
  const company = cleanCompanyName(m[2]);

  const d = new Date(email.date);
  const iso = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();

  return {
    id: crypto.randomUUID(),
    position,
    company,
    status: 'Applied',
    dateApplied: iso,
    lastUpdate: iso,
  };
}

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */
export default function JobTrackingTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const accessToken = data.session?.provider_token;
        if (!accessToken) throw new Error('No Google access token found — please sign in again.');

        const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=35', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const list = await res.json();

        if (!list.messages) {
          setJobs([]);
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
            const get = (n: string) => headers.find((h: {name: string; value:string}) => h.name === n)?.value || '';
            return {
              id: m.id,
              from: get('From'),
              subject: get('Subject'),
              snippet: msg.snippet,
              date: get('Date'),
            };
          })
        );

        const parsedJobs = detailed
          .map(parseJobApplication)
          .filter((j): j is NonNullable<ReturnType<typeof parseJobApplication>> => !!j)
          .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime());

        setJobs(parsedJobs);
        
      } catch (err: unknown) {
        if (err instanceof Error){
        console.error(err);
        setError(err.message);}
      } finally {
        setLoading(false);
      }
    };

    fetchJobApplications();
  }, []);

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Interview':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Offer':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Rejected':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'Accepted':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const handleStatusChange = (jobId: string, newStatus: Job['status']) =>
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, status: newStatus, lastUpdate: new Date().toISOString() }
          : job
      )
    );

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === 'Applied').length,
    interview: jobs.filter((j) => j.status === 'Interview').length,
    offer: jobs.filter((j) => j.status === 'Offer').length,
  };

  if (loading) return <p className="p-4 text-gray-600">Loading job applications...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="bg-card/10 backdrop-blur-xl border border-border/20 rounded-2xl p-6 relative overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-foreground font-mono">JOB APPLICATIONS</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'TOTAL', value: stats.total, color: 'text-foreground' },
            { label: 'APPLIED', value: stats.applied, color: 'text-blue-500' },
            { label: 'INTERVIEWS', value: stats.interview, color: 'text-yellow-500' },
            { label: 'OFFERS', value: stats.offer, color: 'text-green-500' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="p-3 bg-card/20 rounded-xl border border-border/30"
            >
              <div className="text-xs font-mono text-muted-foreground mb-1">{s.label}</div>
              <div className={`text-2xl font-mono ${s.color}`}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-card/30 hover:bg-card/40 border-border/30">
                <TableHead className="font-mono text-muted-foreground">POSITION</TableHead>
                <TableHead className="font-mono text-muted-foreground">COMPANY</TableHead>
                <TableHead className="font-mono text-muted-foreground">STATUS</TableHead>
                <TableHead className="font-mono text-muted-foreground">APPLIED</TableHead>
                <TableHead className="font-mono text-muted-foreground">LAST UPDATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job, i) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="border-border/30 hover:bg-card/20 transition-colors"
                >
                  <TableCell className="font-mono text-foreground">{job.position}</TableCell>
                  <TableCell className="text-muted-foreground">{job.company}</TableCell>
                  <TableCell>
                    <Select
                      value={job.status}
                      onValueChange={(value) => handleStatusChange(job.id, value as Job['status'])}
                    >
                      <SelectTrigger className={`w-[130px] h-7 font-mono text-xs border-0 ${getStatusColor(job.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="w-3 h-3" />
                      {formatDate(job.dateApplied)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(job.lastUpdate)}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
