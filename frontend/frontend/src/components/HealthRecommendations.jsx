import React from 'react';
import { Heart, Droplet, Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import '../styles/healthRecommendations.css';

const HealthRecommendations = ({ heartRate, oxygenSaturation }) => {
  const [recommendations, setRecommendations] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (heartRate && oxygenSaturation) {
      analyzeHealth();
    }
  }, [heartRate, oxygenSaturation]);

  const analyzeHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/health/recommendations?heart_rate=${heartRate}&oxygen_saturation=${oxygenSaturation}&player_name=Mateo Vanegas`,
        { method: 'POST' }
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener recomendaciones');
      }
      
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'excelente': { color: 'status-excellent', icon: CheckCircle, text: 'Excelente' },
      'normal': { color: 'status-normal', icon: Info, text: 'Normal' },
      'requiere_atencion': { color: 'status-warning', icon: AlertTriangle, text: 'Requiere Atención' }
    };
    
    const badge = badges[status] || badges['normal'];
    const Icon = badge.icon;
    
    return (
      <div className={`health-status-badge ${badge.color}`}>
        <Icon size={20} />
        {badge.text}
      </div>
    );
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'leve': 'severity-mild',
      'moderada': 'severity-moderate',
      'alta': 'severity-high'
    };
    return colors[severity] || colors['leve'];
  };

  if (loading) {
    return (
      <div className="health-recommendations-container">
        <div className="loading-recommendations">
          <Activity size={32} className="spinning" />
          <p>Analizando datos de salud...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="health-recommendations-container">
        <div className="error-recommendations">
          <AlertTriangle size={32} />
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!recommendations) return null;

  if (recommendations.message) {
    return (
      <div className="health-recommendations-container">
        <div className="excellent-health">
          <CheckCircle size={48} className="excellent-icon" />
          <h3>{recommendations.message}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="health-recommendations-container">
      <div className="recommendations-header">
        <h2 className="recommendations-title">
          <Activity size={24} />
          Recomendaciones de Salud
        </h2>
        {getStatusBadge(recommendations.status)}
      </div>

      {recommendations.recommendations.map((rec, index) => (
        <div key={index} className={`recommendation-card ${getSeverityColor(rec.severity)}`}>
          <div className="recommendation-header">
            <h3 className="anomaly-type">{rec.anomaly_type}</h3>
            <div className="severity-badges">
              <span className={`severity-badge ${getSeverityColor(rec.severity)}`}>
                Severidad: {rec.severity}
              </span>
              <span className={`urgency-badge urgency-${rec.urgency}`}>
                Urgencia: {rec.urgency}
              </span>
            </div>
          </div>

          <div className="detected-values">
            <span className="value-item">
              Valor detectado: <strong>{rec.detected_value}</strong>
            </span>
            <span className="value-item">
              Rango normal: <strong>{rec.normal_range}</strong>
            </span>
          </div>

          {/* Recomendaciones Generales */}
          <div className="recommendation-section">
            <h4 className="section-title">
              <Info size={18} />
              Recomendaciones Generales
            </h4>
            <ul className="recommendation-list">
              {rec.recommendations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Ejercicios */}
          <div className="recommendation-section">
            <h4 className="section-title">
              <Activity size={18} />
              Ejercicios Recomendados
            </h4>
            <div className="exercise-grid">
              {rec.exercises.map((exercise, i) => (
                <div key={i} className="exercise-card">
                  {exercise}
                </div>
              ))}
            </div>
          </div>

          {/* Tips Adicionales */}
          <div className="recommendation-section">
            <h4 className="section-title">
              <CheckCircle size={18} />
              Tips Adicionales
            </h4>
            <ul className="tips-list">
              {rec.additional_tips.map((tip, i) => (
                <li key={i}>
                  <span className="tip-check">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthRecommendations;