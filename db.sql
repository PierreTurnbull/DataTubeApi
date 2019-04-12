-- MySQL Script generated by MySQL Workbench
-- ven. 12 avril 2019 17:09:30 CEST
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema data_tube
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `data_tube` ;

-- -----------------------------------------------------
-- Schema data_tube
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `data_tube` DEFAULT CHARACTER SET utf8 ;
USE `data_tube` ;

-- -----------------------------------------------------
-- Table `data_tube`.`language`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`language` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`language` (
  `id` VARCHAR(16) NOT NULL,
  `code` VARCHAR(16) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`video_category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`video_category` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`video_category` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`channel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`channel` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`channel` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NULL,
  `published_at` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`video`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`video` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`video` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `description` VARCHAR(3000) NOT NULL,
  `published_at` DATETIME NOT NULL,
  `duration` INT NOT NULL,
  `view_count` INT NOT NULL,
  `like_count` INT NOT NULL,
  `dislike_count` INT NOT NULL,
  `comment_count` INT NOT NULL,
  `definition` VARCHAR(2) NOT NULL,
  `has_caption` TINYINT(1) NOT NULL,
  `is_licensed` TINYINT(1) NOT NULL,
  `language_id` VARCHAR(16) NULL,
  `video_category_id` VARCHAR(64) NOT NULL,
  `channel_id` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_video_language1_idx` (`language_id` ASC),
  INDEX `fk_video_video_category1_idx` (`video_category_id` ASC),
  INDEX `fk_video_channel1_idx` (`channel_id` ASC),
  CONSTRAINT `fk_video_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `data_tube`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_video_video_category1`
    FOREIGN KEY (`video_category_id`)
    REFERENCES `data_tube`.`video_category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_video_channel1`
    FOREIGN KEY (`channel_id`)
    REFERENCES `data_tube`.`channel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`playlist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`playlist` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`playlist` (
  `id` VARCHAR(64) NOT NULL,
  `published_at` DATETIME NOT NULL,
  `title` VARCHAR(64) NOT NULL,
  `description` VARCHAR(3000) NULL,
  `channel_id` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_playlist_channel1_idx` (`channel_id` ASC),
  CONSTRAINT `fk_playlist_channel1`
    FOREIGN KEY (`channel_id`)
    REFERENCES `data_tube`.`channel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`thumbnail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`thumbnail` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`thumbnail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(64) NOT NULL,
  `size` VARCHAR(16) NOT NULL,
  `width` INT NOT NULL,
  `height` INT NOT NULL,
  `channel_id` VARCHAR(64) NULL,
  `playlist_id` VARCHAR(64) NULL,
  `video_id` VARCHAR(64) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_thumbnail_channel1_idx` (`channel_id` ASC),
  INDEX `fk_thumbnail_playlist1_idx` (`playlist_id` ASC),
  INDEX `fk_thumbnail_video1_idx` (`video_id` ASC),
  CONSTRAINT `fk_thumbnail_channel1`
    FOREIGN KEY (`channel_id`)
    REFERENCES `data_tube`.`channel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_thumbnail_playlist1`
    FOREIGN KEY (`playlist_id`)
    REFERENCES `data_tube`.`playlist` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_thumbnail_video1`
    FOREIGN KEY (`video_id`)
    REFERENCES `data_tube`.`video` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`tag` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`comment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`comment` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`comment` (
  `id` VARCHAR(128) NOT NULL,
  `published_at` DATETIME NOT NULL,
  `video_id` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comment_video1_idx` (`video_id` ASC),
  CONSTRAINT `fk_comment_video1`
    FOREIGN KEY (`video_id`)
    REFERENCES `data_tube`.`video` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`video_has_tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`video_has_tag` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`video_has_tag` (
  `video_id` VARCHAR(64) NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`video_id`, `tag_id`),
  INDEX `fk_video_has_tag_tag1_idx` (`tag_id` ASC),
  INDEX `fk_video_has_tag_video1_idx` (`video_id` ASC),
  CONSTRAINT `fk_video_has_tag_video1`
    FOREIGN KEY (`video_id`)
    REFERENCES `data_tube`.`video` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_video_has_tag_tag1`
    FOREIGN KEY (`tag_id`)
    REFERENCES `data_tube`.`tag` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`playlist_has_video`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`playlist_has_video` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`playlist_has_video` (
  `playlist_id` VARCHAR(64) NOT NULL,
  `video_id` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`playlist_id`, `video_id`),
  INDEX `fk_playlist_has_video_video1_idx` (`video_id` ASC),
  INDEX `fk_playlist_has_video_playlist1_idx` (`playlist_id` ASC),
  CONSTRAINT `fk_playlist_has_video_playlist1`
    FOREIGN KEY (`playlist_id`)
    REFERENCES `data_tube`.`playlist` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_playlist_has_video_video1`
    FOREIGN KEY (`video_id`)
    REFERENCES `data_tube`.`video` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `data_tube`.`region`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`region` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`region` (
  `id` VARCHAR(2) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data_tube`.`video_category_has_region`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `data_tube`.`video_category_has_region` ;

CREATE TABLE IF NOT EXISTS `data_tube`.`video_category_has_region` (
  `video_category_id` VARCHAR(64) NOT NULL,
  `region_id` VARCHAR(2) NOT NULL,
  PRIMARY KEY (`video_category_id`, `region_id`),
  INDEX `fk_video_category_has_region_region1_idx` (`region_id` ASC),
  INDEX `fk_video_category_has_region_video_category1_idx` (`video_category_id` ASC),
  CONSTRAINT `fk_video_category_has_region_video_category1`
    FOREIGN KEY (`video_category_id`)
    REFERENCES `data_tube`.`video_category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_video_category_has_region_region1`
    FOREIGN KEY (`region_id`)
    REFERENCES `data_tube`.`region` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
