import React from 'react';
import { useEffect } from "react";
import ReactGA from "react-ga4";
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent";

const ga_tracking_id = "88SJVH10M9"
// Default implementation, that you can customize
export default function Root({children}) {
	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			ReactGA.initialize("G-"+ga_tracking_id);
		}
	})

	return <>
		<>{children}</>
	</>;
}
