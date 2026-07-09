ALTER TABLE conversations
    ADD COLUMN known_symptoms_json TEXT,
    ADD COLUMN cached_context_json TEXT;