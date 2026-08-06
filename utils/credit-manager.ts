import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export type ActionType = 'Search' | 'SOP' | 'Matchup' | 'Matchup_Quick';

export const ACTION_COSTS: Record<ActionType, number> = {
  Search: 1,
  SOP: 10,
  Matchup: 300,
  Matchup_Quick: 50,
};

const PLAN_HIERARCHY = {
  'free': 1,
  'pro': 2,
  'premier': 3,
  'premium': 3,
  'owner': 99
};

/**
 * Atomically deducts credits from a user's account for a specific action.
 * Returns the updated balance if successful, or throws an error if insufficient credits or plan.
 * Owner role/plan bypasses credit checks and plan limits.
 */
export async function deductCredits(uid: string, action: ActionType): Promise<number> {
  const cost = ACTION_COSTS[action];
  if (!cost) {
    throw new Error(`Invalid action type: ${action}`);
  }

  // Owner/Admin/Demo/Guest bypass token/uid
  if (uid === 'admin-bypass' || uid.startsWith('admin_') || uid === 'owner' || uid === 'demo-user' || uid.startsWith('demo_') || uid === 'guest-user') {
    return 99999;
  }

  const userRef = adminDb.collection('users').doc(uid);

  try {
    const updatedBalance = await adminDb.runTransaction(async (transaction: admin.firestore.Transaction) => {
      const userDoc: any = await transaction.get(userRef);

      let userData = userDoc.exists ? userDoc.data() : null;
      let currentCredits = userData?.credits !== undefined ? userData.credits : 15;
      const currentPlan = (userData?.plan || 'free').toLowerCase();
      const userRole = (userData?.role || '').toLowerCase();

      // Owner role or plan bypasses all deductions and tier restrictions
      if (userRole === 'owner' || userRole === 'admin' || currentPlan === 'owner' || userData?.isOwner === true) {
        return 99999;
      }
      
      if (!userDoc.exists) {
        currentCredits = 15; // Initialize new user with 15 free credits
      }
      
      const planLevel = PLAN_HIERARCHY[currentPlan as keyof typeof PLAN_HIERARCHY] || 1;

      // Tier Access Enforcement
      if ((action === 'Matchup' || action === 'Matchup_Quick') && planLevel < PLAN_HIERARCHY.premium) {
        throw new Error('Match Maker requires the Premium plan.');
      }

      if (currentCredits < cost) {
        throw new Error(`Insufficient credits. Required: ${cost}, Available: ${currentCredits}`);
      }

      const newCredits = currentCredits - cost;

      if (!userDoc.exists) {
        transaction.set(userRef, {
          uid: uid,
          plan: 'free',
          credits: newCredits,
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        transaction.update(userRef, {
          credits: newCredits,
        });
      }

      return newCredits;
    });

    return updatedBalance;
  } catch (error: any) {
    if (error.message && (error.message.includes('default credentials') || error.message.includes('PERMISSION_DENIED'))) {
      const configError = new Error('SERVER CONFIG ERROR: The Next.js backend is missing the Firebase Service Account Key and cannot securely deduct credits. Please add FIREBASE_SERVICE_ACCOUNT_KEY to your .env.local file.');
      console.error(`[CreditManager]`, configError.message);
      throw configError;
    }
    console.error(`[CreditManager] Failed to deduct credits for user ${uid}:`, error.message);
    throw error; // Re-throw to be handled by the API route
  }
}
