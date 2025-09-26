import React, { useEffect, useState } from 'react';
import { fetchResourceDetail, updateResource } from '../services/api';
import { Box, TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Paper, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function EstadoSectorEditPage({ id, onCancel, onSuccess }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResourceDetail('estado-sector', id)
        .then(data => {
          setForm({ nombre: data.nombre || '', descripcion: data.descripcion || '' });
        })
        .catch(setError)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      if (id) {
        await updateResource('estado-sector', id, form);
        setSuccess(true);
        if (onSuccess) onSuccess();
      }
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

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <CircularProgress />
    </Box>
  );
  if (error) return (
    <Box m={2}><Alert severity="error">Error: {error.message}</Alert></Box>
  );

  return (
    <Box mt={2}>
      <Paper elevation={0} sx={{ p: 2 }}>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Guardado correctamente!</Alert>}
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

export default EstadoSectorEditPage;
