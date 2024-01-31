"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddUser from "./components/add-user";
import { useState, useEffect, createContext, useContext } from "react";
import DeleteUser from "./components/delete-user";
import EditUser from "./components/edit-user";
import type { User } from "@/lib/types";
export const UserContext = createContext({
  fetchUser: async () => {},
});
export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8008/users");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      alert("Run Backend!!!!");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <UserContext.Provider
      value={{
        fetchUser: fetchUsers,
      }}
    >
      <>
        <div className="m-8  h-screen flex flex-col justify-start items-center">
          <div className="flex w-full justify-end">
            <AddUser />
          </div>
          <Table className="p-8 w-[90vw]">
            <TableCaption>A list of Users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">
                  Username
                </TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Age</TableHead>
                <TableHead className="text-center">Mobile</TableHead>
                <TableHead className="text-center"> Actions </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.username}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">{user.age}</TableCell>
                  <TableCell className="text-center">
                    <pre>+91 {user.mobile}</pre>
                  </TableCell>
                  <TableCell className="flex gap-4 justify-center">
                    <EditUser user={user} />
                    <DeleteUser username={user.username} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    </UserContext.Provider>
  );
}
