CREATE DATABASE IF NOT EXISTS usof_db;

CREATE USER IF NOT EXISTS 'usof_user'@'localhost' IDENTIFIED BY '$UsofPass777';
GRANT ALL PRIVILEGES ON usof_db.* TO 'usof_user'@'localhost';
FLUSH PRIVILEGES;

USE usof_db;
