import React from 'react';
import useDocumentMetadata, { toCanonicalUrl } from '../hooks/useDocumentMetadata';
import ContactSection from './ContactSection';

export default function Contact() {
  useDocumentMetadata({
    title: 'Contact — Yu Xuan | yxperiments',
    description: 'Get in touch with Yu Xuan about motion, VFX, and interactive work.',
    canonical: toCanonicalUrl('/contact'),
  });
  return <ContactSection standalone />;
}
