import React from 'react'
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TimePickerDialog = ({
    open, 
    onClose, 
    startDate, 
    setStartDate,
    endDate,
    setEndDate,
    startTime, 
    setStartTime,
    endTime,
    setEndTime
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[430px] flex flex-col">
              <DialogHeader>
                <DialogTitle>Add Time & Expiration</DialogTitle>
                <DialogDescription className=" border-b pb-4">
                  What time works best to deliver this message?
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-3 flex-col">
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
                        onValueChange={
                            (value) => setStartDate(addDays(new Date(), parseInt(value)))
                        }
                      >
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
                    defaultValue={startTime}
                    onChange={(e) => { setStartTime(e.target.value); }}
                  />
                </div>
                <h3 className="mt-3">Select Time for Message to Expire.</h3>
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
                        onValueChange={
                            (value) => setEndDate(addDays(new Date(), parseInt(value)))
                        }
                      >
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
                    defaultValue={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                
                <RadioGroup defaultValue="option-one" className="flex mt-4">
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
                  className="bg-[#8417ff] px-10 py-2 mt-6"
                  onClick={onClose}
                >
                  Add to Message
                </Button>
              </div>
            </DialogContent>
          </Dialog>
  )
}

export default TimePickerDialog