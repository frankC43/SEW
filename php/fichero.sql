-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-12-2024 a las 00:43:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `datosf1`
--

CREATE DATABASE IF NOT EXISTS `datosf1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `datosf1`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escuderia`
--

CREATE TABLE `escuderia` (
  `id` int(11) NOT NULL,
  `nombre_escuderia` varchar(50) NOT NULL,
  `id_pais` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pais`
--

CREATE TABLE `pais` (
  `id` int(11) NOT NULL,
  `nombre_pais` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `piloto`
--

CREATE TABLE `piloto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `nacimiento` date NOT NULL,
  `id_pais` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `piloto_temporada`
--

CREATE TABLE `piloto_temporada` (
  `id_temporada` int(11) NOT NULL,
  `id_piloto` int(11) NOT NULL,
  `id_escuderia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que relaciona la tabla Piloto con la tabla Temporada';


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `temporada`
--

CREATE TABLE `temporada` (
  `id` int(11) NOT NULL,
  `año` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculo`
--

CREATE TABLE `vehiculo` (
  `id` int(11) NOT NULL,
  `nombre_modelo` varchar(50) NOT NULL,
  `id_escuderia` int(11) NOT NULL,
  `id_temporada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `escuderia`
--
ALTER TABLE `escuderia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_escuderia_pais` (`id_pais`);

--
-- Indices de la tabla `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `piloto`
--
ALTER TABLE `piloto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_piloto_pais` (`id_pais`);

--
-- Indices de la tabla `piloto_temporada`
--
ALTER TABLE `piloto_temporada`
  ADD PRIMARY KEY (`id_temporada`,`id_piloto`),
  ADD KEY `fk_piloto` (`id_piloto`),
  ADD KEY `fk_escuderia` (`id_escuderia`);

--
-- Indices de la tabla `temporada`
--
ALTER TABLE `temporada`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_vehiculo_escuderia` (`id_escuderia`),
  ADD KEY `fk_vehiculo_temporada` (`id_temporada`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `escuderia`
--
ALTER TABLE `escuderia`
  ADD CONSTRAINT `fk_escuderia_pais` FOREIGN KEY (`id_pais`) REFERENCES `pais` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `piloto`
--
ALTER TABLE `piloto`
  ADD CONSTRAINT `fk_piloto_pais` FOREIGN KEY (`id_pais`) REFERENCES `pais` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `piloto_temporada`
--
ALTER TABLE `piloto_temporada`
  ADD CONSTRAINT `fk_escuderia` FOREIGN KEY (`id_escuderia`) REFERENCES `escuderia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_piloto` FOREIGN KEY (`id_piloto`) REFERENCES `piloto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_temporada` FOREIGN KEY (`id_temporada`) REFERENCES `temporada` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD CONSTRAINT `fk_vehiculo_escuderia` FOREIGN KEY (`id_escuderia`) REFERENCES `escuderia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vehiculo_temporada` FOREIGN KEY (`id_temporada`) REFERENCES `temporada` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
