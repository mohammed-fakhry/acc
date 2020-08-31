-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2020 at 03:47 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.3.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `accountings_ali`
--

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `clientId` int(11) NOT NULL,
  `clientName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `clientTell` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `clientAddress` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `clientNationNum` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`clientId`, `clientName`, `clientTell`, `clientAddress`, `clientNationNum`) VALUES
(1, 'تست', '01112345666', 'تست ادد', '01235254856965');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customerId` int(11) NOT NULL,
  `customerName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `customerUnit` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `customerTell` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `customerAdd` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `customerPaid` int(11) DEFAULT NULL,
  `customerRemain` int(11) DEFAULT NULL,
  `customerDateIN` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customerId`, `customerName`, `customerUnit`, `customerTell`, `customerAdd`, `customerPaid`, `customerRemain`, `customerDateIN`) VALUES
(1, '', '', '', '', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employes`
--

CREATE TABLE `employes` (
  `workerId` int(11) NOT NULL,
  `workerName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerTell` varchar(14) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerAdd` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerJopCateg` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerJop` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerFbCode` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerJopDate` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerSalary` int(10) DEFAULT NULL,
  `workerYearVacation` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerCheckIN` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerCheckOut` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otheraccounts`
--

CREATE TABLE `otheraccounts` (
  `accId` int(11) NOT NULL,
  `AccName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `currentAccVal` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productId` int(11) NOT NULL,
  `productName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `safereceipt`
--

CREATE TABLE `safereceipt` (
  `safeReceiptId` int(11) NOT NULL,
  `receiptKind` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_time` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `safeName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `safeId` int(11) NOT NULL,
  `currentSafeVal` int(11) DEFAULT NULL,
  `transactionAccKind` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `AccName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `currentAccVal` int(11) DEFAULT NULL,
  `secSafeName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `secSafeId` int(11) NOT NULL,
  `current_SecSafeVal` int(11) DEFAULT NULL,
  `customerId` int(11) NOT NULL,
  `customerName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `currentCustomerVal` int(11) DEFAULT NULL,
  `receiptVal` int(11) DEFAULT NULL,
  `recieptNote` varchar(1000) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `safes`
--

CREATE TABLE `safes` (
  `safeId` int(11) NOT NULL,
  `safeName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `workerId` int(11) DEFAULT NULL,
  `safeEmployee` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `opendVal` int(11) NOT NULL,
  `currentSafeVal` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `safes`
--

INSERT INTO `safes` (`safeId`, `safeName`, `workerId`, `safeEmployee`, `opendVal`, `currentSafeVal`) VALUES
(1, NULL, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stockpridge`
--

CREATE TABLE `stockpridge` (
  `stockProductId` int(11) NOT NULL,
  `stockId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `productQty` int(14) DEFAULT NULL,
  `productCost` int(14) DEFAULT NULL,
  `productPrice` int(14) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `stockId` int(11) NOT NULL,
  `stockName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `stockPlace` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `stockEmployee` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `stockProducts` int(14) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`stockId`, `stockName`, `stockPlace`, `stockEmployee`, `stockProducts`) VALUES
(1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stocktransaction`
--

CREATE TABLE `stocktransaction` (
  `stockTransactionId` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `invNumber` int(100) DEFAULT NULL,
  `stockId` int(11) NOT NULL,
  `sndStockId` int(11) DEFAULT NULL,
  `transactionType` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `invoiceTotal` int(11) DEFAULT NULL,
  `notes` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_time` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stocktransactiondetails`
--

CREATE TABLE `stocktransactiondetails` (
  `stockTransactionDetailsId` int(11) NOT NULL,
  `stockTransactionId` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `productId` int(11) NOT NULL,
  `price` int(14) NOT NULL,
  `Qty` int(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `towers`
--

CREATE TABLE `towers` (
  `towerId` int(11) NOT NULL,
  `towerName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `towerStage` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `towers`
--

INSERT INTO `towers` (`towerId`, `towerName`, `towerStage`) VALUES
(1, '1', 'أ'),
(2, '2', 'أ'),
(3, '3', 'أ'),
(4, '4', 'أ'),
(5, '5', 'أ'),
(6, '6', 'أ'),
(7, '7', 'أ'),
(8, '8', 'أ'),
(9, '9', 'أ'),
(10, '10', 'أ'),
(11, '11', 'أ'),
(12, '1', 'ب'),
(13, '2', 'ب'),
(14, '3', 'ب'),
(15, '4', 'ب'),
(16, '5', 'ب'),
(17, '6', 'ب'),
(18, '7', 'ب'),
(19, '8', 'ب'),
(20, '9', 'ب'),
(21, '10', 'ب'),
(22, '11', 'ب'),
(23, '1', 'ج'),
(24, '2', 'ج'),
(25, '3', 'ج'),
(26, '4', 'ج'),
(27, '5', 'ج'),
(28, '6', 'ج'),
(29, '7', 'ج'),
(30, '8', 'ج'),
(31, '9', 'ج'),
(32, '10', 'ج'),
(33, '11', 'ج');

-- --------------------------------------------------------

--
-- Table structure for table `unitdata`
--

CREATE TABLE `unitdata` (
  `unitId` int(11) NOT NULL,
  `unitNum` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `towerId` int(11) DEFAULT NULL,
  `towerStage` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `unitExtent` int(14) DEFAULT NULL,
  `unitPrice` int(14) DEFAULT NULL,
  `unitCompany` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `unitDate` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `unitFloar` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `unitdata`
--

INSERT INTO `unitdata` (`unitId`, `unitNum`, `towerId`, `towerStage`, `unitExtent`, `unitPrice`, `unitCompany`, `unitDate`, `unitFloar`) VALUES
(23, '1', 1, 'أ', 163, 3128, '', '0', 0),
(24, '2', 1, 'أ', 168, 2976, '', '0', 0),
(25, '3', 1, 'أ', 127, 2755, '', '0', 0),
(26, '4', 1, 'أ', 87, 2520, '', '0', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `userName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `userPassword` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workerrule`
--

CREATE TABLE `workerrule` (
  `workerRuleId` int(11) NOT NULL,
  `authOverTime` int(14) NOT NULL,
  `authDelayTime` int(14) NOT NULL,
  `halfDayDisc` int(14) NOT NULL,
  `allDayDisc` int(11) NOT NULL,
  `salarytimeKind` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `outEarlyTime` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`clientId`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customerId`);

--
-- Indexes for table `employes`
--
ALTER TABLE `employes`
  ADD PRIMARY KEY (`workerId`);

--
-- Indexes for table `otheraccounts`
--
ALTER TABLE `otheraccounts`
  ADD PRIMARY KEY (`accId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`);

--
-- Indexes for table `safereceipt`
--
ALTER TABLE `safereceipt`
  ADD PRIMARY KEY (`safeReceiptId`),
  ADD KEY `customerId` (`customerId`),
  ADD KEY `safeId` (`safeId`),
  ADD KEY `sndSafeId` (`secSafeId`);

--
-- Indexes for table `safes`
--
ALTER TABLE `safes`
  ADD PRIMARY KEY (`safeId`),
  ADD KEY `safeEmployee` (`workerId`);

--
-- Indexes for table `stockpridge`
--
ALTER TABLE `stockpridge`
  ADD PRIMARY KEY (`stockProductId`),
  ADD KEY `stockId` (`stockId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`stockId`);

--
-- Indexes for table `stocktransaction`
--
ALTER TABLE `stocktransaction`
  ADD PRIMARY KEY (`stockTransactionId`),
  ADD KEY `stockId` (`stockId`),
  ADD KEY `customerId` (`customerId`),
  ADD KEY `sndStockId` (`sndStockId`);

--
-- Indexes for table `stocktransactiondetails`
--
ALTER TABLE `stocktransactiondetails`
  ADD PRIMARY KEY (`stockTransactionDetailsId`),
  ADD KEY `productId` (`productId`),
  ADD KEY `stockTransactionId` (`stockTransactionId`);

--
-- Indexes for table `towers`
--
ALTER TABLE `towers`
  ADD PRIMARY KEY (`towerId`);

--
-- Indexes for table `unitdata`
--
ALTER TABLE `unitdata`
  ADD PRIMARY KEY (`unitId`),
  ADD KEY `towerId` (`towerId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `workerrule`
--
ALTER TABLE `workerrule`
  ADD PRIMARY KEY (`workerRuleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `clientId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `employes`
--
ALTER TABLE `employes`
  MODIFY `workerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `otheraccounts`
--
ALTER TABLE `otheraccounts`
  MODIFY `accId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `safereceipt`
--
ALTER TABLE `safereceipt`
  MODIFY `safeReceiptId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=253;

--
-- AUTO_INCREMENT for table `safes`
--
ALTER TABLE `safes`
  MODIFY `safeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `stockpridge`
--
ALTER TABLE `stockpridge`
  MODIFY `stockProductId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `stockId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `stocktransactiondetails`
--
ALTER TABLE `stocktransactiondetails`
  MODIFY `stockTransactionDetailsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=298;

--
-- AUTO_INCREMENT for table `towers`
--
ALTER TABLE `towers`
  MODIFY `towerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `unitdata`
--
ALTER TABLE `unitdata`
  MODIFY `unitId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `workerrule`
--
ALTER TABLE `workerrule`
  MODIFY `workerRuleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
