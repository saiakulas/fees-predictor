import { useState, useEffect } from 'react';
import { Globe, AlertCircle, TrendingUp } from 'lucide-react';

function Analyser() {
  const [formData, setFormData] = useState({
    country: '',
    course_type: '',
    specialization: ''
  });
  const [options, setOptions] = useState({
    countries: [],
    course_types: [],
    specializations: []
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch available options when component mounts
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/get_options');
        
        if (!response.ok) {
          throw new Error('Failed to fetch options');
        }
        
        const data = await response.json();
        setOptions(data);
      } catch (err) {
        setError('Failed to load options. Please make sure the server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear previous prediction when form changes
    setPrediction(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/predict_fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }
      
      const data = await response.json();
      setPrediction(data.predicted_fee);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format currency with Rupee symbol
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E34] to-[#252E8A] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto bg-[#F7F6F7] rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
        <div className="p-8 w-full">
          <div className="flex items-center mb-2">
            <Globe className="mr-2 text-[#5A7FC8]" size={24} />
            <div className="uppercase tracking-wide text-sm text-[#252E8A] font-bold">Course Fee Predictor</div>
          </div>
          <h1 className="block mt-1 text-xl leading-tight font-medium text-[#0E0E34]">Estimate Your Education Investment</h1>
          <p className="mt-2 text-gray-600 mb-6">Get an accurate prediction of course fees based on your preferences.</p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-[#9A4D87] p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-[#9A4D87]" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[#9A4D87]">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="country" className="block text-[#0E0E34] text-sm font-medium mb-2">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A7FC8] focus:border-[#5A7FC8] appearance-none bg-no-repeat bg-right"
                style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem"}}
                required
              >
                <option value="">Select Country</option>
                {options.countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="course_type" className="block text-[#0E0E34] text-sm font-medium mb-2">Course Type</label>
              <select
                id="course_type"
                name="course_type"
                value={formData.course_type}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A7FC8] focus:border-[#5A7FC8] appearance-none bg-no-repeat bg-right"
                style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem"}}
                required
              >
                <option value="">Select Course Type</option>
                {options.course_types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="specialization" className="block text-[#0E0E34] text-sm font-medium mb-2">Specialization</label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A7FC8] focus:border-[#5A7FC8] appearance-none bg-no-repeat bg-right"
                style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem"}}
                required
              >
                <option value="">Select Specialization</option>
                {options.specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-[#F7F6F7] bg-[#252E8A] hover:bg-[#5A7FC8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9A4D87] transition-all duration-200 transform hover:-translate-y-px active:translate-y-px ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Calculating...' : 'Predict Fee'}
              </button>
            </div>
          </form>
          
          {success && prediction !== null && (
            <div className="mt-8 bg-[#0E0E34]/5 p-6 rounded-lg border border-[#5A7FC8]/30">
              <h2 className="text-[#5A7FC8] text-sm font-semibold uppercase tracking-wide">Estimated Course Fee</h2>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="flex items-baseline text-2xl font-extrabold text-[#9A4D87]">
                  {formatCurrency(prediction)}
                </div>
                <div className="bg-[#252E8A]/10 rounded-md px-3 py-1 flex items-center">
                  <TrendingUp className="h-4 w-4 text-[#252E8A] mr-1" />
                  <span className="text-xs font-medium text-[#252E8A]">Prediction Complete</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                This is an estimated fee based on the selected parameters. Actual fees may vary.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analyser;