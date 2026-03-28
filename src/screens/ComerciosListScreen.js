import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import ComercioItem from "../components/ComercioItem";
import ComercioFormModal from "../components/ComercioFormModal";
import ComercioDetailModal from "../components/ComercioDetailModal";
import {
  deleteComercioRequest,
  getComerciosRequest,
  updateComercioRequest,
} from "../api/comercios.api";
import { showError, showSuccess } from "../utils/toast";
import { COLORS } from "../constants/colors";

export default function ComerciosListScreen() {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingComercio, setEditingComercio] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await getComerciosRequest({ activo: true });
      setItems(res.comercios || []);
    } catch (error) {
      showError("Error", "No se pudo cargar la lista");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const grouped = useMemo(() => {
    const map = {};

    for (const item of items) {
      const key = item.area?.nombreArea || "Sin área";
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }

    return Object.entries(map).map(([area, comercios]) => ({
      area,
      comercios,
    }));
  }, [items]);

  const handleDelete = (item) => {
    Alert.alert("Desactivar comercio", `¿Desactivar ${item.nombre}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Desactivar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteComercioRequest(item._id);
            setItems((prev) => prev.filter((x) => x._id !== item._id));

            if (selectedComercio?._id === item._id) {
              setDetailVisible(false);
              setSelectedComercio(null);
            }

            showSuccess("Listo", "Comercio desactivado");
          } catch (error) {
            showError("Error", "No se pudo desactivar");
          }
        },
      },
    ]);
  };

  const handleEdit = (item) => {
    setEditingComercio(item);
    setModalVisible(true);
  };

  const handleOpenDetail = (item) => {
    setSelectedComercio(item);
    setDetailVisible(true);
  };

  const handleEditSubmit = async (payload) => {
    try {
      await updateComercioRequest(editingComercio._id, payload);
      showSuccess("Actualizado", "Comercio actualizado correctamente");
      setModalVisible(false);
      setEditingComercio(null);
      loadData();
    } catch (error) {
      showError("Error", error?.response?.data?.message || "No se pudo actualizar");
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="Comercios" subtitle="Listado agrupado por áreas" />

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.area}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
        renderItem={({ item }) => (
          <View style={styles.group}>
            <Text style={styles.groupTitle}>{item.area}</Text>

            {item.comercios.map((comercio) => (
              <ComercioItem
                key={comercio._id}
                item={comercio}
                onPress={handleOpenDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay comercios activos cargados</Text>
        }
      />

      <ComercioFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingComercio(null);
        }}
        onSubmit={handleEditSubmit}
        selectedArea={editingComercio?.area}
        selectedLocation={editingComercio?.ubicacion}
        editingComercio={editingComercio}
      />

      <ComercioDetailModal
        visible={detailVisible}
        comercio={selectedComercio}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClose={() => {
          setDetailVisible(false);
          setSelectedComercio(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 30 },
  group: { marginBottom: 8 },
  groupTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 30,
  },
});