-- Migration to create hypertable for metrics table
-- This should be run after the initial Prisma migration
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert metrics table to hypertable
SELECT
    create_hypertable('metrics', 'date');