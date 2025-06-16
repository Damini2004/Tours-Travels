
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
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center text-foreground">
          <UserCogIcon className="mr-3 h-8 w-8 text-primary" /> Manage Users
        </h1>
        <p className="text-muted-foreground">View, edit, or suspend user accounts.</p>
      </div>

      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-xl">User List</CardTitle>
          <CardDescription>
            Showing {users.length} registered users. 
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <Alert className="bg-secondary text-secondary-foreground">
              <SearchIcon className="h-4 w-4" />
              <AlertTitle>No Users Found</AlertTitle>
              <AlertDescription>There are no users matching your criteria.</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id || user.email}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                            variant={user.role === 'super_admin' ? 'default' : user.role === 'hotel_owner' ? 'secondary' : 'outline'}
                            className={
                                user.role === 'super_admin' ? 'bg-primary text-primary-foreground border-primary' : 
                                user.role === 'hotel_owner' ? 'bg-accent text-accent-foreground border-accent' : 
                                'border-border'
                            }
                        >
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="mr-2 text-muted-foreground hover:text-primary" disabled>
                          <EditIcon className="h-4 w-4" />
                          <span className="sr-only">Edit User</span>
                        </Button>
                        {!(user.role === 'super_admin' && user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) && (
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteUser(user.email)}>
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
