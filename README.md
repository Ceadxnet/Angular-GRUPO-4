# Angular — Gestión de cursos

Aplicación web en Angular para administrar cursos mediante operaciones CRUD contra una API REST.

## Autores

- Alcivar Dominguez Christian Eduardo
- Zambrano Bravo Ivan Eduardo

## Funcionalidades

- Alta, listado, edición y baja de cursos
- Consumo de API con `HttpClient`
- Formularios con `ngModel`
- Interfaz adaptable a distintos tamaños de pantalla

## Modelo de datos

- nombre
- docente
- créditos

## API

Endpoints previstos:

- `GET /api/cursos`
- `GET /api/cursos/{id}`
- `POST /api/cursos`
- `PUT /api/cursos/{id}`
- `DELETE /api/cursos/{id}`

En local, el proxy redirige `/api` a `http://localhost:8080`.

## Instalación y arranque

```bash
npm install
npm start
```

La app queda en `http://localhost:4200`. El backend debe estar disponible en `http://localhost:8080` para probar el CRUD.
