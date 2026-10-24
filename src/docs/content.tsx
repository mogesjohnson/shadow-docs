import type { ComponentType } from "react";
import type { PageEntry } from "./nav";
import { ApplyChanges } from "./pages/ApplyChanges";
import { Army } from "./pages/Army";
import { BestPractices } from "./pages/BestPractices";
import { BriefsAndReports } from "./pages/BriefsAndReports";
import { Changelog } from "./pages/Changelog";
import { HowItWorks } from "./pages/HowItWorks";
import { ManageSessions } from "./pages/ManageSessions";
import { Pane } from "./pages/Pane";
import { Quickstart } from "./pages/Quickstart";
import { Send } from "./pages/Send";
import { ShadowVault } from "./pages/ShadowVault";
import { Soldiers } from "./pages/Soldiers";
import { Steer } from "./pages/Steer";
import { TheMonarch } from "./pages/TheMonarch";

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
};
