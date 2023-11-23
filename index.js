let canvas = document.querySelector("#canvas");
// Re-affectation du ratio canvas => css
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

// Score
let score = 0;

// Nombres de vies
let lives = 3;

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
        bricks[c][r] = {x: 0, y: 0, status: 1}; 
    };  
};

// Récupération du contexte 2d pour pouvoir dessiner dans le navigateur
let ctx = canvas.getContext("2d");

// Ecoute d'évênements sur les touches left et right
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Ecoute mouvements souris
document.addEventListener("mousemove", mouseMoveHandler, false);

// Fonction mouvement souris
function mouseMoveHandler (e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    };
};

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
    };
};


function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {  
        for (let r = 0; r < brickRowCount; r++) {  
            let b = bricks[c][r]; 
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickColumnCount * brickRowCount) {
                        alert("Bravo, c'est gagné !");
                        document.location.reload();
                        // clearInterval(interval);
                    };
                };
            };
        };  
    };
};


// Dessin texte du score (nombre briques cassées)
function drawScore () {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
};


// Dessin texte du nombre de vies restantes
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives :" + lives, canvas.width - 65, 20);
};


//fonction dessin briques
function drawBrick () {
    // Parcours tableau multi-dimensionnel
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) { 
            if (bricks[c][r].status === 1) {
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
};

// Fonction dessin paddle
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
       drawScore();
       drawLives();
       collisionDetection();
       drawBrick();

       // rebond haut et rebond bas
       if (y + dy < ballRadius) {
        dy = -dy;
       } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy; // inversion direction balle
            } else {
                lives--;
                if (lives === 0) {   // !lives => lives === 0   // si nombre de vies = à zéro
                    // fin de partie à optimiser !!
                    alert("GAME OVER !");
                    document.location.reload();
                    // clearInterval(interval); // chrome
                } else {
                    // Réinitialisation des positions canvas
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    // direction balle
                    dx = 2;
                    dy = -2;
                    // Re-positionnement du paddle
                    paddleX = (canvas.width - paddleWidth) / 2;
                };
                
            };
        };
        

       // rebond gauche et droit
       if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
       };

       if (rightPressed) {
        paddleX += 7;
            if (paddleX + paddleWidth > canvas.width) { // détection bord droit => arrêt paddle
                paddleX = canvas.width - paddleWidth;
            }
       } else if (leftPressed) {  // détection bord gauche => arrêt paddle
        paddleX -= 7;
            if (paddleX < 0) {
                paddleX = 0;
            };
       };

        x += dx; // x = x + dx;
        y += dy;
        // console.log(x);
    };
    requestAnimationFrame(draw); // 60fps
};

// let interval = setInterval(draw, 20);

draw();