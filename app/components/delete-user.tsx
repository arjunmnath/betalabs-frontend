import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { UserContext } from "../mainpage";
import { useToast } from "@/components/ui/use-toast";

const DeleteUser = (props: { username: string }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const { toast } = useToast();
  const context = useContext(UserContext);
  const deleteUser = async (username: string) => {
    const res = await fetch("http://localhost:8008/users", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    });
    const content = await res.json();
    console.log(content.message);
    if (content.code == 200) {
      toast({
        title: "Way To Go!",
        description: "User Has Been Successfully Deleted!",
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

  return (
    <AlertDialog open={alertOpen} onOpenChange={(open) => setAlertOpen(open)}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteUser(props.username)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteUser;
