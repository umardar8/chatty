import { Map, Layer, Marker } from "react-map-gl";
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
      "fill-extrusion-opacity": 0.6,
    },
  };

  return (
    <>
      <Map
        initialViewState={{
          longitude: props.longitude ? props.longitude : 68.2605725,
          latitude: props.latitude ? props.latitude : 25.4080005,
          zoom: 16,
          pitch: 60,
          antialias: true,
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        maxPitch={85}

        // mapStyle="mapbox://styles/mapbox/streets-v9"
        // mapStyle="mapbox://styles/mapbox/satellite-v9"
        // mapStyle="mapbox://styles/mapbox/light-v9"
        // terrain={{source: 'mapbox-dem', exaggeration: 1.5}}
      >
        {!props.location ? (
          <Marker
            longitude={props.longitude ? props.longitude : 68.2605725}
            latitude={props.latitude ? props.latitude : 25.4080005}
            draggable
            anchor="bottom"
          ></Marker>
        ) : null}

        {props.geocoder ? (
          <GeocoderControl
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
            position="top-left"
            onResult={props.getResults}
          />
        ) : null}

        <Layer {...threeDLayer} />

        {/* <DeckGLOverlay layers={layers} interleaved /> */}
      </Map>
    </>
  );
};

export default Mapbox;