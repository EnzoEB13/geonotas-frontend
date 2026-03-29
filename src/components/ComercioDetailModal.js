import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { RUBRO_ICONS, RUBRO_LABELS } from "../constants/rubros";
import AreaBadge from "./AreaBadge";

export default function ComercioDetailModal({
  visible,
  comercio,
  onClose,
  onEdit,
  onDelete,
  onRestore,
  inactive = false,
}) {
  const insets = useSafeAreaInsets();

  if (!comercio) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 14) + 8,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            <View style={styles.topRow}>
              <Image source={RUBRO_ICONS[comercio.rubro]} style={styles.icon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{comercio.nombre}</Text>
                <Text style={styles.meta}>{RUBRO_LABELS[comercio.rubro]}</Text>
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <AreaBadge area={comercio.area} />
            </View>

            <Text style={styles.label}>Habilitación</Text>
            <Text style={styles.value}>{comercio.habilitacion ? "Sí" : "No"}</Text>

            <Text style={styles.label}>Descripción</Text>
            <Text style={styles.value}>
              {comercio.descripcion?.trim() ? comercio.descripcion : "Sin descripción"}
            </Text>

            <Text style={styles.label}>Ubicación</Text>
            <Text style={styles.value}>
              Latitud: {comercio.ubicacion?.latitude?.toFixed(6)}
            </Text>
            <Text style={styles.value}>
              Longitud: {comercio.ubicacion?.longitude?.toFixed(6)}
            </Text>

            <View style={styles.actions}>
              {!inactive ? (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => {
                      onClose?.();
                      onEdit?.(comercio);
                    }}
                  >
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => {
                      onClose?.();
                      onDelete?.(comercio);
                    }}
                  >
                    <Text style={styles.actionButtonText}>Desactivar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.restoreButton]}
                  onPress={() => {
                    onClose?.();
                    onRestore?.(comercio);
                  }}
                >
                  <Text style={styles.actionButtonText}>Reactivar</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 18,
    maxHeight: "80%",
  },
  scrollContent: {
    paddingBottom: 4,
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  icon: {
    width: 52,
    height: 52,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  meta: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  label: {
    marginTop: 14,
    marginBottom: 4,
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "700",
  },
  value: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
  },
  restoreButton: {
    backgroundColor: COLORS.success,
    flex: 1,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: "#EEF2F7",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 15,
  },
});