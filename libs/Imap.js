const { ImapFlow } = require("imapflow");
const { simpleParser } = require('mailparser');

class Imap {
  constructor(host, username, password) {
    this.client = new ImapFlow({
      host: host,
      port: 993,
      secure: true,
      auth: {
        user: username,
        pass: password,
      },
      logger: false
    });
  }

  async getMailBoxOpenAsync(path = "INBOX", query) {
    const queryOptions ={
      ...query
    }

    try {
      await this.client.connect();
      console.log("Đã kết nối tới hộp thư!");

      await this.client.mailboxOpen(path);
      const messages = await this.client.search(queryOptions);
      console.log("🚀 ~ Imap ~ getMailBoxOpenAsync ~ messages:", messages)

      if (messages.length > 0) {
        // Lấy UID email mới nhất
        const latestUID = messages[messages.length - 1];

        // Lấy thông tin email mới nhất
        const message = await this.client.fetchOne(latestUID, { envelope: true, source: true });
        const rawSource = message.source;

        // Giải mã email bằng mailparser
        const parsed = await simpleParser(rawSource);
        const emailContent = parsed.text; // Nội dung email đã giải mã

        const linkRegex = /\[?(https:\/\/u31952478\.ct\.sendgrid\.net[^\s\]]+)\]?/g;

        const links = [];
        let match;
        
        while ((match = linkRegex.exec(emailContent)) !== null) {
            links.push(match[1]); // Lưu lại link mà không có dấu ngoặc vuông
        }

        if (links) {
          console.log('Các link tìm thấy:', links);
        } else {
            console.log('Không tìm thấy link nào bắt đầu với "https://u31952478.ct.sendgrid.net".');
        }
        // console.log('Email mới nhất từ hello@dawninternet.com:', message.source.toString('utf-8'));
      } else {
          console.error(`Không tìm thấy email nào từ ${query?.from}.`);
      }
      await this.client.logout();
      console.log("Đã ngắt kết nối.");
    } catch (error) {
      console.error("Lỗi:", error);
    }
  }
}

module.exports = Imap;
