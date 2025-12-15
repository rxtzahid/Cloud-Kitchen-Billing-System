import React from 'react';

const InvoiceView = ({ bill, onClose }) => {
  if (!bill) return null;

  // Check if it's corporate or event bill
  const isCorporate = bill.billingType === 'Corporate';
  
  // Format date function
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Invoice Header */}
        <div className="p-8">
          {/* Company Header */}
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800">Cloud Kitchen Limited</h1>
            <p className="text-gray-600">Dhaka, Bangladesh</p>
            <p className="text-gray-600">Phone: +88017xxxxxxx</p>
            <p className="text-gray-600 mt-2">Email: billing@cloudkitchen.com</p>
          </div>

          {/* Invoice Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">TAX INVOICE</h2>
            <p className="text-gray-600">Billing System</p>
          </div>

          {/* Bill Info */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold">Invoice No: <span className="font-normal">{bill.id}</span></p>
                <p className="font-semibold">Invoice Date: <span className="font-normal">{formatDate(bill.billingDate || bill.eventDate)}</span></p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="border p-4 rounded mb-6">
              <h3 className="font-bold text-lg mb-2">Bill To:</h3>
              <p><strong>Name:</strong> {bill.corporateName || bill.eventName}</p>
              <p><strong>Contact Person:</strong> {bill.contactPerson}</p>
              <p><strong>Contact No:</strong> {bill.contactNo}</p>
              <p><strong>Billing Type:</strong> {bill.billingType}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4">
              {isCorporate ? 'Service Details' : 'Package Details'}
            </h3>
            
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">SL No.</th>
                  {isCorporate ? (
                    <>
                      <th className="border p-2 text-left">Service Date</th>
                      <th className="border p-2 text-left">Package Type</th>
                    </>
                  ) : (
                    <>
                      <th className="border p-2 text-left">Package Name</th>
                      <th className="border p-2 text-left">Food Items</th>
                    </>
                  )}
                  <th className="border p-2 text-left">Persons</th>
                  <th className="border p-2 text-left">Unit Price (BDT)</th>
                  <th className="border p-2 text-left">Total (BDT)</th>
                </tr>
              </thead>
              <tbody>
                {isCorporate ? (
                  bill.lineItems.map((item, index) => (
                    <tr key={item.id} className="border">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{formatDate(item.serviceDate)}</td>
                      <td className="border p-2">{item.packageType.charAt(0).toUpperCase() + item.packageType.slice(1)}</td>
                      <td className="border p-2 text-right">{item.persons}</td>
                      <td className="border p-2 text-right">{item.unitPrice.toFixed(2)}</td>
                      <td className="border p-2 text-right font-semibold">{item.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  bill.packages.map((item, index) => (
                    <tr key={item.id} className="border">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{item.packageName}</td>
                      <td className="border p-2">{item.foodItems}</td>
                      <td className="border p-2 text-right">{item.persons}</td>
                      <td className="border p-2 text-right">{item.unitPrice.toFixed(2)}</td>
                      <td className="border p-2 text-right font-semibold">{item.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="border p-6 rounded mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg mb-2">Summary</h3>
                <p><strong>Number of Packages:</strong> {bill.totalPackages}</p>
                <p><strong>Total Persons:</strong> {
                  isCorporate 
                    ? bill.lineItems.reduce((sum, item) => sum + item.persons, 0)
                    : bill.packages.reduce((sum, item) => sum + item.persons, 0)
                }</p>
              </div>
              
              <div className="text-right">
                <div className="mb-4">
                  <p className="text-lg"><strong>Subtotal:</strong> BDT {bill.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">(Excluding VAT/Tax)</p>
                </div>
                
                <div className="text-2xl font-bold border-t pt-4">
                  <p>Total Amount: BDT {bill.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="border p-4 rounded mb-8">
            <h3 className="font-bold mb-2">Amount in Words:</h3>
            <p className="text-lg italic">{bill.amountInWords}</p>
          </div>

          {/* Footer */}
          <div className="border-t pt-8 text-center">
            <div className="mb-4">
              <p className="font-bold">Thank you for your business!</p>
              <p className="text-gray-600">For any queries, contact: billing@cloudkitchen.com</p>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 mt-8">
              <div className="text-left">
                <p>Authorized Signature</p>
                <div className="h-16 border-t mt-2"></div>
                <p>________________________</p>
                <p>Accounts Department</p>
              </div>
              
              <div className="text-right">
                <p>Customer Signature</p>
                <div className="h-16 border-t mt-2"></div>
                <p>________________________</p>
                <p>{bill.contactPerson}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Close
          </button>
          <div className="space-x-4">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              🖨️ Print Invoice
            </button>
            <button
              onClick={() => {
                window.print();
                onClose();
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Print & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;