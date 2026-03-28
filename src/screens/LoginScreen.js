import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/icon.png")} style={styles.logo} />


      <Text style={styles.description}>
        Aplicación móvil para rocio, para que pueda registrar sus comercios.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoValue}>Creador por</Text>
        <Text style={styles.infoValue}>Enzo12</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("LoaderEntry")}
      >
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
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
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.text,
  },
  description: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 330,
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 14,
    minWidth: 220,
    alignItems: "center",
    
  },
  infoLabel: {
    color: COLORS.muted,
    fontSize: 13,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
  },
  button: {
    marginTop: 26,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 34,
    paddingVertical: 15,
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});
