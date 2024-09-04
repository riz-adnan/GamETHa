// Chakra imports
import {
  // AvatarGroup,
  // Avatar,
  Box,
  Button,
  Flex,
  // Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, { useState, useEffect } from "react";

export default function NFT(props) {
  const { gameEvent } = props;
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.500", "white");

  useEffect(() => {
    console.log("Game starts at: ", gameEvent.date);
    console.log("Game Ends at: ", new Date(gameEvent.date + parseInt(gameEvent.noOfHour)*3600*1000));
    console.log("Number of hours: ", typeof parseFloat(gameEvent.noOfHour))
  }, []);

  return (
    <Card p='20px' h="10em" shadow={`0 0 10px 0.4px ${gameEvent.date > new Date() ? "#fafa02" : (new Date(gameEvent.date.getTime() + parseInt(gameEvent.noOfHour)*3600*1000) > new Date() ? "#56fc35" : "red")}`}>
      <Flex direction="row" justify='center'>
        <Box mb="20px" position='absolute' left={{ base: "20px", md: "30px" }}>
          <Image
            src={gameEvent.gameImage}
            w="12em"
            h="8em"
            borderRadius='20px'
          />
        </Box>
        <Flex
          flexDirection='row'
          justify='space-between'
          h='100%'
          w={{ base: "100%", md: "60%" }}
          position="relative"
          right="-6em"
        >
          <Flex
            justify='space-between'
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mb='auto'>
            <Flex direction='column'>
              <Text
                color={textColor}
                fontSize={{
                  base: "xl",
                  md: "lg",
                  lg: "lg",
                  xl: "lg",
                  "2xl": "md",
                  "3xl": "lg",
                }}
                mb='5px'
                fontWeight='bold'
                me='14px'>
                {gameEvent.gameName}
              </Text>
              <Text
                color='#00bbf9'
                fontSize={{
                  base: "sm",
                }}
                fontWeight='400'
                mb="10px"
                me='14px'>
                Organiser: <Link href={`/ThetaEdge/#/admin/profile/${gameEvent.organiserAddress}`}><strong>{gameEvent.nickName}</strong></Link>
              </Text>
            </Flex>
            {/* <AvatarGroup
              max={3}
              color={textColorBid}
              size='sm'
              mt={{
                base: "0px",
                md: "10px",
                lg: "0px",
                xl: "10px",
                "2xl": "0px",
              }}
              fontSize='12px'>
              {players.map((avt, key) => (
                <Avatar key={key} src={avt} />
              ))}
            </AvatarGroup> */}
            <Text
              color='#ffd166'
              fontSize={{
                base: "sm",
              }}
              fontWeight='400'
              mb="10px"
              me='14px'>
              Total Participants: <strong>{gameEvent.totalParticipants} / {gameEvent.maxParticipants} joined</strong>
            </Text>
            <Text
              color='#03fca5'
              fontSize={{
                base: "sm",
              }}
              fontWeight='400'
              mb="10px"
              me='14px'>
              Prize Pool: <strong>{gameEvent.totalPrizeMoney} TFUEL</strong>
            </Text>
          </Flex>
          <Flex
            align='start'
            justify='space-between'
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mt='17px'>
            <Text fontWeight='700' fontSize='sm' color={textColorBid}>
              NFT Game Price: {gameEvent.gameTicketPrice} <br />
              NFT Stream Price: {gameEvent.streamTicketPrice} <br />
              Duration: {gameEvent.noOfHour} hours
            </Text>
            <Link
              href={`/ThetaEdge/#/admin/gameEvent/${gameEvent.gameId}`}
              my={{
                base: "0px",
                md: "10px",
                lg: "0px",
                xl: "10px",
                "2xl": "10px",
              }}>
              <Button
                variant='darkBrand'
                color='white'
                fontSize='sm'
                fontWeight='500'
                borderRadius='70px'
                px='24px'
                py='5px'>
                Discover
              </Button>
            </Link>
          </Flex>
          <Text
            color='gray.400'
            fontSize={{
              base: "sm",
            }}
            fontWeight='400'
            mb="10px"
            me='14px'
            position='absolute'
            top="-1em"
            right="-4em"
          >
            Event Date: {gameEvent.date.toString().slice(0, 15)}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
