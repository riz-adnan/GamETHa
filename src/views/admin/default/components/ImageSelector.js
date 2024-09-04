import React, { useState, useContext } from 'react';
import { Box, Button, Image, Textarea, HStack, Flex, Input, FormLabel } from '@chakra-ui/react';
import axios from 'axios';
import { GameListContext } from 'contexts/GameListContext';

// import Organiser from "../../../contracts/Organiser.json";
// const { ethers } = require("ethers");
// const contractABI = Organiser.abi;
// const contractAddress = '0x8447a887e331766b6fcfc896eedb177d26887f5c';

const ImageSelector = (props) => {
    const { account } = useContext(GameListContext);
    const { profileImage, frameImage, name, setProfileImage, setFrameImage, setName, framesArray, frameAllowed } = props;
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageViaUpload, setImageViaUpload] = useState(null);

    async function getAuthToken() {
        if (!window.ethereum) {
            throw 'wallet not installed';
        }

        const timestamp = Date.now().toString();
        const msg = 'Theta EdgeStore Call ' + timestamp;

        const sig = await window.ethereum.request({
            method: 'personal_sign',
            params: [msg, account],
        });

        return `${timestamp}.${account}.${sig}`;
    }

    const uploadImageFile = async () => {
        console.log("Hi I am at the starting!")
        if (!imageViaUpload) return;

        const authToken = await getAuthToken();

        const formData = new FormData();
        formData.append('file', imageViaUpload);
        console.log("The auth token is: ", authToken, " with the form data: ", formData);
        try {
            const response = await axios.post('https://api.thetaedgestore.com/api/v2/data', formData, {
                headers: {
                    'x-theta-edgestore-auth': authToken,
                },
            });
            console.log("The respective response is: ", response);
            const fileKey = response.data.key;
            const fileUrl = `https://data.thetaedgestore.com/api/v2/data/${fileKey}`;


            alert('File uploaded successfully!');
            setProfileImage(fileUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        }
    };

    const handleGenerateImages = async () => {
        console.log("desc = ", description);
        const response = await axios.post('https://thetaedge-1.onrender.com/image-gen', {
            body: { prompt: description }
        }, {
            responseType: 'blob', // Important for receiving a Blob response
        });
        console.log("response", response);

        // Create a URL for the received Blob
        const imageBlob = new Blob([response.data], { type: 'image/png' });
        console.log("imageblob", imageBlob);
        const imageObjectUrl = URL.createObjectURL(imageBlob);

        // Set the image URL to state
        //   setImageUrl(imageObjectUrl);
        setProfileImage(imageObjectUrl);
        console.log("Image url ", imageObjectUrl);
    };

    const handleImageSelect = (index) => {
        setSelectedImage(index);
    };

    return (
        <Flex
            spacing={4}
            position="absolute"
            top="-8vh"
            left="5vw"
            zIndex={110}
            flexDirection="column"
            w="64vw"
            h="85vh"
            bg="black"
            p={4}
            alignItems="center"
            rounded="2em"
            justifyContent="space-evenly"
        >
            <Flex>
                <FormLabel color="white">Enter new name</FormLabel>
                <Input
                    placeholder="Enter new name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="md"
                    w="20em"
                    h="2em"
                    rounded="1em"
                    color="white"
                />
            </Flex>
            <HStack spacing={4} border="3px solid greeen">
                <Box
                    onClick={() => handleImageSelect(0)}
                    cursor="pointer"
                    flex={selectedImage === 0 ? 2 : 1}
                    transition="flex 0.3s"
                >
                    <Image
                        src={profileImage}
                        alt={`Generated`}
                        objectFit="cover"
                        w="100%"
                        h={selectedImage === 0 ? '300px' : '150px'}
                    />
                </Box>
                <Box
                    onClick={() => handleImageSelect(1)}
                    cursor="pointer"
                    flex={selectedImage === 1 ? 2 : 1}
                    transition="flex 0.3s"
                >
                    <Image
                        src={framesArray[frameImage]}
                        alt={`Generated`}
                        objectFit="cover"
                        w="100%"
                        h={selectedImage === 1 ? '300px' : '150px'}
                    />
                </Box>
            </HStack>
            {selectedImage === 0 ? (
                <>
                    <Textarea
                        placeholder="Describe something..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        size="sm"
                        color="white"
                    />
                    <Button
                        onClick={handleGenerateImages}
                        colorScheme="yellow"
                        size="sm"
                        w="14em"
                    >Generate Images</Button>
                    {/* <Input
                        placeholder='Or provide the profile image link here'
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        color="white"
                    /> */}
                    <Flex flexDirection="row" gap="2em">
                        <Input
                            type="file"
                            accept='image/*'
                            onChange={(e) => setImageViaUpload(e.target.files[0])}
                        />
                        <Button onClick={uploadImageFile} p="1em 2em">Upload Image</Button>
                    </Flex>
                </>
            ) : (
                <Flex
                    flexDirection="row"
                    overflow="scroll"
                >
                    {framesArray.map((frame, idx) => (
                        <>
                            <Image
                                src={frame}
                                key={idx}
                                alt={`Generated`}
                                objectFit="cover"
                                onClick={() => setFrameImage(idx)}
                                cursor="pointer"
                                pointerEvents={frameAllowed.includes(idx) ? 'auto' : 'none'}
                                bg={frameAllowed.includes(idx) ? 'transsparent' : 'gray-300'}
                                opacity={frameAllowed.includes(idx) ? '1' : '0.3'}
                            />
                        </>
                    ))}
                </Flex>
            )}
        </Flex>
    );
};

export default ImageSelector;