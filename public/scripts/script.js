function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('DOMContentLoaded', () => {

    // Ajouter la classe "loaded" au body pour activer les animations
    document.body.classList.add("loaded");

    // Ajouter les nouveau poem depuis /data/poems.json

    fetch('/data/poems.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {

        const slideWrapper = document.querySelector(".swiper-wrapper");
        
        data.poems.forEach(poem => {

            // append option in poemList
            let allOptions = document.querySelectorAll("li[class='sidebar-title-link']");
            let poemList = document.querySelector("#poemList");
            let li = document.createElement("li");

            li.classList.add("sidebar-title-link");
            li.setAttribute("selected", "false");
            li.setAttribute("data-index", parseInt(allOptions[allOptions.length - 1].getAttribute("data-index")) + 1);
            li.setAttribute("data-theme", poem.theme );
            li.innerHTML = (poem.title == undefined || poem.title == "") ? "Pas de titre" : poem.title;
            
            poemList.append(li);


            let poemImg = document.createElement("img");
            let slide = document.createElement("div");
            let poemeContainer = document.createElement("div");
            let slideHeader = document.createElement("h2");
            let poemTextEl = document.createElement("div");
            
            poemTextEl.classList.add("poem-text");
            poemeContainer.classList.add("poem-container")
            slideHeader.innerText = (poem.title == undefined || poem.title == "") ? "Pas de titre" : poem.title;
            console.log(poem.img == undefined);
            poemImg.src = "img/" +  ((poem.img == undefined || poem.img == "") ? "Image-par-defaut.webp" : poem.img);
            poemImg.loading = "lazy";
            poemImg.classList.add("poem-image");
            slide.classList.add("swiper-slide");
           
            poemTextEl.appendChild(slideHeader);

            let paragraphes = poem.content != undefined ? poem.content.split("\n\n") : [];

            paragraphes.forEach(paragraphe => {
                let paragrapheElement = document.createElement("p");
                paragrapheElement.innerHTML = paragraphe.replaceAll("**", "<br>");
                poemTextEl.appendChild(paragrapheElement);
            });

            poemeContainer.appendChild(poemImg);
            poemeContainer.appendChild(poemTextEl);
            slide.appendChild(poemeContainer);
            
            slideWrapper.append(slide);
            console.log(slideWrapper);

        });

        // Initialisation du Swiper
        const swiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 80,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            },
            speed: 1600,
            slidesPerView: 1, // Nombre de diapositives visibles
        });

        const wordMapContainer = document.getElementById('wordMapContainer');

    // Liste de mots-clés
    const keywords = ['Amour', 'Nature', 'Rêves', 'Mémoire', 'Horizon', 'Silence', 'Temps', 'Espoir', 'Psyché', "Création", "Science"];

    // Garder une trace des positions des bulles générées
    const generatedBubbles = [];

    // Fonction pour détecter les chevauchements
    function checkOverlap(bubble1, bubble2) {
        const rect1 = bubble1.getBoundingClientRect();
        const rect2 = bubble2.getBoundingClientRect();
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    // Fonction pour activer une boucle visuelle entre les bulles chevauchées
    function handleOverlapAnimation(overlappingBubbles) {
        let currentIndex = 0;

        setInterval(() => {
            overlappingBubbles.forEach((bubble, index) => {
                bubble.style.zIndex = index === currentIndex ? 100 : 1; // La bulle active passe au premier plan
                bubble.style.transform = index === currentIndex ? 'scale(1.2)' : 'scale(1)'; // Mise en avant douce
            });

            currentIndex = (currentIndex + 1) % overlappingBubbles.length; // Passer à la bulle suivante
            }, 2000); // Changer toutes les 2 secondes
        }

    // Générer les bulles de mots-clés
    keywords.forEach((word) => {
        
        const bubble = document.createElement('div');
        bubble.classList.add('word-bubble');
        bubble.innerText = word;

        let x, y;
        let attempts = 0;
        const maxAttempts = 100; // Pour éviter une boucle infinie

        do {
            x = Math.random() * (wordMapContainer.offsetWidth - 90); // Largeur de la bulle (ajustez selon la taille)
            y = Math.random() * (wordMapContainer.offsetHeight - 90); // Hauteur de la bulle
            attempts++;
        } while (attempts < maxAttempts);

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        // Ajouter un événement clic pour afficher les poèmes associés
        bubble.addEventListener('click', () => {

            let bubbles = document.querySelectorAll(".word-bubble");
            
            bubbles.forEach(bubble => {
                bubble.classList.remove("selected-theme");
            });

            bubble.classList.add("selected-theme");

            // Réinitialiser tous les titres
            sidebarTitles.forEach(item => {
                item.classList.remove('sidebar-title-selected');
                item.setAttribute('selected', 'false');
            });

            // On trouve tout les poèmes lié au theme choisit
            let selectedOptions = document.querySelectorAll("li[data-theme="+word+""); 
            // On en choisit un au hasard
            let randIndex = getRandomInt(0, selectedOptions.length - 1);
            let dataIndex = selectedOptions[randIndex].getAttribute("data-index");
            selectedOptions[randIndex].setAttribute("selected", true);
            selectedOptions[randIndex].classList.add("sidebar-title-selected");
            selectedOptions[randIndex].scrollIntoView({
                behavior: 'smooth', // Défilement fluide
                block: 'center', // Centrer le poème dans la vue
            });
            
            document.querySelector("main").scrollTo({
                top: 0,
                behavior: 'smooth' // Défilement fluide
            });

            setTimeout(function() {
                swiper.slideTo(dataIndex, 500);
            }, 1000);
            // On va vers le poem chosit dans le slide.
            

        });

        wordMapContainer.appendChild(bubble);
        generatedBubbles.push(bubble);
    });

    // Vérifier les chevauchements et lancer l'animation
    const overlappingBubbles = [];

    for (let i = 0; i < generatedBubbles.length; i++) {
        for (let j = i + 1; j < generatedBubbles.length; j++) {
            if (checkOverlap(generatedBubbles[i], generatedBubbles[j])) {
                overlappingBubbles.push(generatedBubbles[i], generatedBubbles[j]);
            }
        }
    }

    // Si des chevauchements sont détectés, lancer l'animation
    if (overlappingBubbles.length > 0) {
        handleOverlapAnimation(overlappingBubbles);
    }

        // Éléments interactifs
        const toggleButton = document.getElementById('burger-menu');
        const sidebar = document.getElementById('sidebar');
        const searchInput = document.querySelector('input[type=text]');
        const poemList = document.getElementById('poemList');
        const poems = poemList.querySelectorAll('li');
        const sidebarTitles = document.querySelectorAll('.sidebar-title-link');
        const modal = document.getElementById('modal');
        const modalText = document.getElementById('modal-text');
        const modalClose = document.getElementById('modal-close');
        const poemContainers = document.querySelectorAll('.poem-container');
        const clearButton = document.getElementById('clear-button');
        const modalContent = document.querySelector('.modal-content');


        // Affiche ou masque la croix en fonction du contenu de l'input
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() !== '') {
            clearButton.style.display = 'inline';
            } else {
            clearButton.style.display = 'none';
            }
        });

        // Efface le contenu de l'input au clic sur la croix
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            searchInput.focus(); // Replace le focus dans l'input
            let query = searchInput.value.toLowerCase();
            poems.forEach(poem => {
                poem.style.display = poem.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
            let selectedPoem = document.querySelector("li[selected=true]");
            
            if(selectedPoem != null){
                selectedPoem.scrollIntoView({
                    behavior: 'smooth', // Défilement fluide
                    block: 'center', // Centrer le poème dans la vue
                });
            }
        });

        // Fonction pour basculer la barre latérale
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            sidebar.classList.toggle('closed');
            toggleButton.classList.toggle('active');
            toggleButton.classList.toggle('toggled');
        });

        // Fonction de recherche dans la barre latérale
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            poems.forEach(poem => {
                poem.style.display = poem.textContent.toLowerCase().includes(query) ? '' : 'none';
            });

            let selectedPoem = document.querySelector("li[selected=true]");

            if( selectedPoem != null ){
                selectedPoem.scrollIntoView({
                    behavior: 'smooth', // Défilement fluide
                    block: 'center', // Centrer le poème dans la vue
                });
            }

        });

        // Gestion des titres sélectionnés dans la barre latérale
        sidebarTitles.forEach(title => {
            title.addEventListener('click', () => {
                // Réinitialiser tous les titres
                sidebarTitles.forEach(item => {
                    item.classList.remove('sidebar-title-selected');
                    item.setAttribute('selected', 'false');
                });

                // Ajouter la classe sélectionnée au titre cliqué
                title.classList.add('sidebar-title-selected');
                title.setAttribute('selected', 'true');
            });
        });

        // Navigation vers un slide en cliquant sur un poème
        poems.forEach(poem => {
            poem.addEventListener('click', () => {
                const index = parseInt(poem.getAttribute('data-index'), 10);
                swiper.slideTo(index, 500); // Aller au slide avec une transition
            });
        });

        // Navigation aléatoire
        document.getElementById('randomPoemButton').addEventListener('click', () => {
            let randIndex = getRandomInt(0,parseInt(poems[poems.length-1].getAttribute("data-index")));
            swiper.slideTo(randIndex, 500);
            sidebarTitles.forEach(item => {
                item.classList.remove('sidebar-title-selected');
                item.setAttribute('selected', 'false');
            });
            // Ajouter la classe sélectionnée au titre cliqué
            poems[randIndex].classList.add('sidebar-title-selected');
            poems[randIndex].setAttribute('selected', 'true');
            poems[randIndex].style.display = '';

             // Défilement fluide vers le poème sélectionné
             poems[randIndex].scrollIntoView({
                behavior: 'smooth', // Défilement fluide
                block: 'center', // Centrer le poème dans la vue
            });

        });

        // Gestion de la modale
        poemContainers.forEach(container => {
            container.addEventListener('click', () => {
                const html = container.querySelector('.poem-text').innerHTML;
                modalText.innerHTML = html;
                modal.classList.add('show');
            });
        });

        // Fermer la modale
        modalClose.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', (event) => {
            if (!modalContent.contains(event.target)) {
                modal.classList.remove('show');
            }
        });

    })
    .catch(error => {
        console.error('Erreur lors du chargement des données JSON :', error);
    });
    
});
