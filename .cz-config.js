module.exports = {
	allowTicketNumber: true,
	isTicketNumberRequired: true,
	ticketNumberPrefix: 'TRASH-',
	ticketNumberRegExp: '\\d{4,}',
	skipQuestions: ['scope', 'footer', 'breaking'],
	subjectLimit: 80,
	breaklineChar: '|'
}
