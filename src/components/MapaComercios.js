import React, { forwardRef } from "react";
import MapView, { Marker, Polygon } from "react-native-maps";
import { Image, StyleSheet, View } from "react-native";
import { RUBRO_ICONS } from "../constants/rubros";
import { FORMOSA_REGION } from "../utils/map";

const MapaComercios = forwardRef(function MapaComercios(
  {
    areas = [],
    comercios = [],
    selectedArea = null,
    selectedLocation = null,
    selectionMode = false,
    onPressPolygon,
    onLongPressMap,
    onPressComercio,
  },
  ref
) {
  return (
    <View style={styles.wrapper}>
      <MapView
        ref={ref}
        style={styles.map}
        initialRegion={FORMOSA_REGION}
        onLongPress={onLongPressMap}
      >
        {areas.map((area) => {
          const isSelected = selectedArea?._id === area._id;

          return (
            <Polygon
              key={area._id}
              coordinates={area.coordenadas}
              tappable={!selectionMode}
              strokeColor={area.borde}
              fillColor={area.color}
              strokeWidth={isSelected ? 3 : 2}
              onPress={() => {
                if (!selectionMode) onPressPolygon(area);
              }}
            />
          );
        })}

        {comercios.map((comercio) => (
          <Marker
            key={comercio._id}
            coordinate={comercio.ubicacion}
            title={comercio.nombre}
            description={comercio.descripcion || comercio.rubro}
            onPress={() => onPressComercio?.(comercio)}
          >
            <View style={styles.markerBox}>
              <Image source={RUBRO_ICONS[comercio.rubro]} style={styles.markerIcon} />
            </View>
          </Marker>
        ))}

        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Nueva ubicación"
            description="Punto seleccionado"
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
});

export default MapaComercios;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#DDE7F2",
  },
  markerIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});