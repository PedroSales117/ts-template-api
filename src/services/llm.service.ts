import OpenAI from "openai";
import { Result, Ok, Err } from "../helpers/result.helper";
import logger from "../utils/logger";

/**
 * Service class for interacting with the OpenAI API.
 */
export class OpenAiService {
    private openai: OpenAI;

    /**
     * Initializes the OpenAiService with the given API key.
     * @param {string} api_key - The API key for OpenAI.
     */
    constructor(private api_key: string) {
        this.openai = new OpenAI({
            apiKey: this.api_key
        });
    }

    /**
     * Creates a new assistant thread.
     * @returns {Promise<Result<OpenAI.Beta.Threads.Thread, Error>>} - The created thread or an error.
     */
    private async createAssistantThread(): Promise<Result<OpenAI.Beta.Threads.Thread, Error>> {
        logger.info('Creating assistant thread...');
        try {
            const thread = await this.openai.beta.threads.create();
            return Ok(thread);
        } catch (error) {
            logger.error(`Error creating assistant thread: ${error}`);
            return Err(new Error(`Error creating assistant thread: ${error}`));
        }
    }

    /**
     * Adds a message to a thread and runs it.
     * @param {string} assistant_id - The assistant ID.
     * @param {OpenAI.Beta.Threads.Messages.MessageCreateParams} message_content - The content of the message.
     * @param {string[]} imagesBase64 - An array of images in base64 format.
     * @returns {Promise<Result<OpenAI.Beta.Threads.Messages.MessagesPage, Error>>} - The result of adding the message and running the thread.
     */
    async addMessageToThreadAndRun(assistant_id: string, message_content: OpenAI.Beta.Threads.Messages.MessageCreateParams, imagesBase64: string[]): Promise<Result<OpenAI.Beta.Threads.Messages.MessagesPage, Error>> {
        const threadResult = await this.createAssistantThread();
        if (threadResult.isErr()) {
            return Err(threadResult.error);
        }

        const thread = threadResult.value;
        logger.info(`Adding message to thread ${thread.id}...`);

        let content: any[] = [];
        if (imagesBase64.length > 0) {
            logger.info(`Uploading ${imagesBase64.length} images...`);
            const uploadResults = await this.uploadImages(imagesBase64);
            if (uploadResults.some(result => result.isErr())) {
                logger.error('Error uploading one or more images.');
                return Err(new Error('Error uploading one or more images'));
            }

            logger.info('All images uploaded successfully.');
            const attachments = uploadResults
                .filter((result): result is Result<string, Error> & { value: string } => result.isOk())
                .map(result => ({
                    file_id: result.value,
                    tools: [{ type: "file_search" as const }]
                }));

            content = attachments.map(attachment => ({
                type: "image_file" as const,
                image_file: { file_id: attachment.file_id }
            }));
        }

        content.push({
            type: "text",
            text: message_content.content as string
        });

        try {
            await this.openai.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: content
            });
            logger.info('Message added to thread.');

            const runResult = await this.createRun(assistant_id, thread);

            if (runResult.isErr()) {
                return Err(runResult.error);
            }

            const runStatus = await this.pollRunStatus(thread.id, runResult.value.id);
            if (runStatus === 'completed') {
                logger.info('Run completed successfully.');
                const messages = await this.openai.beta.threads.messages.list(runResult.value.thread_id);
                return Ok(messages);
            } else {
                return Err(new Error('The run did not complete successfully.'));
            }
        } catch (error) {
            logger.error(`Error adding message to thread: ${error}`);
            return Err(new Error(`Error adding message to thread: ${error}`));
        }
    }

    /**
     * Uploads an image in base64 format.
     * @param {string} imageBase64 - The base64 encoded image.
     * @returns {Promise<Result<string, Error>>} - The result of the image upload.
     */
    private async uploadImage(imageBase64: string): Promise<Result<string, Error>> {
        try {
            logger.info('Converting base64 image to Blob...');
            const blob = this.base64ToBlob(imageBase64, 'image/jpeg');
            const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });

            logger.info('Uploading image...');
            const response = await this.openai.files.create({
                file,
                purpose: 'vision'
            });
            logger.info(`Image uploaded successfully with ID: ${response.id}`);
            return Ok(response.id);
        } catch (error) {
            logger.error(`Error uploading image: ${error}`);
            return Err(new Error(`Error uploading image: ${error}`));
        }
    }

    /**
     * Uploads multiple images in base64 format.
     * @param {string[]} imagesBase64 - An array of base64 encoded images.
     * @returns {Promise<Result<string, Error>[]>} - The results of the image uploads.
     */
    private async uploadImages(imagesBase64: string[]): Promise<Result<string, Error>[]> {
        const uploadPromises = imagesBase64.map(imageBase64 => this.uploadImage(imageBase64));
        return Promise.all(uploadPromises);
    }

    /**
     * Converts a base64 string to a Blob.
     * @param {string} base64 - The base64 encoded string.
     * @param {string} mimeType - The MIME type of the data.
     * @returns {Blob} - The resulting Blob.
     */
    private base64ToBlob(base64: string, mimeType: string): Blob {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mimeType });
    }

    /**
     * Creates a run for the given thread.
     * @param {string} assistant_id - The assistant ID.
     * @param {OpenAI.Beta.Threads.Thread} thread - The thread for which to create the run.
     * @returns {Promise<Result<OpenAI.Beta.Threads.Runs.Run, Error>>} - The created run or an error.
     */
    private async createRun(assistant_id: string, thread: OpenAI.Beta.Threads.Thread): Promise<Result<OpenAI.Beta.Threads.Runs.Run, Error>> {
        try {
            logger.info('Creating run...');
            const run = await this.openai.beta.threads.runs.createAndPoll(thread.id, {
                assistant_id,
            });
            logger.info('Run created successfully.');
            return Ok(run);
        } catch (error) {
            logger.error(`Error creating run: ${error}`);
            return Err(new Error(`Error creating run: ${error}`));
        }
    }

    /**
     * Polls the status of a run until it is completed.
     * @param {string} thread_id - The ID of the thread.
     * @param {string} run_id - The ID of the run.
     * @returns {Promise<string>} - The status of the run.
     */
    private async pollRunStatus(thread_id: string, run_id: string): Promise<string> {
        while (true) {
            try {
                logger.info(`Checking run status for run ID: ${run_id}...`);
                const run = await this.openai.beta.threads.runs.retrieve(thread_id, run_id);
                if (run.status === 'completed') {
                    logger.info('Run status: completed.');
                    return 'completed';
                } else if (run.status === 'failed' || run.status === 'cancelled') {
                    throw new Error(`Run failed with status: ${run.status}`);
                }
                await this.sleep(5000);
            } catch (error) {
                logger.error(`Error checking run status: ${error}`);
                throw error;
            }
        }
    }

    /**
     * Sleeps for the given number of milliseconds.
     * @param {number} ms - The number of milliseconds to sleep.
     * @returns {Promise<void>} - A promise that resolves after the specified time.
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
