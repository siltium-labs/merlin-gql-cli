import { spawn } from "child_process";
import { Observable } from "rxjs";

export const spawnCommand = (
  command: string,
  args: string[],
  cwd: string,
  resolveOnEnd: boolean
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const spawnedCmd = spawn(command, args, {
      cwd: cwd,
      stdio: "ignore",
    });

    spawnedCmd.on("exit", (code) => {
      if (code == 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
};
