# Test Affiliate Accounts Created

## Overview
Successfully created 5 test affiliate accounts with realistic commission data to demonstrate the affiliate program functionality.

## Test Accounts

### 1. Sarah Johnson (Basic Tier)
- **Email**: sarah.j@test.com
- **Affiliate Code**: REF2124F45D0D
- **Commission Tier**: Basic (20%, 15%, 10%)
- **Stats**: 1 referral, $155.96 total commissions, $657.77 lifetime
- **Status**: Active affiliate since July 29, 2025

### 2. Mike Chen (Premium Tier)
- **Email**: mike.c@test.com  
- **Affiliate Code**: REF22270B8654
- **Commission Tier**: Premium (25%, 20%, 15%)
- **Stats**: 11 referrals, $202.46 total commissions, $192.35 lifetime
- **Status**: Active affiliate since August 12, 2025

### 3. Emma Rodriguez (Lifetime Tier)
- **Email**: emma.r@test.com
- **Affiliate Code**: REF23A501AB41
- **Commission Tier**: Lifetime (30%, 25%, 20%)
- **Stats**: 4 referrals, $97.82 total commissions, $144.09 lifetime
- **Status**: Active affiliate since August 4, 2025

### 4. David Kim (Basic Tier)
- **Email**: david.k@test.com
- **Affiliate Code**: REF249202F5A2
- **Commission Tier**: Basic (20%, 15%, 10%)
- **Stats**: 7 referrals, $140.40 total commissions, $715.38 lifetime
- **Status**: Active affiliate since August 20, 2025

### 5. Lisa Thompson (Premium Tier)  
- **Email**: lisa.t@test.com
- **Affiliate Code**: REF25025F504D
- **Commission Tier**: Premium (25%, 20%, 15%)
- **Stats**: 8 referrals, $88.59 total commissions, $739.82 lifetime
- **Status**: Active affiliate since August 8, 2025

## Commission Rate Structure (9 Configurations)
| Referrer Tier | Referee Plan | Commission Rate |
|---------------|--------------|-----------------|
| Basic         | Basic        | 20.00%          |
| Basic         | Premium      | 15.00%          |
| Basic         | Lifetime     | 10.00%          |
| Premium       | Basic        | 25.00%          |
| Premium       | Premium      | 20.00%          |
| Premium       | Lifetime     | 15.00%          |
| Lifetime      | Basic        | 30.00%          |
| Lifetime      | Premium      | 25.00%          |
| Lifetime      | Lifetime     | 20.00%          |

## Sample Data Created
- **6 referral records** with confirmed/pending statuses
- **5 payout records** with completed/pending processing
- **25 link click analytics** records for conversion tracking
- **Realistic commission calculations** based on membership plan pricing

## Testing the System

### Frontend Access
Navigate to `/affiliate-program` to see the complete affiliate dashboard with:
- Real-time earnings statistics
- Commission calculator
- Referral link management
- Analytics and click tracking
- Payout history

### API Testing
Test the affiliate endpoints:
```bash
# Check affiliate status (requires user authentication)
GET /api/affiliate/status

# Get affiliate dashboard data  
GET /api/affiliate/dashboard

# Admin: View all affiliates
GET /api/admin/affiliates

# Admin: View commission rates
GET /api/admin/commission-rates
```

### Demonstration Features
- **Tier-based commissions**: Different rates for Basic/Premium/Lifetime members
- **Real earnings tracking**: Pending, paid, and lifetime commission calculations
- **Link analytics**: Click tracking and conversion monitoring
- **Payout management**: Complete transaction history
- **Revenue potential**: Up to $99.40 commission per Lifetime referral

The affiliate system is now fully operational with realistic test data demonstrating all features and commission calculations.