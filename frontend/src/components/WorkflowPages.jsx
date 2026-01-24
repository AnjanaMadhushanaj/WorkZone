import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CheckCircle, CreditCard, Wallet, Clock, Briefcase } from 'lucide-react';

// Participate Page (Receipt View)
export const ParticipatePage = ({ appState }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = appState.jobs.find(j => j.id === parseInt(id));
  const [done, setDone] = useState(false);

  const handleDone = () => {
    setDone(true);
    setTimeout(() => navigate(`/card-details/${id}`), 500);
  };

  if (!job) return <div>Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Work Receipt</h1>
            <p className="text-gray-500">Complete your work and submit</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Job Description</h3>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Rate</p>
                <p className="text-lg font-bold text-gray-900">{job.rate}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Payout Schedule</p>
                <p className="text-lg font-bold text-green-600">Daily payout (processed every 24h)</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDone}
            disabled={done}
            className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {done ? 'Proceeding...' : 'Mark as Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Card Details Page
export const CardDetailsPage = ({ appState }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  const job = appState.jobs.find(j => j.id === parseInt(id));

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleRequestMoney = () => {
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {
      alert('Please fill all card details');
      return;
    }

    // Add to pending payments
    const newPayment = {
      id: Date.now(),
      jobId: parseInt(id),
      jobTitle: job.title,
      userName: 'Current User',
      userEmail: 'user@example.com',
      payoutSchedule: 'Daily',
      cardDetails: cardDetails,
      status: 'pending'
    };

    appState.addPendingPayment(newPayment);
    setShowPopup(true);

    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
          <div className="flex items-center gap-3 mb-8">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
              <p className="text-sm text-gray-500">Add your card details for payment</p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Payout Schedule</p>
            <p className="text-lg font-semibold text-purple-600">Payments are processed daily for approved work</p>
          </div>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
              <input
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleChange}
                type="text"
                maxLength="16"
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
              <input
                name="cardName"
                value={cardDetails.cardName}
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                <input
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleChange}
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                <input
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleChange}
                  type="text"
                  maxLength="3"
                  placeholder="123"
                  className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleRequestMoney}
            className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Request Money
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-600">Your money will be returned soon</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Company Dashboard with Job Requests and Pending Transactions
export const CompanyDashboard = ({ appState }) => {
  const handleApprove = (applicationId) => {
    appState.approveApplication(applicationId);
  };

  const handleTransfer = (paymentId) => {
    appState.transferPayment(paymentId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-gray-500">Manage applications and payments</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Wallet Balance</p>
            <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-600" />
              ${appState.companyWallet}
            </p>
          </div>
        </div>

        {/* Job Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg">Job Requests</h3>
            <p className="text-sm text-gray-500">Approve or reject job applications</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4 font-semibold">User</th>
                  <th className="px-8 py-4 font-semibold">Job Title</th>
                  <th className="px-8 py-4 font-semibold">Date Applied</th>
                  <th className="px-8 py-4 font-semibold">Payout Schedule</th>
                  <th className="px-8 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appState.applications.filter(app => app.status === 'pending').map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{app.userName}</p>
                        <p className="text-xs text-gray-400">{app.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-600">{app.jobTitle}</td>
                    <td className="px-8 py-4 text-sm text-gray-500">{app.date}</td>
                    <td className="px-8 py-4 text-sm text-gray-500">Daily payout schedule</td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appState.applications.filter(app => app.status === 'pending').length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No pending job requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg">Pending Transactions</h3>
            <p className="text-sm text-gray-500">Transfer payments to users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4 font-semibold">User</th>
                  <th className="px-8 py-4 font-semibold">Job Title</th>
                  <th className="px-8 py-4 font-semibold">Payout Schedule</th>
                  <th className="px-8 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appState.pendingPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{payment.userName}</p>
                        <p className="text-xs text-gray-400">{payment.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-600">{payment.jobTitle}</td>
                    <td className="px-8 py-4 text-sm text-gray-600">Daily payout schedule</td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => handleTransfer(payment.id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                      >
                        Transfer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appState.pendingPayments.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No pending transactions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// User Dashboard with Wallet and Pending Money
export const UserDashboard = ({ appState }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Wallet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-8 h-8" />
              <h3 className="text-lg font-bold">My Wallet</h3>
            </div>
            <p className="text-4xl font-bold">${appState.userWallet}</p>
            <p className="text-sm opacity-80 mt-2">Available Balance</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-orange-500" />
              <h3 className="text-lg font-bold text-gray-900">Pending Money</h3>
            </div>
            <p className="text-4xl font-bold text-orange-500">${appState.pendingMoney}</p>
            <p className="text-sm text-gray-500 mt-2">Awaiting Transfer</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-green-500" />
              <h3 className="text-lg font-bold text-gray-900">Active Jobs</h3>
            </div>
            <p className="text-4xl font-bold text-green-500">{appState.applications.filter(a => a.status === 'approved').length}</p>
            <p className="text-sm text-gray-500 mt-2">Currently Working</p>
          </div>
        </div>

        {/* My Applications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg">My Applications</h3>
            <p className="text-sm text-gray-500">Track your job applications</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4 font-semibold">Job Title</th>
                  <th className="px-8 py-4 font-semibold">Company</th>
                  <th className="px-8 py-4 font-semibold">Status</th>
                  <th className="px-8 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appState.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4 font-semibold text-gray-800 text-sm">{app.jobTitle}</td>
                    <td className="px-8 py-4 text-sm text-gray-600">{app.company}</td>
                    <td className="px-8 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        app.status === 'approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      {app.status === 'approved' && (
                        <Link
                          to={`/participate/${app.jobId}`}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition inline-block"
                        >
                          Participate
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
