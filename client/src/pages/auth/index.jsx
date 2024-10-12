import React, { useState } from 'react'
import victory from '../../assets/victory.svg'
import background from '../../assets/login2.png'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Auth = () => {

    const {email, setEmail} = useState("")
    const {password, setPassword} = useState("")
    const {confirmPassword, setConfirmPassword} = useState("")

    const handleLogin = async () => {}
    const handleSignup = async () => {}

    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center'>

            <div 
                className='
                    h-[80vh] 
                    w-[80vw] md:w-[90vw] lg:w[70vw] xl:w-[60vw]
                    bg-white shadow-2xl
                    border-2 border-white rounded-3xl
                    text-opacity-90
                    grid xl:grid-cols-2
                '
            >
                <div className='flex flex-col items-center justify-center gap-10'>

                    <div className='flex flex-col items-center justify-center'>

                        <div className='flex items-center justify-center'>
                            <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                            <img src={victory} alt='victory emoji' className='h-[100px]' />
                        </div>
                        <p className='font-medium text-center'>Fill in the details to get started with the best Chat App</p>

                    </div>

                    <Tabs className='w-3/4'>
                        <TabsList className='w-full bg-transparent rounded-none'>
                            <TabsTrigger 
                                value="login" 
                                className='
                                    data-[state=active]:bg-transparent data-[state=active]:text-black 
                                    data-[state=active]:font-semibold data-[state=active]:border-b-purple-500
                                    text-black text-opacity-90 
                                    border-b-2 rounded-none w-full p-3 transition-all duration-300
                                '
                            >Login</TabsTrigger>
                            <TabsTrigger 
                                value="signup"
                                className='
                                    data-[state=active]:bg-transparent data-[state=active]:text-black 
                                    data-[state=active]:font-semibold data-[state=active]:border-b-purple-500
                                    text-black text-opacity-90 
                                    border-b-2 rounded-none w-full p-3 transition-all duration-300
                                '
                            >Signup</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className='flex flex-col gap-5 mt-10'>
                            <Input 
                                placeholder='email' 
                                type='email'
                                className='rounded-full p-6'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <Input 
                                placeholder='password' 
                                type='password'
                                className='rounded-full p-6'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />

                            <Button onClick={handleLogin} className='rounded-full p-6'>Login</Button>
                        </TabsContent>
                        <TabsContent value="signup" className='flex flex-col gap-5'>
                        <Input 
                                placeholder='email' 
                                type='email'
                                className='rounded-full p-6'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <Input 
                                placeholder='password' 
                                type='password'
                                className='rounded-full p-6'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <Input 
                                placeholder='confirm password' 
                                type='password'
                                className='rounded-full p-6'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />

                            <Button onClick={handleSignup} className='rounded-full p-6'>Signup</Button>

                        </TabsContent>
                    </Tabs>

                </div>

            </div>

            <div className='hidden lg:flex items-center justify-center'>
                <img src={background} alt='background image' className='h-700px' />
            </div>
        </div>
    )
}

export default Auth;