// Inicializamos el arreglo con los datos precargados en el HTML para que las búsquedas no fallen
let clientes = [
  { cedula: "1712345678", nombre: "Juan", apellido: "Pérez", telefono: "0999999991", ingresos: 1200, egresos: 500 },
  { cedula: "1723456789", nombre: "María", apellido: "Gómez", telefono: "0999999992", ingresos: 1500, egresos: 600 },
  { cedula: "1734567890", carrot: "Carlos", apellido: "Ramírez", telefono: "0999999993", ingresos: 900, egresos: 350 }
];
let creditos = [];

let tasaInteres = 15;
// REQUERIMIENTO 2: Variable global para controlar el Monto Máximo (por defecto 50000)
let montoMaximoPermitido = 50000;

let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

// Al cargar el documento, mostramos por defecto la primera sección activa
window.onload = function() {
  mostrarSeccion('parametros');
};

// --- PARTE 1: NAVEGACIÓN ---

function ocultarSecciones() {
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
  if (document.getElementById("credito")) document.getElementById("credito").classList.remove("activa");
  if (document.getElementById("listaCreditos")) document.getElementById("listaCreditos").classList.remove("activa");
  // REQUERIMIENTO 4: Ocultar sección Acerca de
  if (document.getElementById("acercaDe")) document.getElementById("acercaDe").classList.remove("activa");
}

function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
}

function limpiar() {
  mostrarTextoEnCaja("txtCedula", "");
  mostrarTextoEnCaja("txtNombre", "");
  mostrarTextoEnCaja("txtApellido", "");
  // REQUERIMIENTO 1: Limpiar campo teléfono
  mostrarTextoEnCaja("txtTelefono", "");
  mostrarTextoEnCaja("txtIngresos", "");
  mostrarTextoEnCaja("txtEgresos", "");

  mostrarTexto("mensajeTasa", "");
  clienteSeleccionado = null;
}

// --- PARTE 2: CONFIGURACIÓN DE PARÁMETROS ---

// REQUERIMIENTO 2: Guardar tasa y monto máximo conjuntamente
function guardarParametros() {
  let tasaIngresada = recuperarInt("tasaInteres");
  let montoIngresado = recuperarFloat("txtMontoMaximo");

  if (isNaN(tasaIngresada) || tasaIngresada < 10 || tasaInteres > 20) {
    mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
    return;
  }

  if (isNaN(montoIngresado) || montoIngresado <= 0) {
    mostrarTexto("mensajeTasa", "Ingrese un monto máximo válido y superior a 0.");
    return;
  }

  tasaInteres = tasaIngresada;
  montoMaximoPermitido = montoIngresado; // Guardamos en la variable global
  mostrarTexto("mensajeTasa", "Parámetros guardados con éxito: Tasa " + tasaInteres + "% y Monto Máximo $" + montoMaximoPermitido);
}

// --- PARTE 3: ENTIDAD CLIENTES ---

function guardarCliente() {
  let cedula = recuperaraTexto("txtCedula");
  let nombre = recuperaraTexto("txtNombre");
  let apellido = recuperaraTexto("txtApellido");
  let telefono = recuperaraTexto("txtTelefono"); // REQUERIMIENTO 1: Recuperar teléfono
  let ingresos = recuperarFloat("txtIngresos");
  let egresos = recuperarFloat("txtEgresos");

  if (cedula === "" || nombre === "" || apellido === "" || telefono === "" || isNaN(ingresos) || isNaN(egresos)) {
    alert("Todos los campos son obligatorios");
    return;
  }

  let clienteExistente = buscarCliente(cedula);

  if (clienteExistente == null) {
    // REQUERIMIENTO 1: Atributo incorporado
    let nuevoCliente = {
      cedula: cedula,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      ingresos: ingresos,
      egresos: egresos
    };
    clientes.push(nuevoCliente);
    alert("Cliente guardado de forma exitosa");
  } else {
    clienteExistente.nombre = nombre;
    clienteExistente.apellido = apellido;
    clienteExistente.telefono = telefono; // REQUERIMIENTO 1: Actualizar teléfono
    clienteExistente.ingresos = ingresos;
    clienteExistente.egresos = egresos;
    alert("Cliente actualizado de forma exitosa");
  }

  pintarClientes();
  limpiar();
}

function buscarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula === cedula) {
      return clientes[i];
    }
  }
  return null;
}

function pintarClientes() {
  let contenidoTabla = "";
  let tabla = document.getElementById("tablaClientes");

  for (let i = 0; i < clientes.length; i++) {
    let cli = clientes[i];
    contenidoTabla += "<tr>" +
      "<td>" + cli.cedula + "</td>" +
      "<td>" + cli.nombre + "</td>" +
      "<td>" + cli.apellido + "</td>" +
      "<td>" + cli.telefono + "</td>" + // REQUERIMIENTO 1: Visualizar teléfono en la tabla
      "<td>" + cli.ingresos + "</td>" +
      "<td>" + cli.egresos + "</td>" +
      "<td><button onclick=\"seleccionarCliente('" + cli.cedula + "')\">Actualizar</button></td>" +
      "</tr>";
  }
  tabla.innerHTML = contenidoTabla;
}

function seleccionarCliente(cedula) {
  let cli = buscarCliente(cedula);
  if (cli != null) {
    mostrarTextoEnCaja("txtCedula", cli.cedula);
    mostrarTextoEnCaja("txtNombre", cli.nombre);
    mostrarTextoEnCaja("txtApellido", cli.apellido);
    mostrarTextoEnCaja("txtTelefono", cli.telefono); // REQUERIMIENTO 1: Cargar teléfono
    mostrarTextoEnCaja("txtIngresos", cli.ingresos);
    mostrarTextoEnCaja("txtEgresos", cli.egresos);
  }
}

// --- PARTE 4: SOLICITUD DE CRÉDITO ---

function buscarClienteCredito() {
  let cedula = recuperaraTexto("buscarCedulaCredito");
  let cli = buscarCliente(cedula);
  let divDatos = document.getElementById("datosClienteCredito");

  if (cli == null) {
    divDatos.innerHTML = "<p style='color:red;'>Cliente no registrado en el sistema.</p>";
    clienteSeleccionado = null;
    return;
  }

  clienteSeleccionado = cli;
  // REQUERIMIENTO 1: Mostrar el teléfono en la ficha resumen del cliente
  divDatos.innerHTML = "<p><b>Cliente:</b> " + cli.nombre + " " + cli.apellido + " | <b>Teléfono:</b> " + cli.telefono + "</p>" +
    "<p><b>Capacidad Financiera (Ingresos - Egresos):</b> $" + (cli.ingresos - cli.egresos) + "</p>";
}

function calcularCredito() {
  if (clienteSeleccionado == null) {
    alert("Debe buscar y seleccionar un cliente primero.");
    return;
  }

  let monto = recuperarFloat("montoCredito");
  let plazo = recuperarInt("plazoCredito");

  if (isNaN(monto) || isNaN(plazo) || monto <= 0 || plazo <= 0) {
    alert("Monto y plazo deben ser valores numéricos mayores a cero.");
    return;
  }

  // REQUERIMIENTO 2: Validación contra el Monto Máximo configurado en parámetros
  if (monto > montoMaximoPermitido) {
    alert("¡ERROR CRÍTICO! El monto solicitado ($" + monto + ") supera el Monto Máximo permitido por el sistema ($" + montoMaximoPermitido + ").");
    mostrarTextoEnCaja("montoCredito", ""); // Limpiamos la caja de texto solicitada
    document.getElementById("resultadoCredito").innerHTML = "";
    document.getElementById("btnSolicitarCredito").disabled = true;
    return;
  }

  let totalInteres = monto * (tasaInteres / 100);
  let montoTotal = monto + totalInteres;
  let cuota = montoTotal / plazo;

  let capacidadDisponibilidad = (clienteSeleccionado.ingresos - clienteSeleccionado.egresos) * 0.4;
  let divResultado = document.getElementById("resultadoCredito");

  montoCalculado = monto;
  plazoCalculado = plazo;
  cuotaCalculada = cuota;

  if (cuota <= capacidadDisponibilidad) {
    creditoAprobado = true;
    divResultado.innerHTML = "<p style='color:green; font-weight:bold;'>CRÉDITO PRE-APROBADO<br>" +
      "Cuota Mensual: $" + cuota.toFixed(2) + " (Capacidad máxima de cuota: $" + capacidadDisponibilidad.toFixed(2) + ")</p>";
    document.getElementById("btnSolicitarCredito").disabled = false;
  } else {
    creditoAprobado = false;
    divResultado.innerHTML = "<p style='color:red; font-weight:bold;'>CRÉDITO RECHAZADO<br>" +
      "La cuota de $" + cuota.toFixed(2) + " excede el 40% de su capacidad disponible ($" + capacidadDisponibilidad.toFixed(2) + ")</p>";
    document.getElementById("btnSolicitarCredito").disabled = true;
  }
}

function solicitarCredito() {
  if (!creditoAprobado || clienteSeleccionado == null) return;

  let nuevoCredito = {
    cedula: clienteSeleccionado.cedula,
    nombre: clienteSeleccionado.nombre,
    apellido: clienteSeleccionado.apellido,
    monto: montoCalculado,
    tasa: tasaInteres,
    plazo: plazoCalculado,
    cuota: cuotaCalculada.toFixed(2)
  };

  creditos.push(nuevoCredito);
  alert("Crédito otorgado y registrado de forma exitosa en el historial");

  mostrarTextoEnCaja("buscarCedulaCredito", "");
  mostrarTextoEnCaja("montoCredito", "");
  mostrarTextoEnCaja("plazoCredito", "");
  document.getElementById("datosClienteCredito").innerHTML = "";
  document.getElementById("resultadoCredito").innerHTML = "";
  document.getElementById("btnSolicitarCredito").disabled = true;
  clienteSeleccionado = null;

  pintarCreditos(creditos);
}

// --- PARTE 5: HISTORIAL Y FILTROS ---

function pintarCreditos(arregloCreditos) {
  let contenidoTabla = "";
  let tabla = document.getElementById("tablaCreditos");

  for (let i = 0; i < arregloCreditos.length; i++) {
    let cre = arregloCreditos[i];
    contenidoTabla += "<tr>" +
      "<td>" + cre.cedula + "</td>" +
      "<td>" + cre.nombre + "</td>" +
      "<td>" + cre.apellido + "</td>" +
      "<td>$" + cre.monto + "</td>" +
      "<td>" + cre.tasa + "%</td>" +
      "<td>" + cre.plazo + " meses</td>" +
      "<td>$" + cre.cuota + "</td>" +
      "</tr>";
  }
  tabla.innerHTML = contenidoTabla;
}

function buscarCreditosCliente() {
  let cedulaABuscar = recuperaraTexto("buscarCedulaListado");
  let creditosFiltrados = [];

  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula === cedulaABuscar) {
      creditosFiltrados.push(creditos[i]);
    }
  }
  pintarCreditos(creditosFiltrados);
}

// REQUERIMIENTO 3: Filtro dinámico para mostrar únicamente los Créditos VIP (> 5000)
function filtrarCreditosVIP() {
  let creditosVIP = [];
  for (let i = 0; i < creditos.length; i++) {
    // Convertimos a número para asegurar la comparación correcta
    if (Number(creditos[i].monto) > 5000) {
      creditosVIP.push(creditos[i]);
    }
  }
  pintarCreditos(creditosVIP);
  alert("Se han filtrado y desplegado únicamente los créditos VIP mayores a $5000 (Total encontrados: " + creditosVIP.length + ")");
}