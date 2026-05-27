'use client';
import React, { Suspense } from 'react';
import ComputerBoard from '../../components/ComputerBoard';

function ComputerContent() {
  return (
    <div style={{ width: '100%' }}>
      <ComputerBoard />
    </div>
  );
}

export default function ComputerPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: '#fff' }}>Loading engine...</div>}>
      <ComputerContent />
    </Suspense>
  );
}
