import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { createMapaSala } from '../services/mapasala';

function MapaSalaCreatePage({ onCancel, salaId }) {
  const [form, setForm] = useState({ nombre: '', imagen: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      const file = files[0];
      setForm({ ...form, imagen: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      let imagenBase64 = null;
      if (form.imagen) {
        imagenBase64 = await toBase64(form.imagen);
      }
      await createMapaSala({ nombre: form.nombre, salaId, imagenBase64 });
      setSuccess(true);
      setForm({ nombre: '', imagen: null });
      setPreview(null);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleCancel = () => setConfirmCancel(true);
  const handleConfirmCancel = () => {
    setConfirmCancel(false);
    if (onCancel) onCancel();
  };
  const handleCloseDialog = () => setConfirmCancel(false);

  return (
    <Box m={3} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>Crear Mapa de Sala</Typography>
        <Typography variant="subtitle2" mb={2}>Sala ID: {salaId}</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Mapa creado correctamente!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            {form.imagen ? form.imagen.name : 'Seleccionar imagen'}
            <input
              type="file"
              name="imagen"
              accept="image/*"
              hidden
              onChange={handleChange}
            />
          </Button>
          {preview && (
            <Box mt={2} display="flex" justifyContent="center">
              <img src={preview} alt="Preview" style={{ maxWidth: 240, maxHeight: 160, border: '1px solid #ccc' }} />
            </Box>
          )}
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

export default MapaSalaCreatePage;
