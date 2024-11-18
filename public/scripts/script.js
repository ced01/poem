document.addEventListener('DOMContentLoaded', () => {

    document.body.classList.add("loaded");

    const swiper = new Swiper('.swiper-container', {
        /*effect: 'fade', // Active l'effet de fondu
        fadeEffect: {
            crossFade: true, // Transition douce entre les slides
        },*/
        effect: 'cube', // Active l'effet cube
        cubeEffect: {
          shadow: true,
          slideShadows: false,
          shadowOffset: 20,
          shadowScale: 0.94,
        },
        /*effect: 'coverflow',
        coverflowEffect: {
            rotate: 50, // Rotation des slides
            stretch: 0, // Écartement entre les slides
            depth: 100, // Profondeur des slides
            modifier: 1,
            slideShadows: true,
        },*/
        speed: 1600,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1, // Nombre de diapositives visibles
        spaceBetween: 10, // Espace entre les diapositives
    });

    // Gérer l'ouverture et la fermeture de la barre latérale
    const toggleButton  = document.getElementById('burger-menu');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const swiperPrev = document.querySelector('.swiper-button-prev');
    const swiperNext = document.querySelector('.swiper-button-next');
    const sidebarTitles = document.querySelectorAll('.sidebar-title-link');
    const searchInput = document.querySelector('input[type=text]');
    const poemList = document.getElementById('poemList');
    const poems = poemList.querySelectorAll('li');

    toggleButton .addEventListener('click', () => {
        sidebar.classList.toggle('open'); 
        toggleButton .classList.toggle('active');
        toggleButton .classList.toggle('toggled');
    });

    searchInput.addEventListener('change', (event) => {
        let query = event.target.value.toLowerCase();
            poems.forEach(poem => {
            if (poem.textContent.toLowerCase().includes(query)) {
                poem.style.display = ''; // Afficher si le texte correspond
            } else {
                poem.style.display = 'none'; // Masquer sinon
            }
            });
    });

    sidebarTitles.forEach(title => {
        title.addEventListener('click', () => {
            // Supprimer la classe "sidebar-title-selected" de tous les titres
            sidebarTitles.forEach(item => {
                item.classList.remove('sidebar-title-selected');
                item.setAttribute('is-selected', 'false'); // Réinitialise l'attribut
            });
    
            // Ajouter la classe "sidebar-title-selected" au titre cliqué
            title.classList.add('sidebar-title-selected');
            title.setAttribute('is-selected', 'true'); // Marquer comme sélectionné
        });
    });

    // Naviguer vers un slide donné au clic sur un poème
    const poemItems = document.querySelectorAll('.sidebar ul li');

    poemItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = item.getAttribute('data-index');
            swiper.slideTo(parseInt(index), 500); // Naviguer vers le slide avec une transition de 500ms
        });
    })


    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalText = document.getElementById('modal-text');
    const modalClose = document.getElementById('modal-close');

    document.querySelectorAll('.poem-container').forEach(container => {
        container.addEventListener('click', () => {
            const html = container.querySelector('.poem-text').innerHTML;
            //modalImage.src = image;
            modalText.innerHTML = html;
            modal.classList.add('show');
        });
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('show');
    });

});
  