import React, { useEffect } from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { SpawnFailure, type SpawnOptions } from "bufout";

import { useSpawn } from "./useSpawn.js";
import { useOutputStreams } from "./useOutputStreams.js";

export type SpawnProps = {
  command: string;
  args: string[];
  onCompletion?: (error?: SpawnFailure) => void;
  maxOutputLines?: number;
  silent?: boolean;
  runningText?: string;
  successText?: string;
  failureText?: string;
} & Omit<SpawnOptions, "outputMode">;

export function Spawn({
  command,
  args,
  onCompletion,
  maxOutputLines = 5,
  silent = false,
  runningText = `Running '${command} ${args.join(" ")}'`,
  successText = `Ran '${command} ${args.join(" ")}'`,
  failureText = `Failed to run '${command} ${args.join(" ")}'`,
  ...options
}: SpawnProps) {
  const { spawn, status } = useSpawn(onCompletion);
  const { allOutput, errOutput, stdout, stderr } =
    useOutputStreams(maxOutputLines);

  useEffect(() => {
    spawn(command, args, {
      stdout,
      stderr,
      ...options,
      outputMode: "inherit",
    });
  }, []);

  // TODO: Move the output into it's own component and use in status === "running" if output mode is inherit

  if (status === "idle" || status === "running") {
    return (
      <>
        <Text>
          <Text dimColor>
            <Spinner />
          </Text>
          {" " + runningText}
        </Text>
        {allOutput && !silent && (
          <Box paddingX={1} borderStyle="round" width="100%" borderDimColor>
            <Text dimColor>{allOutput}</Text>
          </Box>
        )}
      </>
    );
  } else if (status === "succeeded") {
    return (
      <Text>
        <Text color="green">✔</Text>
        {" " + successText}
      </Text>
    );
  } else if (status === "failed") {
    return (
      <>
        <Text>
          <Text color="red">✗</Text>
          {" " + failureText}
        </Text>
        {errOutput && !silent && (
          <Box
            paddingX={1}
            borderStyle="round"
            width="100%"
            borderColor="red"
            borderDimColor
          >
            <Text>{errOutput}</Text>
          </Box>
        )}
      </>
    );
  } else {
    return null;
  }
}
