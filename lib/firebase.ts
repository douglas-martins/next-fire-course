import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import { FirebaseConfig } from '../types';

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAqn74wtcu5UBsVs0rBXhVYtdLqWgwGi-E",
  authDomain: "nextfire-9a2c7.firebaseapp.com",
  projectId: "nextfire-9a2c7",
  storageBucket: "nextfire-9a2c7.appspot.com",
  messagingSenderId: "254225324384",
  appId: "1:254225324384:web:71a0001439cf9697772605",
  measurementId: "${config.measurementId}"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username: string) {
  const userRef = firestore.collection('users');
  const query = userRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc: any) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
