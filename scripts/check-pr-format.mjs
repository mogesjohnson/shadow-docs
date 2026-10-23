// Run by .github/workflows/pr-format.yml. Reads the PR from the environment (never interpolated
// into a shell command) and checks its title, its body, and every commit it adds on top of its base.
import { execFileSync } from "node:child_process";
import { checkAll } from "./pr-format.mjs";

const { PR_TITLE, PR_BODY, BASE_SHA, HEAD_SHA } = process.env;
if (!BASE_SHA || !HEAD_SHA) {
  console.error("BASE_SHA and HEAD_SHA are required");
  process.exit(2);
}

// Full messages, not only subjects: GitHub also acts on closing keywords in commit bodies.
const messages = execFileSync("git", ["log", "--no-merges", "--format=%B%x00", `${BASE_SHA}..${HEAD_SHA}`], {
  encoding: "utf8",
})
  .split("\0")
  .map((m) => m.trim())
  .filter(Boolean);

const problems = checkAll({ title: PR_TITLE, body: PR_BODY, messages });
if (problems.length) {
  console.error("PR format check failed:\n" + problems.map((p) => `  - ${p}`).join("\n"));
  console.error("\nSee docs/version-control/04-pull-requests.md and .github/pull_request_template.md.");
  process.exit(1);
}
console.log(`PR format OK (${messages.length} commit${messages.length === 1 ? "" : "s"} checked)`);
