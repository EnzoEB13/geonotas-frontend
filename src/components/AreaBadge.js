import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AreaBadge({ area }) {
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: area?.color || "#ddd",
          borderColor: area?.borde || "#999",
        },
      ]}
    >
      <Text style={styles.text}>{area?.nombreArea || "Sin área"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
});