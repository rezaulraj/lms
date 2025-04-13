import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const NotificationModal = ({
  isAdmin,
  participantName,
  setVisible,
  visible,
  notificationQueue,
  currentNotification,
  setCurrentNotification,
  setNotificationQueue,
}) => {
  // Effect to handle adding new participant to the notification queue


  // Effect to handle showing notifications from the queue
  useEffect(() => {
    if (notificationQueue.length > 0 ) {
      // Show the first notification in the queue
      const newNotification = notificationQueue[0];
      setCurrentNotification(newNotification);
      setVisible(true); // Make the notification visible

      console.log("Notification shown:", newNotification);

      // Hide the notification after 3 seconds
      const hideTimer = setTimeout(() => {
        console.log("Hiding notification:", newNotification);
        setVisible(false); // Hide the notification
        setNotificationQueue((prevQueue) => prevQueue.slice(1)); // Remove the displayed notification
        setCurrentNotification(null); // Clear the current notification
      }, 3000); // Set the notification to be visible for 3 seconds

      // Clear the timeout when the component unmounts or the queue changes
      return () => {
        console.log("Clearing timeout");
        clearTimeout(hideTimer);
      };
    }
  }, [currentNotification, notificationQueue, setCurrentNotification, setNotificationQueue, setVisible]);

  // If there's no current notification or it's not visible, return null
  if (!visible || !currentNotification) return null;

  return (
    <div
      className={`absolute bottom-10 right-5 bg-gray-700 w-[20vw] h-[14vh] rounded-md flex items-center justify-center shadow-lg transition-transform duration-500 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="text-white text-center">
        <span className="text-lg font-semibold">
          {currentNotification} joined!
        </span>
        <p className="mt-2 text-sm">A new participant has joined your room.</p>
      </div>
      <div className="absolute top-2 right-2">
        <button
          onClick={() => {
            console.log("Close button clicked");
            setVisible(false);
            setCurrentNotification(null); // Clear current notification immediately
            setNotificationQueue((prevQueue) => prevQueue.slice(1)); // Remove the displayed notification
          }}
        >
          <IoMdClose
            size={20}
            className="text-white hover:bg-gray-500 cursor-pointer"
            title="close"
          />
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
