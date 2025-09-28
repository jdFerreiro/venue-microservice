import React, { useEffect, useState } from 'react';
import { fetchResourceDetail, updateResource, fetchResourceList } from '../services/api';
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
  DialogActions
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function SalaEditPage({ id, onCancel, teatroId }) {
  const [sala, setSala] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [success, setSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [nameError, setNameError] = useState('');
  const [salas, setSalas] = useState([]);

  useEffect(() => {
    if (id) {
      fetchResourceDetail('sala', id)
        .then(data => {
          setSala(data);
          setForm({ name: data.name || '' });
        })
        .catch(setError)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // Cargar salas existentes para validar duplicados
    fetchResourceList('sala').then(setSalas);
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'name') setNameError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setNameError('');
    setError(null);
    setSuccess(false);
    // Validar nombre vacío
    if (!form.name.trim()) {
      setNameError('El nombre es obligatorio');
      return;
    }
    // Validar duplicado (excepto la sala actual)
    if (salas.some(s => s.teatroId === teatroId && s.name.trim().toLowerCase() === form.name.trim().toLowerCase() && s.id !== id)) {
      setNameError('Ya existe una sala con ese nombre en este teatro');
      return;
    }
    setSaving(true);
    try {
      if (id) {
        await updateResource('sala', id, { ...form, teatroId });
        setSuccess(true);
        if (onCancel) onCancel(); // Cierra el diálogo y refresca la lista
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
    <Box m={3} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>{id ? 'Editar Sala' : 'Crear Sala'}</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Guardado correctamente!</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!nameError}
            helperText={nameError}
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

export default SalaEditPage;
