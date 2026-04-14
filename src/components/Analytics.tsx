import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Note, ThemeStyles } from '../types';
import { ChevronLeft, TrendingUp, CheckCircle2, Circle, Calendar } from 'lucide-react';

interface AnalyticsProps {
  notes: Note[];
  currentThemeStyles: ThemeStyles;
  onBack: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ notes, currentThemeStyles, onBack }) => {
  const stats = useMemo(() => {
    const total = notes.length;
    const completed = notes.filter(n => n.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Group by day for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const dailyData = last7Days.map(date => {
      const dayNotes = notes.filter(n => {
        const noteDate = new Date(n.createdAt);
        if (isNaN(noteDate.getTime())) return false;
        return noteDate.toISOString().split('T')[0] === date;
      });
      const labelDate = new Date(date);
      return {
        name: isNaN(labelDate.getTime()) ? '?' : labelDate.toLocaleDateString('uz-UZ', { weekday: 'short' }),
        count: dayNotes.length,
        completed: dayNotes.filter(n => n.completed).length
      };
    });

    const pieData = [
      { name: 'Bajarilgan', value: completed, color: '#22c55e' },
      { name: 'Kutilmoqda', value: pending, color: `${currentThemeStyles.text}40` }
    ];

    return { total, completed, pending, completionRate, dailyData, pieData };
  }, [notes, currentThemeStyles]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col flex-1 pb-12"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold tracking-tighter">Analitika</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Jami', value: stats.total, icon: <Calendar size={16} /> },
          { label: 'Bajarilgan', value: stats.completed, icon: <CheckCircle2 size={16} /> },
          { label: 'Kutilmoqda', value: stats.pending, icon: <Circle size={16} /> },
          { label: 'Natija', value: `${stats.completionRate}%`, icon: <TrendingUp size={16} /> },
        ].map((item, i) => (
          <div 
            key={i}
            className="p-4 rounded-sm border-2 flex flex-col gap-1"
            style={{ borderColor: `${currentThemeStyles.border}20`, backgroundColor: `${currentThemeStyles.text}05` }}
          >
            <div className="flex items-center gap-2 opacity-50 text-[10px] font-bold uppercase tracking-widest">
              {item.icon}
              {item.label}
            </div>
            <div className="text-2xl font-black">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          className="p-6 rounded-sm border-2"
          style={{ borderColor: `${currentThemeStyles.border}20` }}
        >
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-50">Haftalik faollik</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${currentThemeStyles.text}10`} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: currentThemeStyles.text, fontSize: 12, opacity: 0.5 }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: `${currentThemeStyles.text}05` }}
                  contentStyle={{ 
                    backgroundColor: currentThemeStyles.bg, 
                    borderColor: currentThemeStyles.border,
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [value, 'Soni']}
                />
                <Bar name="Soni" dataKey="count" fill={currentThemeStyles.text} radius={[2, 2, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div 
          className="p-6 rounded-sm border-2"
          style={{ borderColor: `${currentThemeStyles.border}20` }}
        >
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-50">Holat taqsimoti</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: currentThemeStyles.bg, 
                    borderColor: currentThemeStyles.border,
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black">{stats.completionRate}%</span>
              <span className="text-[10px] font-bold uppercase opacity-40">Bajarildi</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
