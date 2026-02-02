import api from "./axios";

export const taskApi = {
  getTasks: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status !== undefined && params.status !== "") {
      queryParams.append("status", params.status);
    }
    if (params.sort) {
      queryParams.append("sort", params.sort);
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/tasks?${queryString}` : "/tasks";
    const response = await api.get(url);
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  toggleTask: async (id, currentStatus) => {
    const response = await api.put(`/tasks/${id}`, { status: !currentStatus });
    return response.data;
  },
};

export const userApi = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },
};
