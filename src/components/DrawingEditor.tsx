/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  useParams,
  Link as RouterLink,
  //  useNavigate
} from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { getDrawingById, updateDrawing } from "../api/api";
import { Tldraw } from "@tldraw/tldraw";
import "tldraw/tldraw.css";

// Define the type for Snackbar state
interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const DrawingEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [appInstance, setAppInstance] = useState<any | null>(null);
  const [drawing, setDrawing] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const editorRef = useRef<any | null>(null);

  useEffect(() => {
    const fetchDrawing = async () => {
      if (!id) {
        setSnackbar({
          open: true,
          message: "Invalid drawing ID.",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      try {
        const data = await getDrawingById(id);
        setDrawing(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching drawing:", err);
        setSnackbar({
          open: true,
          message: "Failed to fetch drawing.",
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchDrawing();
  }, [id]);

  // Handle saving the drawing
  const handleSave = async () => {
    if (!editorRef.current || !id) return;
    setSaving(true);
    try {
      const serialized = JSON.stringify(
        appInstance?.store?.getStoreSnapshot()?.store
      );

      const payload = {
        elements: { serialized },
        title: drawing.title,
        backgroundColor: drawing.backgroundColor,
      };
      await updateDrawing(id, payload);
      setSnackbar({
        open: true,
        message: "Drawing saved successfully!",
        severity: "success",
      });
      setSaving(false);
    } catch (err) {
      console.error("Error saving drawing:", err);
      setSnackbar({
        open: true,
        message: "Failed to save drawing.",
        severity: "error",
      });
      setSaving(false);
    }
  };

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

  const handleMount = useCallback(
    (app: any) => {
      if (!appInstance) {
        setAppInstance(app);
      }
    },
    [appInstance]
  );

  const memoizedInitialData = useMemo(() => {
    return drawing?.elements?.serialized
      ? JSON.parse(drawing.elements.serialized)
      : undefined;
  }, [drawing?.elements?.serialized]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!drawing) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Drawing not found.</Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/"
          sx={{ mt: 2 }}
        >
          Back to Drawings
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, height: "80vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">{drawing.title}</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
            sx={{ mr: 2 }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            component={RouterLink}
            to="/"
          >
            Back to Drawings
          </Button>
        </Box>
      </Box>
      <Box
        sx={{ border: "1px solid #ccc", borderRadius: "4px", height: "100%" }}
        ref={(app: any) => {
          editorRef.current = app;
        }}
      >
        <Tldraw onMount={handleMount} initialData={memoizedInitialData} />
      </Box>

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

export default DrawingEditor;
