/**
 * Gestión de Cuadrillas - Poblado Dinámico de Tabla
 * OCA OperationSmart
 */

class GestionCuadrillas {
    constructor() {
        this.cuadrillas = [];
        this.init();
    }

    /**
     * Inicializa la gestión de cuadrillas
     */
    init() {
        console.log('🚀 Inicializando Gestión de Cuadrillas...');
        this.cargarCuadrillas();
    }

    /**
     * Carga los datos de cuadrillas desde el archivo JSON
     */
    async cargarCuadrillas() {
        try {
            console.log('📂 Cargando datos de cuadrillas...');
            
            const response = await fetch('mock_data/cuadrillas.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.cuadrillas = await response.json();
            console.log('✅ Datos de cuadrillas cargados:', this.cuadrillas);
            
            this.poblarTabla();
            this.inicializarTooltips();
            
        } catch (error) {
            console.error('❌ Error al cargar cuadrillas:', error);
            this.mostrarError('Error al cargar los datos de cuadrillas');
        }
    }

    /**
     * Pobla la tabla con los datos de cuadrillas
     */
    poblarTabla() {
        console.log('🎨 Poblando tabla de cuadrillas...');
        
        const tbody = document.querySelector('#tablaCuadrillas tbody');
        
        if (!tbody) {
            console.error('❌ No se encontró el tbody de la tabla');
            return;
        }
        
        // Limpiar tabla existente
        tbody.innerHTML = '';
        
        // Crear filas para cada cuadrilla
        this.cuadrillas.forEach(cuadrilla => {
            const fila = this.crearFilaCuadrilla(cuadrilla);
            tbody.appendChild(fila);
        });
        
        console.log(`✅ Tabla poblada con ${this.cuadrillas.length} cuadrillas`);
    }

    /**
     * Crea una fila de tabla para una cuadrilla
     * @param {Object} cuadrilla - Objeto con los datos de la cuadrilla
     * @returns {HTMLElement} Elemento tr con los datos de la cuadrilla
     */
    crearFilaCuadrilla(cuadrilla) {
        console.log('📋 Creando fila para cuadrilla:', cuadrilla);
        
        const fila = document.createElement('tr');
        
        // Crear las celdas de la fila
        fila.innerHTML = `
            <td>${cuadrilla.id}</td>
            <td>${cuadrilla.nombre}</td>
            <td>${cuadrilla.supervisor}</td>
            <td>${cuadrilla.especialidad}</td>
            <td>${cuadrilla.miembros}</td>
            <td>${cuadrilla.proyecto_asignado}</td>
            <td>${this.crearBadgeEstado(cuadrilla.estado)}</td>
            <td class="acciones">
                ${this.crearBotonesAcciones(cuadrilla.id)}
            </td>
        `;
        
        return fila;
    }

    /**
     * Crea el badge de estado con Bootstrap
     * @param {string} estado - Estado de la cuadrilla
     * @returns {string} HTML del badge
     */
    crearBadgeEstado(estado) {
        const mapeoEstados = {
            'Activa': 'text-bg-success',
            'En Descanso': 'text-bg-secondary',
            'Inactiva': 'text-bg-danger',
            'En Mantenimiento': 'text-bg-warning'
        };
        
        const claseBadge = mapeoEstados[estado] || 'text-bg-secondary';
        
        return `<span class="badge rounded-pill ${claseBadge}">${estado}</span>`;
    }

    /**
     * Crea los botones de acciones con tooltips
     * @param {string} idCuadrilla - ID de la cuadrilla
     * @returns {string} HTML de los botones de acciones
     */
    crearBotonesAcciones(idCuadrilla) {
        return `
            <button class="btn-ver" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver Detalles" onclick="verCuadrilla('${idCuadrilla}')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            </button>
            <button class="btn-editar" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar Cuadrilla" onclick="editarCuadrilla('${idCuadrilla}')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
            </button>
            <button class="btn-eliminar" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar Cuadrilla" onclick="eliminarCuadrilla('${idCuadrilla}')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
            </button>
        `;
    }

    /**
     * Inicializa los tooltips de Bootstrap
     */
    inicializarTooltips() {
        console.log('🔧 Inicializando tooltips...');
        
        // Verificar si Bootstrap está disponible
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
            console.log(`✅ ${tooltipList.length} tooltips inicializados`);
        } else {
            console.warn('⚠️ Bootstrap no está disponible para tooltips');
        }
    }

    /**
     * Muestra un mensaje de error en la tabla
     * @param {string} mensaje - Mensaje de error a mostrar
     */
    mostrarError(mensaje) {
        const tbody = document.querySelector('#tablaCuadrillas tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="alert alert-danger" role="alert">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            ${mensaje}
                        </div>
                    </td>
                </tr>
            `;
        }
    }
}

// Funciones globales para las acciones de los botones
function verCuadrilla(idCuadrilla) {
    console.log('👁️ Ver detalles de cuadrilla:', idCuadrilla);
    // Aquí se implementaría la lógica para ver detalles
    alert(`Ver detalles de cuadrilla: ${idCuadrilla}`);
}

function editarCuadrilla(idCuadrilla) {
    console.log('✏️ Editar cuadrilla:', idCuadrilla);
    // Aquí se implementaría la lógica para editar
    alert(`Editar cuadrilla: ${idCuadrilla}`);
}

function eliminarCuadrilla(idCuadrilla) {
    console.log('🗑️ Eliminar cuadrilla:', idCuadrilla);
    // Aquí se implementaría la lógica para eliminar
    if (confirm(`¿Estás seguro de que quieres eliminar la cuadrilla ${idCuadrilla}?`)) {
        alert(`Cuadrilla ${idCuadrilla} eliminada`);
    }
}

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 DOM cargado, iniciando Gestión de Cuadrillas...');
    new GestionCuadrillas();
});


