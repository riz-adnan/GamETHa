import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  Heading,
  VStack,
  Input,
  HStack,
  List,
  ListItem,
  Spinner,
  ListIcon,
  Center,
} from "@chakra-ui/react";
import { GiDuration, GiTargetPrize } from "react-icons/gi";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { GameListContext } from "contexts/GameListContext";

import GameCard from "./GameCard";
import Organiser from "../../../../contracts/Organiser.json";

const MotionListItem = motion(ListItem);
const { ethers } = require("ethers");
const contractABI = Organiser.abi;
const contractAddress = '0x8447a887e331766b6fcfc896eedb177d26887f5c';

const GameDetails = ({ game, setGame, timeToDisplay, setGameParticipants, gameParticipants }) => {
  const { account } = useContext(GameListContext);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);
  const [lobbyCalled, setlobbyCalled] = useState(false);
  // const [lobbyCode, setLobbyCode] = useState(null);
  const [obsApi, setObsApi] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({
    stream: false,
    play: false
  });
  const [showGameFrame, setShowGameFrame] = useState(false);

  const handlePaymentClicked = async () => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const _contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      let Tprice = 0;
      if (paymentStatus.play) {
        Tprice += game.gamePrice;
      }
      if (paymentStatus.stream) {
        Tprice += game.streamTicketPrice;
      }
      const txResponse = await _contract.JoinGame(game.gameId, paymentStatus.play, paymentStatus.stream, game.maxParticipants, { value: Tprice });
      await txResponse.wait();
      setGame({
        ...game,
        hasPlay: paymentStatus.play,
        hasStream: paymentStatus.stream
      })
      alert('Now you can join the game.');
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setLoading(false);
    }

    // const response = await fetch('http://localhost:5000/get-stream-details', {
    //   method: "POST",
    //   body: JSON.stringify({ "count": "1" }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // });

    // Ensure the response is in JSON format
    // const output = await response.json();
    // setGame({
    //   ...game,
    //   streamLink: `https://live5.thetavideoapi.com/hls/live/2015862/${output.assignments[0].stream_server}/1721935096573/master.m3u8`,
    //   streamDetails: {
    //     stream_id: output.assignments[0].stream_id,
    //     stream_key: output.assignments[0].stream_key,
    //     stream_server: output.assignments[0].stream_server
    //   }
    // });
  }

  const generateStreamDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://thetaedge.onrender.com/get-stream-details', {
        method: "POST",
        body: JSON.stringify({ "count": "1" }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const output = await response.json();
      // console.log("THe output derived is: ", output);

      // const res = await fetch('http://127.0.0.1:5000/find-iframe', {
      //   method: 'POST',
      //   body: JSON.stringify({ "streamId": output.assignments[0].stream_id }),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // })

      // const iframe = await res.json();
      // Ensure the response is in JSON format
      if (output.assignments.length === 0) {
        alert('No stream available due to lack injectors.');
        setLoading(false);
        return;
      }

      setGame({
        ...game,
        // streamLink: ifram,
        streamDetails: {
          stream_id: output.assignments[0].stream_id,
          stream_key: output.assignments[0].stream_key,
          stream_server: output.assignments[0].stream_server
        }
      });
    } catch (error) {
      alert('No stream available. ', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleStartGame = async () => {
    if (game.streamDetails.stream_id === null || game.streamDetails.stream_id === undefined || game.streamDetails.stream_id === '') {
      alert('First generate the stream details.');
      return;
    }
    let flag = false;
    try {
      setLoading(true);
      const response = await fetch('https://thetaedge.onrender.com/remove-streams', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
          if (data[i].stream_id === game.streamDetails.stream_id) {
            flag = true;
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    try {
      const res = await fetch('https://thetaedge.onrender.com/find-iframe', {
        method: 'POST',
        body: JSON.stringify({ "streamId": game.streamDetails.stream_id }),
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const iframe2 = await res.json();
      const iframe = iframe2.message;
      console.log("Iframe getting is: ", iframe);
      /////////////////////////////////
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const _contract = new ethers.Contract(contractAddress, contractABI, signer);
      try {
        const txResponse = await _contract.UpdatePlayerStreamLink(game.gameId, iframe);
        await txResponse.wait();
        console.log("Player Stream link updated successfuil");
      }
      catch (error) {
        console.log(error);
      }
      ///////////////////////////////
      setGameParticipants(prev => {
        let pastDetails = [...prev];
        for (let i = 0; i < pastDetails.length; i++) {
          if (pastDetails[i].address === account) {
            pastDetails[i].streamLink = iframe;
            break;
          }
        }
        return pastDetails;
      });
    }
    catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    if (flag) {
      alert('First enter the Stream key and Stream server in your OBS studio.');
      return;
    }
    if (game.bIsInvite && inviteCode === null && inviteCode !== game.privateCode) {
      alert('Please enter the correct invite code.');
      return;
    }
    if (!game.hasPlay) {
      alert('First purchase the game.')
    } else {
      setShowGameFrame(true);
    }
  }

  const handleJudgeStart = async () => {
    // if (game.streamDetails.stream_id === null || game.streamDetails.stream_id === undefined || game.streamDetails.stream_id === '') {
    //   alert('First generate the stream details.');
    //   return;
    // }
    // let flag = false;
    // try {
    //   setLoading(true);
    //   const response = await fetch('https://thetaedge.onrender.com/remove-streams', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   });
    //   if (response.ok) {
    //     const data = await response.json();
    //     for (let i = 0; i < data.length; i++) {
    //       if (data[i].stream_id === game.streamDetails.stream_id) {
    //         flag = true;
    //         break;
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
    // try {
    //   const res = await fetch('https://thetaedge.onrender.com/find-iframe', {
    //     method: 'POST',
    //     body: JSON.stringify({ "streamId": game.streamDetails.stream_id }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   })

    //   const iframe2 = await res.json();
    //   const iframe = iframe2.message;
    //   console.log("Iframe getting is: ", iframe);
    //   /////////////////////////////////
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const signer = provider.getSigner();
    //   const _contract = new ethers.Contract(contractAddress, contractABI, signer);
    //   try {
    //     const txResponse = await _contract.UpdatePlayerStreamLink(game.gameId, iframe);
    //     await txResponse.wait();
    //     console.log("Player Stream link updated successfuil");
    //   }
    //   catch (error) {
    //     console.log(error);
    //   }
    //   ///////////////////////////////
    //   setGameParticipants(prev => {
    //     let pastDetails = [...prev];
    //     for (let i = 0; i < pastDetails.length; i++) {
    //       if (pastDetails[i].address === account) {
    //         pastDetails[i].streamLink = iframe;
    //         break;
    //       }
    //     }
    //     return pastDetails;
    //   });
    // }
    // catch (error) {
    //   console.log(error);
    // } finally {
    //   setLoading(false);
    // }

    // if (flag) {
    //   alert('First enter the Stream key and Stream server in your OBS studio.');
    //   return;
    // }
    // if (game.bIsInvite && inviteCode === null && inviteCode !== game.privateCode) {
    //   alert('Please enter the correct invite code.');
    //   return;
    // }
    // if (!game.hasPlay) {
    //   alert('First purchase the game.')
    // } else {
    setShowGameFrame(true);
    // }
  }

  useEffect(() => {
    if (lobbyCalled && timeToDisplay[0] === 1) {
      const gameIframe = document.getElementById('game-iframe');
      if (gameIframe) {
        gameIframe.contentWindow.postMessage({ type: 'LOBBY_TIMER_FUNC', value: parseInt(timeToDisplay[1] - 2) }, '*');
      }
    }
  }, [timeToDisplay])

  function mapIntegerToAlphabetString(number) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    const digits = String(number).split('');
    for (const digit of digits) {
      const index = parseInt(digit, 10) - 1;
      if (index >= 0 && index < 26) {
        result += alphabet[index];
      } else {
        throw new Error(`Invalid digit ${digit} in number ${number}`);
      }
    }

    return result;
  }

  useEffect(() => console.log('the game participants list is: ', gameParticipants), [gameParticipants]);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data.type === 'UPDATE_POINTS') {
        console.log('Points:', event.data.points);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, contractABI, signer);
        try {
          const pointd = parseInt(event.data.points);
          console.log(game.gameId);
          const estimatedGas = await _contract.estimateGas.UpdateLeaderBoard(game.gameId, pointd);

          // Set a higher gas limit (e.g., 10% more than the estimated amount)
          const gasLimit = estimatedGas.add(estimatedGas.div(10));

          // Send transaction with specified gas limit
          const txResponse = await _contract.UpdateLeaderBoard(game.gameId, pointd, {
            gasLimit: gasLimit
          });

          await txResponse.wait();
        }
        catch (error) {
          console.log("transaction", error);
        }
      } else if (event.data.type === 'LOBBY_JOINED') {
        const gameIframe = document.getElementById('game-iframe');
        if (gameIframe) {
          const mappedGameId = mapIntegerToAlphabetString(game.gameId);
          console.log("inside iframe", `${game.maxParticipants}|${mappedGameId}`);
          gameIframe.contentWindow.postMessage({ type: 'JOIN_LOBBY_FUNCTION', value: `${game.maxParticipants}|${mappedGameId}` }, '*');
        }
        setlobbyCalled(true);
        console.log('Lobby Joined:', event.data.points);
      }
    };
    if (game.gameId === -1) {
      return;
    }
    console.log("event added");
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [game.gameId]);

  return (
    <Box p={5}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        w="55vw"
        ml="10em"
        my="1em"
      >
        <Text
          fontSize="2em" fontWeight="extrabold" color="yellow.500" textShadow="0 1px 10px #008080"
        >{game.gameId} &nbsp; {game.gameName}</Text>
      </Flex>
      <Image
        src={game.gameImage}
        alt="Game image"
        // fit="contain"
        w="50em"
        h="25em"
        shadow="0 0 20px 10px black"
        mx="auto"
        rounded="2em"
      />
      <Flex w="50em" justifyContent="space-evenly" m="3em" mx="auto">
        <GameCard
          icon={<GiDuration size="24px" />}
          heading={"Duration"}
          detail={`${game.noOfHour} hours`}
        />
        <GameCard
          icon={<GiTargetPrize size="24px" />}
          heading={"Prize Pool"}
          detail={`$${game.totalPrizeMoney}`}
        />
        <GameCard
          icon={<FaPeopleGroup size="24px" />}
          heading={"Participants"}
          detail={game.totalParticipants}
        />
      </Flex>
      <Box p={4} w="50em" mx="auto">
        <List spacing={3}>
          <MotionListItem
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <HStack spacing={3}>
              <ListIcon as={FaCircle} color="blue.500" />
              <Text textColor="white"><strong>Game Organiser:</strong> {game.nickName}</Text>
            </HStack>
          </MotionListItem>
          <MotionListItem
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <HStack spacing={3}>
              <ListIcon as={FaCircle} color="blue.500" />
              <Text textColor="white"><strong>Organiser Address:</strong> {game.organiserAddress}</Text>
            </HStack>
          </MotionListItem>
          <MotionListItem
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <HStack spacing={3}>
              <ListIcon as={FaCircle} color="blue.500" />
              <Text textColor="white"><strong>Game Start at:</strong> {game.date.toString()}</Text>
            </HStack>
          </MotionListItem>
          <MotionListItem
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <HStack spacing={3}>
              <ListIcon as={FaCircle} color="blue.500" />
              <Text textColor="white"><strong>Is Game Multiplayer:</strong> {game.bIsMultiplayer ? "Yes" : "No"}</Text>
            </HStack>
          </MotionListItem>
          <MotionListItem
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <HStack spacing={3}>
              <ListIcon as={FaCircle} color="blue.500" />
              <Text textColor="white"><strong>Game Status:</strong> {game.bIsInvite ? "Invite Only" : "Open for all"}</Text>
            </HStack>
          </MotionListItem>
        </List>
      </Box>
      <div className="w-[50em] py-4 px-6 bg-neutral-300 border border-gray-200 rounded-lg shadow-[0_0_30px_20px_#008080] mx-auto m-4">
        <svg version="1.1" viewBox="0 0 900 900" width="1280" height="1280" xmlns="http://www.w3.org/2000/svg" className="w-[4em] h-[4em]">
          <path transform="translate(363)" d="m0 0h50l16 8 11 7 15 15 9 14 6 16 2 10v18h22l12 3 11 6 8 8h103l34 1 12 4 14 8 12 12 7 11 5 12 2 17v138l-1 9 5-5 11-21 8-14 15-28 12-21 7-9 8-6 11-4h16l9 3 9 6 8 9 4 8 2 13-2 11-5 12-14 26-9 16-13 24-12 22-15 27-15 28-9 16-14 26-13 23-2 4-1 350-2 18-4 11-6 10-9 10-9 7-14 7-11 4h-544l-12-5-13-7-10-9-7-8-7-14-3-9-1-6v-678l3-14 8-16 9-10 9-8 11-6 12-4 27-1h108l5-3 7-6 12-6 8-2h23l-1-13 4-18 5-13 9-14 10-11 14-10 14-7zm-194 210-1 1v583l1 1h438l1-3v-119h-3l-17 17-8 7-15 14-16 14h-214l-6-5-1-2v-9l5-6 2-1 62-1 136-1 11-62 3-12 11-21 10-18 13-24 13-23 10-18 4-11v-299l-1-2h-77l-4 4-7 8-11 7-10 3-8 1h-207l-10-2-12-6-8-7-5-7-2-1z" fill="#3E3D41" />
          <path transform="translate(124,131)" d="m0 0h116l1 2v51l-1 1-87 1-6 2-3 5-1 43v572l2 7 4 3 3 1h471l7-3 3-7v-94l1-86 8-16 12-23 12-21 12-22 8-13h2v301l-2 13-5 10-8 8-12 6-9 2h-527l-10-2-10-5-9-8-6-12-2-15v-669l4-10 7-9 9-8 10-4z" fill="#F59D42" />
          <path transform="translate(378,28)" d="m0 0 8 6 8 9 6 9v2l-3 1-9-2-8 2-3 3-1 3v10l5 6 2 1h8l6-2v-2h2l2-5 2-3 3 3 1 11v20l23 1h9l5 2 4 8 6 3 13 3 3 6v59l-1 16-2 4h-2v3l-3 1-23 1h-156l-7-3-5-5-3-5-1-26v-35l2-7 7-8 4-2 41-2 7-3 4-6v-9l-1-2v-21l4-12 6-10 9-10 10-7 12-5z" fill="#767680" />
          <path transform="translate(537,131)" d="m0 0h118l10 3 6 4 9 8 6 10 2 7v205l-8 16-24 44-15 25-5 9-3 1v-257l-1-14-6-5-2-1-87-1-2-2v-39l1-12z" fill="#F59D42" />
          <path transform="translate(765,281)" d="m0 0h5l14 8 3 3-1 5-16 32-24 44-13 23-12 23-13 23-14 26-10 18-12 22-9 16-14 26-15 28-14 25-12 22-7 12-5 1-19-9v-6l11-21 12-22 14-26 12-22 14-25 12-22 6-10 14-26 7-12 7-14 13-23 15-28 13-23 8-16 13-24 9-16 6-10z" fill="#D82437" />
          <path transform="translate(380,25)" d="m0 0h12l11 2 15 6 9 7 3 3v2l3 1 9 14 3 6 2 7v31l3 6 7 2h10l25 2 7 2 5 3 5 6 2 6 1 10v22l-2 32-6 8-7 4-8 1-22 1h-182l-9-3-6-5-3-5-1-4v-64l6-11 3-3 7-1 37-1 9-3 1-3v-13l-1-3v-12l3-12 5-13h2l2-5 7-8 3-3h3v-2l12-6zm-2 3-9 2-14 7-12 11-8 13-4 12v21l1 2v9l-4 6-7 3-41 2-6 4-6 8-1 5v45l1 16 5 8 7 4 3 1h164l15-1 3-1v-3h2l2-4 1-16v-59l-3-6-16-4-5-5-2-5-6-2h-17l-14-1v-21l-1-10-4-3-3 6v2h-2v2l-6 2h-8l-6-5-1-2v-10l3-5 7-3 8 1 4 1 2-1-2-5-8-11-7-7z" fill="#515157" />
          <path transform="translate(334,279)" d="m0 0h212l5 3 4 6v6l-6 9-4 2h-209l-8-7-1-2v-9z" fill="#3D3C40" />
          <path transform="translate(337,384)" d="m0 0h202l9 1 5 5 2 5-1 7-4 6-4 2h-211l-7-6-1-2v-9l6-7z" fill="#403F44" />
          <path transform="translate(335,490)" d="m0 0h212l6 5 2 4v6l-6 9-2 1-73 1h-52l-87-1-7-6-2-8 2-5z" fill="#3E3D41" />
          <path transform="translate(335,595)" d="m0 0h185l6 5 3 5v6l-7 9-2 1h-184l-6-4-4-8 2-7 5-6z" fill="#3D3C40" />
          <path transform="translate(231,252)" d="m0 0 13 1 10 4 8 6 7 9 4 10 1 5v9l-3 11-6 10-9 8-12 5-5 1h-10l-11-3-9-6-7-7-6-12-2-9 1-11 5-12 9-10 9-6 6-2z" fill="#3E3D41" />
          <path transform="translate(226,569)" d="m0 0h16l10 3 10 7 7 10 4 10 1 5v8l-2 9-6 11-8 8-12 6-5 1h-15l-11-4-9-7-7-10-4-10-1-5v-7l4-13 6-9 9-8 9-4z" fill="#3D3C40" />
          <path transform="translate(226,358)" d="m0 0h15l10 3 9 6 8 9 5 11 1 5v10l-3 10-6 10-7 7-12 6-5 1h-15l-11-4-9-7-7-10-4-10-1-10 3-12 5-9 7-8 10-6z" fill="#3E3D41" />
          <path transform="translate(228,463)" d="m0 0h12l12 4 9 6 6 7 5 10 2 9v8l-2 9-7 12-9 8-9 4-4 1h-19l-9-4-6-4-7-7-6-12-2-9 1-11 5-12 9-10 9-6z" fill="#3F3E42" />
          <path transform="translate(229,674)" d="m0 0h11l10 3 11 7 7 8 5 11 1 5v10l-4 13-6 8-7 7-10 5-11 2-11-1-12-5-10-9-7-13-2-8v-7l3-11 6-10 8-8 10-5z" fill="#3F3E42" />
          <path transform="translate(208,473)" d="m0 0 4 2-7 6-3 3-3 9 7 1 5-4h8l9-2h14l6 5 1 13-4 8-6 5h-16l-5-3-4-1-2-3v-2l-1-3-3-1-1-4-3-1-1 8-1 3 1 2-2 6-3-1-3-8-1-11 3-12 6-10z" fill="#535359" />
          <path transform="translate(199,379)" d="m0 0 2 1-1 7-1 1 7 4 1 1 1-3h1v-2h4l1-2 10-2 12-2 6 2 5 5 2 9-2 8-4 4-9 2-10-2-9-1-6-11v-3l-5 3-2 3-1 3 2 4-1 5 5 3 1 5-3 3-7-11-4-13 1-11z" fill="#505056" />
          <path transform="translate(794,236)" d="m0 0h8l5 3 3 5-1 9-4 9-2 2-8-1-8-3-6-4 1-6 8-11z" fill="#767680" />
          <path transform="translate(713,484)" d="m0 0h1v349h-1l-1-146-1-10 1-189z" fill="#B4AFAD" />
          <path transform="translate(232,278)" d="m0 0 8 1 5 4 2 4v8l-3 6-3 3-3 1h-9l-7-6-1-2v-10l5-6z" fill="#35719C" />
          <path transform="translate(232,595)" d="m0 0h7l5 3 3 6v7l-3 7-4 3h-10l-7-6-2-3v-8l3-5z" fill="#35719C" />
          <path transform="translate(231,701)" d="m0 0h8l6 4 2 4v8l-3 6-4 3-8 1-6-3-5-5v-10l5-6z" fill="#35719C" />
          <path transform="translate(232,384)" d="m0 0h7l6 5 2 5-1 9-5 6-9 1-7-3-4-5v-9l4-6z" fill="#35719C" />
          <path transform="translate(234,489)" d="m0 0 7 1 5 5v14l-5 5-2 1h-9l-6-4-3-4v-9l4-5z" fill="#35719C" />
          <path transform="translate(525,611)" d="m0 0h3l-2 4-4 5-2 1h-184l-6-4-1-4h2v3l5-1 6 2h13l18 1h148z" fill="#66666E" />
          <path transform="translate(327,287)" d="m0 0h1l1 7 2 4 8 1 3 2h13l1 1 191 1-2 2h-209l-8-7-1-2z" fill="#918D8E" />
          <path transform="translate(369,28)" d="m0 0m-4 1h4v2l-14 7-11 10-8 13-4 12v21l1 2v9l-4 6-4 3-4 1-41 2-6 4-5 7-1 5-1 22h-1v-27l6-11 3-3 7-1 37-1 9-3 1-3v-13l-1-3v-12l3-12 5-13h2l2-5 7-8 3-3h3v-2z" fill="#515157" />
          <path transform="translate(230,592)" d="m0 0h7l6 2 4 5 2 5v10l-3 6-9 5h-4l-9-2-4 1-7-5-4-9 4-7v-5l9-1zm2 3-8 4-3 5v8l7 8 2 1h10l5-4 2-6v-7l-4-7-4-2z" fill="#515157" />
          <path transform="translate(713,170)" d="m0 0h1v138l-1 9 5-5 9-17 1 4-1 3-2 1-1 6-4 6-4 4-4-1-1-16v-14l-1-6v-11l1-7v-59l1-27z" fill="#957456" />
          <path transform="translate(790,209)" d="m0 0h5v5l-7 3-6 3-3 1v2l-4 1-2 2-3 1-2 2-2 1-7 15-2 1 1 4h-2l-1 4h-2l1 4-2 2-1 2h-2l-1 6-3 1v3l-3 2-2 5-2 2-2 5-7 9-1-2 9-16 15-28 12-21 7-9 8-6z" fill="#5B5A5F" />
          <path transform="translate(337,384)" d="m0 0h202l1 2-203 1-5 1 3-3z" fill="#68676D" />
          <path transform="translate(793,232)" d="m0 0h9l4 1v2l4 2 2 2v14l-4 10-5 6h-6l-6-2-11-7-2-3 1-8 6-9 7-6zm1 4-6 5-7 11 1 5 9 5 7 2h5l4-5 3-9v-6l-4-6-4-2z" fill="#515157" />
          <path transform="translate(232,699)" d="m0 0h7l7 5 2 3v11l-3 7-6 3h-8l-9-2-5 1-3-2-1-6-3-1v-6h2l1-6 8-5zm-1 2-6 3-4 5v10l8 7 8 1 6-3 3-4 1-3v-8l-4-6-4-2z" fill="#515157" />
          <path transform="translate(269,300)" d="m0 0 3 1-1 6-6 10-9 8-12 5-5 1h-10l-11-3-9-6-1-2h7l10 3 2 1 11 1 18-5 5-2 1-4 4-4z" fill="#56565C" />
          <path transform="translate(335,595)" d="m0 0h185l6 5-1 3-4-4-8-1-19-1h-143v2h-12l-7 2-2 4-2 5-2-1 2-7 5-6z" fill="#515157" />
          <path transform="translate(203,522)" d="m0 0 4 1v3l5 1 4 3v2l10 2 2 1 13 1 15-4 1-2 6-1-5 5-8 5-7 2h-19l-9-4-6-4-7-7z" fill="#58585E" />
          <path transform="translate(229,276)" d="m0 0h8l10 5 2 6v9l-5 8-5 3-5 1-9-2-6-3-2-2-1-6-2-1v-7l4-3h3l2-4zm3 2-7 4-4 5v10l6 7 2 1h9l5-3 3-4 1-3v-8l-4-6-6-3z" fill="#515157" />
          <path transform="translate(334,279)" d="m0 0h212l-2 2h-198l-6 2-5 1-6 2 2-4z" fill="#515157" />
          <path transform="translate(567,651)" d="m0 0 5 1 8 5 1 4-7 8-6 6-5-1v-11l2-9z" fill="#515157" />
          <path transform="translate(141,105)" d="m0 0h98l9 1v1l-131 1-9 2-1 3-5 2-4-3 12-5 4-1z" fill="#B0B0B6" />
          <path transform="translate(199,589)" d="m0 0 2 3-1 7 3 3v6 3l1 5h2l1 3h-2l2 4-1 5-2 3h-2l-6-12-2-8v-7l4-13z" fill="#59595F" />
          <path transform="translate(199,379)" d="m0 0 2 1-1 7-1 1 7 4 1 4-3 2-2 3-1 3 2 4-1 5 5 3 1 5-3 3-7-11-4-13 1-11z" fill="#59595F" />
          <path transform="translate(210,635)" d="m0 0 5 2 8 1 3 2h5v2h9l13-3h3l-1 3-9 4-5 1h-15l-11-4-8-6z" fill="#56565C" />
          <path transform="translate(201,270)" d="m0 0 1 4-2 1 1 5-1 4 3-1 2 1 2 5-1 3-4 1 1 11-4 4-2-3-2-5-1-12 4-13z" fill="#5E5E63" />
          <path transform="translate(315,39)" d="m0 0 2 4-2 6-2 1-1 7 2 1-3 3-1 7 1 1v7l-1 4h-2l-1 7-2 2-3-1h2l-1-13 4-18 5-13z" fill="#636369" />
          <path transform="translate(543,638)" d="m0 0 1 2 2 1-1 3 3 1-1 4h-2l2 10-1 6h-2l1 3-4 2v6l1 4-6 2 1-11z" fill="#606066" />
          <path transform="translate(266,93)" d="m0 0 1 3-4 2 1 5-3 4-4 1-4-1-2 1h-107v-1l104-1 6-4 7-6z" fill="#515157" />
          <path transform="translate(389,59)" d="m0 0 6 1 5 5-1 6-6 4-6 1-4-4v-5h2l1-5z" fill="#3D3C40" />
          <path transform="translate(790,209)" d="m0 0h5v5l-7 3-6 3-3 1v2l-4 1-2 2-3 1-2 2-4 1 2-5 8-9 12-6z" fill="#5A595E" />
          <path transform="translate(226,358)" d="m0 0h15l10 3-1 3-10-3-13 2-8 3-5 4h-5v3l-3 1-1 3-5 2 2-5 7-8 10-6z" fill="#59585E" />
          <path transform="translate(712,265)" d="m0 0h1l1 11v32l-1 9 5-5 9-17 1 4-1 3-2 1-1 6-4 6-4 4-4-1-1-16v-14l-1-6v-11z" fill="#686568" />
          <path transform="translate(226,569)" d="m0 0h16v1l-12 2v2l-8 3-8 1h-3l-1 4-4 5v3l-4 2-2-5 9-10 10-6z" fill="#595960" />
          <path transform="translate(352,5)" d="m0 0 3 1-5 5-5 6h-2l-1 2h-3l-1 4h-7v3l-9 6-2-1 11-12 14-10z" fill="#605E63" />
          <path transform="translate(411,513)" d="m0 0h81l13 1v1l-31 1h-52l-12-1z" fill="#98989C" />
          <path transform="translate(327,497)" d="m0 0h1l2 8 3 6 13 2h59l5 1v1h-75l-7-6-2-8z" fill="#515157" />
          <path transform="translate(335,595)" d="m0 0h72v1l-42 1h-14v2h-12l-7 2-2 4-2 5-2-1 2-7 5-6z" fill="#5B5B61" />
          <path transform="translate(559,713)" d="m0 0 3 1-9 9-3 2h-115v-1l114-1 4-2v-3l4-1z" fill="#515157" />
          <path transform="translate(601,675)" d="m0 0 2 1-15 15-8 7-15 14-3 1v-3l3-1 2-4h2l1-4h3v-3l6-4h2v-2l6-5h2v-2h2v-2z" fill="#67656A" />
          <path transform="translate(229,674)" d="m0 0h11l8 2-1 2h-6l-5-1h-6l-5 3h-8l-2 4-5 1-3 5-4 5-1-5 9-9 10-5z" fill="#5E5E64" />
          <path transform="translate(199,695)" d="m0 0 3 2-4 12h2l2 7-3 3 1 7 1 4-2 1-4-10-1-4v-7l3-11z" fill="#5E5E64" />
          <path transform="translate(329,613)" d="m0 0h2v3l5-1 6 2h13l10 1 1 2h-32l-5-5z" fill="#55555B" />
          <path transform="translate(568,656)" d="m0 0 6 1 4 2-1 4-8 7h-2v-11z" fill="#75757F" />
          <path transform="translate(266,93)" d="m0 0 1 3-4 2 1 5-3 4-4 1-4-1-5 1 1-3 5-3 7-6z" fill="#5A5A60" />
          <path transform="translate(231,252)" d="m0 0 9 1v1l-12 1-3 3h-4v2l-9 1-2 5-4-1 5-6 10-5z" fill="#636267" />
          <path transform="translate(233,382)" d="m0 0 8 1 5 4 3 8-1 9-3 5-9 3-7-1v-2h8l5-2 3-4 1-9-3-6-4-3-7-1z" fill="#515157" />
          <path transform="translate(525,611)" d="m0 0h3l-2 4-4 5h-63l1-2h61z" fill="#54545A" />
          <path transform="translate(265,584)" d="m0 0 4 5 4 10 1 5v8l-1 6h-1v-18h-3l-2-3-2-10z" fill="#6B6B71" />
          <path transform="translate(831,265)" d="m0 0h2l-2 6-12 22-2-2v-3h2l2-5 4-8z" fill="#5D5C61" />
          <path transform="translate(327,287)" d="m0 0h1l1 7 2 4 8 1 5 5h-10l-7-8z" fill="#606067" />
          <path transform="translate(620,106)" d="m0 0h42l4 2-3 2-9-1-2-1-32-1z" fill="#515157" />
          <path transform="translate(266,271)" d="m0 0 3 1 4 10 1 5v9l-1 5h-1l-1-20-3 1-2-6z" fill="#797576" />
          <path transform="translate(436,13)" d="m0 0 6 4 13 13-3 1v-2h-2v-2l-5-1-1-2h-2l-1-5-4-1-2-4z" fill="#54545B" />
          <path transform="translate(727,295)" d="m0 0 1 4-1 3-2 1-1 6-4 6-4 4-3-1 6-8z" fill="#68666B" />
          <path transform="translate(211,576)" d="m0 0m-2 1h2l-1 5-4 5v3l-4 2-2-5z" fill="#5C5C62" />
          <path transform="translate(238,488)" d="m0 0 5 1 5 4 1 13-1 3h-2l-1-14-4-4-3-1z" fill="#515157" />
          <path transform="translate(327,497)" d="m0 0h1l2 8 3 6 12 2 1 2h-11l-7-6-2-8z" fill="#5A5A60" />
          <path transform="translate(208,473)" d="m0 0 4 2-7 6-3 3-2 8-4 1 3-9 6-8z" fill="#5E5E65" />
          <path transform="translate(216,678)" d="m0 0 2 1-3 5-5 1-3 5-4 5-1-5 9-9z" fill="#5A5A61" />
          <path transform="translate(804,316)" d="m0 0 2 1-10 18-2 2-1-3 3-7 3-5 2-4z" fill="#58585E" />
          <path transform="translate(334,279)" d="m0 0h12l-1 3-9 1-2 2-5 1 2-4z" fill="#59585C" />
          <path transform="translate(496,595)" d="m0 0h24l6 5-1 3-4-4-8-1v-2h-17z" fill="#64646C" />
          <path transform="translate(767,381)" d="m0 0 3 1-10 19-1-4 3-7 3-5z" fill="#5F5D61" />
          <path transform="translate(478,513)" d="m0 0h14l13 1v1l-29 1z" fill="#616166" />
          <path transform="translate(72,136)" d="m0 0 1 4-4 7-3 8h-2l3-10z" fill="#69696F" />
          <path transform="translate(268,623)" d="m0 0 2 2-6 9-5 4 1-4z" fill="#54545A" />
          <path transform="translate(218,430)" d="m0 0 10 4h8l5 1v1h-15l-9-3z" fill="#56565D" />
          <path transform="translate(117,107)" d="m0 0h20v1l-16 1-1 1h-8v-2z" fill="#515157" />
          <path transform="translate(535,683)" d="m0 0h1l1 15-4 2 1-11z" fill="#727278" />
          <path transform="translate(653,106)" d="m0 0h9l4 2-3 2-9-1z" fill="#767476" />
          <path transform="translate(559,713)" d="m0 0 3 1-9 9-4 2 2-4h2v-3l4-1z" fill="#656367" />
          <path transform="translate(104,109)" d="m0 0 4 1-1 3-5 2-4-3z" fill="#5F5F65" />
          <path transform="translate(827,222)" d="m0 0 5 5 3 7-4-1-1-6h-2v-3l-2-1z" fill="#5E5E64" />
          <path transform="translate(735,281)" d="m0 0h2l-1 5-7 9-1-2z" fill="#5F5F66" />
          <path transform="translate(568,585)" d="m0 0 2 3-3 6h-2l-2 5-2-1z" fill="#6F6F74" />
          <path transform="translate(208,473)" d="m0 0 4 2-7 6-2-1 3-5z" fill="#55545B" />
          <path transform="translate(241,359)" d="m0 0 8 1 2 1-1 3-9-3z" fill="#5F5F65" />
          <path transform="translate(776,367)" d="m0 0 2 1-7 12-2-1 6-11z" fill="#58585E" />
          <path transform="translate(269,300)" d="m0 0 3 1-1 6-2 2-2-3z" fill="#5A5A60" />
        </svg>
        <div class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Game Description</div>
        <p class="mb-3 font-normal text-gray-800 dark:text-gray-400">{game.gameDescription}</p>
      </div>
      <Box
        as="iframe"
        id="video-iframe"
        src={game.videoLink}
        width="52em"
        height="450px"
        borderRadius="lg"
        allowFullScreen
        mx="auto"
        my="4em"
        allow="autoplay"
      />

      <Flex gap="2em">
        {game.bIsInvite === true && <Input
          placeholder="Enter the invite code to join"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          color="white"
        />}
        {(!game.hasPlay && !game.hasStream) && (
          new Date() < new Date(game.date.getTime() + parseInt(game.noOfHour) * 3600 * 1000) ? (
            <Flex w="60em" alignItems="center" justifyContent="space-evenly">
              <Flex gap="2em">
                <label className="text-gray-300">Buy Stream: </label>
                <input
                  type="checkbox"
                  className="w-6"
                  checked={paymentStatus.stream}
                  onChange={() => setPaymentStatus({ ...paymentStatus, stream: !paymentStatus.stream })}
                />
              </Flex>
              <Flex gap="2em">
                <label className="text-gray-300">Buy Play: </label>
                <input
                  type="checkbox"
                  className="w-6"
                  checked={paymentStatus.play}
                  onChange={() => setPaymentStatus({ ...paymentStatus, play: !paymentStatus.play })}
                />
              </Flex>
              <Button onClick={handlePaymentClicked} ml="2em" w="8em">Join Game</Button>
            </Flex>
          ) : (
            <Text>Game has Ended!</Text>
          )
        )}
      </Flex>
      {timeToDisplay[0] !== 3 && <><Flex flexDirection="column">
        <Text textColor="gray.300">Stream Server: {game.streamDetails.stream_server}</Text>
        <Text textColor="gray.300">Stream key: {game.streamDetails.stream_key}</Text>
      </Flex>
        <Button onClick={generateStreamDetails}>Generate Stream Details</Button></>}

      {game.hasPlay && ((game.bIsMultiplayer && timeToDisplay[0] === 1) || (!game.bIsMultiplayer && timeToDisplay[0] === 2)) ?
        (!showGameFrame ?
          <Button onClick={handleStartGame} m="2em">Go to Game</Button> :
          <Button onClick={() => setShowGameFrame(false)}>Hide</Button>
        ) : null}
      {((game.bIsMultiplayer && timeToDisplay[0] === 1) || (!game.bIsMultiplayer && timeToDisplay[0] === 2)) ?
        (<Button onClick={() => setShowGameFrame(true)} m="2em">Hackathon Judging Purpose (ByPass Everything)</Button>
        ) : null}
      {showGameFrame && (
        <iframe allow="fullscreen;"
          id="game-iframe"
          src={game.gameLink}
          frameborder="0"
          className="w-full h-[40em]"
        ></iframe>
      )}
      {loading && (
        <Flex
          position="fixed"
          zIndex="500"
          top="0vh"
          right="0vw"
          w="full"
          h="full"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.7)"
          gap="0.8rem"
        >
          <Text textColor="yellow.400" fontSize="2em" fontWeight="bold" w="40vw" textAlign="center">Please wait while your request being processed...</Text>
          <Spinner
            w="4em"
            h="4em"
            thickness="0.5em"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
            size="xl"
          />
        </Flex>
      )}
    </Box >
  );
};

export default GameDetails;