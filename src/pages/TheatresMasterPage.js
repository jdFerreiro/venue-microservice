import React, { useEffect, useState } from 'react';
import { fetchResourceList } from '../services/api';
import { fetchClubs } from '../services/clubs';
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
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TheatreCreatePage from './TheatreCreatePage';
import TheatreEditPage from './TheatreEditPage';
import { deleteResource } from '../services/api';

function TheatresMasterPage() {
  const [theatres, setTheatres] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [error, setError] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
      await deleteResource('teatro', deleteId);
      setSnackbar({ open: true, message: 'Teatro eliminado correctamente', severity: 'success' });
      fetchList();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar teatro', severity: 'error' });
    } finally {
      setDeleteLoading(false);
      handleCloseDelete();
    }
  };

  const fetchList = () => {
    setLoading(true);
    fetchResourceList('teatro')
      .then(setTheatres)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
    setLoadingClubs(true);
    fetchClubs()
      .then(setClubs)
      .catch(() => setClubs([]))
      .finally(() => setLoadingClubs(false));
    // eslint-disable-next-line
  }, []);

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
        <Typography variant="h4">Teatros</Typography>
        <Tooltip title="Agregar" arrow>
          <IconButton color="primary" onClick={handleOpenCreate}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>ID</TableCell> */}
              <TableCell>Nombre</TableCell>
              <TableCell>Club</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {theatres.map(theatre => {
              const club = clubs.find(c => c.id === theatre.clubId);
              return (
                <TableRow key={theatre.id}>
                  {/* <TableCell>{theatre.id}</TableCell> */}
                  <TableCell>{theatre.name}</TableCell>
                  <TableCell>
                    {club ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        {club.logo ? (
                          <img
                            src={club.logo.startsWith('data:') ? club.logo : `data:image/*;base64,${club.logo}`}
                            alt={club.name}
                            style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }}
                          />
                        ) : (
                          <Box sx={{ width: 32, height: 32, bgcolor: '#eee', borderRadius: 4 }} />
                        )}
                        <span>{club.name}</span>
                      </Box>
                    ) : (
                      <em>Sin club</em>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" title="Editar" onClick={() => handleOpenEdit(theatre.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" title="Eliminar" onClick={() => handleOpenDelete(theatre.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Teatro</DialogTitle>
        <DialogContent>
          <TheatreCreatePage onCancel={handleCloseCreate} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Teatro</DialogTitle>
        <DialogContent>
          {/* Se pasa el id y onCancel como prop y se usa en TheatreEditPage */}
          <TheatreEditPageWrapper id={editId} onCancel={handleCloseEdit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Teatro</DialogTitle>
        <DialogContent>
          <TheatreCreatePage onCancel={handleCloseCreate} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Teatro</DialogTitle>
        <DialogContent>
          {/* Se pasa el id y onCancel como prop y se usa en TheatreEditPage */}
          <TheatreEditPageWrapper id={editId} onCancel={handleCloseEdit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={confirmDelete} onClose={handleCloseDelete}>
        <DialogTitle>¿Eliminar teatro?</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este teatro? Esta acción no se puede deshacer.</DialogContent>
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

// Wrapper para pasar id como prop en vez de usar useParams
function TheatreEditPageWrapper({ id, onCancel }) {
  return <TheatreEditPage id={id} onCancel={onCancel} />;
}

export default TheatresMasterPage;
