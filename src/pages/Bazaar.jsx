
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function Bazaar() {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, "bazaar"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setItems(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const saveItem = async () => {
    if (!item || !price) {
      alert("Please enter item and price");
      return;
    }

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "bazaar"), {
        item,
        price: Number(price),
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date(),
      });

      setItem("");
      setPrice("");

      loadItems();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "bazaar", id));

      loadItems();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const total = items.reduce(
    (sum, current) => sum + Number(current.price),
    0
  );

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <h1>🛒 Bazaar List</h1>

        <p>
          Logged in as:
          <strong> {auth.currentUser?.email}</strong>
        </p>

        <div>
          <input
            type="text"
            placeholder="Item Name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            style={{
              padding: "10px",
              marginRight: "10px",
            }}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              padding: "10px",
              marginRight: "10px",
            }}
          />

          <button
            onClick={saveItem}
            style={{
              padding: "10px 20px",
            }}
          >
            Save
          </button>
        </div>

        <hr />

        <h2>My Bazaar Items</h2>

        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span>
                {entry.item} - {entry.price} BDT
              </span>

              <button
                onClick={() => deleteItem(entry.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}

        <h2>Total: {total} BDT</h2>
      </div>
    </div>
  );
}

export default Bazaar;
