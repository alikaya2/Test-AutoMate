export class ModalService {
    create(title, content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

        const modalContent = document.createElement('div');
        modalContent.className = 'card';
        modalContent.style.cssText = `
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;

        modalContent.innerHTML = `
        <div class="card-header">
            <h3 class="card-title"></h3>
            <button data-modal-close style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>
        ${content}
    `;
        modalContent.querySelector('.card-title').textContent = title;

        modal.className = 'modal';
        modal.appendChild(modalContent);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

        const closeBtn = modal.querySelector('[data-modal-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.remove());
        }

        return modal;
    }

    closeAll() {
        document.querySelectorAll('.modal').forEach(modal => modal.remove());
    }
}