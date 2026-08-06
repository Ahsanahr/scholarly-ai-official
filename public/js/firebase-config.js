/**
 * ScholarPath AI — Firebase Configuration
 * ----------------------------------------------------
 * Replace the placeholder values below with your project credentials
 * from the Firebase Console (Project Settings -> General -> Web Apps).
 */

const firebaseConfig = {
    apiKey: "AIzaSyDPcZ9joCbxr6MPaYmVgjxhDFjY53LWcQo",
    authDomain: "trazo-scholary.firebaseapp.com",
    projectId: "trazo-scholary",
    storageBucket: "trazo-scholary.firebasestorage.app",
    messagingSenderId: "677683802351",
    appId: "1:677683802351:web:a82817e2e7ba74c1366b1a",
    measurementId: "G-WYTQBCPY2R"
};

/**
 * Checks whether user has replaced the default placeholders with real Firebase credentials.
 */
function isFirebaseConfigured() {
    return firebaseConfig.apiKey && 
           firebaseConfig.apiKey !== "YOUR_API_KEY" && 
           !firebaseConfig.apiKey.includes("YOUR_");
}

// Initialize Firebase App if SDK is loaded
if (typeof firebase !== 'undefined') {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("ScholarPath AI: Firebase initialized successfully.");
        }
    } catch (error) {
        console.error("ScholarPath AI: Firebase initialization failed:", error);
    }
} else {
    console.warn("ScholarPath AI: Firebase SDK script not loaded.");
}
