/*TODO: HANDLE CHANGE ROLE WITH BACKEND API, MAKE HOOK FOR FETCH USER
WORK IN PROGRESS*/
/*DONE : UI Implemented, Fetched users from backend*/
import React, { useState, useEffect } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { MoveLeft, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getCookies } from "@/services/cookiesService";
import { useToast } from "@/hooks/use-toast";
import { AccountPermissions } from "@/types/account";

const UserPermissionContent: React.FC = () => {
  const [data, setData] = useState<AccountPermissions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<AccountPermissions | null>(
    null,
  );
  const [newRole, setNewRole] = useState<string>(""); // Track new role
  const [openDialog, setOpenDialog] = useState<boolean>(false); // For managing Alert Dialog visibility
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const user = getCookies();
    if (!user || user.type !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/account/permissions",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const result = await response.json();
        console.log("API Response:", result);
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openPopover = (user: AccountPermissions) => {
    setSelectedUser(user);
    setNewRole(user.type); // Set the default new role to the current role
  };

  const handleRoleChange = (newRole: string) => {
    if (selectedUser) {
      setNewRole(newRole); // Update the new role
    }
  };

  const saveRoleChanges = () => {
    if (newRole !== selectedUser?.type) {
      setOpenDialog(true);

      toast({
        title: "No Changes",
        description: "The selected role is the same as the current role.",
        variant: "destructive",
      });
    }
  };

  const confirmRoleChange = () => {
    if (selectedUser) {
      console.log("Saving role changes for:", selectedUser);
      selectedUser.type = newRole;
      setOpenDialog(false);
    }
  };

  const cancelRoleChange = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red">{error}</div>;
  }

  return (
    <div>
      <div className="container max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2">
          <Button
            className="rounded-full w-2"
            variant="outline"
            onClick={() => navigate("/")}
          >
            <MoveLeft />
          </Button>
          <h1 className="text-2xl font-light text-center flex-grow">
            User Permissions
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Input className="mb-2 pl-10" placeholder="Search..." />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search size={16} />
          </div>
        </div>

        {/* Display user data */}
        <div className="grid grid-cols-1 gap-3">
          {paginatedData.length > 0 ? (
            paginatedData.map((user) => (
              <Card key={user.accountId} className="w-full">
                <div className="flex items-center gap-2 p-2 pb-0">
                  <img
                    src={user.pictureUrl || "https://via.placeholder.com/150"}
                    alt={user.firstName}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-bold text-primaryColour">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray">
                      <span className="font-bold text-gray-500">Email:</span>{" "}
                      {user.email}
                    </p>
                    <p className="text-xs text-gray">
                      <span className="font-bold text-secondaryColour">
                        Role:
                      </span>{" "}
                      {user.type}
                    </p>
                  </div>
                </div>
                <CardFooter className="justify-end p-0 pb-2 pr-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="w-20 h-7"
                        variant="outline"
                        size="sm"
                        onClick={() => openPopover(user)}
                      >
                        Modify
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 mr-8">
                      <p className="text-sm text-muted-foreground mb-1">
                        Modify the permissions for {user.firstName}{" "}
                        {user.lastName}.
                      </p>
                      {/* Dropdown to change role */}
                      <Select value={newRole} onValueChange={handleRoleChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="COACH">Coach</SelectItem>
                          <SelectItem value="PLAYER">Player</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="text-center mt-4">
                        <Button
                          onClick={saveRoleChanges}
                          variant="outline"
                          size="sm"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div>No users found.</div>
          )}
        </div>

        {/* Pagination */}
        <Pagination className="mt-2 pb-20">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  isActive={i + 1 === currentPage}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
            />
          </PaginationContent>
        </Pagination>

        {/* Alert Dialog for Role Change Confirmation */}
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change the role for{" "}
                {selectedUser?.firstName} {selectedUser?.lastName} from{" "}
                <strong>{selectedUser?.type}</strong> to{" "}
                <strong>{newRole}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelRoleChange}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmRoleChange}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserPermissionContent;
