// NEOVIV Theme - Light Premium Wellness Aesthetic
// Matching neoviv.life exactly

export const COLORS = {
  // Background colors
  background: '#F5F9F9',      // Light mint - main background
  cardBackground: '#FFFFFF',   // Pure white cards
  
  // Text colors
  heading: '#131B2A',         // Dark navy for headings
  body: '#131B2A',             // Dark navy for body text
  muted: '#6B7280',            // Muted gray for secondary text
  
  // Brand colors
  teal: '#00B09B',            // Solid teal - primary accent (matching website exactly)
  tealLight: '#E8F4F2',       // Light teal for subtle backgrounds
  tealBorder: '#C8E0DA',      // Light teal for borders
  electricBlue: '#00D4FF',    // Electric blue accent

  // No more dark/electric colors
  white: '#FFFFFF',
  black: '#131B2A',
};

export const FONTS = {
  heading: 'PlayfairDisplay_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodyBold: 'Inter_700Bold',
};

export const SHADOWS = {
  card: {
    shadowColor: '#131B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#00B09B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADII = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};
