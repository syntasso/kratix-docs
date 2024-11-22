import React from 'react';
import Footer from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import type {WrapperProps} from '@docusaurus/types';
import { useLocation } from 'react-router-dom';

type Props = WrapperProps<typeof FooterType>;

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
