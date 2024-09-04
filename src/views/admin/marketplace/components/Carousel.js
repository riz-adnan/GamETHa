import React, { useState, useEffect } from 'react';
import Banner from './Banner'; // Adjust the import path according to your project structure

import { Button, Flex } from '@chakra-ui/react';

export default function Carousel(props) {
    const { gameDetailsList } = props;
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % gameDetailsList.length);
        }, 3000); // Change slide every 3 seconds
        return () => clearInterval(interval);
    }, [gameDetailsList.length, activeIndex]);

    return (
        <div id="carouselExampleCaptions" className="relative" data-twe-carousel-init data-twe-ride="carousel">
            <div className="absolute bottom-0 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0" data-twe-carousel-indicators>
                {gameDetailsList.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none ${activeIndex === index ? 'opacity-100' : ''}`}
                        aria-current={activeIndex === index ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => setActiveIndex(index)}
                    ></button>
                ))}
            </div>

            <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
                {gameDetailsList.map((gameDetails, index) => (
                    <div
                        key={index}
                        className={`relative float-left w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none ${activeIndex === index ? '' : 'hidden'}`}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <Banner gameDetails={gameDetails} />
                    </div>
                ))}
            </div>

            <Flex
                w="80%"
                justifyContent="space-between"
                mx="auto"
                mt="10px"
            >
                <Button
                    className="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
                    type="button"
                    onClick={() => setActiveIndex((prevIndex) => (prevIndex - 1 + gameDetailsList.length) % gameDetailsList.length)}
                >
                    <span className="inline-block h-8 w-8">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </span>
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Previous
                    </span>
                </Button>
                <Button
                    className="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
                    type="button"
                    onClick={() => setActiveIndex((prevIndex) => (prevIndex + 1) % gameDetailsList.length)}
                >
                    <span className="inline-block h-8 w-8">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </span>
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Next
                    </span>
                </Button>
            </Flex>
        </div>
    );
};