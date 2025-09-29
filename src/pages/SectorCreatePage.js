import React, { useState, useEffect } from 'react';
import { createSector } from '../services/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import { fetchResourceList } from '../services/api';

function SectorCreatePage({ onCancel, salaId, salaNombre }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    capacity: '',
    price: '',
    discount: '',
    statusId: '',
    butacas: []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    fetchResourceList('estado-sector').then(data => setEstados(Array.isArray(data) ? data : []));
  }, []);

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
      // Convertir los campos numéricos
      const payload = {
        ...form,
        salaId,
        capacity: Number(form.capacity),
        price: Number(form.price),
        discount: Number(form.discount),
        statusId: Number(form.statusId),
      };
      await createSector(payload);
      setSuccess(true);
      if (onCancel) onCancel(); // Cierra el diálogo al guardar correctamente
    } catch (err) {
      setError(err);
      // Si el error tiene detalles de campos
      if (err && err.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed && typeof parsed === 'object') {
            setFieldErrors(parsed);
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

  return (
    <Box m={3} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>Crear Sector</Typography>
  <Typography variant="subtitle2" mb={2}>Sala: {salaNombre}</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Sector creado correctamente!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
          />
          <TextField
            label="Descripción"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
          />
          <TextField
            label="Capacidad"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            error={!!fieldErrors.capacity}
            helperText={fieldErrors.capacity}
          />
          <TextField
            label="Precio"
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            error={!!fieldErrors.price}
            helperText={fieldErrors.price}
          />
          <TextField
            label="Descuento"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            error={!!fieldErrors.discount}
            helperText={fieldErrors.discount}
          />
          <TextField
            select
            label="Estado"
            name="statusId"
            value={form.statusId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.statusId}
            helperText={fieldErrors.statusId}
          >
            <MenuItem value=""><em>-- Selecciona --</em></MenuItem>
            {estados.map(e => (
              <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
            ))}
          </TextField>
          {/* El campo butacas es un array, se omite en el formulario de alta manual */}
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
        <DialogTitle>¿Cancelar creación?</DialogTitle>
        <DialogContent>Se perderán los datos ingresados. ¿Deseas continuar?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">No</Button>
          <Button onClick={handleConfirmCancel} color="secondary">Sí, cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SectorCreatePage;
