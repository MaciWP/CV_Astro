import { render } from '@testing-library/react';
import { Helmet } from 'react-helmet-async';
import SwissMarketSEO from '../SwissMarketSEO';

describe('SwissMarketSEO', () => {
  test('generates correct Zurich-specific meta tags', () => {
    render(
      <SwissMarketSEO 
        targetCity="zurich" 
        language="en" 
        workPermitReady={true}
      />
    );
    
    const helmet = Helmet.peek();
    expect(helmet.title).toContain('Zurich');
    expect(helmet.metaTags).toContainEqual(
      expect.objectContaining({
        name: 'geo.placename',
        content: 'Zurich'
      })
    );
  });
});