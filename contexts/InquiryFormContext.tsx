'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ProductInfo {
  type: 'Package' | 'Tour' | 'Ticket' | 'General';
  title?: string;
  referenceId?: string;
  category?: string;
  duration?: string;
}

interface InquiryFormContextType {
  isOpen: boolean;
  productInfo: ProductInfo;
  openForm: (info?: ProductInfo) => void;
  closeForm: () => void;
}

const InquiryFormContext = createContext<InquiryFormContextType | undefined>(undefined);

export function InquiryFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo>({ type: 'General' });

  const openForm = (info?: ProductInfo) => {
    setProductInfo(info || { type: 'General' });
    setIsOpen(true);
  };
  const closeForm = () => setIsOpen(false);

  return (
    <InquiryFormContext.Provider value={{ isOpen, productInfo, openForm, closeForm }}>
      {children}
    </InquiryFormContext.Provider>
  );
}

export function useInquiryForm() {
  const context = useContext(InquiryFormContext);
  if (context === undefined) {
    throw new Error('useInquiryForm must be used within an InquiryFormProvider');
  }
  return context;
}
