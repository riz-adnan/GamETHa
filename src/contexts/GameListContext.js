import { useState, createContext } from 'react';

// Importing frames
import frame1 from 'assets/img/dashboards/frame1.png'
import frame2 from 'assets/img/dashboards/frame2.png'
import frame3 from 'assets/img/dashboards/frame3.png'
import frame4 from 'assets/img/dashboards/frame4.png'
import frame5 from 'assets/img/dashboards/frame5.png'
import frame6 from 'assets/img/dashboards/frame6.png'
import frame7 from 'assets/img/dashboards/frame7.png'
import frame8 from 'assets/img/dashboards/frame8.png'
import frame9 from 'assets/img/dashboards/frame9.png'
import frame10 from 'assets/img/dashboards/frame10.png'
import defaultFrame from 'assets/img/dashboards/defaultFrame.png'

export const GameListContext = createContext();

export const GameListProvider = ({ children }) => {
    const [totalGamesList, setTotalGamesList] = useState([
        {
            gameId: 1,
            gameName: "Game 1",
            gameImage: "https://via.placeholder.com/150",
            gamePrice: 200,
            videoLink: "https://youtu.be/wjJU3lbiGTU?si=d6NC--IjqY6_xtev",
            gameDescription: "dfhfbd rtjhdkr kdrhvtir niurrvthd viur kv liuigoi livihrdli lvgrsmh mghls  vigs  mjgr mjgis mjgl",
            streamTicketPrice: 100,
            nickName: "gjdos",
            totalParticipants: 52,
            maxParticipants: 100,
            totalPrizeMoney: 500,
            bIsInvite: false,
			privateCode: "lghdyhdfirtvrd",
			bIsMultiplayer: false,
            organiserAddress: "0x0",
            date: new Date(),
            time: new Date().getTime(),
            noOfHour: 2,
            lobbyTimeInMin: 10,
        },
        {
            gameId: 2,
            gameName: "Game 1",
            gameImage: "https://via.placeholder.com/150",
            gamePrice: 200,
            videoLink: "https://youtu.be/wjJU3lbiGTU?si=d6NC--IjqY6_xtev",
            gameDescription: "dfhfbd rtjhdkr kdrhvtir niurrvthd viur kv liuigoi livihrdli lvgrsmh mghls  vigs  mjgr mjgis mjgl",
            streamTicketPrice: 100,
            nickName: "gjdos",
            totalParticipants: 52,
            maxParticipants: 100,
            totalPrizeMoney: 500,
            bIsInvite: true,
			privateCode: "lghdyhdfirtvrd",
			bIsMultiplayer: false,
            organiserAddress: "0x0",
            date: new Date(),
            time: new Date().getTime(),
            noOfHour: 2,
            lobbyTimeInMin: 10,
        },
        {
            gameId: 3,
            gameName: "Game 1",
            gameImage: "https://via.placeholder.com/150",
            gamePrice: 200,
            videoLink: "https://youtu.be/wjJU3lbiGTU?si=d6NC--IjqY6_xtev",
            gameDescription: "dfhfbd rtjhdkr kdrhvtir niurrvthd viur kv liuigoi livihrdli lvgrsmh mghls  vigs  mjgr mjgis mjgl",
            streamTicketPrice: 100,
            nickName: "gjdos",
            totalParticipants: 52,
            maxParticipants: 100,
            totalPrizeMoney: 500,
            bIsInvite: false,
			privateCode: "lghdyhdfirtvrd",
			bIsMultiplayer: false,
            organiserAddress: "0x0",
            date: new Date(),
            time: new Date().getTime(),
            noOfHour: 2,
            lobbyTimeInMin: 10,
        },
    ]);
    const [filteredGamesList, setFilteredGamesList] = useState(totalGamesList);
    const [searchedGamesList, setSearchedGamesList] = useState(totalGamesList);
    const [account, setAccount] = useState(localStorage.getItem('account') || '0x0');
    const framesArray = [defaultFrame, frame1, frame2, frame3, frame4, frame5, frame6, frame7, frame8, frame9, frame10];

    return (
        <GameListContext.Provider
            value={{totalGamesList, setTotalGamesList, filteredGamesList, setFilteredGamesList, searchedGamesList, setSearchedGamesList, account, setAccount, framesArray}}
        >
            {children}
        </GameListContext.Provider>
    )
}