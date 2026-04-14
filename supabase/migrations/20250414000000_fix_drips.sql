-- NEOVIV Database Migration: Fix Drips to Match neoviv.life Website
-- Date: 2025-04-14
-- Description: Replace existing drips with correct 12 drips from neoviv.life/book

-- First, deactivate all existing drips (preserve history)
UPDATE public.drips SET is_active = false;

-- Insert all 12 correct drips from neoviv.life/book
-- Prices and durations match website exactly

INSERT INTO public.drips (name, description, price, duration_minutes, benefits, ingredients, is_active) VALUES
  ('Myers'' Cocktail', 'The classic revival vitamin infusion with B-complex, vitamin C, and magnesium for overall wellness and energy', 249.00, 52, 
   ARRAY['Energy boost', 'Immune support', 'Hydration', 'Mood improvement'], 
   ARRAY['Normal Saline', 'Vitamin B-Complex', 'Vitamin C', 'Magnesium', 'Calcium']),
   
  ('Immunity Boost', 'Fortress mode protection with high-dose vitamin C, zinc, and antioxidants to strengthen your immune defenses', 199.00, 45,
   ARRAY['Immune system boost', 'Cold & flu prevention', 'Antioxidant support', 'Faster recovery'],
   ARRAY['Normal Saline', 'Vitamin C (High Dose)', 'Zinc', 'Selenium', 'Glutathione']),
   
  ('Hydration', 'Pure cellular refresh with essential electrolytes and minerals for optimal hydration at the cellular level', 149.00, 37,
   ARRAY['Deep hydration', 'Electrolyte balance', 'Energy restoration', 'Detoxification'],
   ARRAY['Normal Saline', 'Electrolyte Blend', 'Potassium', 'Magnesium', 'Calcium']),
   
  ('Energy & Vitality', 'Power up your day with B-vitamins, amino acids, and taurine for sustained energy without the crash', 179.00, 45,
   ARRAY['Sustained energy', 'Mental clarity', 'Physical performance', 'Metabolism boost'],
   ARRAY['Normal Saline', 'B-Complex Vitamins', 'B12', 'Amino Acids', 'Taurine']),
   
  ('NAD+', 'Cellular longevity therapy with NAD+ to support cellular repair, brain function, and healthy aging', 599.00, 180,
   ARRAY['Cellular repair', 'Brain health', 'Anti-aging', 'DNA repair'],
   ARRAY['Normal Saline', 'NAD+ (Nicotinamide Adenine Dinucleotide)']),
   
  ('Glutathione', 'Master antioxidant infusion to neutralize free radicals and support liver detoxification', 149.00, 30,
   ARRAY['Antioxidant boost', 'Liver detox', 'Skin brightening', 'Immune support'],
   ARRAY['Normal Saline', 'Glutathione']),
   
  ('Beauty Glow', 'Radiance from within with biotin, vitamin C, and collagen-supporting nutrients for hair, skin, and nails', 189.00, 45,
   ARRAY['Radiant skin', 'Stronger hair', 'Healthy nails', 'Anti-aging'],
   ARRAY['Normal Saline', 'Biotin', 'Vitamin C', 'Zinc', 'Selenium']),
   
  ('Recovery', 'Bounce back faster after workouts or illness with amino acids and anti-inflammatory nutrients', 229.00, 52,
   ARRAY['Muscle recovery', 'Reduced inflammation', 'Hydration', 'Nutrient replenishment'],
   ARRAY['Normal Saline', 'Amino Acids', 'B-Complex', 'Magnesium', 'Zinc']),
   
  ('Hangover Relief', 'Back to life fast with targeted hydration, vitamins, and anti-nausea support', 199.00, 45,
   ARRAY['Headache relief', 'Rehydration', 'Nausea relief', 'Energy restoration'],
   ARRAY['Normal Saline', 'B-Complex Vitamins', 'Anti-Nausea Medication', 'Magnesium', 'Calcium']),
   
  ('Weight Loss', 'Ignite your metabolism with MIC (Methionine, Inositol, Choline) and B-vitamins to support fat burning', 229.00, 45,
   ARRAY['Metabolism boost', 'Fat burning support', 'Energy increase', 'Appetite control'],
   ARRAY['Normal Saline', 'MIC (Lipotropic)', 'B-Complex Vitamins', 'B12', 'Carnitine']),
   
  ('Anti-Aging', 'Turn back the clock with a premium blend of antioxidants, vitamins, and nutrients for youthful vitality', 299.00, 75,
   ARRAY['Collagen support', 'Cellular renewal', 'Skin elasticity', 'Energy & vitality'],
   ARRAY['Normal Saline', 'Glutathione', 'Vitamin C', 'B-Complex Vitamins', 'CoQ10']),
   
  ('Migraine Relief', 'Relief in 20 minutes with targeted magnesium, anti-inflammatory agents, and hydration therapy', 249.00, 37,
   ARRAY['Migraine relief', 'Pain reduction', 'Muscle relaxation', 'Nausea relief'],
   ARRAY['Normal Saline', 'Magnesium', 'Anti-Inflammatory Medication', 'B-Complex Vitamins', 'Anti-Nausea Medication']);
