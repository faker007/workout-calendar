import { View, StyleSheet, Text } from "react-native";
import CheckBox from "./CheckBox";

export default function AgendaItem({ item }) {
  const setCount = Array.from({ length: item?.setCount ?? 1 });

  return (
    <View style={styles.item}>
      <View style={{ flexDirection: "column" }}>
        <Text
          style={[
            styles.itemText,
            {
              textDecorationLine:
                item?.isChecked?.length !== item?.setCount
                  ? undefined
                  : "line-through",
            },
          ]}
        >
          {item?.text?.toString()}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text
            style={[
              styles.itemText,
              {
                textDecorationLine:
                  item?.isChecked?.length !== item?.setCount
                    ? undefined
                    : "line-through",
                textAlign: "center",
              },
            ]}
          >
            {item?.weight?.toString()}
          </Text>

          <Text style={{ fontSize: 12, lineHeight: 18, color: "#666" }}>{`${
            item?.weight ? "kg" : ""
          }`}</Text>
        </View>
      </View>

      {/* Spacer */}
      <View style={{ width: 25 }} />

      {setCount.map((element, index) => (
        <>
          <CheckBox item={item} index={index} />

          <View style={{ width: 15 }} />
        </>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 25,
    marginTop: 17,
  },
});
