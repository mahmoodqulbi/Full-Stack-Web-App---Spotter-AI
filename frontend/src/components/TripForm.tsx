import { useState } from 'react';
import { Loader2, MapPin, Navigation, Package, Clock } from 'lucide-react';

interface TripFormProps {
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
}

export const TripForm = ({ onSubmit, loading }: TripFormProps) => {
    const [formData, setFormData] = useState({
        current_location: 'New York, NY',
        pickup_location: 'Chicago, IL',
        dropoff_location: 'Los Angeles, CA',
        current_cycle_used: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl shadow-sm border glass animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-4">
                <div className="relative">
                    <label className="text-sm font-medium mb-1.5 block text-muted-foreground flex items-center gap-2">
                        <MapPin size={14} /> Current Location
                    </label>
                    <input
                        type="text"
                        name="current_location"
                        value={formData.current_location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="City, State"
                        required
                    />
                </div>

                <div className="relative">
                    <label className="text-sm font-medium mb-1.5 block text-muted-foreground flex items-center gap-2">
                        <Package size={14} /> Pickup Location
                    </label>
                    <input
                        type="text"
                        name="pickup_location"
                        value={formData.pickup_location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="City, State"
                        required
                    />
                </div>

                <div className="relative">
                    <label className="text-sm font-medium mb-1.5 block text-muted-foreground flex items-center gap-2">
                        <Navigation size={14} /> Dropoff Location
                    </label>
                    <input
                        type="text"
                        name="dropoff_location"
                        value={formData.dropoff_location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="City, State"
                        required
                    />
                </div>

                <div className="relative">
                    <label className="text-sm font-medium mb-1.5 block text-muted-foreground flex items-center gap-2">
                        <Clock size={14} /> Cycle Hours Used
                    </label>
                    <input
                        type="number"
                        name="current_cycle_used"
                        value={formData.current_cycle_used}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="Hours"
                        min="0"
                        max="70"
                        step="0.5"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Generate Trip Plan'}
            </button>
        </form>
    );
};
