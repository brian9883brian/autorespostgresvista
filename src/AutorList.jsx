import React, { useEffect, useState } from 'react';
import axios from 'axios';

// En desarrollo (npm start), usa proxy (base ''), en producción usa URL completa
const BASE_URL = 'https://autoreslibro.onrender.com';


const AutorList = () => {
  const [autores, setAutores] = useState([]);
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [guidSeleccionado, setGuidSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    obtenerAutores();
  }, []);

  const obtenerAutores = () => {
    axios.get(`${BASE_URL}/api/Autor`)
      .then(response => setAutores(response.data))
      .catch(err => {
        console.error('Error al obtener los autores:', err);
        setError('No se pudo cargar la lista de autores.');
      });
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setFechaNacimiento('');
    setGuidSeleccionado(null);
  };

  const crearAutor = async () => {
    try {
      await axios.post(`${BASE_URL}/api/Autor`, {
        nombre,
        apellido,
        fechaNacimiento
      });
      obtenerAutores();
      limpiarFormulario();
    } catch (error) {
      alert('Error al crear autor');
      console.error(error);
    }
  };

  const actualizarAutor = async () => {
    try {
      await axios.put(`${BASE_URL}/api/Autor/${guidSeleccionado}`, {
        autorLibroGuid: guidSeleccionado,
        nombre,
        apellido,
        fechaNacimiento
      });
      obtenerAutores();
      limpiarFormulario();
    } catch (error) {
      alert('Error al actualizar autor');
      console.error(error);
    }
  };

  const eliminarAutor = async (guid) => {
    if (!window.confirm('¿Seguro que deseas eliminar este autor?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/Autor/${guid}`);
      obtenerAutores();
    } catch (error) {
      alert('Error al eliminar autor');
      console.error(error);
    }
  };

  const buscarPorNombre = async () => {
    if (!busqueda.trim()) return obtenerAutores();

    try {
      const nombreEncoded = encodeURIComponent(busqueda);
      const response = await axios.get(`${BASE_URL}/api/Autor/nombre/${nombreEncoded}`);

      const resultado = Array.isArray(response.data) ? response.data : [response.data];
      setAutores(resultado);
    } catch (error) {
      alert('Error al buscar autores');
      console.error(error);
    }
  };

  const seleccionarParaEditar = (autor) => {
    setGuidSeleccionado(autor.autorLibroGuid);
    setNombre(autor.nombre);
    setApellido(autor.apellido);
    setFechaNacimiento(autor.fechaNacimiento.split('T')[0]);
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Gestión de Autores</h2>
      {error && <p style={errorStyle}>{error}</p>}

      {/* Formulario */}
      <div style={formContainerStyle}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          style={inputStyle}
        />
        <input
          type="date"
          placeholder="Fecha Nacimiento"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          style={inputStyle}
        />
        <button onClick={guidSeleccionado ? actualizarAutor : crearAutor} style={primaryButtonStyle}>
          {guidSeleccionado ? 'Actualizar' : 'Crear'}
        </button>
        <button onClick={limpiarFormulario} style={secondaryButtonStyle}>Cancelar</button>
      </div>

      {/* Búsqueda */}
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={inputStyle}
        />
        <button onClick={buscarPorNombre} style={secondaryButtonStyle}>Buscar</button>
      </div>

      {/* Tabla */}
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead style={tableHeaderStyle}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Apellido</th>
              <th style={thStyle}>Fecha Nacimiento</th>
              <th style={thStyle}>GUID</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {autores.map((autor, index) => (
              <tr key={autor.autorLibroGuid} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                <td style={tdStyle}>{autor.autorLibroId}</td>
                <td style={tdStyle}>{autor.nombre}</td>
                <td style={tdStyle}>{autor.apellido}</td>
                <td style={tdStyle}>{formatearFecha(autor.fechaNacimiento)}</td>
                <td style={tdStyle}>{autor.autorLibroGuid}</td>
                <td style={tdActionStyle}>
                  <button onClick={() => seleccionarParaEditar(autor)} style={actionButtonStyle}>Editar</button>
                  <button onClick={() => eliminarAutor(autor.autorLibroGuid)} style={deleteButtonStyle}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// Estilos mejorados
const containerStyle = {
  padding: '40px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: '#f9fbfd',
  minHeight: '100vh',
  boxSizing: 'border-box',
};

const headingStyle = {
  textAlign: 'center',
  color: '#2c3e50',
  marginBottom: '30px',
  fontSize: '2.5em',
  fontWeight: '600',
  borderBottom: '2px solid #3498db',
  paddingBottom: '10px',
  display: 'inline-block',
  width: '100%',
};

const errorStyle = {
  color: '#e74c3c',
  backgroundColor: '#fdeded',
  border: '1px solid #e74c3c',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '20px',
  textAlign: 'center',
};

const formContainerStyle = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
  marginBottom: '30px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  alignItems: 'center',
  justifyContent: 'center',
};

const inputStyle = {
  flex: '1 1 auto',
  minWidth: '180px',
  padding: '12px 15px',
  fontSize: '1em',
  border: '1px solid #dcdcdc',
  borderRadius: '8px',
  outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
};

const baseButtonStyle = {
  padding: '12px 20px',
  fontSize: '1em',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
  border: 'none',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
};

const primaryButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#3498db',
  color: '#ffffff',
};

const secondaryButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#ecf0f1',
  color: '#34495e',
  border: '1px solid #bdc3c7',
};

const actionButtonStyle = {
  ...baseButtonStyle,
  padding: '8px 14px',
  fontSize: '0.9em',
  marginRight: '10px',
  backgroundColor: '#2ecc71',
  color: '#ffffff',
};

const deleteButtonStyle = {
  ...baseButtonStyle,
  padding: '8px 14px',
  fontSize: '0.9em',
  backgroundColor: '#e74c3c',
  color: '#ffffff',
};

const searchContainerStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  marginBottom: '30px',
  display: 'flex',
  gap: '15px',
  alignItems: 'center',
  justifyContent: 'center',
};

const tableWrapperStyle = {
  overflowX: 'auto',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0',
  borderRadius: '10px',
  overflow: 'hidden',
};

const tableHeaderStyle = {
  backgroundColor: '#34495e',
  color: '#ffffff',
};

const thStyle = {
  padding: '15px 20px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '1em',
  borderBottom: '2px solid #2c3e50',
};

const tdStyle = {
  padding: '15px 20px',
  borderBottom: '1px solid #ecf0f1',
  color: '#34495e',
  fontSize: '0.95em',
};

const tdActionStyle = {
  ...tdStyle,
  whiteSpace: 'nowrap',
};

const evenRowStyle = {
  backgroundColor: '#fcfcfc',
};

const oddRowStyle = {
  backgroundColor: '#f2f4f6',
};

export default AutorList;
