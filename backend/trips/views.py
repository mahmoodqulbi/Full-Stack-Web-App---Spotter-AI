from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TripRequestSerializer
from .services.routing import RoutingService
from .services.hos import HOSSimulator

class TripGenerateView(APIView):
    def post(self, request):
        serializer = TripRequestSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            routing = RoutingService()
            
            # Geocode locations
            current_coords = routing.geocode(data['current_location'])
            pickup_coords = routing.geocode(data['pickup_location'])
            dropoff_coords = routing.geocode(data['dropoff_location'])
            
            if not current_coords or not pickup_coords or not dropoff_coords:
                return Response({
                    "error": "One or more locations could not be geocoded."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get route from current to pickup, then pickup to dropoff
            # For simplicity, we just do one route from current -> pickup -> dropoff
            route_data = routing.get_route([current_coords, pickup_coords, dropoff_coords])
            
            if not route_data:
                return Response({
                    "error": "Could not calculate route."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Simulate HOS
            hos = HOSSimulator(current_cycle_used=data['current_cycle_used'])
            logs = hos.simulate_trip(route_data['distance'], route_data['duration'])
            
            return Response({
                "route": route_data,
                "logs": logs,
                "summary": {
                    "total_distance_miles": route_data['distance'] * 0.000621371,
                    "total_driving_hours": route_data['duration'] / 3600,
                    "locations": {
                        "current": current_coords,
                        "pickup": pickup_coords,
                        "dropoff": dropoff_coords
                    }
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
