# DRNKUP Project Document

## Core Concept
DRNKUP is a mobile-first social planning app designed specifically for nights out and pub crawls, created by someone in the target demographic (age 20) who understands what users actually want. The app helps friends plan, document, and enhance their social outings with features focused on collaboration, memory-making, and practical night-out management - all accessible from their phones during a night out.

## Mobile-First Philosophy
- **Strictly Mobile-Focused**: Designed primarily as a mobile app for on-the-go use during nights out
- **One-Handed Operation**: UI optimized for easy navigation while standing, walking, or in social settings
- **Offline Capabilities**: Essential features work with intermittent connectivity in busy venues
- **Battery-Conscious**: Optimized to minimize battery drain during extended nights out
- **Quick Access**: Bottom navigation and streamlined UI for accessing key features quickly
- **Portable Experience**: Everything needed is accessible from a phone, no desktop required

## Target Audience
- Primary: Young adults 18+ who enjoy social drinking and nights out
- Focus on people who want a more structured, documented approach to planning nights out
- Users who want to move beyond basic messaging apps for event planning
- Friend groups who enjoy pub crawls and venue-hopping

## Key Differentiators
- Created by someone in the target demographic, not a corporate entity
- Specifically designed for nightlife rather than general event planning
- Combines practical planning tools with memory capture and social features
- Focus on the complete night-out experience (before, during, after)
- Truly mobile-first design for actual use during nights out

## Core Values & Priorities
1. **Mobile Accessibility**: Ensuring all features work seamlessly on phones in real nightlife settings
2. **Fun & Social Connection**: Making planning collaborative and engaging
3. **Memory Making**: Capturing moments that might otherwise be forgotten
4. **Practical Utility**: Solving real problems like tracking spending and coordinating venues
5. **User Experience**: Modern, visually appealing design that appeals to the target demographic
6. **Safety**: Promoting responsible fun through features like drink tracking and emergency contacts

## Implemented Features

### Authentication & Onboarding
- Google OAuth and Phone OTP sign-in optimized for mobile
- Engaging onboarding flow with animations and feature highlights
- Profile creation on first sign-in

### Group Management
- Create groups with custom names and emojis
- Unique invite codes for easy friend onboarding
- Friend status tracking (online/offline)
- Group member management

### Session/Event Planning
- Create detailed night-out sessions with time, venue, and settings
- Invite entire groups to sessions
- Organize sessions by upcoming, active, and past
- Set budget types (individual vs. shared) and transportation preferences

### Drink Tracking
- Customize drink types and prices for different venues
- Track individual and group drink counts and spending
- Quick setup with venue presets (Sports Bar, Nightclub)
- Real-time spending updates

### Party Games
- Built-in drinking games like "Never Have I Ever"
- Random question generation
- Interactive game interfaces designed for passing phones around

### Memory Capture
- Save quotes, photos, and location check-ins in the moment
- Timeline view of the night's memories
- Night statistics summary
- Memory sharing options

### UI/UX
- Modern, animated interface with glassmorphism effects
- Mobile-first responsive design with thumb-friendly interaction zones
- Intuitive bottom navigation for one-handed operation
- Visual feedback and animations optimized for mobile screens
- High contrast and readability in dark venue environments

## Planned Features (In Development)

### Communication
- **Group Chat**: In-session chat functionality for real-time communication
- **Push Notifications**: For session invites, updates, and reminders

### Location Services
- **Map Integration**: Visualize venues and friend locations on mobile maps
- **Venue Suggestions**: Based on current location and preferences

### Enhanced Memory Features
- **Photo Gallery**: Dedicated space for night-out photos with mobile camera integration
- **Video Sharing**: Capture and share short videos with privacy controls
- **Night Recap**: Automated summary of the night's activities and stats

### Safety Enhancements
- **Designated Driver Assignment**: Track who's responsible for safe transport
- **Drink Limit Reminders**: Optional notifications when approaching set limits
- **Enhanced Emergency Features**: Quick access to rideshare apps or emergency contacts

## Future Possibilities (Lower Priority)

### Venue Integration
- Allow venues to create official profiles
- Venue-specific promotions for app users
- Featured events from partner establishments

### Monetization Options
- Brand partnerships for sponsored events
- Premium features for power users
- Venue promotion opportunities

### Third-Party Integrations
- Rideshare services (Uber, Lyft) for safe transport home
- Payment splitting apps for group tabs
- Music services for collaborative playlists

## Technical Implementation

### Mobile-Optimized Frontend Stack
- React (TypeScript) with mobile-first component design
- Vite for fast development
- React Router for navigation
- Tanstack Query for efficient data fetching on mobile networks
- Framer Motion for touch-friendly animations
- Tailwind CSS with shadcn/ui components adapted for mobile
- Lucide Icons for consistent visual language

### Backend Services
- Supabase for authentication, database, and storage
- Edge functions for serverless operations
- Real-time subscriptions for live updates
- Optimized data transfer for mobile data usage

### Mobile-Specific Optimizations
- Touch-friendly UI elements throughout
- Offline data persistence for spotty venue connectivity
- Efficient battery usage patterns
- Responsive to device orientation changes
- Adaptive to different mobile screen sizes

### State Management
- React Context for global state (auth, session data)
- Local storage for persistent preferences

## Development Priorities
1. Complete and polish core mobile features
2. Add group chat functionality
3. Implement push notifications
4. Integrate map/location services
5. Enhance memory capture and sharing
6. Explore venue partnerships and monetization (long-term)

## Project Updates Log

### October 2023
- Initial project setup with Vite, React, TypeScript
- Implemented basic UI components using shadcn/ui and Tailwind CSS
- Created authentication flow with Supabase integration

### November 2023
- Developed core onboarding flow with animations
- Implemented group creation and management features
- Added drink tracking functionality with customizable prices

### December 2023
- Added sessions management with invitations
- Implemented memory capture features
- Created party games module with "Never Have I Ever"

### Current Development
- Enhancing onboarding flow with improved animations and transitions
- Optimizing mobile experience with touch-friendly UI elements
- Refining authentication with better error handling and user feedback 