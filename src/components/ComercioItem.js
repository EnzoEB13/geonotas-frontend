import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";
import { RUBRO_ICONS, RUBRO_LABELS } from "../constants/rubros";
import AreaBadge from "./AreaBadge";

export default function ComercioItem({
  item,
  onEdit,
  onDelete,
  onRestore,
  onPress,
  inactive = false,
}) {
  return (
    <TouchableOpacity activeOpacity={0.92} onPress={() => onPress?.(item)}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Image source={RUBRO_ICONS[item.rubro]} style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.meta}>{RUBRO_LABELS[item.rubro]}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <AreaBadge area={item.area} />
        </View>

        <Text style={styles.label}>Habilitación</Text>
        <Text style={styles.value}>{item.habilitacion ? "Sí" : "No"}</Text>

        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.description}>{item.descripcion || "Sin descripción"}</Text>

        <View style={styles.actions}>
          {!inactive ? (
            <>
              <TouchableOpacity style={[styles.button, styles.edit]} onPress={() => onEdit(item)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.delete]} onPress={() => onDelete(item)}>
                <Text style={styles.buttonText}>Desactivar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.restore]}
              onPress={() => onRestore(item)}
            >
              <Text style={styles.buttonText}>Reactivar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  icon: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },
  meta: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  label: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "700",
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 2,
  },
  description: {
    marginTop: 2,
    color: COLORS.text,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  edit: { backgroundColor: COLORS.primary },
  delete: { backgroundColor: COLORS.danger },
  restore: { backgroundColor: COLORS.success },
  buttonText: {
    color: "white",
    fontWeight: "800",
  },
});