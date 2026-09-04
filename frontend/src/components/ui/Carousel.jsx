import React from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

function Carousel({images, altPrefix}) {

    const [currIndex, setCurrIndex] = React.useState(0);
    const next = () =>{
        setCurrIndex((prev)=>(prev+1)%images.length);
    }

    const prev = () =>{
        setCurrIndex((prev)=>(prev-1+images.length)%images.length);
    }


  return (
       <div className="relative w-full md:max-w-3xl lg:max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
                <img
                    src={images[currIndex]}
                    alt={`${altPrefix} screenshot ${currIndex + 1}`}
                    className="w-full h-auto object-cover"
                />
            </div>

            <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-md"
            >
                <IoChevronBack className="w-5 h-5" />
            </button>
            <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-md"
            >
                <IoChevronForward className="w-5 h-5" />
            </button>

            <div className="flex justify-center gap-2 mt-4">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrIndex(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === currIndex ? 'bg-emerald-600' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
  )
}

export default Carousel
