import { LocalNotifications } from "@capacitor/local-notifications";

export async function requestPermission() {
  await LocalNotifications.requestPermissions();
}

export async function scheduleReminder(
  title,
  body,
  reminderDateTime
) {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: Date.now(),
        title,
        body,
        schedule: {
          at: new Date(reminderDateTime),
        },
      },
    ],
  });
}