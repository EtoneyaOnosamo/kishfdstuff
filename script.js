const LAYER_ORDER = ['tattoo', 'tattoo2', 'dick', 'undies', 'garter', 'socks', 'shoes', 'pants', 'shirt', 'makeup', 'beard', 'hand', 'hair', 'smile'];

let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

const container = document.querySelector('.container');

// --- Для pinch-to-zoom и панорамирования ---
let scale = 1;
let startDistance = 0;
let containerOffsetX = 0;
let containerOffsetY = 0;
let containerStartX = 0;
let containerStartY = 0;
let isPanning = false;

function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function updateContainerTransform() {
  container.style.transform = `translate(${containerOffsetX}px, ${containerOffsetY}px) scale(${scale})`;
}

// --- Слушатели для pinch/pan ---
document.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    // Pinch start
    startDistance = getDistance(e.touches);
    isPanning = false;
  } else if (e.touches.length === 1 && scale > 1 && !e.target.classList.contains('item')) {
    // Начало панорамирования
    isPanning = true;
    containerStartX = e.touches[0].clientX - containerOffsetX;
    containerStartY = e.touches[0].clientY - containerOffsetY;
  }
}, { passive: false });

document.addEventListener('touchmove', e => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const newDistance = getDistance(e.touches);
    const zoomFactor = newDistance / startDistance;
    container.style.transform = `translate(${containerOffsetX}px, ${containerOffsetY}px) scale(${scale * zoomFactor})`;
  } else if (isPanning && e.touches.length === 1) {
    e.preventDefault();
    containerOffsetX = e.touches[0].clientX - containerStartX;
    containerOffsetY = e.touches[0].clientY - containerStartY;
    updateContainerTransform();
  } else if (draggedItem && e.touches.length === 1) {
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });

document.addEventListener('touchend', e => {
  if (e.touches.length === 0) {
    // Завершили pinch
    const match = container.style.transform.match(/scale\(([^)]+)\)/);
    if (match) scale = parseFloat(match[1]);
    isPanning = false;
  }
}, { passive: false });

// --- Логика одежды ---
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
    if (e.touches.length > 1) return;
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

    container.appendChild(draggedItem);
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

document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
document.addEventListener('mouseup', endDrag);

document.querySelectorAll('.item-preview').forEach(initDrag);

// Зоны для снятия одежды
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
