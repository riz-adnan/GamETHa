import React from "react";
import { useHistory } from "react-router-dom";

// Chakra imports
import { Button, Flex, Link, Text } from "@chakra-ui/react";

// Assets
import banner from "assets/img/nfts/NftBanner1.png";

export default function Banner(props) {
  const { gameDetails } = props;
  const history = useHistory();

  const handleStreamPurchase = async (perticularGameId) => {
    // Implement Stream Purchase here
    history.push(`/${perticularGameId}`)
  }

  // Chakra Color Mode
  return (
    <Flex
      direction='column'
      bgImage={
        gameDetails.gameImage ? gameDetails.gameImage :
        banner}
      bgSize='fit'
      py={{ base: "30px", md: "56px" }}
      px={{ base: "30px", md: "64px" }}
      borderRadius='30px'>
      <Text
        fontSize={{ base: "24px", md: "34px" }}
        color='white'
        textShadow="0px 0px 30px rgb(0, 0, 0)"
        mb='14px'
        maxW={{
          base: "100%",
          md: "64%",
          lg: "46%",
          xl: "70%",
          "2xl": "50%",
          "3xl": "42%",
        }}
        fontWeight='700'
        lineHeight={{ base: "32px", md: "42px" }}>
        {
          gameDetails.gameName || 
          'Discover, collect, and sell extraordinary NFTs'}
      </Text>
      <Text
        fontSize={{ base: "14px", md: "19px" }}
        color={'white' || '#E3DAFF'}
        textShadow="0px 0px 20px black"
        maxW={{
          base: "100%",
          md: "64%",
          lg: "40%",
          xl: "56%",
          "2xl": "46%",
          "3xl": "34%",
        }}
        fontWeight='500'
        mb='40px'
        lineHeight='28px'>
        {
        gameDetails.gameDescription.split(' ').slice(0, 15).join(' ') || 
        'Enter in this creative world. Discover now the latest NFTs or start creating your own!'}
      </Text>
      <Flex align='center'>
        <Link
          href={`/${gameDetails.gameId}`}
          bg='white'
          color='black'
          borderRadius='30px'
          _hover={{ bg: "whiteAlpha.900" }}
          _active={{ bg: "white" }}
          _focus={{ bg: "white" }}
          fontWeight='500'
          fontSize='14px'
          py='10px'
          px='27'
          me='38px'>
          Discover now
        </Link>
        <Button
          bg='black'
          onClick={() => handleStreamPurchase(gameDetails.gameId)}
        >
          <Text color='white' fontSize='sm' fontWeight='500' bg="transparent">
            Watch stream
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
}
