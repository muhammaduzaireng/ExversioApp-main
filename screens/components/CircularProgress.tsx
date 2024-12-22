import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Circle, Svg } from "react-native-svg";

const CircularProgress = ({ percent }) => {
  const radius = 30; // Radius of the circle
  const strokeWidth = 8; // Width of the border
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const strokeDashoffset = circumference - (percent / 100) * circumference; // Calculate progress

  return (
    <View style={styles.container}>
      <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
        {/* Background Circle */}
        <Circle
          cx={(radius + strokeWidth / 2).toString()}
          cy={(radius + strokeWidth / 2).toString()}
          r={radius.toString()}
          stroke="#999"
          strokeWidth={strokeWidth.toString()}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={(radius + strokeWidth / 2).toString()}
          cy={(radius + strokeWidth / 2).toString()}
          r={radius.toString()}
          stroke="#2EF3DD"
          strokeWidth={strokeWidth.toString()}
          strokeDasharray={circumference.toString()}
          strokeDashoffset={strokeDashoffset.toString()}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      {/* Percentage Text */}
      <Text style={styles.text}>{`${percent}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
});

export default CircularProgress;
