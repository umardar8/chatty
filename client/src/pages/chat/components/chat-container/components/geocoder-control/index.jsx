import React, { useState } from 'react';
import { useControl, Marker } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export default function GeocoderControl({
  mapboxAccessToken,
  marker = true,
  position,
  onLoading = () => {},
  onResults = () => {},
  onResult = () => {},
  onError = () => {},
  ...props
}) {
  const [markerState, setMarkerState] = useState(null);

  const geocoder = useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        marker: false,
        accessToken: mapboxAccessToken
      });
      ctrl.on('loading', onLoading);
      ctrl.on('results', onResults);
      ctrl.on('result', evt => {
        onResult(evt);

        const { result } = evt;
        const location =
          result &&
          (result.center || (result.geometry && result.geometry.type === 'Point' && result.geometry.coordinates));
        if (location && marker) {
          const markerProps = typeof marker === 'object' ? marker : {};
          setMarkerState(<Marker {...markerProps} longitude={location[0]} latitude={location[1]} />);
        } else {
          setMarkerState(null);
        }
      });
      ctrl.on('error', onError);
      return ctrl;
    },
    {
      position: position
    }
  );

  if (geocoder._map) {
    if (geocoder.getProximity() !== props.proximity && props.proximity !== undefined) {
      geocoder.setProximity(props.proximity);
    }
    if (geocoder.getRenderFunction() !== props.render && props.render !== undefined) {
      geocoder.setRenderFunction(props.render);
    }
    if (geocoder.getLanguage() !== props.language && props.language !== undefined) {
      geocoder.setLanguage(props.language);
    }
    if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
      geocoder.setZoom(props.zoom);
    }
    if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
      geocoder.setFlyTo(props.flyTo);
    }
    if (geocoder.getPlaceholder() !== props.placeholder && props.placeholder !== undefined) {
      geocoder.setPlaceholder(props.placeholder);
    }
    if (geocoder.getCountries() !== props.countries && props.countries !== undefined) {
      geocoder.setCountries(props.countries);
    }
    if (geocoder.getTypes() !== props.types && props.types !== undefined) {
      geocoder.setTypes(props.types);
    }
    if (geocoder.getMinLength() !== props.minLength && props.minLength !== undefined) {
      geocoder.setMinLength(props.minLength);
    }
    if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
      geocoder.setLimit(props.limit);
    }
    if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
      geocoder.setFilter(props.filter);
    }
    if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
      geocoder.setOrigin(props.origin);
    }
  }

  return markerState;
}
