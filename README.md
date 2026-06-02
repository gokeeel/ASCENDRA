# ASCENDRA - Gamified Digital Wellness Web Application

A modern, interactive web application designed to promote digital wellness through gamification. ASCENDRA combines focus timers, progress tracking, and a virtual creature companion to help users maintain healthy digital habits.

##  Features

- **Focus Timer**: Track and manage focus sessions with customizable timers
- **Virtual Creature Companion**: Interact with an evolving creature that responds to your wellness activities
- **Wellness Modals**: Guided wellness exercises and mindfulness activities
- **Team Collaboration**: Share wellness goals and progress with team members
- **Dashboard**: Comprehensive overview of wellness metrics and progress
- **Profile Management**: Personalized user profiles with wellness preferences
- **Mobile-First Design**: Fully responsive interface optimized for mobile devices
- **Real-time Summary**: Track daily and weekly wellness statistics

##  Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **Sonner** - Toast notifications
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework (via routes)
- **Drizzle ORM** - Type-safe database ORM
- **TypeScript** - Type safety and developer experience

### Build & Dev Tools
- **PostCSS** - CSS processing
- **Vite** - Module bundling and HMR

##  Project Structure

```
Ascendra-main/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # Shadcn UI components
│   │   │   ├── bottom-nav.tsx
│   │   │   ├── creature-display.tsx
│   │   │   ├── focus-timer.tsx
│   │   │   └── wellness-modals.tsx
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and stores
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── vite.config.ts
├── server/                # Backend application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data persistence
│   └── static.ts         # Static file serving
├── shared/               # Shared code
│   └── schema.ts         # Database schema
├── script/               # Build scripts
├── package.json
├── tsconfig.json
├── drizzle.config.ts     # ORM configuration
└── vite.config.ts        # Build configuration
```

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gokeeel/ASCENDRA.git
   cd ASCENDRA-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Initialize database**
   ```bash
   npm run db:migrate
   ```

### Development

Start the development server:
```bash
npm run dev
```

This will:
- Start the Vite dev server on `http://localhost:5173`
- Start the backend server for API requests
- Enable hot module replacement (HMR) for instant updates

### Production Build

Build the project for production:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

##  Pages & Routes

- **Dashboard** (`/dashboard`) - Overview of wellness metrics
- **Focus** (`/focus`) - Focus timer and session management
- **Onboarding** (`/onboarding`) - User setup and preferences
- **Profile** (`/profile`) - User profile and settings
- **Summary** (`/summary`) - Weekly/monthly wellness summary
- **Team** (`/team`) - Team collaboration and shared goals

##  Core Components

### Focus Timer
Interactive timer component for tracking focus sessions with customizable durations and break periods.

### Creature Display
Virtual companion that evolves based on user wellness activities and completed focus sessions.

### Wellness Modals
Modal-based activities including:
- Breathing exercises
- Meditation guides
- Posture reminders
- Hydration alerts

### Mobile Layout
Responsive layout wrapper ensuring optimal experience across all device sizes.

### Bottom Navigation
Navigation bar for easy access to main features on mobile devices.

##  Database

Uses Drizzle ORM for type-safe database operations. Configure your database in `drizzle.config.ts`.

##  API Routes

API endpoints are defined in `server/routes.ts`. Key endpoints include:
- User management
- Focus session tracking
- Wellness activity logging
- Team collaboration features

##  Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request
.


## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- UI components from Shadcn/ui community
- Icons and assets from the community

---

**ASCENDRA** - *Your journey to digital wellness starts here*
