// server/db/seed.js
import pool from "./pool.js";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("Seeding DB...");

    /* =========================
       USERS
    ========================= */
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    /* =========================
       GROUPS
    ========================= */
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        is_private BOOLEAN DEFAULT FALSE,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    /* =========================
       GROUP USERS
    ========================= */
    await pool.query(`
      CREATE TABLE IF NOT EXISTS group_users (
        id SERIAL PRIMARY KEY,
        group_id INT REFERENCES groups(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (group_id, user_id)
      );
    `);

    /* =========================
       MESSAGES
       NOTE: Removed ON CONFLICT since messages has no unique constraint
    ========================= */
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INT REFERENCES users(id) ON DELETE CASCADE,
        group_id INT REFERENCES groups(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    /* =========================
       SEED USERS
    ========================= */
    const users = [
      { username: "Alice", email: "alice@example.com", password: "password123", avatar: "/vivi-icon.png" },
      { username: "Kyle", email: "kyle@example.com", password: "password123", avatar: "/Majora.jpg" },
      { username: "Sophie", email: "sophie@example.com", password: "password123", avatar: "/rem.png" },
      { username: "Dan", email: "dan@example.com", password: "password123", avatar: "/Kakashi.png" }
    ];

    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      await pool.query(
        `
        INSERT INTO users (username, email, password, avatar)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        `,
        [u.username, u.email, hash, u.avatar]
      );
    }

    /* =========================
       SEED GROUPS
    ========================= */
    await pool.query(`
      INSERT INTO groups (name, is_private, avatar)
      VALUES
        ('Game Groupchat', FALSE, '/BG3.png'),
        ('Study Groupchat', FALSE, '/study.png')
      ON CONFLICT (name) DO NOTHING;
    `);

    /* =========================
       GROUP MEMBERS
    ========================= */
    await pool.query(`
      INSERT INTO group_users (group_id, user_id)
      VALUES
        (
          (SELECT id FROM groups WHERE name='Game Groupchat'),
          (SELECT id FROM users WHERE username='Sophie')
        ),
        (
          (SELECT id FROM groups WHERE name='Game Groupchat'),
          (SELECT id FROM users WHERE username='Dan')
        ),
        (
          (SELECT id FROM groups WHERE name='Study Groupchat'),
          (SELECT id FROM users WHERE username='Alice')
        ),
        (
          (SELECT id FROM groups WHERE name='Study Groupchat'),
          (SELECT id FROM users WHERE username='Kyle')
        )
      ON CONFLICT DO NOTHING;
    `);

    /* =========================
       SAMPLE MESSAGES
       NOTE: Removed ON CONFLICT here
    ========================= */
    await pool.query(`
      INSERT INTO messages (sender_id, group_id, content)
      VALUES
        (
          (SELECT id FROM users WHERE username='Sophie'),
          (SELECT id FROM groups WHERE name='Game Groupchat'),
          'I can play Baldur''s Gate 3 tonight if everyone is free.'
        ),
        (
          (SELECT id FROM users WHERE username='Dan'),
          (SELECT id FROM groups WHERE name='Game Groupchat'),
          'Sounds good to me!'
        ),
        (
          (SELECT id FROM users WHERE username='Alice'),
          (SELECT id FROM groups WHERE name='Study Groupchat'),
          'Hey Kyle, have you finished the assignment?'
        ),
        (
          (SELECT id FROM users WHERE username='Kyle'),
          (SELECT id FROM groups WHERE name='Study Groupchat'),
          'Almost! Just debugging the last API call.'
        );
    `);

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
