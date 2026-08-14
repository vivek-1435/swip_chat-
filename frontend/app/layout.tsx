import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "SwipChat",
  description: "Signal-inspired secure messaging assignment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <WebSocketProvider>{children}</WebSocketProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
