// Servicio para obtener clubes desde el microservicio de identity
const URL_BASE = process.env.REACT_APP_IDENTITY_API_BASE_URL;

export async function fetchClubs() {
  const token = sessionStorage.getItem('uToken');
  console.log('Token enviado en Authorization:', token);
  const res = await fetch(`${URL_BASE}/clubs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al obtener clubes');
  return res.json();
}
