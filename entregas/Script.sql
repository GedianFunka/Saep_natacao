-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Saep_teste
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Saep_teste
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Saep_teste` DEFAULT CHARACTER SET utf8 ;
USE `Saep_teste` ;

-- -----------------------------------------------------
-- Table `Saep_teste`.`Responsavel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Saep_teste`.`Responsavel` (
  `id_responsavel` INT NOT NULL auto_increment,
  `nome` VARCHAR(45) NOT NULL,
  `CPF` varbinary(255) NOT NULL,
  `e-mail` VARCHAR(45) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_responsavel`),
  UNIQUE INDEX `CPF_UNIQUE` (`CPF` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Saep_teste`.`Filho`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Saep_teste`.`Filho` (
  `id_filho` INT NOT NULL auto_increment,
  `nome` VARCHAR(45) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `nivel_natacao` ENUM('iniciante', 'intermediario', 'avancado') NOT NULL,
  `id_responsavel` INT NOT NULL,
  PRIMARY KEY (`id_filho`),
  INDEX `fk_Filho_Responsavel_idx` (`id_responsavel` ASC) VISIBLE,
  CONSTRAINT `fk_Filho_Responsavel`
    FOREIGN KEY (`id_responsavel`)
    REFERENCES `Saep_teste`.`Responsavel` (`id_responsavel`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Saep_teste`.`Aulas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Saep_teste`.`Aulas` (
  `id_aulas` INT NOT NULL auto_increment,
  `nome_professor` VARCHAR(45) NULL,
  `horario` DATETIME NOT NULL,
  `id_filho` INT NOT NULL,
  PRIMARY KEY (`id_aulas`),
  INDEX `fk_Aulas_Filho1_idx` (`id_filho` ASC) VISIBLE,
  CONSTRAINT `fk_Aulas_Filho1`
    FOREIGN KEY (`id_filho`)
    REFERENCES `Saep_teste`.`Filho` (`id_filho`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Saep_teste`.`Usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Saep_teste`.`Usuarios` (
  `id_usuarios`  INT NOT NULL auto_increment,
  `nome` VARCHAR(45) NULL,
  `login` VARCHAR(50) NULL,
  `senha` VARCHAR(65) NULL,
  PRIMARY KEY (`id_usuarios`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

insert into `saep_teste`.`Responsavel`(`nome`,`CPF`,`e-mail`, `telefone`) values
('Helena Souza', aes_encrypt('111.222.333-44', 'chave123'), 'helena@gmail.com', '(48) 99999-0001'),
('Igor Martins', aes_encrypt('222.333.444-55', 'chave123'), 'igor@gmail.com', '(48) 99999-0002'),
('Joana Lima', aes_encrypt('333.444.555-66', 'chave123'), 'joana@gmail.com', '(48) 99999-0003');

insert into `saep_teste`.`Filho`(`nome`,`data_nascimento`,`nivel_natacao`,`id_responsavel`) values
('Gedian', '2026-11-03', 'iniciante', 1),
('Kauã', '2026-11-04', 'intermediario', 2),
('Weslley', '2026-11-05', 'avancado', 3);

insert into `saep_teste`.`Usuarios`(`nome`,`login`,`senha`) values
('Administrador', 'admin', sha2('123', 256)),
('Bruna Costa', 'bruna', sha2('123', 256)),
('Diego Ramos', 'diego', sha2('123', 256));

insert into `saep_teste`.`Aulas`(`id_filho`,`nome_professor`,`horario`) values
(1,'Willian', '2026-11-11 09:30:00'),
(2, 'Nicolas', '2026-11-12 10:30:00'),
(3, 'Trisotto', '2026-11-10 11:30:00');

select * from responsavel;
select * from filho;
select * from usuarios;
select * from aulas;