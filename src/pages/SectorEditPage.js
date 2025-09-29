import React, { useEffect, useState } from 'react';
import { fetchResourceList } from '../services/api';
import { fetchResourceDetail, updateResource } from '../services/api';
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
  MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function SectorEditPage({ id, onCancel, salaId, salaNombre }) {
  const [sector, setSector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    capacity: '',
    price: '',
    discount: '',
    statusId: '',
    butacas: []
  });
  const [success, setSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    fetchResourceList('estado-sector').then(data => setEstados(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (id) {
      fetchResourceDetail('sector', id)
        .then(data => {
          setSector(data);
          setForm({
            name: data.name || '',
            description: data.description || '',
            capacity: data.capacity || '',
            price: data.price || '',
            discount: data.discount || '',
            statusId: data.statusId || '',
            butacas: data.butacas || []
          });
        })
        .catch(setError)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);
    try {
      if (id) {
        const payload = {
          ...form,
          salaId,
          capacity: Number(form.capacity),
          price: Number(form.price),
          discount: Number(form.discount),
          statusId: Number(form.statusId),
        };
        await updateResource('sector', id, payload);
        setSuccess(true);
        // Solo cerrar el diálogo si NO hay errores
        if (onCancel) onCancel();
      }
    } catch (err) {
      setError(err);
      // Si el error tiene detalles de campos
      if (err && err.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed && typeof parsed === 'object') {
            setFieldErrors(parsed);
            return; // No cerrar el diálogo si hay errores de validación
          }
        } catch {}
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setConfirmCancel(true);
  const handleConfirmCancel = () => {
    setConfirmCancel(false);
    if (onCancel) onCancel(); // Cierra el diálogo al cancelar
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
        <Typography variant="h5" mb={2}>{id ? 'Editar Sector' : 'Crear Sector'}</Typography>
  <Typography variant="subtitle2" mb={2}>Sala: {salaNombre}</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Guardado correctamente!</Alert>}
        <form onSubmit={handleSubmit} aria-label="Formulario de edición de sector">
          <TextField
            id="sector-name"
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
            inputProps={{ 'aria-label': 'Nombre', id: 'sector-name', name: 'name' }}
          />
          <TextField
            id="sector-description"
            label="Descripción"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
            inputProps={{ 'aria-label': 'Descripción', id: 'sector-description', name: 'description' }}
          />
          <TextField
            id="sector-capacity"
            label="Capacidad"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            error={!!fieldErrors.capacity}
            helperText={fieldErrors.capacity}
            inputProps={{ 'aria-label': 'Capacidad', id: 'sector-capacity', name: 'capacity' }}
          />
          <TextField
            id="sector-price"
            label="Precio"
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            error={!!fieldErrors.price}
            helperText={fieldErrors.price}
            inputProps={{ 'aria-label': 'Precio', id: 'sector-price', name: 'price' }}
          />
          <TextField
            id="sector-discount"
            label="Descuento"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            error={!!fieldErrors.discount}
            helperText={fieldErrors.discount}
            inputProps={{ 'aria-label': 'Descuento', id: 'sector-discount', name: 'discount' }}
          />
          <TextField
            id="sector-statusId"
            select
            label="Estado"
            name="statusId"
            value={form.statusId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.statusId}
            helperText={fieldErrors.statusId}
            inputProps={{ 'aria-label': 'Estado', id: 'sector-statusId', name: 'statusId' }}
          >
            <MenuItem value=""><em>-- Selecciona --</em></MenuItem>
            {estados.map(e => (
              <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
            ))}
          </TextField>
          {/* El campo butacas es un array, se omite en el formulario de edición manual */}
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

export default SectorEditPage;
