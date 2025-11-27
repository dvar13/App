/**
 * ChartHeartRate.jsx
 * Gráfica de área para visualizar la evolución del ritmo cardíaco
 * Props:
 * - data: Array de métricas con timestamps y heart_rate_avg
 */

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import '../styles/charts.css';

const ChartHeartRate = ({ data }) => {
  // Transformar datos para el gráfico
  const chartData = data.map((d, index) => {
    const date = new Date(d.timestamp);
    const time = date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    
    return {
      time: time,
      bpm: d.heart_rate_avg,
      fullTimestamp: d.timestamp,
      index: index
    };
  });

  // Si hay muchos datos, mostrar solo algunos labels en el eje X
  const maxLabels = 10;
  const step = Math.ceil(chartData.length / maxLabels);
  
  const formattedChartData = chartData.map((item, idx) => ({
    ...item,
    timeLabel: idx % step === 0 ? item.time : ''
  }));

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{payload[0].payload.time}</p>
          <p className="tooltip-value">
            <Activity size={14} style={{ marginRight: '4px' }} />
            {payload[0].value} BPM
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        <Activity size={20} className="chart-icon heart-rate-icon" />
        Evolución del Ritmo Cardíaco
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
          <XAxis 
            dataKey="timeLabel"
            stroke="#888" 
            style={{ fontSize: '0.85rem' }}
            tick={{ fill: '#888' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#888" 
            style={{ fontSize: '0.85rem' }}
            tick={{ fill: '#888' }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="bpm" 
            stroke="#a855f7" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorBpm)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartHeartRate;