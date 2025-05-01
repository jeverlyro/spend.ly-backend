class AccountController {
  constructor(accountService) {
    this.accountService = accountService;
  }

  async createAccount(req, res) {
    try {
      const { name, type, balance, icon, color } = req.body;

      // Validate input
      if (!name || !type || balance === undefined || !icon || !color) {
        return res.status(400).json({ error: "All fields are required." });
      }

      // Create a new account
      const newAccount = await this.accountService.createAccount({
        name,
        type,
        balance,
        icon,
        color,
      });

      return res.status(201).json(newAccount);
    } catch (error) {
      console.error("Error creating account:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}

module.exports = AccountController;
