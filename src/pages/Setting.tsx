import { getBotSettings, updateBotSettings, uploadPicture } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon } from "@radix-ui/react-icons";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Setting = () => {
  const [settings, setSettings] = useState<API.BotSettings>({
    id: 0,
    initial_messages: [],
    suggested_messages: [],
    bot_name: "",
    bot_avatar: "",
    chat_icon: "",
    placeholder: "",
    model: "",
  });
  const [flatArrayStrings, setFlatArrayStrings] = useState({
    initial_messages: "",
    suggested_messages: "",
  });
  const [loadingState, setLoadingState] = useState({
    updating: false,
    avatarUploading: false,
    avatarRemoving: false,
    chatIconUploading: false,
    chatIconRemoving: false,
  });
  const avatarFileSelector = useRef<HTMLInputElement>(null);
  const chatIconFileSelector = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getBotSettings().then((res) => {
      setSettings(res.data.config);
      setFlatArrayStrings({
        initial_messages: res.data.config.initial_messages.join("\n"),
        suggested_messages: res.data.config.suggested_messages.join("\n"),
      });
    });
  }, []);

  const handleChange = (
    value: string,
    key: "initial_messages" | "suggested_messages"
  ) => {
    setFlatArrayStrings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSettings((prev) => ({
      ...prev,
      [key]: value.split("\n"),
    }));
  };

  const updateSettings = async () => {
    setLoadingState((prev) => ({ ...prev, updating: true }));
    try {
      await updateBotSettings(settings);
      toast.success("Settings updated successfully.");
    } catch (error) {
      toast.error(
        (error as any).message || "Failed to update settings. Please try again."
      );
    }
    setLoadingState((prev) => ({ ...prev, updating: false }));
  };

  const onFileSelected = async (
    field: "bot_avatar" | "chat_icon",
    file?: File
  ) => {
    if (!file) return;
    const loadingField =
      field === "bot_avatar" ? " avatarRemoving" : "chatIconRemoving";
    setLoadingState((prev) => ({ ...prev, [loadingField]: true }));
    try {
      const {
        data: { picture_url },
      } = await uploadPicture(file);
      await updateBotSettings({ ...settings, [field]: picture_url });
      setSettings((prev) => ({ ...prev, [field]: picture_url }));
      toast.success("Image updated successfully.");
    } catch (error) {
      toast.error(
        (error as any).message || "Failed to upload image. Please try again."
      );
    }
    setLoadingState((prev) => ({ ...prev, [loadingField]: false }));
  };

  const removeImageField = async (field: "bot_avatar" | "chat_icon") => {
    const loadingField =
      field === "bot_avatar" ? " avatarRemoving" : "chatIconRemoving";
    setLoadingState((prev) => ({ ...prev, [loadingField]: true }));
    try {
      await updateBotSettings({ ...settings, [field]: "" });
      setSettings((prev) => ({ ...prev, [field]: "" }));
    } catch (error) {
      toast.error(
        (error as any).message || "Failed to remove image. Please try again."
      );
    }
    setLoadingState((prev) => ({ ...prev, [loadingField]: false }));
  };

  return (
    <div className="mt-6 border border-zinc-200 h-fit rounded-md">
      <div className="p-5">
        <small className="text-sm font-medium leading-none mb-3">Model</small>
        <div className="mt-1 mb-3">
          <Select value={settings.model}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{settings.model}</SelectLabel>
                <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <small className="text-sm font-medium leading-none">
          Initial Messages
        </small>
        <div className="mt-1 mb-3">
          <Textarea
            placeholder="Type your message here."
            value={flatArrayStrings.initial_messages}
            onChange={(e) => handleChange(e.target.value, "initial_messages")}
          />
        </div>

        <small className="text-sm font-medium leading-none">
          Suggested Messages
        </small>
        <div className="mt-1 mb-3">
          <Textarea
            placeholder="Type your message here."
            value={flatArrayStrings.suggested_messages}
            onChange={(e) => handleChange(e.target.value, "suggested_messages")}
          />
        </div>

        <small className="text-sm font-medium leading-none">
          Message Placeholder
        </small>
        <div className="mt-1 mb-3">
          <Input
            type="text"
            placeholder="Type your message here."
            value={settings.placeholder}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, placeholder: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center">
          <Avatar>
            <AvatarFallback></AvatarFallback>
            <AvatarImage src={settings.bot_avatar} alt={settings.bot_name} />
          </Avatar>
          <div className="ml-6">
            <small className="text-sm font-medium leading-none">
              Profile Picture
            </small>
            <div className="mt-1 mb-3">
              <div className="flex items-center space-x-3">
                <Button
                  className="h-7 px-3 text-xs"
                  variant="outline"
                  loading={loadingState.avatarUploading}
                  onClick={() => avatarFileSelector.current?.click()}
                >
                  <UploadIcon className="mr-2" />
                  Upload image
                </Button>
                {settings.bot_avatar && (
                  <Button
                    className="h-7 px-3 text-xs"
                    variant="ghost"
                    loading={loadingState.avatarRemoving}
                    onClick={() => removeImageField("bot_avatar")}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Input
                className="hidden"
                accept="image/*"
                multiple={false}
                type="file"
                ref={avatarFileSelector}
                onChange={(e) =>
                  onFileSelected("bot_avatar", e.target.files?.[0])
                }
              />
            </div>
          </div>
        </div>

        <small className="text-sm font-medium leading-none">Display name</small>
        <div className="mt-1 mb-3">
          <Input
            type="text"
            placeholder="Type your name here."
            value={settings.bot_name}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, bot_name: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center">
          <Avatar>
            <AvatarFallback></AvatarFallback>
            <AvatarImage src={settings.chat_icon} alt="Ask" />
          </Avatar>
          <div className="ml-6">
            <small className="text-sm font-medium leading-none">
              Chat icon
            </small>
            <div className="mt-1 mb-3">
              <div className="flex items-center space-x-3">
                <Button
                  className="h-7 px-3 text-xs"
                  variant="outline"
                  loading={loadingState.chatIconUploading}
                  onClick={() => chatIconFileSelector.current?.click()}
                >
                  <UploadIcon className="mr-2" />
                  Upload image
                </Button>
                {settings.chat_icon && (
                  <Button
                    className="h-7 px-3 text-xs"
                    variant="ghost"
                    loading={loadingState.chatIconRemoving}
                    onClick={() => removeImageField("chat_icon")}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Input
                className="hidden"
                accept="image/*"
                multiple={false}
                type="file"
                ref={chatIconFileSelector}
                onChange={(e) =>
                  onFileSelected("chat_icon", e.target.files?.[0])
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end bg-zinc-100 px-5 py-3">
        <Button
          size="sm"
          loading={loadingState.updating}
          onClick={updateSettings}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
