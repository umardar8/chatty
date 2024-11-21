import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaLocationPinLock } from "react-icons/fa6";
import moment from "moment/moment";
import Mapbox from "../mapbox";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TimePickerDialog from "../time-picker-dialog";

const MessageBar = () => {

  // reference variable for showing emoji box
  const emojiRef = useRef();

  // integration of socket for message sending functionality
  const socket = useSocket();
  
  // integration of app store for using data from global variables
  const { userInfo, selectedChatType, selectedChatData } = useAppStore();

  // message's text content
  const [message, setMessage] = useState("");

  // variables for showing emoji modal, location dialog, time dialog respectively
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  // variables for storing date and time data to send with message
  const [startDate, setStartDate] = useState(new Date);
  const [startTime, setStartTime] = useState(moment(new Date).format("HH:mm"));
  const [endDate, setEndDate] = useState(new Date);
  const [endTime, setEndTime] = useState(moment(new Date).format("HH:mm"));
  
  // variables for storing location data to send with message
  const [location, setLocation] = useState({});
  const [customLocationName, setCustomLocationName] = useState("")
  const [showCustomName, setShowCustomName] = useState(false)

  // function for showing location result from search
  const getResults = ({ result }) => {
    console.log({ result });
    const data = {
      location: result?.text,
      address: result?.place_name,
      longitude: result?.geometry?.coordinates[0],
      latitude: result?.geometry?.coordinates[1],
    };
    setLocation(data);
  };

  // open or close emoji modal based on mouse click events
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  // function for adding emoji to the message's text content body
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  // function for sending message data to the socket
  const handleSendMessage = async () => {

    // validate if there is text in message content before sending message
    if (!message.trim()) {
      alert("Message text is required!");
      return;
    }
    
    // emit data to sendMessage function in socket
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
        location: location ? location : undefined,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        customLocationName: customLocationName,
      });
    }

    // Reset message bar variables after sending message
    setLocation(null);
    setMessage("");
    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    setShowCustomName(false);
    setCustomLocationName("");
  };

  return (

    // message bar structure and styling
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 ">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        {/* input field for entering text message content */}
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="relative flex">
          {/* button for adding location to the message */}
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={() => {
              setLocation(null)
              setLocationPickerOpen(true)
              }
            }
          >
            {location && location.longitude && location.latitude ? (
              <FaLocationPinLock className="text-2xl text-[#158b3d]" />
            ) : (
              <MdOutlineAddLocationAlt className="text-3xl" />
            )}
          </button>

          {/* dialog for selecting location on map */}
          <Dialog
            open={locationPickerOpen}
            onOpenChange={setLocationPickerOpen}
          >
            <DialogContent className="bg-[#181920] border-none text-white w-[500px] h-[550px] flex flex-col">
              <DialogHeader>
                <DialogTitle>Add a Location</DialogTitle>
                <DialogDescription>
                  Location-Based Messaging Feature
                </DialogDescription>
              </DialogHeader>
              <Mapbox 
                geocoder={true}
                getResults={getResults}
                setShowCustomName={setShowCustomName}
              />
              {showCustomName ? 
                (<input 
                  className="text-black border-0 rounded-none p-2"
                  type="text"
                  placeholder="add custom location name"
                  value={customLocationName}
                  onChange={(e) => setCustomLocationName(e.target.value)}
                />) : null
              }
              <Button
                className="bg-[#8417ff] px-10 py-2"
                onClick={() => {
                  setLocationPickerOpen(false);
                  setTimePickerOpen(true);
                }}
              >
                Add to Message
              </Button>
            </DialogContent>
          </Dialog>

          {/* dialog for adding time and date to the message */}
          <TimePickerDialog
            open={timePickerOpen}
            onClose={() => setTimePickerOpen(false)}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />
        </div>

        {/* emoji picker button and component */}
        <div className="relative flex">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-3xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      {/* button for sending message */}
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:outline-none focus:text-white transition-all duration-300"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
