import { throttle } from "lodash";

export const ABORTED = Symbol("Aborted");

//
export const backgroundProcessor = () => {
  let abort;
  let idleReject;
  const fn = throttle(
    () =>
      new Promise((resolve, reject) => {
        if (abort) reject(abort());
        idleReject = reject;
        setTimeout(resolve, 0);
        // requestIdleCallback(resolve)
      }),
    16
  );
  fn.abort = (err = ABORTED) => {
    return new Promise((resolve) => {
      abort = () => {
        resolve();
        return err;
      };
      if (idleReject) idleReject(abort());
    });
  };
  return fn;
};
