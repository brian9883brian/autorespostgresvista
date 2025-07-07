import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://www.autoreslibroautores.somee.com';

const AutorList = () => {
  const [autores, setAutores] = useState([]);
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [guidSeleccionado, setGuidSeleccionado] = useState(null);

  useEffect(() => {
    obtenerAutores();
  }, []);

  const obtenerAutores = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Autor`);
      setAutores(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la lista de autores.');
    }
  };

  const validarFormulario = () => {
    if (!nombre.trim() || !apellido.trim() || !fechaNacimiento.trim()) {
      alert('Todos los campos son obligatorios.');
      return false;
    }

    const fecha = new Date(fechaNacimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha > hoy) {
      alert('La fecha de nacimiento no puede ser mayor a hoy.');
      return false;
    }

    return true;
  };

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setFechaNacimiento('');
    setGuidSeleccionado(null);
  };

  const crearAutor = async () => {
    if (!validarFormulario()) return;

    try {
      const fechaISO = new Date(fechaNacimiento).toISOString();
      await axios.post(`${BASE_URL}/api/Autor`, {
        nombre,
        apellido,
        fechaNacimiento: fechaISO
      });
      obtenerAutores();
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert('Error al crear autor.');
    }
  };

  const actualizarAutor = async () => {
    if (!validarFormulario()) return;

    try {
      const fechaISO = new Date(fechaNacimiento).toISOString();
      await axios.put(`${BASE_URL}/api/Autor/${guidSeleccionado}`, {
        autorLibroGuid: guidSeleccionado,
        nombre,
        apellido,
        fechaNacimiento: fechaISO
      });
      obtenerAutores();
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar autor.');
    }
  };

  const eliminarAutor = async (guid) => {
    if (!window.confirm('¿Seguro que deseas eliminar este autor?')) return;

    try {
      await axios.delete(`${BASE_URL}/api/Autor/${guid}`);
      obtenerAutores();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar autor.');
    }
  };

  const seleccionarParaEditar = (autor) => {
    setGuidSeleccionado(autor.autorLibroGuid);
    setNombre(autor.nombre);
    setApellido(autor.apellido);
    setFechaNacimiento(autor.fechaNacimiento.split('T')[0]);
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Autores</h1>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <input
          style={styles.input}
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />
        <button
          style={styles.buttonPrimary}
          onClick={guidSeleccionado ? actualizarAutor : crearAutor}
        >
          {guidSeleccionado ? 'Actualizar' : 'Crear'}
        </button>
        <button style={styles.buttonSecondary} onClick={limpiarFormulario}>
          Cancelar
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha Nacimiento</th>
            <th>GUID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {autores.map((autor) => (
            <tr key={autor.autorLibroGuid}>
              <td>{autor.autorLibroId}</td>
              <td>{autor.nombre}</td>
              <td>{autor.apellido}</td>
              <td>{formatearFecha(autor.fechaNacimiento)}</td>
              <td>{autor.autorLibroGuid}</td>
              <td>
                <button
                  style={styles.editButton}
                  onClick={() => seleccionarParaEditar(autor)}
                >
                  Editar
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => eliminarAutor(autor.autorLibroGuid)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    fontSize: '2.2rem',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: '20px',
    backgroundColor: '#fee',
    padding: '10px',
    borderRadius: '5px',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
    justifyContent: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minWidth: '200px',
  },
  buttonPrimary: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '10px 20px',
    backgroundColor: '#bdc3c7',
    color: '#2c3e50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  editButton: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    marginRight: '8px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AutorList;
