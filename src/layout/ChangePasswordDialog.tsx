import { changeAdminPassword } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import router from "@/router";
import { getAccount, removeToken } from "@/utils/storage";
import { useState } from "react";
import { toast } from "sonner";

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [inputValue, setInputValue] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const internalOpenChange = (visible: boolean) => {
    if (!visible) {
      setInputValue({
        currentPassword: "",
        newPassword: "",
      });
    }
    onOpenChange(visible);
  };

  const submitUpdate = async () => {
    setLoading(true);
    try {
      await changeAdminPassword({
        new_password: inputValue.newPassword,
        current_password: inputValue.currentPassword,
        account_name: getAccount()!,
      });
      toast.success("Password updated successfully, please log in again.");
      internalOpenChange(false);
      removeToken();
      router.navigate("/login");
    } catch (error) {
      toast.error((error as any).message || "Failed to update password.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={internalOpenChange}>
      <DialogContent
        className="sm:max-w-[520px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Update password</DialogTitle>
        </DialogHeader>

        <div className="my-4">
          <div className="text-sm text-zinc-700">Current password</div>
          <Input
            type="password"
            placeholder="original password"
            value={inputValue.currentPassword}
            onChange={(e) =>
              setInputValue((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
        </div>
        <div className="mb-4">
          <div className="text-sm text-zinc-700">New password</div>
          <Input
            type="password"
            placeholder="original password"
            value={inputValue.newPassword}
            onChange={(e) =>
              setInputValue((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
        </div>

        <DialogFooter>
          <Button type="submit" loading={loading} onClick={submitUpdate}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
