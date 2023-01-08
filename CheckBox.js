import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CheckBox() {
  const [isCheck, setIsCheck] = React.useState(false);

  return (
    <TouchableOpacity onPress={() => setIsCheck(!isCheck)}>
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
