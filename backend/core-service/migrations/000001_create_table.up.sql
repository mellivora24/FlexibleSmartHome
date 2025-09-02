CREATE TABLE IF NOT EXISTS tbl_mcu (
                                       id SERIAL PRIMARY KEY,
                                       uid INT NOT NULL,
                                       port INT,
                                       firmware_version VARCHAR(255),
                                       create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_room (
                                        id SERIAL PRIMARY KEY,
                                        uid INT NOT NULL,
                                        name VARCHAR(255),
                                        description TEXT,
                                        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_sensor (
                                          id SERIAL PRIMARY KEY,
                                          uid INT NOT NULL,
                                          mid INT,
                                          rid INT,
                                          name VARCHAR(255),
                                          type VARCHAR(255),
                                          port INT,
                                          status BOOLEAN,
                                          running_time INT DEFAULT 0,
                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          FOREIGN KEY (mid) REFERENCES tbl_mcu(id) ON DELETE CASCADE,
                                          FOREIGN KEY (rid) REFERENCES tbl_room(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tbl_device (
                                          id SERIAL PRIMARY KEY,
                                          uid INT NOT NULL,
                                          mid INT,
                                          rid INT,
                                          name VARCHAR(255),
                                          type VARCHAR(255),
                                          port INT,
                                          status BOOLEAN,
                                          data JSONB,
                                          running_time INT DEFAULT 0,
                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          FOREIGN KEY (mid) REFERENCES tbl_mcu(id) ON DELETE CASCADE,
                                          FOREIGN KEY (rid) REFERENCES tbl_room(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tbl_events (
                                          id SERIAL PRIMARY KEY,
                                          uid INT NOT NULL,
                                          did INT,
                                          action VARCHAR(255),
                                          payload JSONB,
                                          create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          FOREIGN KEY (did) REFERENCES tbl_device(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tbl_sensorData (
                                              id SERIAL PRIMARY KEY,
                                              uid INT NOT NULL,
                                              sid INT,
                                              value FLOAT,
                                              unit VARCHAR(50),
                                              create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                              FOREIGN KEY (sid) REFERENCES tbl_sensor(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tbl_log (
                                       id SERIAL PRIMARY KEY,
                                       uid INT,
                                       level VARCHAR(100),
                                       message TEXT,
                                       metadata JSONB,
                                       create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_notification (
                                                id SERIAL PRIMARY KEY,
                                                uid INT NOT NULL,
                                                type VARCHAR(100),
                                                message TEXT,
                                                metadata JSONB,
                                                is_read BOOLEAN DEFAULT FALSE,
                                                create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sensor_uid ON tbl_sensor(uid);
CREATE INDEX idx_device_uid ON tbl_device(uid);
CREATE INDEX idx_sensorData_sid ON tbl_sensorData(sid);
CREATE INDEX idx_events_did ON tbl_events(did);
CREATE INDEX idx_log_uid ON tbl_log(uid);