import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import useStore from "./store/UseStore";
import {
  doc,
  updateDoc,
  getFirestore,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { app } from "./firebaseConfig";

export default function CheckBox(props) {
  const { userStore } = useStore();
  const { item, index } = props;
  const [isCheck, setIsCheck] = React.useState(false);
  const [myItem, setMyItem] = useState(item);

  const db = getFirestore(app);

  const isChecked = () => {
    return (
      myItem?.isChecked?.filter((element) => {
        return element === index;
      }).length > 0
    );
  };

  useEffect(() => {
    isChecked() ? setIsCheck(true) : setIsCheck(false);
  }, []);

  const handleOnPress = async (item) => {
    setIsCheck(!isCheck);

    const agendaRef = doc(db, "agendas", item.id);

    if (isCheck) {
      await updateDoc(agendaRef, {
        isChecked: arrayRemove(index),
      });
      userStore.forceUpdate();
    } else {
      await updateDoc(agendaRef, {
        isChecked: arrayUnion(index),
      });
      userStore.forceUpdate();
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleOnPress(item);
      }}
    >
      <View
        style={{
          width: 25,
          height: 25,
          backgroundColor: isCheck ? "#999" : "white",
          borderColor: "#666",
          borderWidth: 1,
        }}
      />
    </TouchableOpacity>
  );
}
