CREATE TABLE IF NOT EXISTS tbl_mcu (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    available_port INT,
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

CREATE INDEX IF NOT EXISTS idx_log_uid ON tbl_log(uid);
CREATE INDEX IF NOT EXISTS idx_sensor_uid ON tbl_sensor(uid);
CREATE INDEX IF NOT EXISTS idx_device_uid ON tbl_device(uid);
CREATE INDEX IF NOT EXISTS idx_events_did ON tbl_events(did);
CREATE INDEX IF NOT EXISTS idx_sensorData_sid ON tbl_sensorData(sid);

-- Xoa port khi them
CREATE OR REPLACE FUNCTION fn_device_insert()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE tbl_mcu
    SET available_port = array_remove(available_port, NEW.port)
    WHERE id = NEW.mid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Them port khi xoa
CREATE OR REPLACE FUNCTION fn_device_delete()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE tbl_mcu
    SET available_port = array_append(available_port, OLD.port)
    WHERE id = OLD.mid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Hoan doi khi update
CREATE OR REPLACE FUNCTION fn_device_update()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.port <> OLD.port THEN
        UPDATE tbl_mcu
        SET available_port = array_remove(array_append(available_port, OLD.port), NEW.port)
        WHERE id = NEW.mid;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_sensor_insert()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE tbl_mcu
    SET available_port = array_remove(available_port, NEW.port)
    WHERE id = NEW.mid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_sensor_delete()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE tbl_mcu
    SET available_port = array_append(available_port, OLD.port)
    WHERE id = OLD.mid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_sensor_update()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.port <> OLD.port THEN
        UPDATE tbl_mcu
        SET available_port = array_remove(array_append(available_port, OLD.port), NEW.port)
        WHERE id = NEW.mid;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_device_insert
    AFTER INSERT ON tbl_device
    FOR EACH ROW EXECUTE FUNCTION fn_device_insert();

CREATE TRIGGER trg_device_delete
    AFTER DELETE ON tbl_device
    FOR EACH ROW EXECUTE FUNCTION fn_device_delete();

CREATE TRIGGER trg_device_update
    AFTER UPDATE OF port ON tbl_device
    FOR EACH ROW EXECUTE FUNCTION fn_device_update();

CREATE TRIGGER trg_sensor_insert
    AFTER INSERT ON tbl_sensor
    FOR EACH ROW EXECUTE FUNCTION fn_sensor_insert();

CREATE TRIGGER trg_sensor_delete
    AFTER DELETE ON tbl_sensor
    FOR EACH ROW EXECUTE FUNCTION fn_sensor_delete();

CREATE TRIGGER trg_sensor_update
    AFTER UPDATE OF port ON tbl_sensor
    FOR EACH ROW EXECUTE FUNCTION fn_sensor_update();