/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
self.addEventListener("push", (event) => {
  const body = event.data?.text() ?? "";

  event.waitUntil(
    self.registration.showNotification("Habits", {
      body,
    })
  );
});
