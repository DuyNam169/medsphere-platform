ALTER TABLE chat_messages
    ADD COLUMN sources_json TEXT,
    ADD COLUMN suggested_specialties_json TEXT,
    ADD COLUMN emergency BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN topic_mismatch BOOLEAN NOT NULL DEFAULT FALSE;