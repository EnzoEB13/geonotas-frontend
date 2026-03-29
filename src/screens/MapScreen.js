import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HeaderBar from "../components/HeaderBar";
import LoaderScreen from "../components/LoaderScreen";
import MapaComercios from "../components/MapaComercios";
import ComercioFormModal from "../components/ComercioFormModal";
import ComercioDetailModal from "../components/ComercioDetailModal";

import { getAreasRequest } from "../api/areas.api";
import {
  createComercioRequest,
  deleteComercioRequest,
  getComerciosRequest,
  updateComercioRequest,
} from "../api/comercios.api";

import { COLORS } from "../constants/colors";
import { pointInPolygon } from "../utils/map";
import { showError, showSuccess } from "../utils/toast";

export default function MapScreen() {
  const mapRef = useRef(null);
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const [allActiveComercios, setAllActiveComercios] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [visibleComercios, setVisibleComercios] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);

  const [actionsVisible, setActionsVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingComercio, setEditingComercio] = useState(null);

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState(null);

  const fabBottom = Math.max(insets.bottom, 10) + 72;
  const actionsBottom = fabBottom + 74;

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [areasRes, comerciosRes] = await Promise.all([
        getAreasRequest(),
        getComerciosRequest({ activo: true }),
      ]);

      const areasData = areasRes.areas || [];
      const comerciosData = comerciosRes.comercios || [];

      setAreas(areasData);
      setAllActiveComercios(comerciosData);

      if (selectedArea?._id) {
        const filtered = comerciosData.filter(
          (item) => item.area?._id === selectedArea._id && item.activo !== false
        );
        setVisibleComercios(filtered);
      }
    } catch (error) {
      showError(
        "Error",
        error?.response?.data?.message || "No se pudieron cargar los datos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setEditingComercio(null);
    setSelectedLocation(null);
    setSelectionMode(false);
    setActionsVisible(false);

    const filtered = allActiveComercios.filter(
      (item) => item.area?._id === area._id && item.activo !== false
    );
    setVisibleComercios(filtered);
  };

  const handleEnableSelectionMode = () => {
    if (!selectedArea) {
      showError("Área requerida", "Primero seleccioná un área");
      return;
    }

    setSelectionMode(true);
    setActionsVisible(true);

    showSuccess(
      "Modo selección activado",
      "Tocá dentro del área para marcar la ubicación"
    );
  };

  const handleMapLongPress = (coordinate) => {
    if (!selectionMode) return;

    if (!selectedArea) {
      showError("Área requerida", "Primero seleccioná un área");
      return;
    }

    const inside = pointInPolygon(coordinate, selectedArea.coordenadas);

    if (!inside) {
      showError(
        "Punto inválido",
        "La ubicación debe estar dentro del área seleccionada"
      );
      return;
    }

    setSelectedLocation(coordinate);
    setSelectionMode(false);

    showSuccess(
      "Ubicación seleccionada",
      `${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`
    );
  };

  const handleOpenCreate = () => {
    if (!selectedArea) {
      showError("Área requerida", "Primero tocá un área en el mapa");
      return;
    }

    if (!selectedLocation) {
      showError(
        "Ubicación requerida",
        "Primero tocá 'Seleccionar ubicación' y luego tocá el mapa"
      );
      return;
    }

    setEditingComercio(null);
    setModalVisible(true);
  };

  const handleCreateOrUpdate = async (payload) => {
    try {
      if (editingComercio) {
        await updateComercioRequest(editingComercio._id, payload);
        showSuccess("Éxito", "Comercio actualizado correctamente");
      } else {
        await createComercioRequest(payload);
        showSuccess("Éxito", "Comercio creado correctamente");
      }

      setModalVisible(false);
      setSelectedLocation(null);
      setEditingComercio(null);
      setSelectionMode(false);
      setActionsVisible(false);

      const [areasRes, comerciosRes] = await Promise.all([
        getAreasRequest(),
        getComerciosRequest({ activo: true }),
      ]);

      const areasData = areasRes.areas || [];
      const comerciosData = (comerciosRes.comercios || []).filter(
        (item) => item.activo !== false
      );

      setAreas(areasData);
      setAllActiveComercios(comerciosData);

      if (selectedArea?._id) {
        const filtered = comerciosData.filter(
          (item) => item.area?._id === selectedArea._id
        );
        setVisibleComercios(filtered);
      }
    } catch (error) {
      showError(
        "Error",
        error?.response?.data?.message || "No se pudo guardar el comercio"
      );
    }
  };

  const handleDelete = (comercio) => {
    Alert.alert(
      "Desactivar comercio",
      `¿Querés desactivar ${comercio.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, desactivar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComercioRequest(comercio._id);

              const updatedAll = allActiveComercios.filter(
                (item) => item._id !== comercio._id
              );
              setAllActiveComercios(updatedAll);

              if (selectedArea?._id) {
                const updatedVisible = visibleComercios.filter(
                  (item) => item._id !== comercio._id
                );
                setVisibleComercios(updatedVisible);
              }

              if (selectedComercio?._id === comercio._id) {
                setDetailVisible(false);
                setSelectedComercio(null);
              }

              showSuccess("Listo", "Comercio desactivado");
            } catch (error) {
              showError(
                "Error",
                error?.response?.data?.message || "No se pudo desactivar"
              );
            }
          },
        },
      ]
    );
  };

  const handleEdit = (comercio) => {
    setSelectedArea(comercio.area);
    setSelectedLocation(comercio.ubicacion);
    setEditingComercio(comercio);
    setSelectionMode(false);
    setActionsVisible(true);
    setModalVisible(true);
  };

  const handleShowDetail = (comercio) => {
    setSelectedComercio(comercio);
    setDetailVisible(true);
  };

  if (loading) {
    return <LoaderScreen message="Cargando áreas y comercios..." />;
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Mapa"
        subtitle={
          selectedArea
            ? `Área seleccionada: ${selectedArea.nombreArea}`
            : "Tocá un área para ver sus comercios"
        }
      />

      <MapaComercios
        ref={mapRef}
        areas={areas}
        comercios={visibleComercios}
        selectedArea={selectedArea}
        selectedLocation={selectedLocation}
        selectionMode={selectionMode}
        onPressPolygon={handleSelectArea}
        onLongPressMap={handleMapLongPress}
        onPressComercio={handleShowDetail}
      />

      {actionsVisible && (
        <View style={[styles.floatingCard, { bottom: actionsBottom }]}>
          <Text style={styles.helpText}>
            {!selectedArea
              ? "1. Tocá un área"
              : selectionMode
              ? "2. Tocá dentro del área"
              : !selectedLocation
              ? "2. Tocá Seleccionar ubicación"
              : "3. Ahora tocá Nuevo Comercio"}
          </Text>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              (!selectedArea || selectionMode) && styles.buttonDisabled,
            ]}
            onPress={handleEnableSelectionMode}
            disabled={!selectedArea || selectionMode}
          >
            <Text style={styles.secondaryButtonText}>
              {selectionMode ? "Esperando ubicación..." : "Seleccionar ubicación"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.newButton,
              !selectedLocation && styles.buttonDisabled,
            ]}
            onPress={handleOpenCreate}
            disabled={!selectedLocation}
          >
            <Text style={styles.newButtonText}>Nuevo Comercio</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.fab, { bottom: fabBottom }]}
        onPress={() => {
          if (!selectedArea) {
            showError("Área requerida", "Primero seleccioná un área");
            return;
          }
          setActionsVisible((prev) => !prev);
        }}
      >
        <MaterialCommunityIcons
          name={actionsVisible ? "close" : "plus"}
          size={30}
          color="#fff"
        />
      </TouchableOpacity>

      <ComercioFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingComercio(null);
        }}
        onSubmit={handleCreateOrUpdate}
        selectedArea={selectedArea}
        selectedLocation={selectedLocation}
        editingComercio={editingComercio}
      />

      <ComercioDetailModal
        visible={detailVisible}
        comercio={selectedComercio}
        onClose={() => {
          setDetailVisible(false);
          setSelectedComercio(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        inactive={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  floatingCard: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  helpText: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 18,
  },

  secondaryButton: {
    backgroundColor: "#E8F1FD",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 15,
  },

  newButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  newButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 15,
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  fab: {
    position: "absolute",
    right: 16,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});