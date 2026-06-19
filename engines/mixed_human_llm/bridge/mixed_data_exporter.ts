import * as dataExporterModule from "../../../shared/logging/data_exporter";
import type { SharedActionRecord } from "./action_merger";

const dataExporter =
  ((dataExporterModule as { default?: typeof dataExporterModule }).default ??
    dataExporterModule);
const { toCSV, toJSONL } = dataExporter;

export function exportMixedActions(records: SharedActionRecord[]) {
  return {
    jsonl: toJSONL(records),
    csv: toCSV(records),
  };
}
