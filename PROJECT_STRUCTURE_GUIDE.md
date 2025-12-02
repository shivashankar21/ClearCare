# ClearCare Skin Analysis App - Project Structure Guide

Welcome to the ClearCare skin analysis app! This guide explains what each part of the app does in simple, non-technical language, organized like a GitHub repository.

## 🛠️ **Technical Stack**

### Core Technologies
- **React Native with Expo** - Cross-platform mobile app framework that works on both iOS and Android
- **TypeScript** - Enhanced JavaScript with type safety for better code quality
- **Expo Router** - Modern navigation system for seamless screen transitions

### Key Libraries & Tools
- **expo-image** - Optimized image loading and caching for better performance
- **react-native-safe-area-context** - Handles device safe areas (notches, status bars)
- **@expo/vector-icons** - Comprehensive icon library (MaterialIcons, Ionicons, etc.)
- **react-native-paper** - Material Design UI components
- **react-native-reanimated** - Smooth animations and micro-interactions
- **@supabase/supabase-js** - Backend integration for authentication and data storage

### Architecture Pattern
- **Service → Hook → Component Architecture** - Clean separation of data, logic, and UI layers
- **Context Providers** - Global state management for user data and app-wide information
- **Modular Component Design** - Reusable UI components for consistent user experience

### Development Environment
- **OnSpace Platform** - AI-powered development environment with live preview
- **Expo Go** - Real device testing and preview capabilities
- **GitHub Integration** - Version control and collaborative development

## 📁 **app/** - The Main Screens
Think of this as your app's different pages, like chapters in a book.

### 📁 **(tabs)/** - Bottom Navigation Pages
These are the main screens users can navigate between using the bottom tabs:

- **index.tsx** - **Home Screen**: Where users take photos of their skin for analysis
- **knowledge.tsx** - **Skin Care Library**: Educational articles and tips about skin health
- **doctors.tsx** - **Doctor Directory**: Find dermatologists and skin specialists nearby
- **history.tsx** - **Scan History**: View all past skin scans and their results
- **dashboard.tsx** - **Health Dashboard**: Overview of skin health progress and trends
- **profile.tsx** - **User Profile**: Account settings, personal information, and preferences
- **_layout.tsx** - **Tab Controller**: Controls how the bottom navigation tabs look and work

### Other App Files
- **_layout.tsx** - **Main App Wrapper**: The foundation that sets up the entire app
- **admin.tsx** - **Admin Panel**: Special control panel for app administrators
- **index.tsx** - **Welcome/Login Screen**: The first thing users see when opening the app

## 📁 **components/** - Reusable Building Blocks
Like LEGO pieces you can use anywhere in the app. Each component handles a specific part of the user interface:

### Navigation & Layout
- **DropdownNavigation.tsx** - **Top Menu Bar**: The header with logo, app name, and hamburger menu

### Core Features
- **CameraCapture.tsx** - **Camera Interface**: The camera screen for taking skin photos
- **AnalysisResults.tsx** - **Results Display**: Shows skin analysis results after scanning
- **UserDashboard.tsx** - **Main Dashboard**: Summary view of user's skin health data

### User Management
- **LoginScreen.tsx** - **Sign-In Form**: Where users enter their credentials to access the app

### Data Views
- **HistoryList.tsx** - **Scan History List**: Displays all previous skin scans in an organized list
- **DermatologistFinder.tsx** - **Doctor Locator**: Map and list view to find nearby skin specialists
- **KnowledgeBaseScreen.tsx** - **Educational Content**: Articles and information about skin care

### Administration
- **AdminDashboard.tsx** - **Admin Control Panel**: Management interface for app administrators

## 📁 **contexts/** - Global App Memory
Like the app's brain that remembers important information across all screens:

- **AuthContext.tsx** - **User Session Manager**: Remembers if you're logged in, who you are, and your permissions
- **SkinAnalysisContext.tsx** - **Skin Data Manager**: Stores all your skin scan data, results, and analysis history

## 📁 **hooks/** - Smart Helper Functions
Custom tools that make complex tasks easier and more organized:

- **useAuth.tsx** - **Authentication Helper**: Handles login, logout, user verification, and session management
- **useSkinAnalysis.tsx** - **Skin Analysis Helper**: Manages skin scanning, photo processing, and result storage

## 📁 **services/** - Behind-the-Scenes Workers
The invisible helpers that do the heavy lifting and connect to external systems:

### User & Security
- **authService.ts** - **Account Manager**: Handles user registration, login, password reset, and security

### Core Functionality
- **skinAnalysisService.ts** - **AI Analysis Engine**: Processes skin photos and generates detailed health reports
- **dermatologistService.ts** - **Doctor Database**: Manages doctor information, locations, and availability
- **knowledgeBaseService.ts** - **Content Manager**: Organizes educational articles, tips, and skin care information

### Administration
- **adminService.ts** - **Admin Functions**: Manages administrative tasks, user management, and app settings

## 📁 **constants/** - App Rules and Settings
- **types.ts** - **Data Templates**: Defines what kind of information the app expects (like form templates and data structures)

---

## 🔄 How It All Works Together

### User Journey Flow:
1. **App Opens** → User sees login screen (`index.tsx`)
2. **After Login** → `AuthContext` remembers them, shows main navigation tabs
3. **Takes Photo** → `CameraCapture` component → `skinAnalysisService` processes the image
4. **Gets Results** → `AnalysisResults` component displays findings and recommendations
5. **Views History** → `HistoryList` shows all past scans stored in `SkinAnalysisContext`
6. **Navigation** → `DropdownNavigation` lets users jump between different features
7. 

### App Architecture Analogy:
Think of this app like a **digital dermatology clinic**:

- **Screens (app/)** = Different rooms in the clinic (waiting room, examination room, consultation room)
- **Components** = Medical equipment and furniture in each room
- **Services** = Laboratory technicians and specialists doing the analysis work
- **Contexts** = Patient files that follow you throughout your visit
- **Hooks** = Nurses that help coordinate between different departments
- **Constants** = Clinic policies and procedures that everyone follows

### Data Flow:
```
User Input → Components → Hooks → Services → Contexts → Components → User Display
```

This structure ensures that:
- Each part has a specific job
- Information flows smoothly between parts
- The app stays organized and easy to maintain
- New features can be added without breaking existing functionality

---

## 🎯 Key Benefits of This Structure

### For Users:
- **Consistent Experience**: Same look and feel across all screens
- **Fast Performance**: Smart data management reduces loading times
- **Reliable Storage**: Your data is safely stored and easily accessible
- **Smooth Navigation**: Intuitive flow between different app features

### For Developers:
- **Modular Design**: Each component can be updated independently
- **Reusable Code**: Components can be used across multiple screens
- **Easy Maintenance**: Clear separation makes bugs easier to find and fix
- **Scalable Architecture**: New features can be added without major restructuring

This organization follows industry best practices for mobile app development, ensuring a professional, maintainable, and user-friendly application.
