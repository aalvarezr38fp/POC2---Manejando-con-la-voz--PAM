// modelo.js
class Modelo {
    constructor() {
        this.barreras = [];
        this.puntos = 0;
        this.neumaticos = 100;
        this.combustible = 100;
        this.ancho = 15;
        this.alto = 10;
        this.lado = 60;
        this.vel = 10;
        this.cabeza = {
            x: parseInt(this.ancho / 2),
            y: parseInt(this.alto / 2),
            dir: 1,
            giro: 1,
            vel: 2,
            posX: null,
            posY: null,
            estela: []
        };
        this.cabeza.posX = this.cabeza.x * this.lado;
        this.cabeza.posY = this.cabeza.y * this.lado;
        this.estrella = { x: null, y: null };
        this.rueda = { x: null, y: null };
        this.lata = { x: null, y: null };
    }

    incrementarPuntos() {
        this.puntos++;
    }

    decrementarNeumaticos() {
        this.neumaticos--;
    }

    decrementarCombustible() {
        this.combustible--;
    }

    crearObjeto(objeto) {
        let x, y, flagOcupado = false;
        do {
            x = parseInt(Math.random() * this.ancho);
            y = parseInt(Math.random() * this.alto);
            flagOcupado = (x === this.cabeza.x && y === this.cabeza.y);
            this.barreras.forEach(barrera => {
                flagOcupado ||= (x === barrera.x && y === barrera.y);
            });
        } while (flagOcupado);
        objeto.x = x;
        objeto.y = y;
    }

    verificarColision(objeto) {
        return this.cabeza.x === objeto.x && this.cabeza.y === objeto.y;
    }

    moverCabeza() {
        switch (this.cabeza.dir) {
            case 0: // Arriba
                this.cabeza.y = (this.cabeza.y - 1 + this.alto) % this.alto;
                break;
            case 1: // Derecha
                this.cabeza.x = (this.cabeza.x + 1) % this.ancho;
                break;
            case 2: // Abajo
                this.cabeza.y = (this.cabeza.y + 1) % this.alto;
                break;
            case 3: // Izquierda
                this.cabeza.x = (this.cabeza.x - 1 + this.ancho) % this.ancho;
                break;
        }
    }
}