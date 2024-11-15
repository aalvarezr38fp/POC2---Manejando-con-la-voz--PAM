// controlador.js
import * as voz from './controladorVoz.js';

class Controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.vista.inicializarVista();
        this.vista.actualizarVista(this.modelo);
        this.vista.dibujar(this.modelo);
        this.iniciarJuego();
    }

    iniciarJuego() {
        // Detiene cualquier mensaje de voz en curso al iniciar o reiniciar la partida
        window.speechSynthesis.cancel(); 
        this.modelo.crearObjeto(this.modelo.estrella);
        this.modelo.crearObjeto(this.modelo.rueda);
        this.modelo.crearObjeto(this.modelo.lata);
        document.addEventListener('keydown', this.teclaPulsada);
        this.interval = setInterval(this.actualizar, this.modelo.vel);
        this.bucle();
        console.log(typeof voz.configurarReconocimientoVoz); // Verificar si la función está definida
        if (typeof voz.configurarReconocimientoVoz === 'function') {
            voz.configurarReconocimientoVoz(this); // Inicializa el reconocimiento de voz
        } else {
            console.error("configurarReconocimientoVoz no está definida");
        }
    }

    teclaPulsada = (evento) => {
        const key = evento.key.toLowerCase();
        const keys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
        if (!keys.includes(key)) return;
        if (key === keys[0] && this.modelo.cabeza.dir !== 2)
            this.modelo.cabeza.giro = 0;
        else if (key === keys[1] && this.modelo.cabeza.dir !== 0)
            this.modelo.cabeza.giro = 2;
        else if (key === keys[2] && this.modelo.cabeza.dir !== 1)
            this.modelo.cabeza.giro = 3;
        else if (key === keys[3] && this.modelo.cabeza.dir !== 3)
            this.modelo.cabeza.giro = 1;
        evento.preventDefault();
    }

    actualizar = () => {
        const x = Math.round(this.modelo.cabeza.posX / this.modelo.lado);
        const y = Math.round(this.modelo.cabeza.posY / this.modelo.lado);
        if (x === this.modelo.estrella.x && y === this.modelo.estrella.y) {
            this.modelo.cabeza.estela.push([x, y, this.modelo.cabeza.dir]);
            this.modelo.incrementarPuntos();
            this.modelo.crearObjeto(this.modelo.estrella);
            const barrera = { x: null, y: null };
            this.modelo.barreras.push(barrera);
            this.modelo.crearObjeto(barrera);
            this.hablarTexto("¡Has recogido una estrella! Puntos incrementados.");
        }
        this.modelo.barreras.forEach(barrera => {
            if (x === barrera.x && y === barrera.y)
                this.finalizarJuego(1);
        });
        if (x < 0 || y < 0 || x >= this.modelo.ancho || y >= this.modelo.alto)
            this.finalizarJuego(0);
        if (x === this.modelo.rueda.x && y === this.modelo.rueda.y) {
            this.modelo.neumaticos = 100;
            this.modelo.crearObjeto(this.modelo.rueda);
            this.hablarTexto("Has recogido una rueda. Neumáticos incrementados.");
        }
        if (x === this.modelo.lata.x && y === this.modelo.lata.y) {
            this.modelo.combustible = 100;
            this.modelo.crearObjeto(this.modelo.lata);
            this.hablarTexto("Has recogido una lata. Combustible incrementado.");
        }
        this.modelo.neumaticos -= this.modelo.vel / 1000 * 3;
        this.modelo.combustible -= this.modelo.vel / 1000 * 2;
        if (this.modelo.neumaticos < 0 || this.modelo.combustible < 0)
            this.finalizarJuego(2);
        this.vista.actualizarVista(this.modelo);
        let hemosLlegado = false;
        if (this.modelo.cabeza.dir === 0) {
            this.modelo.cabeza.posY -= this.modelo.cabeza.vel;
            hemosLlegado = this.modelo.cabeza.posY < this.modelo.cabeza.y * this.modelo.lado;
            if (hemosLlegado) this.modelo.cabeza.y--;
        } else if (this.modelo.cabeza.dir === 1) {
            this.modelo.cabeza.posX += this.modelo.cabeza.vel;
            hemosLlegado = this.modelo.cabeza.posX > this.modelo.cabeza.x * this.modelo.lado;
            if (hemosLlegado) this.modelo.cabeza.x++;
        } else if (this.modelo.cabeza.dir === 2) {
            this.modelo.cabeza.posY += this.modelo.cabeza.vel;
            hemosLlegado = this.modelo.cabeza.posY > this.modelo.cabeza.y * this.modelo.lado;
            if (hemosLlegado) this.modelo.cabeza.y++;
        } else if (this.modelo.cabeza.dir === 3) {
            this.modelo.cabeza.posX -= this.modelo.cabeza.vel;
            hemosLlegado = this.modelo.cabeza.posX < this.modelo.cabeza.x * this.modelo.lado;
            if (hemosLlegado) this.modelo.cabeza.x--;
        }
        if (hemosLlegado) {
            this.modelo.cabeza.estela.push([x, y]);
            this.modelo.cabeza.estela.shift();
            if (this.modelo.cabeza.giro !== null) {
                this.modelo.cabeza.dir = this.modelo.cabeza.giro;
                this.modelo.cabeza.giro = null;
            }
        }
    }

    bucle = () => {
        this.vista.dibujar(this.modelo);
        this.animationFrameId = requestAnimationFrame(this.bucle);
    }

    finalizarJuego(tipo) {
        cancelAnimationFrame(this.animationFrameId);
        document.removeEventListener('keydown', this.teclaPulsada);
        clearInterval(this.interval);
        let textoFinal = '';
        let imgSrc = '';
    
        switch (tipo) {
            case 0:
                imgSrc = this.vista.imgChoque1.src;
                textoFinal = 'Pilotar es ir siempre al límite. Lo difícil es saber dónde están tus límites, los de tu coche y los de la pista. Y luego, ampliárlos.';
                break;
            case 1:
                imgSrc = this.vista.imgChoque2.src;
                textoFinal = 'Pilotar es ir siempre al límite. Lo difícil es saber dónde están tus límites, los de tu coche y los de la pista. Y luego, ampliárlos.';
                break;
            case 2:
                imgSrc = this.vista.imgAbandono.src;
                textoFinal = 'La gestión de los neumáticos y del combustible es fundamental para ser un buen piloto. Pilotar no es solo girar y frenar; es sobre todo pensar';
                break;
        }
    
        this.vista.mostrarDialogo(tipo, imgSrc, textoFinal);
        this.hablarTexto(textoFinal); // Confirmar la lectura en voz alta
    }
    

   
} 

// Inicialización del MVC
const modelo = new Modelo();
const vista = new Vista();
const controlador = new Controlador(modelo, vista);