import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import apiClient from '../api';
import '../styles/UsersPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null });
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/admin/get/users?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      setUsers((response.data.users || []).map(u => ({ ...u, id: u._id })));
      setRowCount(response.data.totalUsers || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
    setLoading(false);
  }, [paginationModel]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAddUser = () => { setCurrentUser(null); setModalOpen(true); };
  const handleEditUser = (user) => { setCurrentUser(user); setModalOpen(true); };
  const handleDeleteUser = (id) => { setDeleteConfirmation({ open: true, id }); };

  const handleSaveUser = async () => {
    const url = currentUser?.id ? `/admin/update/user/${currentUser.id}` : '/admin/add/user';
    const method = currentUser?.id ? 'put' : 'post';
    const payload = { ...currentUser, id: undefined };
    try {
      await apiClient[method](url, payload);
      fetchUsers();
      setModalOpen(false);
    } catch (error) { console.error('Failed to save user', error); }
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/admin/delete/user/${deleteConfirmation.id}`);
      fetchUsers();
      setDeleteConfirmation({ open: false, id: null });
    } catch (error) { console.error('Failed to delete user', error); }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions', headerName: 'Actions', flex: 1, sortable: false,
      renderCell: ({ row }) => (
        <div>
          <IconButton onClick={() => handleEditUser(row)}><FaEdit /></IconButton>
          <IconButton onClick={() => handleDeleteUser(row.id)}><FaTrash /></IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users Management</h1>
        <Button variant="contained" color="primary" size="small" startIcon={<FaPlus />} onClick={handleAddUser}>
          Add User
        </Button>
      </div>

      <div style={{ height: 600, width: '100%' }}><DataGrid rows={users} columns={columns} loading={loading} rowCount={rowCount} pageSizeOptions={[10, 20, 50]} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} paginationMode="server" /></div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{currentUser?.id ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" type="text" fullWidth value={currentUser?.name || ''} onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })} />
          <TextField margin="dense" label="Email" type="email" fullWidth value={currentUser?.email || ''} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />
          {!currentUser?.id && <TextField margin="dense" label="Password" type="password" fullWidth onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })} />}
        </DialogContent>
        <DialogActions><Button onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSaveUser}>Save</Button></DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmation.open} onClose={() => setDeleteConfirmation({ open: false, id: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions><Button onClick={() => setDeleteConfirmation({ open: false, id: null })}>Cancel</Button><Button onClick={confirmDelete} color="error">Delete</Button></DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersPage;
