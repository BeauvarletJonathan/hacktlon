document.addEventListener('DOMContentLoaded', () => {

    /*****************************
     * définitions des variables *
     ****************************/


    //récupération des éléments
    let canvas = document.getElementById('canvas');
    let div_compteur = document.getElementById('compteur_mouettes');

    let marge_canvas = 8; //marge du canvas à soustraire dans les coordonnées des tirs

    let thomas; //photo de Thomas sous forme de class avec ses coordonnées

    let mouettes = []; //tableau contenant les mouettes crées sous forme de class volatiles (avec leurs coordonnées)
    let merdes = []; //tableau contenant les merdes demouettes crées sous forme de class projectiles (avec leurs coordonnées)

    let compteur_mouettes_tuees = 0; //compteur de mouettes tuées

    let longueur_mouette = 60;
    let hauteur_mouette = 28;

    let mouette_intervalle; //contiendra le setIntervalle des déplacements des mouettes
    let mouette_creation_intervalle; //contiendra le setIntervalle des créations des mouettes
    let tombe_merde_intervalle; //contiendra le setIntervalle des déplacements des merdes de mouettes

    div_compteur.innerHTML = compteur_mouettes_tuees; //affichage du nombre de mouettes tuéées

    //sons
    let cri_mouette = new Audio("sons/cri_mouette.wav");
    let pet = new Audio("sons/pet.mp3");
    let tir = new Audio("sons/pistolet.mp3");

    /******************************************
     * définition des couleurs et du contexte *
     *****************************************/


    //contexte 2D
    let ctx = canvas.getContext('2d');

    //change l'aspect du pointeur de la souris
    canvas.style.cursor = "crosshair";

    //image plage sur le background du canvas
    canvas.style.backgroundImage = "url('images/plage_bretonne.jpg')";
    canvas.style.backgroundRepeat = "no-repeat";
    canvas.style.backgroundSize = "cover";

    /*********
     * Thomas*
     ********/

    //insertion de Thomas
    function affiche_thomas() {
        thomas = new personnage(600, 420);

        //affiche l'image de Thomas
        image_thomas = new Image(50, 50);
        image_thomas.src = "images/thomas3.jpg";

        image_thomas.onload = () => {
            ctx.drawImage(image_thomas, 600, 520); //définit la position de l'image
        }
    }

    /**********************************
     * gestion affichage des éléments *
     *********************************/

    //insertions des mouettes
    function creer_une_mouette() {
        //nombre aléatoire entier entre 1 et 300 pour la hauteur
        let y = Math.floor(Math.random() * (300 + 1));
        //créer une nouvelle mouette avec ses coordonnées
        let mouette = new volatile(0, y);
        //pousse dans le tableau contenant les mouettes
        mouettes.push(mouette);

    }

    function affiche_les_mouettes() {
        mouettes.forEach(mouette => {
            let img_mouette = new Image(longueur_mouette, hauteur_mouette);
            img_mouette.src = "images/mouette.jpg";

            ctx.drawImage(img_mouette, mouette.x, mouette.y);
        });
    }

    function affiche_merde() {
        merdes.forEach(merde => {
            merde.y += 5;
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(merde.x, merde.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }


    /**********
     * timers *
     *********/

    function timer_deplace_mouettes() {
        mouette_intervalle = setInterval(bouge_mouettes, 20);
        mouette_intervalle;
    }


    function timer_cree_mouettes() {
        mouette_creation_intervalle = setInterval(creer_une_mouette, 700);
        mouette_creation_intervalle;
    }


    function timer_mouette_chie() {
        tombe_merde_intervalle = setInterval(affiche_merde, 50);
        tombe_merde_intervalle;
    }

    timer_cree_mouettes();
    timer_deplace_mouettes();

    /**************************
     * mouvements des éléments*
     *************************/

    function bouge_mouettes() {
        ctx.clearRect(0, 0, 1250, 600);
        affiche_thomas();
        mouettes.forEach(mouette => {
            mouette.x += 2;
        });
        affiche_les_mouettes();
        verfie_position_mouette();
        verifie_position_merde();
    }

    /*****************
     * vérifications *
     ****************/

    function verfie_position_mouette() {
        mouettes.forEach(mouette => {
            if (mouette.x === 650) {
                let merde = new projectile(mouette.x, mouette.y);
                merdes.push(merde);
                timer_mouette_chie();
                pet.play();
            }
        });
    }

    function verifie_position_merde() {
        merdes.forEach(merde => {
            if (merde.y > thomas.y) {
                clearInterval(mouette_creation_intervalle);
                clearInterval(mouette_intervalle);
                clearInterval(tombe_merde_intervalle);
            }
        });
    }

    function verifie_compteur() {
        if (compteur_mouettes_tuees > 20) {
            clearInterval(mouette_creation_intervalle);
            verifie_tableau_mouettes();
        }
    }

    function verifie_tableau_mouettes() {
        if (mouettes !== null) {
            clearInterval(mouette_intervalle);
        }
    }

    function feu() {
        tir.play();
    }

    function mouette_crie() {
        cri_mouette.play();
    }


    /********************
     * gestion des tirs *
     *******************/

    canvas.addEventListener('click', (e) => {
        //bruitage coup de feu
        feu();

        mouettes.forEach(mouette => {

            //si les coordonnées du tir sont compris dans les coordonnées de l'image de la mouette
            if ((e.clientX - marge_canvas) > (mouette.x) &&
                (e.clientX - marge_canvas) < (mouette.x + longueur_mouette) &&
                (e.clientY - marge_canvas) > (mouette.y) &&
                (e.clientY - marge_canvas) < (mouette.y + hauteur_mouette)
            ) {
                //on sort la mouette du tableau de mouettes
                mouettes = mouettes.filter(m => m !== mouette);
                compteur_mouettes_tuees++;
                div_compteur.innerHTML = compteur_mouettes_tuees;
                verifie_compteur();
                mouette_crie();
            }
        });
    });



});

class volatile {
    constructor(x, y, etat) {
        this.x = x;
        this.y = y;
    }
}

class projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class personnage {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}