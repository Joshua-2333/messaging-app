// client/src/mockData/chatData.js

// ===============================
// USER AVATARS (message bubbles)
// ===============================
export const userAvatars = {
  me: "/Aqua.png",
  Alice: "/vivi-icon.png",
  Bob: "/Majora.jpg",
  Sarah: "/Aqua.png",
};

// ===============================
// CONVERSATIONS (sidebar/header)
// ===============================
export const conversations = [
  {
    id: "c1",
    name: "Alice",
    type: "private",
    icon: "/vivi-icon.png", // avatar for sidebar/header
  },
  {
    id: "c2",
    name: "Bob",
    type: "private",
    icon: "/Majora.jpg",
  },
  {
    id: "c3",
    name: "Study Group",
    type: "group",
    icon: "/BG3.png",
  },
];

// ===============================
// MESSAGES
// ===============================
const todayTime = (hour, minute) => {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const messages = [
  // Private chat with Alice
  {
    id: "m1",
    conversationId: "c1",
    sender: "me",
    content: "Hey Alice!",
    timestamp: todayTime(10, 0),
    avatar: userAvatars.me,
  },
  {
    id: "m2",
    conversationId: "c1",
    sender: "Alice",
    content: "Hey! How are you?",
    timestamp: todayTime(10, 1),
    avatar: userAvatars.Alice,
  },

  // Private chat with Bob
  {
    id: "m3",
    conversationId: "c2",
    sender: "me",
    content: "Yo Bob",
    timestamp: todayTime(11, 0),
    avatar: userAvatars.me,
  },
  {
    id: "m4",
    conversationId: "c2",
    sender: "Bob",
    content: "What’s up?",
    timestamp: todayTime(11, 2),
    avatar: userAvatars.Bob,
  },

  // Group chat: Study Group
  {
    id: "m5",
    conversationId: "c3",
    sender: "me",
    content: "Ready to study?",
    timestamp: todayTime(18, 0),
    avatar: userAvatars.me,
  },
  {
    id: "m6",
    conversationId: "c3",
    sender: "Sarah",
    content: "Yep!",
    timestamp: todayTime(18, 5),
    avatar: userAvatars.Sarah,
  },
];
