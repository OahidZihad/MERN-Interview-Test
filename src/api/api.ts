import axios, { AxiosError, AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleError = (error: AxiosError | unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(
        `API Error: ${error.response.status} ${error.response.statusText}`
      );
    } else if (error.request) {
      throw new Error("API Error: No response received from the server");
    } else {
      throw new Error(`API Error: ${error.message}`);
    }
  } else {
    throw new Error("An unexpected error occurred");
  }
};

// Create drawing
export const createDrawing = async (body: unknown): Promise<unknown> => {
  try {
    const response: AxiosResponse<unknown> = await apiClient.post(
      "/drawing",
      body
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get all drawings
export const getDrawings = async () => {
  try {
    const response: AxiosResponse = await apiClient.get("/drawings");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get a specific drawing by ID
export const getDrawingById = async (id: string) => {
  try {
    const response: AxiosResponse = await apiClient.get(`/drawing/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update a drawing
export const updateDrawing = async (id: string, data: Partial<unknown>) => {
  try {
    const response: AxiosResponse = await apiClient.put(`/drawing/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete a drawing
export const deleteDrawing = async (id: string) => {
  try {
    const response: AxiosResponse<{ message: string }> = await apiClient.delete(
      `/drawing/${id}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
