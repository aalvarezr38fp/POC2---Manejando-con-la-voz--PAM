// vista.js
class Vista {
    constructor() {
        this.imgCoche = new Image();
        this.imgCoche.src = './img/coche.png';
        this.imgEstrella = new Image();
        this.imgEstrella.src = './img/estrella.svg';
        this.imgRueda = new Image();
        this.imgRueda.src = './img/rueda.png';
        this.imgLata = new Image();
        this.imgLata.src = './img/lata.png';
        this.imgBarrera = new Image();
        this.imgBarrera.src = './img/barrera.png';
        this.imgFondo = new Image();
        this.imgFondo.src = './img/logo_v_str.png';
        this.imgEstela = new Image();
        this.imgEstela.src = './img/estela.png';
        this.imgAbandono = new Image();
        this.imgAbandono.src = './img/abandono1.jpeg';
        this.imgChoque1 = new Image();
        this.imgChoque1.src = './img/choque1.jpeg';
        this.imgChoque2 = new Image();
        this.imgChoque2.src = './img/choque2.jpeg';
    }

    inicializarVista() {
        this.contenedor = document.getElementById('fondo');
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.spanPuntos = document.querySelector('div#puntos > span');
        this.divNeumaticos = document.querySelector('div#neumaticos > div > div');
        this.divCombustible = document.querySelector('div#combustible > div > div');
        this.divDialogo = document.querySelector('div#dialogo');
        this.canvas.width = this.contenedor.getBoundingClientRect().width;
        this.canvas.height = this.contenedor.getBoundingClientRect().height;
    }

    actualizarVista(modelo) {
        this.spanPuntos.textContent = `${modelo.puntos} `;
        this.divNeumaticos.style.marginRight = `${100 - Math.round(modelo.neumaticos)}%`;
        this.divCombustible.style.marginRight = `${100 - Math.round(modelo.combustible)}%`;
    }

    dibujar(modelo) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.imgFondo, this.canvas.width / 2 - 200, this.canvas.height / 2 - 200 * 1885 / 1850, 400, 400 * 1885 / 1850);
        this.ctx.drawImage(this.imgEstrella, modelo.estrella.x * modelo.lado, modelo.estrella.y * modelo.lado, modelo.lado, modelo.lado);
        modelo.barreras.forEach(barrera => {
            this.ctx.drawImage(this.imgBarrera, barrera.x * modelo.lado, barrera.y * modelo.lado, modelo.lado, modelo.lado);
        });
        this.ctx.drawImage(this.imgRueda, modelo.rueda.x * modelo.lado, modelo.rueda.y * modelo.lado, modelo.lado, modelo.lado);
        this.ctx.drawImage(this.imgLata, modelo.lata.x * modelo.lado, modelo.lata.y * modelo.lado, modelo.lado, modelo.lado);
        modelo.cabeza.estela.forEach(estela => {
            this.ctx.drawImage(this.imgEstrella, estela[0] * modelo.lado, estela[1] * modelo.lado, modelo.lado * 0.8, modelo.lado * 0.8);
        });
        const centroGiro = [modelo.cabeza.posX + modelo.lado / 2, modelo.cabeza.posY + modelo.lado / 2];
        this.ctx.translate(centroGiro[0], centroGiro[1]);
        const anguloGiro = (modelo.cabeza.dir - 1) * 90;
        this.ctx.rotate((anguloGiro * Math.PI) / 180);
        this.ctx.drawImage(this.imgCoche, -modelo.lado / 2, -modelo.lado / 2, modelo.lado, modelo.lado);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    mostrarDialogo(tipo, imgSrc, texto) {
        const img = document.getElementById('imgFinal');
        const divTexto = this.divDialogo.querySelectorAll('div')[2];
        img.src = imgSrc;
        divTexto.textContent = texto;
        this.divDialogo.style.display = 'block';
    
        // Llamada a la lectura en voz alta desde la vista
        this.hablarTexto(texto);
    }

    hablarTexto(texto) {
        try {
            // Crea una instancia de SpeechSynthesisUtterance con el texto
            const mensaje = new SpeechSynthesisUtterance(texto);
            mensaje.lang = 'es-ES'; // Configura el idioma a español
            mensaje.volume = 1; // Volumen (0 a 1)
            mensaje.rate = 1; // Velocidad (0.1 a 10)
            mensaje.pitch = 1; // Tono (0 a 2)
            console.log("Hablando:", texto);

            // Usa la API de SpeechSynthesis para hablar el mensaje
            window.speechSynthesis.speak(mensaje);
        } catch (error) {
            console.error("Error al intentar hablar el texto:", error);
        }
    }
}