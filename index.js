let canvas = document.querySelector("#canvas");
// Re-affectation du ratio canvas => css
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

// optimisation dimensions briques
// Préparation variables
// Briques
let brickRowCount = 3; // Nombre lignes
let brickColumnCount = 5; // Nombre colonnes
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// Paddle
let paddleHeight = 10;
let paddleWidth = 70;
let paddleX = (canvas.width - paddleWidth) / 2; // Position paddle

// Position calculée en 2 variables pour les traitements futurs
let x = canvas.width / 2;
let y = canvas.height - 30;

// Vélocité (Velocity)
let dx = 2;
let dy = -2;

// Balle
let ballRadius = 10; // rayon
// Détection des appuis touches droite et gauche
let rightPressed = false; 
let leftPressed = false;

// Tableau pour création et dessin des briques futures
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {  // c => column
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {  // r => row
        bricks[c][r] = {x:0, y:0}; 
    };  
};

// Récupération du contexte 2d pour pouvoir dessiner dans le navigateur
let ctx = canvas.getContext("2d");

// Ecoute d'évênements sur les touches left et right
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// fonction appuis touche
function keyDownHandler(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        rightPressed = true;
    } else if (e.key === "ArrowLeft" || e.key === "Left") {
        leftPressed = true;
    }
};

// fonction touche relevée
function keyUpHandler(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        rightPressed = false;
    } else if (e.key === "ArrowLeft" || e.key === "Left") {
        leftPressed = false;
    }
};

//fonction dessin briques
function drawBrick () {
    // Parcours tableau multi-dimensionnel
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) { 
            // Calcul position pour chaque brique
            let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            // Stockage position pour traitement collision futures
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            // Dessin briques à chaque itération (x15 pour nous)
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        };  
    };
};

// Fonction dessin padle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};

// Fonction dessin balle
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};

// Foncion dessin principal (canvas) à chaque frame
function draw() {
    // votre code
    if (canvas.getContext) { // vérification présence du contexte
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       drawBall(); // callback 
       drawPaddle();
       drawBrick();

       // rebond haut et rebond bas
       if (y + dy < ballRadius) {
        dy = -dy;
       } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                    // à optimiser !!
                alert("GAME OVER !");
                document.location.reload();
                clearInterval(interval); // chrome
            }
        }
        

       // rebond gauche et droit
       if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
       }

       if (rightPressed) {
        paddleX += 7;
            if (paddleX + paddleWidth > canvas.width) { // détection bord droit => arrêt paddle
                paddleX = canvas.width - paddleWidth;
            }
       } else if (leftPressed) {  // détection bord gauche => arrêt paddle
        paddleX -= 7;
            if (paddleX < 0) {
                paddleX = 0;
            }
       }

        x += dx; // x = x + dx;
        y += dy;
        // console.log(x);
    }
};

let interval = setInterval(draw, 60);