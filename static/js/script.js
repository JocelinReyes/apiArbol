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

            // Mostrar únicamente las salidas de tipo imagen
            data.forEach(cell => {
                if (cell.tipo === 'código') {
                    cell.salidas
                        .filter(salida => salida.tipo === 'imagen') // Filtrar solo imágenes
                        .forEach(salida => {
                            const imgElement = document.createElement('img');
                            imgElement.src = `data:image/png;base64,${salida.contenido}`;
                            imgElement.alt = 'Imagen de salida';
                            contentDiv.appendChild(imgElement);
                        });
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener el contenido del notebook:', error);
        });
}
