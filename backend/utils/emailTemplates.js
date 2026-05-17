export const getVerificationEmailTemplate = (name, link) => {
  return `
    <div style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #4f46e5; padding: 40px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">LUXE</h1>
        <p style="color: #c7d2fe; margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">Premium Fitness Gear</p>
      </div>
      <div style="padding: 40px 32px;">
        <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 24px; font-weight: 700; line-height: 1.25;">Verify your email address</h2>
        <p style="color: #4b5563; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">Thank you for joining LUXE! To complete your registration and start shopping for premium fitness essentials, please verify your email address by clicking the button below.</p>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${link}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 32px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 12px; transition: background-color 0.2s;">Verify Email Address</a>
        </div>
        
        <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; line-height: 1.6;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="color: #4f46e5; margin: 0 0 32px 0; font-size: 14px; word-break: break-all;">${link}</p>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 24px;">
        
        <p style="color: #9ca3af; margin: 0; font-size: 12px; line-height: 1.6; text-align: center;">If you didn't create an account with LUXE, you can safely ignore this email.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 24px; text-align: center;">
        <p style="color: #6b7280; margin: 0; font-size: 12px; font-weight: 500;">&copy; 2026 LUXE E-commerce Platform. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getPasswordResetEmailTemplate = (name, link) => {
  return `
    <div style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #111827; padding: 40px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">LUXE</h1>
      </div>
      <div style="padding: 40px 32px;">
        <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">Reset your password</h2>
        <p style="color: #4b5563; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">We received a request to reset your password for your LUXE account. Click the button below to set a new password. This link will expire in 1 hour.</p>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${link}" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 16px 32px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 12px;">Reset Password</a>
        </div>
        
        <p style="color: #6b7280; margin: 0 0 32px 0; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 24px;">
        <p style="color: #9ca3af; margin: 0; font-size: 12px; text-align: center;">&copy; 2026 LUXE Fitness.</p>
      </div>
    </div>
  `;
};
