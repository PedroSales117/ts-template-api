import { RootService } from "../services/Root.service";
import { HttpStatus } from "../helpers/http-status.helper";
import { RootServiceFactory } from '../factories/Root.factory';
import { AdapterReply, AdapterRequest } from "../configurations/adapters/server.adapter";
import { IRootRequest } from "../interfaces/IRootRequest";

/**
 * The RootController class handles incoming HTTP requests related to the root status
 * and delegates the processing to the RootService.
 */
export class RootController {
  private rootService: RootService;

  /**
   * Initializes the RootController by creating an instance of RootService
   * using the RootServiceFactory.
   */
  constructor() {
    this.rootService = RootServiceFactory.create();
  }

  /**
   * Handles the HTTP request to return the status message combined with a test message.
   * Extracts the test message from the request body and delegates to the RootService.
   *
   * @param request - The incoming request object, which should contain the test message in the body.
   * @param reply - The reply object used to send back the HTTP response.
   * @returns A Promise that resolves when the response is sent.
   */
  async returnStatusMessage(request: AdapterRequest, reply: AdapterReply) {
    const { test_message } = request.body as IRootRequest;

    const statusMessage = await this.rootService.returnStatusMessage(test_message);

    statusMessage.match(
      status => reply.status(HttpStatus.OK).send(status),
      error => reply.status(HttpStatus.BAD_REQUEST).send({ message: error.message })
    );
  }
}
