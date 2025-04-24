import React, { useEffect } from 'react';
import Footer from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import type {WrapperProps} from '@docusaurus/types';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

type Props = WrapperProps<typeof FooterType>;

function hasConsent(): boolean {
  return Cookies.get('CookieConsent') === 'true';
}

function HotjarScript(): JSX.Element | null {
  useEffect(() => {
    if (!hasConsent()) return;

    if (typeof window !== 'undefined' && !window.hj) {
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:6381833,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }
  }, []);

  return null;
}

export default function FooterWrapper(props: Props): JSX.Element {
  const location = useLocation();

  const isBlog = location.pathname.startsWith('/blog');
  const isSKE = location.pathname.startsWith('/ske');
  const isDocs = !isSKE && !isBlog;
  const styles = {
    height: '1px',
    width: '1px',
  };

  return (
    <>
      <HotjarScript />

      {isDocs && (
        <img id="docs-scarf-pixel" style={styles} referrerPolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=2f7703a4-9013-4c6f-b09e-894a5f3f42d6" />
      )}

      {isSKE && (
        <img id="ske-scarf-pixel" style={styles} referrerPolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=f09f95ff-0179-40f1-a33c-826b0e29c3de" />
      )}

      {isBlog && (
        // "Blog"
        <img id="blog-scarf-pixel" style={styles} referrerPolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=03fbea28-52ec-43c2-90d3-519166e436b4" />
      )}
      <Footer {...props} />
    </>
  );
}
