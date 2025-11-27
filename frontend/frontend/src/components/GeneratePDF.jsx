/**
 * GeneratePDF.jsx
 * Componente para generar y descargar PDF con toda la información del dashboard
 * Props:
 * - analytics: Datos del análisis a incluir en el PDF
 * - player: Información del jugador
 * - isDisabled: Boolean para deshabilitar el botón durante descarga
 */

import React, { useState } from 'react';
import { FileDown, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../styles/generatePDF.css';

const GeneratePDF = ({ analytics, player, isDisabled = false }) => {
  const [generating, setGenerating] = useState(false);

  // Función para generar las recomendaciones en formato HTML para el PDF
  const generateRecommendationsPDF = (anomalies, lastReading) => {
    const recommendations = [];
    
    // Detectar problemas
    const hasLowHR = anomalies.some(a => 
      a.includes('bajo') || a.includes('low_heart_rate')
    );
    
    const hasHighHR = anomalies.some(a => 
      a.includes('elevado') || a.includes('high_heart_rate') || a.includes('Pico')
    );
    
    const hasLowO2 = anomalies.some(a => 
      a.includes('oxigenación') || a.includes('oxygen') || a.includes('crítico')
    );
    
    const hasSuddenChanges = anomalies.some(a => 
      a.includes('brusco') || a.includes('cambio')
    );

    // Generar HTML para ritmo cardíaco bajo
    if (hasLowHR || (lastReading && lastReading.heart_rate_avg < 60)) {
      recommendations.push(`
        <div style="background-color: #16213e; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #3b82f6; font-size: 16px;">💙 Ritmo Cardíaco Bajo Detectado</h3>
          <p style="margin: 0 0 15px 0; color: #888888; font-size: 13px;">
            <strong style="color: #ffffff;">Objetivo:</strong> Estimular suavemente el sistema cardiovascular
          </p>
          <h4 style="margin: 0 0 10px 0; color: #00ff88; font-size: 14px;">Ejercicios Recomendados:</h4>
          <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #cccccc; font-size: 12px; line-height: 1.8;">
            <li>Caminatas rápidas de 20–30 min, 4–5 veces por semana</li>
            <li>Subir escaleras a ritmo moderado</li>
            <li>Bicicleta estática suave (15–25 min)</li>
            <li>Natación de baja intensidad</li>
            <li>Rutinas de cardio ligero: jumping jacks lentos, marcha en el sitio</li>
            <li>Entrenamientos de intervalos suaves: 1 min caminando rápido + 1 min despacio</li>
          </ul>
          <p style="margin: 0; color: #00ff88; font-size: 12px;">
            <strong>Complemento:</strong> Mantén buena hidratación, alimentación balanceada y 7-8 horas de sueño
          </p>
        </div>
      `);
    }

    // Generar HTML para ritmo cardíaco alto
    if (hasHighHR || (lastReading && lastReading.heart_rate_avg > 100)) {
      recommendations.push(`
        <div style="background-color: #16213e; padding: 20px; border-radius: 8px; border-left: 4px solid #a855f7; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #a855f7; font-size: 16px;">💜 Ritmo Cardíaco Elevado Detectado</h3>
          <p style="margin: 0 0 15px 0; color: #888888; font-size: 13px;">
            <strong style="color: #ffffff;">Objetivo:</strong> Reducir el estrés cardiovascular y promover la relajación
          </p>
          <h4 style="margin: 0 0 10px 0; color: #00ff88; font-size: 14px;">Ejercicios Recomendados:</h4>
          <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #cccccc; font-size: 12px; line-height: 1.8;">
            <li>Ejercicios de respiración profunda (5-10 minutos)</li>
            <li>Yoga restaurativo o meditación guiada</li>
            <li>Caminatas lentas al aire libre</li>
            <li>Estiramientos suaves de cuerpo completo</li>
            <li>Técnicas de relajación muscular progresiva</li>
            <li>Evitar cafeína y estimulantes</li>
          </ul>
          <p style="margin: 0; color: #00ff88; font-size: 12px;">
            <strong>Complemento:</strong> Considera consultar con un profesional si persiste. Reduce el tiempo de pantalla antes de dormir
          </p>
        </div>
      `);
    }

    // Generar HTML para oxigenación baja
    if (hasLowO2 || (lastReading && lastReading.oxygen_saturation_avg < 95)) {
      recommendations.push(`
        <div style="background-color: #16213e; padding: 20px; border-radius: 8px; border-left: 4px solid #00ff88; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #00ff88; font-size: 16px;">💚 Oxigenación Reducida Detectada</h3>
          <p style="margin: 0 0 15px 0; color: #888888; font-size: 13px;">
            <strong style="color: #ffffff;">Objetivo:</strong> Optimizar la respiración y capacidad pulmonar
          </p>
          <h4 style="margin: 0 0 10px 0; color: #00ff88; font-size: 14px;">Ejercicios Recomendados:</h4>
          <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #cccccc; font-size: 12px; line-height: 1.8;">
            <li>Respiración diafragmática: inhalar por nariz 4 seg, exhalar lento 6 seg</li>
            <li>Ejercicio de labios fruncidos (pursed-lip breathing)</li>
            <li>Respiración cuadrada (box breathing): inhalar 4 seg – mantener 4 – exhalar 4 – mantener 4</li>
            <li>Estiramientos torácicos para abrir el pecho</li>
            <li>Yoga suave: posturas cobra, gato-camello, puente</li>
            <li>Caminatas al aire libre en espacios bien ventilados</li>
            <li>Ejercicios de fortalecimiento respiratorio: soplar por un pitillo en agua (10-15 min)</li>
          </ul>
          <p style="margin: 0; color: #00ff88; font-size: 12px;">
            <strong>Complemento:</strong> Asegúrate de estar en espacios bien ventilados durante las sesiones de gaming
          </p>
        </div>
      `);
    }

    // Generar HTML para cambios bruscos
    if (hasSuddenChanges) {
      recommendations.push(`
        <div style="background-color: #16213e; padding: 20px; border-radius: 8px; border-left: 4px solid #ffaa00; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #ffaa00; font-size: 16px;">⚡ Variabilidad Inestable Detectada</h3>
          <p style="margin: 0 0 15px 0; color: #888888; font-size: 13px;">
            <strong style="color: #ffffff;">Objetivo:</strong> Estabilizar el ritmo cardíaco y mejorar la consistencia
          </p>
          <h4 style="margin: 0 0 10px 0; color: #00ff88; font-size: 14px;">Ejercicios Recomendados:</h4>
          <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #cccccc; font-size: 12px; line-height: 1.8;">
            <li>Establecer horarios regulares de ejercicio</li>
            <li>Técnicas de coherencia cardíaca (5 min, 3 veces al día)</li>
            <li>Ejercicio aeróbico moderado y constante (no intervalos intensos)</li>
            <li>Práctica regular de mindfulness o meditación</li>
            <li>Mantener rutinas de sueño consistentes</li>
            <li>Evitar cambios bruscos de actividad</li>
          </ul>
          <p style="margin: 0; color: #00ff88; font-size: 12px;">
            <strong>Complemento:</strong> Monitorea tus patrones de actividad y descanso. Evita sesiones de gaming excesivamente largas sin pausas
          </p>
        </div>
      `);
    }

    return recommendations.join('');
  };

  const generatePDF = async () => {
    try {
      setGenerating(true);

      // Crear un contenedor temporal con toda la información
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        width: 1200px;
        background-color: #0a0a1a;
        color: #ffffff;
        padding: 40px;
        font-family: Arial, sans-serif;
      `;

      // Construir el HTML con toda la información
      const htmlContent = `
        <div style="background-color: #0a0a1a; color: #ffffff; padding: 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #a855f7; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #a855f7; font-size: 28px;">⚡ E-Sports Health Monitoring</h1>
            <p style="margin: 10px 0 0 0; color: #888888;">Reporte de Análisis Biométrico</p>
            <p style="margin: 5px 0 0 0; color: #555555; font-size: 12px;">
              ${new Date().toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>

          <!-- Información del Jugador -->
          <div style="margin-bottom: 30px; background-color: #16213e; padding: 20px; border-radius: 8px; border: 1px solid #2d3561;">
            <h2 style="margin: 0 0 15px 0; color: #a855f7; font-size: 18px;">📋 Información del Jugador</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Nombre</p>
                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 14px; font-weight: bold;">${player?.name || 'N/A'}</p>
              </div>
              <div>
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Estado</p>
                <p style="margin: 5px 0 0 0; color: #00ff88; font-size: 14px; font-weight: bold;">✓ Normal</p>
              </div>
              <div>
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Edad</p>
                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 14px;">${player?.age || 'N/A'} años</p>
              </div>
              <div>
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Equipo</p>
                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 14px;">${player?.team || 'N/A'}</p>
              </div>
              <div>
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">País</p>
                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 14px;">${player?.country || 'N/A'}</p>
              </div>
              <div>
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Rol</p>
                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 14px;">${player?.role || 'N/A'}</p>
              </div>
            </div>
          </div>

          <!-- Métricas Principales -->
          <div style="margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; color: #a855f7; font-size: 18px;">📊 Métricas Principales</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="background-color: #16213e; padding: 15px; border-radius: 8px; border: 1px solid #2d3561;">
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Ritmo Cardíaco Promedio</p>
                <p style="margin: 10px 0 0 0; color: #a855f7; font-size: 24px; font-weight: bold;">
                  ${parseFloat(analytics.avg_heart_rate).toFixed(1)} <span style="font-size: 14px;">BPM</span>
                </p>
              </div>
              <div style="background-color: #16213e; padding: 15px; border-radius: 8px; border: 1px solid #2d3561;">
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Saturación de Oxígeno Promedio</p>
                <p style="margin: 10px 0 0 0; color: #3b82f6; font-size: 24px; font-weight: bold;">
                  ${parseFloat(analytics.avg_oxygen_saturation).toFixed(1)} <span style="font-size: 14px;">%</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Última Lectura -->
          ${analytics.last_reading ? `
            <div style="margin-bottom: 30px; background-color: #16213e; padding: 20px; border-radius: 8px; border: 1px solid #2d3561;">
              <h2 style="margin: 0 0 15px 0; color: #a855f7; font-size: 18px;">⏱️ Última Lectura</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Ritmo Cardíaco</p>
                  <p style="margin: 5px 0 0 0; color: #a855f7; font-size: 16px; font-weight: bold;">
                    ${analytics.last_reading.heart_rate_avg} BPM
                  </p>
                </div>
                <div>
                  <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Oxigenación</p>
                  <p style="margin: 5px 0 0 0; color: #3b82f6; font-size: 16px; font-weight: bold;">
                    ${analytics.last_reading.oxygen_saturation_avg}% SpO₂
                  </p>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Pronóstico y Tendencias -->
          <div style="margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; color: #a855f7; font-size: 18px;">📈 Pronóstico (Próxima Hora)</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div style="background-color: #16213e; padding: 15px; border-radius: 8px; border: 1px solid #2d3561;">
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Tendencia HR</p>
                <p style="margin: 10px 0 0 0; color: #a855f7; font-size: 20px; font-weight: bold;">
                  ${analytics.forecast.heartRate} BPM
                </p>
              </div>
              <div style="background-color: #16213e; padding: 15px; border-radius: 8px; border: 1px solid #2d3561;">
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">Tendencia SpO₂</p>
                <p style="margin: 10px 0 0 0; color: #3b82f6; font-size: 20px; font-weight: bold;">
                  ${analytics.forecast.oxygen}%
                </p>
              </div>
              <div style="background-color: #16213e; padding: 15px; border-radius: 8px; border: 1px solid #2d3561;">
                <p style="margin: 0; color: #888888; font-size: 11px; text-transform: uppercase;">HRV (Variabilidad)</p>
                <p style="margin: 10px 0 0 0; color: #00ff88; font-size: 20px; font-weight: bold;">
                  ${analytics.forecast.hrv} ms
                </p>
              </div>
            </div>
          </div>

          <!-- Anomalías Detectadas -->
          ${analytics.anomalies && analytics.anomalies.length > 0 ? `
            <div style="background-color: #16213e; padding: 20px; border-radius: 8px; border: 1px solid #ffaa00; margin-bottom: 30px;">
              <h2 style="margin: 0 0 15px 0; color: #ffaa00; font-size: 18px;">⚠️ Anomalías Detectadas</h2>
              <ul style="margin: 0; padding-left: 20px; color: #ffaa00;">
                ${analytics.anomalies.map(a => `<li style="margin-bottom: 8px;">${a}</li>`).join('')}
              </ul>
            </div>
          ` : `
            <div style="background-color: #16213e; padding: 20px; border-radius: 8px; border: 1px solid #00ff88; margin-bottom: 30px;">
              <p style="margin: 0; color: #00ff88; font-weight: bold;">✓ No se detectaron anomalías en esta sesión</p>
            </div>
          `}

          <!-- Recomendaciones Personalizadas -->
          ${analytics.anomalies && analytics.anomalies.length > 0 ? `
            <div style="margin-bottom: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #00ff88; font-size: 18px;">💡 Recomendaciones Personalizadas</h2>
              ${generateRecommendationsPDF(analytics.anomalies, analytics.last_reading)}
            </div>
          ` : `
            <div style="margin-bottom: 30px; background-color: #16213e; padding: 20px; border-radius: 8px; border: 1px solid #2d3561;">
              <h2 style="margin: 0 0 15px 0; color: #00ff88; font-size: 16px;">💡 Consejos Generales para E-Sports</h2>
              <ul style="margin: 0; padding-left: 20px; color: #888888; line-height: 1.8;">
                <li style="margin-bottom: 8px;">Toma descansos de 5-10 minutos cada hora</li>
                <li style="margin-bottom: 8px;">Mantén buena postura durante las sesiones</li>
                <li style="margin-bottom: 8px;">Hidrátate regularmente (2-3 litros de agua al día)</li>
                <li style="margin-bottom: 8px;">Realiza ejercicio físico 3-4 veces por semana</li>
                <li style="margin-bottom: 8px;">Duerme 7-8 horas diarias</li>
              </ul>
            </div>
          `}

          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #2d3561; text-align: center; color: #555555; font-size: 11px;">
            <p style="margin: 0;">Reporte generado automáticamente por E-Sports Health Monitoring</p>
            <p style="margin: 5px 0 0 0;">Sistema de Análisis Biométrico con AWS Athena</p>
            <p style="margin: 10px 0 0 0; color: #ffaa00;">⚠️ Estas recomendaciones son generales. Consulta con un profesional de la salud.</p>
          </div>
        </div>
      `;

      tempContainer.innerHTML = htmlContent;
      document.body.appendChild(tempContainer);

      // Convertir a canvas
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#0a0a1a',
        scale: 2,
        logging: false
      });

      // Limpiar elemento temporal
      document.body.removeChild(tempContainer);

      // Crear PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // Ancho A4 en mm
      const pageHeight = 297; // Alto A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Agregar imágenes al PDF si es necesario hacer múltiples páginas
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Descargar PDF
      const timestamp = new Date().toISOString().slice(0, 10);
      pdf.save(`esports-health-report-${timestamp}.pdf`);

      setGenerating(false);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Error al generar el PDF. Verifica la consola para más detalles.');
      setGenerating(false);
    }
  };

  return (
    <button 
      onClick={generatePDF} 
      disabled={isDisabled || generating}
      className="pdf-button"
      title="Descargar reporte en PDF"
    >
      {generating ? (
        <>
          <Loader size={18} className="spinning" />
          Generando PDF...
        </>
      ) : (
        <>
          <FileDown size={18} />
          Descargar Reporte PDF
        </>
      )}
    </button>
  );
};

export default GeneratePDF;