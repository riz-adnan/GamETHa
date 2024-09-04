import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
  Table,
  Tr,
  Tbody,
  Td,
} from "@chakra-ui/react";
import bgAboutUs from 'assets/img/bgAboutUs.jpg';

function AboutUs() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  return (
    <Box
      p={8}
      m="4em 5em"
      h="35em"
      overflowY="auto"
      shadow="0 0 30px 4px red"
      position="relative"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-[0]"
        style={{ backgroundImage: `url(${bgAboutUs})` }}
      />
      <VStack spacing={6} align="start" zIndex="1" position="relative">
        <Heading as="h1" size="xl" color="yellow.300">About Us</Heading>

        <Text fontSize="lg" color={textColor}>
          Welcome to GamETHa, your ultimate destination for game streaming and hosting! We are revolutionizing the gaming industry by providing a decentralized platform where game developers, from large firms and institutions to individual creators, can showcase their talents and reach a global audience.
        </Text>

        <Heading as="h2" size="lg" color="yellow.400">Our Vision</Heading>
        <Text fontSize="md" color={textColorSecondary}>
          At GamETHa, our vision is to democratize the gaming industry. We believe in empowering developers of all sizes to host, publish, and monetize their games without the constraints of traditional platforms. Our mission is to create an inclusive, innovative, and accessible environment for gamers and developers alike.
        </Text>

        <Heading as="h2" size="lg" color="yellow.400">What We Offer</Heading>
        <VStack spacing={4} align="start">
        <Table>
          <Tbody>
          <Tr spacing={2} align="start">
            <Td><Heading as="h3" size="md" color={textColor}>Game Streaming and Hosting</Heading></Td>
            <Td><Text fontSize="md" color={textColorSecondary}>
              Our platform enables developers to stream and host their games effortlessly. Whether you're a solo developer or a large gaming firm, you can leverage our infrastructure to bring your games to life. Our user-friendly interface makes it easy to upload, manage, and update your games.
            </Text></Td>
          </Tr>

          <Tr spacing={2} align="start">
            <Td><Heading as="h3" size="md" color={textColor}>Flexible Pricing and Revenue Distribution</Heading></Td>
            <Td><Text fontSize="md" color={textColorSecondary}>
              We understand that every game is unique, and so are the needs of its developers. That’s why we offer flexible pricing options. Hosts can set their own prices for their games, and the revenue is fairly distributed among the participants of the game. This ensures that everyone involved in the creation and enjoyment of the game benefits.
            </Text></Td>
          </Tr>

          <Tr spacing={2} align="start">
            <Td><Heading as="h3" size="md" color={textColor}>Zero-Fee Options</Heading></Td>
            <Td><Text fontSize="md" color={textColorSecondary}>
              To foster creativity and innovation, we offer zero-fee options for those who want to share their games for free. Our platform is designed to support and promote developers who wish to provide free access to their games while still benefiting from our robust hosting and streaming services.
            </Text></Td>
          </Tr>

          <Tr spacing={2} align="start">
            <Td><Heading as="h3" size="md" color={textColor}>Cost-Effective Advertising</Heading></Td>
            <Td><Text fontSize="md" color={textColorSecondary}>
              Advertising your game shouldn’t break the bank. We provide cost-effective advertising solutions to help you reach your target audience. Promote your games on our platform at a fraction of the cost of traditional advertising methods and watch your player base grow.
            </Text></Td>
          </Tr>
        </Tbody>
        </Table>
        </VStack>

        <Heading as="h2" size="lg" color="yellow.400">Why Choose Us?</Heading>

        <VStack spacing={4} align="start">
          <Table>
            <Tbody>
                <Tr spacing={2} align="start">
                  <Td><Heading as="h3" size="md" color={textColor}>Decentralized and Secure</Heading></Td>
                  <Td><Text fontSize="md" color={textColorSecondary}>
                    Built on cutting-edge web3 technology, our platform ensures secure, transparent, and decentralized hosting and streaming of games.
                  </Text></Td>
                </Tr>

                <Tr spacing={2} align="start">
                  <Td><Heading as="h3" size="md" color={textColor}>Global Reach</Heading></Td>
                  <Td><Text fontSize="md" color={textColorSecondary}>
                    Connect with gamers and developers from around the world. Our platform is designed to support a diverse and vibrant gaming community.
                  </Text></Td>
                </Tr>

                <Tr spacing={2} align="start">
                  <Td><Heading as="h3" size="md" color={textColor}>Innovative Technology</Heading></Td>
                  <Td><Text fontSize="md" color={textColorSecondary}>
                    Leverage the power of NFTs for ticketing and prize distribution, making the gaming experience more engaging and rewarding.
                  </Text></Td>
                </Tr>

                <Tr spacing={2} align="start">
                  <Td><Heading as="h3" size="md" color={textColor}>Supportive Community</Heading></Td>
                  <Td><Text fontSize="md" color={textColorSecondary}>
                    Join a community of like-minded developers and gamers who are passionate about creating and enjoying the best games.
                  </Text></Td>
                </Tr>
            </Tbody>
          </Table>
        </VStack>

        <Divider />

        <Text fontSize="lg" color={textColor}>
          Join us at GamETHa and be part of the future of gaming. Whether you’re looking to host, stream, or play, we provide the tools and support you need to succeed. Let’s build a better gaming world together!
        </Text>
      </VStack>
    </Box>
  );
}

export default AboutUs;