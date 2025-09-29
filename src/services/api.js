// Obtiene salas por teatro usando el endpoint correcto (query string)
export async function fetchSalasByTeatro(teatroId) {
  const response = await fetch(`${API_BASE_URL}/sala/byTeatro/${encodeURIComponent(teatroId)}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener salas por teatro');
  }
  return response.json();
}

// Obtiene sectores por sala usando el endpoint correcto (query string)
export async function fetchSectoresBySala(salaId) {
  const response = await fetch(`${API_BASE_URL}/sector/bySala/${encodeURIComponent(salaId)}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener sectores por sala');
  }
  return response.json();
}
import { Api } from "@mui/icons-material";

export async function createEstadoButaca(data) {
  // Cambia endpoint y DTO a /butaca-estado y { name }
  const response = await fetch(`${API_BASE_URL}/butaca-estado`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  body: JSON.stringify({ name: data.name }),
  });
  if (response.status === 401) {
    const error = new Error('401');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    let errMsg = 'Error al crear estado de butaca';
    try {
      const text = await response.text();
      try {
        const errBody = JSON.parse(text);
        if (errBody && errBody.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(' | ') : errBody.message;
        } else {
          errMsg = text;
        }
      } catch {
        errMsg = text;
      }
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function createEstadoSector(data) {
  // Cambia endpoint y DTO a /sector-estado y { name }
  const response = await fetch(`${API_BASE_URL}/sector-estado`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  body: JSON.stringify({ name: data.name }),
  });
  if (response.status === 401) {
    const error = new Error('401');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    let errMsg = 'Error al crear estado de sector';
    try {
      const text = await response.text();
      try {
        const errBody = JSON.parse(text);
        if (errBody && errBody.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(' | ') : errBody.message;
        } else {
          errMsg = text;
        }
      } catch {
        errMsg = text;
      }
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }
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
  if (response.status === 401) {
    const error = new Error('401');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    let errMsg = 'Error al crear butaca';
    try {
      const text = await response.text();
      try {
        const errBody = JSON.parse(text);
        if (errBody && errBody.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(' | ') : errBody.message;
        } else {
          errMsg = text;
        }
      } catch {
        errMsg = text;
      }
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }
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
  if (response.status === 401) {
    const error = new Error('401');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    let errMsg = 'Error al crear sector';
    try {
      const text = await response.text();
      try {
        const errBody = JSON.parse(text);
        if (errBody && errBody.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(' | ') : errBody.message;
        } else {
          errMsg = text;
        }
      } catch {
        errMsg = text;
      }
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }
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
  if (response.status === 401) {
    const error = new Error('401');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    let errMsg = 'Error al crear sala';
    try {
      const text = await response.text();
      try {
        const errBody = JSON.parse(text);
        if (errBody && errBody.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(' | ') : errBody.message;
        } else {
          errMsg = text;
        }
      } catch {
        errMsg = text;
      }
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
export async function deleteResource(endpoint, id) {
  // Corrige endpoints para sector-estado y butaca-estado
  let realEndpoint = endpoint;
  if (endpoint === 'estado-sector') realEndpoint = 'sector-estado';
  if (endpoint === 'estado-butaca') realEndpoint = 'butaca-estado';
  const response = await fetch(`${API_BASE_URL}/${realEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (response.status === 401) {
    const error = new Error('401');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    let errMsg = 'Error al eliminar';
    try {
      const text = await response.text();
      try {
        const errBody = JSON.parse(text);
        if (errBody && errBody.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(' | ') : errBody.message;
        } else {
          errMsg = text;
        }
      } catch {
        errMsg = text;
      }
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
// UpdateTeatroDto y CreateTeatroDto: { name: string }

export async function createTeatro(data) {
  const jsonBody = JSON.stringify(data);
  const response = await fetch(`${API_BASE_URL}/teatro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (response.status === 401) {
    const error = new Error('401');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    let errMsg = 'Error al crear teatro';
    try {
      const text = await response.text();
      try {
        const errBody = JSON.parse(text);
        if (errBody && errBody.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(' | ') : errBody.message;
        } else {
          errMsg = text;
        }
      } catch {
        errMsg = text;
      }
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

const API_BASE_URL = process.env.REACT_APP_VENUE_API_BASE_URL;

function getAuthHeaders() {
  const token = sessionStorage.getItem('uToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchResourceList(endpoint) {
  // Corrige endpoints para sector-estado y butaca-estado
  let realEndpoint = endpoint;
  if (endpoint === 'estado-sector') realEndpoint = 'sector-estado';
  if (endpoint === 'estado-butaca') realEndpoint = 'butaca-estado';
  const response = await fetch(`${API_BASE_URL}/${realEndpoint}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (response.status === 401) {
    // Si es 401, regresar null para que el frontend pueda manejar el flujo de autenticación
    return null;
  }
  if (!response.ok) {
    const error = new Error(`Error al obtener datos (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchResourceDetail(endpoint, id) {
  // Corrige endpoints para sector-estado y butaca-estado
  let realEndpoint = endpoint;
  if (endpoint === 'estado-sector') realEndpoint = 'sector-estado';
  if (endpoint === 'estado-butaca') realEndpoint = 'butaca-estado';
  const response = await fetch(`${API_BASE_URL}/${realEndpoint}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (response.status === 401) {
    const error = new Error('401');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    let errMsg = 'Error al obtener detalle';
    try {
      const text = await response.text();
      try {
        const errBody = JSON.parse(text);
        if (errBody && errBody.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(' | ') : errBody.message;
        } else {
          errMsg = text;
        }
      } catch {
        errMsg = text;
      }
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }
  return response.json();
}


export async function updateResource(endpoint, id, data) {
  // Corrige endpoints y DTOs para sector-estado y butaca-estado
  let realEndpoint = endpoint;
  let realData = data;
  if (endpoint === 'estado-sector') {
    realEndpoint = 'sector-estado';
    realData = { name: data.name };
  }
  if (endpoint === 'estado-butaca') {
    realEndpoint = 'butaca-estado';
    realData = { name: data.name };
  }
  const response = await fetch(`${API_BASE_URL}/${realEndpoint}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  body: JSON.stringify(realData),
  });
  if (response.status === 401) {
    const error = new Error('401');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    let errMsg = 'Error al actualizar';
    try {
      const text = await response.text();
      try {
        const errBody = JSON.parse(text);
        if (errBody && errBody.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(' | ') : errBody.message;
        } else {
          errMsg = text;
        }
      } catch {
        errMsg = text;
      }
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
