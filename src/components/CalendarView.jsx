import { useState } from 'react';
import '../styles/CalendarView.css';

export default function CalendarView({ activities, onDateSelect, onAddClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const hasActivityOnDate = (day) => {
    const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    return activities.some(activity => activity.date === dateStr);
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onDateSelect(selectedDate);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="btn btn-outline-primary btn-sm" onClick={previousMonth}>
          ← Anterior
        </button>
        <h2 className="calendar-month">{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={nextMonth}>
          Siguiente →
        </button>
      </div>

      <div className="calendar-grid">
        <div className="day-header">Lun</div>
        <div className="day-header">Mar</div>
        <div className="day-header">Mié</div>
        <div className="day-header">Jue</div>
        <div className="day-header">Vie</div>
        <div className="day-header">Sáb</div>
        <div className="day-header">Dom</div>

        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day ? 'active' : 'empty'} ${
              isToday(day) ? 'today' : ''
            } ${hasActivityOnDate(day) ? 'has-activity' : ''}`}
            onClick={() => day && handleDateClick(day)}
          >
            {day && (
              <>
                <span className="day-number">{day}</span>
                {hasActivityOnDate(day) && <div className="activity-indicator">●</div>}
              </>
            )}
          </div>
        ))}
      </div>

      <button className="btn btn-success mt-3" onClick={onAddClick}>
        + Nueva Actividad
      </button>
    </div>
  );
}
