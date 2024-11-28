import { Writable } from "node:stream";
import { useCallback, useMemo, useState } from "react";

function capped(input: string, maxLines: number) {
  if (maxLines === 0) {
    return "";
  } else {
    return input.split("\n").slice(-maxLines).join("\n");
  }
}

export function useOutputStreams(maxLines: number) {
  const [allOutput, setAllOutput] = useState<string>("");
  const appendAllOutput = useCallback((chunk: Buffer) => {
    setAllOutput((prev) => {
      const allOutput = prev + chunk.toString();
      return capped(allOutput, maxLines);
    });
  }, [setAllOutput, maxLines]);

  const [errOutput, setErrOutput] = useState<string>("");
  const stdout = useMemo(
    () =>
      new Writable({
        write(chunk: Buffer, _, callback) {
          appendAllOutput(chunk);
          callback();
        },
      }),
    [appendAllOutput]
  );
  const stderr = useMemo(
    () =>
      new Writable({
        write(chunk: Buffer, _, callback) {
          setErrOutput((prev) => prev + chunk.toString());
          appendAllOutput(chunk);
          callback();
        },
      }),
    [setErrOutput]
  );
  return { allOutput: allOutput.trim(), errOutput: errOutput.trim(), stdout, stderr };
}
