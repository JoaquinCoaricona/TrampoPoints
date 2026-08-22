/**
 * Decodifica una cadena Polyline codificada (formato Google / OSRM) en un array de coordenadas [[lat, lng], ...].
 */
export function decodePolyline(encoded) {
  if (!encoded) return [];

  // Soporte para polylines dinámicas en formato mock MOCK_POLYLINE:lat1,lng1;lat2,lng2...
  if (encoded.startsWith('MOCK_POLYLINE:')) {
    const rawPoints = encoded.replace('MOCK_POLYLINE:', '').split(';');
    return rawPoints.map(pt => {
      const [lat, lng] = pt.split(',').map(Number);
      return [lat, lng];
    }).filter(pt => !isNaN(pt[0]) && !isNaN(pt[1]));
  }

  if (encoded === 'ROUTE_POLYLINE') {
    return [
      [-34.6037, -58.3816],
      [-34.6020, -58.3850],
      [-34.6001, -58.3900],
      [-34.5950, -58.3950],
      [-34.5895, -58.3974]
    ];
  }

  let polyline = encoded;
  let index = 0, len = polyline.length;
  let lat = 0, lng = 0;
  const coordinates = [];

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  return coordinates;
}
