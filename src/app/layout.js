import './globals.css';

export const metadata = {
  title: 'Trust New Generation (TNG) - Investment Platform',
  description: 'Secure and automated ROI investment platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="bg-tngDark text-tngLight antialiased">
        {/* የገጾቹ ይዘት እዚህ ውስጥ ነው የሚቀመጠው */}
        <main min-h-screen="true">
          {children}
        </main>
      </body>
    </html>
  );
}
