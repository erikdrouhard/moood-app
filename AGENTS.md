# Repo AGENTS Instructions

This file defines instructions for automated agents working on this repository.

## Development workflow

- **Initial Setup**: Before starting, ensure you have followed the setup instructions in `README.md` (e.g., `npm install`, setting up `.env`).
- After making changes, run `npm run lint` followed by `npm test` to ensure code quality and that the test suite passes.
- Include a concise summary of the changes in the pull request description.

## Project Structure Overview

- `src/`: Main application code.
  - `components/`: React components.
    - `auth/`: Authentication-related components.
    - `ui/`: Base UI components (many from shadcn/ui).
  - `hooks/`: Custom React hooks.
  - `lib/`: Utility functions and libraries (e.g., `utils.ts`).
  - `types/`: TypeScript type definitions.
- `tests/`: Automated tests.
- `public/`: Static assets.
- `server.js`: The Express API server.
- `package.json`: Defines scripts (e.g., `npm run dev`, `npm run build`) and dependencies.
- `README.md`: Contains primary setup and running instructions.
- `AGENTS.md`: This file - contains instructions specifically for agents.
- `components.json`: Configuration for shadcn/ui.
- `vite.config.ts`: Vite configuration.
- `tailwind.config.js`: Tailwind CSS configuration.
- `tsconfig.json` (and variants): TypeScript configuration.

## Working with shadcn-ui Components (Offline)

This project uses shadcn-ui. These components are typically added via a CLI, and their documentation is usually browsed online. For an offline agent:

- **Finding Component Code**: The source code for all existing shadcn-ui components (and other UI components) is located in `src/components/ui/`. This is your primary reference for understanding their props, variants, and usage.
- **Using Existing Components**: You can use any component already present in `src/components/ui/` or elsewhere in the `src/components/` directory.
- **Adding New shadcn-ui Components**: It is NOT possible to add *new* shadcn-ui components that aren't already in the project, as this requires using the `shadcn-ui` CLI, which needs internet access to fetch component code.
- **No External Documentation Link**: Any external links to shadcn/ui documentation are not usable offline. Focus on the in-project code for component details.

## Creating New Custom Components

- New general-purpose React components should be placed in an appropriate subdirectory within `src/components/` (e.g., `src/components/dashboard/MyNewWidget.tsx`).
- If creating a new, very generic UI primitive similar to those in `shadcn/ui`, it could be placed in `src/components/ui/`.
- Ensure new components are self-contained or rely only on existing in-project utilities and types.

## Managing Dependencies (Offline Consideration)

- All project dependencies are listed in `package.json` and are installed via `npm install` (which should be run once with internet access during the initial setup phase).
- Adding, removing, or updating dependencies is NOT possible in an offline environment. All development must proceed using only the versions of dependencies currently specified in `package-lock.json`.

## Running the Application

- To run the backend server: `npm run server`
- To run the frontend development server: `npm run dev`
- Ensure the `VITE_API_BASE_URL` is correctly set in a `.env` file as per `README.md`.

## Linting and Testing

- Run linter: `npm run lint`
- Run all tests: `npm test` (which likely executes `vitest run` as per your `package.json`)
- To run specific tests, you can often use pattern matching with Vitest. For example: `npx vitest run -t "my specific test name"` (replace `"my specific test name"` with the actual test name or a pattern).
- Always add or update tests for the code you change, even if not explicitly asked. Ensure all tests pass before considering a task complete.
- After moving files or changing imports, re-run `npm run lint` to ensure ESLint and TypeScript rules still pass.

## Pull Request (PR) Instructions

- **Title Format**: Use a clear and descriptive title, preferably prefixed with the main area of change. Examples:
  - `[Auth] Implement password reset functionality`
  - `[Dashboard] Add new mood summary widget`
  - `[UI] Update global button styles`
  - `[Server] Fix bug in user data endpoint`
- **Description**: Include a concise summary of the changes in the pull request description (as previously mentioned).

## UI/UX

- Refer to the existing components in `src/components/ui/` and the overall application aesthetic when building new UI elements to maintain consistency.
- The `components.json` file contains configuration related to `shadcn/ui` such as style and aliases.
