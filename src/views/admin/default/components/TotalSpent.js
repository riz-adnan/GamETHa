// Chakra imports
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React, { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineCalendarToday } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";
// Assets
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
// import {
//   lineChartDataTotalSpent,
//   lineChartOptionsTotalSpent,
// } from "variables/charts";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function TotalSpent(props) {
  const { gameParticipated, ...rest } = props;
  const [timeFrame, setTimeFrame] = useState("This Month");
  const [lineChartDataTotalSpent, setLineChartDataTotalSpent] = useState([
    {
      name: "Current Month",
      data: [50, 64, 48, 66],
    },
    {
      name: "Past Month",
      data: [30, 40, 24, 46],
    },
  ]);
  const [lineChartOptionsTotalSpent, setLineChartOptionsTotalSpent] = useState({
    chart: {
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#4318FF",
      },
    },
    colors: ["#4318FF", "#39B8FF"],
    markers: {
      size: 0,
      colors: "white",
      strokeColors: "#7551FF",
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      type: "line",
    },
    xaxis: {
      type: "numeric",
      categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      column: {
        color: ["#7551FF", "#39B8FF"],
        opacity: 0.5,
      },
    },
    color: ["#7551FF", "#39B8FF"],
  });
  const [growth, setGrowth] = useState({
    value: 25,
    percent: 2.5
  });
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  const handleTimeFrameChange = (timeFrame) => {
    setTimeFrame(timeFrame);
    switch (timeFrame) {
      case "This Week":
        const todayDay = new Date().getDay();
        setLineChartOptionsTotalSpent({
          ...lineChartOptionsTotalSpent,
          xaxis: {
            ...lineChartOptionsTotalSpent.xaxis,
            categories: daysOfWeek.slice(todayDay).concat(daysOfWeek.slice(0, todayDay)),
          }
        });

        const sevenDaysAgo = new Date(todayDay - 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
        const fourteenDaysAgo = new Date(todayDay - 14 * 24 * 60 * 60 * 1000); // 14 days in milliseconds
        const gamesWithinRange = gameParticipated.filter((game) => {
          const gameDate = new Date(game.startDate);
          return gameDate >= sevenDaysAgo && gameDate <= today;
        });
        const lastGamesWithinRange = gameParticipated.filter((game) => {
          const gameDate = new Date(game.startDate);
          return gameDate >= fourteenDaysAgo && gameDate <= sevenDaysAgo;
        })

        const thisWeekDailyIncome = [];
        const lastWeekDailyIncome = [];
        gamesWithinRange.forEach((game) => {
          const gameDateStr = game.startDate;
          if (thisWeekDailyIncome[gameDateStr]) {
            thisWeekDailyIncome[gameDateStr] += game.income;
          } else thisWeekDailyIncome[gameDateStr] = game.income;
        });
        lastGamesWithinRange.forEach((game) => {
          const gameDateStr = game.startDate;
          if (lastWeekDailyIncome[gameDateStr]) {
            lastWeekDailyIncome[gameDateStr] += game.income;
          } else lastWeekDailyIncome[gameDateStr] = game.income;
        });
        const currentWeekIncome = Object.values(thisWeekDailyIncome).length === 0 ? [0, 0, 0, 0, 0, 0, 0] : Object.values(thisWeekDailyIncome);
        const lastWeekIncome = Object.values(lastWeekDailyIncome).length === 0 ? [0, 0, 0, 0, 0, 0, 0] : Object.values(lastWeekDailyIncome);
        const currentWeekTotal = currentWeekIncome.reduce((acc, val) => acc + val, 0);
        const lastWeekTotal = lastWeekIncome.reduce((acc, val) => acc + val, 0);

        setGrowth({
          value: currentWeekTotal - lastWeekTotal,
          percent: ((currentWeekTotal - lastWeekTotal) / (lastWeekTotal + 1) * 100).toFixed(1),
        });
        setLineChartDataTotalSpent([
          {
            name: "Current Week",
            data: currentWeekIncome,
          },
          {
            name: "Past Week",
            data: lastWeekIncome,
          }
        ]);
        break;
      case "This Month":
        setLineChartOptionsTotalSpent({
          ...lineChartOptionsTotalSpent,
          xaxis: {
            ...lineChartOptionsTotalSpent.xaxis,
            categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
          }
        });
        const today = new Date();
        const currentMonth = today.getMonth();
        const pastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const currentYear = today.getFullYear();

        // Filter games for the current month
        const gamesThisMonth = gameParticipated.filter((game) => {
          const gameDate = new Date(game.startDate);
          return gameDate.getMonth() === currentMonth && gameDate.getFullYear() === currentYear;
        });
        const gamesLastMonth = gameParticipated.filter((game) => {
          const gameDate = new Date(game.startDate);
          return gameDate.getMonth() === pastMonth && gameDate.getFullYear() === currentYear;
        })

        const weeks = [0, 0, 0, 0];
        const pastWeek = [0, 0, 0, 0];
        gamesThisMonth.forEach((game) => {
          const dayOfMonth = new Date(game.date).getDate();
          const weekIndex = Math.floor((dayOfMonth - 1) / 7); // 0-indexed

          weeks[weekIndex] += game.income;
        });
        gamesLastMonth.forEach((game) => {
          const dayOfMonth = new Date(game.date).getDate();
          const weekIndex = Math.floor((dayOfMonth - 1) / 7); // 0-indexed

          pastWeek[weekIndex] += game.income;
        });
        const currentMonthTotal = weeks.reduce((acc, val) => acc + val, 0);
        const lastMonthTotal = pastWeek.reduce((acc, val) => acc + val, 0);

        setGrowth({
          value: currentMonthTotal - lastMonthTotal,
          percent: ((currentMonthTotal - lastMonthTotal) / (lastMonthTotal + 1) * 100).toFixed(1),
        });
        setLineChartDataTotalSpent([
          {
            name: "Current Month",
            data: weeks
          }, {
            name: "Past Month",
            data: pastWeek
          }
        ])
        break;
      case "This Year":
        const todayDate = new Date();
        const todayMonth = todayDate.getMonth();
        setLineChartOptionsTotalSpent({
          ...lineChartOptionsTotalSpent,
          xaxis: {
            ...lineChartOptionsTotalSpent.xaxis,
            categories: monthsOfYear.slice(todayMonth).concat(monthsOfYear.slice(0, todayMonth)),
          }
        });
        const currentYearY = todayDate.getFullYear();
        const startDate = new Date(currentYearY - 1, todayDate.getMonth() + 1, 1);
        const pastStartDate = new Date(currentYearY - 2, todayDate.getMonth() + 1, 1);

        // Filter income data within the past year
        const incomeWithinYear = gameParticipated.filter((game) => {
          const gameDate = new Date(game.date);
          return gameDate >= startDate && gameDate <= today;
        });
        const incomeLastYear = gameParticipated.filter((game) => {
          const gameDate = new Date(game.date);
          return gameDate >= pastStartDate && gameDate <= startDate;
        })

        // Create an array to store monthly income
        const monthlyIncome = Array(12).fill(0); // Initialize with zeros
        const pastMonthlyIncome = Array(12).fill(0);

        incomeWithinYear.forEach((game) => {
          const monthIndex = game.date.getMonth(); // 0-indexed (January is 0)
          monthlyIncome[monthIndex] += game.income;
        });
        incomeLastYear.forEach((game) => {
          const monthIndex = game.date.getMonth();
          pastMonthlyIncome[monthIndex] += game.income;
        });
        const currentYearTotal = monthlyIncome.reduce((acc, val) => acc + val, 0);
        const lastYearTotal = pastMonthlyIncome.reduce((acc, val) => acc + val, 0);

        setGrowth({
          value: currentYearTotal - lastYearTotal,
          percent: ((currentYearTotal - lastYearTotal) / (lastYearTotal + 1) * 100).toFixed(1),
        });
        setLineChartDataTotalSpent([
          {
            name: "Current Year",
            data: monthlyIncome
          }, {
            name: "Past Year",
            data: pastMonthlyIncome
          }
        ])
    }
  }

  return (
    <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'
      {...rest}>
      <Flex justify='space-between' ps='0px' pe='20px' pt='5px'>
        <Flex align='center' w='100%'>
          <Menu>
            <MenuButton>
              <Button
                bg={boxBg}
                fontSize='sm'
                fontWeight='500'
                color={textColorSecondary}
                borderRadius='7px'>
                <Icon
                  as={MdOutlineCalendarToday}
                  color={textColorSecondary}
                  me='4px'
                />
                {timeFrame}
              </Button>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleTimeFrameChange("This Week")}>This Week</MenuItem>
              <MenuItem onClick={() => handleTimeFrameChange("This Month")}>This Month</MenuItem>
              <MenuItem onClick={() => handleTimeFrameChange("This Year")}>This Year</MenuItem>
            </MenuList>
          </Menu>
          <Button
            ms='auto'
            align='center'
            justifyContent='center'
            bg={bgButton}
            _hover={bgHover}
            _focus={bgFocus}
            _active={bgFocus}
            w='37px'
            h='37px'
            lineHeight='100%'
            borderRadius='10px'
            {...rest}>
            <Icon as={FaChartLine} color={iconColor} w='24px' h='24px' />
          </Button>
        </Flex>
      </Flex>
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection='column' me='20px' mt='28px'>
          <Text
            color={textColor}
            fontSize='34px'
            textAlign='start'
            fontWeight='700'
            lineHeight='100%'>
            ${growth.value}
          </Text>
          <Flex align='center' mb='20px'>
            <Text
              color='secondaryGray.600'
              fontSize='sm'
              fontWeight='500'
              mt='4px'
              me='12px'>
              Total Revenue
            </Text>
            <Flex align='center'>
              {growth.value >= 0 ? <Icon as={RiArrowUpSFill} color='green.500' me='2px' mt='2px' /> :
              <Icon as={RiArrowDownSFill} color='red.500' me='2px' mt='2px' />}
              <Text color='green.500' fontSize='sm' fontWeight='700'>
                {growth.percent}%
              </Text>
            </Flex>
          </Flex>

          <Flex align='center'>
            <Icon as={IoCheckmarkCircle} color='green.500' me='4px' />
            <Text color='green.500' fontSize='md' fontWeight='700'>
              On track
            </Text>
          </Flex>
        </Flex>
        <Box minH='260px' minW='75%' mt='auto'>
          <LineChart
            chartData={lineChartDataTotalSpent}
            chartOptions={lineChartOptionsTotalSpent}
          />
        </Box>
      </Flex>
    </Card>
  );
}
