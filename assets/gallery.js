const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('close-btn');

function openModal(src) {
    modalImg.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    modalImg.src = '';
    document.body.style.overflow = ''; 
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.img-container').forEach((el) => {
        el.addEventListener('click', () => {
            openModal(el.getAttribute('data-src'));
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
