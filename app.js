
const root = document.documentElement;
root.classList.add('js');
const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menu && navigation && header) {
  menu.hidden = false;
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    header.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const isOpen = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(isOpen));
    header.classList.toggle('is-open', isOpen);
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  matchMedia('(min-width:701px)').addEventListener('change', closeMenu);
}

const filters = document.querySelector('.filter-bar');
if (filters) {
  const buttons = [...filters.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.archive-grid .project-card')];
  const status = filters.querySelector('.filter-count');
  const allowed = new Set(buttons.map(button => button.dataset.filter));
  const setFilter = (value, updateURL = false) => {
    if (!allowed.has(value)) value = 'todos';
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    let count = 0;
    cards.forEach(card => {
      card.hidden = value !== 'todos' && !card.dataset.categories.split(' ').includes(value);
      if (!card.hidden) count++;
    });
    status.textContent = `${count} ${count === 1 ? 'proyecto' : 'proyectos'}`;
    if (updateURL) {
      const url = new URL(location.href);
      if (value === 'todos') url.searchParams.delete('tipo'); else url.searchParams.set('tipo', value);
      history.replaceState(null, '', url);
    }
  };
  filters.hidden = false;
  setFilter(new URL(location.href).searchParams.get('tipo') || 'todos');
  buttons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter, true)));
  window.addEventListener('popstate', () => setFilter(new URL(location.href).searchParams.get('tipo') || 'todos'));
}
