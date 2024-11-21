import React, { useState, useCallback } from "react";
import { useControl, Marker } from "react-map-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";

export default function GeocoderControl({
  mapboxAccessToken,
  position,
  defaultMarkerPosition = { longitude: 68.26058938477357, latitude: 25.408392622667222 },
  onLoading = () => {},
  onResults = () => {},
  onResult = () => {},
  onError = () => {},
  marker,
  setShowCustomName,
  ...props
}) {
  const [markerPosition, setMarkerPosition] = useState(defaultMarkerPosition);

  const onMarkerDragStart = useCallback((event) => {
    console.log("Marker drag started:", event.lngLat);
    setShowCustomName(true)
  }, []);

  const onMarkerDrag = useCallback((event) => {
    console.log("Marker dragging:", event.lngLat);
    setMarkerPosition({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    console.log("Marker drag ended:", event.lngLat);
    setMarkerPosition({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

  const geocoder = useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        marker: false, // Disable Geocoder's internal marker
        accessToken: mapboxAccessToken,
        mapboxgl,
      });

      ctrl.on("loading", onLoading);
      ctrl.on("results", onResults);
      ctrl.on("result", (evt) => {
        onResult(evt);
        const { result } = evt;

        // Extract the location from the geocoder result
        const location = result?.center || (result.geometry?.type === "Point" && result.geometry.coordinates);
        if (location) {
          setMarkerPosition({
            longitude: location[0],
            latitude: location[1],
          });
        }
      });

      ctrl.on("error", onError);
      return ctrl;
    },
    { position }
  );

  return (
    <>
      {marker && (
        <Marker
          longitude={markerPosition.longitude}
          latitude={markerPosition.latitude}
          draggable
          onDragStart={onMarkerDragStart}
          onDrag={onMarkerDrag}
          onDragEnd={onMarkerDragEnd}
        />
      )}
    </>
  );
}
