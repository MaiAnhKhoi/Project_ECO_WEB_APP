-- Migration: Add disable_safety_warning column to stocks table
-- Date: 2025-12-11
-- Description: Thêm column để có thể tắt cảnh báo safety stock cho từng variant

-- Thêm column mới
ALTER TABLE stocks 
ADD COLUMN disable_safety_warning TINYINT(1) DEFAULT 0 
AFTER safety_stock;

-- Update existing records to have default value
UPDATE stocks 
SET disable_safety_warning = 0 
WHERE disable_safety_warning IS NULL;

-- Verify
SELECT COUNT(*) as total_stocks, 
       SUM(CASE WHEN disable_safety_warning = 0 THEN 1 ELSE 0 END) as warnings_enabled,
       SUM(CASE WHEN disable_safety_warning = 1 THEN 1 ELSE 0 END) as warnings_disabled
FROM stocks;

