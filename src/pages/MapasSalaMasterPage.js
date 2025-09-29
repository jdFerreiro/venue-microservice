import React, { useEffect, useState } from 'react';
import { fetchResourceList, deleteResource } from '../services/api';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, FormControl, InputLabel, Select, MenuItem, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MapaSalaCreatePage from './MapaSalaCreatePage';
import MapaSalaEditPage from './MapaSalaEditPage';

function MapasSalaMasterPage() {
  const [mapas, setMapas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [salas, setSalas] = useState([]);
  const [selectedSala, setSelectedSala] = useState('');

  useEffect(() => {
    fetchResourceList('sala').then(setSalas);
  }, []);

  const fetchList = () => {
    if (!selectedSala) {
      setMapas([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchResourceList('mapasala')
      .then(data => setMapas(data.filter(m => m.salaId === selectedSala)))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedSala) fetchList();
  }, [selectedSala]);

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
  const handleSalaChange = (e) => {
    setSelectedSala(e.target.value);
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
      await deleteResource('mapasala', deleteId);
      setSnackbar({ open: true, message: 'Mapa eliminado correctamente', severity: 'success' });
      fetchList();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar mapa', severity: 'error' });
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

  // Mostrar error solo si realmente ocurre
  // Mostrar tabla vacía si no hay datos

  return (
    <Box m={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Mapas de Sala</Typography>
        <Tooltip title="Agregar" arrow>
          <span>
            <IconButton color="primary" onClick={handleOpenCreate} disabled={!selectedSala}>
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="sala-select-label">Selecciona una sala</InputLabel>
        <Select
          labelId="sala-select-label"
          value={selectedSala}
          label="Selecciona una sala"
          onChange={handleSalaChange}
        >
          <MenuItem value=""><em>-- Selecciona --</em></MenuItem>
          {salas.map(s => (
            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>ID</TableCell> */}
              <TableCell>Nombre</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Alert severity="error">Error: {error.message}</Alert>
                </TableCell>
              </TableRow>
            ) : mapas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">No hay mapas de sala</TableCell>
              </TableRow>
            ) : (
              mapas.map(mapa => (
                <TableRow key={mapa.id}>
                  {/* <TableCell>{mapa.id}</TableCell> */}
                  <TableCell>{mapa.nombre}</TableCell>
                  <TableCell>
                    {mapa.imagenBase64
                      ? <img src={`data:image/*;base64,${mapa.imagenBase64}`} alt="Mapa" style={{ maxWidth: 120, maxHeight: 80 }} />
                      : (mapa.imagenUrl
                          ? <img src={mapa.imagenUrl} alt="Mapa" style={{ maxWidth: 120, maxHeight: 80 }} />
                          : '-')}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" title="Editar" onClick={() => handleOpenEdit(mapa.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" title="Eliminar" onClick={() => handleOpenDelete(mapa.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Mapa</DialogTitle>
        <DialogContent>
          <MapaSalaCreatePage onCancel={handleCloseCreate} salaId={selectedSala} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Mapa</DialogTitle>
        <DialogContent>
          <MapaSalaEditPage id={editId} onCancel={handleCloseEdit} salaId={selectedSala} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Mapa</DialogTitle>
        <DialogContent>
          <MapaSalaCreatePage onCancel={handleCloseCreate} salaId={selectedSala} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Mapa</DialogTitle>
        <DialogContent>
          <MapaSalaEditPage id={editId} onCancel={handleCloseEdit} salaId={selectedSala} />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={confirmDelete} onClose={handleCloseDelete}>
        <DialogTitle>¿Eliminar mapa?</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este mapa? Esta acción no se puede deshacer.</DialogContent>
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

export default MapasSalaMasterPage;
