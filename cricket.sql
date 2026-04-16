SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

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

CREATE TABLE IF NOT EXISTS `deliveries` (
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

CREATE TABLE IF NOT EXISTS `innings` (
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

CREATE TABLE IF NOT EXISTS `matches` (
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

REPLACE INTO `matches` (`id`, `title`, `format`, `poolId`, `team1Id`, `team2Id`, `venue`, `startTime`, `status`, `oversLimit`, `ballsPerOver`, `tossWinnerTeamId`, `tossDecision`, `winnerTeamId`, `resultText`, `createdAt`, `updatedAt`) VALUES
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

CREATE TABLE IF NOT EXISTS `match_batting` (
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

CREATE TABLE IF NOT EXISTS `match_squad` (
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

REPLACE INTO `match_squad` (`id`, `matchId`, `teamId`, `playerId`, `isPlayingXI`, `isCaptain`, `isWicketKeeper`, `battingPos`, `isActive`, `isViceCaptain`) VALUES
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

CREATE TABLE IF NOT EXISTS `over_summary` (
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

CREATE TABLE IF NOT EXISTS `players` (
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

REPLACE INTO `players` (`id`, `teamId`, `first_name`, `last_name`, `role`, `shirtNo`, `dateOfBirth`, `battingStyle`, `bowlingStyle`, `no_of_matches`, `strike_rate`, `image`, `isActive`, `createdAt`, `updatedAt`) VALUES
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

CREATE TABLE IF NOT EXISTS `pools` (
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

REPLACE INTO `pools` (`id`, `type_id`, `pool_name`, `team_id`, `isActive`, `createdAt`) VALUES
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

CREATE TABLE IF NOT EXISTS `scoreboard_state` (
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

REPLACE INTO `scoreboard_state` (`id`, `matchId`, `currentInningsId`, `strikerSquadId`, `nonStrikerSquadId`, `bowlerSquadId`, `currentOverNumber`, `updatedAt`, `total_run`, `total_wickets`, `total_extra`) VALUES
(1, 1, NULL, NULL, NULL, NULL, 0, '2026-02-21 13:24:55.081317', 0, 0, 6);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE IF NOT EXISTS `teams` (
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

REPLACE INTO `teams` (`id`, `name`, `shortName`, `logo`, `primaryColor`, `secondaryColor`, `status`, `createdAt`, `updatedAt`) VALUES
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

CREATE TABLE IF NOT EXISTS `type` (
  `id` int NOT NULL,
  `compitition` int NOT NULL DEFAULT '1' COMMENT '1 = Tournament, 2 = Series',
  `name` text COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `type`
--

REPLACE INTO `type` (`id`, `compitition`, `name`, `createdAt`) VALUES
(1, 1, 'Asia Cup 2026', '2026-01-15 12:26:25.621134');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
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

REPLACE INTO `user` (`id`, `username`, `password`, `role_id`, `currentJwtSecret`, `role_name`, `created_at`, `updated_at`) VALUES
(1, 'muhammadmurad63', '$2b$10$65pYo.D/E4Btkd9fP0gM5eQFJkwERdwas4GG6A3mb0GacMafs/W5a', 1, NULL, '', '2026-04-05 17:10:56.906016', '2026-04-12 13:02:43.920367');

-- --------------------------------------------------------

--
-- Table structure for table `wickets`
--

CREATE TABLE IF NOT EXISTS `wickets` (
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

-- --- MOCK MATCH DATA ---
REPLACE INTO `matches` (`id`, `title`, `format`, `poolId`, `team1Id`, `team2Id`, `venue`, `startTime`, `status`, `oversLimit`) VALUES
(1, 'PAK vs BAN - Dubai', 'T20', 1, 1, 3, 'Dubai', '2026-04-16 14:00:00', 'FINISHED', 20),
(2, 'PAK vs SA - Dubai', 'T20', 1, 1, 5, 'Dubai', '2026-04-17 14:00:00', 'FINISHED', 20),
(3, 'BAN vs SA - Dubai', 'T20', 1, 3, 5, 'Dubai', '2026-04-18 14:00:00', 'LIVE', 20);
REPLACE INTO `innings` (`id`, `matchId`, `number`, `battingTeamId`, `bowlingTeamId`, `isActive`) VALUES
(1, 1, 'FIRST', 1, 3, 0),
(2, 1, 'SECOND', 3, 1, 0),
(3, 2, 'FIRST', 1, 5, 0),
(4, 2, 'SECOND', 5, 1, 0),
(5, 3, 'FIRST', 3, 5, 1);
REPLACE INTO scoreboard_state (matchId, currentInningsId, strikerSquadId, nonStrikerSquadId, bowlerSquadId, currentOverNumber, total_run, total_wickets) VALUES (1, 1, 1, 2, 45, 20, 221, 4);
REPLACE INTO scoreboard_state (matchId, currentInningsId, strikerSquadId, nonStrikerSquadId, bowlerSquadId, currentOverNumber, total_run, total_wickets) VALUES (1, 2, 31, 32, 15, 20, 246, 7);
REPLACE INTO scoreboard_state (matchId, currentInningsId, strikerSquadId, nonStrikerSquadId, bowlerSquadId, currentOverNumber, total_run, total_wickets) VALUES (2, 3, 1, 2, 75, 20, 242, 7);
REPLACE INTO scoreboard_state (matchId, currentInningsId, strikerSquadId, nonStrikerSquadId, bowlerSquadId, currentOverNumber, total_run, total_wickets) VALUES (2, 4, 61, 62, 15, 20, 237, 13);
REPLACE INTO scoreboard_state (matchId, currentInningsId, strikerSquadId, nonStrikerSquadId, bowlerSquadId, currentOverNumber, total_run, total_wickets) VALUES (3, 5, 31, 32, 75, 10, 141, 5);
REPLACE INTO `deliveries` (`inningsId`, `seq`, `overNumber`, `ballIndex`, `kind`, `isLegal`, `strikerSquadId`, `nonStrikerSquadId`, `bowlerSquadId`, `runsOffBat`, `wideRuns`, `noBallRuns`, `byeRuns`, `legByeRuns`, `penaltyRuns`, `total_runs`) VALUES
(1, 1, 0, 1, 'RUN', 1, 1, 2, 45, 3, 0, 0, 0, 0, 0, 3),
(1, 2, 0, 2, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 3, 0, 3, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 4, 0, 4, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 5, 0, 5, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 6, 0, 6, 'RUN', 1, 1, 2, 45, 4, 0, 0, 0, 0, 0, 4),
(1, 7, 1, 1, 'RUN', 1, 1, 2, 41, 4, 0, 0, 0, 0, 0, 4),
(1, 8, 1, 2, 'RUN', 1, 1, 2, 41, 2, 0, 0, 0, 0, 0, 2),
(1, 9, 1, 3, 'RUN', 1, 1, 2, 41, 3, 0, 0, 0, 0, 0, 3),
(1, 10, 1, 4, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 11, 1, 5, 'RUN', 1, 1, 2, 41, 2, 0, 0, 0, 0, 0, 2),
(1, 12, 1, 6, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 13, 2, 1, 'RUN', 1, 1, 2, 40, 1, 0, 0, 0, 0, 0, 1),
(1, 14, 2, 2, 'RUN', 1, 1, 2, 40, 4, 0, 0, 0, 0, 0, 4),
(1, 15, 2, 3, 'RUN', 1, 1, 2, 40, 4, 0, 0, 0, 0, 0, 4),
(1, 16, 2, 4, 'RUN', 1, 1, 2, 40, 3, 0, 0, 0, 0, 0, 3),
(1, 17, 2, 5, 'RUN', 1, 1, 2, 40, 1, 0, 0, 0, 0, 0, 1),
(1, 18, 2, 6, 'RUN', 1, 1, 2, 40, 2, 0, 0, 0, 0, 0, 2),
(1, 19, 3, 1, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 20, 3, 2, 'RUN', 1, 1, 2, 45, 4, 0, 0, 0, 0, 0, 4),
(1, 21, 3, 3, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 22, 3, 4, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 23, 3, 5, 'RUN', 1, 1, 2, 45, 0, 0, 0, 0, 0, 0, 0),
(1, 24, 3, 6, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 25, 4, 1, 'RUN', 1, 1, 2, 41, 3, 0, 0, 0, 0, 0, 3),
(1, 26, 4, 2, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 27, 4, 3, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 28, 4, 4, 'RUN', 1, 1, 2, 41, 2, 0, 0, 0, 0, 0, 2),
(1, 29, 4, 5, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 30, 4, 6, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 31, 5, 1, 'RUN', 1, 1, 2, 40, 0, 0, 0, 0, 0, 0, 0),
(1, 32, 5, 2, 'RUN', 1, 1, 2, 40, 1, 0, 0, 0, 0, 0, 1),
(1, 33, 5, 3, 'RUN', 1, 1, 2, 40, 3, 0, 0, 0, 0, 0, 3),
(1, 34, 5, 4, 'RUN', 1, 1, 2, 40, 4, 0, 0, 0, 0, 0, 4),
(1, 35, 5, 5, 'RUN', 1, 1, 2, 40, 0, 0, 0, 0, 0, 0, 0),
(1, 36, 5, 6, 'RUN', 1, 1, 2, 40, 3, 0, 0, 0, 0, 0, 3),
(1, 37, 6, 1, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 38, 6, 2, 'RUN', 1, 1, 2, 45, 4, 0, 0, 0, 0, 0, 4),
(1, 39, 6, 3, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 40, 6, 4, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 41, 6, 5, 'RUN', 1, 1, 2, 45, 0, 0, 0, 0, 0, 0, 0),
(1, 42, 6, 6, 'RUN', 1, 1, 2, 45, 0, 0, 0, 0, 0, 0, 0),
(1, 43, 7, 1, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 44, 7, 2, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 45, 7, 3, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 46, 7, 4, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 47, 7, 5, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 48, 7, 6, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 49, 8, 1, 'RUN', 1, 1, 2, 40, 0, 0, 0, 0, 0, 0, 0),
(1, 50, 8, 2, 'RUN', 1, 1, 2, 40, 4, 0, 0, 0, 0, 0, 4),
(1, 51, 8, 3, 'RUN', 1, 1, 2, 40, 4, 0, 0, 0, 0, 0, 4),
(1, 52, 8, 4, 'RUN', 1, 1, 2, 40, 0, 0, 0, 0, 0, 0, 0),
(1, 53, 8, 5, 'RUN', 1, 1, 2, 40, 1, 0, 0, 0, 0, 0, 1),
(1, 54, 8, 6, 'RUN', 1, 1, 2, 40, 1, 0, 0, 0, 0, 0, 1),
(1, 55, 9, 1, 'RUN', 1, 1, 2, 45, 0, 0, 0, 0, 0, 0, 0),
(1, 56, 9, 2, 'RUN', 1, 1, 2, 45, 3, 0, 0, 0, 0, 0, 3),
(1, 57, 9, 3, 'RUN', 1, 1, 2, 45, 4, 0, 0, 0, 0, 0, 4),
(1, 58, 9, 4, 'RUN', 1, 1, 2, 45, 3, 0, 0, 0, 0, 0, 3),
(1, 59, 9, 5, 'RUN', 1, 1, 2, 45, 0, 0, 0, 0, 0, 0, 0),
(1, 60, 9, 6, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 61, 10, 1, 'RUN', 1, 1, 2, 41, 2, 0, 0, 0, 0, 0, 2),
(1, 62, 10, 2, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 63, 10, 3, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 64, 10, 4, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 65, 10, 5, 'RUN', 1, 1, 2, 41, 2, 0, 0, 0, 0, 0, 2),
(1, 66, 10, 6, 'RUN', 1, 1, 2, 41, 2, 0, 0, 0, 0, 0, 2),
(1, 67, 11, 1, 'RUN', 1, 1, 2, 40, 4, 0, 0, 0, 0, 0, 4),
(1, 68, 11, 2, 'RUN', 1, 1, 2, 40, 0, 0, 0, 0, 0, 0, 0),
(1, 69, 11, 3, 'RUN', 1, 1, 2, 40, 2, 0, 0, 0, 0, 0, 2),
(1, 70, 11, 4, 'RUN', 1, 1, 2, 40, 2, 0, 0, 0, 0, 0, 2),
(1, 71, 11, 5, 'RUN', 1, 1, 2, 40, 2, 0, 0, 0, 0, 0, 2),
(1, 72, 11, 6, 'RUN', 1, 1, 2, 40, 0, 0, 0, 0, 0, 0, 0),
(1, 73, 12, 1, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 74, 12, 2, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 75, 12, 3, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 76, 12, 4, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 77, 12, 5, 'RUN', 1, 1, 2, 45, 4, 0, 0, 0, 0, 0, 4),
(1, 78, 12, 6, 'RUN', 1, 1, 2, 45, 0, 0, 0, 0, 0, 0, 0),
(1, 79, 13, 1, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 80, 13, 2, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 81, 13, 3, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 82, 13, 4, 'RUN', 1, 1, 2, 41, 2, 0, 0, 0, 0, 0, 2),
(1, 83, 13, 5, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 84, 13, 6, 'RUN', 1, 1, 2, 41, 1, 0, 0, 0, 0, 0, 1),
(1, 85, 14, 1, 'RUN', 1, 1, 2, 40, 2, 0, 0, 0, 0, 0, 2),
(1, 86, 14, 2, 'RUN', 1, 1, 2, 40, 1, 0, 0, 0, 0, 0, 1),
(1, 87, 14, 3, 'RUN', 1, 1, 2, 40, 2, 0, 0, 0, 0, 0, 2),
(1, 88, 14, 4, 'RUN', 1, 1, 2, 40, 2, 0, 0, 0, 0, 0, 2),
(1, 89, 14, 5, 'RUN', 1, 1, 2, 40, 2, 0, 0, 0, 0, 0, 2),
(1, 90, 14, 6, 'RUN', 1, 1, 2, 40, 0, 0, 0, 0, 0, 0, 0),
(1, 91, 15, 1, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 92, 15, 2, 'RUN', 1, 1, 2, 45, 4, 0, 0, 0, 0, 0, 4),
(1, 93, 15, 3, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 94, 15, 4, 'RUN', 1, 1, 2, 45, 2, 0, 0, 0, 0, 0, 2),
(1, 95, 15, 5, 'RUN', 1, 1, 2, 45, 4, 0, 0, 0, 0, 0, 4),
(1, 96, 15, 6, 'RUN', 1, 1, 2, 45, 3, 0, 0, 0, 0, 0, 3),
(1, 97, 16, 1, 'RUN', 1, 1, 2, 41, 4, 0, 0, 0, 0, 0, 4),
(1, 98, 16, 2, 'RUN', 1, 1, 2, 41, 4, 0, 0, 0, 0, 0, 4),
(1, 99, 16, 3, 'RUN', 1, 1, 2, 41, 3, 0, 0, 0, 0, 0, 3),
(1, 100, 16, 4, 'RUN', 1, 1, 2, 41, 4, 0, 0, 0, 0, 0, 4),
(1, 101, 16, 5, 'RUN', 1, 1, 2, 41, 3, 0, 0, 0, 0, 0, 3),
(1, 102, 16, 6, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 103, 17, 1, 'RUN', 1, 1, 2, 40, 4, 0, 0, 0, 0, 0, 4),
(1, 104, 17, 2, 'RUN', 1, 1, 2, 40, 3, 0, 0, 0, 0, 0, 3),
(1, 105, 17, 3, 'RUN', 1, 1, 2, 40, 3, 0, 0, 0, 0, 0, 3),
(1, 106, 17, 4, 'RUN', 1, 1, 2, 40, 1, 0, 0, 0, 0, 0, 1),
(1, 107, 17, 5, 'RUN', 1, 1, 2, 40, 0, 0, 0, 0, 0, 0, 0),
(1, 108, 17, 6, 'RUN', 1, 1, 2, 40, 2, 0, 0, 0, 0, 0, 2),
(1, 109, 18, 1, 'RUN', 1, 1, 2, 45, 3, 0, 0, 0, 0, 0, 3),
(1, 110, 18, 2, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 111, 18, 3, 'RUN', 1, 1, 2, 45, 4, 0, 0, 0, 0, 0, 4),
(1, 112, 18, 4, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 113, 18, 5, 'RUN', 1, 1, 2, 45, 3, 0, 0, 0, 0, 0, 3),
(1, 114, 18, 6, 'RUN', 1, 1, 2, 45, 1, 0, 0, 0, 0, 0, 1),
(1, 115, 19, 1, 'RUN', 1, 1, 2, 41, 2, 0, 0, 0, 0, 0, 2),
(1, 116, 19, 2, 'RUN', 1, 1, 2, 41, 2, 0, 0, 0, 0, 0, 2),
(1, 117, 19, 3, 'RUN', 1, 1, 2, 41, 4, 0, 0, 0, 0, 0, 4),
(1, 118, 19, 4, 'RUN', 1, 1, 2, 41, 3, 0, 0, 0, 0, 0, 3),
(1, 119, 19, 5, 'RUN', 1, 1, 2, 41, 0, 0, 0, 0, 0, 0, 0),
(1, 120, 19, 6, 'RUN', 1, 1, 2, 41, 4, 0, 0, 0, 0, 0, 4),
(2, 1, 0, 1, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 2, 0, 2, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 3, 0, 3, 'RUN', 1, 31, 32, 15, 2, 0, 0, 0, 0, 0, 2),
(2, 4, 0, 4, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 5, 0, 5, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 6, 0, 6, 'RUN', 1, 31, 32, 15, 4, 0, 0, 0, 0, 0, 4),
(2, 7, 1, 1, 'RUN', 1, 31, 32, 12, 1, 0, 0, 0, 0, 0, 1),
(2, 8, 1, 2, 'RUN', 1, 31, 32, 12, 3, 0, 0, 0, 0, 0, 3),
(2, 9, 1, 3, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 10, 1, 4, 'RUN', 1, 31, 32, 12, 0, 0, 0, 0, 0, 0, 0),
(2, 11, 1, 5, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 12, 1, 6, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 13, 2, 1, 'RUN', 1, 31, 32, 11, 4, 0, 0, 0, 0, 0, 4),
(2, 14, 2, 2, 'RUN', 1, 31, 32, 11, 4, 0, 0, 0, 0, 0, 4),
(2, 15, 2, 3, 'RUN', 1, 31, 32, 11, 3, 0, 0, 0, 0, 0, 3),
(2, 16, 2, 4, 'RUN', 1, 31, 32, 11, 1, 0, 0, 0, 0, 0, 1),
(2, 17, 2, 5, 'RUN', 1, 31, 32, 11, 4, 0, 0, 0, 0, 0, 4),
(2, 18, 2, 6, 'RUN', 1, 31, 32, 11, 0, 0, 0, 0, 0, 0, 0),
(2, 19, 3, 1, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 20, 3, 2, 'RUN', 1, 31, 32, 15, 4, 0, 0, 0, 0, 0, 4),
(2, 21, 3, 3, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 22, 3, 4, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 23, 3, 5, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 24, 3, 6, 'RUN', 1, 31, 32, 15, 4, 0, 0, 0, 0, 0, 4),
(2, 25, 4, 1, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 26, 4, 2, 'RUN', 1, 31, 32, 12, 2, 0, 0, 0, 0, 0, 2),
(2, 27, 4, 3, 'RUN', 1, 31, 32, 12, 1, 0, 0, 0, 0, 0, 1),
(2, 28, 4, 4, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 29, 4, 5, 'RUN', 1, 31, 32, 12, 0, 0, 0, 0, 0, 0, 0),
(2, 30, 4, 6, 'RUN', 1, 31, 32, 12, 1, 0, 0, 0, 0, 0, 1),
(2, 31, 5, 1, 'RUN', 1, 31, 32, 11, 3, 0, 0, 0, 0, 0, 3),
(2, 32, 5, 2, 'RUN', 1, 31, 32, 11, 3, 0, 0, 0, 0, 0, 3),
(2, 33, 5, 3, 'RUN', 1, 31, 32, 11, 1, 0, 0, 0, 0, 0, 1),
(2, 34, 5, 4, 'RUN', 1, 31, 32, 11, 0, 0, 0, 0, 0, 0, 0),
(2, 35, 5, 5, 'RUN', 1, 31, 32, 11, 1, 0, 0, 0, 0, 0, 1),
(2, 36, 5, 6, 'RUN', 1, 31, 32, 11, 1, 0, 0, 0, 0, 0, 1),
(2, 37, 6, 1, 'RUN', 1, 31, 32, 15, 2, 0, 0, 0, 0, 0, 2),
(2, 38, 6, 2, 'RUN', 1, 31, 32, 15, 0, 0, 0, 0, 0, 0, 0),
(2, 39, 6, 3, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 40, 6, 4, 'RUN', 1, 31, 32, 15, 0, 0, 0, 0, 0, 0, 0),
(2, 41, 6, 5, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 42, 6, 6, 'RUN', 1, 31, 32, 15, 0, 0, 0, 0, 0, 0, 0),
(2, 43, 7, 1, 'RUN', 1, 31, 32, 12, 0, 0, 0, 0, 0, 0, 0),
(2, 44, 7, 2, 'RUN', 1, 31, 32, 12, 3, 0, 0, 0, 0, 0, 3),
(2, 45, 7, 3, 'RUN', 1, 31, 32, 12, 2, 0, 0, 0, 0, 0, 2),
(2, 46, 7, 4, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 47, 7, 5, 'RUN', 1, 31, 32, 12, 2, 0, 0, 0, 0, 0, 2),
(2, 48, 7, 6, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 49, 8, 1, 'RUN', 1, 31, 32, 11, 0, 0, 0, 0, 0, 0, 0),
(2, 50, 8, 2, 'RUN', 1, 31, 32, 11, 4, 0, 0, 0, 0, 0, 4),
(2, 51, 8, 3, 'RUN', 1, 31, 32, 11, 1, 0, 0, 0, 0, 0, 1),
(2, 52, 8, 4, 'RUN', 1, 31, 32, 11, 1, 0, 0, 0, 0, 0, 1),
(2, 53, 8, 5, 'RUN', 1, 31, 32, 11, 3, 0, 0, 0, 0, 0, 3),
(2, 54, 8, 6, 'RUN', 1, 31, 32, 11, 4, 0, 0, 0, 0, 0, 4),
(2, 55, 9, 1, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 56, 9, 2, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 57, 9, 3, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 58, 9, 4, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 59, 9, 5, 'RUN', 1, 31, 32, 15, 0, 0, 0, 0, 0, 0, 0),
(2, 60, 9, 6, 'RUN', 1, 31, 32, 15, 2, 0, 0, 0, 0, 0, 2),
(2, 61, 10, 1, 'RUN', 1, 31, 32, 12, 1, 0, 0, 0, 0, 0, 1),
(2, 62, 10, 2, 'RUN', 1, 31, 32, 12, 2, 0, 0, 0, 0, 0, 2),
(2, 63, 10, 3, 'RUN', 1, 31, 32, 12, 2, 0, 0, 0, 0, 0, 2),
(2, 64, 10, 4, 'RUN', 1, 31, 32, 12, 0, 0, 0, 0, 0, 0, 0),
(2, 65, 10, 5, 'RUN', 1, 31, 32, 12, 2, 0, 0, 0, 0, 0, 2),
(2, 66, 10, 6, 'RUN', 1, 31, 32, 12, 0, 0, 0, 0, 0, 0, 0),
(2, 67, 11, 1, 'RUN', 1, 31, 32, 11, 0, 0, 0, 0, 0, 0, 0),
(2, 68, 11, 2, 'RUN', 1, 31, 32, 11, 3, 0, 0, 0, 0, 0, 3),
(2, 69, 11, 3, 'RUN', 1, 31, 32, 11, 4, 0, 0, 0, 0, 0, 4),
(2, 70, 11, 4, 'RUN', 1, 31, 32, 11, 3, 0, 0, 0, 0, 0, 3),
(2, 71, 11, 5, 'RUN', 1, 31, 32, 11, 1, 0, 0, 0, 0, 0, 1),
(2, 72, 11, 6, 'RUN', 1, 31, 32, 11, 0, 0, 0, 0, 0, 0, 0),
(2, 73, 12, 1, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 74, 12, 2, 'RUN', 1, 31, 32, 15, 2, 0, 0, 0, 0, 0, 2),
(2, 75, 12, 3, 'RUN', 1, 31, 32, 15, 4, 0, 0, 0, 0, 0, 4),
(2, 76, 12, 4, 'RUN', 1, 31, 32, 15, 2, 0, 0, 0, 0, 0, 2),
(2, 77, 12, 5, 'RUN', 1, 31, 32, 15, 2, 0, 0, 0, 0, 0, 2),
(2, 78, 12, 6, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 79, 13, 1, 'RUN', 1, 31, 32, 12, 3, 0, 0, 0, 0, 0, 3),
(2, 80, 13, 2, 'RUN', 1, 31, 32, 12, 2, 0, 0, 0, 0, 0, 2),
(2, 81, 13, 3, 'RUN', 1, 31, 32, 12, 3, 0, 0, 0, 0, 0, 3),
(2, 82, 13, 4, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 83, 13, 5, 'RUN', 1, 31, 32, 12, 3, 0, 0, 0, 0, 0, 3),
(2, 84, 13, 6, 'RUN', 1, 31, 32, 12, 1, 0, 0, 0, 0, 0, 1),
(2, 85, 14, 1, 'RUN', 1, 31, 32, 11, 3, 0, 0, 0, 0, 0, 3),
(2, 86, 14, 2, 'RUN', 1, 31, 32, 11, 0, 0, 0, 0, 0, 0, 0),
(2, 87, 14, 3, 'RUN', 1, 31, 32, 11, 4, 0, 0, 0, 0, 0, 4),
(2, 88, 14, 4, 'RUN', 1, 31, 32, 11, 2, 0, 0, 0, 0, 0, 2),
(2, 89, 14, 5, 'RUN', 1, 31, 32, 11, 2, 0, 0, 0, 0, 0, 2),
(2, 90, 14, 6, 'RUN', 1, 31, 32, 11, 0, 0, 0, 0, 0, 0, 0),
(2, 91, 15, 1, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 92, 15, 2, 'RUN', 1, 31, 32, 15, 4, 0, 0, 0, 0, 0, 4),
(2, 93, 15, 3, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 94, 15, 4, 'RUN', 1, 31, 32, 15, 2, 0, 0, 0, 0, 0, 2),
(2, 95, 15, 5, 'RUN', 1, 31, 32, 15, 0, 0, 0, 0, 0, 0, 0),
(2, 96, 15, 6, 'RUN', 1, 31, 32, 15, 4, 0, 0, 0, 0, 0, 4),
(2, 97, 16, 1, 'RUN', 1, 31, 32, 12, 0, 0, 0, 0, 0, 0, 0),
(2, 98, 16, 2, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 99, 16, 3, 'RUN', 1, 31, 32, 12, 0, 0, 0, 0, 0, 0, 0),
(2, 100, 16, 4, 'RUN', 1, 31, 32, 12, 3, 0, 0, 0, 0, 0, 3),
(2, 101, 16, 5, 'RUN', 1, 31, 32, 12, 0, 0, 0, 0, 0, 0, 0),
(2, 102, 16, 6, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 103, 17, 1, 'RUN', 1, 31, 32, 11, 0, 0, 0, 0, 0, 0, 0),
(2, 104, 17, 2, 'RUN', 1, 31, 32, 11, 3, 0, 0, 0, 0, 0, 3),
(2, 105, 17, 3, 'RUN', 1, 31, 32, 11, 2, 0, 0, 0, 0, 0, 2),
(2, 106, 17, 4, 'RUN', 1, 31, 32, 11, 4, 0, 0, 0, 0, 0, 4),
(2, 107, 17, 5, 'RUN', 1, 31, 32, 11, 1, 0, 0, 0, 0, 0, 1),
(2, 108, 17, 6, 'RUN', 1, 31, 32, 11, 2, 0, 0, 0, 0, 0, 2),
(2, 109, 18, 1, 'RUN', 1, 31, 32, 15, 4, 0, 0, 0, 0, 0, 4),
(2, 110, 18, 2, 'RUN', 1, 31, 32, 15, 2, 0, 0, 0, 0, 0, 2),
(2, 111, 18, 3, 'RUN', 1, 31, 32, 15, 0, 0, 0, 0, 0, 0, 0),
(2, 112, 18, 4, 'RUN', 1, 31, 32, 15, 1, 0, 0, 0, 0, 0, 1),
(2, 113, 18, 5, 'RUN', 1, 31, 32, 15, 0, 0, 0, 0, 0, 0, 0),
(2, 114, 18, 6, 'RUN', 1, 31, 32, 15, 3, 0, 0, 0, 0, 0, 3),
(2, 115, 19, 1, 'RUN', 1, 31, 32, 12, 0, 0, 0, 0, 0, 0, 0),
(2, 116, 19, 2, 'RUN', 1, 31, 32, 12, 2, 0, 0, 0, 0, 0, 2),
(2, 117, 19, 3, 'RUN', 1, 31, 32, 12, 2, 0, 0, 0, 0, 0, 2),
(2, 118, 19, 4, 'RUN', 1, 31, 32, 12, 1, 0, 0, 0, 0, 0, 1),
(2, 119, 19, 5, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(2, 120, 19, 6, 'RUN', 1, 31, 32, 12, 4, 0, 0, 0, 0, 0, 4),
(3, 1, 0, 1, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 2, 0, 2, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 3, 0, 3, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 4, 0, 4, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 5, 0, 5, 'RUN', 1, 1, 2, 75, 2, 0, 0, 0, 0, 0, 2),
(3, 6, 0, 6, 'RUN', 1, 1, 2, 75, 0, 0, 0, 0, 0, 0, 0),
(3, 7, 1, 1, 'RUN', 1, 1, 2, 73, 2, 0, 0, 0, 0, 0, 2),
(3, 8, 1, 2, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 9, 1, 3, 'RUN', 1, 1, 2, 73, 4, 0, 0, 0, 0, 0, 4),
(3, 10, 1, 4, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 11, 1, 5, 'RUN', 1, 1, 2, 73, 3, 0, 0, 0, 0, 0, 3),
(3, 12, 1, 6, 'RUN', 1, 1, 2, 73, 0, 0, 0, 0, 0, 0, 0),
(3, 13, 2, 1, 'RUN', 1, 1, 2, 70, 4, 0, 0, 0, 0, 0, 4),
(3, 14, 2, 2, 'RUN', 1, 1, 2, 70, 1, 0, 0, 0, 0, 0, 1),
(3, 15, 2, 3, 'RUN', 1, 1, 2, 70, 2, 0, 0, 0, 0, 0, 2),
(3, 16, 2, 4, 'RUN', 1, 1, 2, 70, 4, 0, 0, 0, 0, 0, 4),
(3, 17, 2, 5, 'RUN', 1, 1, 2, 70, 4, 0, 0, 0, 0, 0, 4),
(3, 18, 2, 6, 'RUN', 1, 1, 2, 70, 3, 0, 0, 0, 0, 0, 3),
(3, 19, 3, 1, 'RUN', 1, 1, 2, 75, 2, 0, 0, 0, 0, 0, 2),
(3, 20, 3, 2, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 21, 3, 3, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 22, 3, 4, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 23, 3, 5, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 24, 3, 6, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 25, 4, 1, 'RUN', 1, 1, 2, 73, 2, 0, 0, 0, 0, 0, 2),
(3, 26, 4, 2, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 27, 4, 3, 'RUN', 1, 1, 2, 73, 4, 0, 0, 0, 0, 0, 4),
(3, 28, 4, 4, 'RUN', 1, 1, 2, 73, 3, 0, 0, 0, 0, 0, 3),
(3, 29, 4, 5, 'RUN', 1, 1, 2, 73, 0, 0, 0, 0, 0, 0, 0),
(3, 30, 4, 6, 'RUN', 1, 1, 2, 73, 2, 0, 0, 0, 0, 0, 2),
(3, 31, 5, 1, 'RUN', 1, 1, 2, 70, 3, 0, 0, 0, 0, 0, 3),
(3, 32, 5, 2, 'RUN', 1, 1, 2, 70, 4, 0, 0, 0, 0, 0, 4),
(3, 33, 5, 3, 'RUN', 1, 1, 2, 70, 4, 0, 0, 0, 0, 0, 4),
(3, 34, 5, 4, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 35, 5, 5, 'RUN', 1, 1, 2, 70, 3, 0, 0, 0, 0, 0, 3),
(3, 36, 5, 6, 'RUN', 1, 1, 2, 70, 2, 0, 0, 0, 0, 0, 2),
(3, 37, 6, 1, 'RUN', 1, 1, 2, 75, 2, 0, 0, 0, 0, 0, 2),
(3, 38, 6, 2, 'RUN', 1, 1, 2, 75, 2, 0, 0, 0, 0, 0, 2),
(3, 39, 6, 3, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 40, 6, 4, 'RUN', 1, 1, 2, 75, 2, 0, 0, 0, 0, 0, 2),
(3, 41, 6, 5, 'RUN', 1, 1, 2, 75, 0, 0, 0, 0, 0, 0, 0),
(3, 42, 6, 6, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 43, 7, 1, 'RUN', 1, 1, 2, 73, 2, 0, 0, 0, 0, 0, 2),
(3, 44, 7, 2, 'RUN', 1, 1, 2, 73, 0, 0, 0, 0, 0, 0, 0),
(3, 45, 7, 3, 'RUN', 1, 1, 2, 73, 3, 0, 0, 0, 0, 0, 3),
(3, 46, 7, 4, 'RUN', 1, 1, 2, 73, 4, 0, 0, 0, 0, 0, 4),
(3, 47, 7, 5, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 48, 7, 6, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 49, 8, 1, 'RUN', 1, 1, 2, 70, 2, 0, 0, 0, 0, 0, 2),
(3, 50, 8, 2, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 51, 8, 3, 'RUN', 1, 1, 2, 70, 1, 0, 0, 0, 0, 0, 1),
(3, 52, 8, 4, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 53, 8, 5, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 54, 8, 6, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 55, 9, 1, 'RUN', 1, 1, 2, 75, 2, 0, 0, 0, 0, 0, 2),
(3, 56, 9, 2, 'RUN', 1, 1, 2, 75, 3, 0, 0, 0, 0, 0, 3),
(3, 57, 9, 3, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 58, 9, 4, 'RUN', 1, 1, 2, 75, 0, 0, 0, 0, 0, 0, 0),
(3, 59, 9, 5, 'RUN', 1, 1, 2, 75, 0, 0, 0, 0, 0, 0, 0),
(3, 60, 9, 6, 'RUN', 1, 1, 2, 75, 0, 0, 0, 0, 0, 0, 0),
(3, 61, 10, 1, 'RUN', 1, 1, 2, 73, 3, 0, 0, 0, 0, 0, 3),
(3, 62, 10, 2, 'RUN', 1, 1, 2, 73, 0, 0, 0, 0, 0, 0, 0),
(3, 63, 10, 3, 'RUN', 1, 1, 2, 73, 3, 0, 0, 0, 0, 0, 3),
(3, 64, 10, 4, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 65, 10, 5, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 66, 10, 6, 'RUN', 1, 1, 2, 73, 3, 0, 0, 0, 0, 0, 3),
(3, 67, 11, 1, 'RUN', 1, 1, 2, 70, 2, 0, 0, 0, 0, 0, 2),
(3, 68, 11, 2, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 69, 11, 3, 'RUN', 1, 1, 2, 70, 4, 0, 0, 0, 0, 0, 4),
(3, 70, 11, 4, 'RUN', 1, 1, 2, 70, 2, 0, 0, 0, 0, 0, 2),
(3, 71, 11, 5, 'RUN', 1, 1, 2, 70, 4, 0, 0, 0, 0, 0, 4),
(3, 72, 11, 6, 'RUN', 1, 1, 2, 70, 2, 0, 0, 0, 0, 0, 2),
(3, 73, 12, 1, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 74, 12, 2, 'RUN', 1, 1, 2, 75, 3, 0, 0, 0, 0, 0, 3),
(3, 75, 12, 3, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 76, 12, 4, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 77, 12, 5, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 78, 12, 6, 'RUN', 1, 1, 2, 75, 2, 0, 0, 0, 0, 0, 2),
(3, 79, 13, 1, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 80, 13, 2, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 81, 13, 3, 'RUN', 1, 1, 2, 73, 3, 0, 0, 0, 0, 0, 3),
(3, 82, 13, 4, 'RUN', 1, 1, 2, 73, 0, 0, 0, 0, 0, 0, 0),
(3, 83, 13, 5, 'RUN', 1, 1, 2, 73, 2, 0, 0, 0, 0, 0, 2),
(3, 84, 13, 6, 'RUN', 1, 1, 2, 73, 4, 0, 0, 0, 0, 0, 4),
(3, 85, 14, 1, 'RUN', 1, 1, 2, 70, 1, 0, 0, 0, 0, 0, 1),
(3, 86, 14, 2, 'RUN', 1, 1, 2, 70, 4, 0, 0, 0, 0, 0, 4),
(3, 87, 14, 3, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 88, 14, 4, 'RUN', 1, 1, 2, 70, 1, 0, 0, 0, 0, 0, 1),
(3, 89, 14, 5, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 90, 14, 6, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 91, 15, 1, 'RUN', 1, 1, 2, 75, 3, 0, 0, 0, 0, 0, 3),
(3, 92, 15, 2, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 93, 15, 3, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 94, 15, 4, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 95, 15, 5, 'RUN', 1, 1, 2, 75, 0, 0, 0, 0, 0, 0, 0),
(3, 96, 15, 6, 'RUN', 1, 1, 2, 75, 0, 0, 0, 0, 0, 0, 0),
(3, 97, 16, 1, 'RUN', 1, 1, 2, 73, 4, 0, 0, 0, 0, 0, 4),
(3, 98, 16, 2, 'RUN', 1, 1, 2, 73, 0, 0, 0, 0, 0, 0, 0),
(3, 99, 16, 3, 'RUN', 1, 1, 2, 73, 3, 0, 0, 0, 0, 0, 3),
(3, 100, 16, 4, 'RUN', 1, 1, 2, 73, 2, 0, 0, 0, 0, 0, 2),
(3, 101, 16, 5, 'RUN', 1, 1, 2, 73, 4, 0, 0, 0, 0, 0, 4),
(3, 102, 16, 6, 'RUN', 1, 1, 2, 73, 3, 0, 0, 0, 0, 0, 3),
(3, 103, 17, 1, 'RUN', 1, 1, 2, 70, 3, 0, 0, 0, 0, 0, 3),
(3, 104, 17, 2, 'RUN', 1, 1, 2, 70, 1, 0, 0, 0, 0, 0, 1),
(3, 105, 17, 3, 'RUN', 1, 1, 2, 70, 0, 0, 0, 0, 0, 0, 0),
(3, 106, 17, 4, 'RUN', 1, 1, 2, 70, 3, 0, 0, 0, 0, 0, 3),
(3, 107, 17, 5, 'RUN', 1, 1, 2, 70, 3, 0, 0, 0, 0, 0, 3),
(3, 108, 17, 6, 'RUN', 1, 1, 2, 70, 4, 0, 0, 0, 0, 0, 4),
(3, 109, 18, 1, 'RUN', 1, 1, 2, 75, 1, 0, 0, 0, 0, 0, 1),
(3, 110, 18, 2, 'RUN', 1, 1, 2, 75, 0, 0, 0, 0, 0, 0, 0),
(3, 111, 18, 3, 'RUN', 1, 1, 2, 75, 2, 0, 0, 0, 0, 0, 2),
(3, 112, 18, 4, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 113, 18, 5, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 114, 18, 6, 'RUN', 1, 1, 2, 75, 4, 0, 0, 0, 0, 0, 4),
(3, 115, 19, 1, 'RUN', 1, 1, 2, 73, 4, 0, 0, 0, 0, 0, 4),
(3, 116, 19, 2, 'RUN', 1, 1, 2, 73, 2, 0, 0, 0, 0, 0, 2),
(3, 117, 19, 3, 'RUN', 1, 1, 2, 73, 4, 0, 0, 0, 0, 0, 4),
(3, 118, 19, 4, 'RUN', 1, 1, 2, 73, 1, 0, 0, 0, 0, 0, 1),
(3, 119, 19, 5, 'RUN', 1, 1, 2, 73, 4, 0, 0, 0, 0, 0, 4),
(3, 120, 19, 6, 'RUN', 1, 1, 2, 73, 0, 0, 0, 0, 0, 0, 0),
(4, 1, 0, 1, 'RUN', 1, 61, 62, 15, 0, 0, 0, 0, 0, 0, 0),
(4, 2, 0, 2, 'RUN', 1, 61, 62, 15, 3, 0, 0, 0, 0, 0, 3),
(4, 3, 0, 3, 'RUN', 1, 61, 62, 15, 1, 0, 0, 0, 0, 0, 1),
(4, 4, 0, 4, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 5, 0, 5, 'RUN', 1, 61, 62, 15, 0, 0, 0, 0, 0, 0, 0),
(4, 6, 0, 6, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 7, 1, 1, 'RUN', 1, 61, 62, 12, 1, 0, 0, 0, 0, 0, 1),
(4, 8, 1, 2, 'RUN', 1, 61, 62, 12, 3, 0, 0, 0, 0, 0, 3),
(4, 9, 1, 3, 'RUN', 1, 61, 62, 12, 1, 0, 0, 0, 0, 0, 1),
(4, 10, 1, 4, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(4, 11, 1, 5, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 12, 1, 6, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(4, 13, 2, 1, 'RUN', 1, 61, 62, 11, 0, 0, 0, 0, 0, 0, 0),
(4, 14, 2, 2, 'RUN', 1, 61, 62, 11, 1, 0, 0, 0, 0, 0, 1),
(4, 15, 2, 3, 'RUN', 1, 61, 62, 11, 1, 0, 0, 0, 0, 0, 1),
(4, 16, 2, 4, 'RUN', 1, 61, 62, 11, 0, 0, 0, 0, 0, 0, 0),
(4, 17, 2, 5, 'RUN', 1, 61, 62, 11, 2, 0, 0, 0, 0, 0, 2),
(4, 18, 2, 6, 'RUN', 1, 61, 62, 11, 1, 0, 0, 0, 0, 0, 1),
(4, 19, 3, 1, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 20, 3, 2, 'RUN', 1, 61, 62, 15, 0, 0, 0, 0, 0, 0, 0),
(4, 21, 3, 3, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 22, 3, 4, 'RUN', 1, 61, 62, 15, 3, 0, 0, 0, 0, 0, 3),
(4, 23, 3, 5, 'RUN', 1, 61, 62, 15, 1, 0, 0, 0, 0, 0, 1),
(4, 24, 3, 6, 'RUN', 1, 61, 62, 15, 0, 0, 0, 0, 0, 0, 0),
(4, 25, 4, 1, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 26, 4, 2, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(4, 27, 4, 3, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 28, 4, 4, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(4, 29, 4, 5, 'RUN', 1, 61, 62, 12, 3, 0, 0, 0, 0, 0, 3),
(4, 30, 4, 6, 'RUN', 1, 61, 62, 12, 4, 0, 0, 0, 0, 0, 4),
(4, 31, 5, 1, 'RUN', 1, 61, 62, 11, 3, 0, 0, 0, 0, 0, 3),
(4, 32, 5, 2, 'RUN', 1, 61, 62, 11, 3, 0, 0, 0, 0, 0, 3),
(4, 33, 5, 3, 'RUN', 1, 61, 62, 11, 4, 0, 0, 0, 0, 0, 4),
(4, 34, 5, 4, 'RUN', 1, 61, 62, 11, 4, 0, 0, 0, 0, 0, 4),
(4, 35, 5, 5, 'RUN', 1, 61, 62, 11, 1, 0, 0, 0, 0, 0, 1),
(4, 36, 5, 6, 'RUN', 1, 61, 62, 11, 0, 0, 0, 0, 0, 0, 0),
(4, 37, 6, 1, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 38, 6, 2, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 39, 6, 3, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 40, 6, 4, 'RUN', 1, 61, 62, 15, 3, 0, 0, 0, 0, 0, 3),
(4, 41, 6, 5, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 42, 6, 6, 'RUN', 1, 61, 62, 15, 2, 0, 0, 0, 0, 0, 2),
(4, 43, 7, 1, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(4, 44, 7, 2, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 45, 7, 3, 'RUN', 1, 61, 62, 12, 3, 0, 0, 0, 0, 0, 3),
(4, 46, 7, 4, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 47, 7, 5, 'RUN', 1, 61, 62, 12, 1, 0, 0, 0, 0, 0, 1),
(4, 48, 7, 6, 'RUN', 1, 61, 62, 12, 1, 0, 0, 0, 0, 0, 1),
(4, 49, 8, 1, 'RUN', 1, 61, 62, 11, 4, 0, 0, 0, 0, 0, 4),
(4, 50, 8, 2, 'RUN', 1, 61, 62, 11, 4, 0, 0, 0, 0, 0, 4),
(4, 51, 8, 3, 'RUN', 1, 61, 62, 11, 1, 0, 0, 0, 0, 0, 1),
(4, 52, 8, 4, 'RUN', 1, 61, 62, 11, 2, 0, 0, 0, 0, 0, 2),
(4, 53, 8, 5, 'RUN', 1, 61, 62, 11, 1, 0, 0, 0, 0, 0, 1),
(4, 54, 8, 6, 'RUN', 1, 61, 62, 11, 0, 0, 0, 0, 0, 0, 0),
(4, 55, 9, 1, 'RUN', 1, 61, 62, 15, 1, 0, 0, 0, 0, 0, 1),
(4, 56, 9, 2, 'RUN', 1, 61, 62, 15, 1, 0, 0, 0, 0, 0, 1),
(4, 57, 9, 3, 'RUN', 1, 61, 62, 15, 0, 0, 0, 0, 0, 0, 0),
(4, 58, 9, 4, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 59, 9, 5, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 60, 9, 6, 'RUN', 1, 61, 62, 15, 0, 0, 0, 0, 0, 0, 0),
(4, 61, 10, 1, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(4, 62, 10, 2, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(4, 63, 10, 3, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 64, 10, 4, 'RUN', 1, 61, 62, 12, 3, 0, 0, 0, 0, 0, 3),
(4, 65, 10, 5, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(4, 66, 10, 6, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 67, 11, 1, 'RUN', 1, 61, 62, 11, 4, 0, 0, 0, 0, 0, 4),
(4, 68, 11, 2, 'RUN', 1, 61, 62, 11, 0, 0, 0, 0, 0, 0, 0),
(4, 69, 11, 3, 'RUN', 1, 61, 62, 11, 3, 0, 0, 0, 0, 0, 3),
(4, 70, 11, 4, 'RUN', 1, 61, 62, 11, 2, 0, 0, 0, 0, 0, 2),
(4, 71, 11, 5, 'RUN', 1, 61, 62, 11, 0, 0, 0, 0, 0, 0, 0),
(4, 72, 11, 6, 'RUN', 1, 61, 62, 11, 4, 0, 0, 0, 0, 0, 4),
(4, 73, 12, 1, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 74, 12, 2, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 75, 12, 3, 'RUN', 1, 61, 62, 15, 1, 0, 0, 0, 0, 0, 1),
(4, 76, 12, 4, 'RUN', 1, 61, 62, 15, 1, 0, 0, 0, 0, 0, 1),
(4, 77, 12, 5, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 78, 12, 6, 'RUN', 1, 61, 62, 15, 2, 0, 0, 0, 0, 0, 2),
(4, 79, 13, 1, 'RUN', 1, 61, 62, 12, 3, 0, 0, 0, 0, 0, 3),
(4, 80, 13, 2, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 81, 13, 3, 'RUN', 1, 61, 62, 12, 4, 0, 0, 0, 0, 0, 4),
(4, 82, 13, 4, 'RUN', 1, 61, 62, 12, 3, 0, 0, 0, 0, 0, 3),
(4, 83, 13, 5, 'RUN', 1, 61, 62, 12, 4, 0, 0, 0, 0, 0, 4),
(4, 84, 13, 6, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(4, 85, 14, 1, 'RUN', 1, 61, 62, 11, 0, 0, 0, 0, 0, 0, 0),
(4, 86, 14, 2, 'RUN', 1, 61, 62, 11, 3, 0, 0, 0, 0, 0, 3),
(4, 87, 14, 3, 'RUN', 1, 61, 62, 11, 1, 0, 0, 0, 0, 0, 1),
(4, 88, 14, 4, 'RUN', 1, 61, 62, 11, 4, 0, 0, 0, 0, 0, 4),
(4, 89, 14, 5, 'RUN', 1, 61, 62, 11, 3, 0, 0, 0, 0, 0, 3),
(4, 90, 14, 6, 'RUN', 1, 61, 62, 11, 2, 0, 0, 0, 0, 0, 2),
(4, 91, 15, 1, 'RUN', 1, 61, 62, 15, 2, 0, 0, 0, 0, 0, 2),
(4, 92, 15, 2, 'RUN', 1, 61, 62, 15, 2, 0, 0, 0, 0, 0, 2),
(4, 93, 15, 3, 'RUN', 1, 61, 62, 15, 2, 0, 0, 0, 0, 0, 2),
(4, 94, 15, 4, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 95, 15, 5, 'RUN', 1, 61, 62, 15, 2, 0, 0, 0, 0, 0, 2),
(4, 96, 15, 6, 'RUN', 1, 61, 62, 15, 2, 0, 0, 0, 0, 0, 2),
(4, 97, 16, 1, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 98, 16, 2, 'RUN', 1, 61, 62, 12, 4, 0, 0, 0, 0, 0, 4),
(4, 99, 16, 3, 'RUN', 1, 61, 62, 12, 1, 0, 0, 0, 0, 0, 1),
(4, 100, 16, 4, 'RUN', 1, 61, 62, 12, 1, 0, 0, 0, 0, 0, 1),
(4, 101, 16, 5, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 102, 16, 6, 'RUN', 1, 61, 62, 12, 1, 0, 0, 0, 0, 0, 1),
(4, 103, 17, 1, 'RUN', 1, 61, 62, 11, 3, 0, 0, 0, 0, 0, 3),
(4, 104, 17, 2, 'RUN', 1, 61, 62, 11, 0, 0, 0, 0, 0, 0, 0),
(4, 105, 17, 3, 'RUN', 1, 61, 62, 11, 2, 0, 0, 0, 0, 0, 2),
(4, 106, 17, 4, 'RUN', 1, 61, 62, 11, 3, 0, 0, 0, 0, 0, 3),
(4, 107, 17, 5, 'RUN', 1, 61, 62, 11, 0, 0, 0, 0, 0, 0, 0),
(4, 108, 17, 6, 'RUN', 1, 61, 62, 11, 2, 0, 0, 0, 0, 0, 2),
(4, 109, 18, 1, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 110, 18, 2, 'RUN', 1, 61, 62, 15, 2, 0, 0, 0, 0, 0, 2),
(4, 111, 18, 3, 'RUN', 1, 61, 62, 15, 1, 0, 0, 0, 0, 0, 1),
(4, 112, 18, 4, 'RUN', 1, 61, 62, 15, 0, 0, 0, 0, 0, 0, 0),
(4, 113, 18, 5, 'RUN', 1, 61, 62, 15, 1, 0, 0, 0, 0, 0, 1),
(4, 114, 18, 6, 'RUN', 1, 61, 62, 15, 4, 0, 0, 0, 0, 0, 4),
(4, 115, 19, 1, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 116, 19, 2, 'RUN', 1, 61, 62, 12, 1, 0, 0, 0, 0, 0, 1),
(4, 117, 19, 3, 'RUN', 1, 61, 62, 12, 2, 0, 0, 0, 0, 0, 2),
(4, 118, 19, 4, 'RUN', 1, 61, 62, 12, 3, 0, 0, 0, 0, 0, 3),
(4, 119, 19, 5, 'RUN', 1, 61, 62, 12, 3, 0, 0, 0, 0, 0, 3),
(4, 120, 19, 6, 'RUN', 1, 61, 62, 12, 0, 0, 0, 0, 0, 0, 0),
(5, 1, 0, 1, 'RUN', 1, 31, 32, 75, 3, 0, 0, 0, 0, 0, 3),
(5, 2, 0, 2, 'RUN', 1, 31, 32, 75, 2, 0, 0, 0, 0, 0, 2),
(5, 3, 0, 3, 'RUN', 1, 31, 32, 75, 4, 0, 0, 0, 0, 0, 4),
(5, 4, 0, 4, 'RUN', 1, 31, 32, 75, 1, 0, 0, 0, 0, 0, 1),
(5, 5, 0, 5, 'RUN', 1, 31, 32, 75, 2, 0, 0, 0, 0, 0, 2),
(5, 6, 0, 6, 'RUN', 1, 31, 32, 75, 2, 0, 0, 0, 0, 0, 2),
(5, 7, 1, 1, 'RUN', 1, 31, 32, 73, 2, 0, 0, 0, 0, 0, 2),
(5, 8, 1, 2, 'RUN', 1, 31, 32, 73, 2, 0, 0, 0, 0, 0, 2),
(5, 9, 1, 3, 'RUN', 1, 31, 32, 73, 0, 0, 0, 0, 0, 0, 0),
(5, 10, 1, 4, 'RUN', 1, 31, 32, 73, 0, 0, 0, 0, 0, 0, 0),
(5, 11, 1, 5, 'RUN', 1, 31, 32, 73, 4, 0, 0, 0, 0, 0, 4),
(5, 12, 1, 6, 'RUN', 1, 31, 32, 73, 3, 0, 0, 0, 0, 0, 3),
(5, 13, 2, 1, 'RUN', 1, 31, 32, 70, 3, 0, 0, 0, 0, 0, 3),
(5, 14, 2, 2, 'RUN', 1, 31, 32, 70, 1, 0, 0, 0, 0, 0, 1),
(5, 15, 2, 3, 'RUN', 1, 31, 32, 70, 2, 0, 0, 0, 0, 0, 2),
(5, 16, 2, 4, 'RUN', 1, 31, 32, 70, 2, 0, 0, 0, 0, 0, 2),
(5, 17, 2, 5, 'RUN', 1, 31, 32, 70, 1, 0, 0, 0, 0, 0, 1),
(5, 18, 2, 6, 'RUN', 1, 31, 32, 70, 4, 0, 0, 0, 0, 0, 4),
(5, 19, 3, 1, 'RUN', 1, 31, 32, 75, 1, 0, 0, 0, 0, 0, 1),
(5, 20, 3, 2, 'RUN', 1, 31, 32, 75, 4, 0, 0, 0, 0, 0, 4),
(5, 21, 3, 3, 'RUN', 1, 31, 32, 75, 2, 0, 0, 0, 0, 0, 2),
(5, 22, 3, 4, 'RUN', 1, 31, 32, 75, 2, 0, 0, 0, 0, 0, 2),
(5, 23, 3, 5, 'RUN', 1, 31, 32, 75, 1, 0, 0, 0, 0, 0, 1),
(5, 24, 3, 6, 'RUN', 1, 31, 32, 75, 3, 0, 0, 0, 0, 0, 3),
(5, 25, 4, 1, 'RUN', 1, 31, 32, 73, 0, 0, 0, 0, 0, 0, 0),
(5, 26, 4, 2, 'RUN', 1, 31, 32, 73, 0, 0, 0, 0, 0, 0, 0),
(5, 27, 4, 3, 'RUN', 1, 31, 32, 73, 2, 0, 0, 0, 0, 0, 2),
(5, 28, 4, 4, 'RUN', 1, 31, 32, 73, 3, 0, 0, 0, 0, 0, 3),
(5, 29, 4, 5, 'RUN', 1, 31, 32, 73, 0, 0, 0, 0, 0, 0, 0),
(5, 30, 4, 6, 'RUN', 1, 31, 32, 73, 4, 0, 0, 0, 0, 0, 4),
(5, 31, 5, 1, 'RUN', 1, 31, 32, 70, 1, 0, 0, 0, 0, 0, 1),
(5, 32, 5, 2, 'RUN', 1, 31, 32, 70, 1, 0, 0, 0, 0, 0, 1),
(5, 33, 5, 3, 'RUN', 1, 31, 32, 70, 4, 0, 0, 0, 0, 0, 4),
(5, 34, 5, 4, 'RUN', 1, 31, 32, 70, 4, 0, 0, 0, 0, 0, 4),
(5, 35, 5, 5, 'RUN', 1, 31, 32, 70, 2, 0, 0, 0, 0, 0, 2),
(5, 36, 5, 6, 'RUN', 1, 31, 32, 70, 4, 0, 0, 0, 0, 0, 4),
(5, 37, 6, 1, 'RUN', 1, 31, 32, 75, 2, 0, 0, 0, 0, 0, 2),
(5, 38, 6, 2, 'RUN', 1, 31, 32, 75, 4, 0, 0, 0, 0, 0, 4),
(5, 39, 6, 3, 'RUN', 1, 31, 32, 75, 1, 0, 0, 0, 0, 0, 1),
(5, 40, 6, 4, 'RUN', 1, 31, 32, 75, 3, 0, 0, 0, 0, 0, 3),
(5, 41, 6, 5, 'RUN', 1, 31, 32, 75, 0, 0, 0, 0, 0, 0, 0),
(5, 42, 6, 6, 'RUN', 1, 31, 32, 75, 4, 0, 0, 0, 0, 0, 4),
(5, 43, 7, 1, 'RUN', 1, 31, 32, 73, 4, 0, 0, 0, 0, 0, 4),
(5, 44, 7, 2, 'RUN', 1, 31, 32, 73, 4, 0, 0, 0, 0, 0, 4),
(5, 45, 7, 3, 'RUN', 1, 31, 32, 73, 2, 0, 0, 0, 0, 0, 2),
(5, 46, 7, 4, 'RUN', 1, 31, 32, 73, 2, 0, 0, 0, 0, 0, 2),
(5, 47, 7, 5, 'RUN', 1, 31, 32, 73, 3, 0, 0, 0, 0, 0, 3),
(5, 48, 7, 6, 'RUN', 1, 31, 32, 73, 4, 0, 0, 0, 0, 0, 4),
(5, 49, 8, 1, 'RUN', 1, 31, 32, 70, 3, 0, 0, 0, 0, 0, 3),
(5, 50, 8, 2, 'RUN', 1, 31, 32, 70, 4, 0, 0, 0, 0, 0, 4),
(5, 51, 8, 3, 'RUN', 1, 31, 32, 70, 2, 0, 0, 0, 0, 0, 2),
(5, 52, 8, 4, 'RUN', 1, 31, 32, 70, 3, 0, 0, 0, 0, 0, 3),
(5, 53, 8, 5, 'RUN', 1, 31, 32, 70, 1, 0, 0, 0, 0, 0, 1),
(5, 54, 8, 6, 'RUN', 1, 31, 32, 70, 1, 0, 0, 0, 0, 0, 1),
(5, 55, 9, 1, 'RUN', 1, 31, 32, 75, 2, 0, 0, 0, 0, 0, 2),
(5, 56, 9, 2, 'RUN', 1, 31, 32, 75, 4, 0, 0, 0, 0, 0, 4),
(5, 57, 9, 3, 'RUN', 1, 31, 32, 75, 3, 0, 0, 0, 0, 0, 3),
(5, 58, 9, 4, 'RUN', 1, 31, 32, 75, 1, 0, 0, 0, 0, 0, 1),
(5, 59, 9, 5, 'RUN', 1, 31, 32, 75, 4, 0, 0, 0, 0, 0, 4),
(5, 60, 9, 6, 'RUN', 1, 31, 32, 75, 4, 0, 0, 0, 0, 0, 4);
REPLACE INTO `over_summary` (`matchId`, `inningsId`, `player_id`, `overNumber`, `balls`, `ball_index`, `runs`, `wickets`, `bowlerSquadId`) VALUES
(1, 1, 45, 0, '1,0,4,2,0,1', 6, 14, 0, 45),
(1, 1, 41, 1, '1,0,4,2,0,1', 6, 12, 0, 41),
(1, 1, 40, 2, '1,0,4,2,0,1', 6, 15, 0, 40),
(1, 1, 45, 3, '1,0,4,2,0,1', 6, 11, 0, 45),
(1, 1, 41, 4, '1,0,4,2,0,1', 6, 7, 0, 41),
(1, 1, 40, 5, '1,0,4,2,0,1', 6, 11, 1, 40),
(1, 1, 45, 6, '1,0,4,2,0,1', 6, 8, 0, 45),
(1, 1, 41, 7, '1,0,4,2,0,1', 6, 3, 1, 41),
(1, 1, 40, 8, '1,0,4,2,0,1', 6, 10, 0, 40),
(1, 1, 45, 9, '1,0,4,2,0,1', 6, 12, 1, 45),
(1, 1, 41, 10, '1,0,4,2,0,1', 6, 8, 0, 41),
(1, 1, 40, 11, '1,0,4,2,0,1', 6, 10, 0, 40),
(1, 1, 45, 12, '1,0,4,2,0,1', 6, 10, 0, 45),
(1, 1, 41, 13, '1,0,4,2,0,1', 6, 6, 0, 41),
(1, 1, 40, 14, '1,0,4,2,0,1', 6, 9, 0, 40),
(1, 1, 45, 15, '1,0,4,2,0,1', 6, 16, 0, 45),
(1, 1, 41, 16, '1,0,4,2,0,1', 6, 18, 0, 41),
(1, 1, 40, 17, '1,0,4,2,0,1', 6, 13, 0, 40),
(1, 1, 45, 18, '1,0,4,2,0,1', 6, 13, 1, 45),
(1, 1, 41, 19, '1,0,4,2,0,1', 6, 15, 0, 41),
(1, 2, 15, 0, '1,0,4,2,0,1', 6, 14, 0, 15),
(1, 2, 12, 1, '1,0,4,2,0,1', 6, 16, 0, 12),
(1, 2, 11, 2, '1,0,4,2,0,1', 6, 16, 1, 11),
(1, 2, 15, 3, '1,0,4,2,0,1', 6, 14, 0, 15),
(1, 2, 12, 4, '1,0,4,2,0,1', 6, 12, 0, 12),
(1, 2, 11, 5, '1,0,4,2,0,1', 6, 9, 0, 11),
(1, 2, 15, 6, '1,0,4,2,0,1', 6, 8, 0, 15),
(1, 2, 12, 7, '1,0,4,2,0,1', 6, 15, 0, 12),
(1, 2, 11, 8, '1,0,4,2,0,1', 6, 13, 0, 11),
(1, 2, 15, 9, '1,0,4,2,0,1', 6, 12, 1, 15),
(1, 2, 12, 10, '1,0,4,2,0,1', 6, 7, 0, 12),
(1, 2, 11, 11, '1,0,4,2,0,1', 6, 11, 1, 11),
(1, 2, 15, 12, '1,0,4,2,0,1', 6, 12, 1, 15),
(1, 2, 12, 13, '1,0,4,2,0,1', 6, 16, 1, 12),
(1, 2, 11, 14, '1,0,4,2,0,1', 6, 11, 0, 11),
(1, 2, 15, 15, '1,0,4,2,0,1', 6, 14, 0, 15),
(1, 2, 12, 16, '1,0,4,2,0,1', 6, 11, 0, 12),
(1, 2, 11, 17, '1,0,4,2,0,1', 6, 12, 1, 11),
(1, 2, 15, 18, '1,0,4,2,0,1', 6, 10, 0, 15),
(1, 2, 12, 19, '1,0,4,2,0,1', 6, 13, 1, 12),
(2, 3, 75, 0, '1,0,4,2,0,1', 6, 9, 0, 75),
(2, 3, 73, 1, '1,0,4,2,0,1', 6, 11, 0, 73),
(2, 3, 70, 2, '1,0,4,2,0,1', 6, 18, 0, 70),
(2, 3, 75, 3, '1,0,4,2,0,1', 6, 13, 0, 75),
(2, 3, 73, 4, '1,0,4,2,0,1', 6, 12, 1, 73),
(2, 3, 70, 5, '1,0,4,2,0,1', 6, 16, 0, 70),
(2, 3, 75, 6, '1,0,4,2,0,1', 6, 11, 0, 75),
(2, 3, 73, 7, '1,0,4,2,0,1', 6, 11, 1, 73),
(2, 3, 70, 8, '1,0,4,2,0,1', 6, 3, 1, 70),
(2, 3, 75, 9, '1,0,4,2,0,1', 6, 9, 0, 75),
(2, 3, 73, 10, '1,0,4,2,0,1', 6, 11, 0, 73),
(2, 3, 70, 11, '1,0,4,2,0,1', 6, 14, 1, 70),
(2, 3, 75, 12, '1,0,4,2,0,1', 6, 18, 1, 75),
(2, 3, 73, 13, '1,0,4,2,0,1', 6, 11, 0, 73),
(2, 3, 70, 14, '1,0,4,2,0,1', 6, 6, 0, 70),
(2, 3, 75, 15, '1,0,4,2,0,1', 6, 9, 0, 75),
(2, 3, 73, 16, '1,0,4,2,0,1', 6, 16, 0, 73),
(2, 3, 70, 17, '1,0,4,2,0,1', 6, 14, 1, 70),
(2, 3, 75, 18, '1,0,4,2,0,1', 6, 15, 1, 75),
(2, 3, 73, 19, '1,0,4,2,0,1', 6, 15, 0, 73),
(2, 4, 15, 0, '1,0,4,2,0,1', 6, 12, 0, 15),
(2, 4, 12, 1, '1,0,4,2,0,1', 6, 7, 1, 12),
(2, 4, 11, 2, '1,0,4,2,0,1', 6, 5, 0, 11),
(2, 4, 15, 3, '1,0,4,2,0,1', 6, 12, 0, 15),
(2, 4, 12, 4, '1,0,4,2,0,1', 6, 11, 0, 12),
(2, 4, 11, 5, '1,0,4,2,0,1', 6, 15, 0, 11),
(2, 4, 15, 6, '1,0,4,2,0,1', 6, 21, 0, 15),
(2, 4, 12, 7, '1,0,4,2,0,1', 6, 9, 1, 12),
(2, 4, 11, 8, '1,0,4,2,0,1', 6, 12, 1, 11),
(2, 4, 15, 9, '1,0,4,2,0,1', 6, 10, 2, 15),
(2, 4, 12, 10, '1,0,4,2,0,1', 6, 7, 3, 12),
(2, 4, 11, 11, '1,0,4,2,0,1', 6, 13, 0, 11),
(2, 4, 15, 12, '1,0,4,2,0,1', 6, 16, 0, 15),
(2, 4, 12, 13, '1,0,4,2,0,1', 6, 16, 0, 12),
(2, 4, 11, 14, '1,0,4,2,0,1', 6, 13, 1, 11),
(2, 4, 15, 15, '1,0,4,2,0,1', 6, 14, 2, 15),
(2, 4, 12, 16, '1,0,4,2,0,1', 6, 11, 1, 12),
(2, 4, 11, 17, '1,0,4,2,0,1', 6, 10, 1, 11),
(2, 4, 15, 18, '1,0,4,2,0,1', 6, 12, 0, 15),
(2, 4, 12, 19, '1,0,4,2,0,1', 6, 11, 0, 12),
(3, 5, 75, 0, '1,0,4,2,0,1', 6, 14, 0, 75),
(3, 5, 73, 1, '1,0,4,2,0,1', 6, 11, 2, 73),
(3, 5, 70, 2, '1,0,4,2,0,1', 6, 13, 0, 70),
(3, 5, 75, 3, '1,0,4,2,0,1', 6, 13, 0, 75),
(3, 5, 73, 4, '1,0,4,2,0,1', 6, 9, 0, 73),
(3, 5, 70, 5, '1,0,4,2,0,1', 6, 16, 1, 70),
(3, 5, 75, 6, '1,0,4,2,0,1', 6, 14, 1, 75),
(3, 5, 73, 7, '1,0,4,2,0,1', 6, 19, 0, 73),
(3, 5, 70, 8, '1,0,4,2,0,1', 6, 14, 0, 70),
(3, 5, 75, 9, '1,0,4,2,0,1', 6, 18, 1, 75);
REPLACE INTO `match_batting` (`matchId`, `inningsId`, `player_id`, `balls`, `runs`, `fours`, `sixes`, `strikeRate`, `status`, `index`) VALUES
(1, 1, 1, 24, 45, 2, 1, 187.50, 1, 1),
(1, 1, 2, 24, 45, 2, 1, 187.50, 1, 2),
(1, 1, 4, 24, 45, 2, 1, 187.50, 1, 3),
(1, 1, 8, 24, 45, 2, 1, 187.50, 1, 4),
(1, 1, 10, 24, 45, 2, 1, 187.50, 1, 5),
(1, 2, 31, 24, 45, 2, 1, 187.50, 1, 1),
(1, 2, 32, 24, 45, 2, 1, 187.50, 1, 2),
(1, 2, 34, 24, 45, 2, 1, 187.50, 1, 3),
(1, 2, 36, 24, 45, 2, 1, 187.50, 1, 4),
(1, 2, 37, 24, 45, 2, 1, 187.50, 1, 5),
(2, 3, 1, 24, 45, 2, 1, 187.50, 1, 1),
(2, 3, 2, 24, 45, 2, 1, 187.50, 1, 2),
(2, 3, 4, 24, 45, 2, 1, 187.50, 1, 3),
(2, 3, 8, 24, 45, 2, 1, 187.50, 1, 4),
(2, 3, 10, 24, 45, 2, 1, 187.50, 1, 5),
(2, 4, 61, 24, 45, 2, 1, 187.50, 1, 1),
(2, 4, 62, 24, 45, 2, 1, 187.50, 1, 2),
(2, 4, 63, 24, 45, 2, 1, 187.50, 1, 3),
(2, 4, 65, 24, 45, 2, 1, 187.50, 1, 4),
(2, 4, 66, 24, 45, 2, 1, 187.50, 1, 5),
(3, 5, 31, 24, 45, 2, 1, 187.50, 1, 1),
(3, 5, 32, 24, 45, 2, 1, 187.50, 1, 2),
(3, 5, 34, 24, 45, 2, 1, 187.50, 1, 3),
(3, 5, 36, 24, 45, 2, 1, 187.50, 1, 4),
(3, 5, 37, 24, 45, 2, 1, 187.50, 1, 5);
REPLACE INTO sponsors (name, header, image, status) VALUES ('TechGiant', 'Official Partner', 'https://ui-avatars.com/api/?name=TG', 'active');
REPLACE INTO pitch_reports (matchId, pitchType, grassCover, paceBounce) VALUES (1, 'Hard', 5.0, 7.5), (2, 'Dusty', 2.0, 4.0), (3, 'Green', 9.0, 8.0);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
