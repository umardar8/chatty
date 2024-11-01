import React from 'react'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { useAppStore } from '@/store'
import { HOST, LOGOUT_ROUTE } from '@/utils/constants'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/components/ui/tooltip'
import { FaEdit } from 'react-icons/fa'
import { IoPowerSharp } from 'react-icons/io5'
import { getColor } from '@/lib/utils';
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/api-client'

const ProfileInfo = () => {
    const {userInfo, setUserInfo} = useAppStore()
    const navigate = useNavigate()

    const logout = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, {withCredentials: true});

            if (response.status === 200) {
                navigate("/auth")
                setUserInfo(null)
            }
        } catch(error) {
            console.log(error)
        }
    }

  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
        <div className='flex gap-3 items-center justify-center'>
            <div className='w-12 h-12 relative'>
                <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                    {userInfo.image ? (
                        <AvatarImage 
                            alt='profile'
                            src={`${HOST}/${userInfo.image}`}
                            className='object-cover h-full w-full bg-black' 
                        /> 
                    ) : (
                        <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                        {
                            userInfo.firstName 
                            ? userInfo.firstName.split("").shift()
                            : userInfo.email.split("").shift()
                        }
                        </div>
                    )}
                </Avatar>
            </div>
            <div>
                {
                    userInfo.firstName && userInfo.lastName 
                    ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                }
            </div>
        </div>
        <div className='flex gap-5'>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <FaEdit className='text-purple-500 text-xl font-medium' />
                </TooltipTrigger>
                <TooltipContent>
                    <p>edit profile</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <IoPowerSharp 
                        className='text-red-500 text-xl font-medium' 
                        onClick={logout}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>logout</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        </div>
    </div>
  )
}

export default ProfileInfo