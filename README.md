# Cardputer Forge

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/MiljanArt/cardputer-forge)

Cardputer Forge is a sophisticated, modern web-based configuration interface for the Cardputer ADV platform. It empowers users to seamlessly connect to their device, install and update firmware and bootloaders, and fine-tune device parameters through an intuitive and visually stunning UI. The application leverages the Web Serial API for direct browser-to-device communication, eliminating the need for complex desktop software. The interface is designed to be a masterpiece of both form and function, providing a clear, guided experience for beginners while offering advanced tools like a serial console for power users.

## Key Features

- **Browser-Based Connection:** Connect directly to your Cardputer device using the Web Serial API—no desktop software required.
- **Firmware Flashing:** Easily upload and flash new firmware and bootloaders to your device with a clear progress indicator.
- **Device Configuration:** Intuitively view and modify device parameters through a structured settings interface.
- **Live Serial Console:** Monitor raw device output and send commands in real-time for advanced debugging and interaction.
- **Modern & Responsive UI:** A beautiful, clean, and responsive interface built with shadcn/ui and Tailwind CSS for a seamless experience on any device.

## Technology Stack

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Backend:** [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
- **UI:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Bun](https://bun.sh/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cardputer-forge.git
    cd cardputer-forge
    ```

2.  **Install dependencies:**
    This project uses Bun as the package manager.
    ```bash
    bun install
    ```

### Running in Development

To start the development server, which includes the Vite frontend and a local Wrangler instance for the backend API, run:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

- `src/`: Contains the React frontend application code.
  - `pages/`: Main pages/views of the application.
  - `components/`: Reusable React components, including shadcn/ui components.
  - `hooks/`: Custom React hooks.
  - `lib/`: Utility functions and libraries.
  - `stores/`: Zustand state management stores.
- `worker/`: Contains the Hono backend code for the Cloudflare Worker.
- `shared/`: TypeScript types and constants shared between the frontend and backend.

## Deployment

This application is designed to be deployed on the Cloudflare network.

1.  **Login to Cloudflare:**
    If you haven't already, authenticate with your Cloudflare account.
    ```bash
    bunx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the application and deploy it to your Cloudflare account.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/MiljanArt/cardputer-forge)

## Browser Support

The core functionality of this application relies on the **Web Serial API**. This API is currently supported in Chromium-based browsers like Google Chrome, Microsoft Edge, and Opera. It is not available in Firefox or Safari. The application includes a check to inform users if their browser is not supported.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.