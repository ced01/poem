function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findClosestImage(element) {
    // Vérifier si l'élément lui-même contient une image
    if (element.tagName === 'IMG' && element.src) {
        return element; // L'image est trouvée
    }

    // Recherche ascendante dans le DOM (parents)
    let parent = element.parentElement;
    while (parent) {
        const imageInParent = parent.querySelector('img');
        if (imageInParent && imageInParent.src) {
            return imageInParent; // Image trouvée dans un parent
        }
        parent = parent.parentElement;
    }

    // Recherche descendante dans le DOM (enfants)
    const imageInChildren = element.querySelector('img');
    if (imageInChildren && imageInChildren.src) {
        return imageInChildren; // Image trouvée dans les enfants
    }

    // Aucun résultat trouvé
    return null;
}

document.addEventListener('DOMContentLoaded', () => {

    if(window.innerWidth <= 487){
        document.getElementById("sidebar").classList.toggle("open");
        document.getElementById("sidebar").classList.toggle("closed");
    }

    // Ajouter la classe "loaded" au body pour activer les animations
    document.body.classList.add("loaded");

    const dailyQuotes = [
        { text: "La poésie est le miroir brouillé de l'âme.", author: "Paul Éluard" },
        { text: "Écrire, c'est graver des rêves dans l'éphémère.", author: "Victor Hugo" },
        { text: "Chaque mot est une lumière dans l'obscurité.", author: "Charles Baudelaire" },
        { text: "Le silence est parfois la plus belle des poésies.", author: "André Gide" },
        { text: "Les mots sont des fenêtres ouvertes sur l'infini.", author: "Rainer Maria Rilke" },
        { text: "Le poème est l'écho d'une mélodie perdue.", author: "Stéphane Mallarmé" },
        { text: "L'écriture libère l'âme emprisonnée par le temps.", author: "Jean Cocteau" },
        { text: "Un poème commence toujours par un frisson.", author: "Jules Renard" },
        { text: "Les rêves écrits deviennent des réalités éternelles.", author: "Anna de Noailles" },
        { text: "Le vrai poète est un homme de lumière dans un monde d'ombres.", author: "Apollinaire" },
        { text: "La poésie est cette alchimie qui transforme le banal en sublime.", author: "René Char" },
        { text: "Chaque vers est un pas vers l'éternité.", author: "Paul Valéry" },
        { text: "Les mots, ces gouttes d’étoiles tombées de la nuit.", author: "Alphonse de Lamartine" },
        { text: "Un poème est un univers contenu dans une goutte d’encre.", author: "Marguerite Yourcenar" },
        { text: "La poésie est une émotion mise en mots.", author: "Emily Dickinson" }
    ];

    const randomQuote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];

    const quoteElement = document.getElementById('daily-quote');

    quoteElement.innerHTML = `"${randomQuote.text}" - ${randomQuote.author}`;

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
                paragrapheElement.classList.add("poem-line");
                paragrapheElement.innerHTML = paragraphe.replaceAll("**", "<br>");
                poemTextEl.appendChild(paragrapheElement);
            });

            poemeContainer.appendChild(poemImg);
            poemeContainer.appendChild(poemTextEl);
            slide.appendChild(poemeContainer);
            
            slideWrapper.append(slide);

        });

        // Initialisation du Swiper
        const swiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 80,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: false,
            },
            speed: 1000,
            slidesPerView: 1,
            on: {
                slideChangeTransitionStart: () => {
                    const slides = document.querySelectorAll('.swiper-slide');
                    slides.forEach((slide) => {
                        slide.style.transform = 'translateX(50px)'; // Réinitialise la position
                    });
                },
                slideChangeTransitionEnd: () => {
                    const activeSlide = document.querySelector('.swiper-slide-active');
                    activeSlide.style.transform = 'translateX(0)'; // Position finale
                    activeSlide.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Animation fluide
                },
            }, 
        });
    
    swiper.on('slideChange', () => {
        // Récupérer l'index actuel du slide
        const currentIndex = swiper.activeIndex;
        
        // Trouver tous les éléments de la sidebar
        const sidebarItems = document.querySelectorAll('.sidebar-title-link');
        
        // Réinitialiser toutes les classes de sélection
        sidebarItems.forEach((item) => {
            item.classList.remove('sidebar-title-selected');
            item.setAttribute('selected', 'false');
        });
        
        // Ajouter la classe sélectionnée à l'élément correspondant
        const selectedItem = sidebarItems[currentIndex];
        if (selectedItem) {
            selectedItem.classList.add('sidebar-title-selected');
            selectedItem.setAttribute('selected', 'true');
        
            // Optionnel : défiler jusqu'à l'élément actif
            selectedItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
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
        const searchTitleInput = document.getElementById('searchTitleInput');
        const searchPoemInput = document.getElementById('searchPoemInput');
        const poemList = document.getElementById('poemList');
        const poems = poemList.querySelectorAll('li');
        const sidebarTitles = document.querySelectorAll('.sidebar-title-link');
        const modal = document.getElementById('modal');
        const modalText = document.getElementById('modal-text');
        const modalClose = document.getElementById('modal-close');
        const poemContainers = document.querySelectorAll('.poem-container');
        const clearTitleButton = document.getElementById('clear-title-button');
        const clearPoemButton = document.getElementById('clear-poem-button');
        const modalContent = document.querySelector('.modal-content');
        const poemLines = document.querySelectorAll('.poem-line');



        // Affiche ou masque la croix en fonction du contenu de l'input
        searchTitleInput.addEventListener('input', () => {
            if (searchTitleInput.value.trim() !== '') {
                clearTitleButton.style.display = 'inline';
            } else {
                clearTitleButton.style.display = 'none';
            }
        });

        // Affiche ou masque la croix en fonction du contenu de l'input
        searchPoemInput.addEventListener('input', () => {
            if (searchPoemInput.value.trim() !== '') {
                clearPoemButton.style.display = 'inline';
            } else {
                clearPoemButton.style.display = 'none';
            }
        });

        // Efface le contenu de l'input au clic sur la croix
        clearTitleButton.addEventListener('click', () => {
            searchTitleInput.value = '';
            clearTitleButton.style.display = 'none';
            searchTitleInput.focus(); // Replace le focus dans l'input
            let query = searchTitleInput.value.toLowerCase();
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

        clearPoemButton.addEventListener('click', () => {
            searchPoemInput.value = '';
            clearPoemButton.style.display = 'none';
            searchPoemInput.focus(); // Replace le focus dans l'input
            let query = searchPoemInput.value.toLowerCase();
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
        searchTitleInput.addEventListener('input', (event) => {
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

        searchPoemInput.addEventListener('input', (event) => {

            const query = event.target.value.toLowerCase();
            let foundSlides = new Set();

            poemLines.forEach(poemLine => {
                if(poemLine.textContent.toLowerCase().includes(query)){
                    //recupère l'index du slide ou le poemLine se situe
                    const slide = poemLine.closest('.swiper-slide'); // Modifier selon votre structure HTML
                    if (slide) {
                        const index = Array.from(slide.parentNode.children).indexOf(slide); // Trouver l'index du slide
                        foundSlides.add(index); // Ajouter l'index trouvé dans le Set
                    }

                }
            });
            
            poems.forEach(poem => {
                const poemIndex = parseInt(poem.getAttribute("data-index")); // Obtenir l'index du poème
                poem.style.display = foundSlides.has(poemIndex) ? '' : 'none'; // Afficher ou masquer en fonction des slides trouvés
            });

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

            document.querySelector("main").scrollTo({
                top: 0,
                behavior: 'smooth' // Défilement fluide
            });

        });

        // Gestion de la modale
        poemContainers.forEach(container => {
            container.addEventListener('click', (event) => {
                const html = container.querySelector('.poem-text').innerHTML;
                modalText.innerHTML = html;

                let title = modalText.querySelector('h2');
                const closestImage = findClosestImage(event.target);
                const imgSrc = closestImage.src;

                document.getElementsByClassName("modal")[0].style.backgroundImage = "url("+imgSrc+")";

                modal.classList.add('show');

                // Sélectionnez tous les éléments de classe "poem-line"
                const lines = modalText.querySelectorAll('.poem-line');

                title.style.fontFamily = "Dancing Script, cursive";
                title.style.fontSize = "2rem";
                
                // Ajouter un effet de survol
                title.addEventListener('mouseover', () => {
                    title.style.color = '#8B5E3C'; // Change la couleur
                    title.style.transition = 'transform 0.3s ease, color 0.3s ease'; // Ajoute une transition
                });

                // Retirer l'effet lorsque la souris quitte
                title.addEventListener('mouseout', () => {
                    title.style.color = ''; // Restaure la couleur initiale
                });

                lines.forEach(line => {
                    line.style.fontFamily = "Dancing Script, cursive";
                    line.style.fontWeight = 300;
                    line.style.fontSize = "1.3rem";
                });

                // Timeline GSAP pour animer les lignes une par une
                const timeline = gsap.timeline({ delay: 0.8 });// Ajout d'un délai initial
                
                timeline.fromTo(
                    modalText.querySelector('h2'),
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
                );

                // Ajouter chaque ligne avec un effet de fondu
                lines.forEach((line, index) => {
                    timeline.fromTo(
                        line, // Élément à animer
                        { opacity: 0, y: 5 }, // État initial (transparent, décalé vers le bas)
                        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, // État final
                        index * 4 // Délai relatif entre chaque animation
                    );
                });
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
