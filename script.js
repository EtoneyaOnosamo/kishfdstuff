const items = document.querySelectorAll('.item');

items.forEach(item => {
  item.addEventListener('dragstart', dragStart);
  item.addEventListener('dragend', dragEnd);
});

let offsetX = 0;
let offsetY = 0;

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