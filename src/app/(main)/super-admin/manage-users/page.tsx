
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UsersIcon, EditIcon, Trash2Icon, SearchIcon, BadgeCheckIcon, UserCogIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface User {
  id?: string; 
  fullName: string;
  email: string;
  role: string;
  password?: string; 
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      const usersDBString = localStorage.getItem("usersDB");
      let loadedUsers: User[] = [];
      if (usersDBString) {
        try {
          const parsedUsers = JSON.parse(usersDBString) as User[];
          loadedUsers = parsedUsers.map(u => ({ ...u, id: u.id || u.email }));
        } catch (e) {
          console.error("Error parsing usersDB for manage users page", e);
        }
      }
      
      const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
      if (superAdminEmail && !loadedUsers.find(u => u.email === superAdminEmail)) {
        loadedUsers.unshift({
          id: superAdminEmail,
          fullName: "Super Admin (System)",
          email: superAdminEmail,
          role: "super_admin",
        });
      }
      setUsers(loadedUsers.sort((a,b) => a.fullName.localeCompare(b.fullName)));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = (userEmail: string) => {
    if (userEmail === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
        toast({variant: "destructive", title: "Action Denied", description: "The main Super Admin account cannot be deleted."});
        return;
    }
    if (typeof window !== "undefined") {
        const currentUsers = users.filter(u => u.email !== userEmail);
        localStorage.setItem("usersDB", JSON.stringify(currentUsers.map(({id, ...rest}) => rest))); 
        setUsers(currentUsers);
        toast({title: "User Deleted", description: `User ${userEmail} has been removed.`});
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-120px)]">
        <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center text-white">
          <UserCogIcon className="mr-3 h-8 w-8 text-sky-400" /> Manage Users
        </h1>
        <p className="text-gray-300">View, edit, or suspend user accounts.</p>
      </div>

      <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white font-semibold">User List</CardTitle>
          <CardDescription className="text-gray-300">
            Showing {users.length} registered users. 
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <Alert className="bg-slate-700/50 border-slate-600 text-gray-300">
              <SearchIcon className="h-4 w-4 text-gray-400" />
              <AlertTitle className="text-gray-200 font-semibold">No Users Found</AlertTitle>
              <AlertDescription>There are no users matching your criteria.</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-400">Full Name</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Role</TableHead>
                    <TableHead className="text-right text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id || user.email} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="font-medium text-gray-100">{user.fullName}</TableCell>
                      <TableCell className="text-gray-200">{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                            variant={'outline'}
                            className={
                                user.role === 'super_admin' ? 'border-sky-400 text-sky-400 bg-sky-400/10' : 
                                user.role === 'hotel_owner' ? 'border-accent text-accent bg-accent/10' : 
                                'border-gray-600 text-gray-300 bg-gray-700/30'
                            }
                        >
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="mr-2 text-gray-400 hover:text-sky-400" disabled>
                          <EditIcon className="h-4 w-4" />
                          <span className="sr-only">Edit User</span>
                        </Button>
                        {!(user.role === 'super_admin' && user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) && (
                          <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive" onClick={() => handleDeleteUser(user.email)}>
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Delete User</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
