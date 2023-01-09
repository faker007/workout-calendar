import { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Pedometer } from "expo-sensors";

export default function PedometerScreen() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();

    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();

      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);

      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    const subscription = subscribe();

    return () => subscription && subscription.remove();
  }, []);

  useEffect(() => {
    console.log("isPedometerAvailable:" + isPedometerAvailable);
  }, [isPedometerAvailable]);

  return (
    <SafeAreaView style={styles.container}>
      {isPedometerAvailable ? (
        <>
          <View style={{ backgroundColor: "black" }}>
            <Text style={{ fontSize: 24, color: "white" }}>
              Steps Last 24 Hours: {pastStepCount}
            </Text>
          </View>

          <View style={{ height: 40 }} />

          <View style={{ backgroundColor: "black" }}>
            <Text style={{ fontSize: 24, color: "white" }}>
              Current Steps: {currentStepCount}
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={{ backgroundColor: "black" }}>
            <Text style={{ fontSize: 24, color: "white" }}>
              Currently doesn't support pedometer
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
