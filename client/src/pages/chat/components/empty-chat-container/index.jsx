import { animationDefaultOptions } from "@/lib/utils"
import Lottie from "react-lottie"

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col items-center justify-center hidden transition-all duration-1000">
        <Lottie
            isClickToPauseDisabled={true}
            height={200}
            width={200}
            options={animationDefaultOptions}
        />
        <div className="text-white/80 flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
            <h3 className="poppins-medium">
                Hi<span className="text-purple-500">!</span> Welcome to <span className="text-purple-500">MUET AR CHAT</span>
            </h3>
        </div>
    </div>
  )
}

export default EmptyChatContainer