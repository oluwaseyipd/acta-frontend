# EmailJS Setup Guide

This guide will help you set up EmailJS to handle contact form submissions in your React application.

## 📧 What is EmailJS?

EmailJS allows you to send emails directly from your frontend application without a backend server. It's perfect for contact forms, feedback forms, and notifications.

## 🚀 Quick Setup

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Set Up Email Service

1. **Go to Email Services**
   - In your EmailJS dashboard, click on "Email Services"
   - Click "Add New Service"

2. **Choose Your Email Provider**
   - Gmail (recommended for testing)
   - Outlook
   - Yahoo
   - Custom SMTP
   - And many more...

3. **Configure the Service**
   - For Gmail:
     - Enter your Gmail address
     - Use App Password (not your regular password)
     - [How to create Gmail App Password](https://support.google.com/accounts/answer/185833)
   - Give your service a name
   - Copy the **Service ID** (you'll need this later)

### Step 3: Create Email Template

1. **Go to Email Templates**
   - Click on "Email Templates"
   - Click "Create New Template"

2. **Design Your Template**
   ```html
   Subject: New Contact Form Submission from {{from_name}}
   
   Hello {{to_name}},
   
   You have received a new message from your website contact form:
   
   From: {{from_name}}
   Email: {{from_email}}
   Subject: {{subject}}
   
   Message:
   {{message}}
   
   ---
   This message was sent from your website contact form.
   Reply to: {{reply_to}}
   ```

3. **Template Variables**
   The following variables are automatically populated:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content
   - `{{to_name}}` - Recipient name (your name/company)
   - `{{reply_to}}` - Reply-to email address

4. **Save and Copy Template ID**
   - Save your template
   - Copy the **Template ID** (you'll need this later)

### Step 4: Get Your Public Key

1. **Go to Account Settings**
   - Click on your profile/account settings
   - Find "API Keys" section
   - Copy your **Public Key** (User ID)

### Step 5: Configure Environment Variables

1. **Create/Update `.env` file** in your project root:
   ```env
   # EmailJS Configuration
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

2. **Replace the values** with your actual IDs:
   - `your_service_id_here` → Your Service ID from Step 2
   - `your_template_id_here` → Your Template ID from Step 3
   - `your_public_key_here` → Your Public Key from Step 4

## 🧪 Testing Your Setup

### Test in Development

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Check browser console**
   - Navigate to `/contact`
   - Open browser developer tools
   - Check console for configuration status

3. **Submit test form**
   - Fill out the contact form
   - Submit it
   - Check your email for the message

### Common Test Issues

- **Configuration errors**: Check console for missing environment variables
- **Email not received**: Check spam folder, verify email service setup
- **Template errors**: Verify template variables match your form data

## 🔧 Advanced Configuration

### Custom Email Templates

You can create multiple templates for different purposes:

```typescript
// Different templates for different form types
const TEMPLATES = {
  CONTACT: 'template_contact_123',
  SUPPORT: 'template_support_456',
  FEEDBACK: 'template_feedback_789'
};
```

### Error Handling

The implementation includes comprehensive error handling:

- Configuration validation
- Network error handling
- User-friendly error messages
- Fallback contact information

### Rate Limiting

EmailJS has rate limits on the free plan:
- 200 emails/month (free plan)
- 1000 emails/month (paid plans)

### Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Rate Limiting**: Implement client-side rate limiting
3. **Validation**: Always validate form data
4. **Spam Protection**: Consider adding CAPTCHA for production

## 🚨 Troubleshooting

### Common Issues

**1. "EmailJS is not configured" error**
- Check your `.env` file exists
- Verify all three variables are set
- Restart your development server

**2. "Failed to send email" error**
- Verify your Service ID is correct
- Check your email service configuration
- Test with a simple template first

**3. Emails not received**
- Check spam/junk folder
- Verify your email service is working
- Test with your own email first

**4. Template variables not working**
- Ensure variable names match exactly
- Check for typos in template
- Use double curly braces: `{{variable_name}}`

### Debug Mode

Enable debug logging in development:

```typescript
// In your .env file
VITE_APP_ENV=development
```

This will log detailed information to the browser console.

### Getting Help

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Community Forum](https://www.emailjs.com/community)
- [Contact EmailJS Support](https://www.emailjs.com/contact)

## 📊 Monitoring

### EmailJS Dashboard

Monitor your email usage in the EmailJS dashboard:
- Email count and limits
- Success/failure rates
- Template usage statistics
- Service performance

### Application Monitoring

The implementation includes:
- Success/error tracking with toast notifications
- Console logging for debugging
- Configuration validation
- Graceful error handling

## 🔄 Deployment Notes

### Environment Variables in Production

Make sure to set your environment variables in your hosting platform:

- **Vercel**: Add to project settings → Environment Variables
- **Netlify**: Add to site settings → Environment Variables  
- **Railway**: Add to project → Variables
- **Heroku**: Add to app → Settings → Config Vars

### CORS Configuration

EmailJS handles CORS automatically, but make sure:
- Your domain is registered with EmailJS
- No ad blockers are blocking EmailJS requests
- Your hosting platform allows external API calls

## 💡 Tips for Success

1. **Test Early**: Set up and test EmailJS early in development
2. **Use Templates**: Create reusable email templates
3. **Monitor Usage**: Keep track of your email quota
4. **User Feedback**: Provide clear success/error messages
5. **Fallback Options**: Always provide alternative contact methods

## 🎯 Next Steps

After setting up EmailJS:

1. **Test thoroughly** with different email providers
2. **Set up monitoring** and alerts
3. **Consider upgrading** to a paid plan for production
4. **Implement additional features** like file attachments
5. **Add analytics** to track form submissions

---

Your contact form is now fully functional with EmailJS! 🎉