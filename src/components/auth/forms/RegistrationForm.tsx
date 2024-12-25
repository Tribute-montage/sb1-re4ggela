import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthForm } from './AuthForm';
import { FormInput } from './FormInput';
import { SubmitButton } from './SubmitButton';
import { useRegistration } from '../../../lib/auth/hooks/useRegistration';

interface RegistrationData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationData>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const { register, loading } = useRegistration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AuthForm title="Create your account" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <FormInput
          id="businessName"
          name="businessName"
          label="Business Name"
          required
          value={formData.businessName}
          onChange={handleChange}
          disabled={loading}
        />
        <FormInput
          id="contactName"
          name="contactName"
          label="Contact Name"
          required
          value={formData.contactName}
          onChange={handleChange}
          disabled={loading}
        />
        <FormInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        <FormInput
          id="phone"
          name="phone"
          label="Phone Number"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
          disabled={loading}
        />
        <FormInput
          id="address"
          name="address"
          label="Business Address"
          required
          value={formData.address}
          onChange={handleChange}
          disabled={loading}
        />
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          required
          minLength={8}
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <SubmitButton
        loading={loading}
        loadingText="Creating account..."
        text="Create Account"
      />

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthForm>
  );
}