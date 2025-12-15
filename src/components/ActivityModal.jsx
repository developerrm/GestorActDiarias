import { useState } from 'react';
import ActivityForm from './ActivityForm';

export default function ActivityModal({ show, activities, selectedDate, onClose, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const dateActivities = selectedDate
    ? activities.filter(
        activity =>
          activity.date === selectedDate.toISOString().split('T')[0]
      )
    : [];

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setIsEditing(true);
  };

  const handleSaveEdit = async (formData) => {
    await onSave(selectedActivity.id, formData);
    setIsEditing(false);
    setSelectedActivity(null);
  };

  const handleDeleteActivity = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      await onDelete(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedActivity(null);
  };

  const handleClose = () => {
    setIsEditing(false);
    setSelectedActivity(null);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header d-flex justify-content-between align-items-center mb-3">
          <h3 className="modal-title">
            {selectedDate && selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            aria-label="Cerrar"
          ></button>
        </div>

        {isEditing ? (
          <div>
            <h5 className="mb-3">Editar Actividad</h5>
            <ActivityForm
              initialActivity={selectedActivity}
              onSubmit={handleSaveEdit}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="modal-body">
            {dateActivities.length === 0 ? (
              <p className="text-muted">No hay actividades registradas para este día.</p>
            ) : (
              <div className="activities-list">
                {dateActivities.map(activity => (
                  <div key={activity.id} className="activity-item card mb-2 p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-2">{activity.description}</h6>
                        <small className="text-muted">
                          Registrado: {new Date(activity.date).toLocaleDateString('es-ES')}
                        </small>
                      </div>
                      <div className="action-buttons d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(activity)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
