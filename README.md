# reci-p.ai

Reverse-engineer any packaged recipe – snap or upload a photo, and let OCR + Gemini AI do the rest!


## What is reci-p.ai?

reci-p.ai is a full-stack React Native & Expo app that lets you **take** or **upload** a picture of any packaged food label (e.g. a frozen dinner, snack bar or ready-meal) and instantly get back a fresh, home-cookable recipe – powered by OCR and Google’s Gemini AI.

## Key features

* **Snap or upload**
 Use your phone’s camera or pick an existing photo from your gallery.
* **OCR extraction**
 Text is pulled from labels using a mobile-optimized OCR pipeline.
* **AI-generated recipes**
 Ingredient lists and step-by-step instructions are crafted by Gemini AI.
* **Save & favourite**
 Browse history, star recipes you love and revisit them anytime.
* **Profile & Auth**
 Sign in with Google to keep your recipes in sync across devices.
* **Offline-first UI**
 Cached recipes available even when you’re off the grid.

## Tech stack

**Front-end**

* [Expo](https://expo.dev/) & **React Native**
* [expo-router](https://expo.github.io/router/) for file-based navigation
* `@react-native-google-signin/google-signin` for auth
* `react-native-safe-area-context`, `react-native-modal`, etc.

**Back-end**

* [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* MongoDB
* Gemini AI API integration (via official SDK or REST)
* Image upload & caching layer

## Prerequisites

* **Node.js & npm** (v16+ recommended)
* **Expo CLI** (`npm install -g expo-cli`)
* A **Google Cloud** OAuth client ID for Google Sign-In
* A **Gemini AI** API key (and any org/project IDs)
* **Android Studio** and/or **Xcode** (for emulators), or a physical device

## Installation

1. **Clone the repo**

 ```bash
 git clone https://github.com/bluesky2006/reci-p.ai.git
 cd reci-p.ai
 ```

2. **Install dependencies**

 ```bash
 # Front-end
 npm install

 # Back-end
 cd backend
 npm install
 ```

3. **Environment variables**
 Create a `.env` in both `app/` and `backend/`, for example:

 ```txt
 # .env
 EXPO_PUBLIC_GEMINI=your-gemini-api-key

 # backend/.env
 PORT=4000
 ```

## Running the app

### Back-end

```bash
cd backend
npm run dev
# → starts Express on http://localhost:4000/api
```

### Front-end (Expo)

```bash
cd app
expo start
# → open in Expo Go or on simulators
```

## Contributors

**reci-p.ai** was made as a group project on the Northcoders Javascript Software Development Bootcamp by the following people:

- Simon Busby [@bluesky2006](https://github.com/bluesky2006)  
- Samin Taseen [@Darkon101](https://github.com/Darkon101)  
- Lauren Evans [@laureneyfs](https://github.com/laureneyfs)  
- Florin Patroescu [@flor1n-flo](https://github.com/flor1n-flo)
