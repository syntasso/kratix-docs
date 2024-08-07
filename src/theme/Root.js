import React from 'react';
import { useEffect } from "react";
import ReactGA from "react-ga4";
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent";

const ga_tracking_id = "88SJVH10M9"
// Default implementation, that you can customize
export default function Root({children}) {
	const handleAcceptCookie = () => {
		if (process.env.NODE_ENV === "production") {
			ReactGA.initialize("G-"+ga_tracking_id);
		}
		window.heap = window.heap || []
		heap.load = function(e, t) {
			window.heap.appid = e, window.heap.config = t = t || {};
			var r = document.createElement("script");
			r.type = "text/javascript", r.async = !0, r.src = "https://cdn.heapanalytics.com/js/heap-" + e + ".js";
			var a = document.getElementsByTagName("script")[0];
			a.parentNode.insertBefore(r, a);
			for (var n = function(e) {
				return function() {
					heap.push([e].concat(Array.prototype.slice.call(arguments, 0)))
				}
			}, p = ["addEventProperties", "addUserProperties", "clearEventProperties", "identify", "resetIdentity", "removeEventProperty", "setEventProperties", "track", "unsetEventProperty"], o = 0; o < p.length; o++) heap[p[o]] = n(p[o])
		};
		heap.load("3930713230");
	};

	const handleDeclineCookie = () => {
		//remove google analytics cookies
		Cookies.remove("_ga");
		Cookies.remove("_ga_"+ga_tracking_id);
		Cookies.remove("_gat");
		Cookies.remove("_gid");
	};

	useEffect(() => {
		const isConsent = getCookieConsentValue();
		if (isConsent === "true") {
			handleAcceptCookie();
		} else {
			handleDeclineCookie();
		}
	}, []);

	return <>
		<CookieConsent
			EnableDeclineButton
			setDeclineCookie
			location="top"
			enableDeclineButton="true"
			declineButtonText="Decline"
			buttonText="Accept"
			buttonStyle={{ background: "#04AA6D" }}
			declineButtonStyle={{ background: "transparent" }}
			onAccept={handleAcceptCookie}
			onDecline={handleDeclineCookie}
		>
			We use cookies on our website to see how you interact with it. By
			accepting, you agree to our use of such cookies. <a
			style={{ color: "white", textDecoration: "underline" }}
			href="https://www.syntasso.io/cookie-policy">Cookie Policy</a>
		</CookieConsent>
		<>{children}</>
	</>;
}
