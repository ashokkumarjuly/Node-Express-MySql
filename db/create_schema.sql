 
CREATE DATABASE `demo_database`;
USE `demo_database`;
 
CREATE TABLE  `user` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`firstName` VARCHAR(30) NOT NULL,
	`lastName` VARCHAR(30) NULL DEFAULT NULL,
	`email` VARCHAR(100)  NOT NULL UNIQUE,
	`password` VARCHAR(100) NOT NULL,
	`role` VARCHAR(20) NULL DEFAULT NULL,
	`accountStatus` INT NULL DEFAULT 0,
	`emailVerified` TINYINT NULL DEFAULT 0,
	`authToken` VARCHAR(512) NULL DEFAULT NULL,
	`lastLoginDate` DATETIME NULL DEFAULT NULL ,
	`createdAt` DATETIME NULL DEFAULT NULL ,
	`updatedAt` DATETIME NULL DEFAULT NULL ,
	 PRIMARY KEY (`id`) 	
	
);
 
CREATE TABLE  `user_role` (
	`role_name` VARCHAR(20) NOT NULL,
	`user_id` INT NOT NULL
);
 


