import { useState } from "react";
import { Button } from "@/components/ui/Button";
import log from "loglevel";

import { Notification } from "@/types/notifications";

log.setLevel("info");

//using mock data just to show stakeholder UI and get feedback
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      message: "Team practice scheduled for tomorrow at 5 PM",
      timestamp: "11:20 AM",
      isRead: false,
      sender: "Coach Smith",
    },
    {
      id: "2",
      message: 'New message: "Great game yesterday, team!"',
      timestamp: "10:26 AM",
      isRead: false,
      sender: "Team Captain",
    },
    {
      id: "3",
      message: "Upcoming match against Rival FC this Saturday",
      timestamp: "Yesterday",
      isRead: false,
      sender: "League Organizer",
    },
    {
      id: "4",
      message: "Congratulations! Your team won the quarter-finals",
      timestamp: "2 days ago",
      isRead: true,
      sender: "Tournament Committee",
    },
    {
      id: "5",
      message: "Team building event next week",
      timestamp: "18 Jan, 2024",
      isRead: true,
      sender: "Team Manager",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  log.info(
    `NotificationsPage initialized with ${notifications.length} notifications`,
  );
  log.info(`${unreadCount} unread notifications at initialization`);

  const markAllAsRead = () => {
    log.info("Mark all as read button clicked");
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
    log.info("All notifications marked as read");
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  log.debug("Unread notifications:", unreadNotifications);
  log.debug("Read notifications:", readNotifications);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 mb-20">
      <div className="space-y-1">
        <h2 className="font-semibold text-3xl text-secondaryColour text-center">
          Notifications
        </h2>
        <p className="text-fadedPrimaryColour text-center ">
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
                key={notification.id}
                className="flex items-start space-x-4 rtl:space-x-reverse"
              >
                <span className="relative flex h-3 w-3 mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondaryColour opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondaryColour"></span>
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.sender}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.timestamp}
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
              key={notification.id}
              className="flex items-start space-x-4 rtl:space-x-reverse"
            >
              <span className="relative flex h-3 w-3 mt-1">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-muted"></span>
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.sender}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>
    </div>
  );
}
