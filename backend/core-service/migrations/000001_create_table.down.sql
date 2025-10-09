DROP TRIGGER IF EXISTS trg_device_insert ON tbl_device;
DROP TRIGGER IF EXISTS trg_device_delete ON tbl_device;
DROP TRIGGER IF EXISTS trg_device_update ON tbl_device;

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

DROP FUNCTION IF EXISTS fn_check_port_validity();
DROP SEQUENCE tbl_log_id_seq;
DROP SEQUENCE tbl_notification_id_seq;
DROP SEQUENCE tbl_device_id_seq;
DROP SEQUENCE tbl_events_id_seq;
DROP SEQUENCE tbl_sensor_data_id_seq;
DROP SEQUENCE tbl_mcu_id_seq;
DROP SEQUENCE pending_actions_id_seq;

SELECT * FROM tbl_mcu WHERE uid = 1;
DELETE FROM tbl_mcu WHERE uid = 1;

