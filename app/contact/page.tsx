'use client'

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    packageType: "",
    packageName: "",
    packageDuration: ""
  });

  const searchParams = useSearchParams();
  const prepopulatePackageName = searchParams?.get('packageName');
  const prepopulatePackageType = searchParams?.get('packageType');

  useEffect(() => {
    if (prepopulatePackageName || prepopulatePackageType) {
      setFormData(prev => ({
        ...prev,
        packageName: prepopulatePackageName || prev.packageName,
        packageType: prepopulatePackageType || prev.packageType,
        subject: prepopulatePackageName ? `Inquiry for ${prepopulatePackageName}` : prev.subject
      }));
    }
  }, [prepopulatePackageName, prepopulatePackageType]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      packageType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save enquiry to database
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          packageType: formData.packageType,
          packageName: formData.packageName,
          packageDuration: formData.packageDuration,
          subject: formData.subject,
          message: formData.message,
        }),
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    }

    // Create WhatsApp message with form data
    const whatsappMessage = `Hello! I'm interested in booking a trip with Sky Go.

*Contact Information:*
â€¢ Name: ${formData.name}
â€¢ Email: ${formData.email}
â€¢ Phone: ${formData.phone || 'Not provided'}

*Package Details:*
â€¢ Package Type: ${formData.packageType || 'Not specified'}
â€¢ Package Name: ${formData.packageName || 'Not specified'}
â€¢ Package Duration: ${formData.packageDuration || 'Not specified'}
â€¢ Subject: ${formData.subject}

*Message:*
${formData.message}

Please get back to me with more information about available packages and pricing. Thank you!`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/237683577676?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      packageType: "",
      packageName: "",
      packageDuration: ""
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address Location",
      details: ["Head office- Yaoundé ,Cameroon"],
      description: "Located in the heart of Yaoundé"
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["+237 6 83 57 76 76"],
      description: "Available 24/7 for emergency support"
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["sales@skygovoyages.com"],
      description: "We respond within 24 hours"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 9:00 AM - 4:00 PM"],
      description: "Sunday: Closed"
    }
  ];

  const teamMembers = [
    {
      name: "Customer Support",
      role: "Tour Operations",
      email: "sales@skygovoyages.com",
      phone: "+237 6 83 57 76 76"
    },
    {
      name: "Sky Go Team",
      role: "Customer Relations",
      email: "sales@skygovoyages.com",
      phone: "+237 6 83 57 76 76"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-28 md:py-40 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/360_F_573305992_F4MJgvIVzPZbMywNb3zcBNTw8jkjNbKo.webp')` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#bd9245] font-bold uppercase tracking-[0.3em] text-sm mb-6">Get In Touch</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-[1000] mb-6 leading-none tracking-tighter uppercase">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-2xl mx-auto font-medium">
              Get in touch with us for any questions, custom packages, or travel assistance
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
              <span className="text-white/30">·</span>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Expert Team</span>
              </div>
              <span className="text-white/30">·</span>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Global Reach</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-[#1e1f44] mb-6">
                  Send us a Message via WhatsApp
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+237 6 83 57 76 76"
                          />
                        </div>
                        <div>
                          <label htmlFor="packageType" className="block text-sm font-medium text-gray-700 mb-2">
                            Package Type
                          </label>
                          <Select value={formData.packageType} onValueChange={handleSelectChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select package type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="domestic">Domestic Packages</SelectItem>
                              <SelectItem value="international">International Packages</SelectItem>
                              <SelectItem value="custom">Custom Package</SelectItem>
                              <SelectItem value="general">General Inquiry</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="packageName" className="block text-sm font-medium text-gray-700 mb-2">
                            Package Name
                          </label>
                          <Input
                            id="packageName"
                            name="packageName"
                            type="text"
                            value={formData.packageName}
                            onChange={handleInputChange}
                            placeholder="e.g., Kruger Safari Adventure"
                          />
                        </div>
                        <div>
                          <label htmlFor="packageDuration" className="block text-sm font-medium text-gray-700 mb-2">
                            Package Duration
                          </label>
                          <Input
                            id="packageDuration"
                            name="packageDuration"
                            type="text"
                            value={formData.packageDuration}
                            onChange={handleInputChange}
                            placeholder="e.g., 5 Days / 4 Nights"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What's this about?"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your travel plans, questions, or any specific requirements..."
                          rows={4}
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Opening WhatsApp...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send via WhatsApp
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Map and Team Info */}
              <div className="space-y-8">
                {/* Google Maps */}
                <div>
                  <h2 className="text-3xl font-bold text-[#1e1f44] mb-6">
                    Find Us
                  </h2>
                  <Card>
                    <CardContent className="p-0">
                      <div className="aspect-video">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.0253456789!2d18.4166667!3d33.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc5d123456789%3A0x123456789abcdef!2sV%26A%20Waterfront!5e0!3m2!1sen!2sza!4v1699123456789!5m2!1sen!2sza"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Sky Go Location - Yaoundé, Cameroon"
                        ></iframe>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Head office- Yaoundé, Cameroon
                    </p>
                    <a
                      href="https://www.google.com/maps/search/Yaoundé,+Cameroon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm font-medium mt-2 inline-block"
                    >
                      Open in Google Maps â†’
                    </a>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h2 className="text-3xl font-bold text-[#1e1f44] mb-6">
                    Our Team
                  </h2>
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#1e1f44]">{member.name}</h3>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <a href={`mailto:${member.email}`} className="text-xs text-primary hover:underline">
                                  {member.email}
                                </a>
                                <a href={`tel:${member.phone}`} className="text-xs text-primary hover:underline">
                                  {member.phone}
                                </a>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1f44] mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're here to help you plan your perfect trip. Reach out to us through any of these channels.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <info.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1e1f44] mb-3">
                      {info.title}
                    </h3>
                    <div className="space-y-1 mb-3">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1f44] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Quick answers to common questions about our services
              </p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How far in advance should I book my trip?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We recommend booking at least 2-3 months in advance for domestic packages and 3-6 months for international trips to ensure availability and better prices.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you provide visa assistance?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes, we provide complete visa assistance for all our international packages. Our team will guide you through the entire process and help with documentation.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What is your cancellation policy?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our cancellation policy varies by package type. Generally, cancellations made 30+ days in advance receive a full refund, while closer cancellations may have partial refunds.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer custom packages?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Absolutely! We specialize in creating custom packages tailored to your specific needs, interests, and budget. Contact us to discuss your requirements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Planning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's create the perfect travel experience for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+237683577676">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Us Now
                </Button>
              </a>
              <a href="mailto:sales@skygovoyages.com">
                <Button size="lg" variant="outline" className="bg-white text-black border-gray-200 hover:bg-gray-100">
                  <MessageCircle className="h-5 w-5 mr-2 text-black" />
                  Send Email
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mr-2"></div></div>}>
      <ContactForm />
    </Suspense>
  );
};

export default ContactPage;

