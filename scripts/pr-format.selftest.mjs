// Self-test for scripts/pr-format.mjs and .githooks/commit-msg. Run it from the project root:
//   node --test scripts/pr-format.selftest.mjs
// The "PR format" workflow runs it before checking a PR. The file name keeps project test runners
// (vitest, jest, a bare `node --test`) from picking it up.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { checkAll, checkBody, checkMessage, checkSubject, checkTitle, MAX_SUBJECT } from "./pr-format.mjs";

const goodBody = `Does a thing.

Validation: tests pass.

Tracking: #14. Base: main.

Checklist:
- [ ] a
- [ ] b
- [ ] c
- [ ] d
- [x] e
- [x] f
`;

/** A valid subject of exactly `length` characters. */
const subjectOf = (length) => "#12 A" + "a".repeat(length - 5);

describe("commit subjects", () => {
  it("accepts #issue and [F] forms", () => {
    assert.equal(checkSubject("#12 Add delegate parser, roster, and router"), undefined);
    assert.equal(checkSubject("[F0] Add the README"), undefined);
  });

  it("rejects conventional-commit prefixes and bare text", () => {
    for (const bad of [
      "feat: delegate parser (#12)",
      "fix: something",
      "docs: add README",
      "Add a thing",
      "#12",
      "#12Add",
      "#12  ",
      "[F] no number",
    ]) {
      assert.match(checkSubject(bad) ?? "", /commit subject must look like/, bad);
    }
  });

  it(`allows ${MAX_SUBJECT} characters and rejects more`, () => {
    assert.equal(checkSubject(subjectOf(MAX_SUBJECT)), undefined);
    assert.match(checkSubject(subjectOf(MAX_SUBJECT + 1)) ?? "", /73 characters, over the 72 limit/);
  });

  it("leaves merge, fixup, squash and revert commits alone", () => {
    for (const s of ["Merge branch 'main'", "fixup! #1 x", "squash! #1 x", 'Revert "#1 x"', "Merge " + "x".repeat(100)]) {
      assert.equal(checkSubject(s), undefined, s);
    }
  });
});

describe("commit messages", () => {
  it("accepts a body that mentions issues, and a trailer", () => {
    const msg =
      "#12 Add x\n\nSee #3 for context. This closes the gap in the prefix #4 handling.\n\n" +
      "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n";
    assert.deepEqual(checkMessage(msg), []);
  });

  it("rejects a closing keyword in the subject or the body", () => {
    for (const msg of [
      "#12 Add x\n\nThis fixes #3.",
      "#12 Fix #13 crash",
      "#12 Add x\n\nCloses: #4",
      "#12 Add x\n\nresolved owner/repo#5",
      "#12 Add x\r\n\r\nFixed #6\r\n",
    ]) {
      assert.match(checkMessage(msg).join(), /closing keyword/, JSON.stringify(msg));
    }
  });
});

describe("PR title", () => {
  it("follows the commit subject rules", () => {
    assert.equal(checkTitle("#14 Add CLAUDE.md"), undefined);
    assert.match(checkTitle("Add CLAUDE.md") ?? "", /PR title/);
    assert.match(checkTitle(subjectOf(MAX_SUBJECT + 1)) ?? "", /over the 72 limit/);
    assert.match(checkTitle("Merge branch 'main'") ?? "", /PR title/);
  });
});

describe("PR body", () => {
  it("accepts the template shape", () => {
    assert.deepEqual(checkBody(goodBody), []);
    // Bodies edited on github.com come back with CRLF line endings.
    assert.deepEqual(checkBody(goodBody.replace(/\n/g, "\r\n")), []);
  });

  it("requires Validation, Tracking and Checklist", () => {
    const problems = checkBody("just prose").join("\n");
    for (const part of ["Validation:", "Tracking:", "Checklist:", "0 checklist boxes"]) {
      assert.match(problems, new RegExp(part));
    }
    assert.ok(checkBody(undefined).length > 0);
  });

  it("requires the whole checklist", () => {
    assert.match(checkBody(goodBody.replace(/- \[x\] f\n/, "")).join(), /5 checklist boxes/);
  });

  it("rejects closing keywords, which close issues before acceptance", () => {
    for (const kw of ["closes #1", "Closes #1", "fixes #22", "resolved #3", "close #4", "Fixes: #5", "closes owner/repo#6"]) {
      assert.match(checkBody(goodBody + `\n${kw}\n`).join(), /closing keyword/, kw);
    }
    // "Tracking: #14" and prose that merely mentions an issue are fine.
    assert.deepEqual(checkBody(goodBody + "\nSee #14 for context. This closes the gap.\n"), []);
  });
});

describe("checkAll", () => {
  it("collects every problem for one PR", () => {
    const problems = checkAll({ title: "bad", body: "x", messages: ["feat: x", "#1 ok", "#2 Add y\n\nfixes #3"] });
    assert.ok(problems.some((p) => p.startsWith("PR title")));
    assert.ok(problems.some((p) => p.includes("Validation:")));
    assert.equal(problems.filter((p) => p.startsWith("commit subject")).length, 1);
    assert.equal(problems.filter((p) => p.includes("closing keyword")).length, 1);
  });

  it("passes a well-formed PR", () => {
    assert.deepEqual(checkAll({ title: "#14 Add it", body: goodBody, messages: ["#14 Add it\n\nBody.\n"] }), []);
  });
});

describe(".githooks/commit-msg", () => {
  const hook = fileURLToPath(new URL("../.githooks/commit-msg", import.meta.url));
  let hasSh = true;
  try {
    execFileSync("sh", ["-c", "exit 0"], { stdio: "ignore" });
  } catch {
    hasSh = false;
  }

  const run = (message) => {
    const dir = mkdtempSync(join(tmpdir(), "hook-"));
    const file = join(dir, "COMMIT_EDITMSG");
    writeFileSync(file, message);
    try {
      execFileSync("sh", [hook, file], { stdio: "pipe" });
      return 0;
    } catch (e) {
      return e.status;
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  const scissors = "------------------------ >8 ------------------------";

  it("agrees with the JS checker", { skip: hasSh ? false : "sh is not on PATH" }, () => {
    const accepted = [
      "#1 Add x\n\nbody\n",
      "[F0] Add y\n",
      "Merge branch 'main'\n",
      "fixup! #1 x\n",
      `${subjectOf(MAX_SUBJECT)}\n`,
      "#1 Add x\r\n\r\nWindows line endings\r\n",
      "#1 Add x\n\nSee #3. This closes the gap.\n",
      // git commit -v puts the diff below a scissors line; the diff is not part of the message.
      `#1 Add x\n# ${scissors}\n# Do not modify or remove the line above.\ndiff --git a/x b/x\n+// fixes #9\n`,
      `#1 Add x\n; ${scissors}\n+// fixes #9\n`,
    ];
    const rejected = [
      "feat: x\n",
      "Add x\n",
      "#1\n",
      "docs: y (#2)\n",
      `${subjectOf(MAX_SUBJECT + 1)}\n`,
      "#1 Add x\n\nThis fixes #3.\n",
      "#1 Fix #2 crash\n",
      "#1 Add x\n\nCloses: owner/repo#4\n",
    ];
    for (const m of accepted) assert.equal(run(m), 0, JSON.stringify(m));
    for (const m of rejected) assert.equal(run(m), 1, JSON.stringify(m));
  });
});
