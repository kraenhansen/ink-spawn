import React from "react";
import { render, Text } from "ink";

import { Script } from "../Script.js";
import { Spawn } from "../Spawn.js";

const CommandLineInterface = () => (
  <>
    <Text>Silent example</Text>
    <Script>
      <Spawn
        command="echo"
        args={["task 1", "&&", "sleep", "1"]}
        shell
        silent
      />
      <Spawn
        command="echo"
        args={["task 2", "&&", "sleep", "1"]}
        shell
        silent
      />
      <Spawn
        command="echo"
        args={["failing task", "1>&2", "&&", "sleep", "1", "&&", "exit", "1"]}
        shell
        silent
      />
      <Text>Bye 👋</Text>
    </Script>
  </>
);

render(<CommandLineInterface />, { debug: false });
