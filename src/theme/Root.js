import React from 'react';
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent";

// Default implementation, that you can customize
export default function Root({children}) {
  return [
		<CookieConsent
			EnableDeclineButton
			setDeclineCookie
		  location="bottom"
		>
			We use cookies on our website to see how you interact with it. By
			accepting, you agree to our use of such cookies. <a
				href="https://www.kratix.io/cookie-policy">Cookie Policy</a>
		</CookieConsent>,
		<>{children}</>,
	]
}
