import React, { useState } from "react";
import { View, Pressable, Text, Dimensions } from "react-native";
import { Observer } from "mobx-react";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";
import useStores from "./store/UseStore";

export default function TimerScreen() {
  const { userStore } = useStores();
  const [start, setStart] = useState(false);
  const [reset, setReset] = useState(false);

  const toggleStopwatch = () => {
    setStart(!start);
    setReset(false);
  };

  const resetStopwatch = () => {
    setStart(false);
    setReset(true);
  };

  return (
    <>
      <View style={{ height: Dimensions.get("window").height / 3.5 }} />

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Stopwatch
          laps
          msecs
          start={start}
          reset={reset}
          options={options}
          getMsecs={(time) => {
            console.log(time);
            userStore.setMsecs(time);
          }}
          startTime={userStore.mSecs}
        />
        <Pressable onPress={toggleStopwatch}>
          <Text style={{ fontSize: 30 }}>{!start ? "Start" : "Stop"}</Text>
        </Pressable>

        <Pressable onPress={resetStopwatch}>
          <Text style={{ fontSize: 30 }}>Reset</Text>
        </Pressable>
      </View>
    </>
  );
}

const options = {
  container: {
    backgroundColor: "#000",
    padding: 5,
    borderRadius: 5,
    width: 220,
  },
  text: {
    fontSize: 30,
    color: "#FFF",
    marginLeft: 7,
  },
};
