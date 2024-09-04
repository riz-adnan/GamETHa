import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Image } from "@chakra-ui/react";

// Custom components
// import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Image
        src={process.env.PUBLIC_URL + '/Logo.png'}
        h='4rem' w='12rem' my='30px' color={logoColor}
        borderRadius='20px'
      />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
