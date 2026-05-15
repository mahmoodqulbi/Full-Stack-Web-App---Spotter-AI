import { useState } from 'react';
import { TripForm } from './components/TripForm';
import { Map } from './components/Map';
import { ELDLog } from './components/ELDLog';
import { tripService } from './services/api';
import type { TripResponse } from './types';
import { LayoutDashboard, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [tripData, setTripData] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTripSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripService.generateTrip(data);
      setTripData(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Truck size={18} className="text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Spotter <span className="text-primary">AI</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {['Planner', 'Fleet', 'HOS Rules'].map(item => (
              <a
                key={item}
                href="#"
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
              >
                {item}
              </a>
            ))}
            <a
              href="#"
              className="ml-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20"
            >
              Pro
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Left Column ── */}
          <div className="space-y-8">
            {/* Hero text */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                HOS Compliant Routing
              </div>
              <h2 className="text-4xl font-extrabold leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                Plan Your<br />
                <span className="text-primary">Trip</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Enter your locations and cycle details to generate a smart trucking route with full HOS compliance.
              </p>
            </div>

            {/* Form */}
            <TripForm onSubmit={handleTripSubmit} loading={loading} />

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-destructive/10 border border-destructive/25 text-destructive rounded-xl text-sm flex items-start gap-3"
              >
                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-[10px] font-bold">!</span>
                {error}
              </motion.div>
            )}

            {/* Trip Summary */}
            {tripData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-card border border-border rounded-2xl p-6 space-y-5 card-glow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base" style={{ fontFamily: 'Syne, sans-serif' }}>Trip Summary</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Distance', value: `${tripData.summary.total_distance_miles.toFixed(1)} mi` },
                    { label: 'Drive Time', value: `${tripData.summary.total_driving_hours.toFixed(1)}h` },
                    { label: 'Total Days', value: `${tripData.logs.length}` },
                    { label: 'HOS Status', value: 'Compliant', highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="stat-badge bg-muted/40 border border-border/60 p-3 rounded-xl">
                      <div className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{label}</div>
                      <div className={`text-lg font-extrabold ${highlight ? 'text-emerald-400' : 'text-foreground'}`} style={{ fontFamily: 'Syne, sans-serif' }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-2 space-y-12">

            {/* Map */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Route Map</h2>
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Data
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
                <Map tripData={tripData} />
              </div>
            </section>

            {/* ELD Logs */}
            <AnimatePresence>
              {tripData && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>ELD Daily Logs</h2>
                    <button className="text-xs font-semibold text-primary border border-primary/25 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-all duration-200">
                      Export PDF ↗
                    </button>
                  </div>
                  <div className="space-y-6">
                    {tripData.logs.map((log, i) => (
                      <motion.div
                        key={log.day}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <ELDLog dayLog={log} />
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {!tripData && !loading && (
              <div className="empty-state h-[420px] border border-dashed border-border/50 rounded-3xl flex flex-col items-center justify-center text-muted-foreground gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted/40 border border-border flex items-center justify-center">
                  <LayoutDashboard size={28} className="opacity-30" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-sm text-foreground/50" style={{ fontFamily: 'Syne, sans-serif' }}>No Trip Generated</p>
                  <p className="text-xs text-muted-foreground">Fill in the form and click Generate Trip Plan</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-10 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck size={14} className="text-primary" />
            <span>© 2026 Spotter AI Logistics. Built for performance and safety.</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            {['Privacy', 'Terms', 'Support'].map(link => (
              <a key={link} href="#" className="hover:text-primary transition-colors duration-200">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;