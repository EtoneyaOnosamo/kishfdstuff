let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

// Проверка: есть ли уже такой id в контейнере?
function isDuplicate(id) {
  return document.querySelector(`.container .item[id="${id}"]`) !== null;
}

// Удаление по клику (для предметов в контейнере)
function enableRemoval(item) {
  item.addEventListener('click', () => {
    item.remove();
  });
}

// Запуск перетаскивания
function initDrag(item) {
  item.addEventListener('mousedown', e => {
    e.preventDefault();
    startDrag(item, e.clientX, e.clientY);
  });

  item.addEventListener('touchstart', e => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(item, touch.clientX, touch.clientY);
  }, { passive: false });
}

function startDrag(originalItem, clientX, clientY) {
  // Клонируем из панели
  if (!originalItem.closest('.container')) {
    const id = originalItem.id;

    if (isDuplicate(id)) return; // запрет на дубли

    draggedItem = originalItem.cloneNode(true);
    draggedItem.style.position = 'absolute';
    draggedItem.classList.add('item');
    draggedItem.id = id;

    document.querySelector('.container').appendChild(draggedItem);
    initDrag(draggedItem);
    enableRemoval(draggedItem);
  } else {
    draggedItem = originalItem;
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

// Слушатели движения
document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
document.addEventListener('mouseup', endDrag);

document.addEventListener('touchmove', e => {
  if (draggedItem) {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }
}, { passive: false });

document.addEventListener('touchend', endDrag);

// Инициализация начальных предметов
document.querySelectorAll('.items-panel .item').forEach(initDrag);
