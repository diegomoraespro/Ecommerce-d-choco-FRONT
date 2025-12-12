document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA 1: Upload de Foto (Preview Instantâneo) ---
    const photoInput = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('profile-image-preview');

    if(photoInput && photoPreview) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0]; // Pega o primeiro arquivo
            
            if (file) {
                // Cria um leitor de arquivos do navegador
                const reader = new FileReader();

                // Quando o leitor terminar de carregar...
                reader.onload = function(readerEvent) {
                    // Atualiza o SRC da imagem com o resultado (base64)
                    photoPreview.src = readerEvent.target.result;
                }

                // Lê o arquivo como URL de dados
                reader.readAsDataURL(file);
            }
        });
    }

    // --- LÓGICA 2: Edição de Texto (Mantida e melhorada) ---
    const rows = document.querySelectorAll('.editable-row');

    rows.forEach(row => {
        const editBtn = row.querySelector('.btn-edit');
        const actionButtons = row.querySelector('.action-buttons');
        const saveBtn = row.querySelector('.btn-save');
        const cancelBtn = row.querySelector('.btn-cancel');
        
        const viewText = row.querySelector('.view-text');
        const inputField = row.querySelector('.edit-input');

        if (!editBtn) return;

        // Entrar no modo edição
        editBtn.addEventListener('click', () => {
            viewText.classList.add('hidden');
            editBtn.classList.add('hidden');
            inputField.classList.remove('hidden');
            actionButtons.classList.remove('hidden');
            inputField.focus();
        });

        // Cancelar edição
        cancelBtn.addEventListener('click', () => {
            inputField.value = viewText.textContent; // Reseta valor
            toggleViewMode();
        });

        // Salvar edição
        saveBtn.addEventListener('click', () => {
            if (inputField.value.trim() !== "") {
                viewText.textContent = inputField.value;
                // Aqui você enviaria para o backend num cenário real
                toggleViewMode();
            } else {
                // Efeito visual de erro simples (borda vermelha)
                inputField.style.borderColor = "red";
                setTimeout(() => inputField.style.borderColor = "", 2000);
            }
        });

        function toggleViewMode() {
            viewText.classList.remove('hidden');
            editBtn.classList.remove('hidden');
            inputField.classList.add('hidden');
            actionButtons.classList.add('hidden');
        }
        
        // Atalho Enter para salvar
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveBtn.click();
        });
    });
});