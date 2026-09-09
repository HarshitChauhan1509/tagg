import { pipeline, env } from '@xenova/transformers';

// Skip local model check since we are running in the browser
env.allowLocalModels = false;
// Configure WASM to prevent memory spikes
env.backends.onnx.wasm.numThreads = 1;

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

export const CLOTHING_CATEGORIES = ['top', 'bottom', 'outerwear', 'shoes', 'dress', 'accessory'];
export const CLOTHING_TYPES = ['t-shirt', 'shirt', 'sweater', 'jeans', 'trousers', 'shorts', 'skirt', 'jacket', 'blazer', 'coat', 'sneakers', 'boots', 'heels', 'dress'];
export const COLORS = ['black', 'white', 'gray', 'red', 'blue', 'green', 'yellow', 'brown', 'pink', 'purple', 'beige', 'navy'];
export const STYLES = ['casual', 'formal', 'smart casual', 'streetwear', 'vintage', 'sporty'];
export const FITS = ['regular', 'slim', 'oversized', 'baggy', 'tight'];

export async function analyzeImage(imageBase64: string, onProgress: (msg: string, percent?: number) => void) {
    try {
        const classifier = await PipelineSingleton.getInstance((x: any) => {
            if (x.status === 'progress') {
                onProgress(`Downloading AI... ${x.progress ? Math.round(x.progress) : 0}%`, x.progress);
            } else if (x.status === 'ready') {
                onProgress("AI model ready!");
            } else if (x.status === 'initiate') {
                onProgress("Initializing AI weights...");
            }
        });

        onProgress('Identifying category...');
        const categoryResult = await classifier(imageBase64, CLOTHING_CATEGORIES);
        const topCategory = categoryResult[0].label;

        onProgress('Identifying type...');
        const typeResult = await classifier(imageBase64, CLOTHING_TYPES);
        const topType = typeResult[0].label;

        onProgress('Analyzing color...');
        const colorResult = await classifier(imageBase64, COLORS);
        const topColor = colorResult[0].label;

        onProgress('Determining style...');
        const styleResult = await classifier(imageBase64, STYLES);
        const topStyle = styleResult[0].label;

        onProgress('Detecting fit...');
        const fitResult = await classifier(imageBase64, FITS);
        const topFit = fitResult[0].label;

        let formality = 5;
        if (['blazer', 'suit', 'dress trousers', 'oxfords'].includes(topType)) formality += 3;
        if (['t-shirt', 'sweatpants', 'sneakers', 'shorts'].includes(topType)) formality -= 3;
        if (topStyle === 'formal') formality += 2;
        if (topStyle === 'casual' || topStyle === 'sporty') formality -= 2;
        formality = Math.max(1, Math.min(10, formality));

        return {
            category: topCategory,
            type: topType,
            color: topColor,
            style: topStyle,
            fit: topFit,
            formality,
            pattern: 'solid',
            occasions: ['casual']
        };
    } catch (error: any) {
        console.error("AI Pipeline Error:", error);
        throw new Error(error?.message || "Failed to analyze image");
    }
}
