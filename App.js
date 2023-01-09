import { useEffect, useState, createContext } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { Agenda } from "react-native-calendars";

import { app } from "./firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import {
  NavigationContainer,
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SelectDropdown from "react-native-select-dropdown";

import AgendaItem from "./AgendaItem";

import _ from "lodash";

import { Provider, Observer } from "mobx-react";
import store from "./store";
import useStore from "./store/UseStore";

/** Tab Screens */
import TimerScreen from "./TimerScreen";
import PedometerScreen from "./PedometerScreen";

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const CreateScreen = () => {
  const isFocused = useIsFocused();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(true);
  const [text, setText] = useState("");
  const [uid, setUid] = useState("");
  const [setCount, setSetCount] = useState(0);
  const [loopCount, setLoopCount] = useState(0);

  const data = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        setUid(user?.email);
      }
    });

    return () => unsubscribe();
  }, [isFocused]);

  const setData = async ({ collectionId, date, text, setCount, loopCount }) => {
    if (!collectionId || !date) {
      return console.error(
        "CreateScreen: setData(): collectionId or date is null"
      );
    }

    const db = getFirestore(app);

    try {
      await addDoc(collection(db, collectionId), {
        text,
        setCount,
        loopCount,
        date,
        uid,
      });
    } catch (err) {
      console.error(err);
    }
    // }
  };

  const createEvent = async ({ text, setCount, loopCount, date }) => {
    if (!text) {
      return Alert.alert("알림", "내용을 입력해주세요!");
    }

    if (!setCount) {
      return Alert.alert("알림", "세트 수를 입력해주세요!");
    }
    if (!loopCount) {
      return Alert.alert("알림", "반복 수를 입력해주세요!");
    }

    await setData({
      collectionId: "agendas",
      uid,
      date: convertDate(date),
      text,
      setCount,
      loopCount,
    });

    Alert.alert(
      "알림",
      `${convertDate(date)}, "${text}"에 대한 일정이 추가되었습니다!`
    );
  };

  const getData = async (uid, date) => {
    const db = getFirestore(app);

    const querySnapshot = await getDocs(collection(db, uid));

    const currentSize = querySnapshot.size;

    if (!currentSize) {
      console.log("현재 없음");
    } else {
      console.log("현재 있음.");
    }
  };

  // YYYY-MM-DD
  const convertDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;

    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    setMode(currentMode);
    setShow(true);
  };

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ height: 40 }} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 25 }} />

        <Text>선택된 날: {convertDate(date)}</Text>
      </View>

      <View style={{ height: 20 }} />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <View style={{ height: 40 }} />

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, width: 300 }}
        onChange={(event) => {
          setText(event.nativeEvent.text);
        }}
        value={text}
      />

      <View style={{ height: 40 }} />

      <SelectDropdown
        data={data}
        onSelect={(selectedItem, index) => {
          setSetCount(Number(selectedItem));
          console.log(selectedItem, index);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        defaultButtonText={"세트를 선택하세요"}
      />

      <SelectDropdown
        data={data}
        onSelect={(selectedItem, index) => {
          setLoopCount(Number(selectedItem));
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        defaultButtonText={"횟수를 선택하세요"}
      />

      <Pressable
        disabled={!text.length}
        onPress={async () => {
          await createEvent({ text, setCount, loopCount, date });

          setText("");
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: text.length ? "lightblue" : "#666",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "700", color: "white" }}>
            운동 일정 만들기
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const HomeScreen = () => {
  const isFocused = useIsFocused();

  const db = getFirestore(app);

  const [uid, setUid] = useState("");
  const [final, setFinal] = useState({});

  const route = useRoute();

  const { userStore } = useStore();

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        setUid(user?.email);
      }
    });

    return () => unsubscribe();
  }, [isFocused]);

  useEffect(() => {
    const q = query(collection(db, "agendas"), where("uid", "==", uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const agendas = [];

      querySnapshot.forEach((doc) => {
        agendas.push({ ...doc.data(), id: doc.id });
      });

      setFinal(_.groupBy(agendas, "date"));
    });

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    console.log("-".repeat(30));
    console.log(final);
  }, [final]);

  const getData = async (uid) => {
    const tempObj = {};

    if (route?.params?.uid) {
      const tempArray = [];

      const agendasRef = collection(db, "agendas");
      const q = query(agendasRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const { date, loopCount, setCount, text, uid } = doc.data();
        tempArray.push({ ...doc.data(), id: doc.id });
      });

      setFinal(_.groupBy(tempArray, "date"));
    } else {
      if (uid) {
        const tempArray = [];

        const agendasRef = collection(db, "agendas");
        const q = query(agendasRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const { date, loopCount, setCount, text, uid } = doc.data();
          tempArray.push({ ...doc.data(), id: doc.id });
        });

        setFinal(_.groupBy(tempArray, "date"));
      } else {
        console.log("In the HomeScreen");
        console.log("No uid");
      }
    }
  };

  useEffect(() => {
    const inner = async () => {
      await getData(uid);
    };

    inner();
  }, [isFocused, uid, route?.params?.uid]);

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    return `${year}-${month < 10 ? "0" + month : month}-${
      date < 10 ? "0" + date : date
    }`;
  };

  return (
    <Observer>
      {() => (
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />

          <Agenda
            selected={getToday()}
            items={final}
            rowHasChanged={(r1, r2) => {
              return true;
            }}
            renderItem={(item, isFirst) => <AgendaItem item={item} />}
            renderEmptyData={() => {
              return (
                <>
                  <View style={{ height: 225 }} />
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text style={{ fontSize: 24, fontWeight: "700" }}>
                      운동일정이 없어요!
                    </Text>
                  </View>
                </>
              );
            }}
            onDayPress={(day) => {
              console.log("day changed", day);
            }}
          />
        </SafeAreaView>
      )}
    </Observer>
  );
};

const BeforeSignUpScreen = () => {
  const auth = getAuth(app);

  // auth.signOut();

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("SignUp");
      }
    });

    return () => unsubscribe();
  }, [isFocused]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Let's Workout</Text>
    </View>
  );
};

const SignUpScreen = () => {
  const auth = getAuth(app);
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigation.navigate("Home");
    } catch (error) {
      Alert.alert(
        "알림",
        "중복된 이메일거나, 이메일 양식이 맞지 않거나, 강력한 비밀번호를 입력해주세요!"
      );

      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("errorCode:" + errorCode);
      console.log("errorMessage:" + errorMessage);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700", color: "lightgreen" }}>
        Let's Workout 회원가입
      </Text>
      <View style={{ height: 40 }} />

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, width: 300 }}
        placeholder={"test@test.com"}
        onChange={(event) => {
          setEmail(event.nativeEvent.text);
        }}
        autoCapitalize={"none"}
      />

      <View style={{ height: 40 }} />

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, width: 300 }}
        secureTextEntry
        onChange={(event) => {
          setPassword(event.nativeEvent.text);
        }}
        autoCapitalize={"none"}
      />

      <View style={{ height: 40 }} />

      <Pressable
        onPressIn={() => {
          signUp(email, password);
        }}
        disabled={!email || !password}
      >
        <View
          style={{
            width: 300,
            height: 50,
            borderRadius: 20,
            backgroundColor: email && password ? "lightgreen" : "#666",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>
            회원가입 하기
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default function App() {
  return (
    <Provider {...store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="BeforeSignUp"
            component={BeforeSignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={MyTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 30 }} />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
            >
              <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 50 }} />
      </View>
    </>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="bag-suitcase"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Timer"
        component={() => <TimerScreen />}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="timer" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Pedometer"
        component={() => <PedometerScreen />}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="rotate-orbit"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
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
