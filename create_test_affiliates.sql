-- Create test users with different membership tiers
INSERT INTO users (name, email, password_hash, role, membership_type, is_active, created_at, updated_at)
VALUES 
  ('Sarah Johnson', 'sarah.j@test.com', '$2b$10$dummy.hash.for.testing', 'student', 'basic', true, NOW(), NOW()),
  ('Mike Chen', 'mike.c@test.com', '$2b$10$dummy.hash.for.testing', 'student', 'premium', true, NOW(), NOW()),
  ('Emma Rodriguez', 'emma.r@test.com', '$2b$10$dummy.hash.for.testing', 'student', 'lifetime', true, NOW(), NOW()),
  ('David Kim', 'david.k@test.com', '$2b$10$dummy.hash.for.testing', 'student', 'basic', true, NOW(), NOW()),
  ('Lisa Thompson', 'lisa.t@test.com', '$2b$10$dummy.hash.for.testing', 'student', 'premium', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Create affiliate accounts for these users
WITH user_data AS (
  SELECT id, name, email, membership_type 
  FROM users 
  WHERE email IN ('sarah.j@test.com', 'mike.c@test.com', 'emma.r@test.com', 'david.k@test.com', 'lisa.t@test.com')
)
INSERT INTO affiliates (user_id, affiliate_code, commission_tier, payment_email, total_referrals, total_commissions, lifetime_commissions, pending_commissions, paid_commissions, joined_at, created_at, updated_at)
SELECT 
  id,
  'REF' || id || UPPER(SUBSTRING(MD5(RANDOM()::text), 1, 8)),
  membership_type,
  email,
  FLOOR(RANDOM() * 15)::int, -- Random referrals 0-14
  ROUND((RANDOM() * 500)::numeric, 2), -- Random total commissions
  ROUND((RANDOM() * 800)::numeric, 2), -- Random lifetime commissions  
  ROUND((RANDOM() * 200)::numeric, 2), -- Random pending commissions
  ROUND((RANDOM() * 400)::numeric, 2), -- Random paid commissions
  NOW() - INTERVAL '30 days' + (RANDOM() * INTERVAL '30 days'), -- Joined sometime in last 30 days
  NOW(),
  NOW()
FROM user_data
ON CONFLICT (user_id) DO NOTHING;

-- Create some sample referrals for demonstration
WITH affiliate_data AS (
  SELECT a.id as affiliate_id, u.id as user_id, a.commission_tier
  FROM affiliates a
  JOIN users u ON a.user_id = u.id
  WHERE u.email IN ('sarah.j@test.com', 'mike.c@test.com', 'emma.r@test.com')
  LIMIT 3
),
membership_plans_data AS (
  SELECT id, name, price FROM membership_plans LIMIT 3
)
INSERT INTO affiliate_referrals (affiliate_id, referred_user_id, membership_plan_id, order_value, commission_rate, commission_amount, status, referral_date, created_at, updated_at)
SELECT 
  ad.affiliate_id,
  ad.user_id + 1, -- Reference next user as referred user
  mp.id,
  mp.price,
  CASE 
    WHEN ad.commission_tier = 'basic' THEN 20.00
    WHEN ad.commission_tier = 'premium' THEN 25.00 
    WHEN ad.commission_tier = 'lifetime' THEN 30.00
    ELSE 20.00
  END,
  ROUND((mp.price * CASE 
    WHEN ad.commission_tier = 'basic' THEN 0.20
    WHEN ad.commission_tier = 'premium' THEN 0.25
    WHEN ad.commission_tier = 'lifetime' THEN 0.30
    ELSE 0.20
  END)::numeric, 2),
  CASE WHEN RANDOM() > 0.3 THEN 'confirmed' ELSE 'pending' END,
  NOW() - INTERVAL '10 days' + (RANDOM() * INTERVAL '10 days'),
  NOW(),
  NOW()
FROM affiliate_data ad
CROSS JOIN membership_plans_data mp
LIMIT 6;

-- Create some payout records
INSERT INTO affiliate_payouts (affiliate_id, amount, payout_method, payout_email, referral_ids, status, processed_at, created_at, updated_at)
SELECT 
  a.id,
  ROUND((50 + RANDOM() * 200)::numeric, 2),
  'paypal',
  u.email,
  '[]'::jsonb,
  CASE WHEN RANDOM() > 0.5 THEN 'completed' ELSE 'pending' END,
  CASE WHEN RANDOM() > 0.5 THEN NOW() - INTERVAL '5 days' + (RANDOM() * INTERVAL '5 days') ELSE NULL END,
  NOW() - INTERVAL '15 days' + (RANDOM() * INTERVAL '10 days'),
  NOW()
FROM affiliates a
JOIN users u ON a.user_id = u.id
WHERE u.email IN ('sarah.j@test.com', 'mike.c@test.com', 'emma.r@test.com')
LIMIT 5;

-- Create some link clicks for analytics
INSERT INTO affiliate_link_clicks (affiliate_id, ip_address, user_agent, referrer_url, landing_page, clicked_at)
SELECT 
  a.id,
  '192.168.' || FLOOR(RANDOM() * 255)::text || '.' || FLOOR(RANDOM() * 255)::text,
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'https://facebook.com',
  CASE WHEN RANDOM() > 0.5 THEN '/' ELSE '/courses' END,
  NOW() - INTERVAL '7 days' + (RANDOM() * INTERVAL '7 days')
FROM affiliates a
JOIN users u ON a.user_id = u.id
CROSS JOIN generate_series(1, 5) -- 5 clicks per affiliate
LIMIT 25;
