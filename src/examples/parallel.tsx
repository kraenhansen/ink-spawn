import React from "react";
import { render, Text } from "ink";

import { Script } from "../Script.js";
import { Spawn } from "../Spawn.js";

const CommandLineInterface = () => (
  <>
    <Text>Parallel example</Text>
    <Script parallel>
      <Spawn command="echo" args={["task 1", "&&", "sleep", "1"]} shell />
      <Spawn command="echo" args={["task 2", "&&", "sleep", "1"]} shell />
      <Spawn command="echo" args={["task 3", "&&", "sleep", "1"]} shell />
    </Script>
  </>
);

render(<CommandLineInterface />, { debug: false });
