'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/Admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Mail, CreditCard, Store, Settings as SettingsIcon } from 'lucide-react';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currency: string;
  taxRate: number;
  shippingEnabled: boolean;
  freeShippingThreshold: number;
}

interface PaymentSettings {
  enableCashOnDelivery: boolean;
  enableBkash: boolean;
  enableNagad: boolean;
  bkashNumber: string;
  nagadNumber: string;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  fromName: string;
  enableOrderEmails: boolean;
  enableCustomerEmails: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('store');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'MK Shop',
    storeEmail: 'info@mkshop.com',
    storePhone: '+880123456789',
    storeAddress: {
      street: '123 Main Street',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1000',
      country: 'Bangladesh'
    },
    currency: 'BDT',
    taxRate: 15,
    shippingEnabled: true,
    freeShippingThreshold: 5000
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    enableCashOnDelivery: true,
    enableBkash: true,
    enableNagad: true,
    bkashNumber: '01712345678',
    nagadNumber: '01787654321'
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    fromEmail: 'noreply@mkshop.com',
    fromName: 'MK Shop',
    enableOrderEmails: true,
    enableCustomerEmails: true
  });

  const handleSaveStoreSettings = async () => {
    try {
      setSettingsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/settings/store', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storeSettings)
      });
      
      const data = await response.json();
      if (data.success) {
        setSaveMessage('Store settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        alert('Failed to save store settings: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving store settings:', error);
      alert('Error saving store settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    try {
      setSettingsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/settings/payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentSettings)
      });
      
      const data = await response.json();
      if (data.success) {
        setSaveMessage('Payment settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        alert('Failed to save payment settings: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      alert('Error saving payment settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    try {
      setSettingsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/settings/email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailSettings)
      });
      
      const data = await response.json();
      if (data.success) {
        setSaveMessage('Email settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        alert('Failed to save email settings: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      alert('Error saving email settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const testEmailSettings = async () => {
    try {
      setSettingsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/settings/test-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: emailSettings.fromEmail,
          subject: 'Test Email from MK Shop',
          message: 'This is a test email to verify your email settings are working correctly.'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSaveMessage('Test email sent successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        alert('Failed to send test email: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Error sending test email');
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Settings" 
        description="Configure your store settings and preferences" 
      />
      
      <div className="max-w-7xl mx-auto p-6">
        {saveMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{saveMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'store' ? 'default' : 'outline'}
            onClick={() => setActiveTab('store')}
            className="rounded-r-none"
          >
            <Store className="h-4 w-4 mr-2" />
            Store Settings
          </Button>
          <Button
            variant={activeTab === 'payment' ? 'default' : 'outline'}
            onClick={() => setActiveTab('payment')}
            className="rounded-none"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Settings
          </Button>
          <Button
            variant={activeTab === 'email' ? 'default' : 'outline'}
            onClick={() => setActiveTab('email')}
            className="rounded-l-none"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Settings
          </Button>
        </div>

        {activeTab === 'store' && (
          <Card>
            <CardHeader>
              <CardTitle>Store Configuration</CardTitle>
              <CardDescription>Manage your store information and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Store Name</label>
                  <Input
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                    placeholder="Enter store name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Store Email</label>
                  <Input
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings({...storeSettings, storeEmail: e.target.value})}
                    placeholder="Enter store email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Store Phone</label>
                  <Input
                    value={storeSettings.storePhone}
                    onChange={(e) => setStoreSettings({...storeSettings, storePhone: e.target.value})}
                    placeholder="Enter store phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings({...storeSettings, currency: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="BDT">Bangladeshi Taka (BDT)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Store Address</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={storeSettings.storeAddress.street}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings, 
                      storeAddress: {...storeSettings.storeAddress, street: e.target.value}
                    })}
                    placeholder="Street address"
                  />
                  <Input
                    value={storeSettings.storeAddress.city}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings, 
                      storeAddress: {...storeSettings.storeAddress, city: e.target.value}
                    })}
                    placeholder="City"
                  />
                  <Input
                    value={storeSettings.storeAddress.state}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings, 
                      storeAddress: {...storeSettings.storeAddress, state: e.target.value}
                    })}
                    placeholder="State/Province"
                  />
                  <Input
                    value={storeSettings.storeAddress.zipCode}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings, 
                      storeAddress: {...storeSettings.storeAddress, zipCode: e.target.value}
                    })}
                    placeholder="ZIP/Postal code"
                  />
                  <Input
                    value={storeSettings.storeAddress.country}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings, 
                      storeAddress: {...storeSettings.storeAddress, country: e.target.value}
                    })}
                    placeholder="Country"
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                  <Input
                    type="number"
                    value={storeSettings.taxRate}
                    onChange={(e) => setStoreSettings({...storeSettings, taxRate: Number(e.target.value)})}
                    placeholder="Enter tax rate"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="shipping-enabled"
                    checked={storeSettings.shippingEnabled}
                    onChange={(e) => setStoreSettings({...storeSettings, shippingEnabled: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="shipping-enabled" className="text-sm font-medium">
                    Enable Shipping
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Free Shipping Threshold</label>
                  <Input
                    type="number"
                    value={storeSettings.freeShippingThreshold}
                    onChange={(e) => setStoreSettings({...storeSettings, freeShippingThreshold: Number(e.target.value)})}
                    placeholder="Enter amount"
                    disabled={!storeSettings.shippingEnabled}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveStoreSettings}
                  disabled={settingsLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {settingsLoading ? 'Saving...' : 'Save Store Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>Configure payment methods and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="cod"
                        checked={paymentSettings.enableCashOnDelivery}
                        onChange={(e) => setPaymentSettings({...paymentSettings, enableCashOnDelivery: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="cod" className="font-medium">Cash on Delivery</label>
                    </div>
                    <Badge variant={paymentSettings.enableCashOnDelivery ? "default" : "secondary"}>
                      {paymentSettings.enableCashOnDelivery ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="bkash"
                        checked={paymentSettings.enableBkash}
                        onChange={(e) => setPaymentSettings({...paymentSettings, enableBkash: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="bkash" className="font-medium">bKash</label>
                    </div>
                    <Badge variant={paymentSettings.enableBkash ? "default" : "secondary"}>
                      {paymentSettings.enableBkash ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="nagad"
                        checked={paymentSettings.enableNagad}
                        onChange={(e) => setPaymentSettings({...paymentSettings, enableNagad: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="nagad" className="font-medium">Nagad</label>
                    </div>
                    <Badge variant={paymentSettings.enableNagad ? "default" : "secondary"}>
                      {paymentSettings.enableNagad ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">bKash Number</label>
                  <Input
                    value={paymentSettings.bkashNumber}
                    onChange={(e) => setPaymentSettings({...paymentSettings, bkashNumber: e.target.value})}
                    placeholder="Enter bKash number"
                    disabled={!paymentSettings.enableBkash}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nagad Number</label>
                  <Input
                    value={paymentSettings.nagadNumber}
                    onChange={(e) => setPaymentSettings({...paymentSettings, nagadNumber: e.target.value})}
                    placeholder="Enter Nagad number"
                    disabled={!paymentSettings.enableNagad}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSavePaymentSettings}
                  disabled={settingsLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {settingsLoading ? 'Saving...' : 'Save Payment Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'email' && (
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure email settings and SMTP configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Host</label>
                  <Input
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Port</label>
                  <Input
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: Number(e.target.value)})}
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Username</label>
                  <Input
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Password</label>
                  <Input
                    type="password"
                    value={emailSettings.smtpPass}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPass: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">From Email</label>
                  <Input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    placeholder="noreply@yourstore.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">From Name</label>
                  <Input
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    placeholder="Your Store Name"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="order-emails"
                    checked={emailSettings.enableOrderEmails}
                    onChange={(e) => setEmailSettings({...emailSettings, enableOrderEmails: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="order-emails" className="text-sm font-medium">
                    Send order confirmation emails
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="customer-emails"
                    checked={emailSettings.enableCustomerEmails}
                    onChange={(e) => setEmailSettings({...emailSettings, enableCustomerEmails: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="customer-emails" className="text-sm font-medium">
                    Send customer notification emails
                  </label>
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={testEmailSettings}
                  disabled={settingsLoading}
                >
                  {settingsLoading ? 'Sending...' : 'Send Test Email'}
                </Button>
                <Button 
                  onClick={handleSaveEmailSettings}
                  disabled={settingsLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {settingsLoading ? 'Saving...' : 'Save Email Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
