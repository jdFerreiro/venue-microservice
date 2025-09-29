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
import EstadoButacaCreatePage from './EstadoButacaCreatePage';
import EstadoButacaEditPage from './EstadoButacaEditPage';

function EstadosButacaMasterPage() {
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
      const data = await fetchResourceList('estado-butaca');
      setEstados(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstados();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteResource('estado-butaca', deleteId);
      setSuccess('Estado eliminado correctamente');
      setDeleteId(null);
      fetchEstados();
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Box m={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Estados de Butaca</Typography>
          <Tooltip title="Agregar" arrow>
            <IconButton color="primary" onClick={() => setOpenCreate(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>}
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
                  <TableCell colSpan={2} align="center">No hay estados de butaca</TableCell>
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
        <DialogTitle>Nuevo Estado de Butaca</DialogTitle>
        <DialogContent>
          <EstadoButacaCreatePage onCancel={() => setOpenCreate(false)} onSuccess={() => { setOpenCreate(false); fetchEstados(); }} />
        </DialogContent>
      </Dialog>
      <Dialog open={!!editId} onClose={() => setEditId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Estado de Butaca</DialogTitle>
        <DialogContent>
          <EstadoButacaEditPage id={editId} onCancel={() => setEditId(null)} onSuccess={() => { setEditId(null); fetchEstados(); }} />
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

export default EstadosButacaMasterPage;
