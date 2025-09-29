import React, { useState } from 'react';
import { createEstadoSector } from '../services/api';
import { Box, TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function EstadoSectorCreatePage({ onCancel, onSuccess }) {
  const [form, setForm] = useState({ name: '' });
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
      await createEstadoSector({ name: form.name });
      setSuccess(true);
      setForm({ name: '', descripcion: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      let msg = '';
      if (err && typeof err === 'object') {
        if (Array.isArray(err.message)) {
          msg = err.message.join(' | ');
        } else if (typeof err.message === 'string') {
          try {
            const parsed = JSON.parse(err.message);
            if (parsed && parsed.message) {
              msg = Array.isArray(parsed.message) ? parsed.message.join(' | ') : parsed.message;
            } else {
              msg = err.message;
            }
          } catch {
            msg = err.message;
          }
        } else if (err.message) {
          msg = JSON.stringify(err.message);
        } else if (err.error) {
          msg = err.error;
        } else {
          msg = JSON.stringify(err);
        }
      } else if (typeof err === 'string') {
        try {
          const parsed = JSON.parse(err);
          if (parsed && parsed.message) {
            msg = Array.isArray(parsed.message) ? parsed.message.join(' | ') : parsed.message;
          } else {
            msg = err;
          }
        } catch {
          msg = err;
        }
      } else {
        msg = 'Error desconocido';
      }
      setError({ ...err, message: msg });
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {Array.isArray(error.message)
              ? error.message.map((msg, idx) => <div key={idx}>{msg}</div>)
              : error.message}
          </Alert>
        )}
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

export default EstadoSectorCreatePage;
