import { useState } from 'react';
import ActivityForm from './ActivityForm';

export default function ActivityModal({ show, activities, selectedDate, onClose, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const getShareText = () => {
  return dateActivities
    .map(a => `• ${a.description}`)
    .join('\n');
};

const handleShare = async () => {
  try {
    if (!navigator.share) return;

    await navigator.share({
      title: 'Actividades del día',
      text: getShareText(),
    });
  } catch (error) {
    console.error('Error al compartir:', error);
  }
};
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(getShareText());
    alert('Actividades copiadas al portapapeles');
  } catch (error) {
    console.error('Error al copiar:', error);
  }
};


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
        <div className="modal-header d-flex justify-content-between align-items-start mb-3">
  <div>
    <h3 className="modal-title mb-1">
      {selectedDate && selectedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </h3>

   {dateActivities.length > 0 && !isEditing && (
  <div className="d-flex gap-2 mt-1">
    {navigator.share && (
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={handleShare}
      >
        Compartir
      </button>
    )}

    <button
      className="btn btn-sm btn-outline-secondary"
      onClick={handleCopy}
    >
      Copiar
    </button>
  </div>
)}

  </div>

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
                  <div
  key={activity.id}
  className="activity-item d-flex align-items-center justify-content-between border rounded px-2 py-1 mb-1"
>

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
