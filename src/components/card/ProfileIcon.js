import React, { useState, useContext } from 'react';
import { Box, Flex, Image, Text, Stack, Heading, IconButton, Input, Button, Icon, FormControl, FormLabel } from '@chakra-ui/react';
import { MdCancel, MdSave } from 'react-icons/md';
import { BiSolidMessageSquareEdit } from 'react-icons/bi';
import { GameListContext } from 'contexts/GameListContext';

import ImageSelector from 'views/admin/default/components/ImageSelector';
import Organiser from "../../contracts/Organiser.json";

const { ethers } = require("ethers");
const contractABI = Organiser.abi;
const contractAddress = '0x8447a887e331766b6fcfc896eedb177d26887f5c';
// const Myaddress = '0x885df0da95b731d9ce9f4f56afe5762fd23e573c';

export default function ProfileIcon({ profileData, setProfileData, framesArray }) {
    const { account } = useContext(GameListContext);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(profileData.nickName);
    const [newProfileImage, setNewProfileImage] = useState(profileData.profileImage);
    const [newFrameImage, setNewFrameImage] = useState(profileData.frameImage);

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

    async function uploadJsonData(jsonData) {
        const authToken = await getAuthToken();
      
        const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('file', blob, 'data.json');
      
        const response = await fetch('https://api.thetaedgestore.com/api/v2/data', {
          method: 'POST',
          headers: {
            'x-theta-edgestore-auth': authToken,
          },
          body: formData,
        });
      
        const result = await response.json();
        return result.key;
      }

    async function uploadToIPFS(jsonObject, address) {
        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "QN_71b6031049974cf5a5a8260011c03b60");

        const blob = new Blob([JSON.stringify(jsonObject)], { type: "application/json" });

        var formdata = new FormData();
        const fileName = `${address}.json`;
        formdata.append("Body", blob, fileName); // Set your desired file name here
        formdata.append("Key", fileName); // The name under which the file will be stored
        formdata.append("ContentType", "application/json"); // Set content type to application/json

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        try {
            const response = await fetch("https://api.quicknode.com/ipfs/rest/v1/s3/put-object", requestOptions);
            const result = await response.json(); // Parse the response as JSON
            console.log(result.requestid);
            return result.requestid; // Return the IPFS CID
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function uploadProfileTOContract(_ipfs) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, contractABI, signer);
        try {
            const txResponse = await _contract.UploadProfile(_ipfs);
            await txResponse.wait();
            console.log("upload successful")
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleEdit = () => setIsEditing(true);
    const handleSave = async () => {
        setProfileData({
            ...profileData,
            nickName: newName,
            profileImage: newProfileImage,
            frameImage: newFrameImage,
        })
        const jsonObject = {
            nickName: newName ? newName : profileData.nickName,
            profileImage: newProfileImage ? newProfileImage : profileData.profileImage,
            frameImage: newFrameImage ? newFrameImage : profileData.frameImage,
        };
        console.log("The new profile data is: ", jsonObject);

        const addr = profileData.address ? profileData.address : "address";
        
        try {
            const fileKey = await uploadJsonData(jsonObject);
            if (fileKey) {
              console.log(`File Key: ${fileKey}`);
              uploadProfileTOContract(fileKey);
            } else {
              console.log("Failed to upload to Theta EdgeStore");
            }
          } catch (error) {
            console.error("Error uploading JSON data:", error);
          }
        // uploadToIPFS(jsonObject, addr).then(ipfs => {
        //     if (ipfs) {
        //         console.log(`IPFS CID: ${ipfs}`);
        //         uploadProfileTOContract(ipfs);
        //     } else {
        //         console.log("Failed to upload to IPFS");
        //     }
        // });
        setIsEditing(false);
    };
    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <Box
            w="25em"
            h="26em"
            bg="transparent"
            mr="2em"
            ml="0.2em"
            mb="1em"
            mt="1em"
        >
            <Box
                bg="transparent"
                shadow="md"
                rounded="lg"
                position="absolute"
                h="50em"
                w="50em"
                _hover={{ shadow: 'xl' }}
            >
                <Image
                    src={profileData.profileImage}
                    alt={profileData.nickName}
                    w="18em"
                    h="18em"
                    position="absolute"
                    top="1.8em"
                    left="1.8em"
                    zIndex="2"
                />
                <Image
                    src={framesArray[profileData.frameImage]}
                    alt={profileData.nickName}
                    w='28.3em'
                    h='28.3em'
                    position='absolute'
                    top="-3.9em"
                    left="-3.35em"
                    zIndex='3'
                />
            </Box>
            <Box p={4} textAlign="center" position="relative" bg="transparent">
                <Flex
                    flexDirection="column"
                    zIndex={5}
                    position="absolute"
                    w="22.9em"
                    h="4em"
                    left="-0.5em"
                    top="22em"
                    bg="#f2f218"
                    alignItems="center"
                    justifyContent="space-evenly"
                    p="0.3em"
                    rounded="1em"
                >
                    <Box
                        w="3em"
                        h="0.1em"
                        bg="blue.600"
                    />
                    <Heading size="md" color="black">{profileData.nickName}</Heading>
                    <Text color="black">{profileData.address}</Text>
                </Flex>
                <Box position="absolute" top="0.5em" right="1em" zIndex={10}>
                    {isEditing === false &&
                        <IconButton
                            aria-label="Edit"
                            icon={<Icon w='32px' h='32px' as={BiSolidMessageSquareEdit} color="red" bg="transparent" />}
                            onClick={handleEdit}
                            size="sm"
                        />
                    }
                </Box>
                <Box position="relative" top="-3.5em" left="49em" zIndex={130}>
                    {isEditing &&
                        <>
                            <IconButton
                                aria-label="Save"
                                icon={<Icon w='32px' h='32px' as={MdSave} color="#02c456" bg="black" />}
                                onClick={handleSave}
                                size="sm"
                                mr="2"
                            />
                            <IconButton
                                aria-label="Cancel"
                                icon={<Icon w='32px' h='32px' as={MdCancel} color="red.600" bg="black" />}
                                onClick={handleCancel}
                                size="sm"
                            />
                        </>
                    }
                </Box>
                {isEditing &&
                    <ImageSelector
                        profileImage={newProfileImage}
                        setProfileImage={setNewProfileImage}
                        frameImage={newFrameImage}
                        setFrameImage={setNewFrameImage}
                        name={newName}
                        setName={setNewName}
                        framesArray={framesArray}
                        frameAllowed={profileData.frameImageArray}
                    />
                }
            </Box>
        </Box >
    );
};
