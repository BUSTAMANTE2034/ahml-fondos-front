-- DATABASE: Archivo Documental Municipal
--  Carlos Eduardo Bustamante Servín

CREATE DATABASE IF NOT EXISTS archivo_municipal;
USE archivo_municipal;

-- user
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id = db.Column(db.String(20), unique=True, nullable=False)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role ENUM('admin','manager','archivist','visitor') DEFAULT 'visitor',
    first_login BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

-- catalog_key
CREATE TABLE catalog_key (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    entity_type ENUM('fund','section','series') NOT NULL,
    `key` VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- fund
CREATE TABLE fund (
    id INT AUTO_INCREMENT PRIMARY KEY,
    catalog_key_id INT,
    user_id INT,
    name VARCHAR(200) NOT NULL,
    acronym VARCHAR(50),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (catalog_key_id) REFERENCES catalog_key(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- section
CREATE TABLE section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    catalog_key_id INT,
    user_id INT,
    name VARCHAR(200) NOT NULL,
    acronym VARCHAR(50),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (catalog_key_id) REFERENCES catalog_key(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- series
CREATE TABLE series (
    id INT AUTO_INCREMENT PRIMARY KEY,
    catalog_key_id INT,
    fund_id INT,
    user_id INT,
    name VARCHAR(200) NOT NULL,
    acronym VARCHAR(50),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (catalog_key_id) REFERENCES catalog_key(id),
    FOREIGN KEY (fund_id) REFERENCES fund(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- location
CREATE TABLE location (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    user_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- deterioration
CREATE TABLE deterioration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

-- typology
CREATE TABLE typology (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

-- record_file
CREATE TABLE record_file (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_code VARCHAR(150) UNIQUE NOT NULL,
    file_number VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    sensitive_data BOOLEAN DEFAULT FALSE,
    comments TEXT,
    availability_status ENUM('available','unavailable','under_review','on_loan') DEFAULT 'available',

    user_id INT,
    fund_id INT,
    section_id INT,
    series_id INT,
    location_id INT,

    box_number VARCHAR(50),
    page_count INT,
    file_date DATE,
    last_preservation_date DATE,
    last_fund_date DATE,
    deterioration_status_id INT,
    deterioration_status_updated_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (fund_id) REFERENCES fund(id),
    FOREIGN KEY (section_id) REFERENCES section(id),
    FOREIGN KEY (series_id) REFERENCES series(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    FOREIGN KEY (deterioration_status_id) REFERENCES deterioration(id)
);

-- record_file_typology
CREATE TABLE record_file_typology (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_file_id INT,
    typology_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (record_file_id) REFERENCES record_file(id),
    FOREIGN KEY (typology_id) REFERENCES typology(id)
);

-- movement_history
CREATE TABLE movement_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_file_id INT,
    moved_by_user_id INT,
    description TEXT,
    origin_status ENUM('archive','review','preservation','restoration'),
    destination_status ENUM('archive','review','preservation','restoration'),
    moved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (record_file_id) REFERENCES record_file(id),
    FOREIGN KEY (moved_by_user_id) REFERENCES user(id)
);

-- loan
CREATE TABLE loan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_file_id INT,
    issued_by_user_id INT,
    loaded_by_user_id INT,
    description TEXT,
    loaded_at DATETIME,
    returned_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (record_file_id) REFERENCES record_file(id),
    FOREIGN KEY (issued_by_user_id) REFERENCES user(id),
    FOREIGN KEY (loaded_by_user_id) REFERENCES user(id)
);
