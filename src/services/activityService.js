const API_URL = import.meta.env.VITE_API_URL;

export const activityService = {
  // Obtener todas las actividades
  getActivities: async () => {
    try {
      const response = await fetch(`${API_URL}/activities`);
      if (!response.ok) throw new Error('Error al obtener actividades');
      return await response.json();
    } catch (error) {
      console.error('Error en getActivities:', error);
      throw error;
    }
  },

  // Obtener actividades por fecha
  getActivitiesByDate: async (date) => {
    try {
      const response = await fetch(`${API_URL}/activities/by-date?date=${date}`);
      if (!response.ok) throw new Error('Error al obtener actividades por fecha');
      return await response.json();
    } catch (error) {
      console.error('Error en getActivitiesByDate:', error);
      throw error;
    }
  },

  // Crear una nueva actividad
  createActivity: async (activity) => {
    try {
      const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      });
      if (!response.ok) throw new Error('Error al crear actividad');
      return await response.json();
    } catch (error) {
      console.error('Error en createActivity:', error);
      throw error;
    }
  },

  // Actualizar una actividad
  updateActivity: async (id, activity) => {
    try {
      const response = await fetch(`${API_URL}/activities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      });
      if (!response.ok) throw new Error('Error al actualizar actividad');
      return await response.json();
    } catch (error) {
      console.error('Error en updateActivity:', error);
      throw error;
    }
  },

  // Eliminar una actividad
  deleteActivity: async (id) => {
    try {
      const response = await fetch(`${API_URL}/activities/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar actividad');
      return await response.json();
    } catch (error) {
      console.error('Error en deleteActivity:', error);
      throw error;
    }
  },
};
