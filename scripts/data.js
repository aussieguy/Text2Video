// Data management and model simulation
async function getApiKey() {
  return await fetchApiKey(); // Fetch all the API keys from the server
}

class DataManager {
    constructor() {
        this.BASE_URL = 'https://pollo.ai/api/platform/generation';
        this.POLL_INTERVAL = 20000; // Check status every 20 seconds
        this.apiKeyInitialized = false;
        this.apiKeyPromise = this.initApiKey();
    }
    
    async initApiKey() {
        try {
            const keys = await getApiKey();
            if (keys) {                
                const [apiKey, _] = keys;
                this.apiKey = apiKey;
                this.apiKeyInitialized = true;
            } else {
                throw new Error("Failed to retrieve API key");
            }
        } catch (error) {
            console.error("Error initializing API key:", error);
            throw error;
        }
    }

    async ensureApiKeyInitialized() {
        if (!this.apiKeyInitialized) {
            await this.apiKeyPromise;
        }
        return this.apiKey;
    }
        
    async generateVideo(params) {         
        const { model, prompt, resolution, length, aspectRatio, image } = params; 
        try {
            // Ensure API key is initialized before starting
            await this.ensureApiKeyInitialized();
            
            // Initial generation request
            const taskId = await this.startGeneration(prompt, resolution, length, aspectRatio, image);
            
            // Poll for status until complete
            const videoUrl = await this.pollGenerationStatus(taskId);
            return videoUrl;
            
        } catch (error) {
            console.error('Video generation error:', error);
            throw error;
        }
    }
    
    async startGeneration(prompt, resolution, length, aspectRatio, image) {
        // Ensure API key is initialized
        await this.ensureApiKeyInitialized();
        const options = {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey, // Use lowercase apiKey to match the property name
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "input": { "prompt": prompt,
                                              "resolution": resolution,
                                              "length": Number(length),
                                              "aspectRatio": aspectRatio,
                                              "image": image ? image : null  // Use image if provided, otherwise null
                                }})
        };
        try {
            // Make the initial request to start video generation
            // Note: The endpoint may vary based on the model, adjust accordingly            
            const response = await fetch(`${this.BASE_URL}/pollo/pollo-v1-6`, options);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to start video generation');
            }

            if (!data.data || !data.data.taskId) {
                throw new Error('No taskId received in response');
            }

            return data.data.taskId;
        } catch (error) {
            console.error('Start generation error:', error);
            throw error;
        }
    }

    async pollGenerationStatus(taskId) {
        // Ensure API key is initialized
        await this.ensureApiKeyInitialized();
        
        const options = {
            method: 'GET',
            headers: {
                'x-api-key': this.apiKey // Use lowercase apiKey to match the property name
            }
        };

        while (true) {
            try {
                // Poll the status endpoint for the current taskId
                const response = await fetch(`${this.BASE_URL}/${taskId}/status`, options);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to check generation status');
                }

                const generations = data.data && Array.isArray(data.data.generations) ? data.data.generations : [];
                const generation = generations[0];
                const url = generation && generation.url ? generation.url : null;
                const status = generation && generation.status ? generation.status : null;
  
                switch (status) {
                    case 'succeed':
                        // Video generation completed successfully
                        if (url) {                            
                            return url;
                        } else {
                            throw new Error('No video URL found in response');
                        }
                    case 'waiting':
                    case 'processing': // Fixed the case condition
                        // Still waiting for generation to complete
                        await new Promise(resolve => setTimeout(resolve, this.POLL_INTERVAL));
                        break; // Added break statement to avoid falling through
                    default:
                        // Handle unexpected status
                        console.warn(`Unexpected status: ${status}`);
                        await new Promise(resolve => setTimeout(resolve, this.POLL_INTERVAL));
                        break;
                }
            } catch (error) {
                console.error('Poll status error:', error);
                throw error;
            }
        }
    }

    validatePrompt(prompt) {
        return prompt.trim().length > 0 && prompt.length <= 500;
    }

    validateImage(file) {
        if (!file) return false;
        
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        return validTypes.includes(file.type);
    }
}
