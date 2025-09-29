import SectorCreatePage from './SectorCreatePage';
import SectorEditPage from './SectorEditPage';
import React, { useEffect, useState } from 'react';
import { fetchResourceList, deleteResource, fetchSalasByTeatro, fetchSectoresBySala } from '../services/api';
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function SectoresMasterPage() {
  const [sectores, setSectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [teatros, setTeatros] = useState([]);
  const [salas, setSalas] = useState([]);
  const [selectedTeatro, setSelectedTeatro] = useState('');
  const [selectedSala, setSelectedSala] = useState('');

  // Cargar teatros
  useEffect(() => {
    fetchResourceList('teatro').then(setTeatros);
  }, []);

  // Cargar salas del teatro seleccionado usando función utilitaria
  useEffect(() => {
    if (selectedTeatro) {
      fetchSalasByTeatro(selectedTeatro)
        .then(data => setSalas(Array.isArray(data) ? data : []))
        .catch(() => setSalas([]));
    } else {
      setSalas([]);
      setSelectedSala('');
    }
  }, [selectedTeatro]);

  // Cargar sectores de la sala seleccionada usando el endpoint correcto
  const fetchList = () => {
    if (!selectedSala) {
      setSectores([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchSectoresBySala(selectedSala)
      .then(data => {
        setSectores(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(err => {
        setSectores([]);
        setError(err);
      })
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
  const handleTeatroChange = (e) => {
    setSelectedTeatro(e.target.value);
    setSelectedSala('');
    setSectores([]);
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
      await deleteResource('sector', deleteId);
      setSnackbar({ open: true, message: 'Sector eliminado correctamente', severity: 'success' });
      fetchList();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar sector', severity: 'error' });
    } finally {
      setDeleteLoading(false);
      handleCloseDelete();
    }
  };



  // Mostrar error solo si realmente ocurre
  // Mostrar tabla vacía si no hay datos

  // Siempre renderiza la página, muestra spinner solo en la tabla
  return (
    <Box m={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Sectores</Typography>
        <Tooltip title="Agregar" arrow>
          <span>
            <IconButton color="primary" onClick={handleOpenCreate} disabled={!selectedSala}>
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="teatro-select-label">Selecciona un teatro</InputLabel>
        <Select
          labelId="teatro-select-label"
          value={selectedTeatro}
          label="Selecciona un teatro"
          onChange={handleTeatroChange}
        >
          <MenuItem value=""><em>-- Selecciona --</em></MenuItem>
          {teatros.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedTeatro}>
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
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Alert severity="error">Error: {error.message}</Alert>
                </TableCell>
              </TableRow>
            ) : sectores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center">No hay sectores</TableCell>
              </TableRow>
            ) : (
              sectores.map(sector => (
                <TableRow key={sector.id}>
                  {/* <TableCell>{sector.id}</TableCell> */}
                  <TableCell>{sector.name}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" title="Editar" onClick={() => handleOpenEdit(sector.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" title="Eliminar" onClick={() => handleOpenDelete(sector.id)}>
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
        <DialogTitle>Crear Sector</DialogTitle>
        <DialogContent>
          <SectorCreatePage onCancel={handleCloseCreate} salaId={selectedSala} salaNombre={salas.find(s => s.id === selectedSala)?.name || ''} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Sector</DialogTitle>
        <DialogContent>
          <SectorEditPage id={editId} onCancel={handleCloseEdit} salaId={selectedSala} salaNombre={salas.find(s => s.id === selectedSala)?.name || ''} />
        </DialogContent>
      </Dialog>



      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={confirmDelete} onClose={handleCloseDelete}>
        <DialogTitle>¿Eliminar sector?</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este sector? Esta acción no se puede deshacer.</DialogContent>
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

export default SectoresMasterPage;
