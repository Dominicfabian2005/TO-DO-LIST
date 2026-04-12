const lista = document.getElementById('lista-tareas')
const totalTareas = document.getElementById('total-tareas')
const todasTareas = document.getElementById('todas-tareas')
const boton = document.getElementById('btn-agregar')
const modalElement = document.getElementById('MODAL-insert');
const modal = new bootstrap.Modal(modalElement);
const ingreso = document.getElementById('input-tarea')
const agregarMod = document.getElementById('agregar-modal')
const pendientes = document.getElementById('pendientes')
const completadas = document.getElementById('completadas')
const limpiarCompletadas = document.getElementById('limpiar-completadas')

todasTareas.addEventListener('click', () => {
  const arrayLista = [...document.querySelectorAll('.class-contenedor-Tareas')];
  arrayLista.forEach(tarea => tarea.style.display = 'flex');
});

pendientes.addEventListener('click', () => {
  const arrayLista = [...document.querySelectorAll('.class-contenedor-Tareas')];
  arrayLista.forEach(tarea => {
    const check = tarea.querySelector('input[type="checkbox"]');
    tarea.style.display = check.checked ? 'none' : 'flex';
  });
});

completadas.addEventListener('click', () => {
  const arrayLista = [...document.querySelectorAll('.class-contenedor-Tareas')];
  arrayLista.forEach(tarea => {
    const check = tarea.querySelector('input[type="checkbox"]');
    tarea.style.display = check.checked ? 'flex' : 'none';
  });
});

limpiarCompletadas.addEventListener('click', () => {
  const arrayLista = [...document.querySelectorAll('.class-contenedor-Tareas')];
  arrayLista.forEach(tarea => {
    const check = tarea.querySelector('input[type="checkbox"]');
    if (check.checked) tarea.remove();
  });
  guardarTareas();
  actualizarContador();
});

boton.addEventListener('click', () => {
  modal.show();
});

function actualizarContador() {
  const arrayLista = [...document.querySelectorAll('.class-contenedor-Tareas')];
  const pendientesCount = arrayLista.filter(tarea => {
    const check = tarea.querySelector('input[type="checkbox"]');
    return !check.checked;
  }).length;
  totalTareas.textContent = pendientesCount;
}

function guardarTareas() {
  const arrayLista = [...document.querySelectorAll('.class-contenedor-Tareas')];
  const tareas = arrayLista.map(tarea => ({
    texto: tarea.querySelector('span.texto-tarea').textContent,
    completada: tarea.querySelector('input[type="checkbox"]').checked
  }));
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

function cargarTareas() {
  const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
  tareas.forEach(t => crearTarea(t.texto, t.completada));
}

function crearTarea(texto, completada = false) {
  const div = document.createElement('div');
  const contenedorTarea = document.createElement('div');
  const nuevoLi = document.createElement('li');
  const check = document.createElement('input');
  const span = document.createElement('span');
  const btnBorrar = document.createElement('button');
  const etiqueta = document.createElement('span'); 

  // etiqueta
  etiqueta.classList.add('etiqueta-estado');
  etiqueta.textContent = completada ? 'Completada' : 'Pendiente';
  etiqueta.classList.add(completada ? 'etiqueta-completada' : 'etiqueta-pendiente');

  // check
  check.type = 'checkbox';
  check.classList.add('check-externo');
  check.checked = completada;

  // span texto
  span.textContent = texto;
  span.classList.add('texto-tarea');

  if (completada) {
    span.style.textDecoration = 'line-through';
    span.style.opacity = '0.5';
    div.classList.add('li-completada');
  }

  // boton borrar
  btnBorrar.textContent = 'X';
  btnBorrar.classList.add('btn-borrar');
  btnBorrar.addEventListener('click', () => {
    div.remove();
    guardarTareas();
    actualizarContador();
  });

  // edicion inline
  span.addEventListener('dblclick', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.classList.add('editar-tarea');

    nuevoLi.replaceChild(input, span);
    input.focus();

    input.addEventListener('blur', () => {
      span.textContent = input.value || span.textContent;
      nuevoLi.replaceChild(span, input);
      guardarTareas();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') input.blur();
      if (e.key === 'Escape') nuevoLi.replaceChild(span, input);
    });
  });

  // check change
  check.addEventListener('change', () => {
    if (check.checked) {
      span.style.textDecoration = 'line-through';
      span.style.opacity = '0.5';
      div.classList.add('li-completada');
      etiqueta.textContent = 'Completada';
      etiqueta.classList.add('etiqueta-completada');
      etiqueta.classList.remove('etiqueta-pendiente');
    } else {
      span.style.textDecoration = 'none';
      span.style.opacity = '1';
      div.classList.remove('li-completada');
      etiqueta.textContent = 'Pendiente';
      etiqueta.classList.add('etiqueta-pendiente');
      etiqueta.classList.remove('etiqueta-completada');
    }
    guardarTareas();
    actualizarContador();
  });

  // estructura
  nuevoLi.classList.add('li-n');
  div.classList.add('class-contenedor-Tareas');
  contenedorTarea.classList.add('contenedor-fila');

  nuevoLi.appendChild(span);
  contenedorTarea.appendChild(check);
  contenedorTarea.appendChild(nuevoLi);
   contenedorTarea.appendChild(btnBorrar);

  div.appendChild(etiqueta);        
  div.appendChild(contenedorTarea);  
  lista.appendChild(div);
}

agregarMod.addEventListener('click', () => {
  if (ingreso.value.trim() === '') return;
  crearTarea(ingreso.value);
  guardarTareas();
  actualizarContador();
  ingreso.value = '';
  modal.hide();
});

cargarTareas();
actualizarContador();