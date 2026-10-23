import type { ComponentType } from "react";
import type { PageEntry } from "./nav";
import { BriefsAndReports } from "./pages/BriefsAndReports";
import { HowItWorks } from "./pages/HowItWorks";
import { Quickstart } from "./pages/Quickstart";
import { ShadowVault } from "./pages/ShadowVault";
import { Soldiers } from "./pages/Soldiers";
import { TheMonarch } from "./pages/TheMonarch";

/** Pages with written copy, by slug. Every other page shows the placeholder. */
export const written: Record<string, ComponentType<{ page: PageEntry }>> = {
  quickstart: Quickstart,
  "how-shadow-army-works": HowItWorks,
  "the-monarch": TheMonarch,
  soldiers: Soldiers,
  "briefs-and-reports": BriefsAndReports,
  "shadow-vault": ShadowVault,
};
