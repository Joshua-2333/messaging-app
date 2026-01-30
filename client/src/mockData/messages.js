// client/src/mockData/messages.js

// Mock conversations
export const mockConversations = [
  {
    id: "c1",
    name: "Alice",
    type: "private",
  },
  {
    id: "c2",
    name: "Bob",
    type: "private",
  },
  {
    id: "c3",
    name: "Game Night",
    type: "group",
  },
];

// Helper to generate ISO timestamp for today at a given hour and minute
const todayTime = (hour, minute) => {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

// Mock messages
export const mockMessages = [
  // Private chat with Alice
  {
    id: "m1",
    conversationId: "c1",
    sender: "Alice",
    content: "Hey Alice!",
    timestamp: todayTime(10, 0),
  },
  {
    id: "m2",
    conversationId: "c1",
    sender: "Me",
    content: "Hey! How’s it going?",
    timestamp: todayTime(10, 1),
  },

  // Private chat with Bob
  {
    id: "m3",
    conversationId: "c2",
    sender: "Me",
    content: "Hi Bob!",
    timestamp: todayTime(11, 0),
  },

  // Group chat: Game Night
  {
    id: "m4",
    conversationId: "c3",
    sender: "Me",
    content: "Hey team, what time are we all getting on so we can play Baldur's Gate 3?",
    timestamp: todayTime(18, 0),
  },
  {
    id: "m5",
    conversationId: "c3",
    sender: "Bob",
    content: "I’m free around 7 PM, works for me!",
    timestamp: todayTime(18, 5),
  },
  {
    id: "m6",
    conversationId: "c3",
    sender: "Alice",
    content: "Same here, let’s meet in the lobby at 7 then.",
    timestamp: todayTime(18, 7),
  },
];
