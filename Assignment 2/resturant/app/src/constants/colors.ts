// ─── NIXH Design System – Color Tokens ────────────────────────────────────────
export const Colors = {
  // Backgrounds
  bg:          '#0A0A0A',
  bgCard:      'rgba(255,255,255,0.04)',
  bgCardHover: 'rgba(255,255,255,0.07)',

  // Accent – Neon Cyan
  accent:      '#00F5FF',
  accentDim:   'rgba(0,245,255,0.15)',
  accentGlow:  'rgba(0,245,255,0.35)',

  // Text
  textPrimary:   '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted:     '#52525B',

  // Borders
  border:      'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.14)',

  // Status
  success: '#22C55E',
  error:   '#EF4444',
  warning: '#F59E0B',

  // Gradient stops
  gradientStart: '#00F5FF',
  gradientMid:   '#8B5CF6',
  gradientEnd:   '#EC4899',
} as const;
