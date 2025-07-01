# Portfolio Website

A modern portfolio website built with React and Sanity.io CMS. Features a responsive design, dark/light theme, and dynamic content management.

## Features

- 🎨 Modern and responsive design
- 🌓 Dark/Light theme
- 📱 Mobile-friendly
- 🖼️ Dynamic portfolio grid
- 📝 Blog functionality
- 📧 Contact form
- 🎯 SEO friendly
- 🚀 Fast loading with image optimization

## Tech Stack

- Frontend:
  - React
  - Vite
  - Styled Components
  - React Router
  - EmailJS

- Backend/CMS:
  - Sanity.io
  - Sanity Studio v3

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd portfolio-website
   ```

2. Install Frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install Sanity Studio dependencies:
   ```bash
   cd ../sanity
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the frontend directory with:
   ```
   VITE_SANITY_PROJECT_ID=your_project_id
   VITE_SANITY_DATASET=production
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

### Development

1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Start the Sanity Studio:
   ```bash
   cd sanity
   npm run dev
   ```

### Building for Production

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Build Sanity Studio:
   ```bash
   cd sanity
   npm run build
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Yu Xuan Chong
- LinkedIn: [Yu Xuan Chong](https://www.linkedin.com/in/yu-xuan-chong)
- Instagram: [@yxperiments](https://www.instagram.com/yxperiments) 