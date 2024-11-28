"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState, useMemo } from "react";
import Map, { MapRef, Source, Layer, Popup } from "react-map-gl";
import type { GeoJSONSource, LayerProps } from "react-map-gl";
import Link from "next/link";
import { LinkedinIcon } from "../components";
import { Contact } from "@/src/types";

export type ContactsMapProps = {
  mapToken: string;
  contacts: Contact[];
};

const clusterLayer: LayerProps = {
  id: "clusters",
  type: "circle",
  source: "contacts",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      10,
      "#f1f075",
      30,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 15, 10, 25, 30, 35],
  },
};

const clusterCountLayer: LayerProps = {
  id: "cluster-count",
  type: "symbol",
  source: "contacts",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

const unclusteredPointLayer: LayerProps = {
  id: "unclustered-point",
  type: "circle",
  source: "contacts",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#11b4da",
    "circle-radius": 5,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};

// New Layer for Displaying Names
const nameLayer: LayerProps = {
  id: "name-label",
  type: "symbol",
  source: "contacts",
  filter: ["!", ["has", "point_count"]],
  layout: {
    "text-field": "{name}", // Use the `name` property from each feature
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 14,
    "text-offset": [0, 1.5], // Position the text above the point
    "text-anchor": "top",
  },
  paint: {
    "text-color": "#ffffff",
  },
};

export const ContactsMap = ({ mapToken, contacts }: ContactsMapProps) => {
  const [popupInfo, setPopupInfo] = useState<Contact | null>(null);
  const mapRef = useRef<MapRef>(null);

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection",
      features: contacts.map((contact) => ({
        type: "Feature",
        properties: { ...contact },
        geometry: {
          type: "Point",
          coordinates: [contact.longitude, contact.latitude],
        },
      })),
    }),
    [contacts]
  );

  const onMapClick = (event: any) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const { cluster_id: clusterId } = feature.properties;
    const mapboxSource = mapRef.current?.getSource("contacts") as GeoJSONSource;

    if (clusterId) {
      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        mapRef.current?.easeTo({
          center: feature.geometry.coordinates,
          zoom: zoom as number,
          duration: 500,
        });
      });
    } else {
      setPopupInfo(null);
      setTimeout(() => {
        setPopupInfo({
          ...feature.properties,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
        });
      }, 0);
    }
  };

  return (
    <>
      <Map
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3.5,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={mapToken}
        interactiveLayerIds={[
          clusterLayer.id as string,
          unclusteredPointLayer.id as string,
        ]}
        onClick={onMapClick}
        ref={mapRef}
      >
        <Source
          id="contacts"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
          <Layer {...nameLayer} />
        </Source>

        {popupInfo && (
          <Popup
            key={`${popupInfo.longitude}-${popupInfo.latitude}`}
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <div className="font-bold text-lg">{popupInfo.name}</div>
              <div>{popupInfo.description}</div>
              {popupInfo.linkedin && (
                <Link href={popupInfo.linkedin} target="_blank">
                  <LinkedinIcon className="w-8" />
                </Link>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
};
