import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import ComercioItem from "../components/ComercioItem";
import ComercioDetailModal from "../components/ComercioDetailModal";
import { getComerciosRequest, restoreComercioRequest } from "../api/comercios.api";
import { showError, showSuccess } from "../utils/toast";
import { COLORS } from "../constants/colors";

export default function ComerciosInactivosScreen() {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await getComerciosRequest({ activo: false });
      setItems(res.comercios || []);
    } catch (error) {
      showError("Error", "No se pudo cargar la lista de inactivos");
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

  const handleRestore = async (item) => {
    try {
      await restoreComercioRequest(item._id);
      showSuccess("Listo", "Comercio reactivado");
      loadData();
    } catch (error) {
      showError("Error", "No se pudo reactivar");
    }
  };

  const handleOpenDetail = (item) => {
    setSelectedComercio(item);
    setDetailVisible(true);
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="Desactivados" subtitle="Comercios borrados lógicamente" />

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
                inactive
                onPress={handleOpenDetail}
                onRestore={handleRestore}
              />
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay comercios desactivados</Text>
        }
      />

      <ComercioDetailModal
        visible={detailVisible}
        comercio={selectedComercio}
        inactive
        onRestore={handleRestore}
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