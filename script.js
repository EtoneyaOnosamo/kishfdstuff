let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

function isDuplicate(id) {
  return document.querySelector(`.container .item[id="${id}"]`) !== null;
}

// Удаление предмета по клику или тапу
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

function initDrag(item) {
  item.addEventListener('mousedown', e => {
    e.preventDefault();
    startDrag(item, e.clientX, e.clientY);
  });

  item.addEventListener('touchstart', e => {
    if (e.touches.length > 1) return;
    const touch = e.touches[0];
    startDrag(item, touch.clientX, touch.clientY);
  }, { passive: false });
}

function startDrag(originalItem, clientX, clientY) {
  const fromPanel = !originalItem.closest('.container');
  const id = originalItem.id;

  // Если из панели и уже надето — не добавляем
  if (fromPanel && isDuplicate(id)) return;

  if (fromPanel) {
  draggedItem = originalItem.cloneNode(true);
  draggedItem.id = id;
  draggedItem.style.position = 'absolute';
  draggedItem.classList.add('item');

  // Используем полную версию картинки
  draggedItem.src = originalItem.dataset.full;

  document.querySelector('.container').appendChild(draggedItem);
  enableRemoval(draggedItem);
  initDrag(draggedItem);
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

document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
document.addEventListener('mouseup', endDrag);

document.addEventListener('touchmove', e => {
  if (draggedItem) {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }
}, { passive: false });

document.addEventListener('touchend', endDrag);

// Запуск
document.querySelectorAll('.items-panel .item').forEach(initDrag);
