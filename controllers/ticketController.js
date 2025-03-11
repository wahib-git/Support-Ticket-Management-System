exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      createdBy: req.user._id,
    });

    // Envoi de notification email
    await sendTicketCreatedEmail(req.user.email, ticket._id);

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
