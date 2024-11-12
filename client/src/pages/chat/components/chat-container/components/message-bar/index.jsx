import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import GeocoderControl from "../geocoder-control";
import { Map, Layer, useControl, Marker } from "react-map-gl";
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {ScatterplotLayer} from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { FaLocationPinLock } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
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
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}

const MessageBar = () => {
  const emojiRef = useRef();
  const socket = useSocket();
  const { userInfo, selectedChatType, selectedChatData } = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endDate, setEndDate] = useState();
  const [endTime, setEndTime] = useState();
  const [location, setLocation] = useState({});

  // const layers = [
  //   new ScatterplotLayer({
  //     id: 'deckgl-circle',
  //     data: [
  //       {position: [0.45, 51.47]}
  //     ],
  //     getPosition: d => d.position,
  //     getFillColor: [255, 0, 0, 100],
  //     getRadius: 1000,
  //     beforeId: 'waterway-label' // In interleaved mode render the layer under map labels
  //   })
  // ];

  // const skyLayer = {
  //   id: 'sky',
  //   type: 'sky',
  //   paint: {
  //     'sky-type': 'atmosphere',
  //     'sky-atmosphere-sun': [0.0, 0.0],
  //     'sky-atmosphere-sun-intensity': 15
  //   }
  // };

  const threeDLayer = {
    id: '3d-buildings',
    source: 'composite',
    'source-layer': 'building',
    filter: ['==', 'extrude', 'true'],
    type: 'fill-extrusion',
    minzoom: 15,
    paint: {
      'fill-extrusion-color': '#aaa',
      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "height"]
      ],
      'fill-extrusion-base': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "min_height"]
      ],
      'fill-extrusion-opacity': .6
    }
  }

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

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    
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
      });
    }
    // Reset location and message bar after sending
    setLocation(null);
    setMessage("");
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 ">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="relative flex">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={() => setLocationPickerOpen(true)}
          >
            {location && location.longitude && location.latitude ? (
              <FaLocationPinLock className="text-2xl text-[#158b3d]" />
            ) : (
              <MdOutlineAddLocationAlt className="text-3xl" />
            )}
          </button>
          <Dialog
            open={locationPickerOpen}
            onOpenChange={setLocationPickerOpen}
          >
            <DialogContent className="bg-[#181920] border-none text-white w-[600px] h-[600px] flex flex-col">
              <DialogHeader>
                <DialogTitle>Add a Location</DialogTitle>
                <DialogDescription>
                  Location-Based Messaging Feature
                </DialogDescription>
              </DialogHeader>
              <Map
                initialViewState={{
                  longitude: 68.2605725,
                  latitude: 25.4080005,
                  zoom: 16,
                  pitch: 60,
                  antialias: true
                }}
                
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                mapboxAccessToken={"pk.eyJ1IjoidW1hcmRhcjgiLCJhIjoiY2tic3VlczlyMDNuMDJycnE0eWxibDVsZSJ9.NaBkb4_2kJoSMVUp27W51w"}                

                // mapStyle="mapbox://styles/mapbox/streets-v9"
                // mapStyle="mapbox://styles/mapbox/satellite-v9"
                // mapStyle="mapbox://styles/mapbox/light-v9"
                maxPitch={85}
                // terrain={{source: 'mapbox-dem', exaggeration: 1.5}}
              >
                <GeocoderControl
                  mapboxAccessToken={"pk.eyJ1IjoidW1hcmRhcjgiLCJhIjoiY2tic3VlczlyMDNuMDJycnE0eWxibDVsZSJ9.NaBkb4_2kJoSMVUp27W51w"}                  
                  position="top-left"
                  onResult={getResults}
                />

                <Layer {...threeDLayer} />
                
                {/* <Marker>
                  {`Clicked here`}
                </Marker> */}
                
                {/* {markers.map((m, i) => <Marker {...m} key={i} />)} */}

                {/* <DeckGLOverlay layers={layers} interleaved /> */}

              </Map>
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
          <Dialog open={timePickerOpen} onOpenChange={setTimePickerOpen}>
            <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[430px] flex flex-col">
              <DialogHeader>
                <DialogTitle>Add Time & Expiration</DialogTitle>
                <DialogDescription>
                  What time works best to deliver this message?
                </DialogDescription>
                <Separator />
              </DialogHeader>
              <div className="flex gap-5 flex-col">
                <h3>Select Time to Deliver Message.</h3>
                <div className="flex gap-2">
                  {/* start Date */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"secondary"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                      <Select
                        onValueChange={(value) =>
                          setStartDate(addDays(new Date(), parseInt(value)))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="0">Today</SelectItem>
                          <SelectItem value="1">Tomorrow</SelectItem>
                          <SelectItem value="3">In 3 days</SelectItem>
                          <SelectItem value="7">In a week</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="rounded-md border">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <input
                    type="time"
                    className="bg-white text-black rounded-lg px-2"
                    onChange={(e) => {
                      setStartTime(e.target.value);
                    }}
                  />
                </div>
                <h3>Select Time for Message to Expire.</h3>
                <div className="flex gap-2">
                  {/* End Date */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"secondary"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                      <Select
                        onValueChange={(value) =>
                          setEndDate(addDays(new Date(), parseInt(value)))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="0">Today</SelectItem>
                          <SelectItem value="1">Tomorrow</SelectItem>
                          <SelectItem value="3">In 3 days</SelectItem>
                          <SelectItem value="7">In a week</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="rounded-md border">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <input
                    type="time"
                    className="bg-white text-black rounded-lg px-2"
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                <Separator />
                <RadioGroup defaultValue="option-one" className="flex">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="option-one"
                      id="option-one"
                      className="bg-[#ffffff]"
                    />
                    <Label htmlFor="option-one">Request</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="option-two"
                      id="option-two"
                      className="bg-[#ffffff]"
                    />
                    <Label htmlFor="option-two">Review</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="option-three"
                      id="option-three"
                      className="bg-[#ffffff]"
                    />
                    <Label htmlFor="option-two">Suggestion</Label>
                  </div>
                </RadioGroup>
                <Button
                  className="bg-[#8417ff] px-10 py-2"
                  onClick={() => setTimePickerOpen(false)}
                >
                  Add to Message
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
