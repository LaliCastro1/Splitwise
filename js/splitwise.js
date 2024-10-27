// Clase para representar un usuario
class Usuario {
    constructor(nombre, pathImg) {
        this.nombre = nombre;
        this.gastos = [];
        this.pathImg = pathImg;
    }

    agregarGasto(gasto) { 
        this.gastos.push(gasto);
    }
}

// Clase para representar un gasto
class Gasto {
    constructor(titulo, importe, fecha) {
        this.titulo = titulo;
        this.importe = importe;
        this.fecha = fecha;
    }
}

// Crear usuarios para la aplicación
const usuarios = [
    new Usuario('Bob Esponja', './img/usuarios/bob_esponja.png'),
    new Usuario('Calamardo', './img/usuarios/calamardo.png'),
    new Usuario('Patricio', './img/usuarios/patricio.png')
];

// Función para crear el formulario dinámicamente en la pestaña "Añadir gasto"
function crearFormulario() {
    const formularioDiv = document.querySelector('#contenido-dos .cuerpo-acordeon');
    formularioDiv.innerHTML = ''; // Limpiar el contenido actual

    // Crear y configurar el formulario
    const form = document.createElement('form');
    form.classList.add('mb-10');

    // Elementos del formulario
    const usuariosSelect = document.createElement('select');
    usuariosSelect.id = 'usuario';
    usuariosSelect.classList.add('form-control');
    usuariosSelect.innerHTML = '<option value="">---</option>';
    usuarios.forEach(usuario => {
        usuariosSelect.innerHTML += `<option value="${usuario.nombre}">${usuario.nombre}</option>`;
    });

    const tituloInput = document.createElement('input');
    tituloInput.id = 'titulo';
    tituloInput.classList.add('form-control', 'mt-3'); //bootstrap
    tituloInput.placeholder = 'Título del gasto';
    tituloInput.maxLength = 20;

    const importeInput = document.createElement('input');
    importeInput.id = 'importe';
    importeInput.type = 'text';
    importeInput.classList.add('form-control', 'mt-3'); //bootstrap
    importeInput.placeholder = 'Importe (0.00 - 1000.00)';

    const fechaInput = document.createElement('input');
    fechaInput.id = 'fecha';
    fechaInput.type = 'text';
    fechaInput.classList.add('form-control', 'mt-3'); //bootstrap
    fechaInput.placeholder = 'Fecha (dd/mm/yyyy)';

    const submitButton = document.createElement('button');
    submitButton.id = 'btnForm';
    submitButton.type = 'button';
    submitButton.textContent = 'Añadir Gasto';
    submitButton.classList.add('btn', 'btn-success', 'mt-3'); //bootstrap

    // Añadir elementos al formulario y agregar evento
    form.append(usuariosSelect, tituloInput, importeInput, fechaInput, submitButton);
    formularioDiv.appendChild(form);


    submitButton.addEventListener('click', () => {
        validarFormulario(usuariosSelect.value, tituloInput.value, importeInput.value, fechaInput.value);
    });
}

// Validación del formulario
function validarFormulario(usuario, titulo, importe, fecha) {
    let errores = [];
    
    // Limpiar clases de error y éxito al inicio
    limpiarClases();

    if (!usuario || usuario === "---") {
        errores.push('Selecciona un usuario');
        document.getElementById('usuario').classList.add('error'); // Campo incorrecto
    } else {
        document.getElementById('usuario').classList.add('success'); // Campo correcto
    }

    if (!titulo) {
        errores.push('Introduce un título');
        document.getElementById('titulo').classList.add('error'); // Campo incorrecto
    } else if (!/^[A-Za-z0-9\s]{1,20}$/.test(titulo)) {
        errores.push('Título inválido');
        document.getElementById('titulo').classList.add('error'); // Campo incorrecto
    } else {
        document.getElementById('titulo').classList.add('success'); // Campo correcto
    }

    if (!importe) {
        errores.push('Introduce un importe');
        document.getElementById('importe').classList.add('error'); // Campo incorrecto
    } else if (!/^(0|[1-9]\d{0,2})(\.\d{2})?$/.test(importe)) {
        errores.push('El importe no es válido. Debe estar entre 0.00 y 1000.00.');
        document.getElementById('importe').classList.add('error'); // Campo incorrecto
    } else if (parseFloat(importe) < 0 || parseFloat(importe) > 1000) {
        errores.push('El importe debe estar entre 0.00 y 1000.00.');
        document.getElementById('importe').classList.add('error'); // Campo incorrecto
    } else {
        document.getElementById('importe').classList.add('success'); // Campo correcto
    }

    if (!fecha) {
        errores.push('Introduce una fecha');
        document.getElementById('fecha').classList.add('error'); // Campo incorrecto
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
        errores.push('Fecha inválida. Debe tener el formato dd/mm/yyyy.');
        document.getElementById('fecha').classList.add('error'); // Campo incorrecto
    } else {
        document.getElementById('fecha').classList.add('success'); // Campo correcto
    }

    if (errores.length > 0) {
        alert(errores.join('\n')); // Muestra los errores con un salto de línea
        return false; 
    }

    const usuarioObj = usuarios.find(u => u.nombre === usuario); 
    // Busca en el array "usuarios" un objeto cuyo "nombre" coincida con el valor de "usuario".
    // "usuarios.find(...)" devuelve el primer objeto que cumple con esta condición y lo guarda en "usuarioObj".
    
    const nuevoGasto = new Gasto(titulo, importe, fecha);
    // Crea un nuevo objeto "Gasto" usando el título, importe y fecha proporcionados.
    
    usuarioObj.agregarGasto(nuevoGasto);
    // Añade el "nuevoGasto" al array de gastos de "usuarioObj" llamando al método "agregarGasto" del usuario.
    // Así, el nuevo gasto queda asociado a ese usuario.
    
    actualizarResumen(usuarioObj, nuevoGasto);
    // Llama a la función "actualizarResumen", pasando el usuario y el nuevo gasto.
    actualizarCuentas();
    limpiarFormulario();
    
    return true;
    
// Función para limpiar clases de error y éxito
function limpiarClases() {
    const campos = ['usuario', 'titulo', 'importe', 'fecha'];
    campos.forEach(campo => {
        document.getElementById(campo).classList.remove('error', 'success'); // Eliminar clases de error y éxito
    });
}}

// Limpiar formulario después de agregar un gasto
function limpiarFormulario() {
    document.getElementById('usuario').value = '';
    document.getElementById('titulo').value = '';
    document.getElementById('importe').value = '';
    document.getElementById('fecha').value = '';
}

// Actualizar el resumen de gastos
function actualizarResumen(usuario, gasto) {
    const resumenDiv = document.querySelector('#contenido-uno .cuerpo-acordeon');
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta', 'mb-12', 'espacio');

    // Crear la estructura de la tarjeta
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row', 'g-0');

    const colImgDiv = document.createElement('div');
    colImgDiv.classList.add('col-md-2');

    const img = document.createElement('img');
    img.src = usuario.pathImg;
    img.classList.add('img-fluid', 'rounded-start');
    colImgDiv.appendChild(img); // Agregar imagen a su columna

    const colBodyDiv = document.createElement('div');
    colBodyDiv.classList.add('col-md-10');

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = usuario.nombre; // Asignar el nombre del usuario

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = `Pagó ${gasto.importe}€ el ${gasto.fecha}`; // Asignar el texto del gasto

    // Estructurar el contenido
    cardBodyDiv.appendChild(cardTitle);
    cardBodyDiv.appendChild(cardText);
    colBodyDiv.appendChild(cardBodyDiv);
    rowDiv.appendChild(colImgDiv);
    rowDiv.appendChild(colBodyDiv);
    tarjeta.appendChild(rowDiv);

    // Agregar la tarjeta al resumen
    resumenDiv.appendChild(tarjeta);
}


// Calcular el total que gasta un usuario 
function obtenerTotalGastado(usuario) {
    return usuario.gastos.reduce((total, gasto) => total + parseFloat(gasto.importe), 0);
}

// Actualizar el resumen de cuentas
function actualizarCuentas() {
    const cuentasDiv = document.querySelector('#contenido-tres .cuerpo-acordeon');
    cuentasDiv.innerHTML = ''; // Limpiar el contenido actual

    // Itera sobre cada usuario en el array 'usuarios'
    usuarios.forEach(usuario => {
        // Calcula el total gastado por el usuario llamando a la función 'obtenerTotalGastado'
        const totalPagado = obtenerTotalGastado(usuario);
        
        // Calcula la deuda del usuario llamando a la función 'calcularDeuda'
        const debe = calcularDeuda(usuario);

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta', 'mb-12', 'espacio');

        // Crear la estructura de la tarjeta
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row', 'g-0');

        const colImgDiv = document.createElement('div');
        colImgDiv.classList.add('col-md-2');

        const img = document.createElement('img');
        img.src = usuario.pathImg;
        img.classList.add('img-fluid', 'rounded-start');
        colImgDiv.appendChild(img); // Agregar imagen a su columna

        const colBodyDiv = document.createElement('div');
        colBodyDiv.classList.add('col-md-10');

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = usuario.nombre; // Asignar el nombre del usuario

        const pagadoText = document.createElement('p');
        pagadoText.classList.add('card-text');
        pagadoText.textContent = `Ha pagado ${totalPagado}€`; // Asignar el texto de total pagado

        const deudaText = document.createElement('p');
        deudaText.classList.add('card-text');
        deudaText.textContent = `Deuda: ${debe.toFixed(2)}€`; // Asignar el texto de deuda

        // Estructurar el contenido
        cardBodyDiv.appendChild(cardTitle);
        cardBodyDiv.appendChild(pagadoText);
        cardBodyDiv.appendChild(deudaText);
        colBodyDiv.appendChild(cardBodyDiv);
        rowDiv.appendChild(colImgDiv);
        rowDiv.appendChild(colBodyDiv);
        tarjeta.appendChild(rowDiv);

        // Agregar la tarjeta al resumen
        cuentasDiv.appendChild(tarjeta);
    });
}


// Función para calcular la deuda de un usuario
function calcularDeuda(usuario) {
    // Calcular el total de gastos acumulados por todos los usuarios
    const totalGastosAcumulados = usuarios.reduce((sumaTotal, usuarioActual) => {
        // Sumar todos los gastos de cada usuario individual
        return sumaTotal + usuarioActual.gastos.reduce((sumaGastos, gastoActual) => {
            return sumaGastos + parseFloat(gastoActual.importe); // Sumar el importe del gasto actual
        }, 0);
    }, 0);

    // Calcular el promedio de gastos por usuario
    const promedioGastosPorUsuario = totalGastosAcumulados / usuarios.length;

    // Calcular la deuda del usuario
    // La deuda se calcula restando el total de gastos del usuario del promedio de gastos
    const totalGastadoPorUsuario = obtenerTotalGastado(usuario);
    const deudaDelUsuario = promedioGastosPorUsuario - totalGastadoPorUsuario;

    return deudaDelUsuario; // Devolver la deuda calculada
}


// Inicializar la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', crearFormulario);
