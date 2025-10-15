import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import apiClient from '../api';
import '../styles/SkillsPage.css';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [skillsPaginationModel, setSkillsPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [skillsRowCount, setSkillsRowCount] = useState(0);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, type: null, id: null });
  const [currentSkill, setCurrentSkill] = useState(null);

  const fetchSkillsForGrid = useCallback(async () => {
    setLoadingSkills(true);
    try {
      const response = await apiClient.get(`/admin/get/skills?page=${skillsPaginationModel.page + 1}&limit=${skillsPaginationModel.pageSize}`);
      setSkills((response.data.skills || []).map(s => ({ ...s, id: s._id })));
      setSkillsRowCount(response.data.totalSkills || 0);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setSkills([]);
    }
    setLoadingSkills(false);
  }, [skillsPaginationModel]);

  useEffect(() => { fetchSkillsForGrid(); }, [fetchSkillsForGrid]);

  const handleAddSkill = () => { setCurrentSkill(null); setSkillModalOpen(true); };
  const handleEditSkill = (skill) => { setCurrentSkill(skill); setSkillModalOpen(true); };
  const handleDeleteSkill = (id) => { setDeleteConfirmation({ open: true, type: 'skill', id }); };

  const handleSaveSkill = async () => {
    const url = currentSkill?.id ? `/skill/update/${currentSkill.id}` : '/skill/add';
    const method = currentSkill?.id ? 'put' : 'post';
    try {
      await apiClient[method](url, { skillName: currentSkill.skillName, color: currentSkill.color });
      fetchSkillsForGrid();
      setSkillModalOpen(false);
    } catch (error) { console.error('Failed to save skill', error); }
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirmation;
    let url = `/skill/delete/${id}`;

    try {
      await apiClient.delete(url);
      fetchSkillsForGrid();
      setDeleteConfirmation({ open: false, type: null, id: null });
    } catch (error) { console.error(`Failed to delete ${type}`, error); }
  };

  const skillsColumns = [
    { field: 'skillName', headerName: 'Skill Name', flex: 1 },
    { field: 'color', headerName: 'Color', flex: 1 },
    {
      field: 'actions', headerName: 'Actions', flex: 1, sortable: false,
      renderCell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center' }} >
          <IconButton onClick={() => handleEditSkill(row)}><FaEdit /></IconButton>
          <IconButton onClick={() => handleDeleteSkill(row.id)}><FaTrash /></IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="skills-page">
      <div className="page-header">
        <h1>Skills Management</h1>
        <Button variant="contained" color="primary" size="small" startIcon={<FaPlus />} onClick={handleAddSkill}>
          Add Skill
        </Button>
      </div>

      <div className="skills-container">
        <div className="skills-header">
          <h2>Skills</h2>
        </div>
        <div style={{ height: 600, width: '100%' }}><DataGrid rows={skills} columns={skillsColumns} loading={loadingSkills} rowCount={skillsRowCount} pageSizeOptions={[10, 20, 50]} paginationModel={skillsPaginationModel} onPaginationModelChange={setSkillsPaginationModel} paginationMode="server" /></div>
      </div>

      <Dialog open={skillModalOpen} onClose={() => setSkillModalOpen(false)}>
        <DialogTitle>{currentSkill?.id ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Skill Name" type="text" fullWidth value={currentSkill?.skillName || ''} onChange={(e) => setCurrentSkill({ ...currentSkill, skillName: e.target.value })} />
          <div className="color-picker-container">
            <TextField margin="dense" label="Color" type="text" fullWidth value={currentSkill?.color || ''} onChange={(e) => setCurrentSkill({ ...currentSkill, color: e.target.value })} />
            <input type="color" value={currentSkill?.color || '#ffffff'} onChange={(e) => setCurrentSkill({ ...currentSkill, color: e.target.value })} />
          </div>
        </DialogContent>
        <DialogActions><Button onClick={() => setSkillModalOpen(false)}>Cancel</Button><Button onClick={handleSaveSkill}>Save</Button></DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmation.open} onClose={() => setDeleteConfirmation({ open: false, type: null, id: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this {deleteConfirmation.type}?</DialogContent>
        <DialogActions><Button onClick={() => setDeleteConfirmation({ open: false, type: null, id: null })}>Cancel</Button><Button onClick={confirmDelete} color="error">Delete</Button></DialogActions>
      </Dialog>
    </div>
  );
};

export default SkillsPage;
