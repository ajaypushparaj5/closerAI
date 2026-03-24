'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallPanel from '@/components/CallPanel';

interface CallResult {
    id: string;
    timestamp: string;
    client_name?: string;
    interest_level: number;
    objection_type: string;
    final_status: 'Closed' | 'Follow-up' | 'Lost';
    budget_signal: string;
    notes?: string;
}

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

function StatusBadge({ status }: { status: CallResult['final_status'] }) {
    const styles = {
        Closed: 'bg-secondary/15 text-[#5a7a45]',
        'Follow-up': 'bg-accent/15 text-amber-700',
        Lost: 'bg-accent-2/15 text-accent-2',
    };
    return (
        <span className={`badge ${styles[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'Closed' ? 'bg-secondary' : status === 'Follow-up' ? 'bg-accent' : 'bg-accent-2'}`} />
            {status}
        </span>
    );
}

function InterestBar({ level }: { level: number }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="progress-bar flex-1 max-w-[80px]">
                <div
                    className="h-full rounded-full transition-all"
                    style={{
                        width: `${level * 10}%`,
                        background: level >= 7 ? '#94A378' : level >= 5 ? '#E5BA41' : '#D1855C',
                    }}
                />
            </div>
            <span className="text-xs font-semibold text-primary/70">{level}/10</span>
        </div>
    );
}

function CallCard({ call }: { call: CallResult }) {
    return (
        <motion.div variants={fadeUp} className="card group">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-primary text-base mb-0.5">
                        {call.client_name || 'Anonymous Lead'}
                    </h3>
                    <p className="text-xs text-primary/40">
                        {new Date(call.timestamp).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </p>
                </div>
                <StatusBadge status={call.final_status} />
            </div>

            <div className="space-y-3 pt-4 border-t border-primary/5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-primary/50">Interest level</span>
                    <InterestBar level={call.interest_level} />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-primary/50">Main objection</span>
                    <span className="text-primary font-medium text-right max-w-[55%] text-xs leading-tight">{call.objection_type || '—'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-primary/50">Budget signal</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${call.budget_signal === 'High' ? 'bg-secondary/15 text-secondary' :
                        call.budget_signal === 'Medium' ? 'bg-accent/15 text-amber-700' :
                            'bg-accent-2/15 text-accent-2'
                        }`}>{call.budget_signal}</span>
                </div>
                {call.notes && (
                    <div className="pt-2 border-t border-primary/5">
                        <p className="text-xs text-primary/50 leading-relaxed">{call.notes}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Sample demo data shown when API is unavailable
const DEMO_CALLS: CallResult[] = [
    {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        client_name: 'Sarah Thompson',
        interest_level: 8,
        objection_type: 'Price is too high',
        final_status: 'Follow-up',
        budget_signal: 'High',
        notes: 'Very interested in the Pro package. Concerned about upfront cost. Schedule a follow-up next Tuesday.',
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        client_name: 'Marcus Lee',
        interest_level: 9,
        objection_type: 'None',
        final_status: 'Closed',
        budget_signal: 'High',
        notes: 'Ready to proceed. Asked to send contract immediately.',
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        client_name: 'Diana Patel',
        interest_level: 4,
        objection_type: 'Already working with someone',
        final_status: 'Lost',
        budget_signal: 'Low',
    },
    {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        client_name: 'James Wu',
        interest_level: 7,
        objection_type: 'Need to think about it',
        final_status: 'Follow-up',
        budget_signal: 'Medium',
        notes: 'Evaluate again in 2 weeks. Send case studies.',
    },
    {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
        client_name: 'Elena Vasquez',
        interest_level: 10,
        objection_type: 'None',
        final_status: 'Closed',
        budget_signal: 'High',
        notes: 'Fastest close yet. AI handled the entire conversation flawlessly.',
    },
    {
        id: '6',
        timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
        client_name: 'Tom Nakamura',
        interest_level: 3,
        objection_type: 'Budget is limited right now',
        final_status: 'Lost',
        budget_signal: 'Low',
    },
];

export default function DashboardPage() {
    const [calls, setCalls] = useState<CallResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'Closed' | 'Follow-up' | 'Lost'>('All');
    const [usingDemo, setUsingDemo] = useState(false);
    const [showCallModal, setShowCallModal] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/api/results')
            .then((r) => r.json())
            .then((data) => {
                setCalls(Array.isArray(data) && data.length > 0 ? data : DEMO_CALLS);
                setUsingDemo(Array.isArray(data) && data.length === 0);
                setLoading(false);
            })
            .catch(() => {
                setCalls(DEMO_CALLS);
                setUsingDemo(true);
                setLoading(false);
            });
    }, []);

    const filtered = filter === 'All' ? calls : calls.filter((c) => c.final_status === filter);

    const stats = {
        total: calls.length,
        closed: calls.filter((c) => c.final_status === 'Closed').length,
        followup: calls.filter((c) => c.final_status === 'Follow-up').length,
        avgInterest: calls.length ? Math.round(calls.reduce((a, b) => a + b.interest_level, 0) / calls.length * 10) / 10 : 0,
    };

    return (
        <main className="min-h-screen bg-[#FAFAF8]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-primary mb-2">Sales Dashboard</h1>
                        <p className="text-primary/50 text-base">Track every AI call, lead status, and conversion signal.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowCallModal(true)}
                            className="btn-primary"
                        >
                            Start AI Call
                        </button>
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/10 text-xs text-primary/50">
                            <span className="font-mono">Webhook:</span>
                            <code className="text-primary/70 font-mono">localhost:5000/api/call-result</code>
                        </div>
                    </div>
                </div>

                {usingDemo && (
                    <div className="mb-8 px-5 py-3.5 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                        <p className="text-sm text-primary/70">
                            <span className="font-medium text-primary">Demo mode</span> — showing sample data. Start the backend server and make a call to see real results.
                        </p>
                    </div>
                )}

                {/* Stats */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12"
                >
                    {[
                        { label: 'Total Calls', value: stats.total, color: 'text-primary' },
                        { label: 'Deals Closed', value: stats.closed, color: 'text-secondary' },
                        { label: 'Follow-ups', value: stats.followup, color: 'text-amber-600' },
                        { label: 'Avg Interest', value: `${stats.avgInterest}/10`, color: 'text-accent-2' },
                    ].map((s) => (
                        <motion.div key={s.label} variants={fadeUp} className="bg-white rounded-2xl p-6 border border-primary/5 shadow-sm">
                            <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-primary/50 font-medium">{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Filter */}
                <div className="flex items-center gap-2 mb-8">
                    {(['All', 'Closed', 'Follow-up', 'Lost'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === f
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-white text-primary/60 border border-primary/10 hover:border-primary/30'
                                }`}
                        >
                            {f}
                            {f !== 'All' && (
                                <span className={`ml-1.5 text-xs ${filter === f ? 'text-white/60' : 'text-primary/40'}`}>
                                    {calls.filter((c) => c.final_status === f).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Calls Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 border border-primary/5 animate-pulse">
                                <div className="h-4 bg-primary/10 rounded mb-3 w-2/3" />
                                <div className="h-3 bg-primary/5 rounded mb-6 w-1/3" />
                                <div className="space-y-2">
                                    <div className="h-3 bg-primary/5 rounded" />
                                    <div className="h-3 bg-primary/5 rounded w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-primary/40">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 opacity-30">
                            <path d="M9 12H15M9 16H12M7 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44772 20.5523 4 20 4H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <p className="font-medium">No {filter.toLowerCase()} calls yet</p>
                    </div>
                ) : (
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map((call) => (
                            <CallCard key={call.id} call={call} />
                        ))}
                    </motion.div>
                )}

                {/* Webhook info */}
                <div className="mt-16 bg-primary/3 border border-primary/10 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-primary mb-2">Webhook Integration</h3>
                    <p className="text-sm text-primary/50 mb-3">Send call results to this endpoint after each AI session:</p>
                    <code className="block bg-primary text-accent font-mono text-sm p-4 rounded-xl whitespace-pre">
                        {`POST http://localhost:5000/api/call-result
Content-Type: application/json

{
  "client_name": "Lead Name",
  "interest_level": 8,
  "objection_type": "Price is too high",
  "final_status": "Follow-up",
  "budget_signal": "High",
  "notes": "Follow up next week"
}`}
                    </code>
                </div>
            </div>

            {/* Calling Modal */}
            <AnimatePresence>
                {showCallModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowCallModal(false)}
                                className="absolute top-6 right-6 text-primary/40 hover:text-primary transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-primary mb-2">New Call Session</h3>
                                <p className="text-sm text-primary/50">Enter a phone number to start the AI voice agent.</p>
                            </div>
                            <CallPanel />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
