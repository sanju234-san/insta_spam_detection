/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import axios from "axios";
import Button from './Button';
import { Search } from 'lucide-react';



const Container = () => {
    const [text, setText] = useState("")
    const [result, setResult] = useState("")
    const handlePredict = async () => {
        const res = await axios.post("http://localhost:8000/predict", { text });
        setResult(res.data.result);
    };

    return (
        <div
            className="p-4 w-full max-w-[60%] mx-auto flex items-center justify-center flex-col mt-20 gradient rounded-2xl bg-no-repeat bg-cover bg-center h-[60vh]"
            style={{
                backgroundImage: 'url("https://img.freepik.com/premium-vector/spam-detection-concept-ai-filte…lutter-ensuring-email-integrity-user-protection-efficient_277904-30558.jpg ")'
            }}
        >

            <div className='flex flex-col justify-center w-full h-full'>

                <h1 className='font-extrabold text-5xl text-black self-center'>Detect Spam on Social Media</h1>
                
                <p className='text-black font-bold text-xl text-center mt-4'>Enter a post URL or username to analyze for spam. Our advanced algorithms identify potential threats and keep your feed clean.</p>

                <div className="flex self-center mt-10 bg-[#201317] py-2 p-2 rounded-xl items-center">

                    <Search size={23} />
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter something..."
                        className="border-none p-2 h-7 self-center outline-none"
                    />
                    
                    <Button
                        onClick={handlePredict}
                        className="ml-2 p-2 bg-blue-500 text-white"
                        title='Get Started'
                    />
                </div>
                {/* <div className="mt-4">Prediction: {result}</div> */}
            </div>
        </div>
    );
}

export default Container
