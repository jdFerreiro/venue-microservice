import React, { useEffect, useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function ButacaEditPage({ id, onCancel, sectorId, estadosButaca = [] }) {
  const [butaca, setButaca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', estadoButacaId: '' });
  const [success, setSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResourceDetail('butaca', id)
        .then(data => {
          setButaca(data);
          setForm({ name: data.name || '', estadoButacaId: data.estadoButacaId || '' });
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
        await updateResource('butaca', id, { ...form, sectorId });
        setSuccess(true);
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
        <Typography variant="h5" mb={2}>{id ? 'Editar Butaca' : 'Crear Butaca'}</Typography>
        <Typography variant="subtitle2" mb={2}>Sector ID: {sectorId}</Typography>
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="estado-butaca-label">Estado</InputLabel>
            <Select
              labelId="estado-butaca-label"
              name="estadoButacaId"
              value={form.estadoButacaId}
              label="Estado"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Seleccione un estado</em></MenuItem>
              {estadosButaca.map(e => (
                <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
              ))}
            </Select>
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

export default ButacaEditPage;
