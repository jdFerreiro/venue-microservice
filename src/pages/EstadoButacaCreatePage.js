import React, { useState } from 'react';
import { createEstadoButaca } from '../services/api';
import { Box, TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function EstadoButacaCreatePage({ onCancel, onSuccess }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await createEstadoButaca(form);
      setSuccess(true);
      setForm({ nombre: '', descripcion: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
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
    <Box mt={2}>
      <Paper elevation={0} sx={{ p: 2 }}>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Estado creado correctamente!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={saving}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} disabled={saving}>Guardar</Button>
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

export default EstadoButacaCreatePage;
