# CMS Forty Five Shop

A modern Content Management System built with Next.js 14, TypeScript, and Tailwind CSS for managing the Forty Five Shop e-commerce platform.

## Features

- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for responsive and modern UI design
- **ESLint** for code quality and consistency

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anhlee99/cms.fortyfive.shop.git
cd cms.fortyfive.shop
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
cms.fortyfive.shop/
├── app/                  # Next.js App Router directory
│   ├── globals.css      # Global CSS styles
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Home page component
├── public/              # Static assets
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## CMS Features

This Content Management System provides interfaces for:

- **Admin Panel** - Administrative dashboard and controls
- **Product Management** - Catalog and inventory management
- **Order Management** - Customer order processing and tracking
- **Settings** - Shop configuration and preferences

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint with Next.js configuration
- **Package Manager**: npm

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.