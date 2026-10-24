import type { PageEntry } from "../nav";
import { CliPage, type CliFacts } from "./CliPage";

/*
 * Sources (shadow-army main at ab04992): docs/spec/v2.md v0.5 (CH-2 to
 * CH-10, PO-4, PO-8, SES-2, SES-6, SI-2, SI-4, ARM-2, ARM-3, ARM-6, Q3,
 * Q4, Q7, milestones M1 and M2), ADR-0009, ADR-0011,
 * docs/claude-first.md (the 2026-10-07 measurements and v1's setup cost
 * per request), orchestratorDelegate.md and shadow.config.json. Shadow
 * Army 2 is not released yet.
 */

const CLAUDE: CliFacts = {
  description:
    "Claude Code's own CLI as a soldier: one long-lived stream-json process per soldier, with the harness exactly as you installed it.",
  milestone: "M1, the first channel built",
  glance: [
    [
      "Default soldiers",
      "Iron (claude-sonnet) and Kaisel (claude-opus). Tank (claude-opus-build) is a default name, but no shipped file defines it yet",
    ],
    ["Roles", "Sonnet builds; Opus reviews and takes hard builds"],
    ["Live channel", "stream-json, one process"],
    ["Instructions", <code key="v">--append-system-prompt</code>],
    ["Turn end", <code key="v">result</code>],
    ["Approvals", <code key="v">can_use_tool</code>],
    ["Interrupt", <code key="v">interrupt</code>],
    ["Resume", <code key="v">--resume</code>],
    ["send tool", <code key="v">--mcp-config</code>],
  ],
  channel: (
    <>
      <p>Each claude soldier is one long-lived process:</p>
      <pre className="sd-pre-inline">
        <code>claude -p --input-format stream-json --output-format stream-json --verbose</code>
      </pre>
      <p>
        Each message is one more turn in it. The soldiers&apos; <code>send</code> tool is added through{" "}
        <code>--mcp-config</code>, alongside your own MCP configuration and never in place of it.
      </p>
    </>
  ),
  instructions: (
    <p>
      The standing instructions go in <code>--append-system-prompt</code>, after claude&apos;s own system prompt.
      claude keeps the system prompt it recorded on the session&apos;s first request until the session is compacted.
    </p>
  ),
  turns: (
    <>
      <p>
        A turn ends with the <code>result</code> event. It is answered when the subtype is <code>success</code> with no{" "}
        <code>is_error</code>, and interrupted when the subtype is an <code>error_…</code> one or{" "}
        <code>is_error</code> is set, with claude&apos;s own error kept word for word.
      </p>
      <p>
        claude reports background tasks with <code>task_started</code>, <code>background_tasks_changed</code> and{" "}
        <code>task_notification</code>. The turn stays open until they end, and claude takes one more turn with a
        background command&apos;s outcome; that turn belongs to the same message.
      </p>
    </>
  ),
  meter: (
    <>
      <p>
        The context size is the usage of the last assistant message in the main conversation, the one whose{" "}
        <code>parent_tool_use_id</code> is null. A subagent&apos;s messages never move the meter. Turn totals come from{" "}
        <code>result</code>.
      </p>
      <p>
        claude marks each cache write as lasting 5 minutes or 1 hour (<code>cache_creation</code>); every write in the
        7 October 2026 probes was for 1 hour.
      </p>
      <ul>
        <li>
          <strong>Resets the cache:</strong> another model; an effort change on a model or sign-in where each effort
          level has its own cache; tools added or removed while they load up front.
        </li>
        <li>
          <strong>Keeps it:</strong> an effort change on Opus 5.5, Sonnet 5.5, Haiku 5.5 and Fable 5.1 with an API key
          or a Claude subscription; an MCP server connected or removed while tool search defers MCP tools, as it does by
          default; a plugin&apos;s skills, commands, agents and hooks.
        </li>
      </ul>
    </>
  ),
  approvals: (
    <p>
      The soldier runs with <code>--permission-prompts host --permission-prompt-tool stdio</code>, so each permission
      request arrives as a <code>control_request</code> (<code>can_use_tool</code>) and comes to you word for word.
      Without these flags claude denies the request by itself.
    </p>
  ),
  stopping: (
    <p>
      A stop sends stream-json&apos;s <code>interrupt</code> control request, and claude withdraws any open request with{" "}
      <code>control_cancel_request</code>. The turn has stopped when its <code>result</code> arrives. Background tasks
      are stopped with <code>stop_task</code>. After a crash the session reopens with <code>--resume</code>.
    </p>
  ),
  notes: (
    <p>
      A plugin&apos;s language server, which claude starts at the first edit of a matching file and keeps for
      diagnostics, is a session service: it never holds a turn open, and a stop leaves it running.
    </p>
  ),
  measured: {
    task: ["66.7k", "62.6k"],
    followUp: ["35.9k", "36.1k"],
  },
  fromV1: (
    <p>
      v1 started a new claude process for every message. As v1 launched it, claude&apos;s own setup was 31.5k tokens
      on every request. v2 keeps one stream-json process per soldier instead.
    </p>
  ),
};

const CODEX: CliFacts = {
  description: "OpenAI's codex CLI as a soldier, through codex app-server: one thread per soldier, one turn per message.",
  milestone: "M2",
  glance: [
    ["Default soldiers", "Igris (codex-sol), Bellion (codex-astra)"],
    ["Roles", "Igris builds; Bellion reviews and takes hard builds"],
    ["Live channel", <code key="v">codex app-server</code>],
    ["Instructions", <code key="v">developerInstructions</code>],
    ["Turn end", <code key="v">turn/completed</code>],
    ["Approvals", "requestApproval for commands and file changes"],
    ["Interrupt", <code key="v">turn/interrupt</code>],
    ["Resume", <code key="v">thread/resume</code>],
    ["send tool", <code key="v">thread/start</code>],
  ],
  channel: (
    <p>
      The adapter runs <code>codex app-server</code> over stdio. <code>thread/start</code> opens the session, and{" "}
      <code>turn/start</code> sends each message. The <code>send</code> tool is added in the <code>thread/start</code>{" "}
      config, alongside your own. codex&apos;s own window can also attach to an app server (<code>codex --remote</code>),
      which is not tested yet.
    </p>
  ),
  instructions: (
    <p>
      The standing instructions go in <code>developerInstructions</code> on <code>thread/start</code>.
    </p>
  ),
  turns: (
    <p>
      A turn ends with <code>turn/completed</code>. Its status says how: <code>completed</code> is answered,{" "}
      <code>failed</code> is interrupted with codex&apos;s error and its kind, such as a rate limit or a context
      overflow, and <code>interrupted</code> follows a stop.
    </p>
  ),
  meter: (
    <p>
      Usage and the context window come from <code>thread/tokenUsage/updated</code>; the meter reads its{" "}
      <code>last</code> value. codex reports a window of 258,400 tokens, so the meter shows both the handoff line and
      the share of the window.
    </p>
  ),
  approvals: (
    <p>
      codex asks through <code>item/commandExecution/requestApproval</code> and{" "}
      <code>item/fileChange/requestApproval</code>. Each request is shown word for word with codex&apos;s own options,
      and your answer goes back unchanged.
    </p>
  ),
  stopping: (
    <p>
      A stop sends <code>turn/interrupt</code>. codex clears any open request and says so with{" "}
      <code>serverRequest/resolved</code>. The turn has stopped when <code>turn/completed</code> arrives with the status{" "}
      <code>interrupted</code>; a turn that completes just as the stop is sent ends as answered. After a crash the
      session reopens with <code>thread/resume</code>.
    </p>
  ),
  notes: (
    <p>
      codex can add to a running turn with <code>turn/steer</code>. Whether v2 offers &ldquo;redirect without
      stopping&rdquo; is an open question.
    </p>
  ),
  measured: {
    task: ["40.7k", "42.8k"],
    followUp: ["41.2k", "27.0k"],
    note: "In its normal follow-up, codex ran a command to count the lines again; the live session answered from what it had read.",
  },
  fromV1: (
    <p>
      v1 started a new codex process for every message. As v1 launched it, codex&apos;s own setup was 20.1k tokens on
      every request. v2 keeps one app-server thread per soldier instead.
    </p>
  ),
};

const GROK: CliFacts = {
  description: "xAI's grok CLI as a soldier. It is the only one that speaks ACP, the Agent Client Protocol, natively.",
  milestone: "M2",
  glance: [
    ["Default soldier", "Beru (grok)"],
    ["Roles", "Builds; never reviews"],
    ["Live channel", "ACP: grok agent stdio"],
    ["Instructions", <code key="v">_meta.rules</code>],
    ["Turn end", <code key="v">session/prompt</code>],
    ["Approvals", <code key="v">session/request_permission</code>],
    ["Interrupt", <code key="v">session/cancel</code>],
    ["Resume", <code key="v">session/load</code>],
    ["send tool", <code key="v">mcpServers</code>],
  ],
  channel: (
    <p>
      The adapter runs <code>grok agent stdio</code>, or <code>grok agent serve</code> bound to the loopback address
      with a secret. <code>session/new</code> opens the session, with the <code>send</code> tool in its{" "}
      <code>mcpServers</code>, and <code>session/prompt</code> sends each message.
    </p>
  ),
  instructions: (
    <p>
      The standing instructions go in <code>session/new</code>&apos;s <code>_meta.rules</code>.
    </p>
  ),
  turns: (
    <p>
      A turn ends with the answer to <code>session/prompt</code>. The stop reasons <code>end_turn</code> and{" "}
      <code>refusal</code> are answered; an error, <code>max_tokens</code> or <code>max_turn_requests</code> is
      interrupted; <code>cancelled</code> follows a stop.
    </p>
  ),
  meter: (
    <p>
      Usage comes from the prompt result&apos;s <code>_meta.usage</code>. The context size comes from the
      session&apos;s <code>signals.json</code>, <code>contextTokensUsed</code>. grok runs a 256k window by default,
      and 500k is an opt-in setting; whether long requests cost more per token is an open question.
    </p>
  ),
  approvals: (
    <p>
      grok asks through ACP&apos;s <code>session/request_permission</code>. Each request is shown word for word with
      grok&apos;s own options, and your answer goes back unchanged.
    </p>
  ),
  stopping: (
    <p>
      A stop sends <code>session/cancel</code>, and the adapter answers each open permission request with the{" "}
      <code>cancelled</code> outcome, as ACP requires. Updates that arrive before the <code>cancelled</code> stop
      reason belong to the stopped turn. After a crash the session reopens with <code>session/load</code>.
    </p>
  ),
  notes: (
    <p>
      <strong>Grok never reviews.</strong> A review brief for Beru is refused before it is sent, and the grok adapter
      declares no review capability. Grok&apos;s clients can share one leader process, which is not tested yet.
    </p>
  ),
  measured: {
    task: ["46.3k", "47.2k"],
    followUp: ["23.6k", "24.2k"],
  },
  fromV1: (
    <p>
      v1 started a new grok process for every message. As v1 launched it, grok&apos;s own setup was about 23k tokens
      on every request. v2 keeps one ACP session per soldier instead.
    </p>
  ),
};

const AGY: CliFacts = {
  description:
    "Google's Antigravity CLI as a soldier for research and tests. It never writes, and it always runs in a throwaway snapshot.",
  milestone: "M2",
  glance: [
    ["Default soldier", "Tusk (agy)"],
    ["Roles", "Research and test; never writes"],
    ["Live channel", "stream-json, one process"],
    ["Instructions", "Lead the first message"],
    ["Turn end", <code key="v">result</code>],
    ["Approvals", "None: it skips tools that need one"],
    ["Interrupt", "Being checked; otherwise ended and resumed"],
    ["Resume", <code key="v">--conversation</code>],
    ["send tool", "None in v2.0"],
  ],
  channel: (
    <>
      <p>Each agy soldier is one long-lived process:</p>
      <pre className="sd-pre-inline">
        <code>agy --input-format stream-json --output-format stream-json</code>
      </pre>
      <p>
        Its messages are <code>{'{"event":"user",…}'}</code>. agy has no per-session way to add an MCP server, so agy
        soldiers get no <code>send</code> tool in v2.0. They reply through summaries only.
      </p>
    </>
  ),
  instructions: (
    <p>
      agy has no slot for appended instructions, so they lead its first message, and the post office view shows that
      they did. On a resume nothing is sent again, because the instructions are already in the session.
    </p>
  ),
  turns: (
    <p>
      A turn ends with the <code>result</code> event. Its usage is a running total, and its input excludes cached
      tokens.
    </p>
  ),
  meter: (
    <p>
      The context size comes from agy&apos;s <code>agent_response</code> steps only: the latest one to reach{" "}
      <code>DONE</code>, its input tokens plus cache reads. A <code>checkpoint</code> step is recorded but never moves
      the meter: an <code>agent_response</code> step of 10,302 input and 8,113 cached tokens followed by a checkpoint
      of 116 leaves the meter at 18,415.
    </p>
  ),
  approvals: (
    <p>
      Headless agy has no approval protocol. It soft-denies any tool that would need a confirmation and carries on.
      A <code>control_request</code> or <code>control_response</code> sent to it ends its session with exit code 2, so
      the adapter never sends either, and declares that it has no relay. Each denial agy reports on its standard error
      is shown to you word for word.
    </p>
  ),
  stopping: (
    <p>
      Spike S6 looks for an interrupt in agy. Until one is found, a stop ends agy&apos;s process tree, the turn is
      finished, and the session is resumed by id with <code>--conversation</code>. The pane says it was resumed.
    </p>
  ),
  notes: (
    <>
      <p>
        <strong>agy never writes.</strong> Its own modes do not stop it: in spike S5 it wrote a file even with{" "}
        <code>--mode plan</code>. So every agy session runs in a read-only snapshot, any file it writes is discarded
        and reported as a read-violation, and the checkout guard covers each of its turns.
      </p>
      <p>Whether agy gains an instructions slot or an approval protocol in headless mode is an open question.</p>
    </>
  ),
  measured: { task: ["28.6k", "29.5k"], followUp: ["16.1k", "16.8k"] },
};

export function ClaudeCli({ page }: { page: PageEntry }) {
  return <CliPage page={page} facts={CLAUDE} />;
}

export function CodexCli({ page }: { page: PageEntry }) {
  return <CliPage page={page} facts={CODEX} />;
}

export function GrokCli({ page }: { page: PageEntry }) {
  return <CliPage page={page} facts={GROK} />;
}

export function AgyCli({ page }: { page: PageEntry }) {
  return <CliPage page={page} facts={AGY} />;
}
