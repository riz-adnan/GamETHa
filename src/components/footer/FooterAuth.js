/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  let textColor = useColorModeValue("gray.400", "white");
  let linkColor = useColorModeValue({ base: "gray.400", lg: "white" }, "white");
  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: "column",
        lg: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px={{ base: "30px", md: "0px" }}
      pb='30px'>
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", lg: "0px" }}>
        {" "}
        &copy; {1900 + new Date().getYear()}
        <Text as='span' fontWeight='500' ms='4px'>
          <Link
            mx='3px'
            color={textColor}
            href='https://www.prakharmosesOK.github.io/ChainSphere'
            target='_blank'
            fontWeight='700'>
            GamETHa
          </Link>
          All Rights Reserved
        </Text>
      </Text>
      <List display='flex'>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={linkColor}
            href='mailto:mosesprakhar@gmail.com'>
            Support
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <button
            fontWeight='500'
            color={linkColor}
            // href='https://www.simmmple.com/licenses?ref=horizon-chakra-free'
            onClick={() => console.log("Hello!")}
          >
            License
          </button>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <button
            fontWeight='500'
            color={linkColor}
            // href='https://simmmple.com/terms-of-service?ref=horizon-chakra-free'
            onClick={() => console.log("Hello!")}
          >
            Terms of Use
          </button>
        </ListItem>
        <ListItem>
          <button
            fontWeight='500'
            color={linkColor}
            // href='https://www.blog.simmmple.com/?ref=horizon-chakra-free'
            onClick={() => console.log("Hello!")}
          >
            Blog
          </button>
        </ListItem>
      </List>
    </Flex>
  );
}
