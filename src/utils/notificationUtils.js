import * as Notifications from "expo-notifications";

/** Dispara notificação local imediata */
export async function sendNotification(title, body) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // imediata
    });
  } catch (e) {
    console.warn("Erro ao enviar notificação:", e);
  }
}

/** Agenda notificação para data passada (Date object) */
export async function scheduleNotificationAt(title, body, date) {
  try {
    // `trigger` com timestamp em segundos
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: date instanceof Date ? { seconds: Math.max(1, Math.floor((date.getTime() - Date.now()) / 1000)) } : { seconds: 1 },
    });
  } catch (e) {
    console.warn("Erro ao agendar notificação:", e);
  }
}
