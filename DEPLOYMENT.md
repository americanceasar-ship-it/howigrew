# Production Deployment Guide - HowiGrew LMS Platform

## Overview

This guide covers the complete production deployment process for the HowiGrew real estate education LMS platform. The application is production-ready with comprehensive security, performance optimizations, and monitoring systems.

## Quick Deployment on Replit

### 1. Environment Setup
```bash
# Copy environment template
cp production.env.template .env

# Configure production variables in Replit Secrets:
# - DATABASE_URL (PostgreSQL connection string)
# - STRIPE_SECRET_KEY (Live Stripe secret key)
# - STRIPE_WEBHOOK_SECRET (Stripe webhook signing secret)
```

### 2. Database Setup
```bash
# Push schema to production database
npm run db:push

# Run production optimizations (optional)
psql $DATABASE_URL -f server/database/migrations.sql
```

### 3. Deploy
Click the "Deploy" button in Replit or use:
```bash
npm run build
npm start
```

## Docker Deployment

### 1. Build and Run
```bash
# Build production image
docker build -t howigrew-lms .

# Run with environment variables
docker run -d \
  --name howigrew-lms \
  -p 5000:5000 \
  -e DATABASE_URL="your-db-url" \
  -e STRIPE_SECRET_KEY="your-stripe-key" \
  howigrew-lms
```

### 2. Docker Compose (Recommended)
```bash
# Create .env file with production values
cp production.env.template .env

# Start all services
docker-compose up -d

# With Nginx proxy (production)
docker-compose --profile production up -d
```

## Traditional Server Deployment

### 1. Server Requirements
- **Node.js**: v20 LTS or higher
- **Python**: v3.8+ (for web scraping features)
- **PostgreSQL**: v13+ (or Neon Database)
- **Redis**: v6+ (optional, for caching)
- **Nginx**: v1.20+ (recommended for production)

### 2. Installation Steps
```bash
# Clone repository
git clone https://github.com/your-org/howigrew-lms.git
cd howigrew-lms

# Install dependencies
npm ci --production

# Build application
npm run build

# Set up environment
cp production.env.template .env
# Edit .env with production values

# Run database migrations
npm run db:push
psql $DATABASE_URL -f server/database/migrations.sql

# Start application
npm start
```

### 3. Process Management
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start dist/index.js --name "howigrew-lms"
pm2 startup
pm2 save

# Using systemd
sudo cp howigrew-lms.service /etc/systemd/system/
sudo systemctl enable howigrew-lms
sudo systemctl start howigrew-lms
```

## Nginx Configuration

### 1. Basic Setup
```bash
# Copy configuration
sudo cp nginx.conf /etc/nginx/sites-available/howigrew.com
sudo ln -s /etc/nginx/sites-available/howigrew.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. SSL Configuration
```bash
# Using Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d howigrew.com -d www.howigrew.com

# Automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Environment Variables

### Required Variables
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optional Variables
```env
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@howigrew.com
SMTP_PASS=your-app-password
SESSION_SECRET=your-session-secret
RATE_LIMIT_MAX_REQUESTS=100
CACHE_TTL=3600
```

## Performance Optimizations

### 1. Database Optimizations
```sql
-- Apply production indexes (already included in migrations.sql)
-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
WHERE mean_time > 100 
ORDER BY mean_time DESC 
LIMIT 10;

-- Update statistics weekly
ANALYZE;
```

### 2. Caching Strategy
- **In-Memory**: Application-level caching for API responses
- **CDN**: Static assets (images, CSS, JS) via CDN
- **Redis**: Session storage and advanced caching (optional)
- **HTTP**: Browser caching headers for optimal performance

### 3. Monitoring Setup
```bash
# Health check endpoint
curl https://howigrew.com/health

# Performance metrics (admin only)
curl -H "x-user-email: admin@howigrew.com" https://howigrew.com/api/metrics

# Database status
curl https://howigrew.com/api/status
```

## Security Configuration

### 1. Firewall Setup
```bash
# Ubuntu/Debian
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# Block direct application port
sudo ufw deny 5000
```

### 2. SSL/TLS Configuration
- **Minimum TLS 1.2** required
- **Strong cipher suites** configured in Nginx
- **HSTS headers** enabled
- **Certificate transparency** monitoring

### 3. Application Security
- **Rate limiting**: 100 requests per 15 minutes per IP
- **Authentication rate limiting**: 5 attempts per 15 minutes
- **CORS protection**: Configured for production domain
- **Security headers**: XSS, clickjacking, and content-type protection
- **Input validation**: Comprehensive Zod schema validation
- **SQL injection protection**: ORM-based queries only

## Monitoring and Maintenance

### 1. Health Monitoring
```bash
# Application health
curl -f https://howigrew.com/health || exit 1

# Database connectivity
curl -f https://howigrew.com/api/status || exit 1

# Performance metrics
curl -H "x-user-email: admin@howigrew.com" https://howigrew.com/api/metrics
```

### 2. Log Management
```bash
# Application logs
pm2 logs howigrew-lms

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u howigrew-lms -f
```

### 3. Backup Strategy
```bash
# Database backup (daily)
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/howigrew"
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/db-$DATE.sql.gz
find $BACKUP_DIR -name "db-*.sql.gz" -mtime +30 -delete
```

### 4. Maintenance Tasks
```bash
# Weekly database maintenance
psql $DATABASE_URL -c "ANALYZE;"

# Monthly index rebuild (during low traffic)
psql $DATABASE_URL -c "REINDEX DATABASE;"

# Clean up old sessions/logs
# (implement based on your retention policy)
```

## Scaling Considerations

### 1. Horizontal Scaling
- **Load balancer**: Multiple application instances behind Nginx
- **Database**: Read replicas for query optimization
- **Session storage**: Redis for shared sessions across instances
- **File storage**: S3 or similar for user-uploaded content

### 2. Performance Monitoring
- **Application metrics**: Response times, error rates, throughput
- **Database metrics**: Query performance, connection pools, locks
- **System metrics**: CPU, memory, disk I/O, network
- **User metrics**: Page load times, conversion rates

### 3. Auto-scaling Setup
```yaml
# Example Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: howigrew-lms-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: howigrew-lms
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check database connectivity
   psql $DATABASE_URL -c "SELECT 1;"
   
   # Verify connection string format
   echo $DATABASE_URL
   ```

2. **High Memory Usage**
   ```bash
   # Monitor memory usage
   curl https://howigrew.com/api/metrics
   
   # Restart application if needed
   pm2 restart howigrew-lms
   ```

3. **Slow Performance**
   ```bash
   # Check slow queries
   psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"
   
   # Monitor cache hit rates
   curl https://howigrew.com/api/metrics
   ```

### Support Contacts
- **Technical Issues**: Create issue on GitHub repository
- **Database Problems**: Check Neon Database dashboard
- **Payment Issues**: Verify Stripe webhook configuration
- **Performance**: Review monitoring metrics and logs

## Production Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database schema deployed and optimized
- [ ] SSL certificates installed and configured
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] Security headers and rate limiting configured

### Post-Deployment
- [ ] Health checks passing
- [ ] Performance metrics within acceptable ranges
- [ ] User registration and course enrollment working
- [ ] Payment processing functional (test with small amount)
- [ ] Email notifications working (if configured)
- [ ] Forum functionality operational
- [ ] Mobile responsiveness verified

### Ongoing Maintenance
- [ ] Weekly database analysis and cleanup
- [ ] Monthly security updates and patches
- [ ] Quarterly performance review and optimization
- [ ] Regular backup verification and disaster recovery testing

---

**Production Status**: ✅ Ready for deployment with enterprise-grade security, performance, and monitoring systems.