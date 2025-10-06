DROP TRIGGER IF EXISTS trg_device_insert ON tbl_device;
DROP TRIGGER IF EXISTS trg_device_delete ON tbl_device;
DROP TRIGGER IF EXISTS trg_device_update ON tbl_device;

DROP TRIGGER IF EXISTS trg_sensor_insert ON tbl_sensor;
DROP TRIGGER IF EXISTS trg_sensor_delete ON tbl_sensor;
DROP TRIGGER IF EXISTS trg_sensor_update ON tbl_sensor;

DROP FUNCTION IF EXISTS fn_device_insert();
DROP FUNCTION IF EXISTS fn_device_delete();
DROP FUNCTION IF EXISTS fn_device_update();
DROP FUNCTION IF EXISTS fn_sensor_insert();
DROP FUNCTION IF EXISTS fn_sensor_delete();
DROP FUNCTION IF EXISTS fn_sensor_update();
DROP FUNCTION IF EXISTS get_used_ports(INT);
DROP FUNCTION IF EXISTS get_available_ports(INT);

DROP TABLE IF EXISTS tbl_sensor_data CASCADE;
DROP TABLE IF EXISTS tbl_events CASCADE;
DROP TABLE IF EXISTS tbl_sensor CASCADE;
DROP TABLE IF EXISTS tbl_device CASCADE;
DROP TABLE IF EXISTS tbl_notification CASCADE;
DROP TABLE IF EXISTS tbl_log CASCADE;
DROP TABLE IF EXISTS pending_actions CASCADE;
DROP TABLE IF EXISTS tbl_mcu CASCADE;

SELECT id FROM tbl_sensor;

