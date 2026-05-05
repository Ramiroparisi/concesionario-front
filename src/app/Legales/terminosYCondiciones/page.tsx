'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function avisoLegalPage() {


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 w-full lg:px-12 py-12">
        <h1 className="text-4xl font-light tracking-wide uppercase mb-8">No desarrollado</h1>
          <Link href="/" className="flex-1 px-12 py-3  bg-red-400 text-white text-xl rounded-xl hover:bg-red-600 transition-colors font-medium">
           Volver
          </Link>
      </main>

      <Footer />
    </div>
  );
}