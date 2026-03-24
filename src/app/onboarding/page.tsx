'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Package {
    id: string;
    name: string;
    minPrice: string;
    maxPrice: string;
    features: string;
}

interface FormData {
    // Step 1
    name: string;
    businessType: string;
    targetCustomers: string;
    customTarget: string;
    // Step 2
    packages: Package[];
    // Step 3
    deliveryDays: string;
    revisions: string;
    support: string;
    // Step 4
    tone: 'friendly' | 'professional' | 'aggressive';
    objections: string[];
}

const initialForm: FormData = {
    name: '',
    businessType: '',
    targetCustomers: '',
    customTarget: '',
    packages: [{ id: '1', name: '', minPrice: '', maxPrice: '', features: '' }],
    deliveryDays: '',
    revisions: '',
    support: '',
    tone: 'professional',
    objections: [],
};

const STEPS = ['Basic Info', 'Services', 'Delivery', 'Sales Style', 'Review'];

const BUSINESS_TYPES = [
    'Web Design', 'Copywriting', 'Video Editing', 'Social Media Management',
    'SEO / Digital Marketing', 'Software Development', 'Graphic Design',
    'Consulting', 'Photography', 'Other',
];

const TARGET_CUSTOMER_OPTIONS = [
    'Small businesses', 'Startups', 'E-commerce brands', 'Coaches & consultants',
    'Real estate agents', 'Restaurants & local businesses', 'Enterprise / Corporate', 'Custom',
];

const OBJECTION_OPTIONS = [
    'Price is too high', 'Need to think about it', 'Already working with someone',
    'Budget is limited right now', 'Not sure if I need this', 'Need approval from someone else',
    'Bad experience before', 'Timeline too long',
];

const TONE_OPTIONS = [
    { value: 'friendly', label: 'Friendly', description: 'Warm, conversational, builds rapport quickly' },
    { value: 'professional', label: 'Professional', description: 'Polished, confident, business-focused' },
    { value: 'aggressive', label: 'Results-first', description: 'Direct, urgency-driven, outcome-focused' },
] as const;

// ─── Step Progress ─────────────────────────────────────────────────────────────

function StepProgress({ current, total }: { current: number; total: number }) {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-primary/70">Step {current + 1} of {total}</span>
                <span className="text-sm font-medium text-primary/50">{STEPS[current]}</span>
            </div>
            <div className="progress-bar">
                <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${((current + 1) / total) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

// ─── Step 1: Basic Info ───────────────────────────────────────────────────────

function Step1({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
    return (
        <div className="space-y-6">
            <div>
                <label className="label">Your full name</label>
                <input
                    className="input-field"
                    placeholder="Alex Johnson"
                    value={data.name}
                    onChange={(e) => onChange({ name: e.target.value })}
                />
            </div>
            <div>
                <label className="label">What type of freelancer are you?</label>
                <select
                    className="input-field"
                    value={data.businessType}
                    onChange={(e) => onChange({ businessType: e.target.value })}
                >
                    <option value="">Select your field</option>
                    {BUSINESS_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="label">Who are your target customers?</label>
                <select
                    className="input-field"
                    value={data.targetCustomers}
                    onChange={(e) => onChange({ targetCustomers: e.target.value })}
                >
                    <option value="">Select customer type</option>
                    {TARGET_CUSTOMER_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
            {data.targetCustomers === 'Custom' && (
                <div>
                    <label className="label">Describe your target customer</label>
                    <input
                        className="input-field"
                        placeholder="e.g. SaaS founders with 10–50 employees..."
                        value={data.customTarget}
                        onChange={(e) => onChange({ customTarget: e.target.value })}
                    />
                </div>
            )}
        </div>
    );
}

// ─── Step 2: Services ─────────────────────────────────────────────────────────

function Step2({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
    const updatePackage = (id: string, field: keyof Package, value: string) => {
        onChange({
            packages: data.packages.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
        });
    };

    const addPackage = () => {
        onChange({
            packages: [...data.packages, { id: Date.now().toString(), name: '', minPrice: '', maxPrice: '', features: '' }],
        });
    };

    const removePackage = (id: string) => {
        if (data.packages.length === 1) return;
        onChange({ packages: data.packages.filter((p) => p.id !== id) });
    };

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {data.packages.map((pkg, i) => (
                    <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-primary/3 border border-primary/10 rounded-2xl p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary/60 uppercase tracking-wide">Package {i + 1}</span>
                            {data.packages.length > 1 && (
                                <button onClick={() => removePackage(pkg.id)} className="text-accent-2 text-sm hover:underline">
                                    Remove
                                </button>
                            )}
                        </div>
                        <div>
                            <label className="label">Package name</label>
                            <input
                                className="input-field"
                                placeholder="e.g. Starter Website"
                                value={pkg.name}
                                onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Min price ($)</label>
                                <input
                                    className="input-field"
                                    type="number"
                                    placeholder="500"
                                    value={pkg.minPrice}
                                    onChange={(e) => updatePackage(pkg.id, 'minPrice', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label">Max price ($)</label>
                                <input
                                    className="input-field"
                                    type="number"
                                    placeholder="1500"
                                    value={pkg.maxPrice}
                                    onChange={(e) => updatePackage(pkg.id, 'maxPrice', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">What is included?</label>
                            <textarea
                                className="input-field resize-none"
                                rows={3}
                                placeholder="Responsive design, 5 pages, SEO setup, contact form..."
                                value={pkg.features}
                                onChange={(e) => updatePackage(pkg.id, 'features', e.target.value)}
                            />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <button
                onClick={addPackage}
                className="w-full py-3 border-2 border-dashed border-primary/20 rounded-2xl text-primary/50 text-sm font-medium hover:border-accent/50 hover:text-accent transition-colors"
            >
                + Add another package
            </button>
        </div>
    );
}

// ─── Step 3: Delivery ─────────────────────────────────────────────────────────

function Step3({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
    const supportOptions = ['Email only', 'Email + chat', '24/7 support', 'Business hours only', 'No ongoing support'];

    return (
        <div className="space-y-6">
            <div>
                <label className="label">Typical delivery time (days)</label>
                <input
                    className="input-field"
                    type="number"
                    placeholder="14"
                    value={data.deliveryDays}
                    onChange={(e) => onChange({ deliveryDays: e.target.value })}
                />
                <p className="text-xs text-primary/40 mt-1.5">How many days does your standard delivery take?</p>
            </div>
            <div>
                <label className="label">Number of revisions included</label>
                <input
                    className="input-field"
                    type="number"
                    placeholder="3"
                    value={data.revisions}
                    onChange={(e) => onChange({ revisions: e.target.value })}
                />
            </div>
            <div>
                <label className="label">Support offered after delivery</label>
                <select
                    className="input-field"
                    value={data.support}
                    onChange={(e) => onChange({ support: e.target.value })}
                >
                    <option value="">Select support type</option>
                    {supportOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

// ─── Step 4: Sales Style ──────────────────────────────────────────────────────

function Step4({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
    const toggleObjection = (obj: string) => {
        const current = data.objections;
        onChange({
            objections: current.includes(obj) ? current.filter((o) => o !== obj) : [...current, obj],
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <label className="label mb-4">Communication tone</label>
                <div className="space-y-3">
                    {TONE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onChange({ tone: opt.value })}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${data.tone === opt.value
                                    ? 'border-accent bg-accent/10'
                                    : 'border-primary/10 hover:border-primary/30 bg-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.tone === opt.value ? 'border-accent' : 'border-primary/30'
                                    }`}>
                                    {data.tone === opt.value && <div className="w-2 h-2 rounded-full bg-accent" />}
                                </div>
                                <div>
                                    <div className="font-semibold text-primary text-sm">{opt.label}</div>
                                    <div className="text-primary/50 text-xs">{opt.description}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="label mb-4">Common objections you face (select all that apply)</label>
                <div className="grid grid-cols-1 gap-2">
                    {OBJECTION_OPTIONS.map((obj) => (
                        <button
                            key={obj}
                            onClick={() => toggleObjection(obj)}
                            className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${data.objections.includes(obj)
                                    ? 'border-secondary/50 bg-secondary/10 text-primary font-medium'
                                    : 'border-primary/10 hover:border-primary/20 text-primary/60 bg-white'
                                }`}
                        >
                            <span className={`mr-2 ${data.objections.includes(obj) ? 'text-secondary' : 'text-primary/30'}`}>
                                {data.objections.includes(obj) ? '✓' : '○'}
                            </span>
                            {obj}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Step 5: Review ───────────────────────────────────────────────────────────

function Step5({ data }: { data: FormData }) {
    const knowledgeBase = generateKnowledgeBase(data);

    return (
        <div className="space-y-6">
            <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Summary</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between"><span className="text-primary/50">Name</span><span className="font-medium text-primary">{data.name || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-primary/50">Business</span><span className="font-medium text-primary">{data.businessType || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-primary/50">Packages</span><span className="font-medium text-primary">{data.packages.length} package(s)</span></div>
                    <div className="flex justify-between"><span className="text-primary/50">Delivery</span><span className="font-medium text-primary">{data.deliveryDays ? `${data.deliveryDays} days` : '—'}</span></div>
                    <div className="flex justify-between"><span className="text-primary/50">Tone</span><span className="font-medium text-primary capitalize">{data.tone}</span></div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Knowledge Base Preview</h3>
                <div className="json-preview">
                    <pre className="text-primary/70 whitespace-pre-wrap">{JSON.stringify(knowledgeBase, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}

// ─── Knowledge Base Generator ─────────────────────────────────────────────────

function generateKnowledgeBase(data: FormData) {
    return {
        agent_identity: {
            freelancer_name: data.name,
            business_type: data.businessType,
            target_customers: data.targetCustomers === 'Custom' ? data.customTarget : data.targetCustomers,
        },
        services: data.packages.map((p) => ({
            name: p.name,
            pricing: {
                min: p.minPrice ? `$${p.minPrice}` : 'TBD',
                max: p.maxPrice ? `$${p.maxPrice}` : 'TBD',
            },
            includes: p.features.split('\n').filter(Boolean),
        })),
        delivery: {
            standard_timeline: data.deliveryDays ? `${data.deliveryDays} business days` : 'TBD',
            revisions_included: data.revisions ? parseInt(data.revisions) : 0,
            post_delivery_support: data.support || 'TBD',
        },
        sales_behavior: {
            communication_tone: data.tone,
            known_objections: data.objections,
            objection_count: data.objections.length,
        },
        generated_at: new Date().toISOString(),
    };
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ data }: { data: FormData }) {
    const kb = generateKnowledgeBase(data);
    const kbText = `CLOSERIAI AGENT KNOWLEDGE BASE
Generated: ${new Date().toLocaleDateString()}
Freelancer: ${data.name}
Business Type: ${data.businessType}
Target Customers: ${data.targetCustomers === 'Custom' ? data.customTarget : data.targetCustomers}

SERVICES
${data.packages.map((p, i) =>
        `Package ${i + 1}: ${p.name}
  Price: $${p.minPrice} — $${p.maxPrice}
  Includes: ${p.features}`
    ).join('\n\n')}

DELIVERY
  Standard Timeline: ${data.deliveryDays} business days
  Revisions: ${data.revisions}
  Support: ${data.support}

SALES STYLE
  Tone: ${data.tone}
  Objections to Handle:
${data.objections.map((o) => `  - ${o}`).join('\n')}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto py-16 px-6 text-center"
        >
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="#94A378" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-primary mb-3">Your AI agent is ready</h2>
            <p className="text-primary/60 mb-10 text-base leading-relaxed">
                Knowledge base generated successfully. Your AI sales agent is configured and ready to close deals.
            </p>

            <div className="text-left space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Structured Knowledge Base (JSON)</h3>
                    <div className="json-preview">
                        <pre className="text-primary/70 text-xs whitespace-pre-wrap">{JSON.stringify(kb, null, 2)}</pre>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Formatted Document</h3>
                    <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-primary/10">
                        <pre className="text-primary/70 text-xs whitespace-pre-wrap font-mono leading-relaxed">{kbText}</pre>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Link href="/dashboard" className="btn-primary">
                    Go to Dashboard
                </Link>
                <Link href="/" className="btn-secondary">
                    Back to Home
                </Link>
            </div>
        </motion.div>
    );
}

// ─── Onboarding Page ──────────────────────────────────────────────────────────

const STEP_TITLES = [
    { title: 'Tell us about yourself', subtitle: 'Help your AI understand your business.' },
    { title: 'Your services and packages', subtitle: 'What do you offer and at what price?' },
    { title: 'Delivery and turnaround', subtitle: 'Set timeline expectations for clients.' },
    { title: 'Your sales style', subtitle: 'How should your agent speak to prospects?' },
    { title: 'Review and launch', subtitle: 'Confirm your AI agent configuration.' },
];

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormData>(initialForm);
    const [submitted, setSubmitted] = useState(false);
    const [direction, setDirection] = useState(1);

    const updateForm = (partial: Partial<FormData>) => setForm((f) => ({ ...f, ...partial }));

    const goNext = () => {
        if (step < STEPS.length - 1) {
            setDirection(1);
            setStep((s) => s + 1);
        } else {
            setSubmitted(true);
        }
    };

    const goBack = () => {
        if (step > 0) {
            setDirection(-1);
            setStep((s) => s - 1);
        }
    };

    const stepVariants = {
        enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#FAFAF8]">
                <Navbar />
                <SuccessScreen data={form} />
                <div className="pb-20" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAFAF8]">
            <Navbar />

            <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
                {/* Header */}
                <div className="mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary/50 text-sm hover:text-primary transition-colors mb-8">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Back to home
                    </Link>
                    <h1 className="text-3xl font-bold text-primary mb-1">{STEP_TITLES[step].title}</h1>
                    <p className="text-primary/50">{STEP_TITLES[step].subtitle}</p>
                </div>

                <StepProgress current={step} total={STEPS.length} />

                {/* Step Content */}
                <div className="bg-white rounded-3xl shadow-sm border border-primary/5 p-8 mb-8 min-h-[400px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            {step === 0 && <Step1 data={form} onChange={updateForm} />}
                            {step === 1 && <Step2 data={form} onChange={updateForm} />}
                            {step === 2 && <Step3 data={form} onChange={updateForm} />}
                            {step === 3 && <Step4 data={form} onChange={updateForm} />}
                            {step === 4 && <Step5 data={form} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={goBack}
                        disabled={step === 0}
                        className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        Back
                    </button>

                    <div className="flex items-center gap-2">
                        {STEPS.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-accent' : i < step ? 'w-1.5 bg-secondary' : 'w-1.5 bg-primary/15'}`} />
                        ))}
                    </div>

                    <button onClick={goNext} className="btn-primary">
                        {step === STEPS.length - 1 ? 'Launch Agent' : 'Continue'}
                    </button>
                </div>
            </div>
        </main>
    );
}
