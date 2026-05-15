from django.urls import path
from .views import TripGenerateView

urlpatterns = [
    path('generate/', TripGenerateView.as_view(), name='trip-generate'),
]
