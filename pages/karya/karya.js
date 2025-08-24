const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

$('#year').textContent = new Date().getFullYear();

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

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.open) dialog.close();
});


if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
