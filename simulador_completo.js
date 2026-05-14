
let clientes = [];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

// --- PARTE 1: NAVEGACIÓN ---

function ocultarSecciones() {
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
  // Si ya agregaste las otras secciones, lístalas aquí tambien
  if (document.getElementById("credito")) document.getElementById("credito").classList.remove("activa");
  if (document.getElementById("listaCreditos")) document.getElementById("listaCreditos").classList.remove("activa");
}

function mostrarSeccion(id) {
  ocultarSecciones(); // Invoca la limpieza previa 
  document.getElementById(id).classList.add("activa"); // Agrega clase activa al id recibido
}

function limpiar() {
  // Vacía todos los inputs
  mostrarTextoEnCaja("txtCedula", "");
  mostrarTextoEnCaja("txtNombre", "");
  mostrarTextoEnCaja("txtApellido", "");
  mostrarTextoEnCaja("txtIngresos", "");
  mostrarTextoEnCaja("txtEgresos", "");

  // Opcional: Limpiar mensajes de validación para un acabado profesional
  mostrarTexto("mensajeTasa", "");

  clienteSeleccionado = null; //resetea de la referencia
}

function guardarTasa() {
  let tasa = recuperarFloat("tasaInteres"); // Obtiene y convierte
  if (tasa >= 10 && tasa <= 20) { // Valida rango 
    tasaInteres = tasa;
    mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasa + "%");
  } else {
    mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
  }
}

function guardarCliente() {
  let cedula = recuperaraTexto("txtCedula");
  let nombre = recuperaraTexto("txtNombre");
  let apellido = recuperaraTexto("txtApellido");
  let ingresos = recuperarFloat("txtIngresos");
  let egresos = recuperarFloat("txtEgresos");

  let clienteExistente = buscarCliente(cedula);

  if (clienteExistente == null) {
    // Crear nuevo objeto 
    let nuevoCliente = { cedula, nombre, apellido, ingresos, egresos };
    clientes.push(nuevoCliente);
  } else {
    // Actualizar existente
    clienteExistente.nombre = nombre;
    clienteExistente.apellido = apellido;
    clienteExistente.ingresos = ingresos;
    clienteExistente.egresos = egresos;
  }
  pintarClientes();
  limpiar();
}

function pintarClientes() {
  let contenidoTabla = "";
  for (let i = 0; i < clientes.length; i++) {
    let cli = clientes[i];
    contenidoTabla += "<tr>" +
      "<td>" + cli.cedula + "</td>" +
      "<td>" + cli.nombre + "</td>" +
      "<td>" + cli.apellido + "</td>" +
      "<td>" + cli.ingresos + "</td>" +
      "<td>" + cli.egresos + "</td>" +
      "<td><button onclick=\"seleccionarCliente('" + cli.cedula + "')\">Actualizar</button></td>" +
      "</tr>";
  }
  document.getElementById("tablaClientes").innerHTML = contenidoTabla;
}

function buscarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) return clientes[i];
  }
  return null;
}

function seleccionarCliente(cedula) {
  let cli = buscarCliente(cedula);
  if (cli) {
    mostrarTextoEnCaja("txtCedula", cli.cedula);
    mostrarTextoEnCaja("txtNombre", cli.nombre);
    mostrarTextoEnCaja("txtApellido", cli.apellido);
    mostrarTextoEnCaja("txtIngresos", cli.ingresos);
    mostrarTextoEnCaja("txtEgresos", cli.egresos);
  }
}

function buscarClienteCredito() {
  let cedula = recuperaraTexto("buscarCedulaCredito"); 
  let cliente = buscarCliente(cedula); // Reutiliza tu función de la Parte 1

  if (cliente != null) {
    clienteEncontradoCredito = cliente; // Guardamos el cliente para el cálculo
    // Armar información dinámicamente 
    let htmlCliente = "<h3>Datos del Cliente</h3>" +
      "<p><strong>Cédula:</strong> " + cliente.cedula + "</p>" +
      "<p><strong>Nombre:</strong> " + cliente.nombre + "</p>" +
      "<p><strong>Apellido:</strong> " + cliente.apellido + "</p>" +
      "<p><strong>Ingresos:</strong> " + cliente.ingresos + "</p>" +
      "<p><strong>Egresos:</strong> " + cliente.egresos + "</p>";

    document.getElementById("datosClienteCredito").innerHTML = htmlCliente; 
  } else {
    alert("Cliente no encontrado"); 
    document.getElementById("datosClienteCredito").innerHTML = "";
  }
}

function calcularCredito() {
  let monto = recuperarFloat("montoCredito");
  let plazo = recuperarInt("plazoCredito");

  // 1. Cálculos 
  let capacidadPago = (clienteEncontradoCredito.ingresos - clienteEncontradoCredito.egresos) * 0.4; 
  let totalPagar = monto + (monto * (tasaInteres / 100)); 
  let cuota = totalPagar / plazo; 

  let mensajeResultado = "";
  let componenteResultado = document.getElementById("resultadoCredito"); 

  // 2. Resultado y Estilos 
  if (cuota <= capacidadPago) {
    mensajeResultado = "RESULTADO: APROBADO"; 
    componenteResultado.className = "aprobado"; 
    document.getElementById("btnSolicitarCredito").disabled = false;
  } else {
    mensajeResultado = "RESULTADO: RECHAZADO";
    componenteResultado.className = "rechazado"; 
    document.getElementById("btnSolicitarCredito").disabled = true;
  }

  // 3. Mostrar en pantalla 
  componenteResultado.innerHTML =
    "Capacidad de pago: " + capacidadPago.toFixed(2) + "<br>" +
    "Total a pagar: " + totalPagar.toFixed(2) + "<br>" +
    "Cuota mensual: " + cuota.toFixed(2) + "<br>" +
    mensajeResultado;
}

function solicitarCredito() {
    // 1. Creamos el objeto crédito con los datos actuales
    let monto = recuperarFloat("montoCredito");
    let plazo = recuperarInt("plazoCredito");
    let totalPagar = monto + (monto * (tasaInteres / 100));
    let cuota = totalPagar / plazo;

    let nuevoCredito = {
        cedula: clienteEncontradoCredito.cedula,
        nombre: clienteEncontradoCredito.nombre,
        apellido: clienteEncontradoCredito.apellido,
        monto: monto,
        tasa: tasaInteres,
        plazo: plazo,
        cuota: cuota.toFixed(2)
    };

    // 2. Lo guardamos en el arreglo global
    creditos.push(nuevoCredito);
    
    alert("Crédito asignado exitosamente");
    
    // 3. Limpiamos y actualizamos la tabla del historial
    pintarCreditos(creditos);
}

function pintarCreditos(arregloCreditos) {
    let contenidoTabla = "";
    let tabla = document.getElementById("tablaCreditos");

    for (let i = 0; i < arregloCreditos.length; i++) {
        let cre = arregloCreditos[i];
        contenidoTabla += "<tr>" +
            "<td>" + cre.cedula + "</td>" +
            "<td>" + cre.nombre + "</td>" +
            "<td>" + cre.apellido + "</td>" +
            "<td>" + cre.monto + "</td>" +
            "<td>" + cre.tasa + "%</td>" +
            "<td>" + cre.plazo + " meses</td>" +
            "<td>" + cre.cuota + "</td>" +
        "</tr>";
    }
    tabla.innerHTML = contenidoTabla;
}

function buscarCreditosCliente() {
    let cedulaABuscar = recuperaraTexto("buscarCedulaListado");
    let creditosFiltrados = [];

    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].cedula == cedulaABuscar) {
            creditosFiltrados.push(creditos[i]);
        }
    }
    
    pintarCreditos(creditosFiltrados);
}
//Para recuperar o mostrar información usar los métodos de la clase utilitarios, puede agregar métodos adicionales en utilitarios