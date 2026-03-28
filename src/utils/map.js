export const FORMOSA_REGION = {
  latitude: -26.1775,
  longitude: -58.1781,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export const getCenterOfPolygon = (coordinates = []) => {
  if (!coordinates.length) {
    return {
      latitude: -26.1775,
      longitude: -58.1781,
    };
  }

  const total = coordinates.reduce(
    (acc, curr) => {
      acc.latitude += curr.latitude;
      acc.longitude += curr.longitude;
      return acc;
    },
    { latitude: 0, longitude: 0 }
  );

  return {
    latitude: total.latitude / coordinates.length,
    longitude: total.longitude / coordinates.length,
  };
};

export const getRegionFromPolygon = (coordinates = []) => {
  if (!coordinates.length) {
    return FORMOSA_REGION;
  }

  const latitudes = coordinates.map((p) => p.latitude);
  const longitudes = coordinates.map((p) => p.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.25, 0.02),
    longitudeDelta: Math.max((maxLng - minLng) * 1.25, 0.02),
  };
};

export const pointInPolygon = (point, polygon = []) => {
  const x = point.longitude;
  const y = point.latitude;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].longitude;
    const yi = polygon[i].latitude;
    const xj = polygon[j].longitude;
    const yj = polygon[j].latitude;

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.0000001) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};