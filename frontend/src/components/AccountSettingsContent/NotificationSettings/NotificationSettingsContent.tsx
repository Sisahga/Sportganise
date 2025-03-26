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
import { useEffect, useState } from "react";
import BackButton from "@/components/ui/back-button";
import { BellRing } from "lucide-react";
import {
  NotificationMethod,
  NotificationMethodEnum,
  NotificationPreference,
  NotificationTypeEnum,
  UpdateNotificationMethodRequestDto,
  UpdateNotificationPermissionRequestDto,
} from "@/types/notifications.ts";
import useGetNotificationSettings from "@/hooks/useGetNotificationSettings.ts";
import { getAccountIdCookie, getCookies } from "@/services/cookiesService.ts";
import useUpdateNotificationMethod from "@/hooks/useUpdateNotificationMethod.ts";
import { toast } from "@/hooks/use-toast.ts";
import useUpdateNotificationPermission from "@/hooks/useUpdateNotificationPermission.ts";

export default function NotificationSettings() {
  const cookies = getCookies();
  const userId = getAccountIdCookie(cookies);

  // Display names for enum values.
  const NotificationMethodDisplayNames: Record<NotificationMethodEnum, string> =
    {
      [NotificationMethodEnum.PUSH]: "Phone/Browser",
      [NotificationMethodEnum.EMAIL]: "Email",
    };
  const NotificationTypeDisplayNames: Record<NotificationTypeEnum, string> = {
    [NotificationTypeEnum.TRAINING_SESSIONS]: "Training Sessions",
    [NotificationTypeEnum.EVENTS]: "Events",
    [NotificationTypeEnum.MESSAGING]: "Direct Messages",
  };

  // States.
  const [notificationMethods, setNotificationMethods] = useState<
    NotificationMethod[] | []
  >([]);
  const [notificationTypes, setNotificationTypes] = useState<
    NotificationPreference[] | []
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Hooks.
  const { getNotificationSettings } = useGetNotificationSettings();
  const { updateNotificationMethod } = useUpdateNotificationMethod();
  const { updateNotificationPermission } = useUpdateNotificationPermission();

  // Check browser push notification support
  const checkPushNotificationSupport = () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast({
        variant: "warning",
        title: "⚠️ Limited Browser Notifications",
        description: "Your browser may not fully support push notifications. Some app features might be limited.",
        duration: 10000,
      });
    }
  };

  // Check push notification support on component mount
  useEffect(() => {
    checkPushNotificationSupport();
  }, []);

  const handleChannelToggle = async (method: NotificationMethodEnum) => {
    setNotificationMethods((prev) =>
      prev.map((item) =>
        item.notificationMethod === method
          ? { ...item, enabled: !item.enabled }
          : item,
      ),
    );
    const request: UpdateNotificationMethodRequestDto = {
      accountId: userId,
      method: method,
      enabled: !notificationMethods.find(
        (item) => item.notificationMethod === method,
      )?.enabled,
    };
    const response = await updateNotificationMethod(request);
    if (response.statusCode === 200) {
      toast({
        title: "Success",
        description: "Notification method updated successfully",
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      setNotificationMethods((prev) =>
        prev.map((item) =>
          item.notificationMethod === method
            ? { ...item, enabled: !item.enabled }
            : item,
        ),
      );
    }
  };

  const handleToggleNotification = async (
    notifName: NotificationTypeEnum,
    checked: boolean,
  ) => {
    setNotificationTypes((prev) =>
      prev.map((item) =>
        item.notifName === notifName ? { ...item, enabled: checked } : item,
      ),
    );
    const request: UpdateNotificationPermissionRequestDto = {
      accountId: userId,
      type: notifName,
      enabled: checked,
    };
    const response = await updateNotificationPermission(request);
    if (response.statusCode === 200) {
      toast({
        title: "Success",
        description: "Notification permission updated successfully",
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      setNotificationTypes((prev) =>
        prev.map((item) =>
          item.notifName === notifName ? { ...item, enabled: !checked } : item,
        ),
      );
    }
  };

  useEffect(() => {
    getNotificationSettings(userId).then((response) => {
      if (response.statusCode === 200 && response.data) {
        setNotificationMethods(response.data.notificationMethods);
        setNotificationTypes(response.data.notificationComponents);
      } else {
        return (
          <div>
            Error retrieving notifications settings. Please try again later.
          </div>
        );
      }
    });
  }, [userId]);

  useEffect(() => {
    console.log(notificationMethods, notificationTypes);
    if (notificationMethods.length > 0 && notificationTypes.length > 0) {
      setLoading(false);
    }
  }, [notificationTypes, notificationMethods]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <BackButton />
      <Card className="shadow-md mb-24 mt-4 mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl font-bold items-center gap-2 text-primaryColour">
            {" "}
            <BellRing className="h-6 w-6" />
            Notification Settings{" "}
          </CardTitle>

          <CardDescription className="flex justify-center text-medium font-light items-center text-primaryColour">
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
              {notificationMethods.map((method, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={method.notificationMethod}
                    checked={method.enabled}
                    onCheckedChange={() =>
                      handleChannelToggle(method.notificationMethod)
                    }
                  />
                  <Label
                    htmlFor={method.notificationMethod}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primaryColour"
                  >
                    {
                      NotificationMethodDisplayNames[
                        method.notificationMethod as NotificationMethodEnum
                      ]
                    }
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Show message if no channel selected */}
          {!notificationMethods[0].enabled &&
            !notificationMethods[1].enabled && (
              <div className="text-sm text-muted-foreground italic text-primaryColour">
                Select at least one notification method to configure your
                notifications
              </div>
            )}

          {/* Notification Options */}
          {(notificationMethods[0].enabled ||
            notificationMethods[1].enabled) && (
            <div className="space-y-4">
              <Label className="flex text-base font-bold text-primaryColour">
                Notification preferences
              </Label>
              <div className="space-y-2">
                {notificationTypes.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <Label className="text-sm font-medium">
                        {NotificationTypeDisplayNames[option.notifName]}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    <Switch
                      checked={option.enabled}
                      onCheckedChange={(checked) =>
                        handleToggleNotification(option.notifName, checked)
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
