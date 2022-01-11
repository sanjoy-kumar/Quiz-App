-- Drop and recreate Quizzes table (Example)

DROP TABLE IF EXISTS quizzes CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  quiz_type BOOLEAN DEFAULT false,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  modified_date DATE DEFAULT NOW()
);
