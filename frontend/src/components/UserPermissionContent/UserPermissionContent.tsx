import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router";
import { FileKey2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import BackButton from "../ui/back-button";
import useFetchUserPermissions from "@/hooks/useFetchPermissions";
import useUpdateRole from "@/hooks/useModifyPermissions";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";

const UserPermissionContent: React.FC = () => {
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const { data, loading, error, setData } = useFetchUserPermissions();
  const { updateUserRole } = useUpdateRole(data, setData);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<AccountPermissions | null>(
    null,
  );
  const [newRole, setNewRole] = useState<string>("");
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);

  useEffect(() => {
    const user = getCookies();
    if (!user || user.type !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openDialog = (user: AccountPermissions) => {
    setSelectedUser(user);
    setNewRole(user.type);
  };

  const handleRoleChange = (newRole: string) => {
    if (selectedUser) {
      setNewRole(newRole);
    }
  };

  const saveRoleChanges = () => {
    if (newRole !== selectedUser?.type) {
      setOpenAlertDialog(true);
    } else {
      toast({
        title: "No Changes",
        description: "The selected role is the same as the current role.",
        variant: "destructive",
      });
    }
  };

  const confirmRoleChange = () => {
    if (selectedUser) {
      updateUserRole(selectedUser, newRole);
      setOpenAlertDialog(false);
    }
  };

  const cancelRoleChange = () => {
    setOpenAlertDialog(false);
  };

  //Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red">{error}</div>;
  }

  return (
    <div>
      <BackButton />
      <div className="pb-20 container max-w-2xl mx-auto">
        <Card className="space-y-2 max-w-3xl mx-auto mt-4 border shadow-md mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2 mt-4">
              <FileKey2 className="h-6 w-6" />
              User Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {/* SEARCH BAR --will implement after backend user search is ready */}

            {/* <div className="relative ">
              <Input className="mb-2 pl-10" placeholder="Search..." />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search size={16} />
              </div>
            </div> */}

            {/* Display user data */}

            {paginatedData.length > 0 ? (
              paginatedData.map((user) => (
                <Card key={user.accountId} className="w-full border-0">
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-20 h-7"
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(user)}
                        >
                          Modify
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-lg w-[90vw]">
                        <p className="text-sm">
                          Modify permissions for {user.firstName}{" "}
                          {user.lastName}
                        </p>
                        <Select
                          value={newRole}
                          onValueChange={handleRoleChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="COACH">Coach</SelectItem>
                            <SelectItem value="PLAYER">Player</SelectItem>
                            <SelectItem value="GENERAL">General</SelectItem>
                          </SelectContent>
                        </Select>

                        <DialogClose asChild>
                          <div className="text-center mt-2">
                            <Button
                              onClick={saveRoleChanges}
                              variant="default"
                              size="sm"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div>No users found.</div>
            )}
            {/* </div> */}
          </CardContent>
        </Card>

        {/* Pagination */}
        <Pagination className="mt-2 mb-2">
          <PaginationContent>
            <PaginationPrevious
              className="text-primaryColour"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  className="text-primaryColour"
                  onClick={() => handlePageChange(i + 1)}
                  isActive={i + 1 === currentPage}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              className="text-primaryColour"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
            />
          </PaginationContent>
        </Pagination>

        {/* Role Change Confirmation Dialog */}
        <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
          <AlertDialogContent className="w-[90vw] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                Are you sure you want to change the role for{" "}
                {selectedUser?.firstName} {selectedUser?.lastName} to {newRole}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelRoleChange}>
                {" "}
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmRoleChange}>
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserPermissionContent;
