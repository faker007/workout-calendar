import { useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Agenda } from "react-native-calendars";

import { app } from "./firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Agenda
        selected="2022-12-01"
        items={{
          "2022-12-01": [
            { name: "CGV가서 영화보기" },
            { name: "미소야 가서 된장국 정식 먹기" },
            { name: "크린토피아가서 신발 맡기기" },
          ],
          "2022-12-02": [{ name: "글쓰기 작업" }],
        }}
        renderItem={(item, isFirst) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default function App() {
  const auth = getAuth(app);

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        "rlaqjadud195@naver.com",
        "123456kkAA!"
      );

      console.log(userCredential.user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("errorCode:" + errorCode);
      console.log("errorMessage:" + errorMessage);
    }
  };

  useEffect(() => {
    const inner = async () => {
      // await signUp();
    };

    inner();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: "#888",
    fontSize: 16,
  },
});
