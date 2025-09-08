-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: admin_panel
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP SCHEMA IF EXISTS `admin_panel`;
CREATE SCHEMA `admin_panel`;
USE `admin_panel`;

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `username` varchar(50) NOT NULL,
                         `password` varchar(255) NOT NULL,
                         `first_name` varchar(150) NOT NULL,
                         `last_name` varchar(150) DEFAULT NULL,
                         `gender` enum('male','female') DEFAULT NULL,
                         `birthdate` date DEFAULT NULL,
                         `role` enum('admin','user') DEFAULT 'user',
                         `refresh_token` text,
                         `refresh_expires_at` datetime DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users`
(`id`, `username`, `password`, `first_name`, `last_name`, `gender`, `birthdate`, `role`, `refresh_token`, `refresh_expires_at`)
VALUES
    (100, 'admin1', '$argon2id$v=19$m=65536,t=3,p=4$7yGv4qqr2GyJZUsEigWAOw$YQRfFR68KROUAU2T4vMreoGIPqmWqkdg4LzaC5F9J6o', 'Alice', 'Johnson', 'female', '1990-01-15', 'admin', NULL, NULL),
    (102, 'admin2', '$argon2id$v=19$m=65536,t=3,p=4$sTPdmNxK8bJVPaWjVrPYlg$BMCBU1Nxl18LBgUmxB30zuiYFu7Rh2jdemd4XXoLOts', 'Bob', 'Williams', 'male', '1988-07-22', 'admin', NULL, NULL),
    (103, 'user1', '$argon2id$v=19$m=65536,t=3,p=4$8fvv1jcNaF63GhRiNkzrbQ$Fs4ZLc6ETy1CT2XhpQqVZtthwyFQ2gDy/qw3mtx56gA', 'Charlie', 'Brown', 'male', '1995-03-10', 'user', NULL, NULL),
    (104, 'user2', '$argon2id$v=19$m=65536,t=3,p=4$xGVrFUoDC7uZRGSdVNTOaA$8f21310eZXEgeSgm31NXkYL50xOfmb3RcMb3tiaO+mQ', 'Diana', 'Miller', 'female', '1998-06-25', 'user', NULL, NULL),
    (105, 'user3', '$argon2id$v=19$m=65536,t=3,p=4$/PLY1MFWwApjcfwR7EFtkg$HMIf1cusyrk8amOfslBUGAE8cehBjIjbnsdkgRL9zQQ', 'Ethan', 'Davis', 'male', '1992-11-05', 'user', NULL, NULL),
    (106, 'user4', '$argon2id$v=19$m=65536,t=3,p=4$O+vYukPviuaPByDNnS3iDg$n1j88sZKyEbAInyZQH5vmfrO3CZTuaUXoEekM6BFIHE', 'Fiona', 'Taylor', 'female', '1997-08-19', 'user', NULL, NULL),
    (107, 'user5', '$argon2id$v=19$m=65536,t=3,p=4$qqyIu7kQHzSO8d0xgVdP+g$MlkobEyeFzwbW9BolCUjEzUHL5k8GV8inzyV/HWilWk', 'George', 'Anderson', 'male', '2000-12-30', 'user', NULL, NULL),
    (108, 'user6', '$argon2id$v=19$m=65536,t=3,p=4$m8An47GRObG+iik1dwHjEQ$IFOgsuYwlhlfaTXktgaOK1Afs/xs+umeBqfwOg5pycA', 'Hannah', 'Thomas', 'female', '1999-04-14', 'user', NULL, NULL),
    (109, 'user7', '$argon2id$v=19$m=65536,t=3,p=4$ItaYY04u1wh+qysS88WHRw$L996Xi0qSdQZIC7GRHP1b79ENPU7JcQSmepPqj2c2zU', 'Ian', 'Moore', 'male', '1994-09-09', 'user', NULL, NULL),
    (110, 'user8', '$argon2id$v=19$m=65536,t=3,p=4$cJsIXMVbNGgRhzbs2cvW6A$EDI2TEceJol9k/oAj0yYvznrVVKoTJrArerv5aKWFdQ', 'Julia', 'Martin', 'female', '1996-02-27', 'user', NULL, NULL),
    (111, 'user9', '$argon2id$v=19$m=65536,t=3,p=4$dR7MEPQC8G0NitNDTQZWOw$3/KglV+xiFXfja26hkReB3k73kRj/ODIHCMSEPQ1eww', 'Kevin', 'Clark', 'male', '2001-05-06', 'user', NULL, NULL),
    (112, 'user10', '$argon2id$v=19$m=65536,t=3,p=4$5Qw9D/L9kJc40WHPUkWsLg$MhLXvKDyXBC6+6NSqClode9ou/VKZetweu5KXBf3Kew', 'Laura', 'Harris', 'female', '2002-10-17', 'user', NULL, NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-08 17:13:06
