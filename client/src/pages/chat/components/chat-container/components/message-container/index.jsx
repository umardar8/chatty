import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import { FaLocationPinLock, FaHourglassEnd, FaHourglassStart } from "react-icons/fa6";
import { PiCodesandboxLogoFill } from "react-icons/pi";
import 'aframe';
import 'ar.js';
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import Mapbox from "../mapbox";

const MessageContainer = () => {

  // scroll reference variable for auto-scrolling when received new message
  const scrollRef = useRef(null);

  // current date and time variables
  const [currentDate, setCurrentDate] = useState(moment(new Date()).format("ll"));
  const [currentTime, setCurrentTime] = useState(moment(new Date()).format("LT"));

  // boolean for showing message location dialog
  const [showLocation, setShowLocation] = useState(false);
  const [showAR, setShowAR] = useState(false)

  // variable for storing user's current location
  const [currentLocation, setCurrentLocation] = useState({
    currentLatitude: null,
    currentLongitude: null,
  });

  // function for calculating if the user's current location is near to the received location of message
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (deg) => (deg * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
  }

  // Global variables data for showing messages
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  // function for getting messages based on the open chat id
  const getMessages = async () => {
    try {
      const response = await apiClient.post(
        GET_ALL_MESSAGES_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // updating current date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(moment(now).format("ll"));
      setCurrentTime(moment(now).format("LT"));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // updating user's current location on page load 
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

  // fetch chat messages
  useEffect(() => {
    if (selectedChatData._id && selectedChatType === "contact") getMessages();
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // function for rendering structure and design of the chat screen
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

  // function for showing messages in chat screen
  const renderDMMessages = (message) => {

    // extracting data from received message
    const receivedDate = moment(message?.startDate).format("ll");
    const receivedTime = moment(message?.startTime, "HH:mm").format("h:mm a");
    const expiryDate = moment(message?.endDate).format("ll");
    const expiryTime = moment(message?.endTime, "HH:mm").format("h:mm a");
    const receivedLatitude = message?.location?.latitude;
    const receivedLongitude = message?.location?.longitude;

    // condition 1 for showing message content
    const isWithinLocation =
      haversineDistance(
        currentLocation.currentLatitude,
        currentLocation.currentLongitude,
        receivedLatitude,
        receivedLongitude
      ) <= 5
        ? true
        : false;

    // condition 2 for showing message content
    const isTimeToDeliver =
      currentDate > receivedDate ||
      (currentDate == receivedDate && currentTime >= receivedTime);

    // logging the results for verification in console
    console.log(`currentLatitude: `, currentLocation.currentLatitude);
    console.log(`currentLongitude: `, currentLocation.currentLongitude);
    console.log(`receivedLatitude: `, receivedLatitude);
    console.log(`receivedLongitude: `, receivedLongitude);
    console.log(`isWithinLocation: `, isWithinLocation);
    console.log(`isTimeToDeliver: `, isTimeToDeliver);

    return (
      // show message box in the left for recipient and in the right for sender
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {/* change color of box based on recipient or sender */}
        <div
          className={`
          ${
            message.sender !== selectedChatData._id
              ? "bg-[#00ccff]/5 text-[#00ccff]/90 border-[#00ccff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[66%] break-words
        `}
        >
          {/* logic for showing message content based on location and time
            
            if (!location) {
              show message content
            } else {
              if (withinLocation && timeToDeliver) {
                show message content
              } else {
                show placeholder content
              }
            }

          */}

          <>
            {/* check if there is no location data then show the message content */}
            {message.messageType === "text" && !message.location ? (
              message.content
            ) : (
              <>
                {/* if user is within location and it is time to deliver then show the message content */}
                {isWithinLocation && isTimeToDeliver ? (
                  <> {message.content} </>
                ) : (
                  <>
                    {/* if user is not within location and it is not time to deliver then show a placeholder message */}
                    You have a new message at{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={() => setShowLocation(true)}
                    >
                      {message?.customLocationName}{" "}
                      {message?.location?.location}
                    </span>
                  </>
                )}

                {/* show location information below the location based message */}
                <div
                  className={`
                    ${
                      message.sender === selectedChatData._id
                        ? "items-start"
                        : "items-end"
                    }
                    pt-3 flex flex-col text-[#808080] gap-2 text-xs
                  `}
                >
                  {/* show location name */}
                  <Separator className=" bg-gray-600" />
                  {isTimeToDeliver ? (
                    <div className="flex gap-4">
                      <span
                        className="flex gap-2 items-center hover:cursor-pointer hover:underline"
                        onClick={() => setShowAR(true)}
                      >
                        Show AR <PiCodesandboxLogoFill />
                      </span>
                      <span
                        className="flex gap-2 items-center hover:cursor-pointer hover:underline"
                        onClick={() => setShowLocation(true)}
                      >
                        {message?.customLocationName}{" "}
                        {message?.location?.location} <FaLocationPinLock />
                      </span>
                    </div>
                  ) : null}
                  <div className="flex gap-4 text-[#808080] text-xs">
                    {/* show message receiving time */}
                    <span className="flex gap-2 items-center">
                      {`${receivedDate} ${receivedTime}`}{" "}
                      <FaHourglassStart />
                    </span>
                    {/* show message expiration time */}
                    <span className="flex gap-2 items-center">
                      {`${expiryDate} ${expiryTime}`}{" "}
                      <FaHourglassEnd />
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        </div>
        {/* show the actual time when the message was sent/received */}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>

        {/* show location on map within a dialog when location is clicked in the received message */}
        <Dialog open={showLocation} onOpenChange={setShowLocation}>
          <DialogContent className="bg-[#181920] border-none text-white w-[600px] h-[580px] flex flex-col">
            <DialogHeader>
              <DialogTitle>View AR Component on Location</DialogTitle>
            </DialogHeader>
            <Mapbox
              longitude={message?.location?.longitude}
              latitude={message?.location?.latitude}
              showMarker={true}
            />
          </DialogContent>
        </Dialog>

        {/* show AR component in realtime camera feedback within a dialog */}
        <Dialog open={showAR} onOpenChange={setShowAR}>
          <DialogContent className="bg-[#181920] border-none text-white w-[600px] h-[580px] flex flex-col">
            <DialogHeader>
              <DialogTitle>View AR Component on Location</DialogTitle>
            </DialogHeader>
            <a-scene
              vr-mode-ui="enabled: false"
              embedded
              arjs="sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false;"
            >
              <a-camera gps-camera rotation-reader></a-camera>
              <a-entity
                gltf-model="/client/src/assets/scene.gltf"
                rotation="0 180 0"
                scale="0.15 0.15 0.15"
                gps-entity-place="latitude: 25.404841; longitude: 68.260988;"
                animation-mixer
              ></a-entity>
            </a-scene>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;