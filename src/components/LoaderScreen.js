import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";

export default function LoaderScreen({ message = "Cargando datos..." }) {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>GeoNotas</Text>
      <Text style={styles.subtitle}>{message}</Text>
      <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 18 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 8,
    color: COLORS.muted,
    fontSize: 15,
  },
});