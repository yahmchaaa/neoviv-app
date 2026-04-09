-- Migration: Add user profile fields for clinical intake and HIPAA consent
-- Date: 2026-04-09
-- Description: Adds emergency contact, health screening, and HIPAA consent columns to users table

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS health_screening JSONB,
ADD COLUMN IF NOT EXISTS hipaa_consent_signed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hipaa_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS hipaa_signature_url TEXT,
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';
