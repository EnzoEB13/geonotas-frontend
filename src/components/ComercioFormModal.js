import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { RUBRO_ICONS, RUBRO_LABELS, RUBROS } from "../constants/rubros";

const initialState = {
  nombre: "",
  descripcion: "",
  rubro: "Carniceria",
  habilitacion: false,
};

export default function ComercioFormModal({
  visible,
  onClose,
  onSubmit,
  selectedArea,
  selectedLocation,
  editingComercio,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingComercio) {
      setForm({
        nombre: editingComercio.nombre || "",
        descripcion: editingComercio.descripcion || "",
        rubro: editingComercio.rubro || "Carniceria",
        habilitacion: !!editingComercio.habilitacion,
      });
    } else {
      setForm(initialState);
    }
  }, [editingComercio, visible]);

  const iconSource = useMemo(() => RUBRO_ICONS[form.rubro], [form.rubro]);

  const handleSave = () => {
    if (!form.nombre.trim()) return;
    if (!selectedArea?._id) return;
    if (
      typeof selectedLocation?.latitude !== "number" ||
      typeof selectedLocation?.longitude !== "number"
    ) {
      return;
    }

    onSubmit({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      rubro: form.rubro,
      habilitacion: form.habilitacion,
      ubicacion: selectedLocation,
      area: selectedArea._id,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              {editingComercio ? "Editar Comercio" : "Nuevo Comercio"}
            </Text>
            <Text style={styles.subtitle}>
              {selectedArea?.nombreArea || "Seleccioná un área"}
            </Text>

            <Text style={styles.label}>Nombre del comercio</Text>
            <TextInput
              value={form.nombre}
              onChangeText={(text) => setForm((prev) => ({ ...prev, nombre: text }))}
              placeholder="Ej: Almacén San José"
              style={styles.input}
            />

            <Text style={styles.label}>Rubro</Text>
            <View style={styles.rubrosContainer}>
              {RUBROS.map((rubro) => {
                const active = form.rubro === rubro;

                return (
                  <TouchableOpacity
                    key={rubro}
                    style={[styles.rubroChip, active && styles.rubroChipActive]}
                    onPress={() => setForm((prev) => ({ ...prev, rubro }))}
                  >
                    <Text
                      style={[
                        styles.rubroChipText,
                        active && styles.rubroChipTextActive,
                      ]}
                    >
                      {RUBRO_LABELS[rubro]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Vista previa del ícono</Text>
              <Image source={iconSource} style={styles.previewIcon} />
            </View>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.label}>Habilitación</Text>
                <Text style={styles.switchHint}>{form.habilitacion ? "Sí" : "No"}</Text>
              </View>
              <Switch
                value={form.habilitacion}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, habilitacion: value }))
                }
              />
            </View>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              value={form.descripcion}
              onChangeText={(text) => setForm((prev) => ({ ...prev, descripcion: text }))}
              placeholder="Descripción del comercio"
              style={[styles.input, styles.textarea]}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.label}>Ubicación elegida</Text>
            <View style={styles.locationBox}>
              <Text style={styles.locationText}>
                {selectedLocation?.latitude?.toFixed(6) || "-"},{" "}
                {selectedLocation?.longitude?.toFixed(6) || "-"}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave}>
                <Text style={styles.saveText}>
                  {editingComercio ? "Guardar cambios" : "Crear comercio"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "88%",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 7,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
  },
  textarea: {
    minHeight: 100,
  },
  rubrosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  rubroChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#EEF5FF",
    borderWidth: 1,
    borderColor: "#D6E7FF",
  },
  rubroChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rubroChipText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  rubroChipTextActive: {
    color: "white",
  },
  previewCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 8,
  },
  previewIcon: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },
  switchRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchHint: {
    color: COLORS.muted,
    marginTop: 2,
  },
  locationBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
  },
  locationText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#EEF2F7",
  },
  save: {
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    color: COLORS.text,
    fontWeight: "800",
  },
  saveText: {
    color: "white",
    fontWeight: "800",
  },
});