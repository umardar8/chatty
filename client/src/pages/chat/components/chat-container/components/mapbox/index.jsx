import { useState, useRef, useEffect } from "react";
import { Map, Layer, Marker, Popup } from "react-map-gl";
import GeocoderControl from "../geocoder-control";
// import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';

// function DeckGLOverlay(props) {
//   const overlay = useControl(() => new DeckOverlay(props));
//   overlay.setProps(props);
//   return null;
// }

const Mapbox = (props) => {
  // const layers = [
  //   new ScatterplotLayer({
  //     id: 'deckgl-circle',
  //     data: [
  //       {position: [0.45, 51.47]}
  //     ],
  //     getPosition: d => d.position,
  //     getFillColor: [255, 0, 0, 100],
  //     getRadius: 1000,
  //     beforeId: 'waterway-label' // In interleaved mode render the layer under map labels
  //   })
  // ];

  // const skyLayer = {
  //   id: 'sky',
  //   type: 'sky',
  //   paint: {
  //     'sky-type': 'atmosphere',
  //     'sky-atmosphere-sun': [0.0, 0.0],
  //     'sky-atmosphere-sun-intensity': 15
  //   }
  // };

  const [marker, setMarker] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const mapRef = useRef(null);

  const threeDLayer = {
    id: "3d-buildings",
    source: "composite",
    "source-layer": "building",
    filter: ["==", "extrude", "true"],
    type: "fill-extrusion",
    minzoom: 15,
    paint: {
      "fill-extrusion-color": "#aaa",
      "fill-extrusion-height": [
        "interpolate",
        ["linear"],
        ["zoom"],
        15,
        0,
        15.05,
        ["get", "height"],
      ],
      "fill-extrusion-base": [
        "interpolate",
        ["linear"],
        ["zoom"],
        15,
        0,
        15.05,
        ["get", "min_height"],
      ],
      "fill-extrusion-opacity": 0.8,
    },
  };

  const handleMapClick = (event) => {
    const { lngLat } = event;
    setMarker({ longitude: lngLat.lng, latitude: lngLat.lat });
  };

  const handleMarkerDragEnd = (event) => {
    const { lngLat } = event;
    setMarker({ longitude: lngLat.lng, latitude: lngLat.lat });
    // Optionally, you can pass these updated coordinates back to a parent component
    if (props.onMarkerDragEnd) {
      props.onMarkerDragEnd(lngLat.lng, lngLat.lat);
      setMarker({ longitude: lngLat.lng, latitude: lngLat.lat });
    }
  };

  const handleGeocoderResult = (result) => {
    const location = result?.center || (result.geometry?.type === "Point" && result.geometry.coordinates);
    if (location) {
      setMarker({ longitude: location[0], latitude: location[1] });
      // Zoom to a suitable level after geocoding
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: location,
          zoom: 16, // Adjust zoom level as needed
          duration: 2000 // Optional animation duration
        });
      }
    }
    if(props.getResults){
      props.getResults(result);
    }
  };

  useEffect(() => {
    if (props.longitude && props.latitude) {
      setMarker({ longitude: props.longitude, latitude: props.latitude });
    }
  }, [props.longitude, props.latitude]);

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: props.latitude ? props.latitude : 25.4080005,
          longitude: props.longitude ? props.longitude : 68.2605725,
          zoom: 18.01,
          bearing: 0,
          pitch: 77,
          antialias: true,
        }}

        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        maxPitch={80}
        onClick={handleMapClick}

        // mapStyle="mapbox://styles/mapbox/streets-v9"
        // mapStyle="mapbox://styles/mapbox/satellite-v9"
        // mapStyle="mapbox://styles/mapbox/light-v9"
        // terrain={{source: 'mapbox-dem', exaggeration: 1.5}}
      >

        {props.geocoder ? (
          <GeocoderControl
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
            position="top-left"
            onLoading={() => console.log("Loading GeoCoder...")}
            onResults={(results) => console.log("Results:", results)}
            onResult={handleGeocoderResult}
            onError={(error) => console.error("Error:", error)}
            marker={true}
            setShowCustomName={props.setShowCustomName}
          />
        ) : null}

        {props.showMarker && marker && (
          <Marker 
            latitude={props.latitude ? props.latitude : 25.4080005}
            longitude={props.longitude ? props.longitude : 68.2605725}
            anchor="bottom"
            draggable
            onDragEnd={handleMarkerDragEnd}
            // onClick={e => {
            //   // If we let the click event propagates to the map, it will immediately close the popup
            //   // with `closeOnClick: true`
            //   e.originalEvent.stopPropagation();
            //   setPopupInfo({
            //     lng: props.longitude ? props.longitude :"68.2605725",
            //     lat: props.latitude ? props.latitude : "25.4080005"
            //   });
            // }}
          >
          /</Marker>
        )}

        <Layer {...threeDLayer} />

        {/* {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
          >

            <div className="text-black font-bold">
              <p>Location: </p>
              <p>Latitude: {popupInfo.lat}</p>
              <p>Longitude: {popupInfo.lng}</p>
            </div>
            
          </Popup>
        )} */}

        {/* <DeckGLOverlay layers={layers} interleaved /> */}
      </Map>
    </>
  );
};

export default Mapbox;