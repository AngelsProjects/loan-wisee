# Loan Wisee

Loan Wisee is a comprehensive loan management platform built with Next.js, Prisma, and TypeScript. It helps users effectively manage loans, borrowers, lenders, and repayment schedules with a modern and responsive UI.

![Loan Wisee Logo](public/android-chrome-192x192.png)

## 📋 Table of Contents

- [Loan Wisee](#loan-wisee)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🏗️ Project Structure](#️-project-structure)
  - [📸 Screenshots](#-screenshots)
    - [Loan Management](#loan-management)
    - [Loan View](#loan-view)
    - [Borrower Profile](#borrower-profile)
    - [Borrowers List](#borrowers-list)
    - [Lenders List](#lenders-list)
    - [Users List](#users-list)
    - [User View](#user-view)
  - [🔍 Prerequisites](#-prerequisites)
  - [🚀 Getting Started](#-getting-started)
  - [⚙️ Environment Setup](#️-environment-setup)
  - [🗃️ Database Schema](#️-database-schema)
    - [Workflow](#workflow)
  - [📜 Available Scripts](#-available-scripts)
  - [🌐 API Routes](#-api-routes)
  - [🛣️ Roadmap](#️-roadmap)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## ✨ Features

- **User Management**: Create, update, and manage user accounts
- **Borrower & Lender Profiles**: Detailed profiles for loan participants
- **Loan Management**: Create, track, and manage loans with customizable terms
- **Repayment Scheduling**: Automatic generation of repayment schedules
- **Role-Based Access Control**: Different permissions for users, admins, lenders, and borrowers
- **Responsive UI**: Built with modern Tailwind CSS and shadcn/ui components
- **Dark/Light Mode**: Fully themeable interface

## 🏗️ Project Structure

```
loan-wisee
├── prisma               # Database schema and migrations
├── public               # Static assets
├── src
│   ├── app              # Next.js App Router pages and API routes
│   │   ├── api          # Backend API endpoints
│   │   ├── auth         # Authentication pages
│   │   ├── borrowers    # Borrower management pages
│   │   ├── lenders      # Lender management pages
│   │   ├── loans        # Loan management pages
│   │   └── users        # User management pages
│   ├── components       # Reusable React components
│   │   ├── forms        # Form components
│   │   ├── loans        # Loan-specific components
│   │   ├── shared       # Shared UI components
│   │   ├── tags         # Tag components
│   │   ├── ui           # UI components (based on shadcn/ui)
│   │   └── users        # User-specific components
│   ├── config           # Application configuration
│   ├── constants        # Constants and enums
│   ├── hooks            # Custom React hooks
│   ├── lib              # Utility libraries
│   ├── schemas          # Zod validation schemas
│   ├── store            # Redux store configuration
│   ├── styles           # Global styles
│   ├── types            # TypeScript type definitions
│   └── utils            # Utility functions
└── types                # Global type declarations
```

## 📸 Screenshots

Here are some screenshots of the current version of Loan Wisee:

### Loan Management
![Loan List](screenshots/loans-list.png.png)
*Loan management interface with filtering and sorting capabilities*

### Loan View
![Loan View](screenshots/loan-view.png)

### Borrower Profile
![Borrower Profile](screenshots/edit-borrower.png)
*Detailed borrower information and associated loans*

### Borrowers List
![Borrowers List](screenshots/borrowers-list.png)
*Borrower management interface with filtering and sorting capabilities*

### Lenders List
![Lenders List](screenshots/lenders-list.png)
*Lender management interface with filtering and sorting capabilities*

### Users List
![Users List](screenshots/users-list.png)
*User management interface with filtering and sorting capabilities*

### User View
![User View](screenshots/user-view.png)
*User profile information and associated loans*


## 🔍 Prerequisites

- Node.js 22.x
- pnpm 10.6.1 or higher
- PostgreSQL database
- AWS account (for S3 file uploads and SES email services)
- Redis (optional, for caching)

## 🚀 Getting Started

Follow these steps to set up and run the Loan Wisee application:

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/loan-wisee.git
cd loan-wisee
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory (see [Environment Setup](#environment-setup) below).

4. **Start the database**

```bash
docker-compose up -d
```

5. **Run database migrations**

```bash
pnpm migrate
```

6. **Start the development server**

```bash
pnpm dev
```

7. **Access the application**

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/loan_wisee

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_HOST=localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AWS Services
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Misc
SENTRY_SUPPRESS_TURBOPACK_WARNING=1
# CI=true
```

## 🗃️ Database Schema

The Prisma schema defines the following main entities:

- **User**: Base user account with authentication and profile information
- **Borrower**: Profile for users who borrow money, linked to a User
- **Lender**: Profile for users who lend money, linked to a User
- **Loan**: Core entity representing a loan between a borrower and lender
- **RepaymentItem**: Individual repayment entries for each loan
- **Document**: Files associated with loans (contracts, statements, etc.)
- **BorrowerDocument**: Documents specifically for borrowers
- **LoanTag**: Tags for categorizing and filtering loans
- **AuditLog**: Tracking changes to system entities

### Workflow

1. Create a User account
2. Assign the User as either a Borrower or Lender (or both)
3. Create Loans between Borrowers and Lenders
4. Track repayments and loan statuses

## 📜 Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Run the production build
- `pnpm lint` - Check for linting issues
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run Jest tests
- `pnpm test:cov` - Run tests with coverage report
- `pnpm test:watch` - Run tests in watch mode
- `pnpm e2e` - Run Playwright E2E tests
- `pnpm analyze` - Analyze bundle size
- `pnpm migrate` - Run Prisma migrations

## 🌐 API Routes

The application provides the following API endpoints:

- `/api/auth/*` - Authentication endpoints (Next Auth)
- `/api/users` - User management
- `/api/borrowers` - Borrower profile management
- `/api/lenders` - Lender profile management
- `/api/loans` - Loan management
- `/api/loan-tags` - Loan tag management

## 🛣️ Roadmap

The following features are planned for future development:

- [ ] Data caching using Redis
- [ ] Complete authentication flows (registration, password reset)
- [ ] Enhanced role-based access control
- [ ] User account management section
- [ ] Bug fixes for forms and views
- [ ] File upload functionality using AWS S3
- [ ] Document management for loans and borrowers
- [ ] Comprehensive unit and E2E tests
- [ ] Dashboard with analytics and reporting
- [ ] Email notifications for loan status changes
- [ ] Mobile responsive improvements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by [Miguel Angel Arciniega Loaiza](mailto:angel@arciniega.io)