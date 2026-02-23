import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import React, { useState, useEffect } from 'react';
import logo from '@assets/logo/1.png';

export const meta: MetaFunction = () => {
  return [{ title: "Under Maintenance — 4Seven's" }];
};

export default function Maintenance() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  const base: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
  };

  return (
    <div
      className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Logo */}
      <div
        style={{
          ...base,
          transform: visible ? 'translateY(0)' : 'translateY(-20px)',
          transitionDelay: '0ms',
          marginBottom: '3rem',
        }}
      >
        <img src={logo} alt="4Seven's" className="h-10 w-auto object-contain" />
      </div>

      {/* Icon */}
      <div
        style={{
          ...base,
          transform: visible ? 'scale(1)' : 'scale(0.8)',
          transitionDelay: '200ms',
          marginBottom: '1.5rem',
          width: '4rem',
          height: '4rem',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>

      {/* Divider */}
      <div
        style={{
          width: visible ? '5rem' : '0',
          height: '1px',
          background: 'rgba(255,255,255,0.35)',
          transition: 'width 0.6s ease-out',
          transitionDelay: '450ms',
          marginBottom: '1.5rem',
        }}
      />

      {/* Headline */}
      <h1
        style={{
          ...base,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transitionDelay: '550ms',
          fontSize: 'clamp(0.75rem, 2vw, 1rem)',
          fontWeight: 600,
          letterSpacing: '0.35em',
          textTransform: 'uppercase' as const,
          textAlign: 'center' as const,
          marginBottom: '0.75rem',
        }}
      >
        Under Maintenance
      </h1>

      {/* Subtext */}
      <p
        style={{
          ...base,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transitionDelay: '700ms',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
          maxWidth: '28rem',
          lineHeight: 1.7,
          textAlign: 'center' as const,
          marginBottom: '2.5rem',
        }}
      >
        We&apos;re currently performing scheduled maintenance.
        <br />
        We&apos;ll be back shortly with something special.
      </p>

      {/* Notify form */}
      <div
        style={{
          ...base,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transitionDelay: '850ms',
          width: '100%',
          maxWidth: '22rem',
          marginBottom: '2rem',
        }}
      >
        {submitted ? (
          <p
            style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '0.9rem 1rem',
            }}
          >
            ✓ &nbsp; We&apos;ll notify you when we&apos;re back
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.75rem 1rem',
                fontSize: '0.8rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'white',
                color: 'black',
                border: 'none',
                padding: '0.75rem 1.25rem',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap' as const,
              }}
            >
              Notify Me
            </button>
          </form>
        )}
      </div>

      {/* Back to home */}
      <Link
        to="/"
        className="hero-cta-btn"
        style={{
          ...base,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
          transitionDelay: '1000ms',
          display: 'inline-block',
          padding: '0.8rem 2.75rem',
          border: '1.5px solid rgba(255,255,255,0.4)',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        Return Home
      </Link>

      {/* Footer tag */}
      <p
        style={{
          position: 'absolute',
          bottom: '2rem',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase' as const,
          opacity: visible ? 1 : 0,
          transition: 'opacity 1s ease-out',
          transitionDelay: '1200ms',
        }}
      >
        4Seven&apos;s &mdash; Premium Fashion
      </p>
    </div>
  );
}
