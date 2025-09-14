-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create hypertable for metrics if it doesn't exist
DO $ $ BEGIN IF NOT EXISTS (
    SELECT
        1
    FROM
        _timescaledb_catalog.hypertable
    WHERE
        table_name = 'metrics'
        AND schema_name = 'public'
) THEN PERFORM create_hypertable('public.metrics', 'date', if_not_exists = > TRUE);

END IF;

END $ $;