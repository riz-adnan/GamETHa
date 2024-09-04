import React, { useEffect, useState, useContext } from 'react';
import { FormControl, FormLabel, Input, Select, Checkbox, Button, Box, Flex, Center, Textarea, Text, Image, useToast, VStack, Heading } from '@chakra-ui/react';
// import DateTimePicker from 'react-datetime-picker';
import DateTimePicker from './components/DateTimePicker';
import axios from 'axios';
import { GameListContext } from 'contexts/GameListContext';

import Organiser from "../../../contracts/Organiser.json";
import bgOrganise from 'assets/img/bgOrganisePage.jpg';
const { ethers } = require("ethers");
const contractABI = Organiser.abi;
const contractAddress = '0x8447a887e331766b6fcfc896eedb177d26887f5c';
// const Myaddress = '0x00a14c01C2AB9A29c8AA5C73904B9210687D072f';

export default function UserReports() {
  const { account } = useContext(GameListContext);
  const [selectedVideoFile, setselectedVideoFile] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [videoDetails, setVideoDetails] = useState(null);

  const [gameName, setGameName] = useState("");
  const [gameLink, setGameLink] = useState("");
  const [gameImage, setGameImage] = useState(null);
  const [gameDescription, setGameDescription] = useState("");
  const [gameVideoLink, setGameVideoLink] = useState("");
  //const [gameVideo, setGameVideo] = useState(null);
  const [playTicketPrice, setPlayTicketPrice] = useState(0);
  const [streamTicketPrice, setStreamTicketPrice] = useState(0);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [lobbyTimeInMin, setlobbyTimeInMin] = useState("");
  const [isInvite, setIsInvite] = useState("OpenToAll");
  const [privateCode, setPrivateCode] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [PrizeFromOwner, setPrizeFromOwner] = useState("");
  const [noOfHour, setNoOfHour] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00 AM');
  const [uploadType, setUploadType] = useState('link');


  const handleGameNameChange = (e) => setGameName(e.target.value);
  const handleGameLinkChange = (e) => setGameLink(e.target.value);
  // const handleGameImageChange = (e) => setGameImage(e.target.value);
  const handleGameDescriptionChange = (e) => setGameDescription(e.target.value);
  
  const handlePlayTicketPriceChange = (e) => setPlayTicketPrice(e.target.value);
  const handleStreamTicketPriceChange = (e) => setStreamTicketPrice(e.target.value);
  const handleIsMultiplayerChange = (e) => setIsMultiplayer(e.target.checked);
  const handlelobbyTimeInMin = (e) => setlobbyTimeInMin(e.target.value);
  const handleIsInviteChange = (e) => setIsInvite(e.target.value);
  const handlePrivateCodeChange = (e) => setPrivateCode(e.target.value);
  const handleMaxParticipantsChange = (e) => setMaxParticipants(e.target.value);
  const handlePrizeFromOwnerChange = (e) => setPrizeFromOwner(e.target.value);
  const handleNoOfHourChange = (e) => setNoOfHour(e.target.value);
  //const handleVideoUpload = (e) => setGameVideo(e.target.files[0]);
  const toast = useToast();

  const handleVideoFileChange = (event) => {
    setselectedVideoFile(event.target.files[0]);
  };

  const getPreSignedUrl = async () => {
    try {
      const response = await axios.post('https://api.thetavideoapi.com/upload', {}, {
        headers: {
          'x-tva-sa-id': 'srvacc_vxg3d3cpwi6zrhrtrctvi40ph',
          'x-tva-sa-secret': '5b9x5rjibn5wihwezp4qeebhdpmfteai',
        },
      });
      return response.data.body.uploads[0];
    } catch (error) {
      console.error('Error getting pre-signed URL:', error);
      throw error;
    }
  };

  const uploadToPreSignedUrl = async (presignedUrl) => {
    try {
      await axios.put(presignedUrl, selectedVideoFile, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
    } catch (error) {
      console.error('Error uploading to pre-signed URL:', error);
      throw error;
    }
  };

  const transcodeVideo = async (uploadId) => {
    try {
      const response = await axios.post('https://api.thetavideoapi.com/video', {
        source_upload_id: uploadId,
        playback_policy: 'public',
        metadata: {},
      }, {
        headers: {
          'x-tva-sa-id': 'srvacc_vxg3d3cpwi6zrhrtrctvi40ph',
          'x-tva-sa-secret': '5b9x5rjibn5wihwezp4qeebhdpmfteai',
          'Content-Type': 'application/json',
        },
      });
      return response.data.body.videos[0];
    } catch (error) {
      console.error('Error transcoding video:', error);
      throw error;
    }
  };

  const checkVideoStatus = async (videoId) => {
    try {
      const response = await axios.get(`https://api.thetavideoapi.com/video/${videoId}`, {
        headers: {
          'x-tva-sa-id': 'srvacc_vxg3d3cpwi6zrhrtrctvi40ph',
          'x-tva-sa-secret': '5b9x5rjibn5wihwezp4qeebhdpmfteai',
        },
      });
      return response.data.body.videos[0];
    } catch (error) {
      console.error('Error checking video status:', error);
      throw error;
    }
  };
  
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

  const uploadVideo = async () => {
    if (!selectedVideoFile) {
      toast({
        title: 'No file selected.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploadStatus('Uploading video...');

    try {
      const preSignedUrlData = await getPreSignedUrl();
      await uploadToPreSignedUrl(preSignedUrlData.presigned_url);

      setUploadStatus('Video uploaded. Transcoding...');

      const videoData = await transcodeVideo(preSignedUrlData.id);
      setVideoDetails(videoData);

      const pollInterval = setInterval(async () => {
        const status = await checkVideoStatus(videoData.id);

        if (status.state === 'success') {
          setUploadStatus('Video upload and transcode successful!');
          setVideoDetails(status);
          const playBackuril = `https://player.thetavideoapi.com/video/${status.id}`;
          setGameVideoLink(playBackuril);
          console.log(playBackuril);
          clearInterval(pollInterval);
        } else {
          setUploadStatus(`Transcoding in progress... ${status.progress}%`);
        }
      }, 5000); // Poll every 5 seconds

    } catch (error) {
      setUploadStatus('Failed to upload video.');
      console.error('Error uploading video:', error);
    }
  };

  const uploadImageFile = async () => {
    console.log("Hi I am at the starting!")
    if (!selectedImageFile) return;
  
    const authToken = await getAuthToken();
  
    const formData = new FormData();
    formData.append('file', selectedImageFile);
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
      setGameImage(fileUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  // const [selectedFile, setSelectedFile] = useState(null);
  // const [uploadedKey, setUploadedKey] = useState('');
  // const [retrievedImage, setRetrievedImage] = useState('');

  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };



  // const uploadFile = async () => {
  //   if (!selectedFile) return;

  //   const authToken = await getAuthToken();

  //   const formData = new FormData();
  //   formData.append('file', selectedFile);

  //   try {
  //     const response = await axios.post('https://api.thetaedgestore.com/api/v2/data', formData, {
  //       headers: {
  //         'x-theta-edgestore-auth': authToken,
  //       },
  //     });
  //     setUploadedKey(response.data.key);
  //     console.log(response.data.key);
  //     console.log(response.data.url);
  //     alert('File uploaded successfully!');
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     alert('Failed to upload file.');
  //   }
  // };

  // const retrieveFile = async () => {
  //   if (!uploadedKey) return;

  //   try {
  //     const response = await axios.get(`https://data.thetaedgestore.com/api/v2/data/${uploadedKey}`, {
  //       responseType: 'blob',
  //     });

  //     const imageUrl = URL.createObjectURL(new Blob([response.data]));
  //     setRetrievedImage(imageUrl);
  //   } catch (error) {
  //     console.error('Error retrieving file:', error);
  //     alert('Failed to retrieve file.');
  //   }
  // };
  // Chakra Color Mode
  // const brandColor = useColorModeValue("brand.500", "white");
  // const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  // const brandColor = useColorModeValue("brand.500", "white");
  // const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

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
    console.log(result.key);
    return result.key;
  }

  async function uploadToIPFS(jsonObject) {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "QN_71b6031049974cf5a5a8260011c03b60");

    const blob = new Blob([JSON.stringify(jsonObject)], { type: "application/json" });

    var formdata = new FormData();
    const fileName = `${gameName}.json`;
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

  async function uploadGameTOContract(_ipfs) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const _contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const txResponse = await _contract.UploadGames(_ipfs, playTicketPrice, streamTicketPrice, PrizeFromOwner, { value: PrizeFromOwner });
      await txResponse.wait();
      console.log('Transaction successful:');
    } catch (error) {
      console.error('Transaction error:', error);
    }
  }

  const handleAllVideos = async () => {
    console.log("statrt");
    const response = await fetch("https://thetaedge.onrender.com/videos", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("res = ", response);
    const data = await response.json();
    console.log(data);
  }

  const handleSubmit = async () => {

    // try {
    //   console.log("start", gameVideo);
    //   const response = await fetch("http://localhost:5000/upload-video", {
    //     method: "POST",
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ videoUrl: gameVideo })
    //   });
    //   console.log("response", response);
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }

    //   const data = await response.json();
    //   console.log(data);

    //   const idd = data.body.videos[0].id;
    //   console.log("iddd=", idd);
    //   const response2 = await fetch("http://localhost:5000/videos", {
    //     method: "POST",
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ videoId: idd })
    //   });
    //   const data2 = await response2.json();
    //   console.log(data2);
    // } catch (error) {
    //   console.log(error);
    // }
    // return;
    const jsonObject = {
      "gameName": gameName,
      "gameLink": gameLink,
      "gameImage": gameImage,
      "description": gameDescription,
      "videoLink": gameVideoLink,
      "bIsMultiplayer": isMultiplayer,
      "lobbyTimeInMin": lobbyTimeInMin,
      "bIsInvite": isInvite === "InviteOnly",
      "privateCode": privateCode,
      "maxParticipants": maxParticipants,
      "date": new Date(new Date(selectedDate.setHours(0, 0, 0, 0)).getTime() + (parseInt(selectedTime.slice(0, 2)) + (parseInt(selectedTime.slice(3, 5)) / 60)) * 3600 * 1000),
      //"time" : selectedTime,
      "noOfHour": noOfHour,
    };
    console.log(jsonObject);
    //return;
    try {
      const fileKey = await uploadJsonData(jsonObject);
      if (fileKey) {
        console.log(`File Key: ${fileKey}`);
        await uploadGameTOContract(fileKey);
        alert("Game uploaded successfully!");
        window.location.reload();
      } else {
        console.log("Failed to upload to Theta EdgeStore");
      }
    } catch (error) {
      console.error("Error uploading JSON data:", error);
    }

    // uploadToIPFS(jsonObject).then(ipfs => {
    //   if (ipfs) {
    //     console.log(`IPFS CID: ${ipfs}`);
    //     uploadGameTOContract(ipfs);
    //   } else {
    //     console.log("Failed to upload to IPFS");
    //   }
    // });
  };

  return (
    <main className='mt-[6em]'>
      <Box bgImage={bgOrganise} bgSize="cover" bgPosition="center" bgRepeat="no-repeat" h="full" textColor="white" position="absolute" zIndex="0" inset={0} opacity={0.2} />
      <Box w="60em" mx="auto" p="3em" shadow="0 0 20px 3px #8cffb3" textColor="white">
        <FormControl mb="1.5em">
          <FormLabel textColor="yellow">Game Name</FormLabel>
          <Input type="text" value={gameName} onChange={handleGameNameChange} textColor="white" />
        </FormControl>

        <FormControl mb="1.5em">
          <FormLabel textColor="yellow">Game Link</FormLabel>
          <Input type="text" value={gameLink} onChange={handleGameLinkChange} textColor="white" />
        </FormControl>

        <FormControl mb="1.5em">
          <FormLabel textColor="yellow">Game Image</FormLabel>
          {/* <Input type="text" value={gameImage} onChange={handleGameImageChange} textColor="white" /> */}
          <Input
            type='file'
            accept='image/*'
            onChange={(e) => setSelectedImageFile(e.target.files[0])}
            textColor="yellow.400"
          />
          <Button colorScheme="teal" onClick={uploadImageFile}>Upload Image</Button>
        </FormControl>

        <FormControl mb="1.5em">
          <FormLabel textColor="yellow">Game Description</FormLabel>
          <Textarea type="text" value={gameDescription} onChange={handleGameDescriptionChange} textColor="white" h="8em">Enter the description of the event</Textarea>
        </FormControl>

        {/* <Flex alignItems="center" flexDirection="row" w="40em" mx="auto" justifyContent="space-evenly">
          <Button onClick={() => setUploadType('link')} border={uploadType === 'link' ? "2px solid orange" : null} w="15em">Upload via Link</Button>
          <Button onClick={() => setUploadType('upload')} border={uploadType === 'upload' ? "2px solid orange" : null} w="15em">Upload File</Button>
        </Flex>

        {uploadType === 'link' && (
          <FormControl mb="1.5em">
            <FormLabel textColor="yellow">Game Video Link</FormLabel>
            <Input type="text" value={gameVideoLink} onChange={handleGameVideoLinkChange} />
          </FormControl>
        )} */}

        {/* <Center flexDirection="column" mt="5em"> */}
          <Box>
            <Heading mb="1em" textColor="yellow">Upload Video</Heading>
            <VStack spacing={4} align="start">
              <Input type="file" accept='video/*' onChange={handleVideoFileChange} textColor="yellow.400" />
              <Button colorScheme="teal" onClick={uploadVideo}>Upload Video</Button>
              <Text>{uploadStatus}</Text>
            </VStack>
          </Box>
          {/* {videoDetails && (
            <Box mt="2em">
              <Heading as="h2" size="md">Video Details</Heading>
              <pre>{JSON.stringify(videoDetails, null, 2)}</pre>
            </Box>
          )} */}
        {/* </Center> */}

        {/* {uploadType === 'upload' && (
          <FormControl mb="1.5em">
            <FormLabel textColor="yellow">Default size</FormLabel>
            <input
              className="block w-full mb-5 text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              id="default_size"
              type="file"
              accept='video/*'
              onChange={handleVideoUpload}
            />
          </FormControl>
        )} */}


        <Flex flexDirection="row" mb="1.5em" w="full" alignItems="center" gap="2em" mx="auto" textColor="white">
          <FormControl>
            <FormLabel textColor="yellow">Play Ticket Price</FormLabel>
            <Input type="number" value={playTicketPrice} onChange={handlePlayTicketPriceChange} textColor="white" />
          </FormControl>

          <FormControl>
            <FormLabel textColor="yellow">Stream Ticket Price</FormLabel>
            <Input type="number" value={streamTicketPrice} onChange={handleStreamTicketPriceChange} textColor="white" />
          </FormControl>
        </Flex>

        <Flex flexDirection="row" gap="2em" alignItems="center">
          <FormControl>
            <FormLabel>Is Multiplayer</FormLabel>
            <Checkbox isChecked={isMultiplayer} onChange={handleIsMultiplayerChange} textColor="white" />
          </FormControl>

          {isMultiplayer && <FormControl>
            <FormLabel>Lobby Time in min</FormLabel>
            <Input type="text" value={lobbyTimeInMin} onChange={handlelobbyTimeInMin} textColor="white" />
          </FormControl>}
        </Flex>

        <FormControl mb="1.5em">
          <FormLabel>Is Invite</FormLabel>
          <Select value={isInvite} onChange={handleIsInviteChange} textColor="white">
            <option value="OpenToAll">Open To All</option>
            <option value="InviteOnly">Invite Only</option>
          </Select>
        </FormControl>

        {isInvite === "InviteOnly" && (
          <FormControl mb="1.5em">
            <FormLabel>Private Code</FormLabel>
            <Input type="text" value={privateCode} onChange={handlePrivateCodeChange} textColor="white" />
          </FormControl>
        )}

        <Flex flexDirection="row" mb="1.5em" w="full" alignItems="center" gap="2em" mx="auto">
          <FormControl>
            <FormLabel textColor="yellow">Max Participants</FormLabel>
            <Input type="text" value={maxParticipants} onChange={handleMaxParticipantsChange} textColor="white" />
          </FormControl>

          <FormControl>
            <FormLabel textColor="yellow">Prize From Owner</FormLabel>
            <Input type="text" value={PrizeFromOwner} onChange={handlePrizeFromOwnerChange} placeholder="Enter the price in TFUEL" textColor="white" />
          </FormControl>
        </Flex>

        <FormControl mb="1.5em">
          <FormLabel textColor="yellow">Number of Hours</FormLabel>
          <Input type="text" value={noOfHour} onChange={handleNoOfHourChange} textColor="white" />
        </FormControl>

        <FormControl>
          <FormLabel textColor="yellow">Select the Date and Time of event start</FormLabel>
          <DateTimePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </FormControl>

        <Center>
          <Button mt="2em" p="0.8em" colorScheme="teal" type="submit" onClick={handleSubmit} fontWeight="extrabold" w="15em" >
            Submit
          </Button>
          {/* <Button mt="2em" p="0.8em" colorScheme="teal" type="submit" onClick={handleAllVideos} fontWeight="extrabold" w="15em" >
            Get all videos
          </Button> */}
        </Center>

        {/* <Center flexDirection="column" mt="5em">
      <Box>
        <Text fontSize="2xl" mb="1em">Theta EdgeStore</Text>
        <Input type="file" onChange={handleFileChange} mb="1em" />
        <Button colorScheme="teal" onClick={uploadFile} mb="1em">Upload Image</Button>
      </Box>
      {uploadedKey && (
        <Box>
          <Text mb="1em">Uploaded Key: {uploadedKey}</Text>
          <Button colorScheme="teal" onClick={retrieveFile} mb="1em">Retrieve Image</Button>
        </Box>
      )}
      {retrievedImage && (
        <Box mt="2em">
          <Text fontSize="2xl" mb="1em">Retrieved Image:</Text>
          <Image src={retrievedImage} alt="Retrieved" maxW="100%" />
        </Box>
      )}
    </Center> */}

      </Box>


    </main>
  );
};