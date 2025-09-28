import React, { useEffect, useState } from 'react';
import { fetchResourceDetail, updateResource } from '../services/api';
import { fetchClubs } from '../services/clubs';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useParams } from 'react-router-dom';


function TheatreEditPage({ id: propId, onCancel }) {
  const params = useParams();
  const id = propId || params.id;
  const [theatre, setTheatre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    contactName: '',
    contactPhone: '',
    clubId: '',
    isactive: true
  });
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    setLoadingClubs(true);
    fetchClubs()
      .then(setClubs)
      .catch(() => setClubs([]))
      .finally(() => setLoadingClubs(false));
  }, []);

  useEffect(() => {
    if (id) {
      fetchResourceDetail('teatro', id)
        .then(data => {
          setTheatre(data);
          setForm({
            name: data.name || '',
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            contactName: data.contactName || '',
            contactPhone: data.contactPhone || '',
            clubId: data.clubId || '',
            isactive: typeof data.isactive === 'boolean' ? data.isactive : true
          });
        })
        .catch(setError)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const [success, setSuccess] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    // Validación mínima
    const requiredFields = ['name', 'address', 'city', 'country', 'contactName', 'contactPhone', 'clubId'];
    for (const field of requiredFields) {
      if (!form[field]) {
        setError(new Error('Todos los campos son obligatorios.'));
        setSaving(false);
        return;
      }
    }
    try {
      if (id) {
        await updateResource('teatro', id, { ...form, isactive: form.isactive });
        setSuccess(true);
        if (onCancel) {
          setTimeout(() => {
            onCancel();
          }, 500); // Da un pequeño tiempo para mostrar el mensaje de éxito si existe
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setConfirmCancel(true);
  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setConfirmCancel(false);
  };
  const handleCloseDialog = () => setConfirmCancel(false);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <CircularProgress />
    </Box>
  );
  if (error) return (
    <Box m={2}><Alert severity="error">Error: {error.message}</Alert></Box>
  );

  return (
    <Box m={3} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>{id ? 'Editar Teatro' : 'Crear Teatro'}</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Guardado correctamente!</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Dirección"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Ciudad"
            name="city"
            value={form.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="País"
            name="country"
            value={form.country}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Nombre de contacto"
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Teléfono de contacto"
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isactive}
                onChange={handleChange}
                name="isactive"
                color="primary"
              />
            }
            label={form.isactive ? 'Activo' : 'Inactivo'}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="club-select-label">Club/Empresa</InputLabel>
            <Select
              labelId="club-select-label"
              name="clubId"
              value={form.clubId}
              label="Club/Empresa"
              onChange={handleChange}
              disabled={loadingClubs}
            >
              <MenuItem value=""><em>Seleccione un club</em></MenuItem>
              {clubs.map(club => (
                <MenuItem key={club.id} value={club.id}>
                  <ListItemIcon>
                    {club.logo ? (
                      <img
                        src={club.logo.startsWith('data:') ? club.logo : `data:image/*;base64,${club.logo}`}
                        alt={club.name}
                        style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }}
                      />
                    ) : (
                      <Box sx={{ width: 32, height: 32, bgcolor: '#eee', borderRadius: 4 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={club.name} />
                </MenuItem>
              ))}
            </Select>
            {loadingClubs && <CircularProgress size={20} sx={{ ml: 2 }} />}
          </FormControl>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              Guardar
            </Button>
          </Box>
        </form>
      </Paper>
      <Dialog open={confirmCancel} onClose={handleCloseDialog}>
        <DialogTitle>¿Cancelar edición?</DialogTitle>
        <DialogContent>Se perderán los cambios no guardados. ¿Deseas continuar?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">No</Button>
          <Button onClick={handleConfirmCancel} color="secondary">Sí, cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TheatreEditPage;
