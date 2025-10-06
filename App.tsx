
import React, { useState } from 'react';
import { ArrowLeftIcon } from './components/icons/ArrowLeftIcon';
import { LockIcon } from './components/icons/LockIcon';
import { BonusIcon } from './components/icons/BonusIcon';
import { WhatsappIcon } from './components/icons/WhatsappIcon';

interface BuyerInfo {
  email: string;
  name: string;
  phone: string;
}

const App: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    email: '',
    name: '',
    phone: '',
  });
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('DANA');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  const [errors, setErrors] = useState<Partial<BuyerInfo & { terms: string }>>({});

  const product = {
    name: 'BANK KONTEN',
    price: 5000,
    imageUrl: 'https://i.postimg.cc/GTJqBZ59/1-20251001-010825-0000.png',
  };

  const totalPrice = product.price * quantity;
  const paymentMethods = ['DANA', 'ShopeePay', 'QRIS'];

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BuyerInfo & { terms: string }> = {};
    if (!buyerInfo.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(buyerInfo.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!buyerInfo.name) {
      newErrors.name = 'Name is required.';
    }
    if (!buyerInfo.phone) {
      newErrors.phone = 'Phone number is required.';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Use.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleBuyNow = () => {
    if (!validateForm()) {
      return;
    }
    
    const bonusMessage = quantity >= 3
      ? `\n*Catatan Tambahan:* Saya berhak mengklaim semua bonus.`
      : '';

    const message = `
Halo, saya tertarik untuk membeli produk digital Anda.

*Detail Pesanan:*
- Produk: ${product.name}
- Jumlah: ${quantity}
- Total Harga: Rp ${totalPrice.toLocaleString('id-ID')}
- Metode Pembayaran: ${paymentMethod}${bonusMessage}

*Data Pemesan:*
- Nama: ${buyerInfo.name}
- Email: ${buyerInfo.email}
- No. Telepon: ${buyerInfo.phone}${notes ? `\n- Catatan Tambahan: ${notes}` : ''}

Mohon berikan instruksi pembayaran selanjutnya. Terima kasih.
    `.trim().replace(/\n\s*\n/g, '\n\n');

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '6283173441172';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F7FBF9] text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center mb-6">
          <button className="p-2 mr-4">
            <ArrowLeftIcon />
          </button>
          <h1 className="text-xl font-semibold">Checkout</h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200/80">
              <h2 className="text-sm font-semibold text-gray-500 mb-4 tracking-wider">PRODUCT</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                    <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600">Rp {product.price.toLocaleString('id-ID')} / item</p>
                    </div>
                </div>
                 <div className="flex items-center border border-gray-300 rounded-md">
                    <button onClick={handleDecreaseQuantity} className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100 rounded-l-md transition" aria-label="Kurangi jumlah">-</button>
                    <span className="px-4 py-1 text-center font-semibold w-12" aria-live="polite">{quantity}</span>
                    <button onClick={handleIncreaseQuantity} className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100 rounded-r-md transition" aria-label="Tambah jumlah">+</button>
                </div>
              </div>
               <p className="text-xs text-gray-500 mt-4 text-center">
                Beli 3 produk atau lebih untuk mendapatkan bonus spesial.
               </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200/80">
              <h2 className="text-sm font-semibold text-gray-500 mb-4 tracking-wider">CATATAN PESANAN</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input type="email" id="email" name="email" value={buyerInfo.email} onChange={handleInputChange} placeholder="Your Email" className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                  <input type="text" id="name" name="name" value={buyerInfo.name} onChange={handleInputChange} placeholder="Your Name" className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition`} />
                   {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={buyerInfo.phone} onChange={handleInputChange} placeholder="08xxxxxxxx" className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition`} />
                   {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-1 block">Catatan Tambahan (Opsional)</label>
                  <textarea id="notes" name="notes" value={notes} onChange={handleNotesChange} placeholder="Contoh: Beli bank konten kategori beauty" className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition" rows={3}></textarea>
                </div>
              </form>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 border border-gray-200/80 space-y-5">
              <h2 className="text-sm font-semibold text-gray-500 tracking-wider">PAYMENT DETAILS</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-emerald-600">- Rp 0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Convenience fee</span>
                  <span>Rp 0</span>
                </div>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              
              {quantity >= 3 && (
                <div className="flex items-start bg-amber-50 text-amber-900 p-4 rounded-lg border border-amber-200">
                    <BonusIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-500" />
                    <div>
                        <p className="font-bold text-sm">Bonus Spesial!</p>
                        <p className="text-xs">Anda berhak klaim semua bonus.</p>
                    </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider mb-3">PILIH METODE PEMBAYARAN</h3>
                <div className="space-y-3">
                    {paymentMethods.map((method) => (
                        <label key={method} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === method ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 bg-white hover:border-gray-400'}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={paymentMethod === method}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                            />
                            <span className="ml-3 font-semibold text-sm text-gray-800">{method}</span>
                        </label>
                    ))}
                </div>
                <div className="flex items-start bg-green-50 p-3 rounded-lg text-green-800 mt-4">
                    <WhatsappIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-green-600"/>
                    <div>
                        <p className="font-semibold text-sm">Pembayaran via WhatsApp</p>
                        <p className="text-xs">Instruksi pembayaran akan diberikan melalui WhatsApp.</p>
                    </div>
                </div>
              </div>

              <div className="flex items-start bg-emerald-50 p-3 rounded-lg text-emerald-800">
                <LockIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0"/>
                <div>
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs">All your payments are secured with RSA encryption</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                 <div className="flex items-start">
                    <input id="terms" name="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-4 w-4 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"/>
                    <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                        I agree to the <a href="#" className="font-medium text-emerald-600 hover:underline">Terms of Use</a>
                    </label>
                 </div>
                 {errors.terms && <p className="text-red-500 text-xs ml-7 -mt-2">{errors.terms}</p>}
                 
                 <div className="flex items-start">
                    <input id="marketing" name="marketing" type="checkbox" checked={agreedToMarketing} onChange={(e) => setAgreedToMarketing(e.target.checked)} className="h-4 w-4 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"/>
                    <label htmlFor="marketing" className="ml-3 text-sm text-gray-600">
                        I agree that my email and phone number may be used to receive newsletters or marketing messages, which I can unsubscribe from at any time.
                    </label>
                 </div>
              </div>
              
              <button onClick={handleBuyNow} className="w-full bg-[#27C493] text-white font-bold py-3.5 px-4 rounded-lg hover:bg-[#22a980] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300 shadow-lg shadow-emerald-500/20">
                Buy Now - IDR {totalPrice.toLocaleString('id-ID')}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
