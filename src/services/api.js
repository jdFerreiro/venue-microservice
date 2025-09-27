import { Api } from "@mui/icons-material";

export async function createEstadoButaca(data) {
  const response = await fetch(`${API_BASE_URL}/estado-butaca`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear estado de butaca');
  return response.json();
}

export async function createEstadoSector(data) {
  const response = await fetch(`${API_BASE_URL}/estado-sector`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear estado de sector');
  return response.json();
}
export async function createButaca(data) {
  const response = await fetch(`${API_BASE_URL}/butaca`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear butaca');
  return response.json();
}
export async function createSector(data) {
  const response = await fetch(`${API_BASE_URL}/sector`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear sector');
  return response.json();
}
export async function createSala(data) {
  const response = await fetch(`${API_BASE_URL}/sala`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear sala');
  return response.json();
}
export async function deleteResource(endpoint, id) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al eliminar');
  return response.json();
}
// UpdateTeatroDto y CreateTeatroDto: { name: string }

export async function createTeatro(data) {
  const response = await fetch(`${API_BASE_URL}/teatro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear teatro');
  return response.json();
}

const API_BASE_URL = process.env.REACT_APP_VENUE_API_BASE_URL;

function getAuthHeaders() {
  sessionStorage.setItem('uToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmM4M2YwZC1kZDI2LTQ1ZjAtOTAzOS05NTc4YjM3N2Q3YTIiLCJlbWFpbCI6ImR1bW15X2FkbWluaXN0cmFkb3JAZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJEdW1teUFkbWluaXN0cmFkb3IiLCJsYXN0TmFtZSI6IkV4YW1wbGUiLCJyb2xlSWQiOiI0ZWM1ZjY0NS1hYTc1LTRiNmQtYjlkOS02MzIzMjQ4OTU5MTQiLCJyb2xlTmFtZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTg5NDQ1MTYsImV4cCI6MTc1ODk0ODExNn0.k3K19mA_ac8ZpGJ9LPhnY6UTK_qNDVQrcXY9Qz5W258');
  const token = sessionStorage.getItem('uToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchResourceList(endpoint) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener datos');
  return response.json();
}

export async function fetchResourceDetail(endpoint, id) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener detalle');
  return response.json();
}


export async function updateResource(endpoint, id, data) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar');
  return response.json();
}
