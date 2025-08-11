// UI management and interactions
class UIManager {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.updateCharacterCount('text-prompt', 'text-char-count');
        this.updateCharacterCount('image-prompt', 'image-char-count');
    }

    initElements() {
        // Navigation
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Panels
        this.textPanel = document.getElementById('text-to-video-panel');
        this.imagePanel = document.getElementById('image-to-video-panel');
        
        // Forms
        this.textForm = this.textPanel.querySelector('form');
        this.imageForm = this.imagePanel.querySelector('form');
        
        // File upload
        this.fileInput = document.getElementById('image-upload');
        this.uploadButton = document.querySelector('.upload-button');
        this.fileName = document.querySelector('.file-name');
        
        // Video player
        this.videoPlayer = document.getElementById('video-player');

        // Custom Select
        this.customSelect = document.querySelector('.custom-select');
        this.selectedDiv = document.querySelector('.select-selected');
        this.selectItems = document.querySelector('.select-items');

        // Create button
        this.createButton = document.getElementById('create-button');

    }

    initEventListeners() {
        // Create button click event
        this.createButton.addEventListener('click', () => {
            // Unhide the wait message and video to display
            document.getElementById('wait-message').hidden = false; 
            document.getElementById('panel-content').hidden = false;
        });

        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.switchPanel(link));
        });

        // File upload
        this.uploadButton.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', () => this.handleFileSelect());

        // Character counters
        document.getElementById('text-prompt').addEventListener('input', (e) => 
            this.updateCharacterCount('text-prompt', 'text-char-count'));
        document.getElementById('image-prompt').addEventListener('input', (e) => 
            this.updateCharacterCount('image-prompt', 'image-char-count'));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Custom Select
        if (this.selectedDiv && this.selectItems) {
            this.selectedDiv.addEventListener('click', () => this.toggleSelect());
            this.selectedDiv.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleSelect();
                }
            });

            // Close select box when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.customSelect.contains(e.target)) {
                    this.closeSelect();
                }
            });

            // Handle option selection
            this.selectItems.querySelectorAll('.model-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const modelName = option.querySelector('.model-name').textContent;
                    const modelDesc = option.querySelector('.model-description').textContent;
                    const modelIcon = option.querySelector('.model-icon').src;
                    const value = option.dataset.value;
                    
                    // Update the selected display
                    this.selectedDiv.querySelector('.model-icon').src = modelIcon;
                    this.selectedDiv.querySelector('.model-name').textContent = modelName;
                    this.selectedDiv.querySelector('.model-description').textContent = modelDesc;
                    
                    // Update the hidden select
                    document.getElementById('text-model').value = value;
                    
                    this.closeSelect();
                });
            });
        }
    }

    toggleSelect() {
        this.selectItems.classList.toggle('select-hide');
        this.selectedDiv.classList.toggle('select-arrow-active');
    }

    closeSelect() {
        this.selectItems.classList.add('select-hide');
        this.selectedDiv.classList.remove('select-arrow-active');
    }

    switchPanel(clickedLink) {
        // Update navigation
        this.navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');

        // Show/hide panels
        const panelType = clickedLink.dataset.panel;
        this.textPanel.classList.toggle('hidden', panelType !== 'text-to-video');
        this.imagePanel.classList.toggle('hidden', panelType !== 'image-to-video');
    }

    handleFileSelect() {
        const file = this.fileInput.files[0];
        if (file) {
            this.fileName.textContent = file.name;
            this.uploadButton.textContent = 'Change Image';
        } else {
            this.fileName.textContent = '';
            this.uploadButton.textContent = 'Upload Image';
        }
    }

    updateCharacterCount(textareaId, counterId) {
        const textarea = document.getElementById(textareaId);
        const counter = document.getElementById(counterId);
        counter.textContent = textarea.value.length;
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activePanel = document.querySelector('.panel-content:not(.hidden)');
            const form = activePanel.querySelector('form');
            form.requestSubmit();
        }
    }

    setLoading(form, isLoading) {
        const button = form.querySelector('.create-button');
        button.disabled = isLoading;
        button.classList.toggle('loading', isLoading);
    }

    updateVideo(videoUrl) {
        this.videoPlayer.src = videoUrl;
        this.videoPlayer.load();
        this.videoPlayer.play();
    }

    showError(message) {
        // In a real implementation, this would show a proper error message UI
        alert(message);
    }
}
