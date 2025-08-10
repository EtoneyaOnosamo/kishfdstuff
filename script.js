const LAYER_ORDER = ['tattoo', 'tattoo2', 'dick', 'hand', 'undies', 'garter', 'socks', 'shoes', 'pants', 'shirt', 'makeup', 'beard', 'hair', 'smile'];

let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

// Масштаб и перемещение всей сцены
let scale = 1;
let startDistance = 0;
let currentX = 0;
let currentY = 0;
let lastX = 0;
let lastY = 0;
let isDraggingScreen = false;
let dragStartX = 0;
let dragStartY = 0;

const mainWrapper = document.querySelector('.main-wrapper');

function isDuplicate(layer) {
  return document.querySelector(`.container .item[data-layer="${layer}"]`) !== null;
}

function enableRemoval(item) {
  item.addEventListener('click', e => {
    e.stopPropagation();
    item.remove();
  });
  item.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      e.stopPropagation();
      item.remove();
    }
  }, { passive: true });
}

function initDrag(preview) {
  preview.addEventListener('mousedown', e => {
    e.preventDefault();
    startDrag(preview, e.clientX, e.clientY);
  });
  preview.addEventListener('touchstart', e => {
    if (e.touches.length > 1) return; // Игнор pinch
    startDrag(preview, e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
}

function startDrag(preview, clientX, clientY) {
  const fromPanel = preview.classList.contains('item-preview');
  const layer = preview.dataset.layer;

  if (fromPanel && isDuplicate(layer)) return;

  if (fromPanel) {
    draggedItem = new Image();
    draggedItem.src = preview.dataset.full;
    draggedItem.className = 'item';
    draggedItem.dataset.layer = layer;

    document.querySelector('.container').appendChild(draggedItem);
    reorderLayers();
    enableRemoval(draggedItem);
    initDrag(draggedItem);
  } else {
    draggedItem = preview;
  }

  const rect = draggedItem.getBoundingClientRect();
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
}

function moveDrag(clientX, clientY) {
  if (!draggedItem) return;

  const container = document.querySelector('.container');
  const rect = container.getBoundingClientRect();

  let x = clientX - rect.left - offsetX;
  let y = clientY - rect.top - offsetY;

  draggedItem.style.left = `${x}px`;
  draggedItem.style.top = `${y}px`;
}

function endDrag() {
  draggedItem = null;
}

function reorderLayers() {
  const items = Array.from(document.querySelectorAll('.container .item'));
  items.sort((a, b) => {
    return LAYER_ORDER.indexOf(a.dataset.layer) - LAYER_ORDER.indexOf(b.dataset.layer);
  });
  items.forEach((el, i) => {
    el.style.zIndex = 10 + i;
  });
}

// ====================
//   Pinch-to-zoom логика
// ====================
document.addEventListener('touchstart', e => {
  if (e.target.closest('.item-preview') || e.target.closest('.item')) {
    return; // если тянем одежду — не зумим экран
  }

  if (e.touches.length === 2) {
    startDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  } else if (e.touches.length === 1) {
    isDraggingScreen = true;
    dragStartX = e.touches[0].clientX - lastX;
    dragStartY = e.touches[0].clientY - lastY;
  }
}, { passive: false });

document.addEventListener('touchmove', e => {
  if (e.target.closest('.item-preview') || e.target.closest('.item')) {
    if (draggedItem) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    return;
  }

  if (e.touches.length === 2) {
    e.preventDefault();
    let newDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    let zoom = newDistance / startDistance;
    scale = Math.min(Math.max(0.5, scale * zoom), 3);
    startDistance = newDistance;
  } else if (e.touches.length === 1 && isDraggingScreen) {
    e.preventDefault();
    currentX = e.touches[0].clientX - dragStartX;
    currentY = e.touches[0].clientY - dragStartY;
  }

  mainWrapper.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}, { passive: false });

document.addEventListener('touchend', e => {
  if (!draggedItem) {
    isDraggingScreen = false;
    lastX = currentX;
    lastY = currentY;
  }
});

// ====================
//  Слушатели мыши для одежды
// ====================
document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
document.addEventListener('mouseup', endDrag);
document.querySelectorAll('.item-preview').forEach(initDrag);

// ====================
//  Зоны для снятия одежды
// ====================
document.querySelectorAll('.clear-zone').forEach(zone => {
  zone.addEventListener('click', () => {
    const zoneName = zone.dataset.zone;
    const layerMap = {
      head: ['hair', 'makeup', 'smile', 'beard'],
      torso: ['shirt', 'jacket', 'tattoo', 'tattoo2', 'hand', 'garter'],
      legs: ['pants', 'undies', 'socks', 'dick'],
      feet: ['shoes']
    };
    const toRemove = layerMap[zoneName];
    document.querySelectorAll('.container .item').forEach(item => {
      if (toRemove.includes(item.dataset.layer)) {
        item.remove();
      }
    });
  });
});


