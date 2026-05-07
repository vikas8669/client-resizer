'use client';

import { motion } from "framer-motion";

export default function PricingSection() {
  return (
    <div className="relative min-h-screen bg-white  text-gray-900 dark:text-white px-6 py-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 dark:bg-black" />

      <div className="relative max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple & Transparent Pricing
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Start free today and scale as your business grows. No hidden charges.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Free Plan */}
          <motion.div whileHover={{ y: -10 }} className="p-8 rounded-2xl shadow-xl border dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-4">Free</h2>
            <p className="text-4xl font-bold mb-4">₹0</p>
            <p className="mb-6 text-sm text-gray-500">Best for beginners</p>
            <ul className="space-y-2 mb-6 text-sm">
              <li>✔ Basic Features</li>
              <li>✔ Limited Usage</li>
              <li>✔ Community Support</li>
            </ul>
            <button className="w-full py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90">
              Get Started
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div whileHover={{ scale: 1.05 }} className="p-8 rounded-2xl shadow-2xl border-2 border-blue-500 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <h2 className="text-2xl font-semibold mb-4">Pro</h2>
            <p className="text-4xl font-bold mb-4">₹499/mo</p>
            <p className="mb-6 text-sm text-gray-500">For professionals</p>
            <ul className="space-y-2 mb-6 text-sm">
              <li>✔ All Free Features</li>
              <li>✔ Unlimited Usage</li>
              <li>✔ Priority Support</li>
            </ul>
            <button className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
               Coming Soon
            </button>
          </motion.div>

          {/* Future Plan */}
          <motion.div whileHover={{ y: -10 }} className="p-8 rounded-2xl shadow-xl border border-dashed dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-4">Future Plan</h2>
            <p className="text-lg font-medium mb-4 text-yellow-500">Currently Free</p>
            <p className="mb-6 text-sm text-gray-500">
              This plan will become paid next year. Lock your access now.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li>✔ Premium Features</li>
              <li>✔ Early Access</li>
              <li>✔ Future Updates</li>
            </ul>
            <button className="w-full py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600">
              Coming Soon
            </button>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          {["Fast Performance", "Secure & Reliable", "24/7 Support"].map((title, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}>
              <h3 className="font-semibold text-xl mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                High-quality experience built for modern applications.
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated SVG Lines */}
      <div className="absolute inset-0 -z-10">
        <svg className="w-full h-full">
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={i}
              x1="0"
              y1={i * 100}
              x2="100%"
              y2={i * 100}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-300 dark:text-gray-700"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 6 + i }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}