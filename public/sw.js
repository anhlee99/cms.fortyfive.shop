self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received.", event);

  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/images/logo.png",
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
});
