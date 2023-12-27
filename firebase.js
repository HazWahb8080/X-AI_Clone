import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCC3yFTHrSeWapYWy7AUQ-JfBrVzHgBKA8",
  authDomain: "twitterclone-74ac5.firebaseapp.com",
  projectId: "twitterclone-74ac5",
  storageBucket: "twitterclone-74ac5.appspot.com",
  messagingSenderId: "302680232741",
  appId: "1:302680232741:web:363611fb4a881e6aa9c0cc",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
// const analytics = !getApps().length ? getAnalytics(app) : getApp();

export default app;
export { db, storage };
