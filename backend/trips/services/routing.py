import requests
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import time

class RoutingService:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="spotter_ai_truck_planner")
        self.osrm_base_url = "http://router.project-osrm.org/route/v1/driving/"

    def geocode(self, address):
        try:
            location = self.geolocator.geocode(address)
            if location:
                return (location.latitude, location.longitude)
            return None
        except (GeocoderTimedOut, Exception):
            return None

    def get_route(self, points):
        """
        points: list of (lat, lon) tuples
        """
        coords_str = ";".join([f"{lon},{lat}" for lat, lon in points])
        url = f"{self.osrm_base_url}{coords_str}?overview=full&geometries=geojson&steps=true"
        
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data['code'] == 'Ok':
                route = data['routes'][0]
                return {
                    'geometry': route['geometry'],
                    'distance': route['distance'], # meters
                    'duration': route['duration'], # seconds
                    'steps': route['legs']
                }
        return None
