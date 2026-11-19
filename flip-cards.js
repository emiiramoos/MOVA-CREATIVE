// Hover is temporary. Touch and native keyboard activation toggle the same face.
export function bindFlipCard(card, hoverMedia) {
  let pointerType = '';
  const setFace = flipped => {
    card.classList.toggle('is-flipped', flipped);
    card.setAttribute('aria-pressed', String(flipped));
  };
  card.addEventListener('pointerdown', event => { pointerType = event.pointerType; });
  card.addEventListener('pointerenter', event => {
    if (hoverMedia.matches && event.pointerType === 'mouse') setFace(true);
  });
  card.addEventListener('pointerleave', event => {
    if (hoverMedia.matches && event.pointerType === 'mouse') setFace(false);
  });
  card.addEventListener('click', event => {
    const source = event.pointerType || pointerType;
    if (!(hoverMedia.matches && source === 'mouse' && event.detail > 0)) {
      setFace(!card.classList.contains('is-flipped'));
    }
    pointerType = '';
  });
  card.addEventListener('keydown', event => {
    if (event.key === 'Escape') setFace(false);
  });
  card.addEventListener('blur', () => setFace(false));
}
