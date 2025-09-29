import React, { useState, useEffect } from 'react';
import { fetchResourceList, deleteResource } from '../services/api';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EstadoSectorCreatePage from './EstadoSectorCreatePage';
import EstadoSectorEditPage from './EstadoSectorEditPage';

function EstadosSectorMasterPage() {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchEstados = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchResourceList('estado-sector');
      if (data === null) {
        // 401: no mostrar nada ni error
        setEstados([]);
        setLoading(false);
        return;
      }
      setEstados(Array.isArray(data) ? data : []);
    } catch (err) {
      // Si es 404 (por status o mensaje), tratar como lista vacía y no mostrar error
      if ((err.status && err.status === 404) || (err.message && (err.message.includes('404') || err.message.includes('Not Found')))) {
        setEstados([]);
        setError(null);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstados();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteResource('estado-sector', deleteId);
      setSuccess('Estado eliminado correctamente');
      setDeleteId(null);
      fetchEstados();
    } catch (err) {
      setError(err);
    }
  };

  // Si el usuario no está autenticado (401), no renderizar nada
  if (estados.length === 0 && !loading && !error && sessionStorage.getItem('uToken') === null) {
    return null;
  }

  return (
    <Box m={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Estados de Sector</Typography>
          <Tooltip title="Agregar" arrow>
            <IconButton color="primary" onClick={() => setOpenCreate(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>ID</TableCell> */}
                <TableCell style={{ width: '100%' }}>Nombre</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Alert severity="error">Error: {error.message}</Alert>
                  </TableCell>
                </TableRow>
              ) : estados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">No hay estados de sector</TableCell>
                </TableRow>
              ) : (
                estados.map((estado) => (
                  <TableRow key={estado.id}>
                    {/* <TableCell>{estado.id}</TableCell> */}
                    <TableCell style={{ width: '100%' }}>{estado.name}</TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>
                      <IconButton color="primary" onClick={() => setEditId(estado.id)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => setDeleteId(estado.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={!!openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Estado de Sector</DialogTitle>
        <DialogContent>
          <EstadoSectorCreatePage onCancel={() => setOpenCreate(false)} onSuccess={() => { setOpenCreate(false); fetchEstados(); }} />
        </DialogContent>
      </Dialog>
      <Dialog open={!!editId} onClose={() => setEditId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Estado de Sector</DialogTitle>
        <DialogContent>
          <EstadoSectorEditPage id={editId} onCancel={() => setEditId(null)} onSuccess={() => { setEditId(null); fetchEstados(); }} />
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Eliminar estado?</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este estado?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EstadosSectorMasterPage;
