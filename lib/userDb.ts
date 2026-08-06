import { collection, getDocs, doc, getDoc, query, where, setDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore/lite";
import { db } from "./firebase";

// --- PRIVATE DATABASE (USER) ---
// Collections that appear for user to user (Private/Scoped).

const USERS_COLLECTION = "users";
const USER_LIBRARY_COLLECTION = "user_library";
const CHATS_COLLECTION = "user_chats";

/**
 * Fetch a specific user's profile.
 */
export async function getUserProfile(userId: string) {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Create or update a user's profile.
 */
export async function saveUserProfile(userId: string, data: any) {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    return false;
  }
}

/**
 * Fetch a user's personal library (saved documents, personal uploads).
 */
export async function getUserLibrary(userId: string) {
  try {
    const q = query(collection(db, USER_LIBRARY_COLLECTION), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user library:", error);
    return [];
  }
}

/**
 * Fetch a user's chat history.
 */
export async function getUserChats(userId: string) {
  try {
    const q = query(collection(db, CHATS_COLLECTION), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
}

/**
 * Save a new chat message or start a new chat.
 */
export async function saveUserChat(userId: string, chatData: any) {
  try {
    const chatRef = await addDoc(collection(db, CHATS_COLLECTION), {
      ...chatData,
      userId,
      createdAt: serverTimestamp()
    });
    return chatRef.id;
  } catch (error) {
    console.error("Error saving user chat:", error);
    return null;
  }
}

/**
 * Update user's email and other personal profile data.
 * Note: If using Firebase Auth, you must ALSO update the email in Firebase Auth separately.
 */
export async function updateUserEmailAndProfile(userId: string, newEmail: string, otherData: any = {}) {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(docRef, { 
      email: newEmail,
      ...otherData, 
      updatedAt: serverTimestamp() 
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating user email and profile:", error);
    return false;
  }
}
