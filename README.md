# ink-spawn

Component for [Ink](https://github.com/vadimdemedes/ink), spawning child processes.

[![ink-spawn combined example](https://github.com/kraenhansen/ink-spawn/raw/refs/heads/main/docs/ink-spawn-combined-example.gif)](https://github.com/user-attachments/assets/3b8c0579-f825-4021-98fe-686540965778)

```tsx
<>
  <Text>Composed example</Text>
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
```

## Features

- The `<Spawn />`
  - starts executing a child process as it mounts,
  - kills the process as it unmounts and prints,
  - renders a configurable status text (running, succeeded, failed),
  - renders the last lines below the status of a running process.
  - propagates terminal interrupts (users pressing Ctrl + C)
- The `<Script />`
  - Wraps `<Spawn />` and any other elements element.
  - Sequential mode (default): Renders only the subset of completed children and the currently running runnable (`<Spawn />` and other nested `<Script />`).
  - Parallel mode: Renders all children, making processes spawn in parallel.
  - Infinitely composable: Put parallel scripts, inside sequential scripts, inside ...

See [examples](https://github.com/kraenhansen/ink-spawn/tree/main/src/examples) and JSDoc comments on props for usage.
