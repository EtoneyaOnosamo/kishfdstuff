const items = document.querySelectorAll('.item');
let offsetX = 0;
let offsetY = 0;
let draggedItem = null;

items.forEach(item => {
  item.addEventListener('mousedown', e => {
    draggedItem = item;
    offsetX = item.offsetWidth / 2;
    offsetY = item.offsetHeight / 2;

    // Клонируем, если из панели
    if (!draggedItem.parentElement.classList.contains('container')) {
      const clone = item.cloneNode(true);
      clone.classList.add('item');
      document.querySelector('.container').appendChild(clone);
      draggedItem = clone;
    }
  });
});

document.addEventListener('mousemove', e => {
  if (draggedItem) moveItem(e.clientX, e.clientY);
});

document.addEventListener('mouseup', () => {
  draggedItem = null;
});

items.forEach(item => {
  item.addEventListener('touchstart', e => {
    draggedItem = item;
    offsetX = item.offsetWidth / 2;
    offsetY = item.offsetHeight / 2;

    if (!draggedItem.parentElement.classList.contains('container')) {
      const clone = item.cloneNode(true);
      clone.classList.add('item');
      document.querySelector('.container').appendChild(clone);
      draggedItem = clone;
    }
  }, { passive: false });

  item.addEventListener('touchmove', e => {
    e.preventDefault();
    if (draggedItem) {
      const touch = e.touches[0];
      moveItem(touch.clientX, touch.clientY);
    }
  }, { passive: false });

  item.addEventListener('touchend', () => {
    draggedItem = null;
  });
});

function moveItem(clientX, clientY) {
  const container = document.querySelector('.container');
  const rect = container.getBoundingClientRect();

  let x = clientX - rect.left - offsetX;
  let y = clientY - rect.top - offsetY;

  x = Math.max(0, Math.min(x, rect.width - draggedItem.offsetWidth));
  y = Math.max(0, Math.min(y, rect.height - draggedItem.offsetHeight));

  draggedItem.style.left = `${x}px`;
  draggedItem.style.top = `${y}px`;
}
