CREATE or REPLACE VIEW match_view AS
    SELECT id, started_at, finished_at,
    FROM matchs
    INNER JOIN match_users
    ON users_info.user_id = user_characters.user_id;
