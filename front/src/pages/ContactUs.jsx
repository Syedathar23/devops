import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import useToastStore from '../store/toastStore';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const addToast = useToastStore((s) => s.addToast);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }
    addToast('Message sent successfully! We will get back to you soon.', 'success');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-display font-extrabold text-on-surface">Contact Us</h1>
          <p className="text-body-lg text-on-surface-variant mt-4 max-w-2xl mx-auto">
            Have a question about our products, an order, or your fitness journey? 
            Our expert team is here to help you push beyond limits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-h3 font-bold text-on-surface mb-2">Address</h3>
              <p className="text-body-md text-on-surface-variant">123 Fitness Street,<br/>Mumbai, India 400001</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-h3 font-bold text-on-surface mb-2">Email</h3>
              <p className="text-body-md text-on-surface-variant">support@fitstore.com</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-h3 font-bold text-on-surface mb-2">Phone</h3>
              <p className="text-body-md text-on-surface-variant">+91 1234567890</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 lg:p-12 rounded-xl shadow-sm border border-outline-variant/20">
              <h2 className="text-h2 font-bold text-on-surface mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-label-caps text-on-surface-variant mb-1.5 block uppercase">Full Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-label-caps text-on-surface-variant mb-1.5 block uppercase">Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-label-caps text-on-surface-variant mb-1.5 block uppercase">Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className="text-label-caps text-on-surface-variant mb-1.5 block uppercase">Subject</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange} className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="How can we help you?" />
                  </div>
                </div>
                <div>
                  <label className="text-label-caps text-on-surface-variant mb-1.5 block uppercase">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows="5" className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Tell us more about your inquiry..."></textarea>
                </div>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-lg flex items-center gap-2 transition-colors">
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
