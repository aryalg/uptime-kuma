const NotificationProvider = require("./notification-provider");
const axios = require("axios");

const defaultNotificationService = "notify";

class HomeAssistant extends NotificationProvider {
    name = "HomeAssistant";

    /**
     * @inheritdoc
     */
    async send(notification, message, monitor = null, heartbeat = null) {
        const notificationService = notification?.notificationService || defaultNotificationService;

        try {
            await axios.post(
                `${notification.homeAssistantUrl.trim().replace(/\/*$/, "")}/api/services/notify/${notificationService}`,
                {
                    title: "C8 Digital Server Monitoring",
                    message,
                    ...(notificationService !== "persistent_notification" && {
                        data: {
                            name: monitor?.name,
                            status: heartbeat?.status,
                        }
                    }),
                },
                {
                    headers: {
                        Authorization: `Bearer ${notification.longLivedAccessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return "Sent Successfully.";
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
}

module.exports = HomeAssistant;
