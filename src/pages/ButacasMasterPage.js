import AddIcon from '@mui/icons-material/Add';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Tooltip,
  IconButton, 
  FormControl, 
  InputLabel, 
  Select,
  MenuItem,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert 
} from '@mui/material';
import { fetchResourceList, deleteResource, fetchSalasByTeatro, fetchSectoresBySala } from '../services/api';

async function fetchButacasBySector(sectorId) {
  // Usa el endpoint backend correcto
  const API_BASE_URL = process.env.REACT_APP_VENUE_API_BASE_URL;
  const response = await fetch(`${API_BASE_URL}/butaca/bySector/${encodeURIComponent(sectorId)}`, {
    headers: {
      ...((sessionStorage.getItem('uToken')) ? { Authorization: `Bearer ${sessionStorage.getItem('uToken')}` } : {})
    },
  });
  if (!response.ok) throw new Error('Error al obtener butacas del sector');
  return response.json();
}
import ButacaCreatePage from './ButacaCreatePage';
import ButacaEditPage from './ButacaEditPage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function ButacasMasterPage() {
  const [butacas, setButacas] = useState([]);
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
  const [sectores, setSectores] = useState([]);
  const [selectedTeatro, setSelectedTeatro] = useState('');
  const [selectedSala, setSelectedSala] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [estadosButaca, setEstadosButaca] = useState([]);

  // Cargar teatros y estados de butaca
  useEffect(() => {
    fetchResourceList('teatro').then(setTeatros);
    fetchResourceList('estado-butaca').then(setEstadosButaca);
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

  // Cargar sectores de la sala seleccionada usando función utilitaria
  useEffect(() => {
    if (selectedSala) {
      fetchSectoresBySala(selectedSala)
        .then(data => setSectores(Array.isArray(data) ? data : []))
        .catch(() => setSectores([]));
    } else {
      setSectores([]);
      setSelectedSector('');
    }
  }, [selectedSala]);

  // Cargar butacas filtradas por sector
  const fetchList = () => {
    if (!selectedSector) {
      setButacas([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchButacasBySector(selectedSector)
      .then(data => setButacas(Array.isArray(data) ? data : []))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedSector) {
      fetchList();
    } else {
      setButacas([]);
      setLoading(false);
    }
  }, [selectedSector]);

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
    setSelectedSector('');
    setButacas([]);
  };
  const handleSalaChange = (e) => {
    setSelectedSala(e.target.value);
    setSelectedSector('');
    setButacas([]);
  };
  const handleSectorChange = (e) => {
    setSelectedSector(e.target.value);
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
      await deleteResource('butaca', deleteId);
      setSnackbar({ open: true, message: 'Butaca eliminada correctamente', severity: 'success' });
      fetchList();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar butaca', severity: 'error' });
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
        <Typography variant="h4">Butacas</Typography>
        <Tooltip title="Agregar" arrow>
          <span>
            <IconButton color="primary" onClick={handleOpenCreate} disabled={!selectedSector}>
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
      <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedSala}>
        <InputLabel id="sector-select-label">Selecciona un sector</InputLabel>
        <Select
          labelId="sector-select-label"
          value={selectedSector}
          label="Selecciona un sector"
          onChange={handleSectorChange}
        >
          <MenuItem value=""><em>-- Selecciona --</em></MenuItem>
          {sectores.map(s => (
            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fila</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Alert severity="error">Error: {error.message}</Alert>
                </TableCell>
              </TableRow>
            ) : butacas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No hay butacas</TableCell>
              </TableRow>
            ) : (
              butacas.map(butaca => {
                const estado = estadosButaca.find(e => e.id === butaca.statusId);
                return (
                  <TableRow key={butaca.id}>
                    <TableCell>{butaca.row}</TableCell>
                    <TableCell>{butaca.number}</TableCell>
                    <TableCell>{estado ? estado.name : '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" title="Editar" onClick={() => handleOpenEdit(butaca.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" title="Eliminar" onClick={() => handleOpenDelete(butaca.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Butaca</DialogTitle>
        <DialogContent>
          <ButacaCreatePage onCancel={handleCloseCreate} sectorId={selectedSector} estadosButaca={estadosButaca} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Butaca</DialogTitle>
        <DialogContent>
          <ButacaEditPage id={editId} onCancel={handleCloseEdit} sectorId={selectedSector} estadosButaca={estadosButaca} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Butaca</DialogTitle>
        <DialogContent>
          <ButacaCreatePage onCancel={handleCloseCreate} sectorId={selectedSector} estadosButaca={estadosButaca} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Butaca</DialogTitle>
        <DialogContent>
          <ButacaEditPage id={editId} onCancel={handleCloseEdit} sectorId={selectedSector} estadosButaca={estadosButaca} />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={confirmDelete} onClose={handleCloseDelete}>
        <DialogTitle>¿Eliminar butaca?</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar esta butaca? Esta acción no se puede deshacer.</DialogContent>
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

export default ButacasMasterPage;
