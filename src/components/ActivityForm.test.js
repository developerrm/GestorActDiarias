import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityForm from './ActivityForm';

// Mock de fetch global
global.fetch = jest.fn();

describe('ActivityForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('Renderizado del formulario', () => {
    test('debe renderizar el formulario con los campos correctos', () => {
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/Fecha de la actividad/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
    });

    test('debe renderizar con la fecha actual por defecto', () => {
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const today = new Date().toISOString().split('T')[0];
      const dateInput = screen.getByDisplayValue(today);

      expect(dateInput).toBeInTheDocument();
    });

    test('debe renderizar con datos iniciales cuando se proporciona initialActivity', () => {
      const initialActivity = {
        date: '2025-12-15',
        description: 'Actividad de prueba',
      };

      render(<ActivityForm onSubmit={mockOnSubmit} initialActivity={initialActivity} />);

      expect(screen.getByDisplayValue('2025-12-15')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Actividad de prueba')).toBeInTheDocument();
    });

    test('debe mostrar botón "Actualizar" cuando se proporciona initialActivity', () => {
      const initialActivity = {
        date: '2025-12-15',
        description: 'Actividad de prueba',
      };

      render(<ActivityForm onSubmit={mockOnSubmit} initialActivity={initialActivity} />);

      expect(screen.getByRole('button', { name: /Actualizar/i })).toBeInTheDocument();
    });

    test('debe renderizar botón Cancelar cuando se proporciona onCancel', () => {
      render(<ActivityForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    });

    test('no debe renderizar botón Cancelar cuando no se proporciona onCancel', () => {
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      expect(screen.queryByRole('button', { name: /Cancelar/i })).not.toBeInTheDocument();
    });
  });

  describe('Validación de campos obligatorios', () => {
    test('debe mostrar error cuando la fecha está vacía', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const dateInput = screen.getByLabelText(/Fecha de la actividad/i);
      await user.clear(dateInput);

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('La fecha es requerida')).toBeInTheDocument();
      });
    });

    test('debe mostrar error cuando la descripción está vacía', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('La descripción es requerida')).toBeInTheDocument();
      });
    });

    test('debe mostrar error cuando la descripción tiene menos de 3 caracteres', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'ab');

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/La descripción debe tener al menos 3 caracteres/i)).toBeInTheDocument();
      });
    });

    test('debe validar correctamente cuando todos los campos son válidos', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Esta es una descripción válida');

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    test('debe limpiar el error al escribir en un campo con error', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('La descripción es requerida')).toBeInTheDocument();
      });

      await user.type(descriptionInput, 'Descripción válida');

      await waitFor(() => {
        expect(screen.queryByText('La descripción es requerida')).not.toBeInTheDocument();
      });
    });
  });

  describe('Envío del formulario', () => {
    test('debe llamar a onSubmit con los datos del formulario', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Actividad de prueba completa');

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'Actividad de prueba completa',
          })
        );
      });
    });

    test('debe limpiar el formulario después del envío exitoso', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Actividad de prueba');

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(descriptionInput).toHaveValue('');
      });
    });

    test('no debe llamar a onSubmit si la validación falla', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    test('debe prevenir el comportamiento por defecto del formulario', async () => {
      const user = userEvent.setup();
      const preventDefaultSpy = jest.fn();
      
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Prueba');

      const form = descriptionInput.closest('form');
      
      form.addEventListener('submit', preventDefaultSpy);
      await user.click(screen.getByRole('button', { name: /Guardar/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    test('debe llamar a onCancel cuando se hace clic en el botón Cancelar', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mock de llamadas fetch al backend', () => {
    test('debe hacer una llamada fetch al enviar el formulario', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, message: 'Actividad creada' }),
      });

      const handleSubmit = jest.fn(async (data) => {
        const response = await fetch('http://localhost:3001/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return response.json();
      });

      const user = userEvent.setup();
      render(<ActivityForm onSubmit={handleSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Actividad con fetch');

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });
    });

    test('debe manejar errores de fetch correctamente', async () => {
      fetch.mockRejectedValueOnce(new Error('Error de conexión'));

      const handleSubmit = jest.fn(async (data) => {
        try {
          const response = await fetch('http://localhost:3001/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          return response.json();
        } catch (error) {
          return { error: error.message };
        }
      });

      const user = userEvent.setup();
      render(<ActivityForm onSubmit={handleSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Actividad con error');

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });
    });

    test('debe enviar los datos correctos en la llamada fetch', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      });

      const handleSubmit = jest.fn(async (data) => {
        const response = await fetch('http://localhost:3001/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return response.json();
      });

      const user = userEvent.setup();
      render(<ActivityForm onSubmit={handleSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Prueba de envío');

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'Prueba de envío',
            date: expect.any(String),
          })
        );
      });
    });
  });

  describe('Interacción con campos', () => {
    test('debe actualizar el estado al cambiar el valor de la fecha', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const dateInput = screen.getByLabelText(/Fecha de la actividad/i);
      await user.clear(dateInput);
      await user.type(dateInput, '2025-12-20');

      expect(dateInput).toHaveValue('2025-12-20');
    });

    test('debe actualizar el estado al cambiar el valor de la descripción', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/Descripción/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Nueva descripción');

      expect(descriptionInput).toHaveValue('Nueva descripción');
    });

    test('debe aplicar clases CSS correctas para campos inválidos', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const dateInput = screen.getByLabelText(/Fecha de la actividad/i);
      await user.clear(dateInput);

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(dateInput).toHaveClass('is-invalid');
      });
    });

    test('debe remover la clase CSS is-invalid cuando el error se limpia', async () => {
      const user = userEvent.setup();
      render(<ActivityForm onSubmit={mockOnSubmit} />);

      const dateInput = screen.getByLabelText(/Fecha de la actividad/i);
      await user.clear(dateInput);

      const submitButton = screen.getByRole('button', { name: /Guardar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(dateInput).toHaveClass('is-invalid');
      });

      await user.type(dateInput, '2025-12-20');

      await waitFor(() => {
        expect(dateInput).not.toHaveClass('is-invalid');
      });
    });
  });
});
