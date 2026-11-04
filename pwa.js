(() => {
  const INSTALL_KEY = "marcacoes-install-dismissed";
  let deferredPrompt = null;
  const installBox = document.getElementById("pwaInstall");
  const installButton = document.getElementById("pwaInstallBtn");
  const pushButton = document.getElementById("pwaPushBtn");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {}));
  }

  const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const showInstall = () => {
    if (!installBox || isStandalone() || localStorage.getItem(INSTALL_KEY) === "1") return;
    installBox.hidden = false;
    if (isIOS && !deferredPrompt) {
      installBox.querySelector("[data-install-help]")?.replaceChildren(document.createTextNode("No Safari: toque em Partilhar e depois em ‘Adicionar ao ecrã principal’."));
      if (installButton) installButton.hidden = true;
    }
  };

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault(); deferredPrompt = event; showInstall();
  });
  window.addEventListener("appinstalled", () => { deferredPrompt = null; if (installBox) installBox.hidden = true; });
  setTimeout(showInstall, 900);

  installButton?.addEventListener("click", async () => {
    if (!deferredPrompt) return showInstall();
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted" && installBox) installBox.hidden = true;
    deferredPrompt = null;
  });
  installBox?.querySelector("[data-install-close]")?.addEventListener("click", () => {
    localStorage.setItem(INSTALL_KEY, "1"); installBox.hidden = true;
  });

  pushButton?.addEventListener("click", async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      pushButton.textContent = "Notificações permitidas";
      pushButton.disabled = true;
      // A subscrição Web Push necessita de uma chave pública VAPID e de um backend.
      // O service worker já trata os eventos push quando essa infraestrutura for configurada.
    } else {
      pushButton.textContent = "Permissão não concedida";
    }
  });
})();
