import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import { FaLocationPinLock } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import Mapbox from "../mapbox";
import { toast } from "sonner";

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(moment(new Date()).format("ll"));
  const [currentTime, setCurrentTime] = useState(moment(new Date()).format("LT"));
  const [showLocation, setShowLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    currentLatitude: null,
    currentLongitude: null,
  });

  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
  
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }

      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      const interval = setInterval(() => {
        //Update currentDate and currentTime every minute
        const now = new Date();
        setCurrentDate(moment(now).format("ll"));
        setCurrentTime(moment(now).format("LT"));
      }, 1000); // Update every second
    
      return () => clearInterval(interval); // Cleanup on unmount
    }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }

    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setCurrentLocation({
        currentLatitude: latitude,
        currentLongitude: longitude,
      });
    }

    function error() {
      console.log("Unable to retrieve your location");
    }
  }, []);

  useEffect(() => {

    if (selectedChatData._id && selectedChatType === "contact") getMessages();
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);  

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {

    const receivedDate = moment(message?.startDate).format("ll");
    const receivedTime = moment(message?.startTime, "HH:mm").format("h:mm a");
    const expiryDate = moment(message?.endDate).format("ll");
    const expiryTime = moment(message?.endTime, "HH:mm").format("h:mm a");
  
    const isTimeToDeliver = currentDate > receivedDate || (currentDate == receivedDate && currentTime >= receivedTime)
    
    return (
    <div className={`${ message.sender === selectedChatData._id ? "text-left" : "text-right" }`}>

      <div
        className={`
          ${
            message.sender !== selectedChatData._id
              ? "bg-[#00ccff]/5 text-[#00ccff]/90 border-[#00ccff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[66%] break-words
        `}
      >
        <>
        {message.messageType === "text" && !message.location ? (
          message.content
        ) : (<>
          {isTimeToDeliver 
          ? <>{message.content}</>
          : (
              <>
                You have a new message at{" "}
                <span
                  className="underline cursor-pointer"
                  onClick={() => setShowLocation(true)}
                >
                  {message?.location?.location}
                </span>
              </>
          )}
        <div
          className={`
            ${message.sender === selectedChatData._id ? "items-start" : "items-end"}
            pt-3 flex flex-col text-[#808080] gap-2 text-xs
          `}
        >
          
          {isTimeToDeliver ? 
            <span 
              className="flex gap-2 items-center hover:cursor-pointer hover:underline" 
              onClick={() => setShowLocation(true)}
            >
            {message?.location?.location} <FaLocationPinLock />
          </span> : null}
          <div className="flex gap-4 text-[#808080] text-xs">
            <span className="flex gap-2 items-center">
              {`${receivedDate} ${receivedTime}`} <FaClock className="text-green-500" />
            </span>
            <span className="flex gap-2 items-center">
              {`${expiryDate} ${expiryTime}`} <FaClock className="text-red-400" />
            </span>
          </div>
        </div>
        </>)}
      </>
      </div>
      <div className="text-xs text-gray-600 ">
        {moment(message.timestamp).format("LT")}
      </div>
      <Dialog open={showLocation} onOpenChange={setShowLocation}>
        <DialogContent className="bg-[#181920] border-none text-white w-[600px] h-[580px] flex flex-col">
          <DialogHeader>
            <DialogTitle>View AR Component on Location</DialogTitle>
          </DialogHeader>
          <Mapbox 
            longitude={message?.location?.longitude}
            latitude={message?.location?.latitude}
          />
        </DialogContent>
      </Dialog>
    </div>
  )}
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;