# FeLaixe

FeLaixe is a modern Angular web application designed for exam preparation and practice. The project focuses on delivering an interactive learning experience for users to review questions, take practice tests, and review their exam results in a structured and user-friendly interface.

## About

FeLaixe is built as a front-end application for question-based learning and exam simulation. It provides:

- A clean and responsive UI for browsing and answering questions
- Practice test and exam workflows
- Question detail rendering with image support
- Progress and result tracking
- Review pages for completed examinations

The application is structured around reusable Angular components and service-driven logic, making it easy to extend with new question sets, chapters, or exam flows.

## Technologies Used

This project is built with the following technologies:

- Angular 18
- TypeScript
- RxJS
- Angular Material
- SCSS
- Karma + Jasmine for unit testing

## Project Structure

```text
Felaixe/
├── .vscode/                  # VS Code workspace configuration
├── public/                   # Static assets
├── src/
│   ├── app/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── dialog-confirm/
│   │   │   ├── exam-card/
│   │   │   ├── practice-history/
│   │   │   ├── practice-test/
│   │   │   ├── practice-test-result/
│   │   │   ├── question-card/
│   │   │   ├── question-container/
│   │   │   ├── question-content-exam/
│   │   │   ├── question-image/
│   │   │   ├── side-bar-exam/
│   │   │   └── side-bar-question/
│   │   ├── constants/        # App-wide constants
│   │   ├── guards/           # Route guards
│   │   ├── layout/           # Shared layout components
│   │   ├── models/           # TypeScript models
│   │   ├── pages/            # Page-level screens
│   │   │   ├── exam/
│   │   │   ├── exam-review/
│   │   │   └── header/
│   │   ├── services/         # API and business logic services
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json             # Angular workspace configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked package versions
├── tsconfig.json            # TypeScript base configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.spec.json       # Test-specific TypeScript config
├── .editorconfig            # Editor formatting rules
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
└── LICENSE                 # If present in your repo
```

## Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- Node.js 18 or later
- npm (comes with Node.js)
- Angular CLI (optional, but recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/lekhatiep/Felaixe.git
cd Felaixe
```

2. Install dependencies:

```bash
npm install
```

### Run the application

Start the Angular development server:

```bash
npm start
```

Or:

```bash
ng serve
```

Then open your browser at:

```text
http://localhost:4200/
```

The app will automatically reload when source files change.

## Usage

Once the app is running, you can use the interface to:

- Browse available questions and chapters
- Start a practice session
- Take a mock exam
- Review your performance after submission
- Access previous exam or practice history

Key application routes include:

- `/` - Home / question container
- `/exam` - Exam mode
- `/practice-test` - Practice test screen
- `/exam-review/:id` - Review exam results from a specific submission

## Build and Test

### Production build

```bash
npm run build
```

### Run unit tests

```bash
npm test
```

## Contribution

Contributions are welcome. If you would like to improve the app, please fork the repository, create a feature branch, and submit a pull request.

## License

This project is currently distributed without a custom license file. Please check the repository for licensing details before reuse or distribution.
