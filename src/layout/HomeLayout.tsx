import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, NavTabsTrigger } from "@/components/ui/tabs";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import { Outlet, useMatches } from "react-router-dom";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import LogoutAlert from "./LogoutAlert";

const navTabs = [
  {
    label: "Setting",
    value: "setting",
    path: "/",
  },
  {
    label: "Dashboard",
    value: "dashboard",
    path: "/dashboard",
  },
  {
    label: "Source",
    value: "source",
    path: "/source",
  },
  {
    label: "Embed",
    value: "embed",
    path: "/embed",
  },
];

const HomeLayout = () => {
  const matchs = useMatches();
  const [currentTab, setCurrentTab] = React.useState("account");

  const [dialogOpenState, setDialogOpenState] = React.useState({
    changePassword: false,
    logout: false,
  });

  React.useEffect(() => {
    setCurrentTab(
      navTabs.find((nav) => nav.path === matchs[2]?.pathname)?.value ??
        "setting"
    );
  }, []);

  const handleDialogOpenChange = (
    visible: boolean,
    key: "changePassword" | "logout"
  ) => setDialogOpenState((prev) => ({ ...prev, [key]: visible }));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mx-6 py-5 justify-between">
        <div className="flex items-center">
          <Avatar className="mr-3">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>OpenIM</AvatarFallback>
          </Avatar>
          <div>OpenKF Docs Bot</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleDialogOpenChange(true, "changePassword")}
            >
              Change password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDialogOpenChange(true, "logout")}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-center">
        <Tabs
          value={currentTab}
          onValueChange={(v) => setCurrentTab(v)}
          className="overflow-y-auto"
        >
          <TabsList>
            {navTabs.map((nav) => (
              <NavTabsTrigger {...nav} key={nav.value} />
            ))}
          </TabsList>
        </Tabs>
      </div>
      <Separator />
      <div className="flex-1 flex justify-center">
        <div className="2xl:w-[60vw] w-[90vw]">
          <Outlet />
        </div>
      </div>
      <LogoutAlert
        open={dialogOpenState.logout}
        onOpenChange={(visible) => handleDialogOpenChange(visible, "logout")}
      />
      <ChangePasswordDialog
        open={dialogOpenState.changePassword}
        onOpenChange={(visible) =>
          handleDialogOpenChange(visible, "changePassword")
        }
      />
    </div>
  );
};

export default HomeLayout;
