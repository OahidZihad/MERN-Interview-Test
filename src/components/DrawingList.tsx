/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { getDrawings, createDrawing, deleteDrawing } from "../api/api";

// Define the type for Snackbar state
interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const DrawingList: React.FC = () => {
  const [drawings, setDrawings] = useState<unknown[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch drawings from the API
  const fetchDrawings = async () => {
    try {
      const data = await getDrawings();
      setDrawings(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching drawings:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch drawings.",
        severity: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrawings();
  }, []);

  // Handle adding a new drawing
  const handleAdd = async () => {
    if (title.trim() === "") return;
    try {
      const payload = {
        elements: { serialized: {} },
        title: title,
        backgroundColor: "#F0F0F0",
      };
      const newDrawing = await createDrawing(payload);
      setDrawings((prevDrawings) => [...prevDrawings, newDrawing]);
      setTitle("");
      setSnackbar({
        open: true,
        message: "Drawing created successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error creating drawing:", err);
      setSnackbar({
        open: true,
        message: "Failed to create drawing.",
        severity: "error",
      });
    }
  };

  // Handle deleting a drawing
  const handleDelete = async (id: string) => {
    try {
      await deleteDrawing(id);
      setDrawings((prevDrawings) =>
        prevDrawings.filter((drawing: any) => drawing._id !== id)
      );
      setSnackbar({
        open: true,
        message: "Drawing deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error deleting drawing:", err);
      setSnackbar({
        open: true,
        message: "Failed to delete drawing.",
        severity: "error",
      });
    }
  };

  // Handle closing the Snackbar
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    console.log("🚀 ~ event:", event);
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create Your Drawings
      </Typography>

      <Box display="flex" alignItems="center" mb={3}>
        <TextField
          size="small"
          label="New Drawing Title"
          variant="outlined"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ ml: 2, textTransform: "none" }}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {drawings?.length > 0 ? (
            <List>
              {drawings.map((drawing: any) => (
                <ListItem
                  key={drawing._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(drawing._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <RouterLink
                        to={`/drawing/${drawing._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {drawing.title}
                      </RouterLink>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box
              height="60vh"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6">Create your drawing first...</Typography>
            </Box>
          )}
        </>
      )}

      {/* Snackbar for Success and Error Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DrawingList;
