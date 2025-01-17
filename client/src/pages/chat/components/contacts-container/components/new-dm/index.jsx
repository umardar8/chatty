import { 
    TooltipProvider, 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
  } from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"  
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import Lottie from "react-lottie"
import { animationDefaultOptions } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"
import { useAppStore } from "@/store"

const NewDM = () => {

    const {setSelectedChatType, setSelectedChatData} = useAppStore()
    const [openNewContactModal, setOpenNewContactModal] = useState(false)
    const [searchedContacts, setsearchedContacts] = useState([])
    const searchContacts = async (searchTerm) => {
        try {
            if(searchTerm.length>0){
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTES, {searchTerm}, {withCredentials: true})
                if(response.status===200 && response.data.contacts) {
                    setsearchedContacts(response.data.contacts)
                }
            } else {
                setsearchedContacts([])
            }
        } catch(error) {
            console.log(error)
        }
    };

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false)
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setsearchedContacts([])
        
    };

  return (
    <>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus 
                        className='text-neutral-400/90 font-light text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'
                        onClick={()=>{
                            setOpenNewContactModal(true)
                        }}
                    />
                </TooltipTrigger>
                <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
                    <p>new chat</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
            <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
                <DialogHeader>
                    <DialogTitle>Select a contact</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Input 
                        placeholder='search contacts' 
                        className='rounded-lg p-6 bg-[#2c2e3b] border-none'
                        onChange={e=>searchContacts(e.target.value)}
                    />
                </div>
                    {searchedContacts.length > 0 && (
                        <ScrollArea className='h-[250px]'>
                            <div className="flex flex-col gap-5">
                                {
                                    searchedContacts.map((contact) => (
                                        <div 
                                            key={contact._id} 
                                            className="flex gap-3 items-center cursor-pointer"
                                            onClick={() => selectNewContact(contact)}
                                        >
                                            <div className='w-12 h-12 relative'>
                                                <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                                                    {contact.image ? (
                                                        <AvatarImage 
                                                            alt='profile'
                                                            src={`${HOST}/${contact.image}`}
                                                            className='object-cover h-full w-full bg-black rounded-full' 
                                                        /> 
                                                    ) : (
                                                        <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                            {
                                                                contact.firstName 
                                                                ? contact.firstName.split("").shift()
                                                                : contact.email.split("").shift()
                                                            }
                                                        </div>
                                                    )}
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{
                                                    contact.firstName && contact.lastName 
                                                    ? `${contact.firstName} ${contact.lastName}` : contact.email
                                                }</span>
                                                <span className="text-xs">
                                                    {contact.email}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </ScrollArea>
                    )}
                    {
                        searchedContacts.length <=0 && (
                            <div className="flex-1 md:bg-[#181920] md:mt-0 mt-5 md:flex flex-col items-center justify-center transition-all duration-1000">
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={100}
                                    width={100}
                                    options={animationDefaultOptions}
                                />
                                <div className="text-white/80 flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                                    <h3 className="poppins-medium">
                                        start a new <span className="text-purple-500">Chat</span>
                                    </h3>
                                </div>
                            </div>
                        )
                    }
            </DialogContent>
        </Dialog>
    </>
  )
}

export default NewDM