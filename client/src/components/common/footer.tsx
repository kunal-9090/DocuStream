import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black bg-opacity-40 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">About Us</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Careers</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Contact</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Help Center</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Terms of Use</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Cookie Preferences</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">My Account</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Billing</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Gift Cards</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-gray-300 transition">Refer a Friend</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-400 font-medium mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-500 hover:text-primary transition"><i className="fab fa-instagram text-xl"></i></a>
              <a href="#" className="text-gray-500 hover:text-primary transition"><i className="fab fa-twitter text-xl"></i></a>
              <a href="#" className="text-gray-500 hover:text-primary transition"><i className="fab fa-facebook text-xl"></i></a>
              <a href="#" className="text-gray-500 hover:text-primary transition"><i className="fab fa-youtube text-xl"></i></a>
            </div>
            
            <h3 className="text-gray-400 font-medium mb-2">App</h3>
            <div className="flex space-x-2">
              <a href="#" className="block">
                <div className="bg-[#232323] text-white text-xs py-2 px-3 rounded h-10 flex items-center justify-center">
                  <div className="mr-1"><i className="fab fa-apple text-lg"></i></div>
                  <div>
                    <div className="text-[10px]">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </div>
              </a>
              <a href="#" className="block">
                <div className="bg-[#232323] text-white text-xs py-2 px-3 rounded h-10 flex items-center justify-center">
                  <div className="mr-1"><i className="fab fa-google-play text-lg"></i></div>
                  <div>
                    <div className="text-[10px]">GET IT ON</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} DocuStream, Inc. All rights reserved.</p>
          <div className="mt-4 flex justify-center items-center">
            <div className="flex items-center">
              <span className="text-gray-500 text-sm mr-2">Language:</span>
              <select className="bg-transparent border border-gray-700 rounded text-gray-400 text-sm py-1 px-2">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
