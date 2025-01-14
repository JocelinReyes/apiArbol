// Función que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
    fetchNotebooksList();
    fetchTreeImage();
});

// Función para obtener la lista de notebooks desde la API
function fetchNotebooksList() {
    fetch('/documentos')
        .then(response => response.json())
        .then(data => {
            const notebooksList = document.getElementById('notebooks-list');
            notebooksList.innerHTML = ''; // Limpiar la lista antes de agregar los items

            if (data.length === 0) {
                notebooksList.innerHTML = '<li>No se encontraron archivos .ipynb</li>';
                return;
            }

            // Agregar cada archivo a la lista como un enlace
            data.forEach(notebook => {
                const li = document.createElement('li');
                li.textContent = notebook;
                li.style.cursor = 'pointer'; // Cambiar el cursor para indicar que es clicable
                li.onclick = () => fetchNotebookContent(notebook); // Abrir el contenido al hacer clic
                notebooksList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al obtener la lista de notebooks:', error);
        });
}

// Función para obtener el contenido de un notebook
function fetchNotebookContent(notebookName) {
    fetch(`/documentos/contenido/${notebookName}`)
        .then(response => response.json())
        .then(data => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = ''; // Limpiar contenido previo

            // Mostrar únicamente las salidas
            data.forEach(cell => {
                if (cell.tipo === 'código') {
                    const cellDiv = document.createElement('div');

                    // Mostrar las salidas
                    cell.salidas.forEach(salida => {
                        if (salida.tipo === 'texto') {
                            cellDiv.innerHTML += `
                                <strong>Salida (Texto):</strong>
                                <pre>${salida.contenido}</pre>
                            `;
                        } else if (salida.tipo === 'imagen') {
                            cellDiv.innerHTML += `
                                <strong>Salida (Imagen):</strong>
                                <img src="data:image/png;base64,${salida.contenido}" alt="Imagen de salida"/>
                            `;
                        } else if (salida.tipo === 'json') {
                            cellDiv.innerHTML += `
                                <strong>Salida (JSON):</strong>
                                <pre>${JSON.stringify(salida.contenido, null, 2)}</pre>
                            `;
                        } else if (salida.tipo === 'html') {
                            cellDiv.innerHTML += `
                                <strong>Salida (HTML):</strong>
                                <div>${salida.contenido}</div>
                            `;
                        }
                    });

                    contentDiv.appendChild(cellDiv);
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener el contenido del notebook:', error);
        });
}

// Función para obtener y mostrar la última imagen generada del árbol de decisión
function fetchTreeImage() {
    const treeImage = document.getElementById('tree-image'); // Asegúrate de tener un <img id="tree-image">

    fetch('/arbol-visual')
        .then(response => response.json())
        .then(data => {
            if (data.ruta) {
                treeImage.src = `http://127.0.0.1:5000${data.ruta}?t=${new Date().getTime()}`; // Evitar caché
                treeImage.style.display = 'block';
            } else {
                console.error('No se encontró la imagen:', data.mensaje);
                treeImage.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error al obtener la imagen del árbol:', error);
        });
}


