export type Activity = {
  start: string;
  end: string;
  duration: number;
  type: 'DRIVING' | 'ON_DUTY' | 'OFF_DUTY' | 'SLEEPER';
  description: string;
}

export type DayLog = {
  day: number;
  activities: Activity[];
}

export type TripResponse = {
  route: {
    geometry: {
      type: string;
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
    steps: any[];
  };
  logs: DayLog[];
  summary: {
    total_distance_miles: number;
    total_driving_hours: number;
    locations: {
      current: [number, number];
      pickup: [number, number];
      dropoff: [number, number];
    };
  };
}
