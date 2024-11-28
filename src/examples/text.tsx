import React from "react";
import { render, Text } from "ink";

import { Script } from "../Script.js";
import { Spawn } from "../Spawn.js";

const CommandLineInterface = () => (
  <>
    <Text>Combined example</Text>
    <Script>
      <Spawn
        shell
        command="sleep"
        args={["1"]}
        runningText="Sleeping 😴"
        successText="Done!"
      />
    </Script>
  </>
);

render(<CommandLineInterface />, { debug: false });
