'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from './ThemeProvider';
import { Search, Plus, Briefcase, Check, X, Edit3, ChevronUp, ChevronDown, Trash2, Loader2, ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from '@/utils/supabase/client';

// Job Application interface - you'll need to create this table in Supabase
interface JobApplication {
    id: number;
    Position: string | null;
    Company: string | null;
    Status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | null;
    DateApplied: string | null;
    Link: string | null;
}

const supabase = createClient();

export function JobApplicationsTable() {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<{ jobId: number, field: string } | null>(null);
    const [editValue, setEditValue] = useState('');
    const [sortField, setSortField] = useState<string>('DateApplied');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [syncStatus, setSyncStatus] = useState<'connected' | 'offline' | 'loading'>('loading');
    const [newJob, setNewJob] = useState<Partial<JobApplication>>({
        Position: '',
        Company: '',
        Status: 'Applied',
        DateApplied: new Date().toISOString().split('T')[0],
        Link: ''
    });

    // Fetch jobs from Supabase
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            setSyncStatus('loading');

            const { data, error } = await supabase
                .from('job_application')
                .select('*')
                .order('id', { ascending: false });

            if (error) {
                console.log('Job application table issue:', error.message);
                setSyncStatus('offline');
                // Keep existing jobs if any, or empty
                if (jobs.length === 0) setJobs([]);
                return;
            }

            setSyncStatus('connected');
            setJobs(data || []);
        } catch (err) {
            console.log('Connection error');
            setSyncStatus('offline');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'Applied': return 'text-blue-400';
            case 'Interview': return 'text-yellow-400';
            case 'Offer': return 'text-green-400';
            case 'Rejected': return 'text-red-400';
            default: return 'text-muted-foreground';
        }
    };

    const getStatusDot = (status: string | null) => {
        switch (status) {
            case 'Applied': return 'bg-blue-400';
            case 'Interview': return 'bg-yellow-400';
            case 'Offer': return 'bg-green-400';
            case 'Rejected': return 'bg-red-400';
            default: return 'bg-muted-foreground';
        }
    };

    const filteredAndSortedJobs = jobs
        .filter(job =>
            (job.Position?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (job.Company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';

            switch (sortField) {
                case 'Position':
                    aValue = a.Position || '';
                    bValue = b.Position || '';
                    break;
                case 'Company':
                    aValue = a.Company || '';
                    bValue = b.Company || '';
                    break;
                case 'Status':
                    aValue = a.Status || '';
                    bValue = b.Status || '';
                    break;
                case 'DateApplied':
                    aValue = a.DateApplied ? new Date(a.DateApplied).getTime() : 0;
                    bValue = b.DateApplied ? new Date(b.DateApplied).getTime() : 0;
                    break;
                default:
                    aValue = a.DateApplied ? new Date(a.DateApplied).getTime() : 0;
                    bValue = b.DateApplied ? new Date(b.DateApplied).getTime() : 0;
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    // Calculate stats from ALL jobs
    const stats = {
        applied: jobs.filter(j => j.Status === 'Applied').length,
        interview: jobs.filter(j => j.Status === 'Interview').length,
        offer: jobs.filter(j => j.Status === 'Offer').length,
        rejected: jobs.filter(j => j.Status === 'Rejected').length,
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const startEdit = (jobId: number, field: string, currentValue: string | null) => {
        setEditingCell({ jobId, field });
        setEditValue(currentValue || '');
    };

    const saveEdit = async () => {
        if (!editingCell) return;

        try {
            const { error } = await supabase
                .from('job_application')
                .update({ [editingCell.field]: editValue })
                .eq('id', editingCell.jobId);

            if (error) {
                console.log('Updating job locally (table may not exist):', error.message);
            }

            // Always update local state
            setJobs(jobs.map(job =>
                job.id === editingCell.jobId
                    ? { ...job, [editingCell.field]: editValue }
                    : job
            ));
        } catch (err) {
            console.log('Updating job locally (error)');
            // Still update local state
            setJobs(jobs.map(job =>
                job.id === editingCell.jobId
                    ? { ...job, [editingCell.field]: editValue }
                    : job
            ));
        } finally {
            setEditingCell(null);
            setEditValue('');
        }
    };

    const cancelEdit = () => {
        setEditingCell(null);
        setEditValue('');
    };

    const addNewJob = async () => {
        try {
            const { data, error } = await supabase
                .from('job_application')
                .insert([newJob])
                .select()
                .single();

            if (error) {
                // Table doesn't exist - add locally with temp ID
                console.log('Adding job locally (table may not exist):', error.message);
                const tempJob: JobApplication = {
                    id: Date.now(), // Use timestamp as temp ID
                    Position: newJob.Position || null,
                    Company: newJob.Company || null,
                    Status: newJob.Status || 'Applied',
                    DateApplied: newJob.DateApplied || null,
                    Link: newJob.Link || null
                };
                setJobs([tempJob, ...jobs]);
            } else {
                setJobs([data, ...jobs]);
            }

            setIsAddingNew(false);
            setNewJob({
                Position: '',
                Company: '',
                Status: 'Applied',
                DateApplied: new Date().toISOString().split('T')[0],
                Link: ''
            });
        } catch (err) {
            console.log('Adding job locally (error)');
            const tempJob: JobApplication = {
                id: Date.now(),
                Position: newJob.Position || null,
                Company: newJob.Company || null,
                Status: newJob.Status || 'Applied',
                DateApplied: newJob.DateApplied || null,
                Link: newJob.Link || null
            };
            setJobs([tempJob, ...jobs]);
            setIsAddingNew(false);
            setNewJob({
                Position: '',
                Company: '',
                Status: 'Applied',
                DateApplied: new Date().toISOString().split('T')[0],
                Link: ''
            });
        }
    };

    const deleteSelectedJobs = async () => {
        if (selectedIds.size === 0) return;

        try {
            const { error } = await supabase
                .from('job_application')
                .delete()
                .in('id', Array.from(selectedIds));

            if (error) {
                console.log('Deleting jobs locally (table may not exist):', error.message);
            }

            // Always update local state
            setJobs(jobs.filter(j => !selectedIds.has(j.id)));
            setSelectedIds(new Set());
        } catch (err) {
            console.log('Deleting jobs locally (error)');
            setJobs(jobs.filter(j => !selectedIds.has(j.id)));
            setSelectedIds(new Set());
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredAndSortedJobs.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredAndSortedJobs.map(j => j.id)));
        }
    };

    const renderEditableCell = (
        job: JobApplication,
        field: keyof JobApplication,
        value: string | null,
        className: string = ''
    ) => {
        const isEditing =
            editingCell?.jobId === job.id && editingCell?.field === field;

        if (isEditing) {
            return (
                <div className="flex items-center gap-1">
                    {field === 'Status' ? (
                        <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-800 border-2 border-primary rounded px-2 py-1 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            autoFocus
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    ) : field === 'DateApplied' ? (
                        <input
                            type="date"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-800 border-2 border-primary rounded px-2 py-1 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            autoFocus
                        />
                    ) : (
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-800 border-2 border-primary rounded px-2 py-1 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') cancelEdit();
                            }}
                            autoFocus
                        />
                    )}
                    <button onClick={saveEdit} className="text-green-400 hover:text-green-300 p-1">
                        <Check className="w-3 h-3" />
                    </button>
                    <button onClick={cancelEdit} className="text-red-400 hover:text-red-300 p-1">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            );
        }

        const displayValue = field === 'DateApplied' ? formatDate(value) : (value || 'N/A');

        return (
            <div
                className={`group cursor-pointer hover:bg-card/20 rounded px-2 py-1 transition-colors flex items-center gap-2 ${className}`}
                onClick={() => startEdit(job.id, field, value)}
            >
                <span className="font-mono text-foreground">{displayValue}</span>
                <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-12 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-mono text-sm">LOADING JOB APPLICATIONS...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-card/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-red-400 font-mono text-sm">ERROR: {error}</p>
                    <button
                        onClick={fetchJobs}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-mono"
                    >
                        RETRY
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="p-6 border-b border-card-border/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <h2 className="text-foreground font-mono">JOB APPLICATIONS</h2>
                            <div className="px-2 py-1 bg-primary/10 rounded text-xs font-mono text-primary">
                                {filteredAndSortedJobs.length}
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent ml-4" />
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Refresh Button */}
                            <button
                                onClick={fetchJobs}
                                disabled={loading}
                                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg text-sm font-mono transition-all duration-200"
                                title="Refresh from database"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>

                            {/* Delete Selected Button */}
                            {selectedIds.size > 0 && (
                                <button
                                    onClick={deleteSelectedJobs}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-mono transition-all duration-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    DELETE ({selectedIds.size})
                                </button>
                            )}

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/70" />
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 w-64 bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg text-sm font-mono text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                />
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={() => setIsAddingNew(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-mono transition-all duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                ADD JOB
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add New Job Form */}
                <AnimatePresence>
                    {isAddingNew && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-b border-card-border/50 bg-primary/5"
                        >
                            <div className="p-4 grid grid-cols-6 gap-4">
                                <input
                                    type="text"
                                    placeholder="Position"
                                    value={newJob.Position || ''}
                                    onChange={(e) => setNewJob({ ...newJob, Position: e.target.value })}
                                    className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={newJob.Company || ''}
                                    onChange={(e) => setNewJob({ ...newJob, Company: e.target.value })}
                                    className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <select
                                    value={newJob.Status || 'Applied'}
                                    onChange={(e) => setNewJob({ ...newJob, Status: e.target.value as JobApplication['Status'] })}
                                    className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Job Link"
                                    value={newJob.Link || ''}
                                    onChange={(e) => setNewJob({ ...newJob, Link: e.target.value })}
                                    className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="flex gap-2 col-span-2">
                                    <button
                                        onClick={addNewJob}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-mono"
                                    >
                                        <Check className="w-4 h-4" />
                                        SAVE
                                    </button>
                                    <button
                                        onClick={() => setIsAddingNew(false)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-mono"
                                    >
                                        <X className="w-4 h-4" />
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table Container with Fixed Header */}
                <div className="relative max-h-[50vh] overflow-hidden border border-card-border/50 rounded-lg">
                    {/* Fixed Table Header */}
                    <div className="sticky top-0 z-20 bg-card/60 backdrop-blur-md border-b-2 border-primary/50 shadow-lg">
                        <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_80px] px-6 py-4 text-xs font-mono text-primary uppercase tracking-wider">
                            {/* Select All Checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.size === filteredAndSortedJobs.length && filteredAndSortedJobs.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-2 border-primary/50 bg-transparent checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/50 cursor-pointer"
                                />
                            </div>
                            <button
                                onClick={() => handleSort('Position')}
                                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4"
                            >
                                POSITION
                                {sortField === 'Position' && (
                                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('Company')}
                                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4 pl-4"
                            >
                                COMPANY
                                {sortField === 'Company' && (
                                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('Status')}
                                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4 pl-4"
                            >
                                STATUS
                                {sortField === 'Status' && (
                                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('DateApplied')}
                                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pl-4"
                            >
                                DATE APPLIED
                                {sortField === 'DateApplied' && (
                                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                )}
                            </button>
                            <div className="flex items-center pl-4">LINK</div>
                        </div>
                    </div>

                    {/* Scrollable Table Body */}
                    <div className="overflow-y-auto max-h-[calc(50vh-60px)]">
                        <AnimatePresence>
                            {filteredAndSortedJobs.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground font-mono text-sm">NO JOB APPLICATIONS FOUND</p>
                                    <p className="text-muted-foreground/60 font-mono text-xs mt-2">Add your first job application to get started</p>
                                </div>
                            ) : (
                                filteredAndSortedJobs.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.02 }}
                                        className={`grid grid-cols-[40px_1fr_1fr_1fr_1fr_80px] px-6 py-4 text-sm border-b border-card-border/30 transition-all duration-200 ${selectedIds.has(job.id)
                                            ? 'bg-primary/10'
                                            : index % 2 === 0
                                                ? 'bg-card/5 hover:bg-card/15'
                                                : 'bg-card/10 hover:bg-card/20'
                                            }`}
                                    >
                                        {/* Checkbox */}
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(job.id)}
                                                onChange={() => toggleSelect(job.id)}
                                                className="w-4 h-4 rounded border-2 border-primary/50 bg-transparent checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/50 cursor-pointer"
                                            />
                                        </div>

                                        {/* Position */}
                                        <div className="flex items-center border-r border-card-border/50 pr-4">
                                            {renderEditableCell(job, 'Position', job.Position)}
                                        </div>

                                        {/* Company */}
                                        <div className="flex items-center border-r border-card-border/50 pr-4 pl-4">
                                            {renderEditableCell(job, 'Company', job.Company)}
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-2 border-r border-card-border/50 pr-4 pl-4">
                                            <div className={`w-2 h-2 rounded-full ${getStatusDot(job.Status)} flex-shrink-0`} />
                                            {renderEditableCell(job, 'Status', job.Status, `${getStatusColor(job.Status)} text-xs uppercase`)}
                                        </div>

                                        {/* Date Applied */}
                                        <div className="flex items-center border-r border-card-border/50 pl-4">
                                            {renderEditableCell(job, 'DateApplied', job.DateApplied, 'text-muted-foreground')}
                                        </div>

                                        {/* Link */}
                                        <div className="flex items-center pl-4">
                                            {job.Link ? (
                                                <a
                                                    href={job.Link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-primary/70 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Open job link"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground/40 text-xs">—</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-card-border/50 bg-card/10">
                    <div className="flex items-center justify-between text-xs font-mono">
                        <div className="text-muted-foreground">
                            SHOWING {filteredAndSortedJobs.length} OF {jobs.length} APPLICATIONS
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-muted-foreground">APPLIED {stats.applied}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <span className="text-muted-foreground">INTERVIEW {stats.interview}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-muted-foreground">OFFER {stats.offer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                <span className="text-muted-foreground">REJECTED {stats.rejected}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
