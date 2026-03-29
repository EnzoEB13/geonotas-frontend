import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { FORMOSA_REGION } from "../utils/map";

const CLOUDINARY_ICON_URIS = {
  Carniceria:
    "https://res.cloudinary.com/dabtnpikz/image/upload/v1774807524/logoCarniceria_uacsmf.png",
  MiniMercado:
    "https://res.cloudinary.com/dabtnpikz/image/upload/v1774807522/logoMercado_ov5jxh.png",
  Polleria:
    "https://res.cloudinary.com/dabtnpikz/image/upload/v1774807522/logoPolleria_fsoevo.png",
  Mixto:
    "https://res.cloudinary.com/dabtnpikz/image/upload/v1774807522/logoMixto_a1ks1v.png",
};

const buildHtml = ({ areas, selectedArea, iconUris }) => {
  const areasJson = JSON.stringify(areas || []);
  const selectedAreaId = JSON.stringify(selectedArea?._id || null);
  const initialRegionJson = JSON.stringify(FORMOSA_REGION);
  const iconUrisJson = JSON.stringify(iconUris || {});

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />
  <style>
    html, body, #map {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: #f8fafc;
      overflow: hidden;
    }

    .temp-marker {
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: #2563eb;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }

    .comercio-marker-img-wrap {
      width: 54px;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
      background: transparent;
    }

    .comercio-marker-img {
      width: 46px;
      height: 46px;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.35));
      background: transparent;
    }

    .leaflet-container {
      font-family: Arial, sans-serif;
      background: #f8fafc;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const areas = ${areasJson};
    const selectedAreaId = ${selectedAreaId};
    const initialRegion = ${initialRegionJson};
    const iconUris = ${iconUrisJson};

    let selectionMode = false;
    let tempMarker = null;
    let comercioMarkers = [];

    const map = L.map("map", {
      zoomControl: true,
      attributionControl: false
    }).setView([initialRegion.latitude, initialRegion.longitude], 12);

    L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=na0w6h3Se8cyYmauGgcn", {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 0,
      attribution: '&copy; MapTiler &copy; OpenStreetMap contributors',
      crossOrigin: true
    }).addTo(map);

    const sendMessage = (payload) => {
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    };

    window.setSelectionMode = function (value) {
      selectionMode = !!value;
    };

    window.setSelectedLocation = function (location) {
      if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
      }

      if (
        location &&
        typeof location.latitude === "number" &&
        typeof location.longitude === "number"
      ) {
        tempMarker = L.marker(
          [location.latitude, location.longitude],
          {
            icon: L.divIcon({
              className: "",
              html: '<div class="temp-marker"></div>',
              iconSize: [18, 18],
              iconAnchor: [9, 9]
            })
          }
        ).addTo(map);
      }
    };

    window.setComercios = function (comercios) {
      comercioMarkers.forEach((marker) => map.removeLayer(marker));
      comercioMarkers = [];

      (comercios || []).forEach((comercio) => {
        const iconUri = iconUris[comercio.rubro] || "";

        const marker = L.marker(
          [comercio.ubicacion.latitude, comercio.ubicacion.longitude],
          {
            icon: L.divIcon({
              className: "",
              html: \`
                <div class="comercio-marker-img-wrap">
                  <img class="comercio-marker-img" src="\${iconUri}" />
                </div>
              \`,
              iconSize: [54, 54],
              iconAnchor: [27, 27]
            })
          }
        ).addTo(map);

        marker.on("click", function () {
          sendMessage({
            type: "selectComercio",
            comercioId: comercio._id
          });
        });

        comercioMarkers.push(marker);
      });
    };

    let selectedPolygonLayer = null;

    areas.forEach((area) => {
      const isSelected = selectedAreaId && area._id === selectedAreaId;

      const polygon = L.polygon(
        area.coordenadas.map((p) => [p.latitude, p.longitude]),
        {
          color: area.borde || "#2563eb",
          fillColor: area.color || "rgba(37,99,235,0.25)",
          fillOpacity: 0.45,
          weight: isSelected ? 4 : 2
        }
      ).addTo(map);

      if (isSelected) {
        selectedPolygonLayer = polygon;
      }

      polygon.on("click", function (e) {
        if (selectionMode) {
          sendMessage({
            type: "selectLocation",
            coordinate: {
              latitude: e.latlng.lat,
              longitude: e.latlng.lng
            }
          });
          return;
        }

        sendMessage({
          type: "selectArea",
          areaId: area._id
        });
      });
    });

    if (selectedPolygonLayer) {
      map.fitBounds(selectedPolygonLayer.getBounds(), {
        padding: [30, 30]
      });
    }

    map.on("click", function (e) {
      if (!selectionMode) return;

      sendMessage({
        type: "selectLocation",
        coordinate: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        }
      });
    });
  </script>
</body>
</html>
  `;
};

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
  const webviewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    injectJavaScript: (script) => {
      webviewRef.current?.injectJavaScript(script);
    },
  }));

  const html = useMemo(() => {
    return buildHtml({
      areas,
      selectedArea,
      iconUris: CLOUDINARY_ICON_URIS,
    });
  }, [areas, selectedArea]);

  const injectCurrentState = () => {
    webviewRef.current?.injectJavaScript(`
      window.setSelectionMode(${JSON.stringify(!!selectionMode)});
      window.setSelectedLocation(${JSON.stringify(selectedLocation || null)});
      window.setComercios(${JSON.stringify(comercios || [])});
      true;
    `);
  };

  useEffect(() => {
    webviewRef.current?.injectJavaScript(`
      window.setSelectionMode(${JSON.stringify(!!selectionMode)});
      true;
    `);
  }, [selectionMode]);

  useEffect(() => {
    webviewRef.current?.injectJavaScript(`
      window.setSelectedLocation(${JSON.stringify(selectedLocation || null)});
      true;
    `);
  }, [selectedLocation]);

  useEffect(() => {
    webviewRef.current?.injectJavaScript(`
      window.setComercios(${JSON.stringify(comercios || [])});
      true;
    `);
  }, [comercios]);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "selectArea") {
        const area = areas.find((item) => item._id === data.areaId);
        if (area) onPressPolygon?.(area);
      }

      if (data.type === "selectLocation") {
        onLongPressMap?.(data.coordinate);
      }

      if (data.type === "selectComercio") {
        const comercio = comercios.find((item) => item._id === data.comercioId);
        if (comercio) onPressComercio?.(comercio);
      }
    } catch (error) {
      console.log("WEBVIEW MAP MESSAGE ERROR:", error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.map}
        onMessage={handleMessage}
        onLoadEnd={injectCurrentState}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        scrollEnabled={false}
      />
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
    backgroundColor: "#F8FAFC",
  },
});