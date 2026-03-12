# App

Plataforma de **monitoreo biométrico** para jugadores de **E-Sports**.

## Descripción
Este repositorio contiene una aplicación web con:
- **Backend** en **FastAPI** (API REST).
- **Frontend** en **React + Vite**, compilado a archivos estáticos para ser servido por **Nginx**.

## Stack
- Backend: Python + FastAPI
- Frontend: JavaScript + React + Vite
- Servidor web (producción): Nginx (sirviendo `dist/`)

## Requisitos
- Node.js + npm
- Python 3.x

## Frontend
Ruta:
- `frontend/frontend`

### Build (según tu servidor)
```bash
cd /home/ubuntu/App/frontend/frontend
npm ci
npm install html2canvas jspdf
npm run build

# Ajustar permisos para que nginx (www-data) pueda servir los archivos
sudo chown -R ubuntu:www-data /home/ubuntu/App/frontend/frontend/dist
sudo find /home/ubuntu/App/frontend/frontend/dist -type d -exec chmod 755 {} +
sudo find /home/ubuntu/App/frontend/frontend/dist -type f -exec chmod 644 {} +
```

## Backend (FastAPI)
> Nota: completa aquí el comando exacto que usas para ejecutar el backend (por ejemplo `uvicorn ...`).

Ejemplo típico en desarrollo:
```bash
# desde la carpeta del backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Estructura del repositorio (resumen)
- `README.md`: documentación principal
- `frontend/`: código del frontend

## Contribución
1. Crea una rama
2. Haz tus cambios
3. Abre un Pull Request
