import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
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
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/admin/users?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      setUsers((response.data.users || []).map(u => ({ ...u, id: u._id })));
      setRowCount(response.data.pagination.totalUsers || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
    setLoading(false);
  }, [paginationModel]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAddUser = () => navigate('/dashboard/users/add');
  const handleEditUser = (user) => { setCurrentUser({ ...user, password: '' }); setModalOpen(true); };
  const handleDeleteUser = (id) => { setDeleteConfirmation({ open: true, id }); };

  const handleSaveUser = async () => {
    if (!currentUser?.id) return;
    const payload = { ...currentUser };
    if (!payload.password) {
      delete payload.password;
    }
    try {
      await apiClient.put(`/admin/users/${currentUser.id}`, payload);
      fetchUsers();
      setModalOpen(false);
    } catch (error) { console.error('Failed to save user', error); }
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/admin/users/${deleteConfirmation.id}`);
      fetchUsers();
      setDeleteConfirmation({ open: false, id: null });
    } catch (error) { console.error('Failed to delete user', error); }
  };

  const columns = [
    {
        field: 'profile_img',
        headerName: 'Avatar',
        renderCell: (params) => <Avatar src={params.value} />,
        sortable: false,
        width: 80,
      },
    { field: 'fullName', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
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
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" type="text" fullWidth value={currentUser?.fullName || ''} onChange={(e) => setCurrentUser({ ...currentUser, fullName: e.target.value })} />
          <TextField margin="dense" label="Email" type="email" fullWidth value={currentUser?.email || ''} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />
          <TextField margin="dense" label="Phone" type="text" fullWidth value={currentUser?.phone || ''} onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })} />
          <TextField margin="dense" label="Password" type="password" fullWidth value={currentUser?.password || ''} onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })} placeholder="Leave blank to keep current password" />
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
