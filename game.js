// Durabilité initiale des blocs d'or pour chaque base
var goldBlocksDataLeft = [
  { id: 1, durability: 100 },
  { id: 2, durability: 100 },
  { id: 3, durability: 100 },
  { id: 4, durability: 100 },
  { id: 5, durability: 100 }
];

var goldBlocksDataRight = [
  { id: 6, durability: 100 },
  { id: 7, durability: 100 },
  { id: 8, durability: 100 },
  { id: 9, durability: 100 },
  { id: 10, durability: 100 }
];

var currentBase = 'left';

// Position initiale de l'unité mineur
var minerPosition = 0;

// Vitesse de déplacement de l'unité mineur
var minerSpeed = 2;

// Capacité maximale du sac de l'unité mineur
var maxBagCapacity = 3;

// Sac de l'unité mineur
var minerBag = 0;

// Récupération des éléments DOM
var goldCounter = document.getElementById('gold-counter');
var gameContainer = document.getElementById('game-container');

// Initialisation du compteur d'or
var goldEarned = 0;

// Fonction pour mettre à jour le compteur d'or
function updateGoldCounter() {
  goldCounter.textContent = 'Or: ' + goldEarned;
}

// Appel initial pour afficher le compteur d'or
updateGoldCounter();

// Création de l'unité mineur
var miner = document.createElement('div');
miner.className = 'miner';
gameContainer.appendChild(miner);

// Création de l'élément pour afficher la capacité du sac
var capacityText = document.createElement('span');
capacityText.className = 'capacity-text';
capacityText.textContent = minerBag + ' / ' + maxBagCapacity;
miner.appendChild(capacityText);

// Création des conteneurs pour les blocs d'or de chaque base
var goldContainerLeft = document.createElement('div');
goldContainerLeft.className = 'gold-container';
goldContainerLeft.id = 'gold-container-left';

var goldContainerRight = document.createElement('div');
goldContainerRight.className = 'gold-container';
goldContainerRight.id = 'gold-container-right';

gameContainer.appendChild(goldContainerLeft);
gameContainer.appendChild(goldContainerRight);

// Création d'un élément block d'or
var style = document.createElement('style');
style.innerHTML = `
  /* Appliquer les styles aux blocs d'or */
  .gold-block {
    width: 22px; /* Largeur de chaque bloc d'or */
    height: 22px; /* Hauteur de chaque bloc d'or */
    background-color: gold; /* Couleur jaune */
  }

  .durability-text {
    position: flex;
    top: -15px;
    left: 30%;
    transform: translateX(-50%);
    font-size: 11px;
    color: black;
  }
`;

document.head.appendChild(style);

function createGoldBlocks(base, goldBlocksData) {
  var goldContainer = document.getElementById('gold-container-' + base);
  goldContainer.innerHTML = '';

  goldBlocksData.forEach(function (goldBlockData) {
    var goldBlock = document.createElement('div');
    goldBlock.className = 'gold-block';
    goldBlock.dataset.id = goldBlockData.id;
    goldBlock.dataset.durability = goldBlockData.durability;
    goldBlock.style.marginRight = '15px'; // Ajouter une marge entre les blocs d'or

    var durabilityText = document.createElement('span');
    durabilityText.className = 'durability-text';
    durabilityText.textContent = goldBlockData.durability + '%';

    goldBlock.appendChild(durabilityText);
    goldContainer.appendChild(goldBlock);
  });
}


// Appel de la fonction pour créer les blocs d'or pour chaque base
createGoldBlocks('left', goldBlocksDataLeft);
createGoldBlocks('right', goldBlocksDataRight);


// Sélectionner tous les blocs d'or
var goldBlocks = document.querySelectorAll('.gold-block');

// Fonction pour rendre le bloc d'or transparent
function makeGoldBlockTransparent(block) {
  block.classList.add('transparent');
}

function updateDurabilityText(block, durability) {
  var durabilityText = block.querySelector('.durability-text');
  durabilityText.textContent = durability + '%';
}

// Fonction pour mettre à jour la couleur du bloc d'or en fonction de sa durabilité
function updateGoldBlockColor(block, durability) {
  var transparency = 1 - (durability / 100);
  block.style.backgroundColor = 'rgba(255, 215, 0, ' + transparency + ')';
}

function collectGold(block) {
  if (block.dataset.durability <= 0) {
    makeGoldBlockTransparent(block);
    return;
  }

  var durability = parseInt(block.dataset.durability);

  // Réduire la durabilité du bloc d'or en fonction de la capacité du sac
  var durabilityReduction = Math.ceil(durability / maxBagCapacity);
  block.dataset.durability = durability - durabilityReduction;

  // Mettre à jour la couleur du bloc d'or
  updateGoldBlockColor(block, block.dataset.durability);

  // Mettre à jour le pourcentage de durabilité du bloc d'or
  updateDurabilityText(block, block.dataset.durability);

  minerBag += 1;

  // Vider le sac de l'unité mineur à la base
  if (minerBag === maxBagCapacity) {
    goldEarned += maxBagCapacity * 25;
    updateGoldCounter();
    minerBag = 0;

    // Enregistrer la dernière position du mineur avant de vider le sac
    lastMinerPosition = minerPosition;

    // Ne pas déplacer le mineur après avoir collecté de l'or
    return;
  }
}

// Appliquer le style à l'unité mineur
miner.style.width = '20px';
miner.style.height = '20px';
miner.style.backgroundColor = 'red';
miner.style.position = 'absolute';
miner.style.bottom = 'calc(2/7 * 100vh)';
miner.style.transition = 'left 0.1s linear';

var lastMinerPosition = 0; // Dernière position du mineur avant de vider le sac

function moveMiner() {
  if (Array.from(goldBlocks).every(function (block) { return block.dataset.durability <= 0; })) {
    // Tous les blocs d'or ont été collectés ou leur durabilité est épuisée
    // Implémenter une logique de fin de jeu ici si nécessaire
    return;
  }

  var baseGoldBlocks = document.querySelectorAll('#gold-container-' + currentBase + ' .gold-block');

  if (minerPosition < baseGoldBlocks.length * 100) {
    var goldBlock = baseGoldBlocks[minerPosition / 100];
    collectGold(goldBlock);

    if (goldBlock.dataset.durability <= 0) {
      // Le bloc d'or courant est épuisé, trouver un nouveau bloc d'or cible
      var nextGoldBlock = Array.from(baseGoldBlocks).find(function (block) { return block.dataset.durability > 0; });

      if (nextGoldBlock) {
        // Déplacer le mineur vers le nouveau bloc d'or cible
        var index = Array.from(baseGoldBlocks).indexOf(nextGoldBlock);
        minerPosition = index * 100;
        miner.style.left = minerPosition + 'px';
      }
    } else {
      // Revenir à la position initiale
      minerPosition = 0;
      miner.style.left = minerPosition + 'px';
    }
  } else {
    if (minerBag === maxBagCapacity) {
      // Le sac de l'unité mineur est plein, retourner à la base pour vider le sac
      minerPosition = 0;
      miner.style.left = minerPosition + 'px';

      setTimeout(function () {
        goldEarned += maxBagCapacity * 25;
        updateGoldCounter();
        minerBag = 0;
        moveMiner(); // Continuer le déplacement après avoir vidé le sac
      }, 1000);

      return;
    }
  }

  // Mettre à jour la capacité du sac dans le mineur
  capacityText.textContent = minerBag + ' / ' + maxBagCapacity;
  requestAnimationFrame(moveMiner);
}

// Appeler la fonction moveMiner() pour démarrer le déplacement de l'unité mineur
moveMiner();
