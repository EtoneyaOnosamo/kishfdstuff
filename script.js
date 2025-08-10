const LAYER_ORDER = ['tattoo', 'tattoo2', 'dick', 'undies', 'garter', 'socks', 'shoes', 'pants', 'shirt', 'makeup', 'beard', 'hand', 'hair', 'smile'];

let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

function isDuplicate(layer) {
  return document.querySelector(`.container .item[data-layer="${layer}"]`) !== null;
}

function enableRemoval(item) {
  item.addEventListener('click', e => {
    e.stopPropagation();
    item.remove();
  });
  item.addEventListener('touchstart', e => {
    e.stopPropagation();
    item.remove();
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

document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchmove', e => {
  if (draggedItem) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });
document.addEventListener('touchend', endDrag);

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
