import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider with requested scopes for Gmail and Google Calendar
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
provider.addScope("https://www.googleapis.com/auth/gmail.send");
provider.addScope("https://www.googleapis.com/auth/calendar");

let isSigningIn = false;
const ACCESS_TOKEN_KEY = "flowstra_google_access_token";
const TOKEN_TIME_KEY = "flowstra_google_token_time";

let cachedAccessToken: string | null = (() => {
  try {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    const timeStr = window.localStorage.getItem(TOKEN_TIME_KEY);
    if (token && timeStr) {
      const time = parseInt(timeStr, 10);
      // Access tokens are valid for 1 hour. Discard if older than 55 minutes to be safe.
      if (Date.now() - time < 55 * 60 * 1000) {
        return token;
      }
    }
  } catch {
    // Ignore
  }
  return null;
})();

interface AuthSubscriber {
  onSuccess?: (user: User, token: string) => void;
  onFailure?: () => void;
}

const subscribers = new Set<AuthSubscriber>();

const notifySuccess = (user: User, token: string) => {
  subscribers.forEach((sub) => {
    if (sub.onSuccess) {
      try {
        sub.onSuccess(user, token);
      } catch (e) {
        console.error("Error in auth subscriber success callback:", e);
      }
    }
  });
};

const notifyFailure = () => {
  subscribers.forEach((sub) => {
    if (sub.onFailure) {
      try {
        sub.onFailure();
      } catch (e) {
        console.error("Error in auth subscriber failure callback:", e);
      }
    }
  });
};

// Set up a single global listener for auth state changes
onAuthStateChanged(auth, async (user: User | null) => {
  if (user) {
    if (cachedAccessToken) {
      notifySuccess(user, cachedAccessToken);
    } else if (!isSigningIn) {
      // Token is not present or expired. Force logout.
      await logout();
    }
  } else {
    cachedAccessToken = null;
    notifyFailure();
  }
});

// Listen to Auth state changes and handle cache
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  const subscriber: AuthSubscriber = { onSuccess: onAuthSuccess, onFailure: onAuthFailure };
  subscribers.add(subscriber);

  // If already logged in and we have a token, notify immediately
  const currentUser = auth.currentUser;
  if (currentUser && cachedAccessToken) {
    if (onAuthSuccess) {
      onAuthSuccess(currentUser, cachedAccessToken);
    }
  } else if (!currentUser && !isSigningIn) {
    if (onAuthFailure) {
      onAuthFailure();
    }
  }

  // Return unsubscribe function
  return () => {
    subscribers.delete(subscriber);
  };
};

// Sign in via Google popup to get OAuth credentials
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to retrieve the Google OAuth access token.");
    }

    cachedAccessToken = credential.accessToken;
    try {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, credential.accessToken);
      window.localStorage.setItem(TOKEN_TIME_KEY, Date.now().toString());
    } catch (e) {
      console.warn("Failed to write token to localStorage:", e);
    }

    // Notify all active subscribers
    notifySuccess(result.user, cachedAccessToken);

    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Firebase Sign In Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(TOKEN_TIME_KEY);
  } catch (e) {
    console.warn("Failed to clear token from localStorage:", e);
  }
  notifyFailure();
};

export const saveLeadToFirestore = async (leadData: {
  email: string;
  name?: string;
  company?: string;
  bottleneck?: string;
  message?: string;
  timestamp: string;
  source?: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "leads"), leadData);
    console.log("Lead successfully stored in Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error storing lead in Firestore:", error);
    throw error;
  }
};
