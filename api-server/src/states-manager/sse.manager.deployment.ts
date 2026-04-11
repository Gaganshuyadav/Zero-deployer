
import type { Response } from "express";

// it contains all clients for SSE stream events 
const SSE_Clients = new Map<string, Set<Response>>();

const testingLastEventId = 0;

export { SSE_Clients, testingLastEventId};
