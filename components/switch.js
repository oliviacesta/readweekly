import React from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

const SWITCH_WIDTH = 50;
const SWITCH_HEIGHT = 25;
const THUMB_SIZE = 20;

const TRACK_ON = "#4b7bec";
const TRACK_OFF = "#ccc";
const THUMB_ON = "#002ec5";
const THUMB_OFF = "#f4f3f4";

export default function StyledSwitch({ value, onValueChange }) {
  const translateX = value ? SWITCH_WIDTH - THUMB_SIZE - 4 : 2;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      style={[
        styles.track,
        { backgroundColor: value ? TRACK_ON : TRACK_OFF },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: value ? THUMB_ON : THUMB_OFF,
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    track: {
      width: SWITCH_WIDTH,
      height: SWITCH_HEIGHT,
      borderRadius: SWITCH_HEIGHT / 2,
      padding: 2,
      justifyContent: "center",
    },
    thumb: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
    },
  });
  
