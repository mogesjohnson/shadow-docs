import type { ComponentType } from "react";
import type { PageEntry } from "./nav";
import { ApplyChanges } from "./pages/ApplyChanges";
import { Army } from "./pages/Army";
import { Autonomy } from "./pages/Autonomy";
import { BestPractices } from "./pages/BestPractices";
import { BriefsAndReports } from "./pages/BriefsAndReports";
import { Changelog } from "./pages/Changelog";
import { CheckoutGuard } from "./pages/CheckoutGuard";
import { FileClaims } from "./pages/FileClaims";
import { FirstArmy } from "./pages/FirstArmy";
import { HardRules } from "./pages/HardRules";
import { HowItWorks } from "./pages/HowItWorks";
import { ManageSessions } from "./pages/ManageSessions";
import { Pane } from "./pages/Pane";
import { Quickstart } from "./pages/Quickstart";
import { Roles } from "./pages/Roles";
import { SecondReviewer } from "./pages/SecondReviewer";
import { Send } from "./pages/Send";
import { ShadowVault } from "./pages/ShadowVault";
import { Snapshots } from "./pages/Snapshots";
import { Soldiers } from "./pages/Soldiers";
import { Steer } from "./pages/Steer";
import { TheMonarch } from "./pages/TheMonarch";
import { Troubleshooting } from "./pages/Troubleshooting";
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
};
