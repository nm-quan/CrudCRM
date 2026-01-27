'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from './ThemeProvider';
import {
    MessageSquare, Plus, Check, X, Edit3, Trash2, Loader2,
    Mail, Send, User, Building2, ArrowRight, Sparkles,
    ChevronDown, ChevronUp, Copy, RefreshCw
} from "lucide-react";
import { createClient } from '@/utils/supabase/client';

interface ConversationNode {
    id: number;
    ClientName: string | null;
    Company: string | null;
    Context: string | null;
    Stage: 'Initial' | 'FollowUp1' | 'FollowUp2' | 'FollowUp3' | 'Closed' | null;
    LastContactDate: string | null;
    Notes: string | null;
    DraftEmail: string | null;
}

const supabase = createClient();

// Simple email templates based on stage
const emailTemplates: Record<string, (context: ConversationNode) => string> = {
    'Initial': (ctx) => `Hi ${ctx.ClientName || '[Name]'},

I hope this email finds you well. I'm reaching out regarding ${ctx.Context || '[your inquiry/our previous discussion]'}.

${ctx.Notes ? `Based on our notes: ${ctx.Notes}` : 'I would love to discuss how we can work together.'}

Looking forward to hearing from you.

Best regards`,

    'FollowUp1': (ctx) => `Hi ${ctx.ClientName || '[Name]'},

I wanted to follow up on my previous email regarding ${ctx.Context || '[our discussion]'}.

${ctx.Notes ? `Quick update: ${ctx.Notes}` : 'I understand you might be busy, but I wanted to check if you had any questions.'}

Would you have time for a brief call this week?

Best regards`,

    'FollowUp2': (ctx) => `Hi ${ctx.ClientName || '[Name]'},

I'm circling back one more time about ${ctx.Context || '[our conversation]'}.

${ctx.Notes ? `To recap: ${ctx.Notes}` : 'I believe there\'s a great opportunity for us to collaborate.'}

Please let me know if you'd like to reconnect or if your priorities have shifted.

Best regards`,

    'FollowUp3': (ctx) => `Hi ${ctx.ClientName || '[Name]'},

I haven't heard back and wanted to send a final check-in about ${ctx.Context || '[our previous discussions]'}.

${ctx.Notes ? `Final note: ${ctx.Notes}` : 'If timing isn\'t right, I completely understand.'}

Feel free to reach out whenever you're ready.

Best regards`,

    'Closed': (ctx) => `Hi ${ctx.ClientName || '[Name]'},

Thank you for your time and consideration regarding ${ctx.Context || '[our discussions]'}.

${ctx.Notes ? `Summary: ${ctx.Notes}` : 'It was great connecting with you.'}

Best wishes for your future endeavors.

Best regards`
};

export function EmailFlowDiagram() {
    const { theme } = useTheme();
    const [nodes, setNodes] = useState<ConversationNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingNode, setEditingNode] = useState<ConversationNode | null>(null);
    const [generatingEmail, setGeneratingEmail] = useState<number | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const [newNode, setNewNode] = useState<Partial<ConversationNode>>({
        ClientName: '',
        Company: '',
        Context: '',
        Stage: 'Initial',
        Notes: '',
        LastContactDate: new Date().toISOString().split('T')[0],
        DraftEmail: ''
    });

    useEffect(() => {
        fetchNodes();
    }, []);

    const fetchNodes = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from('email_flow')
                .select('*')
                .order('id', { ascending: true });

            // If table doesn't exist or other error, just show empty state
            if (error) {
                console.log('Email flow table may not exist:', error.message);
                setNodes([]);
                return;
            }
            setNodes(data || []);
        } catch (err) {
            console.log('Using empty state for email flow table');
            setNodes([]);
        } finally {
            setLoading(false);
        }
    };

    const addNode = async () => {
        try {
            const { data, error } = await supabase
                .from('email_flow')
                .insert([newNode])
                .select()
                .single();

            if (error) {
                console.log('Adding node locally (table may not exist):', error.message);
                const tempNode: ConversationNode = {
                    id: Date.now(),
                    ClientName: newNode.ClientName || null,
                    Company: newNode.Company || null,
                    Context: newNode.Context || null,
                    Stage: newNode.Stage || 'Initial',
                    Notes: newNode.Notes || null,
                    LastContactDate: newNode.LastContactDate || null,
                    DraftEmail: null
                };
                setNodes([...nodes, tempNode]);
            } else {
                setNodes([...nodes, data]);
            }

            setIsAddingNew(false);
            setNewNode({
                ClientName: '',
                Company: '',
                Context: '',
                Stage: 'Initial',
                Notes: '',
                LastContactDate: new Date().toISOString().split('T')[0],
                DraftEmail: ''
            });
        } catch (err) {
            console.log('Adding node locally (error)');
            const tempNode: ConversationNode = {
                id: Date.now(),
                ClientName: newNode.ClientName || null,
                Company: newNode.Company || null,
                Context: newNode.Context || null,
                Stage: newNode.Stage || 'Initial',
                Notes: newNode.Notes || null,
                LastContactDate: newNode.LastContactDate || null,
                DraftEmail: null
            };
            setNodes([...nodes, tempNode]);
            setIsAddingNew(false);
            setNewNode({
                ClientName: '',
                Company: '',
                Context: '',
                Stage: 'Initial',
                Notes: '',
                LastContactDate: new Date().toISOString().split('T')[0],
                DraftEmail: ''
            });
        }
    };

    const updateNode = async (id: number, updates: Partial<ConversationNode>) => {
        try {
            const { error } = await supabase
                .from('email_flow')
                .update(updates)
                .eq('id', id);

            if (error) {
                console.log('Updating node locally (table may not exist):', error.message);
            }

            // Always update local state
            setNodes(nodes.map(node =>
                node.id === id ? { ...node, ...updates } : node
            ));
        } catch (err) {
            console.log('Updating node locally (error)');
            setNodes(nodes.map(node =>
                node.id === id ? { ...node, ...updates } : node
            ));
        }
    };

    const deleteNode = async (id: number) => {
        try {
            const { error } = await supabase
                .from('email_flow')
                .delete()
                .eq('id', id);

            if (error) {
                console.log('Deleting node locally (table may not exist):', error.message);
            }

            // Always update local state
            setNodes(nodes.filter(n => n.id !== id));
            if (selectedNode === id) setSelectedNode(null);
        } catch (err) {
            console.log('Deleting node locally (error)');
            setNodes(nodes.filter(n => n.id !== id));
            if (selectedNode === id) setSelectedNode(null);
        }
    };

    const generateEmail = async (node: ConversationNode) => {
        setGeneratingEmail(node.id);

        // Simulate AI generation with template
        await new Promise(resolve => setTimeout(resolve, 800));

        const template = emailTemplates[node.Stage || 'Initial'];
        const draft = template(node);

        await updateNode(node.id, { DraftEmail: draft });
        setGeneratingEmail(null);
    };

    const advanceStage = async (node: ConversationNode) => {
        const stageOrder: ConversationNode['Stage'][] = ['Initial', 'FollowUp1', 'FollowUp2', 'FollowUp3', 'Closed'];
        const currentIndex = stageOrder.indexOf(node.Stage);
        if (currentIndex < stageOrder.length - 1) {
            const nextStage = stageOrder[currentIndex + 1];
            await updateNode(node.id, {
                Stage: nextStage,
                LastContactDate: new Date().toISOString().split('T')[0]
            });
        }
    };

    const copyToClipboard = async (text: string, id: number) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getStageColor = (stage: string | null) => {
        switch (stage) {
            case 'Initial': return 'from-blue-500 to-blue-600';
            case 'FollowUp1': return 'from-yellow-500 to-yellow-600';
            case 'FollowUp2': return 'from-orange-500 to-orange-600';
            case 'FollowUp3': return 'from-red-500 to-red-600';
            case 'Closed': return 'from-gray-500 to-gray-600';
            default: return 'from-primary to-primary';
        }
    };

    const getStageLabel = (stage: string | null) => {
        switch (stage) {
            case 'Initial': return 'INITIAL CONTACT';
            case 'FollowUp1': return 'FOLLOW-UP #1';
            case 'FollowUp2': return 'FOLLOW-UP #2';
            case 'FollowUp3': return 'FINAL FOLLOW-UP';
            case 'Closed': return 'CLOSED';
            default: return 'UNKNOWN';
        }
    };

    if (loading) {
        return (
            <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-12 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-mono text-sm">LOADING EMAIL FLOWS...</p>
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
                        onClick={fetchNodes}
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary" />
                            <h2 className="text-foreground font-mono">EMAIL FLOW BUILDER</h2>
                            <div className="px-2 py-1 bg-primary/10 rounded text-xs font-mono text-primary">
                                {nodes.length} FLOWS
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent ml-4" />
                        </div>

                        <button
                            onClick={() => setIsAddingNew(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-mono transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            NEW FLOW
                        </button>
                    </div>

                    {/* Flow Legend */}
                    <div className="flex items-center gap-6 mt-4 text-xs font-mono">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                            <span className="text-muted-foreground">INITIAL</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600" />
                            <span className="text-muted-foreground">FOLLOW-UP 1</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
                            <span className="text-muted-foreground">FOLLOW-UP 2</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600" />
                            <span className="text-muted-foreground">FINAL</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-500 to-gray-600" />
                            <span className="text-muted-foreground">CLOSED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add New Flow Form */}
            <AnimatePresence>
                {isAddingNew && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-card/20 backdrop-blur-xl border border-primary/30 rounded-2xl p-6"
                    >
                        <h3 className="text-foreground font-mono mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-primary" />
                            NEW EMAIL FLOW
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Client Name"
                                value={newNode.ClientName || ''}
                                onChange={(e) => setNewNode({ ...newNode, ClientName: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Company"
                                value={newNode.Company || ''}
                                onChange={(e) => setNewNode({ ...newNode, Company: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <select
                                value={newNode.Stage || 'Initial'}
                                onChange={(e) => setNewNode({ ...newNode, Stage: e.target.value as ConversationNode['Stage'] })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="Initial">Initial Contact</option>
                                <option value="FollowUp1">Follow-Up #1</option>
                                <option value="FollowUp2">Follow-Up #2</option>
                                <option value="FollowUp3">Final Follow-Up</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <textarea
                                placeholder="Context (e.g., 'Discussed pricing for enterprise plan', 'Met at conference')"
                                value={newNode.Context || ''}
                                onChange={(e) => setNewNode({ ...newNode, Context: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                            />
                            <textarea
                                placeholder="Additional Notes (will be included in email drafts)"
                                value={newNode.Notes || ''}
                                onChange={(e) => setNewNode({ ...newNode, Notes: e.target.value })}
                                className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={addNode}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-mono"
                            >
                                <Check className="w-4 h-4" />
                                CREATE FLOW
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

            {/* Flow Diagram */}
            <div className="space-y-0">
                {nodes.length === 0 ? (
                    <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-12 text-center">
                        <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-mono text-sm">NO EMAIL FLOWS YET</p>
                        <p className="text-muted-foreground/60 font-mono text-xs mt-2">Create your first flow to start drafting emails</p>
                    </div>
                ) : (
                    nodes.map((node, index) => (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Connection Line to Next Node */}
                            {index < nodes.length - 1 && (
                                <div className="absolute left-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-primary/60 to-primary/20 transform -translate-x-1/2 z-0">
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                        <ArrowRight className="w-4 h-4 text-primary/60 rotate-90" />
                                    </div>
                                </div>
                            )}

                            {/* Node Card */}
                            <div className={`bg-card/20 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 ${selectedNode === node.id ? 'border-primary shadow-lg shadow-primary/10' : 'border-card-border'
                                }`}>
                                {/* Node Header */}
                                <div
                                    className="p-4 cursor-pointer hover:bg-card/30 transition-colors"
                                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Stage Badge */}
                                        <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${getStageColor(node.Stage)} text-white text-xs font-mono font-bold shadow-lg`}>
                                            {getStageLabel(node.Stage)}
                                        </div>

                                        {/* Client Info */}
                                        <div className="flex items-center gap-3 flex-1">
                                            <User className="w-4 h-4 text-primary" />
                                            <span className="font-mono text-foreground font-semibold">{node.ClientName || 'Unknown'}</span>
                                            <span className="text-muted-foreground">•</span>
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-mono text-muted-foreground text-sm">{node.Company || 'N/A'}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); generateEmail(node); }}
                                                disabled={generatingEmail === node.id}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-mono transition-all"
                                            >
                                                {generatingEmail === node.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Sparkles className="w-3 h-3" />
                                                )}
                                                DRAFT
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); advanceStage(node); }}
                                                disabled={node.Stage === 'Closed'}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-mono transition-all disabled:opacity-50"
                                            >
                                                <ArrowRight className="w-3 h-3" />
                                                NEXT
                                            </button>
                                            {selectedNode === node.id ? (
                                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Context Preview */}
                                    {node.Context && (
                                        <div className="mt-3 text-sm font-mono text-muted-foreground line-clamp-1">
                                            <span className="text-primary/70">Context:</span> {node.Context}
                                        </div>
                                    )}
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {selectedNode === node.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-card-border/50"
                                        >
                                            <div className="p-4 space-y-4">
                                                {/* Editable Context */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-mono text-primary mb-2 block">CONTEXT</label>
                                                        <textarea
                                                            value={node.Context || ''}
                                                            onChange={(e) => updateNode(node.id, { Context: e.target.value })}
                                                            placeholder="Add context to improve email drafts..."
                                                            className="w-full bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-mono text-primary mb-2 block">NOTES</label>
                                                        <textarea
                                                            value={node.Notes || ''}
                                                            onChange={(e) => updateNode(node.id, { Notes: e.target.value })}
                                                            placeholder="Additional notes for the agent..."
                                                            className="w-full bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Generated Email Draft */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="text-xs font-mono text-primary flex items-center gap-2">
                                                            <Mail className="w-3 h-3" />
                                                            GENERATED EMAIL DRAFT
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => generateEmail(node)}
                                                                className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
                                                            >
                                                                <RefreshCw className="w-3 h-3" />
                                                                REGENERATE
                                                            </button>
                                                            {node.DraftEmail && (
                                                                <button
                                                                    onClick={() => copyToClipboard(node.DraftEmail || '', node.id)}
                                                                    className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
                                                                >
                                                                    {copiedId === node.id ? (
                                                                        <>
                                                                            <Check className="w-3 h-3 text-green-400" />
                                                                            <span className="text-green-400">COPIED!</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy className="w-3 h-3" />
                                                                            COPY
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="bg-card/30 rounded-xl p-4 border border-card-border/50">
                                                        {node.DraftEmail ? (
                                                            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">{node.DraftEmail}</pre>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                                                                <Sparkles className="w-4 h-4" />
                                                                <span className="text-sm font-mono">Click "DRAFT" to generate an email</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Footer Actions */}
                                                <div className="flex items-center justify-between pt-2 border-t border-card-border/30">
                                                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                                                        <span>Last Contact: {node.LastContactDate || 'N/A'}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteNode(node.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-mono transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        DELETE
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Spacing for connection line */}
                            {index < nodes.length - 1 && <div className="h-8" />}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
