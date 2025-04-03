import { useEffect, useState } from "react";
import log from "loglevel";
import { Notification } from "@/types/notifications";
import useGetNotificationAlerts from "@/hooks/useGetNotificationAlerts.ts";
import useMarkNotificationsRead from "@/hooks/useMarkNotificationsRead.ts";
import useGetCookies from "@/hooks/useGetCookies.ts";
import { LoaderCircle } from "lucide-react";

log.setLevel("info");

//using mock data just to show stakeholder UI and get feedback
export default function NotificationsPage() {
  const { userId, preLoading } = useGetCookies();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const { getNotifications } = useGetNotificationAlerts();
  const { markNotificationsRead } = useMarkNotificationsRead();

  const unreadCount = notifications.filter((n) => !n.read).length;
  log.info(
    `NotificationsPage initialized with ${notifications.length} notifications`,
  );
  log.info(`${unreadCount} unread notifications at initialization`);

  // ** May use this later, commenting out for now.
  // const markAllAsRead = () => {
  //   log.info("Mark all as read button clicked");
  //   setNotifications(
  //     notifications.map((notification) => ({
  //       ...notification,
  //       read: true,
  //     })),
  //   );
  //   log.info("All notifications marked as read");
  // };

  const formatTime = (date: string) => {
    const timestamp = new Date(date);

    if (isNaN(timestamp.getTime())) {
      return ""; // Invalid date
    }

    const now = new Date();

    const timestampDate = new Date(
      timestamp.getFullYear(),
      timestamp.getMonth(),
      timestamp.getDate(),
    );

    const todayDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // Calculate difference in days
    const diffTime = todayDate.getTime() - timestampDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Format the time part (HH:MM)
    const hours = timestamp.getHours().toString().padStart(2, "0");
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    // Today
    if (diffDays === 0) {
      return `Today at ${timeStr}`;
    }

    // Yesterday
    if (diffDays === 1) {
      return `Yesterday at ${timeStr}`;
    }

    if (diffDays > 1 && diffDays < 7) {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return daysOfWeek[timestamp.getDay()];
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[timestamp.getMonth()];
    const day = timestamp.getDate();

    return `${month} ${day}`;
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  log.debug("Unread notifications:", unreadNotifications);
  log.debug("Read notifications:", readNotifications);

  useEffect(() => {
    if (!preLoading) {
      getNotifications(userId).then((response) => {
        if (response.statusCode === 200 && response.data) {
          setNotifications(response.data.notifications);
        } else if (response.statusCode === 200 && !response.data) {
          setNotifications([]);
        } else {
          setNotifications([]);
        }
      });
    }
  }, [userId, preLoading]);

  useEffect(() => {
    setLoading(false);
    markNotificationsRead(userId).then((response) => {
      if (response.statusCode === 200) {
        log.info("All notifications marked as read");
      } else {
        log.error("Failed to mark all notifications as read");
      }
    });
  }, [notifications]);

  if (preLoading || loading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 mb-20">
      <div className="space-y-1">
        <h2 className="font-semibold text-3xl text-secondaryColour text-center">
          Notifications
        </h2>
        <p className="text-fadedPrimaryColour text-center">
          You have {unreadCount} unread notifications
        </p>
      </div>
      <div className="space-y-8">
        {unreadCount > 0 && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  New Notifications
                </span>
              </div>
            </div>
            {unreadNotifications.map((notification) => (
              <div
                key={notification.notificationId}
                className="flex items-start space-x-4 rtl:space-x-reverse"
              >
                <span className="relative flex h-3 w-3 mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondaryColour opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondaryColour"></span>
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.body}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(notification.sentAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Earlier
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {readNotifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="flex items-start space-x-4 rtl:space-x-reverse"
            >
              <span className="relative flex h-3 w-3 mt-1">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-muted"></span>
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.body}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(notification.sentAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/*{unreadCount > 0 && (*/}
        {/*  <Button*/}
        {/*    variant="outline"*/}
        {/*    className="w-full mt-4"*/}
        {/*    onClick={markAllAsRead}*/}
        {/*  >*/}
        {/*    Mark all as read*/}
        {/*  </Button>*/}
        {/*)}*/}
      </div>
    </div>
  );
}
