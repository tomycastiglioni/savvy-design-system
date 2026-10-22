/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Claude Code cloud containers can't download Remotion's Chrome Headless Shell,
// but ship a Playwright one. Use it when present; elsewhere Remotion downloads its own.
const cloudHeadlessShell =
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (fs.existsSync(cloudHeadlessShell)) {
  Config.setBrowserExecutable(cloudHeadlessShell);
}
