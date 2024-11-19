

document.addEventListener('DOMContentLoaded', () => {


    // Ajouter la classe "loaded" au body pour activer les animations
    document.body.classList.add("loaded");

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
    });

    // Fonction pour basculer la barre latérale
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        toggleButton.classList.toggle('active');
        toggleButton.classList.toggle('toggled');
    });

    // Fonction de recherche dans la barre latérale
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        poems.forEach(poem => {
            poem.style.display = poem.textContent.toLowerCase().includes(query) ? '' : 'none';
        });
    });

    // Gestion des titres sélectionnés dans la barre latérale
    sidebarTitles.forEach(title => {
        title.addEventListener('click', () => {
            // Réinitialiser tous les titres
            sidebarTitles.forEach(item => {
                item.classList.remove('sidebar-title-selected');
                item.setAttribute('is-selected', 'false');
            });

            // Ajouter la classe sélectionnée au titre cliqué
            title.classList.add('sidebar-title-selected');
            title.setAttribute('is-selected', 'true');
        });
    });

    // Navigation vers un slide en cliquant sur un poème
    poems.forEach(poem => {
        poem.addEventListener('click', () => {
            const index = parseInt(poem.getAttribute('data-index'), 10);
            swiper.slideTo(index, 500); // Aller au slide avec une transition
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
});
