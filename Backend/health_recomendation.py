from typing import List, Dict, Optional
from datetime import datetime
from pydantic import BaseModel

class HealthRecommendation(BaseModel):
    anomaly_type: str
    severity: str  # "leve", "moderada", "alta"
    detected_value: float
    normal_range: str
    recommendations: List[str]
    exercises: List[str]
    additional_tips: List[str]
    urgency: str  # "baja", "media", "alta"

class HealthRecommendationSystem:
    """
    Sistema de recomendaciones basado en anomalías detectadas en datos vitales
    """
    
    # Rangos normales
    NORMAL_HR_RANGE = (60, 100)  # bpm
    OPTIMAL_HR_RANGE = (70, 85)  # bpm
    NORMAL_SPO2_RANGE = (95, 100)  # %
    OPTIMAL_SPO2_RANGE = (97, 100)  # %
    
    @staticmethod
    def analyze_heart_rate(hr_avg: float, context: str = "reposo") -> Optional[HealthRecommendation]:
        """
        Analiza la frecuencia cardíaca y genera recomendaciones
        """
        
        # Bradicardia (FC baja)
        if hr_avg < 60:
            severity = "alta" if hr_avg < 50 else "moderada" if hr_avg < 55 else "leve"
            
            return HealthRecommendation(
                anomaly_type="Bradicardia - Frecuencia Cardíaca Baja",
                severity=severity,
                detected_value=hr_avg,
                normal_range="60-100 bpm",
                recommendations=[
                    "Consultar con un médico para descartar problemas cardíacos",
                    "Estimular suavemente el sistema cardiovascular",
                    "Monitorear síntomas como mareos o fatiga extrema",
                    "Evitar cambios bruscos de posición"
                ],
                exercises=[
                    "Caminatas rápidas de 20-30 min, 4-5 veces por semana",
                    "Subir escaleras a ritmo moderado (3-5 pisos)",
                    "Bicicleta estática suave (15-25 min, resistencia baja)",
                    "Natación de baja intensidad (estilo libre o espalda)",
                    "Rutinas de cardio ligero: jumping jacks lentos, marcha en el sitio",
                    "Entrenamientos de intervalos suaves: 1 min caminando rápido + 1 min despacio (repetir 10 veces)",
                    "Baile suave o zumba de baja intensidad"
                ],
                additional_tips=[
                    "Mantener hidratación adecuada (2-3 litros de agua al día)",
                    "Alimentación balanceada rica en potasio y magnesio",
                    "Dormir 7-9 horas diarias",
                    "Evitar el consumo excesivo de cafeína",
                    "Realizar chequeo médico si persiste"
                ],
                urgency="alta" if hr_avg < 50 else "media"
            )
        
        # Taquicardia (FC alta)
        elif hr_avg > 100:
            severity = "alta" if hr_avg > 120 else "moderada" if hr_avg > 110 else "leve"
            
            return HealthRecommendation(
                anomaly_type="Taquicardia - Frecuencia Cardíaca Elevada",
                severity=severity,
                detected_value=hr_avg,
                normal_range="60-100 bpm",
                recommendations=[
                    "Reducir el estrés y la ansiedad",
                    "Evitar estimulantes (cafeína, nicotina, bebidas energéticas)",
                    "Practicar técnicas de relajación",
                    "Consultar con un médico si es persistente"
                ],
                exercises=[
                    "Yoga suave y meditación (20-30 min diarios)",
                    "Respiración profunda: técnica 4-7-8 (inhalar 4 seg, retener 7, exhalar 8)",
                    "Tai Chi o Qigong para reducir estrés",
                    "Caminatas suaves en naturaleza (ritmo relajado)",
                    "Estiramientos suaves y progresivos",
                    "Ejercicios de relajación muscular progresiva"
                ],
                additional_tips=[
                    "Reducir consumo de cafeína y alcohol",
                    "Mantener horarios regulares de sueño",
                    "Evitar comidas pesadas antes de dormir",
                    "Practicar mindfulness o meditación guiada",
                    "Considerar suplementos de magnesio (consultar médico)"
                ],
                urgency="alta" if hr_avg > 120 else "media"
            )
        
        # FC ligeramente baja pero saludable
        elif 60 <= hr_avg < 65:
            return HealthRecommendation(
                anomaly_type="Frecuencia Cardíaca en Límite Inferior (Saludable)",
                severity="leve",
                detected_value=hr_avg,
                normal_range="60-100 bpm (óptimo: 70-85 bpm)",
                recommendations=[
                    "Estimular suavemente el sistema cardiovascular",
                    "Mejorar la circulación sanguínea",
                    "Fortalecer el corazón de forma progresiva"
                ],
                exercises=[
                    "Caminatas rápidas de 20-30 min, 4-5 veces por semana",
                    "Subir escaleras a ritmo moderado",
                    "Bicicleta estática suave (15-25 min)",
                    "Natación de baja intensidad",
                    "Rutinas de cardio ligero: jumping jacks lentos, marcha en el sitio, skipping suave",
                    "Entrenamientos de intervalos suaves: 1 min caminando rápido + 1 min despacio"
                ],
                additional_tips=[
                    "Mantener buena hidratación",
                    "Alimentación balanceada y nutritiva",
                    "Dormir adecuadamente (7-9 horas)",
                    "Reducir el estrés",
                    "Monitorear progreso semanalmente"
                ],
                urgency="baja"
            )
        
        return None
    
    @staticmethod
    def analyze_oxygen_saturation(spo2_avg: float) -> Optional[HealthRecommendation]:
        """
        Analiza la saturación de oxígeno y genera recomendaciones
        """
        
        # Hipoxemia severa
        if spo2_avg < 90:
            return HealthRecommendation(
                anomaly_type="Hipoxemia Severa - Oxigenación Críticamente Baja",
                severity="alta",
                detected_value=spo2_avg,
                normal_range="95-100%",
                recommendations=[
                    "⚠️ BUSCAR ATENCIÓN MÉDICA INMEDIATA",
                    "Puede requerir oxígeno suplementario",
                    "No realizar ejercicio hasta evaluación médica",
                    "Monitorear constantemente los niveles"
                ],
                exercises=[
                    "NO REALIZAR EJERCICIOS hasta consultar con médico",
                    "Reposo relativo",
                    "Respiración controlada bajo supervisión médica"
                ],
                additional_tips=[
                    "Llamar a emergencias si hay dificultad respiratoria",
                    "Permanecer en posición semi-sentada",
                    "Evitar esfuerzos físicos",
                    "Ventanas abiertas para mejor ventilación",
                    "Seguimiento médico urgente"
                ],
                urgency="alta"
            )
        
        # Hipoxemia moderada
        elif 90 <= spo2_avg < 94:
            return HealthRecommendation(
                anomaly_type="Hipoxemia Moderada - Oxigenación Reducida",
                severity="moderada",
                detected_value=spo2_avg,
                normal_range="95-100%",
                recommendations=[
                    "Consultar con un médico",
                    "Optimizar la respiración y capacidad pulmonar",
                    "Mejorar el intercambio de gases",
                    "Evitar ambientes con poca ventilación"
                ],
                exercises=[
                    "Respiración diafragmática: inhalar por nariz 4 seg, exhalar lento 6 seg (10 repeticiones, 3 veces al día)",
                    "Ejercicio de labios fruncidos (pursed-lip breathing): mejora intercambio de gases",
                    "Respiración cuadrada (box breathing): inhalar 4 seg – mantener 4 – exhalar 4 – mantener 4",
                    "Estiramientos torácicos para abrir el pecho",
                    "Caminatas al aire libre a ritmo muy suave (10-15 min)",
                    "Ejercicios de fortalecimiento respiratorio: soplar por un pitillo en agua 10-15 rep"
                ],
                additional_tips=[
                    "Dormir con cabecera elevada",
                    "Evitar tabaco y ambientes con humo",
                    "Mantener humedad adecuada en el ambiente",
                    "Hidratación constante",
                    "Consulta médica para descartar problemas pulmonares"
                ],
                urgency="alta"
            )
        
        # Oxigenación ligeramente reducida
        elif 94 <= spo2_avg < 96:
            return HealthRecommendation(
                anomaly_type="Saturación de Oxígeno Ligeramente Reducida",
                severity="leve",
                detected_value=spo2_avg,
                normal_range="95-100% (óptimo: 97-100%)",
                recommendations=[
                    "Optimizar la respiración y capacidad pulmonar",
                    "Mejorar la técnica respiratoria",
                    "Fortalecer los músculos respiratorios",
                    "Aumentar la actividad física gradualmente"
                ],
                exercises=[
                    "Respiración diafragmática: inhalar por nariz 4 seg, exhalar lento 6 seg",
                    "Ejercicio de labios fruncidos: ayuda a mejorar el intercambio de gases",
                    "Respiración cuadrada: inhalar 4 – mantener 4 – exhalar 4 – mantener 4",
                    "Estiramientos torácicos para abrir el pecho",
                    "Yoga suave: posturas que expanden el tórax (cobra, gato-camello, puente)",
                    "Caminatas al aire libre (20-30 min, ritmo cómodo)",
                    "Ejercicios de fortalecimiento respiratorio: soplar por un pitillo en agua 10-15 rep",
                    "Natación suave (mejora capacidad pulmonar)"
                ],
                additional_tips=[
                    "Practicar respiración consciente 3 veces al día",
                    "Mantener buena postura para facilitar respiración",
                    "Dormir en posición adecuada",
                    "Ventilar bien los espacios cerrados",
                    "Considerar actividades al aire libre",
                    "Monitorear progreso semanalmente"
                ],
                urgency="baja"
            )
        
        return None
    
    @staticmethod
    def generate_comprehensive_report(hr_avg: float, spo2_avg: float, 
                                     player_name: str = "Jugador",
                                     measurement_time: str = None) -> Dict:
        """
        Genera un reporte completo con todas las recomendaciones
        """
        
        if measurement_time is None:
            measurement_time = datetime.now().isoformat()
        
        hr_recommendation = HealthRecommendationSystem.analyze_heart_rate(hr_avg)
        spo2_recommendation = HealthRecommendationSystem.analyze_oxygen_saturation(spo2_avg)
        
        report = {
            "player_name": player_name,
            "measurement_time": measurement_time,
            "vital_signs": {
                "heart_rate_avg": hr_avg,
                "oxygen_saturation_avg": spo2_avg
            },
            "status": "normal",
            "recommendations": []
        }
        
        if hr_recommendation:
            report["recommendations"].append(hr_recommendation.dict())
            if hr_recommendation.urgency in ["media", "alta"]:
                report["status"] = "requiere_atencion"
        
        if spo2_recommendation:
            report["recommendations"].append(spo2_recommendation.dict())
            if spo2_recommendation.urgency in ["media", "alta"]:
                report["status"] = "requiere_atencion"
        
        if not report["recommendations"]:
            report["status"] = "excelente"
            report["message"] = "Todos los signos vitales están en rangos óptimos. ¡Sigue así!"
        
        return report


# Ejemplo de uso
if __name__ == "__main__":
    import json
    
    # Casos de prueba
    test_cases = [
        {"hr": 58, "spo2": 97.5, "name": "Jugador con FC baja"},
        {"hr": 85, "spo2": 95.2, "name": "Jugador con SpO2 ligeramente bajo"},
        {"hr": 62, "spo2": 94.8, "name": "Jugador con ambos valores bajos"},
        {"hr": 115, "spo2": 96.0, "name": "Jugador con taquicardia"},
        {"hr": 75, "spo2": 98.0, "name": "Jugador saludable"},
        {"hr": 48, "spo2": 88.5, "name": "Jugador con valores críticos"}
    ]
    
    print("="*80)
    print("SISTEMA DE RECOMENDACIONES DE SALUD - E-SPORTS")
    print("="*80)
    
    for i, case in enumerate(test_cases, 1):
        print(f"\n{'='*80}")
        print(f"CASO {i}: {case['name']}")
        print('='*80)
        
        report = HealthRecommendationSystem.generate_comprehensive_report(
            hr_avg=case['hr'],
            spo2_avg=case['spo2'],
            player_name=case['name']
        )
        
        print(json.dumps(report, indent=2, ensure_ascii=False))
        print("\n" + "-"*80)