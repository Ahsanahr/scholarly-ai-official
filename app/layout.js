export const metadata = {
  title: 'Scholarly AI',
  description: 'Grounded Academic Search Engine',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
