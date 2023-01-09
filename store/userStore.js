import { makeAutoObservable } from "mobx";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { app } from "../firebaseConfig";

export const userStore = makeAutoObservable({
  _forceUpdate: 0,
  mSecs: 0,
  setMsecs(time) {
    this.mSecs = time;
  },
  forceUpdate() {
    this._forceUpdate = Math.random();
  },
  setCurrentDate(date) {
    this.date = date;
  },
  myObject: {},
  setMyObject(object) {
    this.myObject = object;
  },
  checkTheBox(originalObject, index) {
    const originalObjectCopy = { ...originalObject };
    const isChecked = originalObjectCopy.isChecked;

    console.log(isChecked);

    if (!isChecked) {
      Object.assign(originalObjectCopy, { isChecked: [index] });
    } else {
      isChecked.push(index);

      Object.assign(originalObjectCopy, { isChecked });
    }

    console.log(originalObjectCopy);

    return originalObjectCopy;
  },
  convertDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month <= 10 ? "0" + month : month}-${
      day <= 10 ? "0" + day : day
    }`;
  },
  async setData({
    uid,
    collectionId,
    date,
    text,
    setCount,
    loopCount,
    isChecked,
  }) {
    const db = getFirestore(app);

    const currentFirestoreRef = doc(db, collectionId, date);
    const docSnap = await getDoc(currentFirestoreRef);

    if (docSnap.exists()) {
      await updateDoc(currentFirestoreRef, {
        data: arrayUnion(content),
      });
    }
  },
});
