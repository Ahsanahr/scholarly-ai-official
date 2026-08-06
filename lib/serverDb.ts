import { collection, getDocs, doc, getDoc, query, where, limit } from "firebase/firestore/lite";
import { db } from "./firebase";

// --- GLOBAL DATABASE (SERVER) ---
// Collections that appear for all users.

const PUBLIC_DOCS_COLLECTION = "public_documents";
const GLOBAL_MODELS_COLLECTION = "global_models";

/**
 * Fetch all public documents (e.g. academic papers) available to everyone.
 */
export async function getPublicDocuments(maxLimit = 50) {
  try {
    const q = query(collection(db, PUBLIC_DOCS_COLLECTION), limit(maxLimit));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching public documents:", error);
    return [];
  }
}

/**
 * Fetch a specific public document by ID.
 */
export async function getPublicDocumentById(documentId: string) {
  try {
    const docRef = doc(db, PUBLIC_DOCS_COLLECTION, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching public document by ID:", error);
    return null;
  }
}

/**
 * Fetch global platform models/tools available to all users.
 */
export async function getGlobalModels() {
  try {
    const snapshot = await getDocs(collection(db, GLOBAL_MODELS_COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching global models:", error);
    return [];
  }
}

/**
 * Fetch all universities.
 */
export async function getUniversities(maxLimit = 50) {
  try {
    const q = query(collection(db, "universities"), limit(maxLimit));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}

/**
 * Fetch all scholarships.
 */
export async function getScholarships(maxLimit = 50) {
  try {
    const q = query(collection(db, "scholarships"), limit(maxLimit));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return [];
  }
}
