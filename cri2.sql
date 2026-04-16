-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 12, 2026 at 11:01 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cri2`
--

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

CREATE TABLE `deliveries` (
  `id` int NOT NULL,
  `inningsId` int NOT NULL,
  `seq` int NOT NULL,
  `overNumber` int NOT NULL,
  `ballIndex` int NOT NULL,
  `kind` enum('RUN','WIDE','NOBALL','BYE','LEG_BYE','PENALTY','Wicket') COLLATE utf8mb4_general_ci NOT NULL,
  `isLegal` tinyint NOT NULL DEFAULT '1',
  `strikerSquadId` int NOT NULL,
  `nonStrikerSquadId` int NOT NULL,
  `bowlerSquadId` int NOT NULL,
  `runsOffBat` int NOT NULL DEFAULT '0',
  `wideRuns` int NOT NULL DEFAULT '0',
  `noBallRuns` int NOT NULL DEFAULT '0',
  `byeRuns` int NOT NULL DEFAULT '0',
  `legByeRuns` int NOT NULL DEFAULT '0',
  `penaltyRuns` int NOT NULL DEFAULT '0',
  `symbol` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `wicketId` int DEFAULT NULL,
  `bowlingSpeed` decimal(5,2) DEFAULT NULL,
  `shotAngle` int DEFAULT NULL,
  `shotDistance` int DEFAULT NULL,
  `phase` enum('POWERPLAY','MIDDLE','DEATH') DEFAULT NULL,
  `isVoided` tinyint NOT NULL DEFAULT '0',
  `voidedAt` datetime DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `total_runs` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `innings`
--

CREATE TABLE `innings` (
  `id` int NOT NULL,
  `matchId` int NOT NULL,
  `number` enum('FIRST','SECOND','THIRD','FOURTH') COLLATE utf8mb4_general_ci NOT NULL,
  `battingTeamId` int NOT NULL,
  `bowlingTeamId` int NOT NULL,
  `targetRuns` int DEFAULT NULL,
  `startedAt` datetime DEFAULT NULL,
  `endedAt` datetime DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '0',
  `total_extra` int DEFAULT NULL,
  `total_attempt_over` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `id` int NOT NULL,
  `title` varchar(180) COLLATE utf8mb4_general_ci NOT NULL,
  `format` enum('T10','T20','ODI','TEST','CUSTOM') COLLATE utf8mb4_general_ci NOT NULL,
  `poolId` int DEFAULT NULL,
  `team1Id` int NOT NULL,
  `team2Id` int NOT NULL,
  `venue` varchar(180) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `startTime` datetime DEFAULT NULL,
  `status` enum('SCHEDULED','LIVE','FINISHED','CANCEL') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'SCHEDULED',
  `oversLimit` int DEFAULT NULL,
  `ballsPerOver` int NOT NULL DEFAULT '6',
  `tossWinnerTeamId` int DEFAULT NULL,
  `tossDecision` enum('BAT','BOWL') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `winnerTeamId` int DEFAULT NULL,
  `resultText` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`id`, `title`, `format`, `poolId`, `team1Id`, `team2Id`, `venue`, `startTime`, `status`, `oversLimit`, `ballsPerOver`, `tossWinnerTeamId`, `tossDecision`, `winnerTeamId`, `resultText`, `createdAt`, `updatedAt`) VALUES
(1, 'Pool A (T20) — Pakistan vs Bangladesh — Dubai International Stadium', 'T20', 1, 1, 3, 'Dubai International Stadium', NULL, 'SCHEDULED', 20, 6, NULL, NULL, NULL, NULL, '2026-01-17 13:57:24.105640', '2026-01-17 13:57:24.105640'),
(2, 'Pool A (T20) — Pakistan vs South Africa — Dubai International Stadium', 'T20', 1, 1, 5, 'Dubai International Stadium', NULL, 'SCHEDULED', 20, 6, NULL, NULL, NULL, NULL, '2026-01-17 13:57:24.105640', '2026-01-17 13:57:24.105640'),
(3, 'Pool A (T20) — Bangladesh vs South Africa — Dubai International Stadium', 'T20', 1, 3, 5, 'Dubai International Stadium', NULL, 'SCHEDULED', 20, 6, NULL, NULL, NULL, NULL, '2026-01-17 13:57:24.105640', '2026-01-17 13:57:24.105640'),
(4, 'Pool B (T20) — Australia vs New Zealand — Dubai International Stadium', 'T20', 4, 2, 4, 'Dubai International Stadium', NULL, 'SCHEDULED', 20, 6, NULL, NULL, NULL, NULL, '2026-01-17 13:57:24.105640', '2026-01-17 13:57:24.105640'),
(5, 'Pool B (T20) — Australia vs West Indies — Dubai International Stadium', 'T20', 4, 2, 6, 'Dubai International Stadium', NULL, 'SCHEDULED', 20, 6, NULL, NULL, NULL, NULL, '2026-01-17 13:57:24.105640', '2026-01-17 13:57:24.105640'),
(6, 'Pool B (T20) — New Zealand vs West Indies — Dubai International Stadium', 'T20', 4, 4, 6, 'Dubai International Stadium', NULL, 'SCHEDULED', 20, 6, NULL, NULL, NULL, NULL, '2026-01-17 13:57:24.105640', '2026-01-17 13:57:24.105640');

-- --------------------------------------------------------

--
-- Table structure for table `match_batting`
--

CREATE TABLE `match_batting` (
  `id` int NOT NULL,
  `matchId` int NOT NULL,
  `inningsId` int NOT NULL,
  `player_id` int NOT NULL,
  `balls` int NOT NULL,
  `runs` int NOT NULL,
  `fours` int NOT NULL DEFAULT '0',
  `sixes` int NOT NULL DEFAULT '0',
  `strikeRate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `status` int NOT NULL DEFAULT '1',
  `index` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `match_squad`
--

CREATE TABLE `match_squad` (
  `id` int NOT NULL,
  `matchId` int NOT NULL,
  `teamId` int NOT NULL,
  `playerId` int NOT NULL,
  `isPlayingXI` tinyint NOT NULL DEFAULT '0',
  `isCaptain` tinyint NOT NULL DEFAULT '0',
  `isWicketKeeper` tinyint NOT NULL DEFAULT '0',
  `battingPos` int DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `isViceCaptain` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `match_squad`
--

INSERT INTO `match_squad` (`id`, `matchId`, `teamId`, `playerId`, `isPlayingXI`, `isCaptain`, `isWicketKeeper`, `battingPos`, `isActive`, `isViceCaptain`) VALUES
(1, 1, 1, 15, 1, 1, 0, 1, 1, 0),
(2, 1, 1, 4, 1, 0, 0, 2, 1, 1),
(3, 1, 1, 10, 1, 0, 0, 3, 1, 0),
(4, 1, 1, 11, 1, 0, 0, 4, 1, 0),
(5, 1, 1, 3, 1, 0, 0, 5, 1, 0),
(6, 1, 1, 2, 1, 0, 0, 6, 1, 0),
(7, 1, 1, 8, 1, 0, 0, 7, 1, 0),
(8, 1, 1, 1, 1, 0, 0, 8, 1, 0),
(9, 1, 1, 14, 1, 0, 0, 9, 1, 0),
(10, 1, 1, 9, 1, 0, 0, 10, 1, 0),
(11, 1, 1, 12, 1, 0, 0, 11, 1, 0),
(12, 1, 3, 43, 1, 0, 1, 4, 1, 0),
(13, 1, 3, 44, 1, 0, 0, 5, 1, 0),
(14, 1, 3, 45, 1, 1, 0, 1, 1, 0),
(15, 1, 3, 39, 1, 0, 0, 2, 1, 1),
(16, 1, 3, 37, 1, 0, 0, 3, 1, 0),
(17, 1, 3, 32, 1, 0, 0, 6, 1, 0),
(18, 1, 3, 36, 1, 0, 0, 7, 1, 0),
(19, 1, 3, 40, 1, 0, 0, 8, 1, 0),
(20, 1, 3, 41, 1, 0, 0, 9, 1, 0),
(21, 1, 3, 42, 1, 0, 0, 10, 1, 0),
(22, 1, 3, 34, 1, 0, 0, 11, 1, 0),
(23, 2, 1, 15, 1, 1, 0, 1, 1, 0),
(24, 2, 1, 4, 1, 0, 0, 2, 1, 1),
(25, 2, 1, 10, 1, 0, 0, 3, 1, 0),
(26, 2, 1, 11, 1, 0, 0, 4, 1, 0),
(27, 2, 1, 3, 1, 0, 0, 5, 1, 0),
(28, 2, 1, 2, 1, 0, 0, 6, 1, 0),
(29, 2, 1, 8, 1, 0, 0, 7, 1, 0),
(30, 2, 1, 1, 1, 0, 0, 8, 1, 0),
(31, 2, 1, 14, 1, 0, 0, 9, 1, 0),
(32, 2, 1, 9, 1, 0, 0, 10, 1, 0),
(33, 2, 1, 12, 1, 0, 0, 11, 1, 0),
(34, 2, 5, 68, 1, 0, 1, 4, 1, 0),
(35, 2, 5, 62, 1, 1, 0, 1, 1, 0),
(36, 2, 5, 75, 1, 0, 0, 2, 1, 1),
(37, 2, 5, 61, 1, 0, 0, 3, 1, 0),
(38, 2, 5, 70, 1, 0, 0, 5, 1, 0),
(39, 2, 5, 66, 1, 0, 0, 6, 1, 0),
(40, 2, 5, 73, 1, 0, 0, 7, 1, 0),
(41, 2, 5, 67, 1, 0, 0, 8, 1, 0),
(42, 2, 5, 74, 1, 0, 0, 9, 1, 0),
(43, 2, 5, 65, 1, 0, 0, 10, 1, 0),
(44, 2, 5, 63, 1, 0, 0, 11, 1, 0),
(45, 3, 3, 43, 1, 0, 1, 4, 1, 0),
(46, 3, 3, 44, 1, 0, 0, 5, 1, 0),
(47, 3, 3, 45, 1, 1, 0, 1, 1, 0),
(48, 3, 3, 39, 1, 0, 0, 2, 1, 1),
(49, 3, 3, 37, 1, 0, 0, 3, 1, 0),
(50, 3, 3, 32, 1, 0, 0, 6, 1, 0),
(51, 3, 3, 36, 1, 0, 0, 7, 1, 0),
(52, 3, 3, 40, 1, 0, 0, 8, 1, 0),
(53, 3, 3, 41, 1, 0, 0, 9, 1, 0),
(54, 3, 3, 42, 1, 0, 0, 10, 1, 0),
(55, 3, 3, 34, 1, 0, 0, 11, 1, 0),
(56, 3, 5, 68, 1, 0, 1, 4, 1, 0),
(57, 3, 5, 62, 1, 1, 0, 1, 1, 0),
(58, 3, 5, 75, 1, 0, 0, 2, 1, 1),
(59, 3, 5, 61, 1, 0, 0, 3, 1, 0),
(60, 3, 5, 70, 1, 0, 0, 5, 1, 0),
(61, 3, 5, 66, 1, 0, 0, 6, 1, 0),
(62, 3, 5, 73, 1, 0, 0, 7, 1, 0),
(63, 3, 5, 67, 1, 0, 0, 8, 1, 0),
(64, 3, 5, 74, 1, 0, 0, 9, 1, 0),
(65, 3, 5, 65, 1, 0, 0, 10, 1, 0),
(66, 3, 5, 63, 1, 0, 0, 11, 1, 0),
(67, 4, 2, 26, 1, 1, 1, 1, 1, 0),
(68, 4, 2, 27, 1, 0, 0, 10, 1, 0),
(69, 4, 2, 20, 1, 0, 0, 2, 1, 1),
(70, 4, 2, 21, 1, 0, 0, 3, 1, 0),
(71, 4, 2, 24, 1, 0, 0, 4, 1, 0),
(72, 4, 2, 28, 1, 0, 0, 5, 1, 0),
(73, 4, 2, 22, 1, 0, 0, 6, 1, 0),
(74, 4, 2, 18, 1, 0, 0, 7, 1, 0),
(75, 4, 2, 29, 1, 0, 0, 8, 1, 0),
(76, 4, 2, 23, 1, 0, 0, 9, 1, 0),
(77, 4, 2, 19, 1, 0, 0, 11, 1, 0),
(78, 4, 4, 60, 1, 1, 0, 1, 1, 0),
(79, 4, 4, 53, 1, 0, 0, 2, 1, 1),
(80, 4, 4, 59, 1, 0, 0, 3, 1, 0),
(81, 4, 4, 52, 1, 0, 0, 4, 1, 0),
(82, 4, 4, 50, 1, 0, 0, 5, 1, 0),
(83, 4, 4, 58, 1, 0, 0, 6, 1, 0),
(84, 4, 4, 47, 1, 0, 0, 7, 1, 0),
(85, 4, 4, 51, 1, 0, 0, 8, 1, 0),
(86, 4, 4, 49, 1, 0, 0, 9, 1, 0),
(87, 4, 4, 55, 1, 0, 0, 10, 1, 0),
(88, 4, 4, 57, 1, 0, 0, 11, 1, 0),
(89, 5, 2, 26, 1, 1, 1, 1, 1, 0),
(90, 5, 2, 27, 1, 0, 0, 10, 1, 0),
(91, 5, 2, 20, 1, 0, 0, 2, 1, 1),
(92, 5, 2, 21, 1, 0, 0, 3, 1, 0),
(93, 5, 2, 24, 1, 0, 0, 4, 1, 0),
(94, 5, 2, 28, 1, 0, 0, 5, 1, 0),
(95, 5, 2, 22, 1, 0, 0, 6, 1, 0),
(96, 5, 2, 18, 1, 0, 0, 7, 1, 0),
(97, 5, 2, 29, 1, 0, 0, 8, 1, 0),
(98, 5, 2, 23, 1, 0, 0, 9, 1, 0),
(99, 5, 2, 19, 1, 0, 0, 11, 1, 0),
(100, 5, 6, 87, 1, 1, 0, 1, 1, 0),
(101, 5, 6, 88, 1, 0, 0, 2, 1, 1),
(102, 5, 6, 85, 1, 0, 0, 3, 1, 0),
(103, 5, 6, 79, 1, 0, 0, 4, 1, 0),
(104, 5, 6, 77, 1, 0, 0, 5, 1, 0),
(105, 5, 6, 82, 1, 0, 0, 6, 1, 0),
(106, 5, 6, 78, 1, 0, 0, 7, 1, 0),
(107, 5, 6, 80, 1, 0, 0, 8, 1, 0),
(108, 5, 6, 90, 1, 0, 0, 9, 1, 0),
(109, 5, 6, 84, 1, 0, 0, 10, 1, 0),
(110, 5, 6, 83, 1, 0, 0, 11, 1, 0),
(111, 6, 4, 60, 1, 1, 0, 1, 1, 0),
(112, 6, 4, 53, 1, 0, 0, 2, 1, 1),
(113, 6, 4, 59, 1, 0, 0, 3, 1, 0),
(114, 6, 4, 52, 1, 0, 0, 4, 1, 0),
(115, 6, 4, 50, 1, 0, 0, 5, 1, 0),
(116, 6, 4, 58, 1, 0, 0, 6, 1, 0),
(117, 6, 4, 47, 1, 0, 0, 7, 1, 0),
(118, 6, 4, 51, 1, 0, 0, 8, 1, 0),
(119, 6, 4, 49, 1, 0, 0, 9, 1, 0),
(120, 6, 4, 55, 1, 0, 0, 10, 1, 0),
(121, 6, 4, 57, 1, 0, 0, 11, 1, 0),
(122, 6, 6, 87, 1, 1, 0, 1, 1, 0),
(123, 6, 6, 88, 1, 0, 0, 2, 1, 1),
(124, 6, 6, 85, 1, 0, 0, 3, 1, 0),
(125, 6, 6, 79, 1, 0, 0, 4, 1, 0),
(126, 6, 6, 77, 1, 0, 0, 5, 1, 0),
(127, 6, 6, 82, 1, 0, 0, 6, 1, 0),
(128, 6, 6, 78, 1, 0, 0, 7, 1, 0),
(129, 6, 6, 80, 1, 0, 0, 8, 1, 0),
(130, 6, 6, 90, 1, 0, 0, 9, 1, 0),
(131, 6, 6, 84, 1, 0, 0, 10, 1, 0),
(132, 6, 6, 83, 1, 0, 0, 11, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `over_summary`
--

CREATE TABLE `over_summary` (
  `id` int NOT NULL,
  `matchId` int NOT NULL,
  `inningsId` int NOT NULL,
  `player_id` int NOT NULL,
  `overNumber` int NOT NULL,
  `balls` text NOT NULL,
  `ball_index` int NOT NULL,
  `runs` int NOT NULL DEFAULT '0',
  `wickets` int NOT NULL DEFAULT '0',
  `isMaiden` tinyint NOT NULL DEFAULT '0',
  `bowlerSquadId` int DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `extra` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `id` int NOT NULL,
  `teamId` int NOT NULL,
  `first_name` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('BAT','BOWL','ALL_ROUNDER','WK') COLLATE utf8mb4_general_ci NOT NULL,
  `shirtNo` int NOT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `battingStyle` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bowlingStyle` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `no_of_matches` int NOT NULL DEFAULT '0',
  `strike_rate` decimal(6,2) NOT NULL DEFAULT '0.00',
  `image` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`id`, `teamId`, `first_name`, `last_name`, `role`, `shirtNo`, `dateOfBirth`, `battingStyle`, `bowlingStyle`, `no_of_matches`, `strike_rate`, `image`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Saim', 'Ayub', 'BAT', 63, NULL, 'Left-handed', 'Right-arm off spin', 0, 0.00, 'https://ui-avatars.com/api/?name=Saim+Ayub&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(2, 1, 'Azam', 'Baber', 'BAT', 56, NULL, 'Right-handed', 'Right-arm off spin', 0, 0.00, 'https://ui-avatars.com/api/?name=Babar+Azam&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-25 18:31:35.593020'),
(3, 1, 'Sahibzada', 'Farhan', 'BAT', 51, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Sahibzada+Farhan&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(4, 1, 'Imam-ul', 'Haq', 'BAT', 26, NULL, 'Left-handed', 'Right-arm leg spin', 0, 0.00, 'https://ui-avatars.com/api/?name=Imam-ul-Haq&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(5, 1, 'Mohammad', 'Huraira', 'BAT', 99, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Mohammad+Huraira&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(6, 1, 'Irfan', 'Khan', 'BAT', 80, NULL, 'Right-handed', 'Right-arm medium-fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Irfan+Khan&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(7, 1, 'Shan', 'Masood', 'BAT', 94, NULL, 'Left-handed', 'Right-arm medium-fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Shan+Masood&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(8, 1, 'Abdullah', 'Shafique', 'BAT', 57, NULL, 'Right-handed', 'Right-arm off spin', 0, 0.00, 'https://ui-avatars.com/api/?name=Abdullah+Shafique&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(9, 1, 'Tayyab', 'Tahir', 'BAT', 66, NULL, 'Right-handed', 'Right-arm leg spin', 0, 0.00, 'https://ui-avatars.com/api/?name=Tayyab+Tahir&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(10, 1, 'Omair', 'Yousuf', 'BAT', 30, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Omair+Yousuf&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(11, 1, 'Fakhar', 'Zaman', 'BAT', 39, NULL, 'Left-handed', 'Left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Fakhar+Zaman&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(12, 1, 'Salman', 'Ali Agha', 'ALL_ROUNDER', 67, NULL, 'Right-handed', 'Right-arm off spin', 0, 0.00, 'https://ui-avatars.com/api/?name=Salman+Ali+Agha&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(13, 1, 'Kamran', 'Ghulam', 'ALL_ROUNDER', 82, NULL, 'Right-handed', 'Left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Kamran+Ghulam&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(14, 1, 'Aamir', 'Jamal', 'ALL_ROUNDER', 65, NULL, 'Right-handed', 'Right-arm medium-fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Aamir+Jamal&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(15, 1, 'Shah Afridi', 'Shaheen', 'BOWL', 10, NULL, 'Left-handed', 'Left-arm fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Shaheen+Shah+Afridi&size=256', 1, '2026-01-17 12:46:57.444010', '2026-02-07 12:56:18.384830'),
(16, 2, 'Tim', 'David', 'BAT', 85, NULL, 'Right-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Tim+David&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(17, 2, 'Travis', 'Head', 'BAT', 62, NULL, 'Left-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Travis+Head&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(18, 2, 'Marnus', 'Labuschagne', 'BAT', 33, NULL, 'Right-handed', 'Right-arm medium-fast, leg break', 0, 0.00, 'https://ui-avatars.com/api/?name=Marnus+Labuschagne&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(19, 2, 'Steve', 'Smith', 'BAT', 49, NULL, 'Right-handed', 'Right-arm leg break', 0, 0.00, 'https://ui-avatars.com/api/?name=Steve+Smith&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(20, 2, 'Matthew', 'Short', 'BAT', 5, NULL, 'Right-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Matthew+Short&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(21, 2, 'Mitchell', 'Marsh', 'ALL_ROUNDER', 8, NULL, 'Right-handed', 'Right-arm medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Mitchell+Marsh&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(22, 2, 'Glenn', 'Maxwell', 'ALL_ROUNDER', 32, NULL, 'Right-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Glenn+Maxwell&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(23, 2, 'Cameron', 'Green', 'ALL_ROUNDER', 42, NULL, 'Right-handed', 'Right-arm fast-medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Cameron+Green&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(24, 2, 'Cooper', 'Connolly', 'ALL_ROUNDER', 9, NULL, 'Left-handed', 'Slow left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Cooper+Connolly&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(25, 2, 'Sean', 'Abbott', 'ALL_ROUNDER', 77, NULL, 'Right-handed', 'Right-arm fast-medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Sean+Abbott&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(26, 2, 'Alex', 'Carey', 'WK', 4, NULL, 'Left-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Alex+Carey&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(27, 2, 'Josh', 'Inglis', 'WK', 48, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Josh+Inglis&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(28, 2, 'Pat', 'Cummins', 'BOWL', 30, NULL, 'Right-handed', 'Right-arm fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Pat+Cummins&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(29, 2, 'Josh', 'Hazlewood', 'BOWL', 38, NULL, 'Left-handed', 'Right-arm fast-medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Josh+Hazlewood&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(30, 2, 'Mitchell', 'Starc', 'BOWL', 56, NULL, 'Left-handed', 'Left-arm fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Mitchell+Starc&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(31, 3, 'Najmul Hossain', 'Shan', 'BAT', 99, NULL, 'Left', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Najmul+Hossain+Shanto&size=256', 1, '2026-01-17 12:46:57.444010', '2026-02-07 12:55:23.793025'),
(32, 3, 'Zakir', 'Hasan', 'BAT', 21, NULL, 'Right', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Zakir+Hasan&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(33, 3, 'Towhid', 'Hridoy', 'BAT', 77, NULL, 'Right', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Towhid+Hridoy&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(34, 3, 'Mahmudul Hasan', 'Joy', 'BAT', 71, NULL, 'Right', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Mahmudul+Hasan+Joy&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(35, 3, 'Shahadat', 'Hossain', 'BAT', 78, NULL, 'Right', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Shahadat+Hossain&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(36, 3, 'Tanzid', 'Hasan', 'BAT', 31, NULL, 'Left', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Tanzid+Hasan&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(37, 3, 'Shadman', 'Islam', 'BAT', 10, NULL, 'Left', 'Slow left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Shadman+Islam&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(38, 3, 'Shakib', 'Al Hasan', 'ALL_ROUNDER', 75, NULL, 'Left', 'Slow left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Shakib+Al+Hasan&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(39, 3, 'Mominul', 'Haque', 'ALL_ROUNDER', 7, NULL, 'Left', 'Slow left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Mominul+Haque&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(40, 3, 'Mehidy Hasan', 'Miraz', 'ALL_ROUNDER', 53, NULL, 'Right', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Mehidy+Hasan+Miraz&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(41, 3, 'Mahedi', 'Hasan', 'ALL_ROUNDER', 55, NULL, 'Right', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Mahedi+Hasan&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(42, 3, 'Soumya', 'Sarkar', 'ALL_ROUNDER', 59, NULL, 'Left', 'Right-arm medium fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Soumya+Sarkar&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(43, 3, 'Mushfiqur', 'Rahim', 'WK', 15, NULL, 'Right', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Mushfiqur+Rahim&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(44, 3, 'Litton', 'Das', 'WK', 16, NULL, 'Right', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Litton+Das&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(45, 3, 'Taskin', 'Ahmed', 'BOWL', 3, NULL, 'Left', 'Right-arm fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Taskin+Ahmed&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(46, 4, 'Bevon', 'Jacobs', 'BAT', 70, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Bevon+Jacobs&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(47, 4, 'Rhys', 'Mariu', 'BAT', 25, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Rhys+Mariu&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(48, 4, 'Henry', 'Nicholls', 'BAT', 86, NULL, 'Left-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Henry+Nicholls&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(49, 4, 'Tim', 'Robinson', 'BAT', 33, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Tim+Robinson&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(50, 4, 'Kane', 'Williamson', 'BAT', 22, NULL, 'Right-handed', 'Right-arm off spin', 0, 0.00, 'https://ui-avatars.com/api/?name=Kane+Williamson&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(51, 4, 'Will', 'Young', 'BAT', 32, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Will+Young&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(52, 4, 'Finn', 'Allen', 'BAT', 16, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Finn+Allen&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(53, 4, 'Michael', 'Bracewell', 'ALL_ROUNDER', 4, NULL, 'Left-handed', 'Right-arm off spin', 0, 0.00, 'https://ui-avatars.com/api/?name=Michael+Bracewell&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(54, 4, 'Mark', 'Chapman', 'ALL_ROUNDER', 80, NULL, 'Left-handed', 'Slow left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Mark+Chapman&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(55, 4, 'Zak', 'Foulkes', 'ALL_ROUNDER', 35, NULL, 'Right-handed', 'Right-arm medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Zak+Foulkes&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(56, 4, 'Daryl', 'Mitchell', 'ALL_ROUNDER', 75, NULL, 'Right-handed', 'Right-arm medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Daryl+Mitchell&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(57, 4, 'James', 'Neesham', 'ALL_ROUNDER', 50, NULL, 'Left-handed', 'Right-arm medium fast', 0, 0.00, 'https://ui-avatars.com/api/?name=James+Neesham&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(58, 4, 'Glenn', 'Phillips', 'ALL_ROUNDER', 23, NULL, 'Right-handed', 'Right-arm off spin', 0, 0.00, 'https://ui-avatars.com/api/?name=Glenn+Phillips&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(59, 4, 'Rachin', 'Ravindra', 'ALL_ROUNDER', 8, NULL, 'Left-handed', 'Slow left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Rachin+Ravindra&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(60, 4, 'Will', 'O\'Rourke', 'BOWL', 2, NULL, 'Right-handed', 'Right-arm fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Will+O%27Rourke&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(61, 5, 'Temba', 'Bavuma', 'BAT', 11, NULL, 'Right-handed', 'Right-arm medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Temba+Bavuma&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(62, 5, 'David', 'Bedingham', 'BAT', 5, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=David+Bedingham&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(63, 5, 'Matthew', 'Breetzke', 'BAT', 35, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Matthew+Breetzke&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(64, 5, 'Dewald', 'Brevis', 'BAT', 52, NULL, 'Right-handed', 'Right-arm leg break', 0, 0.00, 'https://ui-avatars.com/api/?name=Dewald+Brevis&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(65, 5, 'Tony', 'de Zorzi', 'BAT', 33, NULL, 'Left-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Tony+de+Zorzi&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(66, 5, 'Reeza', 'Hendricks', 'BAT', 17, NULL, 'Right-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Reeza+Hendricks&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(67, 5, 'Andile', 'Phehlukwayo', 'ALL_ROUNDER', 23, NULL, 'Left-handed', 'Right-arm medium-fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Andile+Phehlukwayo&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(68, 5, 'Quinton', 'de Kock', 'WK', 12, NULL, 'Left-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Quinton+de+Kock&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(69, 5, 'Ryan', 'Rickelton', 'WK', 44, NULL, 'Left-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Ryan+Rickelton&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(70, 5, 'Keshav', 'Maharaj', 'BOWL', 16, NULL, 'Right-handed', 'Left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Keshav+Maharaj&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(71, 5, 'Bjorn', 'Fortuin', 'BOWL', 77, NULL, 'Right-handed', 'Left-arm orthodox', 0, 0.00, 'https://ui-avatars.com/api/?name=Bjorn+Fortuin&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(72, 5, 'Simon', 'Harmer', 'BOWL', 47, NULL, 'Right-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Simon+Harmer&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(73, 5, 'Lungi', 'Ngidi', 'BOWL', 22, NULL, 'Right-handed', 'Right-arm fast-medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Lungi+Ngidi&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(74, 5, 'Kagiso', 'Rabada', 'BOWL', 25, NULL, 'Left-handed', 'Right-arm fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Kagiso+Rabada&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(75, 5, 'Lizaad', 'Williams', 'BOWL', 6, NULL, 'Left-handed', 'Right-arm medium-fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Lizaad+Williams&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(76, 6, 'Kevlon', 'Anderson', 'BAT', 73, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Kevlon+Anderson&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(77, 6, 'Jewel', 'Andrew', 'BAT', 15, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Jewel+Andrew&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(78, 6, 'Alick', 'Athanaze', 'BAT', 28, NULL, 'Left-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Alick+Athanaze&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(79, 6, 'Kraigg', 'Brathwaite', 'BAT', 11, NULL, 'Right-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Kraigg+Brathwaite&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(80, 6, 'John', 'Campbell', 'BAT', 32, NULL, 'Right-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=John+Campbell&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(81, 6, 'Brandon', 'King', 'BAT', 53, NULL, 'Right-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Brandon+King&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(82, 6, 'Evin', 'Lewis', 'BAT', 17, NULL, 'Left-handed', NULL, 0, 0.00, 'https://ui-avatars.com/api/?name=Evin+Lewis&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(83, 6, 'Rovman', 'Powell', 'BAT', 52, NULL, 'Right-handed', 'Right-arm medium-fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Rovman+Powell&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(84, 6, 'Sherfane', 'Rutherford', 'BAT', 50, NULL, 'Left-handed', 'Right-arm fast-medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Sherfane+Rutherford&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(85, 6, 'Roston', 'Chase', 'ALL_ROUNDER', 10, NULL, 'Right-handed', 'Right-arm off break', 0, 0.00, 'https://ui-avatars.com/api/?name=Roston+Chase&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(86, 6, 'Justin', 'Greaves', 'ALL_ROUNDER', 66, NULL, 'Right-handed', 'Right-arm medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Justin+Greaves&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(87, 6, 'Matthew', 'Forde', 'ALL_ROUNDER', 5, NULL, 'Right-handed', 'Right-arm medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Matthew+Forde&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(88, 6, 'Alzarri', 'Joseph', 'BOWL', 8, NULL, 'Right-handed', 'Right-arm fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Alzarri+Joseph&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(89, 6, 'Shamar', 'Joseph', 'BOWL', 70, NULL, 'Left-handed', 'Right-arm fast', 0, 0.00, 'https://ui-avatars.com/api/?name=Shamar+Joseph&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010'),
(90, 6, 'Jayden', 'Seales', 'BOWL', 33, NULL, 'Left-handed', 'Right-arm fast-medium', 0, 0.00, 'https://ui-avatars.com/api/?name=Jayden+Seales&size=256', 1, '2026-01-17 12:46:57.444010', '2026-01-17 12:46:57.444010');

-- --------------------------------------------------------

--
-- Table structure for table `pools`
--

CREATE TABLE `pools` (
  `id` int NOT NULL,
  `type_id` int NOT NULL,
  `pool_name` text COLLATE utf8mb4_general_ci NOT NULL,
  `team_id` int NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pools`
--

INSERT INTO `pools` (`id`, `type_id`, `pool_name`, `team_id`, `isActive`, `createdAt`) VALUES
(1, 1, 'A', 1, 1, '2026-01-17 12:06:18.528261'),
(2, 1, 'A', 3, 1, '2026-01-17 12:06:18.531264'),
(3, 1, 'A', 5, 1, '2026-01-17 12:06:18.532943'),
(4, 1, 'B', 2, 1, '2026-01-17 12:06:38.991693'),
(5, 1, 'B', 4, 1, '2026-01-17 12:06:38.993760'),
(6, 1, 'B', 6, 1, '2026-01-17 12:06:38.995946');

-- --------------------------------------------------------

--
-- Table structure for table `scoreboard_state`
--

CREATE TABLE `scoreboard_state` (
  `id` int NOT NULL,
  `matchId` int NOT NULL,
  `currentInningsId` int DEFAULT NULL,
  `strikerSquadId` int DEFAULT NULL,
  `nonStrikerSquadId` int DEFAULT NULL,
  `bowlerSquadId` int DEFAULT NULL,
  `currentOverNumber` int NOT NULL DEFAULT '0',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `total_run` int NOT NULL DEFAULT '0',
  `total_wickets` int NOT NULL DEFAULT '0',
  `total_extra` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scoreboard_state`
--

INSERT INTO `scoreboard_state` (`id`, `matchId`, `currentInningsId`, `strikerSquadId`, `nonStrikerSquadId`, `bowlerSquadId`, `currentOverNumber`, `updatedAt`, `total_run`, `total_wickets`, `total_extra`) VALUES
(1, 1, NULL, NULL, NULL, NULL, 0, '2026-02-21 13:24:55.081317', 0, 0, 6);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `shortName` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `logo` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `primaryColor` varchar(7) COLLATE utf8mb4_general_ci NOT NULL,
  `secondaryColor` varchar(7) COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `shortName`, `logo`, `primaryColor`, `secondaryColor`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Pakistan ', 'PAK', 'https://img.freepik.com/premium-vector/pakistan-national-flag-vector-illustration_1197690-140.jpg?semt=ais_hybrid&w=740&q=80', 'asda', 'sdfsfsf', 'active', '2026-01-15 12:29:49.000000', '2026-01-27 12:20:09.301967'),
(2, 'Australia', 'AUS', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Australia.svg/1280px-Flag_of_Australia.svg.png', 'dad', 'adada', 'active', '2026-01-15 12:29:49.000000', '2026-01-27 12:21:45.910428'),
(3, 'Bangladesh', 'BAN', 'https://cdn.britannica.com/67/6267-050-8A26DFEE/Flag-Bangladesh.jpg', 'asdad', 'adadad', 'active', '2026-01-15 12:31:09.000000', '2026-01-27 12:21:11.618421'),
(4, 'New Zealand', 'NZ', NULL, 'assa', 'asasas', 'active', '2026-01-15 12:31:09.000000', '2026-01-15 12:31:09.000000'),
(5, 'South Africa', 'SA', NULL, 'asa', 'assa', 'active', '2026-01-15 12:31:09.000000', '2026-01-15 12:31:09.000000'),
(6, 'West Indies', 'WI', NULL, 'assa', 'asas', 'active', '2026-01-15 12:31:09.000000', '2026-01-15 12:31:09.000000');

-- --------------------------------------------------------

--
-- Table structure for table `type`
--

CREATE TABLE `type` (
  `id` int NOT NULL,
  `compitition` int NOT NULL DEFAULT '1' COMMENT '1 = Tournament, 2 = Series',
  `name` text COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `type`
--

INSERT INTO `type` (`id`, `compitition`, `name`, `createdAt`) VALUES
(1, 1, 'Asia Cup 2026', '2026-01-15 12:26:25.621134');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role_id` int NOT NULL,
  `currentJwtSecret` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `role_id`, `currentJwtSecret`, `role_name`, `created_at`, `updated_at`) VALUES
(1, 'muhammadmurad63', '$2b$10$65pYo.D/E4Btkd9fP0gM5eQFJkwERdwas4GG6A3mb0GacMafs/W5a', 1, NULL, '', '2026-04-05 17:10:56.906016', '2026-04-12 13:02:43.920367');

-- --------------------------------------------------------

--
-- Table structure for table `wickets`
--

CREATE TABLE `wickets` (
  `id` int NOT NULL,
  `inningsId` int NOT NULL,
  `type` enum('BOWLED','CAUGHT','LBW','RUN_OUT','STUMPED','HIT_WICKET','RETIRED_HURT','TIMED_OUT') COLLATE utf8mb4_general_ci NOT NULL,
  `outBatsmanSquadId` int NOT NULL,
  `creditedBowlerSquadId` int DEFAULT NULL,
  `fielder1SquadId` int DEFAULT NULL,
  `isBowlerWicket` tinyint NOT NULL DEFAULT '1',
  `outEnd` enum('STRIKER','NON_STRIKER','UNKNOWN') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'UNKNOWN',
  `causedByDeliverySeq` int DEFAULT NULL,
  `teamScore` int DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UQ_deliveries_innings_seq` (`inningsId`,`seq`),
  ADD KEY `IDX_921881e1b20fa55da7e2bb0c66` (`inningsId`),
  ADD KEY `IDX_2f42bf09fdbb18390243f70b34` (`strikerSquadId`),
  ADD KEY `IDX_22bd7bea901404a28a9bd36203` (`nonStrikerSquadId`),
  ADD KEY `IDX_650a3a106082fac4ba8de91582` (`bowlerSquadId`),
  ADD KEY `IDX_deliveries_innings_over` (`inningsId`,`overNumber`);

--
-- Indexes for table `innings`
--
ALTER TABLE `innings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UQ_innings_match_number` (`matchId`,`number`),
  ADD KEY `IDX_innings_match` (`matchId`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `match_batting`
--
ALTER TABLE `match_batting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `match_squad`
--
ALTER TABLE `match_squad`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UQ_match_squad_match_player` (`matchId`,`playerId`),
  ADD KEY `IDX_match_squad_player` (`playerId`),
  ADD KEY `IDX_match_squad_team` (`teamId`),
  ADD KEY `IDX_match_squad_match` (`matchId`),
  ADD KEY `IDX_match_squad_match_team` (`matchId`,`teamId`);

--
-- Indexes for table `over_summary`
--
ALTER TABLE `over_summary`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_9741a74dd1fa5615eb0a468ac0` (`matchId`,`inningsId`,`overNumber`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UQ_players_team_shirt` (`teamId`,`shirtNo`),
  ADD KEY `IDX_players_teamId` (`teamId`);

--
-- Indexes for table `pools`
--
ALTER TABLE `pools`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scoreboard_state`
--
ALTER TABLE `scoreboard_state`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_c0d6cc1eb52597cdb2e0a2bab4` (`matchId`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UQ_team_shortName` (`shortName`),
  ADD KEY `IDX_48c0c32e6247a2de155baeaf98` (`name`),
  ADD KEY `IDX_6fc4138ae0ee869dc10ae6de26` (`shortName`);

--
-- Indexes for table `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`);

--
-- Indexes for table `wickets`
--
ALTER TABLE `wickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_wickets_innings` (`inningsId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `innings`
--
ALTER TABLE `innings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `match_batting`
--
ALTER TABLE `match_batting`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `match_squad`
--
ALTER TABLE `match_squad`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=257;

--
-- AUTO_INCREMENT for table `over_summary`
--
ALTER TABLE `over_summary`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `pools`
--
ALTER TABLE `pools`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `scoreboard_state`
--
ALTER TABLE `scoreboard_state`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `type`
--
ALTER TABLE `type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `wickets`
--
ALTER TABLE `wickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
