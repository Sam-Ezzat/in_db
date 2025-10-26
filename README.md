# Church/Service Management System

# Church Management System

A comprehensive Church Management System built with modern web technologies to help churches manage their members, teams, committees, events, and administrative tasks.

## 🚀 Features

### ✅ Completed Features
- **Multi-Theme System** - 4 beautiful themes (Light Grace, Warm Faith, Nature Hope, Midnight Prayer)
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **People Management** - Complete member directory with search and filters
- **Churches Management** - Manage multiple church locations and congregations
- **Teams Management** - Organize ministry teams with member tracking
- **Committees Management** - Track committee meetings and member assignments
- **User Profile System** - Complete profile management with avatar support
- **Settings Dashboard** - Comprehensive settings with theme switching
- **Navigation System** - Intuitive sidebar navigation with responsive mobile menu

### 🔄 In Development
- Backend API with Node.js/Express
- Database integration with PostgreSQL
- Authentication & Authorization
- Real-time notifications
- Advanced reporting system

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Full type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vite** - Fast build tool with hot module replacement
- **React Router** - Client-side routing with lazy loading
- **React Query** - Server state management (ready for backend integration)
- **Lucide Icons** - Beautiful and consistent icon system

### Backend (Planned)
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **PostgreSQL** - Robust relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security

### Database (Planned)
- **PostgreSQL** - Primary database for all application data
- **Redis** - Caching and session management
- **Database Migrations** - Version-controlled database schema changes

## 📁 Project Structure

```
church-management-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (theme, auth)
│   │   ├── config/         # API configuration and types
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend API (coming soon)
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── package.json        # Backend dependencies
├── database/               # Database schemas and migrations
│   ├── migrations/         # Database migration files
│   ├── seeds/             # Sample data for development
│   └── schemas/           # Database schema definitions
└── docs/                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd church-management-system

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Available Scripts (Frontend)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Themes

The application includes 4 carefully designed themes:

1. **Light Grace** (Purple) - Clean and bright interface with purple accents
2. **Warm Faith** (Orange) - Warm and welcoming colors with orange highlights
3. **Nature Hope** (Green) - Fresh and natural tones with green elements
4. **Midnight Prayer** (Blue) - Calm and peaceful theme with blue tones

Users can switch themes instantly from the profile menu or settings page.

## 📱 Responsive Design

- **Desktop** - Full sidebar navigation with comprehensive layouts
- **Tablet** - Adaptive layouts with collapsible sidebar
- **Mobile** - Hamburger menu with touch-optimized interface

## 🔒 Security & Privacy

This project prioritizes data security and privacy:
- Environment variables for sensitive configuration
- Secure authentication practices (planned)
- Data encryption for sensitive information (planned)
- Regular security audits and updates
- GDPR compliance considerations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for the church community
- Designed for scalability and ease of use
- Focused on modern web standards and best practices

## 📞 Support

For support, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ for the Church Community**

## Project Structure

```
├── frontend/           # React + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript
├── database/          # PostgreSQL schema and migrations
└── docs/             # Documentation
```

## Development Workflow

1. **Frontend Development**: Start with React application and UI components
2. **Backend Development**: API development with Express and database integration
3. **Database Setup**: PostgreSQL schema and data seeding

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend (Coming Soon)
```bash
cd backend
npm install
npm run dev
```

### Database (Coming Soon)
```bash
cd database
# Setup instructions will be provided
```

## Features

- Multi-role management system (Pastor, Leaders, Members)
- People and membership management
- Committee, team, and discipleship group management
- Event scheduling and attendance tracking
- Report generation and evaluation system
- KPI tracking and analytics
- Multi-theme support (4 color themes)
- Arabic/English i18n support

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Query, React Router
- **Backend**: Node.js, Express, TypeScript, Prisma/Knex
- **Database**: PostgreSQL with UUID primary keys
- **Authentication**: JWT with refresh tokens