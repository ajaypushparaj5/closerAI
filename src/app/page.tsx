'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallPanel from '@/components/CallPanel';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
            {children}
        </motion.div>
    );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1664575196412-ed801e8333a1?w=1600&q=80"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-man-working-at-his-laptop-in-an-office-close-up-48413-large.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="hero-overlay absolute inset-0" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium mb-8 backdrop-blur-sm">
                        AI Voice Sales — Built for Freelancers
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
                >
                    Turn Conversations<br />
                    <span className="text-accent">Into Clients</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="text-xl md:text-2xl text-white/70 mb-12 font-light max-w-2xl mx-auto leading-relaxed"
                >
                    AI voice agents that don&apos;t just talk — they close deals for you.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/onboarding" className="btn-primary text-base px-10 py-4 inline-block">
                        Start Selling with AI
                    </Link>
                    <a href="#how-it-works" className="btn-outline-white text-base px-10 py-4 inline-block">
                        See How It Works
                    </a>
                </motion.div>

                {/* Trust bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/50 text-sm"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        <span>Setup in under 5 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        <span>Cancel anytime</span>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5"
                >
                    <div className="w-1 h-2 rounded-full bg-white/50"></div>
                </motion.div>
            </motion.div>
        </section>
    );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Setup your services',
            description: 'Tell CloserAI about your packages, pricing, delivery timelines, and how you like to handle objections.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="#2D3C59" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
        },
        {
            number: '02',
            title: 'AI talks to your clients',
            description: 'Your AI agent handles inbound leads, qualifies prospects, overcomes objections, and moves deals forward — automatically.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19 11C19 15.4183 15.4183 19 11 19M19 11C19 6.58172 15.4183 3 11 3M19 11H21M11 19C6.58172 19 3 15.4183 3 11M11 19V21M3 11C3 6.58172 6.58172 3 11 3M3 11H1M11 3V1" stroke="#94A378" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
        },
        {
            number: '03',
            title: 'Get qualified closed leads',
            description: 'Review call summaries, interest scores, and objection reports. You only talk to clients who are ready to buy.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#E5BA41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
    ];

    return (
        <section id="how-it-works" className="py-28 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <Section>
                    <div className="text-center mb-20">
                        <motion.span variants={fadeUp} className="text-accent-2 font-semibold text-sm tracking-widest uppercase mb-4 block">
                            The Process
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="section-title mb-4">
                            Three steps to<br />automated sales
                        </motion.h2>
                        <motion.p variants={fadeUp} className="section-subtitle max-w-xl mx-auto">
                            From setup to closed deal — your AI handles the entire sales conversation.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <motion.div key={step.number} variants={fadeUp} className="step-card group">
                                <div className="step-number">{step.number}</div>
                                <div className="feature-icon bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
                                <p className="text-primary/60 leading-relaxed text-sm">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            </div>
        </section>
    );
}

// ─── Features ────────────────────────────────────────────────────────────────

function Features() {
    const features = [
        {
            title: 'Human-like voice conversations',
            description: 'Natural speech patterns, appropriate pausing, and contextual responses that feel genuinely human.',
            color: 'bg-primary/5',
            iconBg: 'bg-primary',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z" stroke="white" strokeWidth="1.5" />
                    <path d="M9.5 12C9.5 10.6193 10.6193 9.5 12 9.5V9.5C13.3807 9.5 14.5 10.6193 14.5 12V15.5C14.5 16.0523 14.0523 16.5 13.5 16.5H10.5C9.94772 16.5 9.5 16.0523 9.5 15.5V12Z" stroke="white" strokeWidth="1.5" />
                    <path d="M12 9.5V7M12 2V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
        },
        {
            title: 'Objection handling',
            description: 'Pre-trained on the most common freelancer objections. Price too high? Timeline too long? AI handles it.',
            color: 'bg-secondary/5',
            iconBg: 'bg-secondary',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8 12H16M8 8H16M8 16H12M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
        },
        {
            title: 'Lead scoring',
            description: 'Every call gets an interest level score so you know exactly where to focus your follow-up energy.',
            color: 'bg-accent/5',
            iconBg: 'bg-accent',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M2 20L7 15L11 19L16 13L22 7M22 7H17M22 7V12" stroke="#2D3C59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            title: 'Call summaries',
            description: 'Get a structured debrief after every conversation — what was discussed, what objections came up, next steps.',
            color: 'bg-accent-2/5',
            iconBg: 'bg-accent-2',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12H15M9 16H12M7 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44772 20.5523 4 20 4H17M9 4H15C15.5523 4 16 4.44772 16 5V7C16 7.55228 15.5523 8 15 8H9C8.44772 8 8 7.55228 8 7V5C8 4.44772 8.44772 4 9 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
        },
    ];

    return (
        <section id="features" className="py-28 px-6 bg-[#FAFAF8]">
            <div className="max-w-6xl mx-auto">
                <Section>
                    <div className="text-center mb-20">
                        <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm tracking-widest uppercase mb-4 block">
                            Features
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="section-title mb-4">
                            Everything you need<br />to close remotely
                        </motion.h2>
                        <motion.p variants={fadeUp} className="section-subtitle max-w-xl mx-auto">
                            Built specifically for freelancers who want to scale their sales without scaling their time.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <motion.div key={feature.title} variants={fadeUp} className={`card ${feature.color} border-0 group`}>
                                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                                <p className="text-primary/60 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            </div>
        </section>
    );
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function Stats() {
    const stats = [
        { value: '3.2x', label: 'More deals closed on average' },
        { value: '89%', label: 'Objection handling accuracy' },
        { value: '< 5min', label: 'Average setup time' },
        { value: '24/7', label: 'Always-on sales agent' },
    ];

    return (
        <section className="py-20 px-6 bg-primary">
            <div className="max-w-6xl mx-auto">
                <Section>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <motion.div key={stat.label} variants={fadeUp} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</div>
                                <div className="text-white/50 text-sm leading-tight">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            </div>
        </section>
    );
}

// ─── Demo Section ─────────────────────────────────────────────────────────────

function Demo() {
    return (
        <section id="demo" className="py-28 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <Section>
                    <div className="text-center mb-16">
                        <motion.span variants={fadeUp} className="text-accent-2 font-semibold text-sm tracking-widest uppercase mb-4 block">
                            Live Demo
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="section-title mb-4">
                            Hear it for yourself
                        </motion.h2>
                        <motion.p variants={fadeUp} className="section-subtitle max-w-xl mx-auto">
                            Experience a live AI sales call. Your agent is standing by.
                        </motion.p>
                    </div>

                    <motion.div
                        variants={fadeUp}
                        className="relative bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 text-center overflow-hidden"
                    >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="absolute rounded-full border border-white" style={{
                                    width: `${(i + 1) * 120}px`,
                                    height: `${(i + 1) * 120}px`,
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }} />
                            ))}
                        </div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center mx-auto mb-8">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 11C19 15.4183 15.4183 19 11 19M19 11C19 6.58172 15.4183 3 11 3M19 11H21M11 19C6.58172 19 3 15.4183 3 11M11 19V21M3 11C3 6.58172 6.58172 3 11 3M3 11H1M11 3V1" stroke="#E5BA41" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Try an AI Call</h3>
                            <p className="text-white/60 mb-8 text-base max-w-sm mx-auto leading-relaxed">
                                Connect with your AI sales agent powered by Bolna voice technology.
                            </p>
                            <div className="relative isolate z-20">
                                <CallPanel />
                            </div>
                            <p className="text-white/30 text-xs mt-6 font-mono relative z-10">
                                Webhook: http://localhost:5000/api/call-result
                            </p>
                        </div>
                    </motion.div>
                </Section>
            </div>
        </section>
    );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
    const plans = [
        {
            name: 'Starter',
            price: '49',
            description: 'For freelancers just getting started with AI sales.',
            features: ['50 calls per month', 'Basic lead scoring', 'Call summaries', 'Email support'],
            cta: 'Get started',
            highlighted: false,
        },
        {
            name: 'Pro',
            price: '129',
            description: 'For freelancers ready to scale their pipeline.',
            features: ['Unlimited calls', 'Advanced lead scoring', 'Objection handling AI', 'Priority support', 'Custom voice tone', 'Dashboard analytics'],
            cta: 'Start free trial',
            highlighted: true,
        },
        {
            name: 'Agency',
            price: '349',
            description: 'For agencies managing multiple clients.',
            features: ['Multi-client management', 'White-label option', 'API access', 'Dedicated success manager', 'Custom integrations'],
            cta: 'Contact us',
            highlighted: false,
        },
    ];

    return (
        <section id="pricing" className="py-28 px-6 bg-[#FAFAF8]">
            <div className="max-w-6xl mx-auto">
                <Section>
                    <div className="text-center mb-20">
                        <motion.span variants={fadeUp} className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">
                            Pricing
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="section-title mb-4">
                            Simple, transparent pricing
                        </motion.h2>
                        <motion.p variants={fadeUp} className="section-subtitle max-w-xl mx-auto">
                            No hidden fees. Cancel anytime.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <motion.div
                                key={plan.name}
                                variants={fadeUp}
                                className={`rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 ${plan.highlighted
                                    ? 'bg-primary text-white border-primary shadow-2xl scale-105'
                                    : 'bg-white text-primary border-primary/10 shadow-sm hover:shadow-md'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <span className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-bold mb-4">
                                        Most Popular
                                    </span>
                                )}
                                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-primary'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white/60' : 'text-primary/50'}`}>
                                    {plan.description}
                                </p>
                                <div className={`text-4xl font-bold mb-8 ${plan.highlighted ? 'text-white' : 'text-primary'}`}>
                                    <span className="text-2xl font-semibold">$</span>{plan.price}
                                    <span className={`text-sm font-normal ml-1 ${plan.highlighted ? 'text-white/60' : 'text-primary/50'}`}>/mo</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f) => (
                                        <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlighted ? 'text-white/80' : 'text-primary/70'}`}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                    stroke={plan.highlighted ? '#E5BA41' : '#94A378'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/onboarding"
                                    className={`block text-center py-3 px-6 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 ${plan.highlighted
                                        ? 'bg-accent text-primary hover:bg-amber-400'
                                        : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            </div>
        </section>
    );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
    return (
        <section className="py-24 px-6 bg-[#FAFAF8]">
            <div className="max-w-4xl mx-auto">
                <Section>
                    <motion.div
                        variants={fadeUp}
                        className="bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-3xl p-16 text-center border border-accent/20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                            Ready to close more<br />deals on autopilot?
                        </h2>
                        <p className="text-primary/60 mb-10 max-w-md mx-auto leading-relaxed">
                            Join hundreds of freelancers who are already using AI to win more clients.
                        </p>
                        <Link href="/onboarding" className="btn-primary text-base px-12 py-4 inline-block">
                            Start Selling with AI
                        </Link>
                    </motion.div>
                </Section>
            </div>
        </section>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
    return (
        <main>
            <Navbar />
            <Hero />
            <HowItWorks />
            <Features />
            <Stats />
            <Demo />
            <Pricing />
            <CTABanner />
            <Footer />
        </main>
    );
}
