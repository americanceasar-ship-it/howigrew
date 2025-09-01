# Quick Fixes Reference
*Instant solutions for the most common development issues*

## 🔥 Emergency Fixes

### Authentication Issues
```bash
# Dashboard shows wrong user
# Fix: Update MembershipDashboard to use useAuth()
const { user } = useAuth(); // Never hardcode user data
```

### Database Errors
```sql
-- Foreign key constraint violations
-- Delete in order: enrollments → tokens → users
DELETE FROM enrollments WHERE user_id = X;
DELETE FROM email_verification_tokens WHERE user_id = X;
DELETE FROM password_reset_tokens WHERE user_id = X;
DELETE FROM users WHERE id = X;
```

### Undefined Value Errors
```typescript
// Analytics component crashes
// Fix: Add fallback values
value: (Number(data.value) || 0).toFixed(1)
```

## ⚡ Common Fixes

### Wouter Navigation
```tsx
// ✅ Correct
<Link to="/dashboard">Dashboard</Link>
// ❌ Wrong  
<Link href="/dashboard">Dashboard</Link>
```

### Performance Issues
```bash
# Run all optimizations
npm run db:push     # Database indexes
# Enable caching in queryClient (5min)
# Implement lazy loading with intersection observer
```

### TypeScript Errors
```bash
npm run type-check  # Check before commits
# Fix storage interface types
# Use proper Drizzle schema types
```

## 🚀 Environment Setup
```bash
# Required variables
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
NODE_ENV="development"

# Start application
npm install
npm run db:push
npm run dev
```

## 📊 Testing Production Ready
```bash
# Check these work:
1. User registration/login
2. Dashboard shows correct user
3. Admin panel accessible
4. Performance under load
5. Database operations
```

---
*For detailed solutions, see DEVELOPMENT_GUIDE.md and CRITICAL_FIXES_LOG.md*