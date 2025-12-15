import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCorporateBill, addEventBill } from '../features/billingSlice';

const BillForm = ({ billType, onClose }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    corporateName: '',
    eventName: '',
    contactPerson: '',
    contactNo: '',
    billingDate: new Date().toISOString().split('T')[0],
    eventDate: new Date().toISOString().split('T')[0],
    billingType: billType === 'corporate' ? 'Corporate' : 'Event',
    lineItems: billType === 'corporate' ? [
      { id: 1, serviceDate: '', packageType: 'economy', persons: 0, unitPrice: 150, lineTotal: 0 }
    ] : [],
    packages: billType === 'event' ? [
      { id: 1, packageName: '', packageType: 'economy', foodItems: '', persons: 0, unitPrice: 150, lineTotal: 0 }
    ] : [],
  });

  const packageTypes = [
    { id: 'economy', name: 'Economy', defaultPrice: 150 },
    { id: 'standard', name: 'Standard', defaultPrice: 250 },
    { id: 'premium', name: 'Premium', defaultPrice: 400 }
  ];

  const addLineItem = () => {
    if (billType === 'corporate') {
      setFormData({
        ...formData,
        lineItems: [
          ...formData.lineItems,
          { 
            id: formData.lineItems.length + 1, 
            serviceDate: '', 
            packageType: 'economy', 
            persons: 0, 
            unitPrice: 150, 
            lineTotal: 0 
          }
        ]
      });
    } else {
      setFormData({
        ...formData,
        packages: [
          ...formData.packages,
          { 
            id: formData.packages.length + 1, 
            packageName: '', 
            packageType: 'economy', 
            foodItems: '', 
            persons: 0, 
            unitPrice: 150, 
            lineTotal: 0 
          }
        ]
      });
    }
  };

  const updateLineItem = (index, field, value) => {
    if (billType === 'corporate') {
      const updatedItems = [...formData.lineItems];
      updatedItems[index][field] = value;
      
      if (field === 'persons' || field === 'unitPrice') {
        updatedItems[index].lineTotal = updatedItems[index].persons * updatedItems[index].unitPrice;
      }
      
      setFormData({ ...formData, lineItems: updatedItems });
    } else {
      const updatedItems = [...formData.packages];
      updatedItems[index][field] = value;
      
      if (field === 'persons' || field === 'unitPrice') {
        updatedItems[index].lineTotal = updatedItems[index].persons * updatedItems[index].unitPrice;
      }
      
      setFormData({ ...formData, packages: updatedItems });
    }
  };

  const removeLineItem = (index) => {
    if (billType === 'corporate') {
      const updatedItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData({ ...formData, lineItems: updatedItems });
    } else {
      const updatedItems = formData.packages.filter((_, i) => i !== index);
      setFormData({ ...formData, packages: updatedItems });
    }
  };

  const calculateTotal = () => {
    if (billType === 'corporate') {
      return formData.lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    } else {
      return formData.packages.reduce((sum, item) => sum + item.lineTotal, 0);
    }
  };

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    
    let words = '';
    
    if (num >= 1000) {
      words += ones[Math.floor(num / 1000)] + ' Thousand ';
      num %= 1000;
    }
    
    if (num >= 100) {
      words += ones[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    
    if (num >= 20) {
      words += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    } else if (num >= 10) {
      words += teens[num - 10] + ' ';
      num = 0;
    }
    
    if (num > 0) {
      words += ones[num] + ' ';
    }
    
    return `BDT ${words.trim()} Only`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const total = calculateTotal();
    const amountWords = numberToWords(total);
    
    const totalPackages = billType === 'corporate'
      ? formData.lineItems.reduce((sum, item) => sum + item.persons, 0)
      : formData.packages.reduce((sum, item) => sum + item.persons, 0);
    
    const finalData = {
      ...formData,
      totalAmount: total,
      amountInWords: amountWords,
      totalPackages: totalPackages
    };
    
    if (billType === 'corporate') {
      dispatch(addCorporateBill(finalData));
    } else {
      dispatch(addEventBill(finalData));
    }
    
    alert('Bill created successfully!');
    onClose();
    window.location.reload();
  };

  const totalAmount = calculateTotal();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Create New {billType === 'corporate' ? 'Corporate' : 'Event'} Bill
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {billType === 'corporate' ? 'Corporate Name' : 'Event Name'} *
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={billType === 'corporate' ? formData.corporateName : formData.eventName}
              onChange={(e) => setFormData({
                ...formData,
                [billType === 'corporate' ? 'corporateName' : 'eventName']: e.target.value
              })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person *
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact No *
            </label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              value={formData.contactNo}
              onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {billType === 'corporate' ? 'Billing Date' : 'Event Date'} *
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={billType === 'corporate' ? formData.billingDate : formData.eventDate}
              onChange={(e) => setFormData({
                ...formData,
                [billType === 'corporate' ? 'billingDate' : 'eventDate']: e.target.value
              })}
              required
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {billType === 'corporate' ? 'Service Dates & Packages' : 'Packages'}
            </h3>
            <button
              type="button"
              onClick={addLineItem}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Add {billType === 'corporate' ? 'Date' : 'Package'}
            </button>
          </div>

          {billType === 'corporate' ? (
            formData.lineItems.map((item, index) => (
              <div key={item.id} className="border p-4 rounded mb-4 grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm">Service Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={item.serviceDate}
                    onChange={(e) => updateLineItem(index, 'serviceDate', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm">Package Type</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={item.packageType}
                    onChange={(e) => {
                      updateLineItem(index, 'packageType', e.target.value);
                      const selectedPackage = packageTypes.find(p => p.id === e.target.value);
                      if (selectedPackage) {
                        updateLineItem(index, 'unitPrice', selectedPackage.defaultPrice);
                      }
                    }}
                  >
                    {packageTypes.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm">Persons</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2 border rounded"
                    value={item.persons}
                    onChange={(e) => updateLineItem(index, 'persons', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm">Unit Price (BDT)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2 border rounded"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(index, 'unitPrice', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm">Line Total</label>
                  <div className="p-2 bg-gray-50 rounded font-semibold">
                    BDT {item.lineTotal}
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    disabled={formData.lineItems.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            formData.packages.map((item, index) => (
              <div key={item.id} className="border p-4 rounded mb-4 grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm">Package Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={item.packageName}
                    onChange={(e) => updateLineItem(index, 'packageName', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm">Package Type</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={item.packageType}
                    onChange={(e) => {
                      updateLineItem(index, 'packageType', e.target.value);
                      const selectedPackage = packageTypes.find(p => p.id === e.target.value);
                      if (selectedPackage) {
                        updateLineItem(index, 'unitPrice', selectedPackage.defaultPrice);
                      }
                    }}
                  >
                    {packageTypes.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm">Food Items</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={item.foodItems}
                    onChange={(e) => updateLineItem(index, 'foodItems', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm">Persons</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2 border rounded"
                    value={item.persons}
                    onChange={(e) => updateLineItem(index, 'persons', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm">Unit Price (BDT)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2 border rounded"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(index, 'unitPrice', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    disabled={formData.packages.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total Section */}
        <div className="bg-gray-50 p-4 rounded mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Total Amount: BDT {totalAmount}</h3>
              <p className="text-gray-600 mt-1">
                <strong>Amount in words:</strong> {numberToWords(totalAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Total Packages: {
                  billType === 'corporate'
                    ? formData.lineItems.reduce((sum, item) => sum + item.persons, 0)
                    : formData.packages.reduce((sum, item) => sum + item.persons, 0)
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Bill
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillForm;