import type { ComponentType } from "react";
import type { PageEntry } from "./nav";
import { AdapterProtocol } from "./pages/AdapterProtocol";
import { AgentMd } from "./pages/AgentMd";
import { ApplyChanges } from "./pages/ApplyChanges";
import { Army } from "./pages/Army";
import { Autonomy } from "./pages/Autonomy";
import { BestPractices } from "./pages/BestPractices";
import { BriefsAndReports } from "./pages/BriefsAndReports";
import { Capabilities } from "./pages/Capabilities";
import { Changelog } from "./pages/Changelog";
import { CheckoutGuard } from "./pages/CheckoutGuard";
import { AgyCli, ClaudeCli, CodexCli, GrokCli } from "./pages/Clis";
import { Cost } from "./pages/Cost";
import { FileClaims } from "./pages/FileClaims";
import { FirstArmy } from "./pages/FirstArmy";
import { HardRules } from "./pages/HardRules";
import { HowItWorks } from "./pages/HowItWorks";
import { ManageSessions } from "./pages/ManageSessions";
import { Models } from "./pages/Models";
import { NewAdapter } from "./pages/NewAdapter";
import { OrchestratorDelegate } from "./pages/OrchestratorDelegate";
import { Pane } from "./pages/Pane";
import { Quickstart } from "./pages/Quickstart";
import { Roadmap } from "./pages/Roadmap";
import { Roles } from "./pages/Roles";
import { RoutingPolicy } from "./pages/RoutingPolicy";
import { RulesMd } from "./pages/RulesMd";
import { SecondReviewer } from "./pages/SecondReviewer";
import { Send } from "./pages/Send";
import { ShadowConfig } from "./pages/ShadowConfig";
import { ShadowVault } from "./pages/ShadowVault";
import { Snapshots } from "./pages/Snapshots";
import { Soldiers } from "./pages/Soldiers";
import { SoldiersOverview } from "./pages/SoldiersOverview";
import { Steer } from "./pages/Steer";
import { TheMonarch } from "./pages/TheMonarch";
import { Troubleshooting } from "./pages/Troubleshooting";
import { WhatsNew } from "./pages/WhatsNew";
import { Worktrees } from "./pages/Worktrees";

/** Pages with written copy, by slug. Every other page shows the placeholder. */
export const written: Record<string, ComponentType<{ page: PageEntry }>> = {
  quickstart: Quickstart,
  changelog: Changelog,
  "how-shadow-army-works": HowItWorks,
  "the-monarch": TheMonarch,
  soldiers: Soldiers,
  "briefs-and-reports": BriefsAndReports,
  "shadow-vault": ShadowVault,
  army: Army,
  send: Send,
  pane: Pane,
  steer: Steer,
  "manage-sessions": ManageSessions,
  "apply-changes": ApplyChanges,
  "best-practices": BestPractices,
  worktrees: Worktrees,
  "file-claims": FileClaims,
  roles: Roles,
  autonomy: Autonomy,
  snapshots: Snapshots,
  "checkout-guard": CheckoutGuard,
  "hard-rules": HardRules,
  "first-army": FirstArmy,
  "second-reviewer": SecondReviewer,
  troubleshooting: Troubleshooting,
  "soldiers-overview": SoldiersOverview,
  claude: ClaudeCli,
  codex: CodexCli,
  grok: GrokCli,
  agy: AgyCli,
  "adapter-protocol": AdapterProtocol,
  capabilities: Capabilities,
  "new-adapter": NewAdapter,
  "shadow-config": ShadowConfig,
  "orchestrator-delegate": OrchestratorDelegate,
  "routing-policy": RoutingPolicy,
  "rules-md": RulesMd,
  "agent-md": AgentMd,
  models: Models,
  cost: Cost,
  "whats-new": WhatsNew,
  roadmap: Roadmap,
};
