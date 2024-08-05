import { IMessagesPage } from "../interfaces/Illm";
import { OpenAiService } from "../services/llm.service";
import logger from "../utils/logger";
import { Result } from "../helpers/result.helper";

/**
 * GenerateReportController handles the generation of reports using OpenAI's API.
 */
export class GenerateReportController {
    private llmService = new OpenAiService(process.env.OPENAI_API_KEY);

    /**
     * Generates a report based on the provided content and images.
     * @param {string} content - The textual content to be included in the report.
     * @param {string[]} imagesBase64 - An array of images in base64 format.
     * @returns {Promise<Result<IMessagesPage, Error>>} - A promise that resolves to the result of the report generation.
     */
    async generateReport(content: string, imagesBase64: string[]): Promise<Result<IMessagesPage, Error>> {
        const assistant_id = 'asst_Jxie9zd3UKZrgYPM2Y1qnQvi';

        logger.info(`${imagesBase64.length} imagens recebidas...`);
        logger.info('Gerando Laudo generativo...');
        
        const result = await this.llmService.addMessageToThreadAndRun(assistant_id, {
            role: 'user',
            content: content
        }, imagesBase64);
        
        if (result.isErr()) {
            logger.error(`Erro ao gerar laudo: ${result.error}`);
        }
        
        logger.info('Laudo generativo gerado com sucesso!');
        return result;
    }
}
