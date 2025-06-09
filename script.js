const items = document.querySelectorAll('.item');

items.forEach(item => {
  // Мышь
  item.addEventListener('dragstart', dragStart);
  item.addEventListener('dragend', dragEnd);

  // Сенсорные события
  item.addEventListener('touchstart', touchStart, { passive: false });
  item.addEventListener('touchmove', touchMove, { passive: false });
  item.addEventListener('touchend', touchEnd);
});

let offsetX = 0;
let offsetY = 0;
let draggedItem = null;

function dragStart(e) {
  offsetX = e.offsetX;
  offsetY = e.offsetY;
  e.dataTransfer.setData('text/plain', e.target.id);
}

function dragEnd(e) {
  const item = document.getElementById(e.target.id);
  const container = document.querySelector('.container');

  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left - offsetX;
  const y = e.clientY - rect.top - offsetY;

  item.style.left = `${x}px`;
  item.style.top = `${y}px`;
}

function touchStart(e) {
  e.preventDefault();

  draggedItem = e.target;

  const touch = e.touches[0];
  const rect = draggedItem.getBoundingClientRect();

  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;
}

function touchMove(e) {
  e.preventDefault();

  if (!draggedItem) return;

  const touch = e.touches[0];
  const container = document.querySelector('.container');
  const rect = container.getBoundingClientRect();

  let x = touch.clientX - rect.left - offsetX;
  let y = touch.clientY - rect.top - offsetY;

  x = Math.max(0, Math.min(x, rect.width - draggedItem.offsetWidth));
  y = Math.max(0, Math.min(y, rect.height - draggedItem.offsetHeight));

  draggedItem.style.left = `${x}px`;
  draggedItem.style.top = `${y}px`;
}

function touchEnd(e) {
  draggedItem = null;
}
