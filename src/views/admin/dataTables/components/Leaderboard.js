import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Text,
    useColorModeValue,
    Image,
    Button,
    Flex,
} from "@chakra-ui/react";
import { GameListContext } from "contexts/GameListContext";
import LiveStreaming from "./LiveStream";

import Organiser from "../../../../contracts/Organiser.json";

const { ethers } = require("ethers");
const contractABI = Organiser.abi;
const contractAddress = '0x8447a887e331766b6fcfc896eedb177d26887f5c';

const Leaderboard = ({ gameParticipants, startTime, hoursActive, hasStream, setGameParticipants, eventId }) => {
    const { framesArray } = useContext(GameListContext);
    const [streamUrl, setStreamUrl] = useState('/');
    const bg = useColorModeValue("gray.100", "gray.900");
    const textColor = useColorModeValue("gray.800", "white");

    async function retrieveJsonData(fileKey) {
        const fileUrl = `https://data.thetaedgestore.com/api/v2/data/${fileKey}`;
        const response = await fetch(fileUrl);
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        console.log("The iframe in starting is: ", streamUrl);
        console.log("The participants fetching is: ", gameParticipants);
    }, [streamUrl]);


    // async function getDataFromIpfs(requestId) {
    //     var myHeaders = new Headers();
    //     myHeaders.append("x-api-key", "QN_71b6031049974cf5a5a8260011c03b60");

    //     var requestOptions = {
    //         method: 'GET',
    //         headers: myHeaders,
    //         redirect: 'follow'
    //     };

    //     try {
    //         const response = await fetch(`https://api.quicknode.com/ipfs/rest/v1/s3/get-object/${requestId}`, requestOptions);
    //         const result = await response.json();
    //         return result; // Return the result
    //     } catch (error) {
    //         console.log(error);
    //         return null; // Return null in case of an error
    //     }
    // }

    const handleRefreshStandings = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const _contract = new ethers.Contract(contractAddress, contractABI, provider);
        try {
            const gamed = await _contract.getGameById(eventId);

            if (gamed.playersJoined) {
                const LeaderBoardArray = [];
                for (const player of gamed.playersJoined) {
                    const Playerdata = await _contract.GetProfileIpfs(player.playerAddress);
                    let playerProfileData;
                    if (Playerdata) {
                        playerProfileData = await retrieveJsonData(Playerdata);
                    }
                    const leaderboardData = {
                        playerNickName: playerProfileData ? playerProfileData.nickName : "default",
                        playerAddress: player.playerAddress,
                        playerScore: player.leaderboardScore.toNumber(),
                        profileImage: playerProfileData ? playerProfileData.profileImage : "",
                        frameImage: playerProfileData ? playerProfileData.frameImage : 0,
                        streamLink: player.streamLink ? player.streamLink : "/",
                    }
                    LeaderBoardArray.push(leaderboardData);
                }
                LeaderBoardArray.sort((a, b) => b.playerScore - a.playerScore);
                setGameParticipants(LeaderBoardArray);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleCollectReward = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, contractABI, signer);
        try {
            const txResponse = await _contract.GetReward(eventId);
            await txResponse.wait();
            console.log('Reward Collected successful:');
        }
        catch (error) {
            console.log(error);
        }
        console.log('Rewards')
    }

    useEffect(() => handleRefreshStandings(), []);

    return (

        <Box w="full" p={4} bg={bg} borderRadius="md" boxShadow="md">
            <Flex flexDirection="row" w="60em" gap="5em">
                <Text fontSize="2xl" fontWeight="bold" mb={4} color={textColor}>
                    Leaderboard
                </Text>
                <Button onClick={handleRefreshStandings}>Refresh</Button>
            </Flex>
            <Table variant="simple">
                <TableCaption>Current standings of the game</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Position</Th>
                        <Th>Profile Image</Th>
                        <Th>Nick Name</Th>
                        <Th>Address</Th>
                        <Th>Score</Th>
                        <Th>Stream</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {gameParticipants.map((player, index) => (
                        <Tr key={player.playerAddress}>
                            <Td>{index + 1}</Td>
                            <Td>
                                <Image
                                    src={player.profileImage}
                                    alt="Image"
                                    w="3em"
                                    h="3em"
                                />
                                <Image
                                    src={framesArray[player.frameImage]}
                                    alt="Frame"
                                    position="absolute"
                                    top={`${5 * index + 17.6}em`}
                                    left="12.3vw"
                                    w="4.6em"
                                    h="4.6em"
                                    zIndex={30}
                                />
                            </Td>
                            <Td>{player.playerNickName}</Td>
                            <Td>{player.playerAddress}</Td>
                            <Td>{player.playerScore}</Td>
                            <Td><Button color="yellow" onClick={() => setStreamUrl(gameParticipants.streamLink)}>Go to stream</Button></Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {new Date() > new Date(startTime.getTime() + parseInt(hoursActive) * 3600 * 1000) && <Button onClick={handleCollectReward} w="fit-content" mx="auto">Collect Reward</Button>}
            {streamUrl !== '/' && hasStream && (
                <div id="default-modal" tabIndex="-1" aria-hidden="true" className="absolute top-[0em] left-[5em] z-[500] flex w-[60em] h-[40em]">
                    <div className="bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Live Stream
                            </h3>
                            <button onClick={() => setStreamUrl('/')} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <hr />
                        <div className="p-4 md:p-5 space-y-4">
                            <LiveStreaming streamLink={streamUrl} />
                        </div>
                    </div>
                </div>
            )}
        </Box>
    );
};

export default Leaderboard;