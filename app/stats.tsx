import Slider from "@react-native-community/slider"; // Make sure to install this
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useBooks } from "../context/BooksContext";

// Simple progress bar
const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarBackground}>
    <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
  </View>
);

export default function StatsScreen() {
  const { books } = useBooks();
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  const [goalType, setGoalType] = useState<"pages" | "books" | "minutes">("books");
  const [goalAmount, setGoalAmount] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [trackingStarted, setTrackingStarted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [incrementValue, setIncrementValue] = useState<number>(1);

  const startTracking = () => {
    setTrackingStarted(true);
    setStartTime(new Date());
    setProgress(0);
  };

  const clearGoal = () => {
    setTrackingStarted(false);
    setStartTime(null);
    setProgress(0);
  };

  useEffect(() => {
    if (!trackingStarted) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [trackingStarted]);

  const getEndTime = () => {
    if (!startTime) return new Date();
    const end = new Date(startTime);
    if (timeframe === "daily") end.setDate(end.getDate() + 1);
    if (timeframe === "weekly") end.setDate(end.getDate() + 7);
    if (timeframe === "monthly") end.setMonth(end.getMonth() + 1);
    return end;
  };

  const endTime = getEndTime();

  const getTimeLeft = () => {
    if (!trackingStarted) return "";
    const diff = endTime.getTime() - currentTime.getTime();
    if (diff <= 0) return "Time's up!";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s left to reach your goal`;
  };

  const booksInTimeframe = books.filter((book: any) => {
    if (book.status !== "read" || !book.dateRead) return false;
    if (!trackingStarted || !startTime) return false;
    const dateRead = new Date(book.dateRead);
    return dateRead >= startTime && dateRead <= endTime;
  });

  let progressValue = progress;
  if (goalType === "books") progressValue = booksInTimeframe.length;

  const progressPercent = Math.min((progressValue / goalAmount) * 100, 100);
  const goalReached = progressValue >= goalAmount;

  const addProgress = () => {
    if (!goalReached) setProgress((prev) => prev + incrementValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reading Goals</Text>

      {/* To Do: add callendar at the top */}
      <View style={styles.buttonRow}>
        {["daily", "weekly", "monthly"].map((tf) => (
          <TouchableOpacity
            key={tf}
            style={[
              styles.toggleButton,
              timeframe === tf && styles.toggleButtonActive,
              trackingStarted && styles.toggleButtonDisabled,
            ]}
            onPress={() => !trackingStarted && setTimeframe(tf as "daily" | "weekly" | "monthly")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                timeframe === tf && styles.toggleButtonTextActive,
                trackingStarted && styles.toggleButtonTextDisabled,
              ]}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        {["pages", "books", "minutes"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.toggleButton,
              goalType === type && styles.toggleButtonActive,
              trackingStarted && styles.toggleButtonDisabled,
            ]}
            onPress={() => !trackingStarted && setGoalType(type as "pages" | "books" | "minutes")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                goalType === type && styles.toggleButtonTextActive,
                trackingStarted && styles.toggleButtonTextDisabled,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={styles.label}>Goal Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={goalAmount.toString()}
          onChangeText={(text) => setGoalAmount(Number(text))}
        />
      </View>

      {!trackingStarted ? (
        <TouchableOpacity style={styles.startButton} onPress={startTracking}>
          <Text style={styles.buttonText}>Start Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.clearButton} onPress={clearGoal}>
          <Text style={styles.clearButtonText}>Clear Goal</Text>
        </TouchableOpacity>
      )}

      {trackingStarted && (
        <>
          <Text style={styles.progressText}>
            {goalReached
              ? `You've reached your reading goal for this ${timeframe}!`
              : `Progress: ${progressValue} / ${goalAmount} ${goalType}`}
          </Text>
          <ProgressBar progress={progressPercent} />
          {!goalReached && <Text style={styles.remainingText}>{getTimeLeft()}</Text>}

          {goalType !== "books" && !goalReached && (
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.button} onPress={addProgress}>
                <Text style={styles.buttonText}>+{incrementValue} {goalType}</Text>
              </TouchableOpacity>
            </View>
          )}

          {goalType !== "books" && (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>Edit the amount to add: {incrementValue}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={20}
                step={1}
                value={incrementValue}
                onValueChange={setIncrementValue}
                minimumTrackTintColor="#10B981"
                maximumTrackTintColor="#E5E7EB"
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a6c8ff",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#111827",
    fontFamily: 'playfair',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#2563EB",
  },
  toggleButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  toggleButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
  toggleButtonTextActive: {
    color: "#fff",
  },
  toggleButtonTextDisabled: {
    color: "#E5E7EB",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    height: 44,
    backgroundColor: "white",
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  startButton: {
    backgroundColor: "#002ec5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  clearButton: {
    backgroundColor: "#4b7bec",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  remainingText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
    color: "#374151",
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2563EB",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
});
