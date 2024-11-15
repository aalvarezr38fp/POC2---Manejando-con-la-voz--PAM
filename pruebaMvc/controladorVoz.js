// controladorVoz.js

export async function configurarReconocimientoVoz(controlador) {
    // Solicitar permisos para el micrófono
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Permiso de micrófono concedido.");
    } catch (error) {
        console.error("No se pudo obtener el permiso del micrófono:", error);
        return;
    }

    // Crear el recognizer usando el modelo base de FFT del navegador
    const recognizer = speechCommands.create('BROWSER_FFT');

    // Cargar el modelo de reconocimiento de palabras básicas
    await recognizer.ensureModelLoaded();
    console.log("Modelo de reconocimiento de voz cargado.");

    // Escuchar continuamente y analizar resultados
    recognizer.listen(result => {
        const scores = result.scores;
        const labels = recognizer.wordLabels();
        const index = scores.indexOf(Math.max(...scores));
        const comando = labels[index];

        // Ejecutar acción basada en el comando de voz
        switch (comando) {
            case 'up':     // Arriba
                controlador.modelo.cabeza.giro = 0;
                console.log("Comando reconocido:", comando);
                break;
            case 'down':   // Abajo
                controlador.modelo.cabeza.giro = 2;
                console.log("Comando reconocido:", comando);
                break;
            case 'left':   // Izquierda
                controlador.modelo.cabeza.giro = 3;
                console.log("Comando reconocido:", comando);
                break;
            case 'right':  // Derecha
                controlador.modelo.cabeza.giro = 1;
                console.log("Comando reconocido:", comando);
                break;
            default:
                console.log("Comando no reconocido:", comando);
        }
    }, {
        probabilityThreshold: 0.75,  // Umbral de confianza
        includeSpectrogram: true,
        overlapFactor: 0.5
    });
}