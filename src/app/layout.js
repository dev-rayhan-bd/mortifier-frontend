import { mainTheme } from "@/theme/ant-theme";
import ReduxProviders from "@/utils/ReduxProviders";
import { ConfigProvider } from "antd";
import "./globals.css";

export const metadata = {
  title: "Morfitter - Fit Your Life, Fit Your Schedule",
  description: "Morfitter - Fit Your Life, Fit Your Schedule",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Add Google AdSense script here */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6839068546133512"
          crossOrigin="anonymous"
        ></script>
      </head>
      <ConfigProvider theme={mainTheme}>
        <body>
          <ReduxProviders>{children}</ReduxProviders>
        </body>
      </ConfigProvider>
    </html>
  );
}
