'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Check, X, Trash2, Loader2, ChevronDown, ChevronRight, User, Building2, Calendar, Send } from "lucide-react";
import { createClient } from '@/utils/supabase/client';

// Conversation interface - you'll need to create this table in Supabase
interface Conversation {
    id: number;
    ClientName: string | null;
    Company: string | null;
    LastMessage: string | null;
    LastResponse: string | null;
    Status: 'Pending' | 'Replied' | 'Waiting' | 'Closed' | null;
    LastContactDate: string | null;
    NextFollowUp: string | null;
}

const supabase = createClient();

export function FollowUpDiagram() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newConversation, setNewConversation] = useState<Partial<Conversation>>({
        ClientName: '',
        Company: '',
        LastMessage: '',
        LastResponse: '',
        Status: 'Pending',
        LastContactDate: new Date().toISOString().split('T')[0],
        NextFollowUp: ''
    });

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('conversation')
                .select('*')
                .order('LastContactDate', { ascending: false });

            if (error) throw error;
            setConversations(data || []);
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
        } finally {
            setLoading(false);
        }
    };

    const addConversation = async () => {
        try {
            const { data, error } = await supabase
                .from('conversation')
                .insert([newConversation])
                .select()
                .single();

            if (error) throw error;

            setConversations([data, ...conversations]);
            setIsAddingNew(false);
            setNewConversation({
                ClientName: '',
                Company: '',
                LastMessage: '',
                LastResponse: '',
                Status: 'Pending',
                LastContactDate: new Date().toISOString().split('T')[0],
                NextFollowUp: ''
            });
        } catch (err) {
            console.error('Error adding conversation:', err);
            setError(err instanceof Error ? err.message : 'Failed to add conversation');
        }
    };

    const updateConversation = async (id: number, updates: Partial<Conversation>) => {
        try {
            const { error } = await supabase
                .from('conversation')
                .update(updates)
                .eq('id', id);

            if (error) throw error;

            setConversations(conversations.map(conv =>
                conv.id === id ? { ...conv, ...updates } : conv
            ));
        } catch (err) {
            console.error('Error updating conversation:', err);
            setError(err instanceof Error ? err.message : 'Failed to update conversation');
        }
    };

    const deleteConversation = async (id: number) => {
        try {
            const { error } = await supabase
                .from('conversation')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setConversations(conversations.filter(c => c.id !== id));
        } catch (err) {
            console.error('Error deleting conversation:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete conversation');
        }
    };

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500';
            case 'Replied': return 'bg-green-500';
            case 'Waiting': return 'bg-blue-500';
            case 'Closed': return 'bg-gray-500';
            default: return 'bg-gray-400';
        }
    };

    const getStatusTextColor = (status: string | null) => {
        switch (status) {
            case 'Pending': return 'text-yellow-400';
            case 'Replied': return 'text-green-400';
            case 'Waiting': return 'text-blue-400';
            case 'Closed': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate stats
    const stats = {
        pending: conversations.filter(c => c.Status === 'Pending').length,
        replied: conversations.filter(c => c.Status === 'Replied').length,
        waiting: conversations.filter(c => c.Status === 'Waiting').length,
        closed: conversations.filter(c => c.Status === 'Closed').length,
    };

    if (loading) {
        return (
            <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-12 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-mono text-sm">LOADING CONVERSATIONS...</p>
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
                        onClick={fetchConversations}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-mono"
                    >
                        RETRY
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h2 className="text-foreground font-mono">CONVERSATION TRACKER</h2>
                            <div className="px-2 py-1 bg-primary/10 rounded text-xs font-mono text-primary">
                                {conversations.length}
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent ml-4" />
                        </div>

                        <button
                            onClick={() => setIsAddingNew(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-mono transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            NEW CONVERSATION
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-card/30 rounded-xl p-4 border border-yellow-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                <span className="text-xs font-mono text-muted-foreground">PENDING</span>
                            </div>
                            <div className="text-2xl font-mono text-yellow-400">{stats.pending}</div>
                        </div>
                        <div className="bg-card/30 rounded-xl p-4 border border-blue-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                <span className="text-xs font-mono text-muted-foreground">WAITING</span>
                            </div>
                            <div className="text-2xl font-mono text-blue-400">{stats.waiting}</div>
                        </div>
                        <div className="bg-card/30 rounded-xl p-4 border border-green-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                                <span className="text-xs font-mono text-muted-foreground">REPLIED</span>
                            </div>
                            <div className="text-2xl font-mono text-green-400">{stats.replied}</div>
                        </div>
                        <div className="bg-card/30 rounded-xl p-4 border border-gray-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                <span className="text-xs font-mono text-muted-foreground">CLOSED</span>
                            </div>
                            <div className="text-2xl font-mono text-gray-400">{stats.closed}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add New Conversation Form */}
            <AnimatePresence>
                {isAddingNew && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-card/20 backdrop-blur-xl border border-primary/30 rounded-2xl p-6"
                    >
                        <h3 className="text-foreground font-mono mb-4">NEW CONVERSATION</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Client Name"
                                value={newConversation.ClientName || ''}
                                onChange={(e) => setNewConversation({ ...newConversation, ClientName: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Company"
                                value={newConversation.Company || ''}
                                onChange={(e) => setNewConversation({ ...newConversation, Company: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <textarea
                                placeholder="Your last message..."
                                value={newConversation.LastMessage || ''}
                                onChange={(e) => setNewConversation({ ...newConversation, LastMessage: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                            />
                            <textarea
                                placeholder="Client's response..."
                                value={newConversation.LastResponse || ''}
                                onChange={(e) => setNewConversation({ ...newConversation, LastResponse: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <select
                                value={newConversation.Status || 'Pending'}
                                onChange={(e) => setNewConversation({ ...newConversation, Status: e.target.value as Conversation['Status'] })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Waiting">Waiting</option>
                                <option value="Replied">Replied</option>
                                <option value="Closed">Closed</option>
                            </select>
                            <input
                                type="date"
                                value={newConversation.LastContactDate || ''}
                                onChange={(e) => setNewConversation({ ...newConversation, LastContactDate: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="date"
                                placeholder="Next Follow-up"
                                value={newConversation.NextFollowUp || ''}
                                onChange={(e) => setNewConversation({ ...newConversation, NextFollowUp: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={addConversation}
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
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Conversation Flow Diagram */}
            <div className="space-y-4">
                {conversations.length === 0 ? (
                    <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-mono text-sm">NO CONVERSATIONS YET</p>
                        <p className="text-muted-foreground/60 font-mono text-xs mt-2">Start tracking your client conversations</p>
                    </div>
                ) : (
                    conversations.map((conv, index) => (
                        <motion.div
                            key={conv.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative"
                        >
                            {/* Connection Line */}
                            {index < conversations.length - 1 && (
                                <div className="absolute left-8 top-full w-0.5 h-4 bg-gradient-to-b from-primary/50 to-transparent z-0" />
                            )}

                            <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl overflow-hidden">
                                {/* Conversation Header */}
                                <div
                                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-card/30 transition-colors"
                                    onClick={() => setExpandedId(expandedId === conv.id ? null : conv.id)}
                                >
                                    {/* Status Indicator */}
                                    <div className={`w-4 h-4 rounded-full ${getStatusColor(conv.Status)} flex-shrink-0 shadow-lg`} />

                                    {/* Client Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-primary" />
                                            <span className="font-mono text-foreground">{conv.ClientName || 'Unknown'}</span>
                                            <span className="text-muted-foreground">•</span>
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-mono text-muted-foreground text-sm">{conv.Company || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`px-3 py-1 rounded-full text-xs font-mono ${getStatusTextColor(conv.Status)} bg-card/50 border border-current/20`}>
                                        {conv.Status?.toUpperCase() || 'UNKNOWN'}
                                    </div>

                                    {/* Last Contact */}
                                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(conv.LastContactDate)}
                                    </div>

                                    {/* Expand Icon */}
                                    {expandedId === conv.id ? (
                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {expandedId === conv.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-card-border/50"
                                        >
                                            <div className="p-4 space-y-4">
                                                {/* Message Flow */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Your Message */}
                                                    <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Send className="w-4 h-4 text-primary" />
                                                            <span className="text-xs font-mono text-primary">YOUR MESSAGE</span>
                                                        </div>
                                                        <p className="text-sm font-mono text-foreground">
                                                            {conv.LastMessage || 'No message recorded'}
                                                        </p>
                                                    </div>

                                                    {/* Client Response */}
                                                    <div className="bg-card/30 rounded-xl p-4 border border-card-border/50">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-xs font-mono text-muted-foreground">CLIENT RESPONSE</span>
                                                        </div>
                                                        <p className="text-sm font-mono text-foreground">
                                                            {conv.LastResponse || 'Awaiting response...'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Next Follow-up & Actions */}
                                                <div className="flex items-center justify-between pt-2 border-t border-card-border/30">
                                                    <div className="flex items-center gap-2 text-sm font-mono">
                                                        <Calendar className="w-4 h-4 text-primary" />
                                                        <span className="text-muted-foreground">Next Follow-up:</span>
                                                        <span className="text-foreground">{formatDate(conv.NextFollowUp)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={conv.Status || 'Pending'}
                                                            onChange={(e) => updateConversation(conv.id, { Status: e.target.value as Conversation['Status'] })}
                                                            className="bg-white dark:bg-zinc-800 border border-primary/30 rounded-lg px-2 py-1 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Waiting">Waiting</option>
                                                            <option value="Replied">Replied</option>
                                                            <option value="Closed">Closed</option>
                                                        </select>
                                                        <button
                                                            onClick={() => deleteConversation(conv.id)}
                                                            className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
