# DRNKUP Changelog

This document tracks all significant changes, additions, and fixes to the DRNKUP app.

## [Unreleased]

### Added
- Onboarding flow with animated transitions and feature highlights
- Authentication with Google OAuth and Phone OTP
- Group management with invite codes
- Session planning and management
- Drink tracking with customizable prices
- Party games module with "Never Have I Ever"
- Memory capture for quotes, photos, and locations
- Mobile-optimized UI with bottom navigation

### In Progress
- Enhancing onboarding flow animations and transitions
- Improving mobile touch interactions
- Refining authentication error handling

### Planned
- Group chat functionality
- Push notifications
- Map integration for venues and friend locations
- Enhanced photo and video sharing
- Night recap summaries

### Fixed
- Resolved critical merge conflicts in `OnboardingFlow.tsx` and `AuthScreen.tsx` that were preventing the application from starting.
- Corrected component logic and prop mismatches that arose from the merge.

### Changed
- Merged different UI/UX approaches in `OnboardingFlow.tsx` to create a single, more feature-rich and polished user experience, combining parallax effects, animated cards, and a clearer step progression.
- Consolidated authentication logic in `AuthScreen.tsx` to fully support OAuth, phone number, and OTP verification flows in a type-safe manner.

## [0.1.0] - 2023-12-15

### Added
- Initial project setup with Vite, React, and TypeScript
- Core UI components using shadcn/ui and Tailwind CSS
- Basic navigation structure
- Supabase integration for authentication and database
- Mobile-first responsive design

## Development Notes

### Current Focus
- Optimizing the onboarding experience
- Ensuring smooth animations on mobile devices
- Improving gesture controls for swiping and navigation

### Known Issues
- Intermittent authentication issues with phone OTP on some devices
- Performance optimization needed for memory-intensive animations
- Some UI elements need better adaptation for smaller screens

### Technical Debt
- Need to implement proper error boundaries
- Improve test coverage
- Optimize bundle size for faster initial load 