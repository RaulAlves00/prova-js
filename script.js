const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const larguraRaquete = 75, alturaRaquete = 10;
let xRaquete = (canvas.width - larguraRaquete) / 1;
let direitaPressionada = false, esquerdaPressionada = false;

let xBola = canvas.width / 2, yBola = canvas.height - 30;
let dx = 2, dy = -2, raioBola = 10;

const linhaBlocos = 3, colunaBlocos = 5;
const larguraBloco = 75, alturaBloco = 20;
const espacamentoBloco = 10, margemTopo = 30, margemEsquerda = 30;
let blocos = Array.from({ length: colunaBlocos }, () =>
    Array.from({ length: linhaBlocos }, () => ({ status: 1 })));

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") direitaPressionada = true;
    if (e.key === "ArrowLeft") esquerdaPressionada = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") direitaPressionada = false;
    if (e.key === "ArrowLeft") esquerdaPressionada = false;
});

function desenhaBola() {
    ctx.beginPath();
    ctx.arc(xBola, yBola, raioBola, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function desenhaRaquete() {
    ctx.fillStyle = "blue";
    ctx.fillRect(xRaquete, canvas.height - alturaRaquete, larguraRaquete, alturaRaquete);
}

function desenhaBlocos() {
    ctx.fillStyle = "green";
    blocos.forEach((coluna, c) => {
        coluna.forEach((bloco, r) => {
            if (bloco.status) {
                let x = c * (larguraBloco + espacamentoBloco) + margemEsquerda;
                let y = r * (alturaBloco + espacamentoBloco) + margemTopo;
                bloco.x = x; bloco.y = y;
                ctx.fillRect(x, y, larguraBloco, alturaBloco);
            }
        });
    });
}

function verificaColisao() {
    blocos.forEach((coluna) => {
        coluna.forEach((bloco) => {
            if (bloco.status && xBola > bloco.x && xBola < bloco.x + larguraBloco && yBola > bloco.y && yBola < bloco.y + alturaBloco) {
                dy = -dy;
                bloco.status = 0;
            }
        });
    });
}

function atualizaJogo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenhaBlocos();
    desenhaBola();
    desenhaRaquete();
    verificaColisao();

    if (xBola + dx > canvas.width - raioBola || xBola + dx < raioBola) dx = -dx;
    if (yBola + dy < raioBola) dy = -dy;
    else if (yBola + dy > canvas.height - raioBola) {
        if (xBola > xRaquete && xBola < xRaquete + larguraRaquete) dy = -dy;
        else document.location.reload();
    }

    if (direitaPressionada && xRaquete < canvas.width - larguraRaquete) xRaquete += 7;
    if (esquerdaPressionada && xRaquete > 0) xRaquete -= 7;

    xBola += dx;
    yBola += dy;
    requestAnimationFrame(atualizaJogo);
}

atualizaJogo();
