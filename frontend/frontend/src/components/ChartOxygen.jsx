/**
 * ChartOxygen.jsx
 * Gráfica de línea para visualizar la evolución de la oxigenación
 * Props:
 * - data: Array de métricas con timestamps y oxygen_saturation_avg
 */

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Droplets } from 'lucide-react';
import '../styles/charts.css';

const ChartOxygen = ({ data }) => {
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
      spo2: d.oxygen_saturation_avg,
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
            <Droplets size={14} style={{ marginRight: '4px' }} />
            {payload[0].value}% SpO₂
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        <Droplets size={20} className="chart-icon oxygen-icon" />
        Evolución de la Oxigenación
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            domain={[90, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Línea de referencia para nivel crítico (95%) */}
          <ReferenceLine 
            y={95} 
            stroke="#ffaa00" 
            strokeDasharray="5 5" 
            label={{ value: 'Nivel Crítico', fill: '#ffaa00', fontSize: 12 }}
          />
          
          <Line 
            type="monotone" 
            dataKey="spo2" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0a0a1a' }}
            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#00ff88', strokeWidth: 2 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartOxygen;