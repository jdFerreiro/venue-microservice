import React, { useState } from 'react';
import { createSala } from '../services/api';
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
  DialogActions
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function SalaCreatePage({ onCancel }) {
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
      await createSala(form);
      setSuccess(true);
      setForm({ name: '' });
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
    <Box m={3} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>Crear Sala</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Sala creada correctamente!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>}
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

export default SalaCreatePage;
