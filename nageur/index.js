//attente du chargement de la page
document.addEventListener('DOMContentLoaded', () => {

    //récupération des éléments
    let canvas = document.getElementById('canvas');
    let canvasLife = document.getElementById('canvasLife');
    let bouton = document.getElementById('bouton_play');

    let secondes = 0;
    let minutes = 0;
    let on = false;
    //barre de vie
    let life = 200;

    //détermine l'id du joueur au départ de la partie..
    let idPlayer = Date.now()
        //plus un bouléen à false car l'id n'existe pas encore dans les scores
    let idExist = false

    //tableau des scores
    let scores = [];
    let minuts = document.getElementById('minuts');
    let seconds = document.getElementById('seconds');

    let bande_son = new Audio("sons/bande_son.mp3");

    //tableau contenant toutes les méduses
    let meduses = [];
    //tableau contenant tous les requins 
    let requins = [];
    //tableau contenant les tirs
    let tirs = [];

    //dimensions des éléments
    longueur_bateau = 50;
    hauteur_bateau = 35;
    longueur_requin = 100;
    hauteur_requin = 50;
    longueur_meduse = 30;
    hauteur_meduse = 40;

    //contexte du canvas en 2D
    let ctx = canvas.getContext('2d');
    let ctxLife = canvasLife.getContext('2d');

    //barre de vie pleine
    drawLine(ctxLife, 0, 0, life, 0, 20, "red")

    //couleurs
    canvasLife.style.border = "1px solid green";
    canvas.style.backgroundColor = "#369EC1"; //couleur background color du canvas

    //compteur de temps pour dessiner les obstacles
    let compteur = 0;

    let bateau = new protagoniste(10, 300, hauteur_bateau, longueur_bateau);

    /***************************
     * affichages des éléments *
     **************************/

    function dessine_thomas() {
        let image_thomas = new Image(longueur_bateau, hauteur_bateau);
        image_thomas.src = "images/thomas-jet.png";
        ctx.drawImage(image_thomas, bateau.x, bateau.y);
    }
    dessine_thomas(); //dessine Thomas dès le début

    function affiche_requins() {
        requins.forEach(requin => {
            let image_requin = new Image(longueur_requin, hauteur_requin); //créer une nouvelle image
            image_requin.src = "images/requin2.png"; //récupère l'image

            ctx.drawImage(image_requin, requin.x, requin.y); //dessine l'image aux coordonnées voulues
        });
    }

    function affiche_meduse() {
        meduses.forEach(meduse => {
            let image_meduse = new Image(longueur_meduse, hauteur_meduse);
            image_meduse.src = "images/meduse.png";

            ctx.drawImage(image_meduse, meduse.x, meduse.y);
        });
    }

    function affiche_tir() {
        tirs.forEach(tir => {
            ctx.beginPath();
            ctx.fillRect(tir.x, tir.y, tir.longueur, tir.hauteur);
            ctx.fillStyle = 'white';

        });
    }

    //dessine tous les éléments du canvas
    function dessineTout() {
        ctx.clearRect(0, 0, 1280, 720); //efface tout le canvas avant de redessiner
        compteur += 1; //incrémente le compteur pour ajouter des obstacles
        if ((compteur % 200) === 0 || compteur === 1) {
            ajoute_requin();
            ajoute_meduse();
        }
        requins.forEach(requin => {
            requin.x -= 1;
            affiche_requins();
        });
        meduses.forEach(meduse => {
            meduse.y += 1;
            meduse.x -= 1;
            affiche_meduse();
        });
        tirs.forEach(tir => {
            tir.x += 1;
            affiche_tir();
        });
        dessine_thomas();
        verifie_collisions();
        verifie_tirs();
    }

    /*************************
     * actions et mouvements *
     ************************/

    //mouvement du bateau de Thomas
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case "ArrowUp":
                bateau.y -= 10;
                if (bateau.y < 0) {
                    bateau.y = 0;
                }
                break;
            case "ArrowLeft":
                bateau.x -= 10;
                if (bateau.x < 0) {
                    bateau.x = 0;
                }
                break;
            case "ArrowRight":
                bateau.x += 10;
                if (bateau.x > 1150) {
                    bateau.x = 1150;
                }
                break;
            case "ArrowDown":
                bateau.y += 10;
                if (bateau.y > 580) {
                    bateau.y = 580;
                }
                break;
            case " ": //barre d'espace pour les tirs
                ajoute_tir();
                break;
        }
    });

    /**********************
     * ajout des éléments *
     *********************/

    //ajoute un tir au tableau avec les coordonnées du bateau
    function ajoute_tir() {
        let tir = new protagoniste(bateau.x + longueur_bateau, bateau.y + (hauteur_bateau / 2), 2, 10);
        tirs.push(tir);

    }

    //ajoute un requin au tableau avec les ordonnées du bateau
    function ajoute_requin() {
        requins.push(
            requin = new protagoniste(1200, bateau.y, hauteur_requin, longueur_requin)
        );
    }

    //ajiute une meduse au tableau de méduses
    function ajoute_meduse() {
        meduses.push(
            meduse = new protagoniste(bateau.x + 600, 0, hauteur_meduse, longueur_meduse)
        );
    }

    /********************
     * démarrage du jeu *
     *******************/

    //déclenche l'animation
    function demarre() {

        d = setInterval(dessineTout, 20);
        d;
        //démarre le chrono
        start();
        bande_son.play();
    }

    bouton.addEventListener('click', () => {
        demarre();
    });




    /*****************
     * vérifications *
     ****************/

    function verifie_collisions() {
        //avec les requins
        verifie_collision(requins);
        //avec les méduses
        verifie_collision(meduses);
    }

    function verifie_tirs() {
        //avec les requins
        verifie_impact(requins);
        //avec les meduses
        verifie_impact(meduses);
    }

    function verifie_collision(obstacles) {
        compteur_x = 0;
        compteur_y = 0;
        //pour chaque obstacle
        obstacles.forEach(obstacle => {
            //si les coordonnées de l'aire du bateau est égale à celle d'un obstacle
            if (bateau.x >= obstacle.x && bateau.x <= obstacle.x + obstacle.longueur) {
                compteur_x++;
            }
            if (bateau.x + longueur_bateau >= obstacle.x && bateau.x <= obstacle.x + obstacle.longueur) {
                compteur_x++;
            }
            if (bateau.y >= obstacle.y && bateau.y <= obstacle.y + obstacle.hauteur) {
                compteur_y++;
            }
            if (bateau.y + hauteur_bateau >= obstacle.y && bateau.y + hauteur_bateau <= obstacle.y + obstacle.hauteur) {
                compteur_y++;
            }
            if (compteur_x > 0 && compteur_y > 0) {

                console.log(life)

                //la collision baisse la barre de vie
                if (life > 0) {
                    life -= 1
                        //barre de vie redessinée
                    drawLine(ctxLife, 0, 0, life, 0, 20, "red")
                }
                //si la barre est à 0..
                if (life <= 0) {
                    //stoppe le chrono 
                    stop();
                    clearInterval(d); //stoppe la boucle du temps 
                    bande_son.pause();
                }
            } else {
                compteur_x = 0;
                compteur_y = 0;
                return false;
            }
        });
    }

    function verifie_impact(obstacles) {
        obstacles.forEach(element => {
            tirs.forEach(tir => {
                if (tir.x + tir.longueur >= element.x &&
                    tir.x + tir.longueur <= element.x + element.longueur &&
                    tir.y > element.y &&
                    tir.y < element.y + element.hauteur &&
                    tir.y + tir.hauteur > element.y &&
                    tir.y + tir.hauteur < element.y + element.hauteur
                ) {
                    console.log('ok')
                    obstacles = obstacles.filter(e => e !== element);
                }
            });
        });
    }

    //------------timer------------------

    let timer = document.getElementById('timer');

    function chrono() {
        secondes += 1;

        if (secondes > 59) {
            minutes += 1;
            secondes = 0;
        }

        if (minutes < 10 && secondes < 10) {
            minutes.textContent = "0" + minutes;
            secondes.textContent = "0" + secondes;
        } else if (minutes < 10 && secondes >= 10) {
            minutes.textContent = "0" + minutes;
            secondes.textContent = secondes;
        } else if (minutes >= 10 && secondes < 10) {
            minutes.textContent = minutes;
            secondes.textContent = "0" + secondes;
        } else if (minutes >= 10 && secondes > 10) {
            minutes.textContent = minutes;
            secondes.textContent = secondes;
        }

    }

    function start() {
        if (on === false) {
            timerID = setInterval(chrono, 1000);
            on = true;
            reset = false;
        }
    }

    function stop() {
        if (on === true) {
            on = false;
            clearTimeout(timerID);
        }
    }

    //----------------Life-------------------------------------
    //pour tracer la barre de vie
    function drawLine(ctx, x1, y1, x2, y2, lineWidth, color) {
        ctx.clearRect(0, 0, 200, 10);
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = color
        ctx.stroke()
    }

    //------------Hight-Score----------------------------------

    //TODO : Rajouter la demande du nom joueur pour le récupérer dans la création prototype
    function verifyScore() {
        let totalScore = calculScore()

        console.log(idPlayer)
            //si la clé higth_scores existe
        if (JSON.parse(localStorage.getItem("higth_scores"))) {
            //convertion du fichier JSON
            let scoresView = JSON.parse(localStorage.getItem("higth_scores"))

            //vérification si l'idJoueur existe déjà
            if ((playerRow = scoresView.find((row) => row.id === idPlayer))) {
                idExist = true;
            }
            //si l'id n'existe pas déjà alors on rajoute au tableau des scores
            if (!idExist) {
                scoresView.push(
                    scoreJoueur = new HightScore(idPlayer, "abc", totalScore)
                )
            }
            //classement des scores
            scoresView.sort(function(a, b) {
                return a.score - b.score;
            }).reverse()

            //pas plus de 10 scores possibles sur le tableau
            if (scoresView.length > 10) {
                scoresView.pop();
            }
            //et reconversion en JSON pour intégrer le localStorage
            let scoresJSON = JSON.stringify(scoresView)

            return localStorage.setItem("higth_scores", scoresJSON);

            //si la clé n'existe pas
        } else {
            scores.push(
                scoreJ = new HightScore(idPlayer, "abc", totalScore)
            )
            let scoresJSON = JSON.stringify(scores)

            return localStorage.setItem("higth_scores", scoresJSON);
        }

    }

    //(à décommenter pour vider le localStorage pour les tests)
    //localStorage.clear()

    //fonction de calcul des scores PROVISOIRE (le temps pour terminer devrait être
    //un malus plutôt qu'un bonus)
    function calculScore() {
        //conversion des minutes en secondes
        let m = parseInt(minuts.textContent * 60)
            //récupération des secondes
        let s = parseInt(seconds.textContent)
            //calcul des deux
        return m + s
    }

});



class protagoniste {
    constructor(x, y, hauteur, longueur) {
        this.x = x;
        this.y = y;
        this.hauteur = hauteur;
        this.longueur = longueur;
    }
}