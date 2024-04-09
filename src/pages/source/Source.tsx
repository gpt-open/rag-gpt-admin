import { NavTabsTrigger, Tabs, TabsList } from "@/components/ui/tabs";
import React from "react";
import { Outlet, useMatches } from "react-router-dom";

const navTabs = [
  {
    label: "Website",
    value: "website",
    path: "/source/",
  },
];

export const Source = () => {
  const matchs = useMatches();
  const [currentTab, setCurrentTab] = React.useState("website");

  React.useEffect(() => {
    setCurrentTab(
      navTabs.find((nav) => nav.path === matchs[3]?.pathname)?.value ??
        "website"
    );
  }, []);

  return (
    <div className="flex">
      <div className="mt-[5vh] mr-6">
        <Tabs
          value={currentTab}
          onValueChange={(v) => setCurrentTab(v)}
          orientation="vertical"
        >
          <TabsList className="flex flex-col h-auto">
            {navTabs.map((nav) => (
              <NavTabsTrigger {...nav} key={nav.value} className="w-[80px]" />
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
