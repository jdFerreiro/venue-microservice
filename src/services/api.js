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

const API_BASE_URL = process.env.REACT_VENUE_API_BASE_URL;


function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
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
