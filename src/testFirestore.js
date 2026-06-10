import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function testFirestore() {
  try {
    await addDoc(collection(db, "test"), {
      name: "LifeSync Test",
      createdAt: new Date(),
    });

    alert("Firestore Connected Successfully!");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}