let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

function initDrag(item) {
  item.addEventListener('mousedown', e => {
    e.preventDefault();
    startDrag(item, e.clientX, e.clientY);
  });

  item.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    startDrag(item, touch.clientX, touch.clientY);
  }, { passive: false });
}

function startDrag(originalItem, clientX, clientY) {
  // Клонируем, если из панели
  if (!originalItem.closest('.container')) {
    draggedItem = originalItem.cloneNode(true);
    draggedItem.style.position = 'absolute';
    draggedItem.classList.add('item');
    document.querySelector('.container').appendChild(draggedItem);
    initDrag(draggedItem); // позволяем повторно перетаскивать
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
  const containerRect = container.getBoundingClientRect();

  let x = clientX - containerRect.left - offsetX;
  let y = clientY - containerRect.top - offsetY;

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

// Инициализация для начальных предметов
document.querySelectorAll('.items-panel .item').forEach(initDrag);
