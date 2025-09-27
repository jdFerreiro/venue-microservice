
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
  ListItemText
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';


function TheatreCreatePage({ onCancel }) {
  const [form, setForm] = useState({ name: '', clubId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await createTeatro(form);
      setSuccess(true);
      setForm({ name: '', clubId: '' });
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
            required
          />
          <FormControl fullWidth margin="normal" required>
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
