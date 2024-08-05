import OpenAI from "openai";
import { Result, Ok, Err } from "../helpers/result.helper";
import logger from "../utils/logger";

export class OpenAiService {
    private openai: OpenAI;

    constructor(private api_key: string) {
        this.openai = new OpenAI({
            apiKey: this.api_key
        });
    }

    private async createAssistantThread(): Promise<Result<OpenAI.Beta.Threads.Thread, Error>> {
        logger.info('Criando thread do assistente...');
        try {
            const thread = await this.openai.beta.threads.create();
            return Ok(thread);
        } catch (error) {
            logger.error(`Erro ao criar thread do assistente: ${error}`);
            return Err(new Error(`Erro ao criar thread do assistente: ${error}`));
        }
    }

    async addMessageToThreadAndRun(assistant_id: string, message_content: OpenAI.Beta.Threads.Messages.MessageCreateParams, imagesBase64: string[]): Promise<Result<OpenAI.Beta.Threads.Messages.MessagesPage, Error>> {
        const threadResult = await this.createAssistantThread();
        if (threadResult.isErr()) {
            return Err(threadResult.error);
        }

        const thread = threadResult.value;
        logger.info(`Adicionando mensagem à thread ${thread.id}...`);

        let content: any[] = [];
        if (imagesBase64.length > 0) {
            logger.info(`Fazendo upload de ${imagesBase64.length} imagens...`);
            const uploadResults = await this.uploadImages(imagesBase64);
            if (uploadResults.some(result => result.isErr())) {
                logger.error('Erro ao fazer upload de uma ou mais imagens.');
                return Err(new Error('Erro ao fazer upload de uma ou mais imagens'));
            }

            logger.info('Todas as imagens foram enviadas com sucesso.');
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
            logger.info('Mensagem adicionada à thread.');

            const runResult = await this.createRun(assistant_id, thread);

            if (runResult.isErr()) {
                return Err(runResult.error);
            }

            const runStatus = await this.pollRunStatus(thread.id, runResult.value.id);
            if (runStatus === 'completed') {
                logger.info('Execução concluída com sucesso.');
                const messages = await this.openai.beta.threads.messages.list(runResult.value.thread_id);
                return Ok(messages);
            } else {
                return Err(new Error('A execução não foi concluída com sucesso.'));
            }
        } catch (error) {
            logger.error(`Erro ao adicionar mensagem à thread: ${error}`);
            return Err(new Error(`Erro ao adicionar mensagem à thread: ${error}`));
        }
    }

    private async uploadImage(imageBase64: string): Promise<Result<string, Error>> {
        try {
            logger.info('Convertendo imagem base64 para Blob...');
            const blob = this.base64ToBlob(imageBase64, 'image/jpeg');
            const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });

            logger.info('Fazendo upload da imagem...');
            const response = await this.openai.files.create({
                file,
                purpose: 'vision'
            });
            logger.info(`Imagem enviada com sucesso com ID: ${response.id}`);
            return Ok(response.id);
        } catch (error) {
            logger.error(`Erro ao fazer upload da imagem: ${error}`);
            return Err(new Error(`Erro ao fazer upload da imagem: ${error}`));
        }
    }

    private async uploadImages(imagesBase64: string[]): Promise<Result<string, Error>[]> {
        const uploadPromises = imagesBase64.map(imageBase64 => this.uploadImage(imageBase64));
        return Promise.all(uploadPromises);
    }

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

    private async createRun(assistant_id: string, thread: OpenAI.Beta.Threads.Thread): Promise<Result<OpenAI.Beta.Threads.Runs.Run, Error>> {
        try {
            logger.info('Criando execução...');
            const run = await this.openai.beta.threads.runs.createAndPoll(thread.id, {
                assistant_id,
            });
            logger.info('Execução criada com sucesso.');
            return Ok(run);
        } catch (error) {
            logger.error(`Erro ao criar execução: ${error}`);
            return Err(new Error(`Erro ao criar execução: ${error}`));
        }
    }

    private async pollRunStatus(thread_id: string, run_id: string): Promise<string> {
        while (true) {
            try {
                logger.info(`Verificando status da execução para o ID de execução: ${run_id}...`);
                const run = await this.openai.beta.threads.runs.retrieve(thread_id, run_id);
                if (run.status === 'completed') {
                    logger.info('Status da execução: concluída.');
                    return 'completed';
                } else if (run.status === 'failed' || run.status === 'cancelled') {
                    throw new Error(`A execução falhou com status: ${run.status}`);
                }
                await this.sleep(5000);
            } catch (error) {
                logger.error(`Erro ao verificar o status da execução: ${error}`);
                throw error;
            }
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
