-- Model: true
CREATE TABLE IF NOT EXISTS tbl_mcu (
    id SERIAL PRIMARY KEY,
    uid INT UNIQUE NOT NULL,
    available_port INT[],
    firmware_version VARCHAR(255),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Model: true
CREATE TABLE IF NOT EXISTS tbl_room (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    name VARCHAR(255),
    description TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Model: true
CREATE TABLE IF NOT EXISTS tbl_sensor (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    mid INT NOT NULL,
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

-- Model: true
CREATE TABLE IF NOT EXISTS tbl_device (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    mid INT NOT NULL,
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

-- Model: true
CREATE TABLE IF NOT EXISTS tbl_events (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    did INT,
    action VARCHAR(255),
    payload JSONB,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (did) REFERENCES tbl_device(id) ON DELETE CASCADE
);

-- Model: false
CREATE TABLE IF NOT EXISTS tbl_sensordata (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    sid INT,
    value FLOAT,
    unit VARCHAR(50),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sid) REFERENCES tbl_sensor(id) ON DELETE CASCADE
);

-- Model: true
CREATE TABLE IF NOT EXISTS tbl_log (
    id SERIAL PRIMARY KEY,
    uid INT,
    level VARCHAR(100),
    message TEXT,
    metadata JSONB,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Model: true
CREATE TABLE IF NOT EXISTS tbl_notification (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    type VARCHAR(100),
    message TEXT,
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pending_actions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    mcu_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    payload TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tbl_mcu(uid) ON DELETE CASCADE,
    FOREIGN KEY (mcu_id) REFERENCES tbl_mcu(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_log_uid ON tbl_log(uid);
CREATE INDEX IF NOT EXISTS idx_sensor_uid ON tbl_sensor(uid);
CREATE INDEX IF NOT EXISTS idx_device_uid ON tbl_device(uid);
CREATE INDEX IF NOT EXISTS idx_events_did ON tbl_events(did);
CREATE INDEX IF NOT EXISTS idx_sensorData_sid ON tbl_sensorData(sid);
CREATE INDEX IF NOT EXISTS idx_pending_actions_user_mcu ON pending_actions(user_id, mcu_id);
CREATE INDEX IF NOT EXISTS idx_pending_actions_status ON pending_actions(status);
CREATE INDEX IF NOT EXISTS idx_pending_actions_created_at ON pending_actions(created_at);


-- Khi thêm device -> xóa port khỏi available_port
CREATE OR REPLACE FUNCTION fn_device_insert()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE tbl_mcu
    SET available_port = array_remove(available_port, NEW.port)
    WHERE id = NEW.mid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Khi xóa device -> thêm port lại
CREATE OR REPLACE FUNCTION fn_device_delete()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE tbl_mcu
    SET available_port = array_append(available_port, OLD.port)
    WHERE id = OLD.mid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Khi update port device -> đổi port
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

CREATE OR REPLACE FUNCTION get_used_ports(mcu_id INT)
    RETURNS TABLE (
                      port INT,
                      type INT
                  ) AS $$
BEGIN
    RETURN QUERY
        -- Sensor mapping
        SELECT s.port,
               CASE s.type
                   WHEN 'analog' THEN 1
                   WHEN 'digital' THEN 2
                   WHEN 'nrf24l01' THEN 5
                   WHEN 'bluetooth' THEN 7
                   ELSE 0
                   END AS type
        FROM tbl_sensor s
        WHERE s.mid = mcu_id AND s.port IS NOT NULL

        UNION ALL

        -- Device mapping
        SELECT d.port,
               CASE d.type
                   WHEN 'pwm' THEN 3
                   WHEN 'digital' THEN 4
                   WHEN 'nrf24l01' THEN 6
                   WHEN 'bluetooth' THEN 8
                   ELSE 0
                   END AS type
        FROM tbl_device d
        WHERE d.mid = mcu_id AND d.port IS NOT NULL;
END;
$$ LANGUAGE plpgsql;
