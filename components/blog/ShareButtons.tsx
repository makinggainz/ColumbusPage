"use client";

import { useState } from "react";

type Props = {
  title?: string;
  size?: number;
  className?: string;
};

const BRAND_COLORS = {
  facebook: "#1877F2",
  x: "#000000",
  linkedin: "#0A66C2",
} as const;

type Platform = keyof typeof BRAND_COLORS;

function ShareBtn({
  platform,
  size,
  onShare,
  children,
}: {
  platform: Platform;
  size: number;
  onShare: (p: Platform) => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onShare(platform)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Share on ${platform === "x" ? "X" : platform.charAt(0).toUpperCase() + platform.slice(1)}`}
      title={`Share on ${platform === "x" ? "X" : platform.charAt(0).toUpperCase() + platform.slice(1)}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size + 16,
        height: size + 16,
        borderRadius: "50%",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        color: hovered ? BRAND_COLORS[platform] : "rgba(10, 19, 68, 0.45)",
        transition: "color 180ms ease",
      }}
    >
      {children}
    </button>
  );
}

export function ShareButtons({ title = "", size = 20, className = "" }: Props) {
  const open = (platform: Platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const targets: Record<Platform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(targets[platform], "_blank", "width=600,height=480,noopener,noreferrer");
  };

  return (
    <div className={`flex items-center ${className}`} style={{ gap: 0 }}>
      <ShareBtn platform="facebook" size={size} onShare={open}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </ShareBtn>

      <ShareBtn platform="x" size={size} onShare={open}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </ShareBtn>

      <ShareBtn platform="linkedin" size={size} onShare={open}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </ShareBtn>
    </div>
  );
}
