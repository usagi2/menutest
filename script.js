document.addEventListener('DOMContentLoaded', function () {

    document.body.addEventListener('click', function (event) {
        const target = event.target;

        if (target.tagName === 'BUTTON') {
            const category = target.textContent.toLowerCase().replace(" ", "");
            if (category === 'softdrinks' || category === 'cocktails') {
                selectCategory(category);
            }
        }

        if (target.id === 'back-button' || target.parentElement && target.parentElement.id === 'back-button') {
            goBack();
        }
    });

    const containers = document.querySelectorAll('.model-container');
    containers.forEach(container => {
        bindEventListeners(container);
    });
});

function selectCategory(category) {
    console.log(category);
    document.getElementById('main-categories').style.display = 'none';

    if (category === 'softdrinks') {
        const softdrinksModels = document.getElementById('softdrinks-models');
        softdrinksModels.style.display = 'block';
        handleSnap(softdrinksModels);
    } else if (category === 'cocktails') {
        const cocktailsModels = document.getElementById('cocktails-models');
        cocktailsModels.style.display = 'block';
        handleSnap(cocktailsModels);
    }

    document.getElementById('back-button').style.display = 'block';
}

function goBack() {
    const modelContainers = document.querySelectorAll('.model-container');
    modelContainers.forEach(container => {
        container.style.display = 'none';
    });

    document.getElementById('main-categories').style.display = 'flex';
    document.getElementById('back-button').style.display = 'none';
}

function loadARModel(modelURL) {
    const entity = document.querySelector('#bowser-model');
    entity.setAttribute('gltf-model', modelURL);
}


function bindEventListeners(element) {
    let scrollTimeout;
    let isScrolling = false;

    element.addEventListener('scroll', function () {
        if (!isScrolling) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => handleSnap(element), 150);
        }
    });

    element.addEventListener('mousedown', function () {
        isScrolling = true;
    });

    window.addEventListener('mouseup', function () {
        isScrolling = false;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => handleSnap(element), 150);
    });

    element.addEventListener('touchstart', function () {
        isScrolling = true;
    });

    window.addEventListener('touchend', function () {
        isScrolling = false;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => handleSnap(element), 150);
    });
}

function handleSnap(subCategories) {
    let closestButton = null;
    let closestDistance = Infinity;

    subCategories.childNodes.forEach(button => {
        if (button.nodeType === 1) {
            const rect = button.getBoundingClientRect();
            const distance = Math.abs(rect.left - window.innerWidth / 2);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestButton = button;
            }
        }
    });

    // Remove previous selections only within the active sub-category
    const modelButtons = subCategories.querySelectorAll('.model-button:not(.non-selectable-div)');
    modelButtons.forEach(button => {
        button.classList.remove('selected-button');
        const thumbnail = button.getAttribute('data-thumbnail');
        button.style.backgroundImage = `url('${thumbnail}')`;
    });
    if (closestButton) {
        closestButton.classList.add('selected-button');
        const modelURL = closestButton.getAttribute('data-model');
        if (modelURL) {
            loadARModel(modelURL);
        }
    }
}
