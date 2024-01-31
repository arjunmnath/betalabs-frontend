import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import validator from "validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { UserContext } from "../mainpage";
import { useContext, useState } from "react";

import type { User } from "@/lib/types";
const EditUser = (props: { user: User }) => {
  const userSchema = z.object({
    username: z.string().min(2).max(40),
    age: z.number().min(18).max(100),
    email: z
      .string()
      .min(1, { message: "Field Required" })
      .email("Not a valid email"),
    mobile: z.string().refine(validator.isMobilePhone),
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: props.user.username,
      age: props.user.age,
      email: props.user.email,
      mobile: props.user.mobile.toString(),
    },
  });
  const context = useContext(UserContext);
  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    setDialogOpen(false);
    toast({
      title: "Adding User....",
    });
    const res = await fetch("http://localhost:8008/users", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const content = await res.json();
    console.log(content.message);
    if (content.code == 200) {
      toast({
        title: "Way To Go!",
        description: "User Has Been Successfully Added!",
      });
      context.fetchUser();
    } else {
      toast({
        title: "Oops!",
        description: "Something Went Wrong",
        variant: "destructive",
      });
    }
  };
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger>
        <Button variant="outline">
          <Pencil1Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter New User Details</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="m-6 p-4 grid w-full max-w-sm items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input value={field.value} disabled={true} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          name={field.name}
                          ref={field.ref}
                          value={Number.isNaN(field.value) ? "" : field.value}
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            form.setValue(
                              field.name,
                              parseInt(e.target.value, 10),
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile No</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex gap-4 justify-end px-6">
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(!dialogOpen)}
                >
                  {" "}
                  Cancel{" "}
                </Button>
                <Button type="submit"> Add </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default EditUser;
