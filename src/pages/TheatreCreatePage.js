
import React, { useState, useEffect } from 'react';
import { createTeatro } from '../services/api';
import { fetchClubs } from '../services/clubs';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Switch
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';


function TheatreCreatePage({ onCancel, onUnauthorized }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    clubId: '',
    isactive: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    setLoadingClubs(true);
    fetchClubs()
      .then(setClubs)
      .catch(() => setClubs([]))
      .finally(() => setLoadingClubs(false));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    // Validación mínima
    const requiredFields = ['name', 'address', 'city', 'country', 'contactName', 'contactPhone', 'clubId'];
    const newFieldErrors = {};
    for (const field of requiredFields) {
      if (!form[field] || (typeof form[field] === 'string' && form[field].trim() === '')) {
        newFieldErrors[field] = 'Este campo es obligatorio';
      }
    }
    // Validación de formato de email si se ingresó
    if (form.contactEmail && form.contactEmail.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.contactEmail)) {
        newFieldErrors.contactEmail = 'El email no tiene un formato válido';
      }
    }
    // Validación de formato internacional para teléfono si se ingresó
    if (form.contactPhone && form.contactPhone.trim() !== '') {
      // Formato internacional: +[código][número], mínimo 8 dígitos, máximo 15
      const phoneRegex = /^\+[1-9]\d{7,14}$/;
      if (!phoneRegex.test(form.contactPhone)) {
        newFieldErrors.contactPhone = 'El teléfono debe tener formato internacional, por ejemplo: +34123456789';
      }
    }
    setFieldErrors(newFieldErrors);
    if (Object.keys(newFieldErrors).length > 0) {
      setError(new Error('Por favor completa todos los campos obligatorios y corrige los errores.'));
      setSaving(false);
      return;
    }
    try {
      // Solo filtrar undefined/null, pero address siempre debe ir aunque sea string vacío
      const payload = Object.fromEntries(
        Object.entries(form)
          .filter(([k, v]) => v !== undefined && v !== null || k === 'address')
      );
      if (!('address' in payload)) payload.address = '';
      await createTeatro(payload);
      setSuccess(true);
      if (onCancel) {
        setTimeout(() => {
          onCancel();
        }, 500); // Da un pequeño tiempo para mostrar el mensaje de éxito si existe
      }
      setForm({
        name: '',
        description: '',
        address: '',
        city: '',
        country: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        clubId: '',
        isactive: true
      });
    } catch (err) {
      if (err.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setConfirmCancel(true);
  const handleConfirmCancel = () => {
    setConfirmCancel(false);
    if (onCancel) onCancel();
  };
  const handleCloseDialog = () => setConfirmCancel(false);

  return (
    <Box m={3} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>Crear Teatro</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Teatro creado correctamente!</Alert>}
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
          />
          <TextField
            label="Dirección"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.address}
            helperText={fieldErrors.address}
          />
          <TextField
            label="Ciudad"
            name="city"
            value={form.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.city}
            helperText={fieldErrors.city}
          />
          <TextField
            label="País"
            name="country"
            value={form.country}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.country}
            helperText={fieldErrors.country}
          />
          <TextField
            label="Nombre de contacto"
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.contactName}
            helperText={fieldErrors.contactName}
          />
          <TextField
            label="Email de contacto"
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.contactEmail}
            helperText={fieldErrors.contactEmail}
          />
          <TextField
            label="Teléfono de contacto"
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.contactPhone}
            helperText={fieldErrors.contactPhone || 'Ejemplo: +34123456789'}
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
          <FormControl fullWidth margin="normal" error={!!fieldErrors.clubId}>
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
            {fieldErrors.clubId && (
              <Typography variant="caption" color="error">{fieldErrors.clubId}</Typography>
            )}
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

export default TheatreCreatePage;
