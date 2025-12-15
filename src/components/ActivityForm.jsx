import { useState } from 'react';

export default function ActivityForm({ onSubmit, initialActivity = null, onCancel }) {
  const [formData, setFormData] = useState(() => {
    if (initialActivity) {
      return {
        date: initialActivity.date || '',
        description: initialActivity.description || '',
      };
    }
    return {
      date: new Date().toISOString().split('T')[0],
      description: '',
    };
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'La descripción debe tener al menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="activity-form">
      <div className="mb-3">
        <label htmlFor="date" className="form-label">
          Fecha de la actividad
        </label>
        <input
          type="date"
          className={`form-control ${errors.date ? 'is-invalid' : ''}`}
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Descripción
        </label>
        <textarea
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          id="description"
          name="description"
          rows="4"
          placeholder="Describe tu actividad..."
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {initialActivity ? 'Actualizar' : 'Guardar'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
