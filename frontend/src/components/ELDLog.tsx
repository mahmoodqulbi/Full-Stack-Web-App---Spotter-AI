import { format, parseISO, startOfDay, addHours } from 'date-fns';
import type { DayLog, Activity } from '../types';
import { motion } from 'framer-motion';

interface ELDLogProps {
    dayLog: DayLog;
}

const STATUS_COLORS: Record<string, string> = {
    DRIVING: '#3b82f6', // blue-500
    ON_DUTY: '#f59e0b', // amber-500
    OFF_DUTY: '#10b981', // emerald-500
    SLEEPER: '#6366f1', // indigo-500
};

export const ELDLog = ({ dayLog }: ELDLogProps) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getPosition = (isoDate: string) => {
        const date = parseISO(isoDate);
        const dayStart = startOfDay(date);
        const diffHours = (date.getTime() - dayStart.getTime()) / (1000 * 60 * 60);
        return (diffHours / 24) * 100;
    };

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Day {dayLog.day} - ELD Daily Log</h3>
                <div className="text-sm text-muted-foreground">
                    {format(parseISO(dayLog.activities[0].start), 'MMMM dd, yyyy')}
                </div>
            </div>

            <div className="relative h-64 border rounded-lg bg-muted/30 p-4">
                {/* Timeline Grid */}
                <div className="absolute inset-x-4 top-4 bottom-12 flex border-l border-b">
                    {hours.map(hour => (
                        <div key={hour} className="flex-1 border-r border-dashed border-muted relative">
                            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">
                                {hour === 0 ? 'M' : hour === 12 ? 'N' : hour}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Duty Status Graph */}
                <div className="absolute inset-x-4 top-4 bottom-12 pt-4">
                    <div className="relative h-full">
                        {/* Status Rows Labels */}
                        <div className="absolute -left-16 inset-y-0 flex flex-col justify-between text-[10px] font-medium py-2">
                            <span>OFF</span>
                            <span>SLP</span>
                            <span>DRV</span>
                            <span>ON</span>
                        </div>

                        {/* Activity Bars */}
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            {dayLog.activities.map((activity, idx) => {
                                const startPos = getPosition(activity.start);
                                const endPos = getPosition(activity.end);
                                const width = endPos - startPos;
                                
                                // Map type to vertical position (0 to 100%)
                                const rowMap: Record<string, number> = {
                                    OFF_DUTY: 10,
                                    SLEEPER: 35,
                                    DRIVING: 60,
                                    ON_DUTY: 85,
                                };
                                const yPos = rowMap[activity.type];

                                return (
                                    <g key={idx}>
                                        <motion.rect
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                                            x={`${startPos}%`}
                                            y={`${yPos}%`}
                                            width={`${width}%`}
                                            height="4"
                                            fill={STATUS_COLORS[activity.type]}
                                            rx="2"
                                        />
                                        {/* Vertical connector to next activity */}
                                        {idx < dayLog.activities.length - 1 && (
                                            <line 
                                                x1={`${endPos}%`} 
                                                y1={`${yPos}%`} 
                                                x2={`${endPos}%`} 
                                                y2={`${rowMap[dayLog.activities[idx+1].type]}%`} 
                                                stroke={STATUS_COLORS[activity.type]} 
                                                strokeWidth="1"
                                                strokeDasharray="2,2"
                                            />
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </div>

            {/* Activity Table */}
            <div className="mt-12 space-y-2">
                {dayLog.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-center text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-24 font-medium text-muted-foreground">
                            {format(parseISO(activity.start), 'HH:mm')}
                        </div>
                        <div className="w-32">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase" style={{ backgroundColor: STATUS_COLORS[activity.type] }}>
                                {activity.type.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex-1 text-muted-foreground italic">
                            {activity.description}
                        </div>
                        <div className="text-right font-medium">
                            {activity.duration.toFixed(1)}h
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
