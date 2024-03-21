import { rootRoute } from "./routes";
import { HttpServer } from "./configurations/server";

const app = async (): Promise<void> => {
  const server = new HttpServer();

  await server.useRouters([rootRoute()]);

  const port = Number(process.env.PORT) || 3000;

  const listenResult = await server.listen(port);
  if (listenResult.isErr()) {
    console.error(`Error starting server: ${listenResult.error}`);
  }
};

void app();
