import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CalendarView from './components/CalendarView';
import ActivityForm from './components/ActivityForm';
import ActivityModal from './components/ActivityModal';
import { activityService } from './services/activityService';

function App() {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar actividades al montar el componente
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await activityService.getActivities();
        setActivities(data || []);
      } catch (err) {
        console.error('Error al cargar actividades:', err);
        setError('No se pudieron cargar las actividades. Verifica que el servidor está ejecutándose en http://localhost:5000');
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const handleAddActivity = async (formData) => {
    try {
      setError(null);
      const newActivity = await activityService.createActivity({
        activityDate: formData.date,
        description: formData.description,
      });
      setActivities([...activities, newActivity]);
      setShowForm(false);
    } catch (err) {
      console.error('Error al guardar actividad:', err);
      setError('No se pudo guardar la actividad. Verifica que el servidor está disponible.');
    }
  };

  const handleSaveActivity = async (id, formData) => {
    try {
      setError(null);
      const updatedActivity = await activityService.updateActivity(id, {
        activityDate: formData.date,
        description: formData.description,
      });
      setActivities(
        activities.map(activity =>
          activity.id === id ? updatedActivity : activity
        )
      );
      setShowModal(false);
    } catch (err) {
      console.error('Error al actualizar actividad:', err);
      setError('No se pudo actualizar la actividad. Verifica que el servidor está disponible.');
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      setError(null);
      await activityService.deleteActivity(id);
      setActivities(activities.filter(activity => activity.id !== id));
      setShowModal(false);
    } catch (err) {
      console.error('Error al eliminar actividad:', err);
      setError('No se pudo eliminar la actividad. Verifica que el servidor está disponible.');
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  return (
    <div className="app-container">
      <nav className="navbar navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">📅 Gestor de Actividades Diarias</span>
        </div>
      </nav>

      <main className="container-fluid py-4">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        <div className="calendar-main-container">
          <div className="row">
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <CalendarView
                  activities={activities}
                  onDateSelect={handleDateSelect}
                  onAddClick={handleAddClick}
                />
              )}
            </div>

            <div className="col-lg-4">
              {showForm && (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Nueva Actividad</h5>
                    <ActivityForm
                      onSubmit={handleAddActivity}
                      onCancel={() => setShowForm(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ActivityModal
        show={showModal}
        activities={activities}
        selectedDate={selectedDate}
        onClose={() => setShowModal(false)}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />
    </div>
  );
}

export default App;
