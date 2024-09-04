/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import bgHome from 'assets/img/bgHome.jpg'
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Importing chakra-ui
import { Image } from '@chakra-ui/react';

// Smart contract imports
import Organiser from "../../../contracts/Organiser.json";

const { ethers } = require("ethers");
const contractABI = Organiser.abi;
const contractAddress = '0x8447a887e331766b6fcfc896eedb177d26887f5c';

export default function Home() {
  const [topGames, setTopGames] = useState([
    {
      gameId: 0,
      gameName: "Among Us",
      gameDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem aliquam natus cumque optio quod dolorum, consectetur debitis temporibus, vel magnam harum ullam fugiat numquam reprehenderit laudantium porro nam iste accusantium, atque quisquam? Ipsa eaque nam quo ut consequuntur velit, id odit est iste. Eveniet, iste maxime impedit, explicabo, deleniti culpa quasi non nisi numquam voluptate molestiae! Doloremque hic corrupti veritatis laboriosam reprehenderit tempore quaerat vel eaque officiis aspernatur eos culpa commodi neque ut accusamus rerum, minima ipsum et facilis debitis necessitatibus sed iure. Libero quis tenetur et, eum officiis eaque placeat, ratione numquam beatae, atque delectus dicta tempora molestias odio quidem explicabo facilis optio! Recusandae tenetur soluta ex modi reiciendis commodi tempore quos molestias, accusantium qui repellendus sit architecto maiores minus quod, minima pariatur facilis expedita voluptates aspernatur libero. Temporibus nihil sunt provident voluptas ratione minus reiciendis necessitatibus blanditiis voluptatibus ab possimus magni quibusdam totam eos modi dolore, excepturi voluptates optio officiis. Temporibus assumenda itaque reprehenderit perferendis saepe facere aliquid, ut obcaecati voluptatibus! Consequuntur odio possimus mollitia exercitationem consequatur nisi ab, ipsa porro sapiente, accusamus, qui itaque? Enim labore at error, beatae cumque eos nihil, dicta consectetur nam quis deserunt, debitis quia ipsum inventore possimus explicabo! At alias cumque debitis.",
      gameImage: "data:image/jpeg;base64,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"
    }, {
      gameId: 1,
      gameName: 'Just Run',
      gameDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem aliquam natus cumque optio quod dolorum, consectetur debitis temporibus, vel magnam harum ullam fugiat numquam reprehenderit laudantium porro nam iste accusantium, atque quisquam? Ipsa eaque nam quo ut consequuntur velit, id odit est iste. Eveniet, iste maxime impedit, explicabo, deleniti culpa quasi non nisi numquam voluptate molestiae! Doloremque hic corrupti veritatis laboriosam reprehenderit tempore quaerat vel eaque officiis aspernatur eos culpa commodi neque ut accusamus rerum, minima ipsum et facilis debitis necessitatibus sed iure. Libero quis tenetur et, eum officiis eaque placeat, ratione numquam beatae, atque delectus dicta tempora molestias odio quidem explicabo facilis optio! Recusandae tenetur soluta ex modi reiciendis commodi tempore quos molestias, accusantium qui repellendus sit architecto maiores minus quod, minima pariatur facilis expedita voluptates aspernatur libero. Temporibus nihil sunt provident voluptas ratione minus reiciendis necessitatibus blanditiis voluptatibus ab possimus magni quibusdam totam eos modi dolore, excepturi voluptates optio officiis. Temporibus assumenda itaque reprehenderit perferendis saepe facere aliquid, ut obcaecati voluptatibus! Consequuntur odio possimus mollitia exercitationem consequatur nisi ab, ipsa porro sapiente, accusamus, qui itaque? Enim labore at error, beatae cumque eos nihil, dicta consectetur nam quis deserunt, debitis quia ipsum inventore possimus explicabo! At alias cumque debitis.",
      gameImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzzLr2RINXAKG5qLVb5zey9s5NNk9O_gZNIg&s"
    }, {
      gameId: 2,
      gameName: 'Find Me',
      gameDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem aliquam natus cumque optio quod dolorum, consectetur debitis temporibus, vel magnam harum ullam fugiat numquam reprehenderit laudantium porro nam iste accusantium, atque quisquam? Ipsa eaque nam quo ut consequuntur velit, id odit est iste. Eveniet, iste maxime impedit, explicabo, deleniti culpa quasi non nisi numquam voluptate molestiae! Doloremque hic corrupti veritatis laboriosam reprehenderit tempore quaerat vel eaque officiis aspernatur eos culpa commodi neque ut accusamus rerum, minima ipsum et facilis debitis necessitatibus sed iure. Libero quis tenetur et, eum officiis eaque placeat, ratione numquam beatae, atque delectus dicta tempora molestias odio quidem explicabo facilis optio! Recusandae tenetur soluta ex modi reiciendis commodi tempore quos molestias, accusantium qui repellendus sit architecto maiores minus quod, minima pariatur facilis expedita voluptates aspernatur libero. Temporibus nihil sunt provident voluptas ratione minus reiciendis necessitatibus blanditiis voluptatibus ab possimus magni quibusdam totam eos modi dolore, excepturi voluptates optio officiis. Temporibus assumenda itaque reprehenderit perferendis saepe facere aliquid, ut obcaecati voluptatibus! Consequuntur odio possimus mollitia exercitationem consequatur nisi ab, ipsa porro sapiente, accusamus, qui itaque? Enim labore at error, beatae cumque eos nihil, dicta consectetur nam quis deserunt, debitis quia ipsum inventore possimus explicabo! At alias cumque debitis.",
      gameImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAuXppsi1v3q3w4sVQ1g8qE1UdbpjSQ5E-hQ&s"
    }
  ]);

  async function retrieveJsonData(fileKey) {
    const fileUrl = `https://data.thetaedgestore.com/api/v2/data/${fileKey}`;
    const response = await fetch(fileUrl);
    const data = await response.json();
    return data;
  }

  // async function getDataFromIpfs(requestId) {
  //   var myHeaders = new Headers();
  //   myHeaders.append("x-api-key", "QN_71b6031049974cf5a5a8260011c03b60");

  //   var requestOptions = {
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow'
  //   };

  //   try {
  //     const response = await fetch(`https://api.quicknode.com/ipfs/rest/v1/s3/get-object/${requestId}`, requestOptions);
  //     const result = await response.json();
  //     return result; // Return the result
  //   } catch (error) {
  //     console.log(error);
  //     return null; // Return null in case of an error
  //   }
  // }

  useEffect(() => {
    const fetchTopGame = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const _contract = new ethers.Contract(contractAddress, contractABI, provider);
        const gamesList = await _contract.getGamesList();
        let gameListArray = [];

        for (const [index, game] of gamesList.entries()) {
          const res = await retrieveJsonData(game.Ipfs);
          const profileIpfs = await _contract.GetProfileIpfs(game.organiserAddress);
          const gameData = {
            gameId: game.gameId.toNumber(),
            gameName: res.gameName,
            gameImage: res.gameImage,
            gameDescription: res.description,
            date: new Date(res.date),
            totalPrizeMoney: game.totalRevenue.toNumber()
          }
          gameListArray.push(gameData);
        }

        if (gameListArray.length > 1) {
          gameListArray.sort((a, b) => {
            if (a.date === b.date) return (b.totalPrizeMoney - a.totalPrizeMoney);
            else return (a.date - b.date);
          }).slice(0, 3);
        }

        console.log("The game list array is: ", gameListArray);

        switch (gameListArray.length) {
          case 0:
            gameListArray = topGames;
            break;
          case 1:
            gameListArray[1] = topGames[1];
            gameListArray[2] = topGames[2];
            break;
          case 2:
            gameListArray[2] = topGames[2];
            break;
          default:
            break;
        }
        setTopGames(gameListArray);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTopGame();
  }, [])

  return (
    <div className="bg-transparent text-white min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-[-2]"
        style={{ backgroundImage: `url(${bgHome})` }}
      />

      <Image
        src={topGames[0].gameImage}
        h="23em"
        position="absolute"
        top="8em"
        zIndex={20}
        shadow="0 0 20px 1px #09b5a4"
      />
      <Image
        src={topGames[1].gameImage}
        h="23em"
        position="absolute"
        top="9em"
        left="-4em"
        transform="rotate(-20deg)"
        shadow="0 0 20px 1px #09b5a4"
      />
      <Image
        src={topGames[2].gameImage}
        h="23em"
        position="absolute"
        top="9em"
        right="-4em"
        transform="rotate(20deg)"
        shadow="0 0 20px 1px #09b5a4"
      />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-cover bg-center mt-[26em] relative z-[30]">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 shadow-[0_0_10px_#474a47]" style={{ textShadow: "0 0 20px #b8f5c2" }}>Are You Ready For Your Next Challenge?</h1>
        <p className="text-lg md:text-xl mb-8">Join GamETHa for an epic gaming adventure.</p>
        <Link
          to="/admin/explore"
          className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-md text-lg font-bold"
        >Get Started</Link>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-gray-800 text-center">
        <h2 className="text-4xl font-bold mb-6">We're The Best Game Service</h2>
        <p className="max-w-3xl mx-auto text-lg">Our aim is to provide the best service and assured termed game events and its streaming with trustworthy transactions at a very low price. We provide new developers to launch and kickstart their game. For tech giants to host events.</p>
      </section>

      {/* Games Section */}
      <section id="games" className="py-16 px-6 bg-gray-900 text-center mt-10">
        <h2 className="text-4xl font-bold mb-6">Top Upcoming Game Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topGames.map((game) => (
            <Link
              key={game.gameId}
              className='bg-gray-800 p-6 rounded-lg'
              to={`/admin/gameEvent/${game.gameId}`}
            >
              <h3 className='text-2xl font-bold mb-2 text-yellow-500'>{game.gameName}</h3>
              <p className='text-gray-300'>{game.gameDescription.split(' ').slice(0, 10).join(' ')}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}