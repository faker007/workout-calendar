import React, { useEffect, useState } from "react";
import { View, Pressable, Text, Dimensions } from "react-native";
import { Timer } from "react-native-stopwatch-timer";
import SelectDropdown from "react-native-select-dropdown";

import useStores from "./store/UseStore";

export default function TimerScreen() {
  const { userStore } = useStores();

  const [start, setStart] = useState(false);
  const [reset, setReset] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [timerReset, setTimerReset] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const data = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

  const toggleTimer = () => {
    setTimerStart(!timerStart);
    setTimerReset(false);
  };

  const resetTimer = () => {
    setTimerStart(false);
    setTimerReset(true);
  };

  useEffect(() => {
    console.log("seconds:" + seconds);
    console.log("minutes:" + minutes);

    if (seconds && minutes) {
      setTotalDuration((minutes * 60 + seconds) * 1000);

      resetTimer();
    }
  }, [seconds, minutes]);

  useEffect(() => {
    console.log("totalDuration:" + totalDuration);
  }, [totalDuration]);

  return (
    <>
      <View style={{ height: Dimensions.get("window").height / 3.5 }} />

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Timer
          start={timerStart}
          reset={timerReset}
          options={options}
          totalDuration={totalDuration}
          getTime={(time) => {
            console.log(time);
          }}
        />
        <Pressable onPress={toggleTimer}>
          <Text style={{ fontSize: 30 }}>{!timerStart ? "Start" : "Stop"}</Text>
        </Pressable>

        <Pressable onPress={resetTimer}>
          <Text style={{ fontSize: 30 }}>Reset</Text>
        </Pressable>

        <View style={{ height: 40 }} />

        <SelectDropdown
          data={data}
          onSelect={(selectedItem, index) => {
            setMinutes(Number(selectedItem));
            console.log(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          defaultButtonText={"분을 선택하세요"}
        />

        <SelectDropdown
          data={data}
          onSelect={(selectedItem, index) => {
            setSeconds(Number(selectedItem));

            console.log(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          defaultButtonText={"초를 선택하세요"}
        />
      </View>
    </>
  );
}

const options = {
  container: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    width: 160,
  },
  text: {
    fontSize: 30,
    color: "#FFF",
    marginLeft: 7,
  },
};
