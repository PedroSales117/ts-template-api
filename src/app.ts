import { rootRoute } from "./routes";
import { HttpServer } from "./configurations/server";

const app = async (): Promise<void> => {
  const server = new HttpServer();
  server.useRouters([rootRoute()]);

  const listenResult = await server.listen(Number(process.env.PORT) | 3000);
  if (listenResult.isErr())
    console.error(`Error starting server: ${listenResult.error}`);
};

void app();
