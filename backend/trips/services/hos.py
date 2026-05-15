from datetime import datetime, timedelta

class HOSSimulator:
    def __init__(self, current_cycle_used=0):
        self.current_cycle_used = current_cycle_used # hours already used in the 70/80h cycle (simplified)
        self.driving_limit = 11 # hours
        self.work_window_limit = 14 # hours
        self.break_requirement = 8 # hours driving before 30m break
        self.reset_period = 10 # hours
        
    def simulate_trip(self, total_distance_meters, total_duration_seconds):
        """
        Simulates the trip and generates daily logs.
        total_distance_meters: total distance in meters
        total_duration_seconds: total estimated driving time in seconds
        """
        total_driving_hours = total_duration_seconds / 3600
        total_distance_miles = total_distance_meters * 0.000621371
        
        days = []
        current_time = datetime.now().replace(hour=8, minute=0, second=0, microsecond=0)
        
        remaining_driving_hours = total_driving_hours
        remaining_distance_miles = total_distance_miles
        
        # Initial Pickup
        pickup_duration = 1 # hour
        
        day_logs = []
        
        # Day 1 starts with pickup
        current_day_driving = 0
        current_day_work_window = 0
        
        def add_activity(day_list, start, duration_hours, activity_type, description):
            end = start + timedelta(hours=duration_hours)
            day_list.append({
                'start': start.isoformat(),
                'end': end.isoformat(),
                'duration': duration_hours,
                'type': activity_type, # 'DRIVING', 'ON_DUTY', 'OFF_DUTY', 'SLEEPER'
                'description': description
            })
            return end

        current_day_id = 1
        current_day_activities = []
        
        # Pickup at start
        current_time = add_activity(current_day_activities, current_time, 1, 'ON_DUTY', 'Pickup')
        current_day_work_window += 1
        
        miles_since_fuel = 0
        
        while remaining_driving_hours > 0:
            # How much can we drive today?
            can_drive_today = min(self.driving_limit - current_day_driving, self.work_window_limit - current_day_work_window)
            
            if can_drive_today <= 0:
                # Need a reset
                current_time = add_activity(current_day_activities, current_time, self.reset_period, 'SLEEPER', '10-hour Reset')
                days.append({
                    'day': current_day_id,
                    'activities': current_day_activities
                })
                current_day_id += 1
                current_day_activities = []
                current_day_driving = 0
                current_day_work_window = 0
                continue

            # Check for 30m break (after 8h driving)
            # This is a bit simplified.
            drive_chunk = min(can_drive_today, 8 - (current_day_driving % 8 if current_day_driving > 0 else 0))
            drive_chunk = min(drive_chunk, remaining_driving_hours)
            
            # Check fuel every 1000 miles
            # Average speed (approx)
            avg_speed_mph = total_distance_miles / total_driving_hours if total_driving_hours > 0 else 55
            miles_in_chunk = drive_chunk * avg_speed_mph
            
            if miles_since_fuel + miles_in_chunk > 1000:
                # Fuel before completing this chunk
                hours_to_fuel = (1000 - miles_since_fuel) / avg_speed_mph
                current_time = add_activity(current_day_activities, current_time, hours_to_fuel, 'DRIVING', 'Driving')
                current_time = add_activity(current_day_activities, current_time, 0.5, 'ON_DUTY', 'Fueling')
                
                current_day_driving += hours_to_fuel
                current_day_work_window += hours_to_fuel + 0.5
                remaining_driving_hours -= hours_to_fuel
                miles_since_fuel = 0
                continue

            # Drive
            current_time = add_activity(current_day_activities, current_time, drive_chunk, 'DRIVING', 'Driving')
            current_day_driving += drive_chunk
            current_day_work_window += drive_chunk
            remaining_driving_hours -= drive_chunk
            miles_since_fuel += miles_in_chunk
            
            if remaining_driving_hours <= 0:
                # Dropoff
                current_time = add_activity(current_day_activities, current_time, 1, 'ON_DUTY', 'Dropoff')
                current_day_work_window += 1
                days.append({
                    'day': current_day_id,
                    'activities': current_day_activities
                })
                break

            if current_day_driving >= 8 and current_day_driving % 8 == 0:
                current_time = add_activity(current_day_activities, current_time, 0.5, 'OFF_DUTY', '30-min Break')
                current_day_work_window += 0.5

        return days
