import * as glob from "glob";

export function getAllPaths(regex: string) {
  return glob.sync(regex);
}

export function loadOTs(globString: string) {
  const filePaths = getAllPaths(globString);
  const modules = filePaths.map(fileName => require(fileName));
}