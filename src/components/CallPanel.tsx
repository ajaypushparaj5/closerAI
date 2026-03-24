'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CallResult {
    status: string;
    transcript?: string;
    extracted_data?: {
        interest_level?: string | number;
        client_name?: string;
        objection_type?: string;
        final_status?: string;
        budget_signal?: string;
        notes?: string;
    };
}

export default function CallPanel() {
    const [phone, setPhone] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    const [status, setStatus] = useState<'idle' | 'calling' | 'queued' | 'ringing' | 'in_progress' | 'completed' | 'error'>('idle');
    const [executionId, setExecutionId] = useState<string | null>(null);
    const [result, setResult] = useState<CallResult | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    // E.164 basic validation
    const validatePhone = (p: string) => /^\+[1-9]\d{1,14}$/.test(p);

    const startCall = async () => {
        setErrorMsg('');
        if (!validatePhone(phone)) {
            setErrorMsg('Please enter a valid phone number (e.g. +91XXXXXXXXXX or +1XXXXXXXXXX)');
            return;
        }

        setIsCalling(true);
        setStatus('calling');
        setResult(null);

        try {
            const res = await fetch('/api/start-call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: phone }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to start call');
            }

            setExecutionId(data.execution_id);
            setStatus('queued');
        } catch (err: any) {
            console.error('Start call error:', err);
            setStatus('error');
            setErrorMsg(err.message || 'Connection failed.');
            setIsCalling(false);
        }
    };

    useEffect(() => {
        if (!executionId) return;
        if (['idle', 'error', 'completed'].includes(status)) return;

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/call-status/${executionId}`);
                if (!res.ok) return; // Keep polling on transient errors

                const data = await res.json();
                const currentBolnaStatus = data.status?.toLowerCase();

                if (currentBolnaStatus) {
                    if (currentBolnaStatus === 'queued' || currentBolnaStatus === 'ringing' || currentBolnaStatus === 'in_progress' || currentBolnaStatus === 'completed') {
                        setStatus(currentBolnaStatus as any);
                    } else if (currentBolnaStatus === 'initiated' || currentBolnaStatus === 'created') {
                        setStatus('queued'); // Map bolna's early states to queued
                    }
                }

                if (currentBolnaStatus === 'completed' || currentBolnaStatus === 'finished' || currentBolnaStatus === 'failed') {
                    if (currentBolnaStatus === 'completed' || currentBolnaStatus === 'finished') {
                        setStatus('completed');
                        setResult(data);
                    } else {
                        setStatus('error');
                        setErrorMsg('Call failed during execution.');
                    }
                    setIsCalling(false);
                    if (pollInterval.current) clearInterval(pollInterval.current);
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        };

        pollInterval.current = setInterval(checkStatus, 3000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [executionId, status]);

    const reset = () => {
        setStatus('idle');
        setExecutionId(null);
        setResult(null);
        setErrorMsg('');
        setIsCalling(false);
    };

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center">
            {/* Input & Action */}
            <AnimatePresence mode="popLayout">
                {(status === 'idle' || status === 'error') && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="w-full space-y-4"
                    >
                        <div className="relative">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter phone (+91...)"
                                className="w-full px-5 py-4 pl-12 bg-white/10 text-primary border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-primary/40 font-medium"
                                style={{ color: '#2D3C59', backgroundColor: 'white' }}
                                disabled={isCalling}
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>

                        {errorMsg && (
                            <div className="text-red-500 text-sm font-medium pl-2">{errorMsg}</div>
                        )}

                        <button
                            onClick={startCall}
                            disabled={isCalling}
                            className="w-full btn-primary py-4 text-base relative overflow-hidden group shadow-lg shadow-accent/20"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Call with AI
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </button>
                    </motion.div>
                )}

                {/* Calling State */}
                {(status === 'calling' || status === 'queued' || status === 'ringing' || status === 'in_progress') && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full bg-white rounded-2xl p-8 border border-primary/10 shadow-xl shadow-primary/5 flex flex-col items-center justify-center"
                    >
                        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                            {/* Radar ripple effect */}
                            <div className="absolute inset-0 rounded-full border-2 border-accent opacity-20 animate-ping" style={{ animationDuration: '2s' }} />
                            <div className="absolute inset-2 rounded-full border-2 border-accent opacity-40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

                            <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center z-10 shadow-lg shadow-accent/30">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </div>
                        </div>

                        <h4 className="text-xl font-bold text-primary mb-2 capitalize">
                            {status === 'calling' ? 'Calling...' : status.replace('_', ' ')}
                        </h4>
                        <p className="text-sm font-mono text-primary/40 mb-4">{phone}</p>

                        <div className="flex items-center gap-2">
                            <StatusBadge state={status} />
                        </div>
                    </motion.div>
                )}

                {/* Completed State */}
                {status === 'completed' && result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-white rounded-2xl p-6 border border-primary/10 shadow-xl shadow-primary/5 text-left text-primary"
                    >
                        <div className="flex items-center justify-between border-b border-primary/5 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold">Call Completed</h4>
                                    <p className="text-xs font-mono text-primary/40">{phone}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 rounded bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                                {result.extracted_data?.final_status || 'Done'}
                            </span>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-primary/50">Interest Level</span>
                                <span className="font-bold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-accent" />
                                    {result.extracted_data?.interest_level || 'N/A'}/10
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-primary/50">Objection</span>
                                <span className="font-medium max-w-[60%] text-right truncate">
                                    {result.extracted_data?.objection_type || 'None'}
                                </span>
                            </div>
                            {result.transcript && (
                                <div className="mt-4 pt-4 border-t border-primary/5">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary/50 block mb-2">Transcript Snippet</span>
                                    <div className="text-xs text-primary/70 bg-primary/5 p-3 rounded-xl max-h-32 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                                        {result.transcript}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={reset}
                            className="w-full py-3 rounded-xl text-sm font-semibold text-primary/60 bg-primary/5 hover:bg-primary/10 transition-colors"
                        >
                            Make Another Call
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ state }: { state: string }) {
    if (state === 'calling') return <span className="badge bg-primary/10 text-primary">Initiating...</span>;
    if (state === 'queued') return <span className="badge bg-amber-500/20 text-amber-700">Queued in Bolna</span>;
    if (state === 'ringing') return <span className="badge bg-blue-500/20 text-blue-700">Ringing...</span>;
    if (state === 'in_progress') return <span className="badge bg-accent/20 text-accent-dark font-semibold"><span className="w-2 h-2 rounded-full bg-accent animate-pulse inline-block mr-1.5" />In Progress</span>;
    return null;
}
