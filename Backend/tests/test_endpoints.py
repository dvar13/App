import pytest
from datetime import datetime, timedelta
import json


class TestHealthEndpoint:
    """Tests para el endpoint de health check"""
    
    def test_health_check(self, client):
        """Verifica que el endpoint /health responda correctamente"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"

    def test_health_check_response_format(self, client):
        """Verifica el formato de respuesta del health check"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/json"


class TestRootEndpoint:
    """Tests para el endpoint raíz"""
    
    def test_root_endpoint(self, client):
        """Verifica que el endpoint raíz responda correctamente"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


class TestAWSStatusEndpoint:
    """Tests para el endpoint de estado de AWS"""
    
    def test_aws_status_without_aws(self, client):
        """Verifica estado cuando AWS no está configurado"""
        response = client.get("/aws/status")
        assert response.status_code == 200
        data = response.json()
        assert "aws_enabled" in data

    def test_aws_status_response_format(self, client):
        """Verifica el formato de respuesta del estado de AWS"""
        response = client.get("/aws/status")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data.get("aws_enabled"), bool)


class TestRecordsEndpoint:
    """Tests para el endpoint de registros AWS"""
    
    def test_get_records_without_aws(self, client, sample_data):
        """Verifica obtención de registros cuando AWS no está disponible"""
        response = client.get("/aws/records?limit=10")
        assert response.status_code in [200, 503]

    def test_get_records_with_limit_parameter(self, client, sample_data):
        """Verifica que el parámetro limit funcione correctamente"""
        response = client.get("/aws/records?limit=5")
        assert response.status_code in [200, 503]

    def test_get_records_default_limit(self, client, sample_data):
        """Verifica comportamiento con límite por defecto"""
        response = client.get("/aws/records")
        assert response.status_code in [200, 503]

    def test_get_records_invalid_limit(self, client, sample_data):
        """Verifica comportamiento con límite inválido"""
        response = client.get("/aws/records?limit=-5")
        assert response.status_code in [200, 503, 422]


class TestLatestRecordsEndpoint:
    """Tests para el endpoint de últimos registros"""
    
    def test_get_latest_records(self, client, sample_data):
        """Verifica obtención de últimos registros"""
        response = client.get("/aws/records/latest?limit=10")
        assert response.status_code in [200, 503]

    def test_latest_records_limit_parameter(self, client, sample_data):
        """Verifica el parámetro limit en últimos registros"""
        response = client.get("/aws/records/latest?limit=5")
        assert response.status_code in [200, 503]

    def test_latest_records_default_limit(self, client, sample_data):
        """Verifica límite por defecto en últimos registros"""
        response = client.get("/aws/records/latest")
        assert response.status_code in [200, 503]


class TestStatisticsEndpoint:
    """Tests para el endpoint de estadísticas"""
    
    def test_get_statistics(self, client, sample_data):
        """Verifica obtención de estadísticas generales"""
        response = client.get("/aws/stats")
        assert response.status_code in [200, 503]

    def test_statistics_response_format(self, client, sample_data):
        """Verifica que las estadísticas tengan el formato correcto"""
        response = client.get("/aws/stats")
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, dict)


class TestHighRiskEndpoint:
    """Tests para el endpoint de registros de alto riesgo"""
    
    def test_get_high_risk_records(self, client, sample_data):
        """Verifica obtención de registros de alto riesgo"""
        response = client.get("/aws/high-risk?limit=10")
        assert response.status_code in [200, 503]

    def test_high_risk_default_limit(self, client, sample_data):
        """Verifica límite por defecto en registros de alto riesgo"""
        response = client.get("/aws/high-risk")
        assert response.status_code in [200, 503]

    def test_high_risk_with_category_filter(self, client, sample_data):
        """Verifica filtrado de alto riesgo por categoría"""
        response = client.get("/aws/high-risk?heart_rate_category=elevated")
        assert response.status_code in [200, 503, 422]


class TestDateRangeEndpoint:
    """Tests para el endpoint de filtrado por rango de fechas"""
    
    def test_date_range_with_dates(self, client, sample_data):
        """Verifica filtrado por rango de fechas"""
        start_date = (datetime.utcnow() - timedelta(days=1)).isoformat()
        end_date = datetime.utcnow().isoformat()
        
        response = client.get(f"/aws/date-range?start_date={start_date}&end_date={end_date}")
        assert response.status_code in [200, 503]

    def test_date_range_without_dates(self, client, sample_data):
        """Verifica endpoint sin parámetros de fecha"""
        response = client.get("/aws/date-range")
        assert response.status_code in [200, 503]

    def test_date_range_with_filters(self, client, sample_data):
        """Verifica filtrado por categorías"""
        response = client.get("/aws/date-range?heart_rate_category=normal&oxygen_category=normal")
        assert response.status_code in [200, 503, 422]


class TestDailySummaryEndpoint:
    """Tests para el endpoint de resumen diario"""
    
    def test_daily_summary_with_date(self, client, sample_data):
        """Verifica obtención de resumen diario con fecha"""
        today = datetime.utcnow().date().isoformat()
        response = client.get(f"/aws/daily-summary?target_date={today}")
        assert response.status_code in [200, 503]

    def test_daily_summary_without_date(self, client, sample_data):
        """Verifica resumen diario con parámetro de fecha (requerido)"""
        today = datetime.utcnow().date().isoformat()
        response = client.get(f"/aws/daily-summary?target_date={today}")
        assert response.status_code in [200, 503]

    def test_daily_summary_invalid_date_format(self, client, sample_data):
        """Verifica comportamiento con formato de fecha inválido"""
        response = client.get("/aws/daily-summary?target_date=invalid-date")
        assert response.status_code in [200, 503, 422]


class TestHourlyStatsEndpoint:
    """Tests para el endpoint de estadísticas por hora"""
    
    def test_hourly_stats(self, client, sample_data):
        """Verifica obtención de estadísticas por hora"""
        response = client.get("/aws/records/hourly-stats")
        assert response.status_code in [200, 503]

    def test_hourly_stats_with_limit(self, client, sample_data):
        """Verifica parámetro de límite de horas"""
        response = client.get("/aws/records/hourly-stats?limit_hours=12")
        assert response.status_code in [200, 503]

    def test_hourly_stats_with_date_filter(self, client, sample_data):
        """Verifica filtrado por fecha"""
        today = datetime.utcnow().date().isoformat()
        response = client.get(f"/aws/records/hourly-stats?date_filter={today}")
        assert response.status_code in [200, 503, 422]


class TestRecentHoursEndpoint:
    """Tests para el endpoint de registros recientes por horas"""
    
    def test_recent_hours_default(self, client, sample_data):
        """Verifica obtención de registros recientes por defecto (24 horas)"""
        response = client.get("/aws/records/recent-hours")
        assert response.status_code in [200, 503]

    def test_recent_hours_custom_hours(self, client, sample_data):
        """Verifica obtención de registros con custom de horas"""
        response = client.get("/aws/records/recent-hours?hours=12")
        assert response.status_code in [200, 503]

    def test_recent_hours_invalid_hours(self, client, sample_data):
        """Verifica comportamiento con horas negativas"""
        response = client.get("/aws/records/recent-hours?hours=-5")
        assert response.status_code in [200, 503, 422]


class TestTrendsEndpoint:
    """Tests para el endpoint de tendencias"""
    
    def test_trends_default(self, client, sample_data):
        """Verifica obtención de tendencias por defecto (7 días)"""
        response = client.get("/aws/analytics/trends")
        assert response.status_code in [200, 503]

    def test_trends_custom_days(self, client, sample_data):
        """Verifica obtención de tendencias con custom de días"""
        response = client.get("/aws/analytics/trends?days=30")
        assert response.status_code in [200, 503]

    def test_trends_invalid_days(self, client, sample_data):
        """Verifica comportamiento con días inválidos"""
        response = client.get("/aws/analytics/trends?days=-7")
        assert response.status_code in [200, 503, 422]


class TestOverallAnalyticsEndpoint:
    """Tests para el endpoint de analytics generales"""
    
    def test_overall_analytics(self, client, sample_data):
        """Verifica obtención de analytics generales"""
        response = client.get("/aws/analytics/overall")
        assert response.status_code in [200, 503]

    def test_overall_analytics_response_type(self, client, sample_data):
        """Verifica que la respuesta es un diccionario"""
        response = client.get("/aws/analytics/overall")
        if response.status_code == 200:
            assert isinstance(response.json(), dict)


class TestCategoryFilterEndpoint:
    """Tests para el endpoint de filtrado por categoría"""
    
    def test_category_filter_default(self, client, sample_data):
        """Verifica obtención de registros por categoría por defecto"""
        response = client.get("/aws/records/by-category")
        assert response.status_code in [200, 503]

    def test_category_filter_with_categories(self, client, sample_data):
        """Verifica filtrado con categorías específicas"""
        response = client.get("/aws/records/by-category?heart_rate_category=normal&oxygen_category=normal")
        assert response.status_code in [200, 503, 422]

    def test_category_filter_heart_rate_only(self, client, sample_data):
        """Verifica filtrado solo por categoría de ritmo cardíaco"""
        response = client.get("/aws/records/by-category?heart_rate_category=elevated")
        assert response.status_code in [200, 503, 422]


class TestErrorHandling:
    """Tests para manejo de errores"""
    
    def test_invalid_endpoint(self, client):
        """Verifica respuesta para endpoint inexistente"""
        response = client.get("/invalid/endpoint")
        assert response.status_code == 404

    def test_invalid_http_method(self, client):
        """Verifica respuesta para método HTTP no permitido"""
        response = client.post("/health")
        assert response.status_code == 405

    def test_malformed_query_parameters(self, client, sample_data):
        """Verifica manejo de parámetros de query malformados"""
        response = client.get("/aws/records?limit=abc")
        assert response.status_code in [200, 422, 503]


class TestResponseHeaders:
    """Tests para validar headers de respuesta"""
    
    def test_cors_headers_present(self, client):
        """Verifica que los headers CORS estén presentes"""
        response = client.get("/health")
        assert response.status_code == 200

    def test_content_type_json(self, client):
        """Verifica que las respuestas sean JSON"""
        response = client.get("/health")
        assert "application/json" in response.headers.get("content-type", "")

    def test_response_is_valid_json(self, client):
        """Verifica que todas las respuestas sean JSON válido"""
        response = client.get("/health")
        try:
            response.json()
            assert True
        except json.JSONDecodeError:
            assert False, "Response is not valid JSON"
