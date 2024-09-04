// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Organiser {
    struct Player {
        address playerAddress;
        uint256 leaderboardScore;
        bool bHasPlayTicket;
        bool bHasStreamTicket;
    }

    struct GameData {
        uint256 gameId;
        address organiserAddress;
        string Ipfs;
        uint256 gameTicketPrice;
        uint256 streamTicketPrice;
        uint256 totalRevenue;
        Player[] playersJoined;
    }

    struct profile {
        uint256[] gamesJoined;
        uint256[] gamesOrganised;
        uint256 moneygained;
        mapping(uint256 => bool) iscollected;
        string ipfsdata;
    }

    address[] public organisers;
    GameData[] public gamesList;
    mapping(address => profile) ProfileData;

    function UploadProfile(string memory _ipfsData) public {
        ProfileData[msg.sender].ipfsdata = _ipfsData;
    }

    function GetProfileIpfs() public view returns (string memory){
        return ProfileData[msg.sender].ipfsdata;
    }

    function UploadGames(
        string memory _ipfs,
        uint256 _gameTicketPrice,
        uint256 _streamTicketPrice,
        uint256 _prizePoolFromOwner
    ) public payable {
        require(msg.value >= _prizePoolFromOwner, "Insufficient payment");
        if (msg.value > _prizePoolFromOwner) {
            payable(msg.sender).transfer(msg.value - _prizePoolFromOwner);
        }
        uint256 newGameId = gamesList.length;

        gamesList.push();
        GameData storage newGame = gamesList[newGameId];
        newGame.gameId = newGameId;
        newGame.organiserAddress = msg.sender;
        newGame.Ipfs = _ipfs;
        newGame.gameTicketPrice = _gameTicketPrice;
        newGame.streamTicketPrice = _streamTicketPrice;
        newGame.totalRevenue = 0 + _prizePoolFromOwner;

        ProfileData[msg.sender].gamesOrganised.push(newGameId);
        ProfileData[msg.sender].iscollected[newGameId] = false;
    }

    function JoinGame(
        uint256 _gameId,
        bool _bHasGameTicket,
        bool _bHasStreamTicket,
        uint256 _maxNoPlayer
    ) public payable {
        if (_gameId >= gamesList.length) {
            revert("Game does not exist");
        }
        require(
            gamesList[_gameId].playersJoined.length < _maxNoPlayer,
            "Game is full"
        );
        uint256 totCost = 0;

        if (_bHasGameTicket) {
            totCost += gamesList[_gameId].gameTicketPrice;
        }

        if (_bHasStreamTicket) {
            totCost += gamesList[_gameId].streamTicketPrice;
        }

        require(msg.value >= totCost, "Insufficient payment");

        gamesList[_gameId].playersJoined.push(
            Player({
                playerAddress: msg.sender,
                leaderboardScore: 0,
                bHasStreamTicket: _bHasStreamTicket,
                bHasPlayTicket: _bHasGameTicket
            })
        );

        ProfileData[msg.sender].gamesJoined.push(_gameId);
        ProfileData[msg.sender].iscollected[_gameId] = false;

        if (msg.value > totCost) {
            payable(msg.sender).transfer(msg.value - totCost);
        }
    }

    function UpdateLeaderBoard(uint256 _gameid, uint256 score) public {
        for (uint256 i = 0; i < gamesList[_gameid].playersJoined.length; i++) {
            if (
                gamesList[_gameid].playersJoined[i].playerAddress == msg.sender
            ) {
                gamesList[_gameid].playersJoined[i].leaderboardScore = score;
            }
        }
    }

    function GetReward(uint256 _gameid) public {
        if (ProfileData[msg.sender].iscollected[_gameid]) return;

        uint256 len = gamesList[_gameid].playersJoined.length;
        uint256 totalPrizeMoney = gamesList[_gameid].totalRevenue;
        if (msg.sender == gamesList[_gameid].organiserAddress) {
            payable(msg.sender).transfer((15 * totalPrizeMoney) / 100);
            ProfileData[msg.sender].moneygained += (15 * totalPrizeMoney) / 100;
            ProfileData[msg.sender].iscollected[_gameid] = true;
            return;
        }
        if (msg.sender == 0x885dF0Da95b731D9cE9f4f56AFE5762fd23E573C) {
            payable(msg.sender).transfer((5 * totalPrizeMoney) / 100);
            ProfileData[msg.sender].moneygained += (5 * totalPrizeMoney) / 100;
            ProfileData[msg.sender].iscollected[_gameid] = true;
            return;
        }
        uint256 MyScore = 0;
        uint256 position = 1;
        bool tiebraker = false;
        for (uint256 i = 0; i < len; i++) {
            if (
                gamesList[_gameid].playersJoined[i].playerAddress == msg.sender
            ) {
                MyScore = gamesList[_gameid].playersJoined[i].leaderboardScore;
            }
        }
        for (uint256 i = 0; i < len; i++) {
            if (
                gamesList[_gameid].playersJoined[i].playerAddress != msg.sender
            ) {
                if (
                    gamesList[_gameid].playersJoined[i].leaderboardScore >
                    MyScore
                ) {
                    position += 1;
                } else if (
                    gamesList[_gameid].playersJoined[i].leaderboardScore ==
                    MyScore
                ) {
                    if (!tiebraker) {
                        position += 1;
                    }
                }
            } else {
                tiebraker = true;
            }
        } // 5 15 30 20 15 15
        if (position == 1) {
            payable(msg.sender).transfer((30 * totalPrizeMoney) / 100);
            ProfileData[msg.sender].moneygained += (30 * totalPrizeMoney) / 100;
            ProfileData[msg.sender].iscollected[_gameid] = true;
        } else if (position == 2) {
            payable(msg.sender).transfer((20 * totalPrizeMoney) / 100);
            ProfileData[msg.sender].moneygained += (20 * totalPrizeMoney) / 100;
            ProfileData[msg.sender].iscollected[_gameid] = true;
        } else if (position == 3) {
            payable(msg.sender).transfer((15 * totalPrizeMoney) / 100);
            ProfileData[msg.sender].moneygained += (15 * totalPrizeMoney) / 100;
            ProfileData[msg.sender].iscollected[_gameid] = true;
        } else {
            // 4- 4 + 10/100 * len
            uint256 newlen = (len * 10) / 100;
            if (position >= 4 && position <= newlen + 3) {
                payable(msg.sender).transfer(
                    (15 * totalPrizeMoney) / (100 * newlen)
                );
                ProfileData[msg.sender].moneygained +=
                    (15 * totalPrizeMoney) /
                    (100 * newlen);
                ProfileData[msg.sender].iscollected[_gameid] = true;
            }
        }
    }

    function getGamesList() public view returns (GameData[] memory) {
        return gamesList;
    }

    function getGameById(uint256 _gameId)
        public
        view
        returns (GameData memory)
    {
        require(_gameId < gamesList.length, "Game does not exist");
        return gamesList[_gameId];
    }

    struct GameStatus {
        uint256 gameId;
        bool isCollected;
    }

    function getGamesStatus(address user)
        public
        view
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256,
            string memory,
            GameStatus[] memory
        )
    {
        uint256[] memory games = ProfileData[user].gamesJoined;
        uint256[] memory games2 = ProfileData[user].gamesOrganised;
        GameStatus[] memory gameStatuses = new GameStatus[](
            games.length + games2.length
        );

        for (uint256 i = 0; i < games.length; i++) {
            gameStatuses[i] = GameStatus({
                gameId: games[i],
                isCollected: ProfileData[user].iscollected[games[i]]
            });
        }
        for (uint256 i = games.length; i < games.length + games2.length; i++) {
            gameStatuses[i] = GameStatus({
                gameId: games2[i],
                isCollected: ProfileData[user].iscollected[games2[i]]
            });
        }

        return (
            ProfileData[user].gamesJoined,
            ProfileData[user].gamesOrganised,
            ProfileData[user].moneygained,
            ProfileData[user].ipfsdata,
            gameStatuses
        );
    }
}
