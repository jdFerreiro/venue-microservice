import React, { useEffect, useState } from 'react';
import { fetchResourceList, deleteResource } from '../services/api';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import SalaCreatePage from './SalaCreatePage';
import SalaEditPage from './SalaEditPage';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



function SalasMasterPage() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState('');

  // Cargar teatros
  useEffect(() => {
    fetchResourceList('teatro').then(setTheatres);
  }, []);

  // Cargar salas filtradas por teatro
  const fetchList = () => {
    if (!selectedTheatre) {
      setSalas([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchResourceList('sala')
      .then(data => setSalas(data.filter(s => s.teatroId === selectedTheatre)))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedTheatre) fetchList();
    // eslint-disable-next-line
  }, [selectedTheatre]);

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => {
    setOpenCreate(false);
    fetchList();
  };
  const handleOpenEdit = (id) => {
    setEditId(id);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditId(null);
    fetchList();
  };
  const handleTheatreChange = (e) => {
    setSelectedTheatre(e.target.value);
  };
  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };
  const handleCloseDelete = () => {
    setConfirmDelete(false);
    setDeleteId(null);
  };
  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteResource('sala', deleteId);
      setSnackbar({ open: true, message: 'Sala eliminada correctamente', severity: 'success' });
      fetchList();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar sala', severity: 'error' });
    } finally {
      setDeleteLoading(false);
      handleCloseDelete();
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <CircularProgress />
    </Box>
  );
  if (error) return (
    <Box m={2}><Alert severity="error">Error: {error.message}</Alert></Box>
  );

  return (
    <Box m={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Salas</Typography>
        <Tooltip title="Agregar" arrow>
          <span>
            <IconButton color="primary" onClick={handleOpenCreate} disabled={!selectedTheatre}>
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="theatre-select-label">Selecciona un teatro</InputLabel>
        <Select
          labelId="theatre-select-label"
          value={selectedTheatre}
          label="Selecciona un teatro"
          onChange={handleTheatreChange}
        >
          <MenuItem value=""><em>-- Selecciona --</em></MenuItem>
          {theatres.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>ID</TableCell> */}
              <TableCell>Nombre</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salas.map(sala => (
              <TableRow key={sala.id}>
                {/* <TableCell>{sala.id}</TableCell> */}
                <TableCell>{sala.name}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" title="Editar" onClick={() => handleOpenEdit(sala.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" title="Eliminar" onClick={() => handleOpenDelete(sala.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Sala</DialogTitle>
        <DialogContent>
          <SalaCreatePage onCancel={handleCloseCreate} teatroId={selectedTheatre} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Sala</DialogTitle>
        <DialogContent>
          <SalaEditPage id={editId} onCancel={handleCloseEdit} teatroId={selectedTheatre} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Sala</DialogTitle>
        <DialogContent>
          <SalaCreatePage onCancel={handleCloseCreate} teatroId={selectedTheatre} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Sala</DialogTitle>
        <DialogContent>
          <SalaEditPage id={editId} onCancel={handleCloseEdit} teatroId={selectedTheatre} />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={confirmDelete} onClose={handleCloseDelete}>
        <DialogTitle>¿Eliminar sala?</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar esta sala? Esta acción no se puede deshacer.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary" disabled={deleteLoading}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={deleteLoading}>
            {deleteLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

export default SalasMasterPage;
