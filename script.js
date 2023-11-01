const categoryMapping = {
    softdrinks: 'softdrinks-models',
    cocktails: 'cocktails-models'
};

function selectCategory(category) {
    document.getElementById('main-categories').style.display = 'none';
    if (categoryMapping[category]) {
        const modelContainer = document.getElementById(categoryMapping[category]);
        modelContainer.style.display = 'block';
        handleSnap(modelContainer);
    }
    document.getElementById('back-button').style.display = 'block';
}

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

function goBack() {
    const modelContainers = document.querySelectorAll('.model-container');
    modelContainers.forEach(container => {
        container.style.display = 'none';
    });

    document.getElementById('main-categories').style.display = 'flex';
    document.getElementById('back-button').style.display = 'none';
}


function loadARModel(modelURL, scale) {
    const marker = document.querySelector('#animated-marker');
    const existingEntity = document.querySelector('#bowser-model');
    if (existingEntity) {
        existingEntity.parentNode.removeChild(existingEntity);
    }

    const newEntity = document.createElement('a-entity');
    newEntity.setAttribute('id', 'bowser-model');
    newEntity.setAttribute('scale', scale);
    newEntity.setAttribute('animation-mixer', 'loop: repeat');
    newEntity.setAttribute('gltf-model', modelURL);
    newEntity.setAttribute('class', 'clickable');
    newEntity.setAttribute('position', '0 0 0');
    newEntity.setAttribute('gesture-handler');

    marker.appendChild(newEntity);
}

function bindEventListeners(element) {
    let scrollTimeout;

    const debounce = (func, delay) => {
        return function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(func, delay);
        };
    };

    const handleDebouncedSnap = debounce(() => handleSnap(element), 100);

    element.addEventListener('scroll', handleDebouncedSnap);
    element.addEventListener('mousedown', () => clearTimeout(scrollTimeout));
    window.addEventListener('mouseup', handleDebouncedSnap);
    element.addEventListener('touchstart', () => clearTimeout(scrollTimeout));
    window.addEventListener('touchend', handleDebouncedSnap);
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
        const modelScale = closestButton.getAttribute('data-scale');
        if (modelURL) {
            loadARModel(modelURL, modelScale);
        }
    }
}
