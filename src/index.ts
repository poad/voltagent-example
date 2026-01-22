import "dotenv/config";
import { bedrock } from "@ai-sdk/amazon-bedrock";
import {
	Agent,
	Memory,
	VoltAgent,
	VoltAgentObservability,
	VoltOpsClient,
} from "@voltagent/core";
import {
	LibSQLMemoryAdapter,
	LibSQLObservabilityAdapter,
} from "@voltagent/libsql";
import { createPinoLogger } from "@voltagent/logger";
import { honoServer } from "@voltagent/server-hono";
import { weatherTool } from "./tools";
import { expenseApprovalWorkflow } from "./workflows";

// Create a logger instance
const logger = createPinoLogger({
	name: "voltagent-example",
	level: "info",
});

// Configure persistent memory (LibSQL / SQLite)
const memory = new Memory({
	storage: new LibSQLMemoryAdapter({
		url: "file:./.voltagent/memory.db",
		logger: logger.child({ component: "libsql" }),
	}),
});

// Configure persistent observability (LibSQL / SQLite)
const observability = new VoltAgentObservability({
	storage: new LibSQLObservabilityAdapter({
		url: "file:./.voltagent/observability.db",
	}),
});

const agent = new Agent({
	name: "voltagent-example",
	instructions:
		"A helpful assistant that can check weather and help with various tasks",
	model: bedrock("openai.gpt-oss-20b-1:0"),
	tools: [weatherTool],
	memory,
});

new VoltAgent({
	agents: {
		agent,
	},
	workflows: {
		expenseApprovalWorkflow,
	},
	server: honoServer(),
	logger,
	observability,
	voltOpsClient: new VoltOpsClient({
		publicKey: process.env.VOLTAGENT_PUBLIC_KEY || "",
		secretKey: process.env.VOLTAGENT_SECRET_KEY || "",
	}),
});
