const { Resend } = require('resend');

class EmailService {
    constructor() {
        this.resend = null;
    }

    _initializeResend() {
        if (!this.resend) {
            const apiKey = process.env.RESEND_API_KEY || "";
            console.log('🔑 API Key loaded:', apiKey ? 'Yes' : 'No');
            console.log('🔑 API Key (first 10 chars):', apiKey.substring(0, 10));

            if (!apiKey) {
                throw new Error('RESEND_API_KEY environment variable is required');
            }

            this.resend = new Resend(apiKey);
        }
    }

    async sendEmail({ to, subject, html }) {
        try {
            this._initializeResend();

            console.log('📤 Sending email via Resend SDK...');

            const { data, error } = await this.resend.emails.send({
                from: 'Qloo Trends <onboarding@resend.dev>',
                to: [to],
                subject: subject,
                html: html,
            });

            if (error) {
                console.error('❌ Email send failed:', error);
                return null;
            }

            console.log('✅ Email sent successfully to:', to);
            console.log('📧 Email data:', data);
            return data;
        } catch (error) {
            console.error("❌ Email service error:", error);
            return null;
        }
    }

    // Fallback method using console log for testing without email service
    async sendTestEmail({ to, subject, html }) {
        console.log("📧 TEST EMAIL SIMULATION");
        console.log("To:", to);
        console.log("Subject:", subject);
        console.log("HTML Content Preview:", html.substring(0, 200) + "...");

        // Simulate email sending delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return true;
    }
}

const emailService = new EmailService();

module.exports = { EmailService, emailService };
