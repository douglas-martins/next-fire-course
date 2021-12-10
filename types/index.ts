import { FieldValue } from "firebase/firestore";

export interface FirebaseConfig {
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string,
  measurementId: string
}

export interface Post {
  content: string,
  createdAt: Date | string | FieldValue,
  updatedAt: Date | string | FieldValue,
  heartCount: number,
  published: boolean,
  slug: string,
  uid: string,
  username: string,
  title: string,
}
