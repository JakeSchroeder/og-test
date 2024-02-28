import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const gdprEnforcedCountryCodes = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'GB',
];

export function middleware(request: NextRequest) {
  //Early return if visitor has already accepted | declined | prompted the cookie policy
  if (request.cookies.has('isGDPR')) {
    return undefined;
  }
  //FUTURE: Use env variable for default country
  const response = NextResponse.next();
  //Get visitor country code, if not available default to United States (non-GDPR)
  const country = (request.geo && request.geo.country) || 'US';
  if (!gdprEnforcedCountryCodes.includes(country)) {
    response.cookies.set('isGDPR', 'false');
    return response;
  }
  //If first time visitor and GDPR country, prompt them to accept the cookie policy
  response.cookies.set('isGDPR', 'true');
  return response;
}

//Make sure the middleware only runs on pages
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
