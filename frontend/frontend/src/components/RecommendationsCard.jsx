/**
 * RecommendationsCard.jsx
 * Tarjeta de recomendaciones personalizadas basadas en anomalías
 * Props:
 * - anomalies: Array de strings con anomalías detectadas
 * - lastReading: Última lectura de métricas
 */

import React from 'react';
import { Heart, Wind, Activity, AlertCircle } from 'lucide-react';
import '../styles/recommendationsCard.css';

const RecommendationsCard = ({ anomalies, lastReading }) => {
  // Analizar anomalías para determinar recomendaciones
  const getRecommendations = () => {
    const recommendations = [];
    
    // Verificar problemas de ritmo cardíaco
    const hasLowHR = anomalies.some(a => 
      a.includes('bajo') || a.includes('low_heart_rate')
    );
    
    const hasHighHR = anomalies.some(a => 
      a.includes('elevado') || a.includes('high_heart_rate') || a.includes('Pico')
    );
    
    // Verificar problemas de oxigenación
    const hasLowO2 = anomalies.some(a => 
      a.includes('oxigenación') || a.includes('oxygen') || a.includes('crítico')
    );
    
    // Verificar cambios bruscos
    const hasSuddenChanges = anomalies.some(a => 
      a.includes('brusco') || a.includes('cambio')
    );

    // Recomendaciones para ritmo cardíaco bajo
    if (hasLowHR || (lastReading && lastReading.heart_rate_avg < 60)) {
      recommendations.push({
        type: 'heart-low',
        icon: Heart,
        color: '#3b82f6',
        title: 'Ritmo Cardíaco Bajo Detectado',
        objective: 'Estimular suavemente el sistema cardiovascular',
        exercises: [
          'Caminatas rápidas de 20–30 min, 4–5 veces por semana',
          'Subir escaleras a ritmo moderado',
          'Bicicleta estática suave (15–25 min)',
          'Natación de baja intensidad',
          'Rutinas de cardio ligero: jumping jacks lentos, marcha en el sitio',
          'Entrenamientos de intervalos suaves: 1 min caminando rápido + 1 min despacio'
        ],
        complement: 'Mantén buena hidratación, alimentación balanceada y 7-8 horas de sueño'
      });
    }

    // Recomendaciones para ritmo cardíaco alto
    if (hasHighHR || (lastReading && lastReading.heart_rate_avg > 100)) {
      recommendations.push({
        type: 'heart-high',
        icon: Heart,
        color: '#a855f7',
        title: 'Ritmo Cardíaco Elevado Detectado',
        objective: 'Reducir el estrés cardiovascular y promover la relajación',
        exercises: [
          'Ejercicios de respiración profunda (5-10 minutos)',
          'Yoga restaurativo o meditación guiada',
          'Caminatas lentas al aire libre',
          'Estiramientos suaves de cuerpo completo',
          'Técnicas de relajación muscular progresiva',
          'Evitar cafeína y estimulantes'
        ],
        complement: 'Considera consultar con un profesional si persiste. Reduce el tiempo de pantalla antes de dormir'
      });
    }

    // Recomendaciones para oxigenación baja
    if (hasLowO2 || (lastReading && lastReading.oxygen_saturation_avg < 95)) {
      recommendations.push({
        type: 'oxygen-low',
        icon: Wind,
        color: '#00ff88',
        title: 'Oxigenación Reducida Detectada',
        objective: 'Optimizar la respiración y capacidad pulmonar',
        exercises: [
          'Respiración diafragmática: inhalar por nariz 4 seg, exhalar lento 6 seg',
          'Ejercicio de labios fruncidos (pursed-lip breathing)',
          'Respiración cuadrada (box breathing): inhalar 4 seg – mantener 4 – exhalar 4 – mantener 4',
          'Estiramientos torácicos para abrir el pecho',
          'Yoga suave: posturas cobra, gato-camello, puente',
          'Caminatas al aire libre en espacios bien ventilados',
          'Ejercicios de fortalecimiento respiratorio: soplar por un pitillo en agua (10-15 min)'
        ],
        complement: 'Asegúrate de estar en espacios bien ventilados durante las sesiones de gaming'
      });
    }

    // Recomendaciones para cambios bruscos
    if (hasSuddenChanges) {
      recommendations.push({
        type: 'stability',
        icon: Activity,
        color: '#ffaa00',
        title: 'Variabilidad Inestable Detectada',
        objective: 'Estabilizar el ritmo cardíaco y mejorar la consistencia',
        exercises: [
          'Establecer horarios regulares de ejercicio',
          'Técnicas de coherencia cardíaca (5 min, 3 veces al día)',
          'Ejercicio aeróbico moderado y constante (no intervalos intensos)',
          'Práctica regular de mindfulness o meditación',
          'Mantener rutinas de sueño consistentes',
          'Evitar cambios bruscos de actividad'
        ],
        complement: 'Monitorea tus patrones de actividad y descanso. Evita sesiones de gaming excesivamente largas sin pausas'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) {
    return (
      <div className="recommendations-card">
        <h3 className="recommendations-title">
          <Activity size={20} className="recommendations-icon" />
          Recomendaciones de Salud
        </h3>
        <div className="no-recommendations">
          <p className="no-recommendations-text">
            ✓ Tus métricas están dentro de rangos saludables. Continúa con tus hábitos actuales.
          </p>
          <div className="general-tips">
            <h4>Consejos Generales para E-Sports:</h4>
            <ul>
              <li>Toma descansos de 5-10 minutos cada hora</li>
              <li>Mantén buena postura durante las sesiones</li>
              <li>Hidrátate regularmente (2-3 litros de agua al día)</li>
              <li>Realiza ejercicio físico 3-4 veces por semana</li>
              <li>Duerme 7-8 horas diarias</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-card">
      <h3 className="recommendations-title">
        <AlertCircle size={20} className="recommendations-icon" />
        Recomendaciones Personalizadas
      </h3>

      <div className="recommendations-list">
        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon;
          return (
            <div key={index} className="recommendation-item" style={{ borderLeftColor: rec.color }}>
              <div className="recommendation-header">
                <IconComponent size={24} style={{ color: rec.color }} className="recommendation-icon" />
                <h4 className="recommendation-title">{rec.title}</h4>
              </div>

              <div className="recommendation-objective">
                <strong>Objetivo:</strong> {rec.objective}
              </div>

              <div className="recommendation-exercises">
                <h5 className="exercises-title">Ejercicios Recomendados:</h5>
                <ul className="exercises-list">
                  {rec.exercises.map((exercise, idx) => (
                    <li key={idx} className="exercise-item">
                      <span className="exercise-bullet">•</span>
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="recommendation-complement">
                <strong>Complemento:</strong> {rec.complement}
              </div>
            </div>
          );
        })}
      </div>

      <div className="recommendations-footer">
        <p className="recommendations-disclaimer">
          ⚠️ Estas recomendaciones son generales. Consulta con un profesional de la salud antes de iniciar cualquier programa de ejercicios.
        </p>
      </div>
    </div>
  );
};

export default RecommendationsCard;