import { HttpStatus } from "../helpers/http-status.helper";
import { IRouter } from "../interfaces";
import { Router } from "./Router";
import { GenerateReportController } from "../controllers/generate-report.controller";
import { IBody } from "../interfaces/IGenerateReport";
import logger from "../utils/logger";

/**
 * Creates and returns a root router with a predefined status route and generate report route.
 * @returns {IRouter} - The configured router.
 */
export const generateReportRouter = (): IRouter => {
  const generate_report_router = new Router();
  const generateReportController = new GenerateReportController();

  /**
   * Define a route for generating a report.
   */
  generate_report_router.addRoute({
    path: "/report/generate", // The path for the generate report route.
    method: "POST", // HTTP method to respond to.
    handler: async (request, reply) => {
      try {
        const { content, imagesBase64 } = request.body as IBody;
        if (!content || !Array.isArray(imagesBase64)) {
          return reply.status(HttpStatus.BAD_REQUEST).send({
            error: `Invalid request body. Expected { content: string, imagesBase64: string[] }`
          });
        }

        const result = await generateReportController.generateReport(content, imagesBase64);
        if (result.isErr()) {
          return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: result.error.message
          });
        }

        reply.status(HttpStatus.OK).send(result.value);
      } catch (error) {
        logger.error(`Unhandled error: ${error}`);
        reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          error: "An unexpected error occurred"
        });
      }
    },
  });

  return generate_report_router; // Return the configured router.
};
