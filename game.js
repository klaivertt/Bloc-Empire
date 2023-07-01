// Durabilité de l'or
var goldDurability = 100;

// Position initiale de l'unité mineur
var minerPosition = 0;

// Vitesse de déplacement de l'unité mineur
var minerSpeed = 2;

// Capacité maximale du sac de l'unité mineur
var maxBagCapacity = 5;

// Sac de l'unité mineur
var minerBag = 0;

// Récupération des éléments DOM
var goldCounter = document.getElementById('gold-counter');
var gameContainer = document.getElementById('game-container');

// Initialisation du compteur d'or
goldCounter.textContent = 'Or : 0';

// Création de l'unité mineur
var miner = document.createElement('div');
miner.className = 'miner';
gameContainer.appendChild(miner);

// Fonction de déplacement de l'unité mineur
function moveMiner() {
  // Vérifier si la durabilité de l'or est épuisée
  if (goldDurability <= 0) {
    return;
  }

  // Déplacer l'unité mineur vers l'or
  if (minerPosition < 100) {
    minerPosition += minerSpeed;
    miner.style.left = minerPosition + 'px';
  } else {
    // Le sac de l'unité mineur est plein
    goldDurability--;
    minerBag++;

    // Vider le sac de l'unité mineur à la base
    if (minerBag === maxBagCapacity) {
      goldCounter.textContent = 'Or : ' + (parseInt(goldCounter.textContent.split(' ')[2]) + 50);
      minerBag = 0;
    }

    // Revenir à la position initiale
    minerPosition = 0;
    miner.style.left = minerPosition + 'px';
  }

  // Appeler la fonction moveMiner() à nouveau après un délai de 10 millisecondes
  setTimeout(moveMiner, 10);
}

// Appliquer le style à l'unité mineur
miner.style.width = '10px';
miner.style.height = '20px';
miner.style.backgroundColor = 'red';
miner.style.position = 'absolute';
miner.style.bottom = 'calc(2/7 * 100vh)';
miner.style.transition = 'left 0.1s linear';

// Appeler la fonction moveMiner() pour démarrer le déplacement de l'unité mineur
moveMiner();
