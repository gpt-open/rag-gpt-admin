import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { adminLogin } from "@/api";
import { saveAccount, saveToken } from "@/utils/storage";
import { toast } from "sonner";
import router from "@/router";

const FormSchema = z.object({
  account: z.string(),
  password: z.string(),
});

export function Login() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const {
        data: { token },
      } = await adminLogin(data.account, data.password);
      saveAccount(data.account);
      saveToken(token);
      router.navigate("/");
    } catch (error) {
      toast.error((error as any).message || "Failed to login.");
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col items-center mt-[10vh]">
      <h1 className="mb-[15vh] scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        OpenKF Docs Bot Admin
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-6">
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <FormControl>
                  <Input placeholder="please input account" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="please input password"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full">
            <Button type="submit" className="w-full" loading={loading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
