import React from "react";
import { render, Text } from "ink";

import { Script } from "../Script.js";
import { Spawn } from "../Spawn.js";

const CommandLineInterface = () => (
  <>
    <Text>Combined example</Text>
    <Script>
      <Spawn command="echo" args={["task 1", "&&", "sleep", "1"]} shell />
      <Script parallel>
        <Spawn command="echo" args={["task 2.a", "&&", "sleep", "1"]} shell />
        <Spawn command="echo" args={["task 2.b", "&&", "sleep", "1"]} shell />
      </Script>
      <Spawn command="echo" args={["task 3", "&&", "sleep", "1"]} shell />
      <Text>Bye 👋</Text>
    </Script>
  </>
);

render(<CommandLineInterface />, { debug: false });
