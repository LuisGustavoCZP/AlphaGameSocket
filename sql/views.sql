\i sql/views.sql
CREATE or REPLACE VIEW user_view AS
    SELECT nickname, currency, last_character, 
    FROM users_info
    INNER JOIN user_characters
    ON users_info.user_id = user_characters.user_id;