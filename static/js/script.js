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


