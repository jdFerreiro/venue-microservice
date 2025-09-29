import React, { useState } from 'react';
import { createButaca } from '../services/api';
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
  MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function ButacaCreatePage({ onCancel, sectorId, estadosButaca = [] }) {
  // DTO: sectorId, row, number, statusId
  const [form, setForm] = useState({ row: '', number: '', statusId: '' });
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
      await createButaca({
        sectorId: String(sectorId),
        row: form.row,
        number: form.number,
        statusId: Number(form.statusId)
      });
      setSuccess(true);
      setForm({ row: '', number: '', statusId: '' });
      if (onCancel) onCancel(); // Cierra el diálogo al guardar correctamente
    } catch (err) {
      let msg = err && err.message ? err.message : 'Error al crear butaca';
      if (msg.toLowerCase().includes('ya existe')) {
        msg = 'Ya existe una butaca con esa fila y número en este sector.';
      }
      setError({ message: msg });
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
        <Typography variant="h5" mb={2}>Crear Butaca</Typography>
        <Typography variant="subtitle2" mb={2}>Sector ID: {sectorId}</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Butaca creada correctamente!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Fila"
            name="row"
            value={form.row}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            label="Número"
            name="number"
            value={form.number}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ maxLength: 10 }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="estado-butaca-label">Estado</InputLabel>
            <Select
              labelId="estado-butaca-label"
              name="statusId"
              value={form.statusId}
              label="Estado"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Seleccione un estado</em></MenuItem>
              {estadosButaca.map(e => (
                <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
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

export default ButacaCreatePage;
