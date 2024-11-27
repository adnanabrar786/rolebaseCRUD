"use client";

import { useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  Container,
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { addUser, updateUser, User, users } from "@/constant/mockData";

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [disableEmailPass, setDisableEmailPass] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"edit" | "create">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User[]>(users);

  const [formValues, setFormValues] = useState<Omit<User, "id">>({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "user",
  });

  const handleOpenModal = (
    mode: "edit" | "create",
    user: User | null = null
  ) => {
    setModalMode(mode);
    setOpenModal(true);

    if (mode === "edit" && user) {
      setSelectedUser(user);
      setFormValues({
        username: user.username,
        password: "",
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } else {
      setFormValues({
        username: "",
        password: "",
        email: "",
        phone: "",
        role: "user",
      });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setDisableEmailPass(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSave = () => {
    if (modalMode === "edit" && selectedUser) {
      updateUser(selectedUser.id, formValues);
    } else {
      addUser(formValues);
    }
    setUserData([...users]); // Update state to reflect changes
    handleCloseModal();
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "role", headerName: "Role", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        const isAdminRow = params.row.email === currentUser?.email;
        return (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
              onClick={() => {
                setDisableEmailPass(true);
                handleOpenModal("edit", params.row as User);
              }}
              disabled={isAdminRow} // Disable edit button for admin's own row
            >
              Edit
            </Button>
          </>
        );
      },
    },
  ];

  if (!currentUser) {
    return <Typography>You must be logged in to access this page.</Typography>;
  }

  if (currentUser.role !== "admin") {
    return (
      <Typography>You do not have permission to view this page.</Typography>
    );
  }

  console.log(disableEmailPass);

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => handleOpenModal("create")}
      >
        Create New User
      </Button>
      <DataGrid
        rows={userData.filter((user) => user.email !== currentUser.email)} // Exclude admin's email from rows
        columns={columns}
        // autoHeight
        // components={{
        //   Toolbar: GridToolbar,
        // }}
      />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {modalMode === "edit" ? "Edit User" : "Create New User"}
          </Typography>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={formValues.username}
            onChange={handleFormChange}
          />
          {!disableEmailPass && (
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formValues.password}
              onChange={handleFormChange}
            />
          )}

          {!disableEmailPass && (
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={formValues.email}
              onChange={handleFormChange}
              disabled={selectedUser?.email === currentUser.email} // Disable email field for admin
            />
          )}

          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="normal"
            value={formValues.phone}
            onChange={handleFormChange}
          />
          <TextField
            label="Role"
            name="role"
            fullWidth
            margin="normal"
            value={formValues.role}
            onChange={handleFormChange}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminPage;
