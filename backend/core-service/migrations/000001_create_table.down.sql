DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Thêm 3 phòng với ID cố định
INSERT INTO tbl_room (id, uid, name, description)
VALUES 
    (1, 1, 'Khách', 'Phòng khách'),
    (2, 1, 'Ngủ', 'Phòng ngủ'),
    (3, 1, 'Bếp', 'Phòng bếp')
ON CONFLICT (id) DO NOTHING; -- Nếu ID đã tồn tại thì bỏ qua

SELECT * FROM tbl_sensor;

SELECT * FROM tbl_sensordata;

SELECT * FROM pending_actions;

SELECT * FROM tbl_device
WHERE uid = 1;