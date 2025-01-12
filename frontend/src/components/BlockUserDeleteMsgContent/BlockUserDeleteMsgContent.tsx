import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Ban, Trash2 } from 'lucide-react'
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
} from "@/components/ui/alert-dialog"

export default function ActionButtonsWithConfirmation() {
  const [isBlockOpen, setIsBlockOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleBlock = () => {
    console.log("User blocked")
    setIsBlockOpen(false)
  }

  const handleDelete = () => {
    console.log("Conversation deleted")
    setIsDeleteOpen(false)
  }

  return (
    <div className="w-[120px] divide-y divide-x-0 divide-gray-200 border border-gray-200 rounded-md overflow-hidden font-font">
      <AlertDialog open={isBlockOpen} onOpenChange={setIsBlockOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full text-red hover:text-white hover:bg-red rounded-none h-10 justify-between px-3 font-medium transition-colors"
          >
            Block
            <Ban className="w-4 h-4 ml-2" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="font-font">
          <AlertDialogHeader>
            <AlertDialogTitle >Are you sure you want to block this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This user will no longer be able to interact with you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-primaryColour hover:bg-fadedPrimaryColour hover:text-white font-font">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock} className="bg-red text-white hover:bg-red/90 font-font">Block User</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full text-red hover:text-white hover:bg-red rounded-none h-10 justify-between px-3 font-medium transition-colors"
          >
            Delete
            <Trash2 className="w-4 h-4 ml-2" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="font-font">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-primaryColour hover:bg-fadedPrimaryColour hover:text-white font-font">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red text-white hover:bg-red/90 font-font">Delete Conversation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

  )
}

