import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment/moment";
import { Map, Marker, NavigationControl } from "react-map-gl";
import { useEffect, useRef, useState } from "react";
import { FaLocationPinLock } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import GeocoderControl from "../geocoder-control";
import Pin from "../pin";

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const currentDate = new Date();
  const [showLocation, setShowLocation] = useState(false);
  const d1 = new Date();
  const d2 = new Date();
  const [currentLocation, setCurrentLocation] = useState({
    currentLatitude: null,
    currentLongitude: null,
  });
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

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
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
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

  const renderDMMessages = (message) => (
    <div
      className={`
          ${
            message.sender === selectedChatData._id ? "text-left" : "text-right"
          }
        `}
    >
      {message.messageType === "text" && message.location === undefined ? (
        <div
          className={`
                ${
                  message.sender !== selectedChatData._id
                    ? "bg-[#00ccff]/5 text-[#00ccff]/90 border-[#00ccff]/50"
                    : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                } border inline-block p-4 rounded my-1 max-w-[50%] break-words
              `}
        >
          {message.content}
        </div>
      ) : (
        <div
          className={`
                ${
                  message.sender !== selectedChatData._id
                    ? "bg-[#00ccff]/5 text-[#00ccff]/90 border-[#00ccff]/50"
                    : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                }
                border inline-block p-4 rounded my-1 max-w-[50%] break-words
              `}
        >
          {moment(currentDate).format("LL") >= moment(message?.startDate).format("LL") &&
            moment(currentDate).format("LT") >= message?.startTime ? (
            <>
              {message.content}
              <div
                className="pt-2 flex text-[#808080] gap-2 text-xs 
                  items-center hover:cursor-pointer hover:underline"
                onClick={() => setShowLocation(true)}
              >
                {message?.location?.location} <FaLocationPinLock />
              </div>
            </>
          ) : (
            <div className="flex flex-col">
              <p>
                You have a new message at{" "}
                <span
                  className="underline cursor-pointer"
                  onClick={() => setShowLocation(true)}
                >
                  {message?.location?.location}
                </span>
              </p>
              <div
                className={`${
                  message.sender === selectedChatData._id
                    ? "justify-start"
                    : "justify-end"
                } 
                  flex gap-4 text-[#808080] text-xs mt-2`}
              >
                <span className="flex gap-2 items-center">
                  <FaClock className="text-green-500" />
                  {`
                    ${moment(message?.startDate).format("ll")} 
                    ${message?.startTime} 
                  `}
                </span>
                <span className="flex gap-2 items-center">
                  <FaClock className="text-red-400" />
                  {`
                    ${moment(message?.endDate).format("ll")}  
                    ${message?.endTime}
                  `}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600 ">
        {moment(message.timestamp).format("LT")}
      </div>
      <Dialog open={showLocation} onOpenChange={setShowLocation}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>View AR Component on Location</DialogTitle>
          </DialogHeader>
          <Map
            initialViewState={{
              longitude: message?.location?.longitude,
              latitude: message?.location?.latitude,
              zoom: 13,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={
              "pk.eyJ1IjoidW1hcmRhcjgiLCJhIjoiY2tic3VlczlyMDNuMDJycnE0eWxibDVsZSJ9.NaBkb4_2kJoSMVUp27W51w"
            }
          >
            {/* <Marker
              longitude={message?.location?.longitude}
              latitude={message?.location?.latitude}
              anchor="bottom"
            >
              <Pin size={20} />
            </Marker> */}
          </Map>
        </DialogContent>
      </Dialog>
    </div>
  );
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
