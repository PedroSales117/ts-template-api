/**
 * The IRootRequest interface defines the structure of the request object
 * expected by the RootController when handling requests that include a test message.
 */
export interface IRootRequest {
    /**
     * A test message that is included in the request.
     */
    test_message: string;
}
