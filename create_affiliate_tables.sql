-- Create affiliate system tables

-- Affiliate program for paying members
CREATE TABLE IF NOT EXISTS affiliates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  affiliate_code TEXT NOT NULL UNIQUE,
  commission_tier TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_commissions DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  lifetime_commissions DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  pending_commissions DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  paid_commissions DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_email TEXT,
  joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_payout_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Commission rates based on referrer membership level and referee signup level
CREATE TABLE IF NOT EXISTS commission_rates (
  id SERIAL PRIMARY KEY,
  referrer_tier TEXT NOT NULL,
  referee_plan TEXT NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Track individual referrals and their commissions
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
  referred_user_id INTEGER NOT NULL REFERENCES users(id),
  membership_plan_id INTEGER NOT NULL REFERENCES membership_plans(id),
  order_value DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  confirmed_at TIMESTAMP,
  referral_date TIMESTAMP DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Payout history for affiliates
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
  amount DECIMAL(10,2) NOT NULL,
  payout_method TEXT NOT NULL,
  payout_email TEXT NOT NULL,
  referral_ids JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  processed_at TIMESTAMP,
  failed_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Affiliate link clicks tracking for analytics
CREATE TABLE IF NOT EXISTS affiliate_link_clicks (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
  ip_address TEXT,
  user_agent TEXT,
  referrer_url TEXT,
  landing_page TEXT NOT NULL,
  converted_user_id INTEGER REFERENCES users(id),
  clicked_at TIMESTAMP DEFAULT NOW() NOT NULL
);
