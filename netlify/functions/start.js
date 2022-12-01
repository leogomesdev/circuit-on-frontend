import serverless from "serverless-http";
import { app } from "./dist/propaganda-scheduler/server/main";

export const handler = serverless(app());