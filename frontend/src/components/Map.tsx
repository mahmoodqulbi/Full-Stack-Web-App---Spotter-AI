import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { TripResponse } from '../types';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    tripData: TripResponse | null;
}

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

export const Map = ({ tripData }: MapProps) => {
    if (!tripData) {
        return (
            <div className="map-container bg-muted flex items-center justify-center text-muted-foreground border-2 border-dashed">
                Enter trip details to see the route
            </div>
        );
    }

    const coordinates = tripData.route.geometry.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);
    const bounds = L.latLngBounds(coordinates);

    const pickup = tripData.summary.locations.pickup;
    const dropoff = tripData.summary.locations.dropoff;
    const current = tripData.summary.locations.current;

    return (
        <div className="map-container shadow-xl border relative">
            <MapContainer 
                center={[current[0], current[1]]} 
                zoom={5} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={coordinates} color="#3b82f6" weight={5} opacity={0.7} />
                
                <Marker position={[current[0], current[1]]}>
                    <Popup>Current Location</Popup>
                </Marker>
                
                <Marker position={[pickup[0], pickup[1]]}>
                    <Popup>Pickup Location</Popup>
                </Marker>
                
                <Marker position={[dropoff[0], dropoff[1]]}>
                    <Popup>Dropoff Location</Popup>
                </Marker>
                
                <ChangeView bounds={bounds} />
            </MapContainer>
        </div>
    );
};
