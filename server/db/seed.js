// server/db/seed.js
import pool from "./pool.js";
import bcrypt from "bcrypt";

// CHANGE THIS to whatever the real current user is for seeding DMs
const CURRENT_USER = { username: "Odyssey", email: "odyssey@example.com", password: "password123", avatar: "/Aqua.png" };

async function seed() {
  try {
    console.log("Seeding DB...");

    /* =========================
       DROP TABLES (clean slate)
    ========================= */
    await pool.query(`DROP TABLE IF EXISTS messages;`);
    await pool.query(`DROP TABLE IF EXISTS group_users;`);
    await pool.query(`DROP TABLE IF EXISTS groups;`);
    await pool.query(`DROP TABLE IF EXISTS users;`);

    /* =========================
       USERS TABLE
    ========================= */
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    /* =========================
       GROUPS TABLE
    ========================= */
    await pool.query(`
      CREATE TABLE groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        is_private BOOLEAN DEFAULT FALSE,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    /* =========================
       GROUP_USERS (junction)
    ========================= */
    await pool.query(`
      CREATE TABLE group_users (
        id SERIAL PRIMARY KEY,
        group_id INT REFERENCES groups(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (group_id, user_id)
      );
    `);

    /* =========================
       MESSAGES (group + DM)
    ========================= */
    await pool.query(`
      CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        sender_id INT REFERENCES users(id) ON DELETE CASCADE,
        group_id INT REFERENCES groups(id) ON DELETE CASCADE,
        recipient_id INT REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(sender_id, group_id, recipient_id, content)
      );
    `);

    /* =========================
       SEED USERS
    ========================= */
    const staticUsers = [
      { username: "Alice", email: "alice@example.com", password: "password123", avatar: "/vivi-icon.png" },
      { username: "Kyle", email: "kyle@example.com", password: "password123", avatar: "/Majora.jpg" },
      { username: "Sophie", email: "sophie@example.com", password: "password123", avatar: "/rem.png" },
      { username: "Dan", email: "dan@example.com", password: "password123", avatar: "/Kakashi.png" }
    ];

    const allUsers = [...staticUsers, CURRENT_USER];

    for (const u of allUsers) {
      const hash = await bcrypt.hash(u.password, 10);
      await pool.query(
        `INSERT INTO users (username, email, password, avatar) VALUES ($1, $2, $3, $4)`,
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
        ('Study Groupchat', FALSE, '/study.png');
    `);

    /* =========================
       GROUP MEMBERS
    ========================= */
    await pool.query(`
      INSERT INTO group_users (group_id, user_id)
      VALUES
        ((SELECT id FROM groups WHERE name='Game Groupchat'), (SELECT id FROM users WHERE username='Sophie')),
        ((SELECT id FROM groups WHERE name='Game Groupchat'), (SELECT id FROM users WHERE username='Dan')),
        ((SELECT id FROM groups WHERE name='Game Groupchat'), (SELECT id FROM users WHERE username='${CURRENT_USER.username}')),
        ((SELECT id FROM groups WHERE name='Study Groupchat'), (SELECT id FROM users WHERE username='Alice')),
        ((SELECT id FROM groups WHERE name='Study Groupchat'), (SELECT id FROM users WHERE username='Kyle')),
        ((SELECT id FROM groups WHERE name='Study Groupchat'), (SELECT id FROM users WHERE username='${CURRENT_USER.username}'));
    `);

    /* =========================
       SAMPLE GROUP MESSAGES
       recipient_id = NULL for group messages
    ========================= */
    await pool.query(`
      INSERT INTO messages (sender_id, group_id, recipient_id, content)
      VALUES
        ((SELECT id FROM users WHERE username='Sophie'), (SELECT id FROM groups WHERE name='Game Groupchat'), NULL, 'I can play Baldur''s Gate 3 tonight if everyone is free.'),
        ((SELECT id FROM users WHERE username='Dan'), (SELECT id FROM groups WHERE name='Game Groupchat'), NULL, 'Sounds good to me!'),
        ((SELECT id FROM users WHERE username='${CURRENT_USER.username}'), (SELECT id FROM groups WHERE name='Game Groupchat'), NULL, 'I''m ready too!'),
        ((SELECT id FROM users WHERE username='Alice'), (SELECT id FROM groups WHERE name='Study Groupchat'), NULL, 'Hey Kyle, have you finished the assignment?'),
        ((SELECT id FROM users WHERE username='Kyle'), (SELECT id FROM groups WHERE name='Study Groupchat'), NULL, 'Almost! Just debugging the last API call.');
    `);

    /* =========================
       SAMPLE DM MESSAGES
       Only recipient_id for DMs
    ========================= */
    await pool.query(`
      INSERT INTO messages (sender_id, recipient_id, content)
      VALUES
        ((SELECT id FROM users WHERE username='${CURRENT_USER.username}'), (SELECT id FROM users WHERE username='Alice'), 'Have you watched the latest Hololive streams?'),
        ((SELECT id FROM users WHERE username='Alice'), (SELECT id FROM users WHERE username='${CURRENT_USER.username}'), 'Yes! I loved Gawr Gura''s performance.'),
        ((SELECT id FROM users WHERE username='${CURRENT_USER.username}'), (SELECT id FROM users WHERE username='Kyle'), 'Did you watch the basketball game last night?'),
        ((SELECT id FROM users WHERE username='Kyle'), (SELECT id FROM users WHERE username='${CURRENT_USER.username}'), 'Yeah, it was intense!'),
        ((SELECT id FROM users WHERE username='${CURRENT_USER.username}'), (SELECT id FROM users WHERE username='Sophie'), 'Any good anime recommendations?'),
        ((SELECT id FROM users WHERE username='Sophie'), (SELECT id FROM users WHERE username='${CURRENT_USER.username}'), 'Try "Attack on Titan" and "Jujutsu Kaisen"!'),
        ((SELECT id FROM users WHERE username='${CURRENT_USER.username}'), (SELECT id FROM users WHERE username='Dan'), 'How''s everything going?'),
        ((SELECT id FROM users WHERE username='Dan'), (SELECT id FROM users WHERE username='${CURRENT_USER.username}'), 'Pretty busy but good, thanks for asking!');
    `);

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
