"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import BackButton from "@/components/ui/back-button";
import { BellRing } from "lucide-react";
import { NotificationOption } from "@/types/notificationSettingOption";

// using mock data need to connect, next step
export default function NotificationSettings() {
  const [notificationChannels, setNotificationChannels] = useState({
    email: true,
    phone: false,
  });

  const [notifications, setNotifications] = useState({
    trainingSessions: true,
    events: true,
    messages: false,
    mentions: true,
    updates: true,
  });

  const notificationOptions: NotificationOption[] = [
    {
      id: "trainingSessions",
      title: "Training Sessions",
      description: "Get notified about upcoming training sessions and changes",
    },
    {
      id: "events",
      title: "Events",
      description: "Receive updates about tournaments and special events",
    },
    {
      id: "messages",
      title: "New Messages",
      description: "Someone sends you a direct message",
    },
    {
      id: "mentions",
      title: "Mentions",
      description: "Someone mentions you in a comment or discussion",
    },
    {
      id: "updates",
      title: "Club Updates",
      description: "Important announcements and club news",
    },
  ];

  const handleChannelToggle = (channel: "email" | "phone") => {
    setNotificationChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const handleToggleNotification = (id: string, checked: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  return (
    <div className="">
      <BackButton />
      <Card className="shadow-md mb-24 mt-4 mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl font-bold items-center gap-2 text-primaryColour font-font">
            {" "}
            <BellRing className="h-6 w-6" />
            Notification Settings{" "}
          </CardTitle>

          <CardDescription className="flex justify-center text-medium font-light items-center justify-center text-primaryColour font-font">
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Channels */}
          <div className="space-y-4 mb-14">
            <Label className="text-base font-semibold">
              Receive notifications via:
            </Label>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={notificationChannels.email}
                  onCheckedChange={() => handleChannelToggle("email")}
                />
                <Label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primaryColour font-font"
                >
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="phone"
                  checked={notificationChannels.phone}
                  onCheckedChange={() => handleChannelToggle("phone")}
                />
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primaryColour font-font"
                >
                  Phone
                </Label>
              </div>
            </div>
          </div>

          {/* Show message if no channel selected */}
          {!notificationChannels.email && !notificationChannels.phone && (
            <div className="text-sm text-muted-foreground italic text-primaryColour font-font">
              Select at least one notification method to configure your
              notifications
            </div>
          )}

          {/* Notification Options */}
          {(notificationChannels.email || notificationChannels.phone) && (
            <div className="space-y-4">
              <Label className="flex text-base font-bold text-primaryColour font-font">
                Notification preferences
              </Label>
              <div className="space-y-2">
                {notificationOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <Label className="text-sm font-medium">
                        {option.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    <Switch
                      checked={
                        notifications[option.id as keyof typeof notifications]
                      }
                      onCheckedChange={(checked) =>
                        handleToggleNotification(option.id, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
