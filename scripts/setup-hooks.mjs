// Point git at the tracked hooks in .githooks, so .githooks/commit-msg checks every commit message.
// Node projects run this from `npm install` (the "prepare" script). Elsewhere, run it once per clone
// from the project root:  node scripts/setup-hooks.mjs
// It never replaces another hooks setup (husky and the like); it says what to add there instead.
// Quietly does nothing outside a git checkout, e.g. when installed from a package.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const get = (key) => {
  try {
    return git("config", "--get", key);
  } catch {
    return ""; // unset
  }
};

try {
  if (existsSync(".githooks")) {
    git("rev-parse", "--git-dir"); // throws outside a git checkout
    const hooksPath = get("core.hooksPath");
    if (hooksPath === "" || hooksPath === ".githooks") {
      git("config", "core.hooksPath", ".githooks");
    } else {
      console.warn(`core.hooksPath is ${hooksPath}. Add this line to its commit-msg hook: sh .githooks/commit-msg "$1" || exit 1`);
    }
    // Commit subjects start with "#". Git drops lines that start with its comment character when a
    // message is written in an editor, so this clone uses ";" for comments unless it already chose one.
    if (get("core.commentChar") === "") git("config", "core.commentChar", ";");
  }
} catch {
  // not a git checkout, or git is unavailable: nothing to set up
}
