# 🚀 PostgreSQL Database Setup for Verse Real Estate Platform

This guide will help you set up and connect PostgreSQL with your Verse application.

## 📋 Prerequisites

1. **PostgreSQL installed** on your system
2. **Node.js and npm** installed
3. **Database access credentials**

## 🔧 Setup Steps

### 1. Install PostgreSQL

#### On macOS (using Homebrew):

```bash
brew install postgresql
brew services start postgresql
```

#### On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### On Windows:

Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database and User

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database
CREATE DATABASE verse_db;

# Create user with password
CREATE USER verse_user WITH ENCRYPTED PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE verse_db TO verse_user;

# Exit
\q
```

### 3. Configure Environment Variables

Update your `.env` file with your database credentials:

```env
# Replace with your actual credentials
DATABASE_URL="postgresql://verse_user:your_secure_password@localhost:5432/verse_db?schema=public"

# For production:
# DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

### 4. Install Dependencies

The required packages are already installed:

- `prisma` - Database toolkit
- `@prisma/client` - Database client
- `pg` - PostgreSQL driver
- `@types/pg` - TypeScript types

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run Database Migrations

```bash
npx prisma db push
```

### 7. Initialize Database with Sample Data

```bash
node scripts/init-db.js
```

## 🎯 Database Features

### ✅ **Complete Data Models:**

1. **Projects** - Real estate projects with full details
2. **Users** - User management with roles (Admin, Manager, Viewer)
3. **Map Settings** - Map configuration and visual settings
4. **Theme Settings** - Custom design system settings
5. **System Settings** - Global application settings
6. **Activities** - Audit trail for all user actions
7. **Analytics** - Page views, user behavior, and insights
8. **Project Views** - Individual project view tracking

### 🔄 **Real-time Data Sync:**

- All buttons and forms now save to PostgreSQL
- Real-time updates across the entire application
- Data persistence across browser sessions
- Multi-user support with activity tracking

### 📊 **Analytics Integration:**

- Page view tracking
- Project view counts
- User behavior analytics
- Popular projects analysis
- Traffic source tracking

## 🛠️ Database Commands

### View Database Structure:

```bash
npx prisma studio
```

### Reset Database (Development only):

```bash
npx prisma migrate reset
```

### Backup Database:

```bash
pg_dump -U verse_user -h localhost verse_db > backup.sql
```

### Restore Database:

```bash
psql -U verse_user -h localhost verse_db < backup.sql
```

## 🔧 Troubleshooting

### Connection Issues:

1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check credentials in `.env` file
3. Ensure database exists: `psql -U verse_user -d verse_db`

### Permission Issues:

```sql
-- Grant additional permissions if needed
GRANT ALL ON SCHEMA public TO verse_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO verse_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO verse_user;
```

### Reset Admin Password:

```sql
-- Connect to database
psql -U verse_user -d verse_db

-- Update admin user
UPDATE users SET name = 'Admin User' WHERE email = 'admin@verse.sa';
```

## 🌐 Production Deployment

### Environment Variables for Production:

```env
DATABASE_URL="postgresql://username:password@your-db-host:5432/database_name?schema=public"
NODE_ENV=production
```

### Database Hosting Options:

- **AWS RDS PostgreSQL**
- **Google Cloud SQL**
- **Heroku Postgres**
- **DigitalOcean Managed Databases**
- **Supabase**

## 🔒 Security Best Practices

1. **Use strong passwords** for database users
2. **Enable SSL** for production connections
3. **Restrict database access** to specific IPs
4. **Regular backups** and disaster recovery plan
5. **Monitor database logs** for suspicious activity

## 🎉 What's Connected

Every element in your Verse application is now connected to PostgreSQL:

### 🏠 **Homepage:**

- ✅ Project markers load from database
- ✅ Map settings from database
- ✅ Real-time project data

### 🏢 **Projects Page:**

- ✅ All projects from database
- ✅ Search and filtering with database queries
- ✅ Real-time project updates

### ⚙️ **Admin Panel:**

- ✅ Dashboard analytics from database
- ✅ Project CRUD operations
- ✅ User management
- ✅ Map settings with live updates
- ✅ Theme customization saved to database
- ✅ System settings management
- ✅ Activity logging and audit trail

### 📊 **Analytics:**

- ✅ Real-time view tracking
- ✅ Popular projects analysis
- ✅ User behavior insights
- ✅ Performance metrics

Your Verse Real Estate Platform is now **fully database-powered** with enterprise-grade data management! 🎯
