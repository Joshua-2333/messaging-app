// server/db/seed.js
import pool from "./pool.js";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("Seeding DB...");

    /* =========================
       0️⃣ Drop all tables
    ========================= */
    await pool.query(`DROP TABLE IF EXISTS messages;`);
    await pool.query(`DROP TABLE IF EXISTS group_users;`);
    await pool.query(`DROP TABLE IF EXISTS groups;`);
    await pool.query(`DROP TABLE IF EXISTS users;`);

    /* =========================
       1️⃣ Create tables
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

    await pool.query(`
      CREATE TABLE groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        is_private BOOLEAN DEFAULT FALSE,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE group_users (
        id SERIAL PRIMARY KEY,
        group_id INT REFERENCES groups(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(group_id, user_id)
      );
    `);

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
       2️⃣ Seed core users
    ========================= */
    const coreUsers = [
      { username: "Alice", email: "alice@example.com", password: "password123", avatar: "/vivi-icon.png" },
      { username: "Kyle", email: "kyle@example.com", password: "password123", avatar: "/Majora.jpg" },
      { username: "Sophie", email: "sophie@example.com", password: "password123", avatar: "/rem.png" },
      { username: "Dan", email: "dan@example.com", password: "password123", avatar: "/Kakashi.png" }
    ];

    for (const u of coreUsers) {
      const hash = await bcrypt.hash(u.password, 10);
      await pool.query(
        `INSERT INTO users (username, email, password, avatar) VALUES ($1,$2,$3,$4)`,
        [u.username, u.email, hash, u.avatar]
      );
    }

    /* =========================
       3️⃣ Seed groups
    ========================= */
    await pool.query(`
      INSERT INTO groups (name, is_private, avatar)
      VALUES
        ('Game Groupchat', FALSE, '/BG3.png'),
        ('Study Groupchat', FALSE, '/study.png');
    `);

    /* =========================
       4️⃣ Add core users to groups
    ========================= */
    const groupMembers = [
      { group: "Game Groupchat", users: ["Sophie", "Dan"] },
      { group: "Study Groupchat", users: ["Alice", "Kyle"] }
    ];

    for (const gm of groupMembers) {
      for (const username of gm.users) {
        await pool.query(`
          INSERT INTO group_users (group_id, user_id)
          VALUES ((SELECT id FROM groups WHERE name=$1), (SELECT id FROM users WHERE username=$2))
        `, [gm.group, username]);
      }
    }

    /* =========================
       5️⃣ Seed group messages
    ========================= */
    await pool.query(`
      INSERT INTO messages (sender_id, group_id, recipient_id, content)
      VALUES
        ((SELECT id FROM users WHERE username='Sophie'), (SELECT id FROM groups WHERE name='Game Groupchat'), NULL, 'I can play Baldur''s Gate 3 tonight if everyone is free.'),
        ((SELECT id FROM users WHERE username='Dan'), (SELECT id FROM groups WHERE name='Game Groupchat'), NULL, 'Sounds good to me!'),
        ((SELECT id FROM users WHERE username='Alice'), (SELECT id FROM groups WHERE name='Study Groupchat'), NULL, 'Hey Kyle, have you finished the assignment?'),
        ((SELECT id FROM users WHERE username='Kyle'), (SELECT id FROM groups WHERE name='Study Groupchat'), NULL, 'Almost! Just debugging the last API call.');
    `);

    /* =========================
       6️⃣ Seed DMs for all other users (Odyssey, etc.)
       Correct timestamp: question first, reply second
    ========================= */
    const defaultAvatar = "/Aqua.png";
    const allUsersRes = await pool.query(`SELECT id, username FROM users`);
    const allUsers = allUsersRes.rows;
    const coreUsernames = coreUsers.map(u => u.username);

    for (const u of allUsers) {
      if (coreUsernames.includes(u.username)) continue;

      // Default avatar
      await pool.query(`UPDATE users SET avatar=$1 WHERE id=$2`, [defaultAvatar, u.id]);

      const dmPairs = [
        ["Alice", `Have you watched the latest Hololive streams?`, `Yes! I loved Gawr Gura's performance!`],
        ["Kyle", `Did you watch the basketball game last night?`, `Yeah, it was intense!`],
        ["Sophie", `Any good anime recommendations?`, `Try "Attack on Titan" and "Jujutsu Kaisen"!`],
        ["Dan", `How's everything going?`, `Pretty busy but good, thanks for asking!`]
      ];

      for (const [coreUser, userMsg, coreReply] of dmPairs) {
        await pool.query(`
          INSERT INTO messages (sender_id, recipient_id, content, created_at)
          VALUES
            ($1, (SELECT id FROM users WHERE username=$2), $3, NOW() - INTERVAL '1 second'),
            ((SELECT id FROM users WHERE username=$2), $1, $4, NOW())
        `, [u.id, coreUser, userMsg, coreReply]);
      }
    }

    /* =========================
       7️⃣ Trigger function for new users
    ========================= */
    await pool.query(`
      CREATE OR REPLACE FUNCTION seed_demo_dms()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.username IN ('Alice','Kyle','Sophie','Dan') THEN
          RETURN NEW;
        END IF;

        UPDATE users SET avatar='/Aqua.png' WHERE id=NEW.id;

        INSERT INTO messages (sender_id, recipient_id, content, created_at)
        VALUES
          (NEW.id, (SELECT id FROM users WHERE username='Alice'), 'Have you watched the latest Hololive streams?', NOW() - INTERVAL '1 second'),
          ((SELECT id FROM users WHERE username='Alice'), NEW.id, 'Yes! I loved Gawr Gura''s performance!', NOW()),
          (NEW.id, (SELECT id FROM users WHERE username='Kyle'), 'Did you watch the basketball game last night?', NOW() - INTERVAL '1 second'),
          ((SELECT id FROM users WHERE username='Kyle'), NEW.id, 'Yeah, it was intense!', NOW()),
          (NEW.id, (SELECT id FROM users WHERE username='Sophie'), 'Any good anime recommendations?', NOW() - INTERVAL '1 second'),
          ((SELECT id FROM users WHERE username='Sophie'), NEW.id, 'Try "Attack on Titan" and "Jujutsu Kaisen"!', NOW()),
          (NEW.id, (SELECT id FROM users WHERE username='Dan'), 'How''s everything going?', NOW() - INTERVAL '1 second'),
          ((SELECT id FROM users WHERE username='Dan'), NEW.id, 'Pretty busy but good, thanks for asking!', NOW());

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER auto_demo_dms
      AFTER INSERT ON users
      FOR EACH ROW
      EXECUTE FUNCTION seed_demo_dms();
    `);

    console.log("✅ Seeding complete!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
