
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar, Alert } from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import apiClient from '../api';
import '../styles/ReelsPage.css';

const ReelsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCountState, setRowCountState] = useState(0);
  const [open, setOpen] = useState(false);
  const [reelToDelete, setReelToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchReels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/admin/get/reels?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`
      );
      
      const fetchedReels = response.data.reels || [];
      const totalReels = response.data.totalReels || 0;

      const processedRows = fetchedReels.map(reel => {
        if (!reel || !reel._id) return null;

        return {
          id: reel._id,
          thumbnail: reel.thumbnail,
          title: reel.title || 'N/A',
          user: reel.user?.fullName || 'N/A',
          skills: reel.skillId?.map(skill => skill.skillName).join(', ') || 'N/A',
          subSkills: reel.subSkillsId?.map(subSkill => subSkill.subSkillName).join(', ') || 'N/A',
          created_at: reel.created_at ? new Date(reel.created_at).toLocaleDateString() : 'N/A',
        };
      }).filter(Boolean);

      setRows(processedRows);
      setRowCountState(totalReels);

    } catch (error) {
      console.error("Failed to fetch reels:", error);
      setRows([]);
      setRowCountState(0);
      setSnackbar({ open: true, message: 'Failed to fetch reels.', severity: 'error' });
    }
    setLoading(false);
  }, [paginationModel]);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  const handleClickOpen = (id) => {
    setReelToDelete(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setReelToDelete(null);
  };

  const handleDelete = async () => {
    if (!reelToDelete) return;
    try {
      const response = await apiClient.delete(`/admin/delete/reel/${reelToDelete}`);
      setSnackbar({ open: true, message: response.data.message || 'Reel deleted successfully!', severity: 'success' });
      fetchReels(); // Refresh data after deletion
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to delete reel.', severity: 'error' });
    } finally {
      handleClose();
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    {
      field: 'thumbnail',
      headerName: 'Thumbnail',
      width: 120,
      renderCell: (params) => (
        <img 
          src={params.value || 'https://via.placeholder.com/80x80'} 
          alt={params.row.title} 
          className="reel-thumbnail-datagrid" 
        />
      ),
      sortable: false,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'skills',
      headerName: 'Skills',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'subSkills',
      headerName: 'Sub-Skills',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleClickOpen(params.id)} color="secondary">
          <FaTrash />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="reels-page">
      <div className="reels-header">
        <h1>Reels</h1>
        <Link to="/dashboard/reels/add" className="add-reel-btn">
          Add Reel
        </Link>
      </div>
      <div className="data-grid-container">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={rowCountState}
          pageSizeOptions={[10, 20, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          autoHeight
        />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reel? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReelsPage;
