window.addEventListener('load', () => {
  const select = document.querySelector('[data-language-select]');
  if (!select) return;
  select.addEventListener('change', (event) => {
    localStorage.setItem('healthtech-language', event.target.value);
    window.location.reload();
  });
});
