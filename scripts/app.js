// Main application logic
let uploadTask;
class App {
    constructor() {
        this.ui = new UIManager();
        this.data = new DataManager();
        this.initFormHandlers();
    }

    initFormHandlers() {
        // Text to Video form
        this.ui.textForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleTextToVideo();
        });

        // Image to Video form
        this.ui.imageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleImageToVideo();
        });
    }

    async handleTextToVideo() {
        const model = document.getElementById('text-model').value;
        const prompt = document.getElementById('text-prompt').value;
        const resolution = document.getElementById('text-resolution').value;
        const length = document.getElementById('text-video-length').value;
        const aspectRatio = document.getElementById('text-aspect-ratio').value;
        
        if (!this.data.validatePrompt(prompt)) {
            this.ui.showError('Please enter a valid prompt (1-500 characters)');
            return;
        }

        try {
            this.ui.setLoading(this.ui.textForm, true);
            const videoUrl = await this.data.generateVideo({ 
                model, 
                prompt, 
                resolution, 
                length, 
                aspectRatio });

            // Unhide the video player and hide the header message
            document.getElementById('wait-message').hidden = true;
            document.getElementById('panel-content').hidden = false;

            // Hide the spinner and show the button text
            document.querySelector('.spinner').style.display = 'none'; 
            this.ui.createButton.querySelector('.button-text').style.display = 'block';

            this.ui.updateVideo(videoUrl);
        } catch (error) {
            this.ui.showError('Failed to generate video. Please try again.');

            console.error('Video generation error:', error);
        } finally {
            this.ui.setLoading(this.ui.textForm, false);
        }
    }

    async handleImageToVideo() {
        const model = document.getElementById('image-model').value;
        const prompt = document.getElementById('image-prompt').value;
        const resolution = document.getElementById('image-resolution').value;
        const length = document.getElementById('image-video-length').value;
        const imageFile = document.getElementById('image-upload').files[0];

        if (!this.data.validatePrompt(prompt)) {
            this.ui.showError('Please enter a valid prompt (1-500 characters)');
            return;
        }

        if (!this.data.validateImage(imageFile)) {
            this.ui.showError('Please upload a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        try {
            this.ui.setLoading(this.ui.imageForm, true);
            
            // Upload image to Firebase Storage
            const downloadURL = await this.uploadImageToFirebase(imageFile);  

            // Make API call with the uploaded image URL
            const videoUrl = await this.data.generateVideo({ 
                model, 
                prompt, 
                resolution, 
                length, 
                image: downloadURL 
            });
            
            // Video generation successful            
            this.ui.updateVideo(videoUrl);

            // Delete the uploaded image file from Firebase Storage as it's no longer needed
            uploadTask.snapshot.ref.delete();

        } catch (error) {
            this.ui.showError('Failed to generate video. Please try again.');
            console.error('Video generation error:', error);
        } finally {
            this.ui.setLoading(this.ui.imageForm, false);
            if (this.ui.imageForm) {
                // Hide the spinner and show the button text
                document.querySelector('.spinner').style.display = 'none'; 
                this.ui.createButton.querySelector('.button-text').style.display = 'block';
            }
            // Unhide video panel and hide wait message
            const videoPanel = document.getElementById('panel-content');
            const waitMessage = document.getElementById('wait-message');
            if (videoPanel) videoPanel.hidden = false;
            if (waitMessage) waitMessage.hidden = true;
        }
    }
    
    uploadImageToFirebase(imageFile) {
        return new Promise((resolve, reject) => {
            let storageRef = firebase.storage().ref();
            uploadTask = storageRef.child('images/' + Date.now() + '_' + imageFile.name).put(imageFile);

            // Monitor the upload progress
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    // Get task progress, e.g., percentage completed
                    // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.error('Upload failed:', error);
                    reject(error);
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then(downloadURL => {
                            // console.log('File available at', downloadURL);
                            resolve(downloadURL);
                        })
                        .catch(error => {
                            console.error('Error getting download URL:', error);
                            reject(error);
                        });
                }
            );
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
