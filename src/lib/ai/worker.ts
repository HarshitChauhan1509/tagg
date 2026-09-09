import { pipeline, env } from '@xenova/transformers';

// Skip local model check since we are running in the browser
env.allowLocalModels = false;

// We'll use a zero-shot image classification model
// It allows us to pass an image and a set of candidate labels.
class PipelineSingleton {
    static task = 'zero-shot-image-classification';
    static model = 'Xenova/clip-vit-base-patch32';
    static instance: any = null;

    static async getInstance(progress_callback?: Function) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task as any, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Labels we want to classify for fashion
const CLOTHING_CATEGORIES = ['top', 'bottom', 'outerwear', 'shoes', 'dress', 'accessory'];
const CLOTHING_TYPES = ['t-shirt', 'shirt', 'sweater', 'jeans', 'trousers', 'shorts', 'skirt', 'jacket', 'blazer', 'coat', 'sneakers', 'boots', 'heels', 'dress'];
const COLORS = ['black', 'white', 'gray', 'red', 'blue', 'green', 'yellow', 'brown', 'pink', 'purple', 'beige', 'navy'];
const STYLES = ['casual', 'formal', 'smart casual', 'streetwear', 'vintage', 'sporty'];
const FITS = ['regular', 'slim', 'oversized', 'baggy', 'tight'];

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    try {
        const { imageBase64 } = event.data;

        // Initialize pipeline
        const classifier = await PipelineSingleton.getInstance((x: any) => {
            // We can send progress back to main thread if needed
            self.postMessage({ status: 'progress', progress: x });
        });

        // Run classifications one by one
        // Note: Transformers.js zero-shot image classification expects an image URL or Blob/DataURL
        
        self.postMessage({ status: 'progress_msg', message: 'Identifying category...' });
        const categoryResult = await classifier(imageBase64, CLOTHING_CATEGORIES);
        const topCategory = categoryResult[0].label;

        self.postMessage({ status: 'progress_msg', message: 'Identifying type...' });
        const typeResult = await classifier(imageBase64, CLOTHING_TYPES);
        const topType = typeResult[0].label;

        self.postMessage({ status: 'progress_msg', message: 'Analyzing color...' });
        const colorResult = await classifier(imageBase64, COLORS);
        const topColor = colorResult[0].label;

        self.postMessage({ status: 'progress_msg', message: 'Determining style...' });
        const styleResult = await classifier(imageBase64, STYLES);
        const topStyle = styleResult[0].label;

        self.postMessage({ status: 'progress_msg', message: 'Detecting fit...' });
        const fitResult = await classifier(imageBase64, FITS);
        const topFit = fitResult[0].label;

        // Formality heuristic based on type and style
        let formality = 5;
        if (['blazer', 'suit', 'dress trousers', 'oxfords'].includes(topType)) formality += 3;
        if (['t-shirt', 'sweatpants', 'sneakers', 'shorts'].includes(topType)) formality -= 3;
        if (topStyle === 'formal') formality += 2;
        if (topStyle === 'casual' || topStyle === 'sporty') formality -= 2;
        formality = Math.max(1, Math.min(10, formality));

        const result = {
            category: topCategory,
            type: topType,
            color: topColor,
            style: topStyle,
            fit: topFit,
            formality,
            pattern: 'solid', // Simplified for MVP
            occasions: ['casual'] // Will be adjusted later
        };

        // Send the output back to the main thread
        self.postMessage({
            status: 'complete',
            result: result
        });

    } catch (error: any) {
        self.postMessage({ status: 'error', error: error.message });
    }
});
