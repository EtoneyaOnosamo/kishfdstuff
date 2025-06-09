const items = document.querySelectorAll('.item');
let offsetX = 0;
let offsetY = 0;
let draggedItem = null;

// Для мыши
items.forEach(item => {
  item.addEventListener('mousedown', e => {
    draggedItem = item;
    const rect = item.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });
});

document.addEventListener('mousemove', e => {
  if (draggedItem) {
    const container = document.querySelector('.container');
    const rect = container.getBoundingClientRect();

    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top - offsetY;

    draggedItem.style.left = `${x}px`;
    draggedItem.style.top = `${y}px`;
  }
});

document.addEventListener('mouseup', () => {
  draggedItem = null;
});

// Для телефона
items.forEach(item => {
  item.addEventListener('touchstart', e => {
    draggedItem = item;
    const touch = e.touches[0];
    const rect = item.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
  }, { passive: false });

  item.addEventListener('touchmove', e => {
    e.preventDefault();
    if (draggedItem) {
      const touch = e.touches[0];
      const container = document.querySelector('.container');
      const rect = container.getBoundingClientRect();

      let x = touch.clientX - rect.left - offsetX;
      let y = touch.clientY - rect.top - offsetY;

      draggedItem.style.left = `${x}px`;
      draggedItem.style.top = `${y}px`;
    }
  }, { passive: false });

  item.addEventListener('touchend', () => {
    draggedItem = null;
  });
});
