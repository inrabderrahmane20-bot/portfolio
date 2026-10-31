import Document, {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from 'next/document';

interface Props extends DocumentInitialProps {
  locale: 'en' | 'fr' | 'es' | 'ar';
}

export default class PortfolioDocument extends Document<Props> {
  static async getInitialProps(context: DocumentContext): Promise<Props> {
    const initialProps = await Document.getInitialProps(context);
    const pathname = context.pathname;
    const locale = pathname.startsWith('/ar/')
      ? 'ar'
      : pathname.startsWith('/fr/')
        ? 'fr'
        : pathname.startsWith('/es/')
          ? 'es'
        : 'en';

    return { ...initialProps, locale };
  }

  render() {
    const { locale } = this.props;
    return (
      <Html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
