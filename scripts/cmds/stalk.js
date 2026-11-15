module.exports = {
  config: {
    name: "stalk",
    aliases: ["info", "profile"],
    version: "1.2",
    author: "FENG (fixed)",
    role: 0,
    countDown: 5,
    category: "info",
    guide: {
      en: "{pn} @user\n{pn} <uid>\nReply + {pn}"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    let uid = null;

    if (event.mentions && Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else if (event.messageReply?.senderID) {
      uid = event.messageReply.senderID;
    } else if (args[0]) {
      uid = args[0].replace(/[^0-9]/g, "");
    }

    if (!uid) return message.reply("❌ Usage: stalk @user / Reply + stalk / stalk <uid>");

    try {
      const info = await api.getUserInfo(uid);
      const user = info[uid];

      if (!user) return message.reply("❌ User not found or can't fetch info");

      const gender = user.gender == 2 ? "Male" : user.gender == 1 ? "Female" : "Unknown";
      const isFriend = user.isFriend ? "Yes" : "No";

      return message.reply(
        `👀 USER INFO\n──────────────\n` +
        `📛 Name: ${user.name}\n` +
        `🆔 UID: ${uid}\n` +
        `⚧ Gender: ${gender}\n` +
        `🤝 Friend: ${isFriend}\n` +
        `🔗 Link: ${user.profileUrl || `https://facebook.com/${uid}`}\n` +
        `📍 Vanish Mode: ${user.isBirthday ? "Yes" : "No"}`
      );

    } catch (e) {
      console.error("[STALK] Error:", e);
      return message.reply("❌ Failed to stalk. User might be private or invalid UID.");
    }
  }
};
