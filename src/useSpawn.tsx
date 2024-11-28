import { useCallback, useState } from "react";
import * as bufout from "bufout";

type IdleStatus = {
  status: "idle";
};

type CommandStatus = {
  command: string;
  args: string[];
};

type RunningStatus = {
  status: "running";
} & CommandStatus;

type SucceededStatus = {
  status: "succeeded";
} & CommandStatus;

type FailedStatus = {
  status: "failed";
  error: bufout.SpawnFailure;
} & CommandStatus;

type StatusResult = IdleStatus | RunningStatus | SucceededStatus | FailedStatus;

type SyncSpawnCallback = (...args: Parameters<typeof bufout.spawn>) => void;

export type SpawnResult = {
  spawn: SyncSpawnCallback;
  status: StatusResult["status"];
  command?: string;
  args?: string[];
  error?: bufout.SpawnFailure;
} & StatusResult;

export function useSpawn(onCompletion?: (error?: bufout.SpawnFailure) => void): SpawnResult {
  const [statusResult, setStatusResult] = useState<StatusResult>({
    status: "idle",
  });

  const spawn = useCallback<SyncSpawnCallback>(
    (command, args, options) => {
      setStatusResult({ status: "running", command, args });
      const child = bufout.spawn(command, args, options);
      child.then(
        () => {
          setStatusResult({ status: "succeeded", command, args });
          if (onCompletion) {
            onCompletion();
          }
        },
        (error) => {
          if (error instanceof bufout.SpawnFailure) {
            // Propagate the exit code
            if (typeof error.code === "number") {
              process.exitCode = error.code;
            }
            setStatusResult({ status: "failed", command, args, error });
            if (onCompletion) {
              onCompletion(error);
            }
          } else {
            // TODO: Find a better way of handling unexpected errors
            throw error;
          }
        }
      );
      return () => {
        child.kill();
      };
    },
    [setStatusResult]
  );
  return { ...statusResult, spawn };
}
