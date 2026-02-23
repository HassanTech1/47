import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assest/logo/1.png";

const NotFoundPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const base = {
    opacity: visible ? 1 : 0,
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
  };

  return (
    <div
      className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ fontFamily: "\'Cairo\', sans-serif" }}
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Logo */}
      <div
        style={{
          ...base,
          transform: visible ? "translateY(0)" : "translateY(-20px)",
          transitionDelay: "0ms",
          marginBottom: "3rem",
        }}
      >
        <img src={logo} alt="4Seven\'s" className="h-10 w-auto object-contain" />
      </div>

      {/* Giant 404 */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.88)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          transitionDelay: "200ms",
          lineHeight: 1,
          marginBottom: "1.5rem",
          fontFamily: "\'Playfair Display\', serif",
          fontSize: "clamp(6rem, 20vw, 16rem)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.25)",
        }}
      >
        404
      </div>

      {/* Divider */}
      <div
        style={{
          width: visible ? "5rem" : "0",
          height: "1px",
          background: "rgba(255,255,255,0.35)",
          transition: "width 0.6s ease-out",
          transitionDelay: "500ms",
          marginBottom: "1.5rem",
        }}
      />

      {/* Headline */}
      <h1
        style={{
          ...base,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transitionDelay: "600ms",
          fontSize: "clamp(0.75rem, 2vw, 1rem)",
          fontWeight: 600,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: "0.75rem",
        }}
      >
        Page Not Found
      </h1>

      {/* Subtext */}
      <p
        style={{
          ...base,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transitionDelay: "750ms",
          color: "rgba(255,255,255,0.5)",
          fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
          maxWidth: "28rem",
          lineHeight: 1.7,
          textAlign: "center",
          marginBottom: "2.5rem",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        <br />
        Let&apos;s get you back to the collection.
      </p>

      {/* CTA */}
      <Link
        to="/"
        className="hero-cta-btn"
        style={{
          ...base,
          transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transitionDelay: "900ms",
          display: "inline-block",
          padding: "0.8rem 2.75rem",
          border: "1.5px solid rgba(255,255,255,0.8)",
          color: "white",
          fontSize: "0.7rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Return Home
      </Link>

      {/* Footer tag */}
      <p
        style={{
          position: "absolute",
          bottom: "2rem",
          color: "rgba(255,255,255,0.2)",
          fontSize: "0.65rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease-out",
          transitionDelay: "1100ms",
        }}
      >
        4Seven&apos;s &mdash; Premium Fashion
      </p>
    </div>
  );
};

export default NotFoundPage;
