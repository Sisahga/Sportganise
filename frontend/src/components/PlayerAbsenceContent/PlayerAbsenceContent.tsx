import { useState } from "react";
import { Frown } from "lucide-react";
import { LogOut } from "lucide-react";

export default function PlayerAbsenceContent() {
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleButtonClick = () => {
    setModalVisible(true); // Show the modal on button click
  };

  const handleLeave = () => {
    setModalVisible(false); // Close the modal
    setNotificationVisible(true); // Show the notification
    setTimeout(() => {
      setNotificationVisible(false); // Hide the notification after 3 seconds
    }, 3000);
  };

  const handleCancel = () => {
    setModalVisible(false); // Close the modal without proceeding
  };

  return (
    <div className="flex justify-center">
      {/* Absent Button */}
      <button
        onClick={handleButtonClick}
        className="w-40 bg-secondaryColour hover:bg-white hover:text-secondaryColour hover:border-2 hover:border-secondaryColour text-white font-bold py-2 px-4 rounded-full flex items-center justify-center space-x-2"
      >
        <LogOut className="w-5 h-5" />
        <span>Absent</span>
      </button>

      {/* Confirmation Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="text-lg font-semibold mb-4">Are you sure?</p>
            <div className="flex justify-around">
              <button
                onClick={handleCancel}
                className="bg-secondaryColour hover:bg-white hover:text-secondaryColour hover:border-2 hover:border-secondaryColour text-white font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleLeave}
                className="bg-white hover:bg-fadedPrimaryColour text-fadedPrimaryColour hover:text-white font-bold py-2 px-4 rounded-full border-2 border-fadedPrimaryColour"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {isNotificationVisible && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-secondaryColour text-white p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2">
            <Frown className="w-12 h-12" />
            <p>Your absence is noted</p>
          </div>
        </div>
      )}
    </div>
  );
}
