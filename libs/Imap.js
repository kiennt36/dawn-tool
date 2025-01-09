const { ImapFlow } = require("imapflow");

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
    });
  }

  async getMailBoxOpenAsync(path = "INBOX") {
    try {
      await this.client.connect();
      console.log("Đã kết nối tới hộp thư!");

      await this.client.mailboxOpen(path);
      const unseenEmails = await this.client.search({ seen: false });

      if (unseenEmails.length === 0) {
        console.log("Không có email chưa đọc nào.");
      } else {
        // Lấy email mới nhất (cuối danh sách)
        const latestEmailId = unseenEmails[unseenEmails.length - 1];

        // Fetch thông tin chi tiết của email
        const email = await this.client.fetchOne(latestEmailId, {
          envelope: true,
          source: true,
          bodyStructure: true,
        });

        console.log("Subject:", email.envelope.subject);
        console.log(
          "From:",
          email.envelope.from.map((f) => `${f.name} <${f.address}>`).join(", ")
        );
        console.log("Date:", email.envelope.date);

        // Nếu bạn muốn xem nội dung email
        const source = email.source.toString();
        console.log("Email Source:", source);
      }
      await this.client.logout();
      console.log("Đã ngắt kết nối.");
    } catch (error) {
      console.error("Lỗi:", error);
    }
  }
}

module.exports = Imap;
