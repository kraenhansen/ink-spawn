import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Spawn, SpawnProps } from "./Spawn.js";
import { SpawnFailure } from "bufout";

const RUNNABLE_TYPES = new Set<unknown>([
  Spawn,
  ParallelScript,
  SequentialScript,
  Script,
]);

type BaseScriptProps = React.PropsWithChildren<{
  onCompletion?: (error?: SpawnFailure) => void;
}>;

type ScriptProps = BaseScriptProps & {
  parallel?: boolean;
};

function useSucceeded() {
  const [succeeded, setSucceeded] = useState<RunnableElement[]>([]);
  const addSucceeded = useCallback(
    (runnable: RunnableElement) => setSucceeded((prev) => [...prev, runnable]),
    [setSucceeded],
  );
  return [succeeded, addSucceeded] as const;
}

function ParallelScript(props: BaseScriptProps) {
  const [succeeded, addSucceeded] = useSucceeded();
  const children = useMemo(
    () => React.Children.toArray(props.children),
    [props.children],
  );

  const runnables = useMemo(
    () => children.filter(isRunnableElement),
    [children],
  );

  useEffect(() => {
    if (succeeded.length >= runnables.length && props.onCompletion) {
      props.onCompletion();
    }
  }, [succeeded, runnables]);

  return (
    <>
      {children.map((child) => {
        if (isRunnableElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            onCompletion(error?: SpawnFailure) {
              if (child.props.onCompletion) {
                child.props.onCompletion(error);
              }
              if (!error) {
                addSucceeded(child);
              }
            },
          });
        } else {
          return child;
        }
      })}
    </>
  );
}

type RunnableElement = React.ReactElement<
  SpawnProps | BaseScriptProps | ScriptProps
>;

function isRunnableElement(child: unknown): child is RunnableElement {
  return (
    typeof child === "object" &&
    child !== null &&
    "type" in child &&
    RUNNABLE_TYPES.has(child.type)
  );
}

function SequentialScript(props: BaseScriptProps) {
  const [succeeded, addSucceeded] = useSucceeded();
  const children = useMemo(
    () => React.Children.toArray(props.children),
    [props.children],
  );
  const runnables = useMemo(
    () => children.filter(isRunnableElement),
    [children],
  );

  const enhancedChildren = useMemo(
    () =>
      children.map((child) => {
        if (isRunnableElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            onCompletion(error?: SpawnFailure) {
              if (child.props.onCompletion) {
                child.props.onCompletion(error);
              }
              if (!error) {
                addSucceeded(child);
              }
            },
          });
        } else {
          return child;
        }
      }),
    [children, succeeded],
  );

  const currentRunnable = runnables[succeeded.length];
  const completed = succeeded.length >= runnables.length;

  // Showing elements after the last runnable once all are completed
  const lastVisibleIndex = completed
    ? children.length - 1
    : children.indexOf(currentRunnable);

  useEffect(() => {
    if (completed && props.onCompletion) {
      props.onCompletion();
    }
  }, [completed]);

  const visibleChildren = useMemo(
    () => enhancedChildren.slice(0, lastVisibleIndex + 1),
    [enhancedChildren, lastVisibleIndex],
  );

  return <>{visibleChildren}</>;
}

export function Script({ children, parallel, onCompletion }: ScriptProps) {
  if (parallel) {
    return (
      <ParallelScript
        onCompletion={onCompletion}
        children={Array.isArray(children) ? children : [children]}
      />
    );
  } else {
    return (
      <SequentialScript
        onCompletion={onCompletion}
        children={Array.isArray(children) ? children : [children]}
      />
    );
  }
}
