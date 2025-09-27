

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
  const [sectores, setSectores] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [estadosButaca, setEstadosButaca] = useState([]);

  // Cargar sectores y estados de butaca
  useEffect(() => {
    fetchResourceList('sector').then(setSectores);
    fetchResourceList('estado-butaca').then(setEstadosButaca);
  }, []);

  // Cargar butacas filtradas por sector
  const fetchList = () => {
    if (!selectedSector) {
      setButacas([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchResourceList('butaca')
      .then(data => setButacas(data.filter(b => b.sectorId === selectedSector)))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedSector) fetchList();
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
  if (error) return (
    <Box m={2}><Alert severity="error">Error: {error.message}</Alert></Box>
  );

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
              {/* <TableCell>ID</TableCell> */}
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Descripción de Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {butacas.map(butaca => {
              const estado = estadosButaca.find(e => e.id === butaca.estadoButacaId);
              return (
                <TableRow key={butaca.id}>
                  {/* <TableCell>{butaca.id}</TableCell> */}
                  <TableCell>{butaca.name}</TableCell>
                  <TableCell>{estado ? estado.nombre : '-'}</TableCell>
                  <TableCell>{estado ? estado.descripcion : '-'}</TableCell>
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
            })}
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
