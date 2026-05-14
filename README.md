# Shop Mart - React Native Application

A high-performance, lightweight e-commerce mobile application built with React Native CLI.

## 🚀 App Functionality

- **Product Discovery**: Browse a wide range of products fetched from a public API.
- **Search & Filter**: Real-time search functionality to find specific items quickly.
- **Infinite Scrolling**: Optimized pagination using `FlatList` for a smooth browsing experience.
- **Product Details**: Detailed view for every item including descriptions and pricing.
- **Cart Management**: Add/remove items from the cart with real-time total price calculation.
- **State Persistence**: Your cart and app state are saved locally, ensuring data isn't lost after an app restart.

## 🛠️ How to Run the Project

### Prerequisites
- Node.js (>= 20)
- Android Studio (for Android) / Xcode (for iOS)
- CocoaPods (for iOS only)

### Setup Steps
1. **Install Dependencies**:
   ```sh
   npm install
   ```

2. **iOS Specific Setup** (Mac only):
   ```sh
   cd ios && pod install && cd ..
   ```

3. **Start Metro Bundler**:
   ```sh
   npm start
   ```

4. **Run on Device/Emulator**:
   - **Android**: `npm run android`
   - **iOS**: `npm run ios`

## 🧠 Key Technical Decisions

- **Bare React Native**: Migrated from Expo to a bare React Native CLI project to gain full control over native modules and optimize build sizes.
- **Pure Core Components**: Strictly used core React Native components (`View`, `Text`, `FlatList`, etc.) instead of third-party UI libraries. This ensures maximum performance, smaller bundle size, and a consistent look across platforms.
- **Redux Toolkit**: Chosen for state management to handle complex cart logic and product caching with minimal boilerplate.
- **Local Persistence**: Implemented `AsyncStorage` alongside a custom lifecycle hook to ensure user data (like the cart) persists across sessions.
- **TypeScript**: Used throughout the project for type safety, reducing runtime errors and improving developer experience.

## 📈 Future Improvements

With more time, I would implement the following:
- **Unit & Integration Testing**: Add Jest and React Native Testing Library suites to ensure component reliability.
- **Skeleton Loaders**: Replace the standard `ActivityIndicator` with modern skeleton screens for a more premium "loading" feel.
- **Enhanced UX**: Implement smooth micro-animations using `react-native-reanimated` for transitions and cart interactions.
- **Offline Support**: Cache API responses more aggressively to allow basic browsing even without an internet connection.
- **User Authentication**: Add a secure login flow and user profile management.
