// util
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

// Tahun footer
$('#year').textContent = new Date().getFullYear();

// Lightbox
const dialog = $('#lightbox');
const lightImg = $('#lightbox-img');
$$('#gallery [data-preview]').forEach(a => {
    a.addEventListener('click', e => {
    e.preventDefault();
    lightImg.src = a.getAttribute('data-preview');
    dialog.showModal();
    })
});
$('.viewer .close').addEventListener('click', ()=> dialog.close());
dialog.addEventListener('click', (e)=>{ if(e.target === dialog) dialog.close(); });

// Keyboard & touch
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.open) dialog.close();
});

// Force start at top on refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
// Smooth scroll for in-page anchors