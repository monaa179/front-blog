# Blog Writer - Automation Platform

A modern, full-stack application for automated blog post generation and management. Built with Nuxt 4, Prisma, and MariaDB, it streamlines the process of creating, versioning, and organizing blog content.

## 🚀 Key Features

- **Article Management**: Create, edit, and organize articles from source URLs or original content.
- **AI-Powered Suggestions**: Integration for generating suggested titles, descriptions, and scores.
- **Version Control**: Built-in system to track and manage different versions of article content.
- **Modules System**: Categorize articles into logical modules for better organization.
- **User Management**: Role-based access control (Admin/User) and profile management.
- **Favorites**: Users can save and quickly access their favorite articles.
- **Modern Dashboard**: Responsive and clean UI featuring Lucide icons and Inter typography.

## � Admin Access

Specifically for administrators:
- **User Management**: Accessible at [`/admin/users`](/admin/users). Allows creating, managing, and deleting user accounts.

## �🛠 Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3)
- **Database ORM**: [Prisma](https://www.prisma.io/) with MariaDB adapter
- **Database**: [MariaDB](https://mariadb.org/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Styling**: Vanilla CSS with custom design system
- **Utility**: [date-fns](https://date-fns.org/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## 📁 Database Schema

The application uses a relational schema with the following main models:

- `Profile`: Handles user accounts, passwords, and roles.
- `Article`: Core entity for blog posts, storing original and suggested metadata.
- `Module`: Allows categorization of articles (Many-to-Many relation).
- `ArticleVersion`: Tracks content history for each article.
- `ArticleFavorite`: Junction table for user bookmarked articles.

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (Latest LTS recommended)
- MariaDB Server

### 2. Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="mysql://user:password@localhost:3306/digiblog"
MAKE_WEBHOOK_URL="your_make_webhook_url"
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations / Sync schema
npx prisma db push
```

### 5. Running the App
```bash
# Development
npm run dev

# Production Build
npm run build
npm run preview
```

## 🔗 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MariaDB connection string |
| `MAKE_WEBHOOK_URL` | Webhook URL for AI generation (Make.com integration) |

---

Developed for **Digiblog** Automation.

