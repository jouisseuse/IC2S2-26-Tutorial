import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LLMAgent } from "../agents/llm_agent";
import { MockModelClient } from "../model_adapters/mock_model_client";
import * as publicGoodsModule from "../../../shared/game_logic/public_goods/public_goods.logic";
import * as socialLearningModule from "../../../shared/game_logic/social_learning/social_learning.logic";
import * as dataExporterModule from "../../../shared/logging/data_exporter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");
const publicGoods = moduleExports(publicGoodsModule);
const socialLearning = moduleExports(socialLearningModule);
const dataExporter = moduleExports(dataExporterModule);
const {
  applyActions,
  createInitialState: createPublicGoodsState,
  exportRoundData,
  getObservationForAgent: getPublicGoodsObservation,
} = publicGoods;
const {
  applyActions: applySocialLearningActions,
  createInitialState: createSocialLearningState,
  getObservationForAgent: getSocialLearningObservation,
} = socialLearning;
const { toCSV, toJSONL } = dataExporter;

export interface SimulationOutput {
  records: Record<string, unknown>[];
  outputBase: string;
}

export async function runPublicGoodsSimulation(options: {
  groupSize?: number;
  numRounds?: number;
  endowment?: number;
  multiplier?: number;
  outputBase?: string;
} = {}): Promise<SimulationOutput> {
  const groupSize = options.groupSize ?? 4;
  const actorIds = Array.from({ length: groupSize }, (_, index) => `llm_${index + 1}`);
  let state = createPublicGoodsState(
    {
      gameId: "public_goods_llm_mock",
      groupId: "group_1",
      groupSize,
      numRounds: options.numRounds ?? 5,
      endowment: options.endowment ?? 10,
      multiplier: options.multiplier ?? 1.5,
      treatment: "llm_only_mock",
      feedbackType: "group",
    },
    actorIds,
    "llm"
  );

  const systemPrompt = await readPrompt("shared/prompts/public_goods/system.md");
  const decisionPrompt = await readPrompt("shared/prompts/public_goods/decision.md");
  const modelClient = new MockModelClient();
  const agents = actorIds.map(
    (actorId) => new LLMAgent({ actorId, modelClient, systemPrompt, decisionPrompt })
  );

  while (!state.ended) {
    const actions = await Promise.all(
      agents.map(async (agent) => {
        const observation = {
          ...getPublicGoodsObservation(state, agent.actorId),
          gameType: "public_goods",
          num_rounds: state.config.numRounds,
        };
        const action = await agent.act(observation);
        return {
          actorId: agent.actorId,
          actorType: "llm" as const,
          contribution: Number(action.contribution ?? 0),
        };
      })
    );
    state = applyActions(state, actions);
  }

  const records = exportRoundData(state);
  const outputBase = options.outputBase || "engines/llm_simulation/outputs/public_goods_mock";
  await writeOutputs(outputBase, records);
  return { records, outputBase };
}

export async function runSocialLearningSimulation(options: {
  groupSize?: number;
  numRounds?: number;
  trueValue?: number;
  outputBase?: string;
} = {}): Promise<SimulationOutput> {
  const groupSize = options.groupSize ?? 4;
  const actorIds = Array.from({ length: groupSize }, (_, index) => `llm_${index + 1}`);
  let state = createSocialLearningState(
    {
      gameId: "social_learning_llm_mock",
      groupId: "group_1",
      groupSize,
      numRounds: options.numRounds ?? 3,
      trueValue: options.trueValue ?? 50,
      treatment: "social_information",
      showGroupAverage: true,
    },
    actorIds
  );

  const systemPrompt = await readPrompt("shared/prompts/social_learning/system.md");
  const decisionPrompt = await readPrompt("shared/prompts/social_learning/estimate.md");
  const modelClient = new MockModelClient();
  const agents = actorIds.map(
    (actorId) => new LLMAgent({ actorId, modelClient, systemPrompt, decisionPrompt })
  );

  while (!state.ended) {
    const actions = await Promise.all(
      agents.map(async (agent, index) => {
        const privateSignal = 40 + index * 5 + state.round;
        const observation = {
          ...getSocialLearningObservation(state, agent.actorId),
          gameType: "social_learning",
          privateSignal,
        };
        const action = await agent.act(observation);
        return {
          actorId: agent.actorId,
          estimate: Number(action.estimate ?? privateSignal),
          confidence: Number(action.confidence ?? 0.5),
        };
      })
    );
    state = applySocialLearningActions(state, actions);
  }

  const records = state.history.flatMap((round) =>
    round.estimates.map((estimate) => ({
      game_id: round.gameId,
      group_id: round.groupId,
      round: round.round,
      actor_id: estimate.actorId,
      actor_type: "llm",
      action_type: "estimate",
      action_value: estimate.estimate,
      confidence: estimate.confidence ?? null,
      group_average: round.groupAverage,
      absolute_error: round.absoluteError,
      treatment: state.config.treatment,
      timestamp: round.timestamp,
    }))
  );
  const outputBase = options.outputBase || "engines/llm_simulation/outputs/social_learning_mock";
  await writeOutputs(outputBase, records);
  return { records, outputBase };
}

export async function writeOutputs(outputBase: string, records: Record<string, unknown>[]) {
  const absoluteBase = resolve(repoRoot, outputBase);
  await mkdir(dirname(absoluteBase), { recursive: true });
  await writeFile(`${absoluteBase}.jsonl`, toJSONL(records), "utf8");
  await writeFile(`${absoluteBase}.csv`, toCSV(records), "utf8");
}

async function readPrompt(relativePath: string): Promise<string> {
  return readFile(resolve(repoRoot, relativePath), "utf8");
}

function moduleExports<T extends Record<string, unknown>>(module: T): T {
  return ((module as { default?: T }).default ?? module) as T;
}
