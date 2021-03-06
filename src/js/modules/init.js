"use strict";

import * as defaults from "./defaults";
import { initCache } from "./cache";
import { initFontAwesomeIcons, initTooltips, showGeolocationAlert, showInstallAlert, showLoading } from "./ui";
import { initDataUpdateCheck } from "./data";

export function init() {
  if ("serviceWorker" in navigator) {
    // register service worker
    window.addEventListener("load", async () => {
      const registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      // console.log(`[SW] Registration Successful With Scope ${registration.scope}`);
      // check for updatees
      registration.onupdatefound = () => {
        console.info(`[SW] Latest Version Installed - Reload to Activate`);
      };
    });
  }


  window.addEventListener("offline", () => {
    // TODO: add offline handler
    console.log("Browser offline");
  }, false);

  window.addEventListener("online", () => {
    console.log("Browser online");
  }, false);

  window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error("ERROR", msg, url, lineNo, columnNo, error);
    // return false;
  };

  if (defaults.isOnline()) {
    initCache();
    showGeolocationAlert();
    initDataUpdateCheck();
    initTooltips();
  } else {
    initFontAwesomeIcons();
    initTooltips();
  }
}
