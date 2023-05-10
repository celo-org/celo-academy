# Celo Academy

This is a Learning Management System (LMS) built using Next.js. It allows users to create courses using Markdown, and provides various types of restrictions that can be applied to each lesson. In addition, users can update the site settings from `site.config.js` file, making it highly customizable.

## Setup

### Prerequisites

- Node.js version 14 or later installed on your machine

### Installation

- Clone the repository and navigate to the project directory

```bash
git clone https://github.com/celo-org/celo-academy
cd celo-academy
```

- Install the project dependencies by running:

```bash
yarn
```

### Local Mode

When running the application in local mode (ENV=local), the site will not use Firebase and will not track any data or allow user sign-ups. This mode is specifically designed for contributors who are writing pathways and want to test their content locally without needing to set up a full Firebase integration.

### Firebase Configuration (Optional)

1. Create a new Firebase project or use an existing one and go to the project's dashboard.
2. Navigate to the Firestore section and click on Create database.
3. Choose Start in test mode and select a region for your database.
4. Click Next and choose a default security rule for your database. For example, you can choose Start in test mode.
5. Click Enable to create your database.

#### Setup Environment Variables

1. Rename the `.env.example` file to `.env`.
2. Open the `.env` file in your text editor and fill in the necessary information with your Firebase project's configuration values:

```text
ENV="local"
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> When ENV is set to local, there's no need to set up Firebase, and the application will run without tracking anything or allowing user sign-ups. This mode is intended for contributors who are writing pathways and want to test locally.

### Run the Application

You can start the application by running the following command in your terminal:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

That's it! Your Next.js based LMS is now up and running, and you can start creating courses using markdown. Please note that LMS uses rainbowkit to authenticate users, and this date is store in firestore.

### Creating Courses

To create a new course, users need to make two changes:

- Open the `constants/pathways.ts` file in your text editor and add a new pathway object to the pathways array.

```typescript
export const pathways = [
  {
    key: "flutter-pathway",
    name: "Flutter Pathway",
    url: "/pathway/flutter-pathway",
    image: FlutterPathway,
    desc: "Flutter Pathway for Web3 is a framework for developing decentralized applications (dApps) on the web using the Flutter UI toolkit. It provides a seamless integration of the latest Web3 technologies with the rich, expressive, and performant user interface capabilities of Flutter.",
    tags: ["flutter", "celo", "web3"],
  },
];
```

- Create a new folder inside the `pathways` directory with the same name as the slug you just created (e.g. flutter-pathway)
- Inside the newly created folder, create multiple markdown files. Each markdown file will be rendered as a lesson in that pathway. For example, create a file named lesson-1.md.
- Add the frontmatter to the top of your markdown file. The frontmatter is a YAML block that defines metadata about the lesson. Here's an example:

```markdown
---
title: Getting Started with Flutter and Celo
description: Learn how to build a Flutter app that interacts with the Celo blockchain
lesson: "1"
restriction: "QuizDialog"
question: "What is the name of the CLI tool that makes it easy to bootstrap a web3 project?"
option1: "Celo Composer"
option2: "Celo Starter"
option3: "Celo CLI"
option4: "Celo Starter CLI"
answer: "Celo Composer"
publishedAt: '2023-02-01'
---
```

- In this example, the frontmatter specifies the lesson's title, description, lesson number, restriction, and publication date.
- Add your lesson content in Markdown syntax beneath the frontmatter.
- Repeat the process for each lesson in your course, incrementing the `lesson` number in the frontmatter for each lesson.
- (Optional) Add a restriction to each lesson. Users will have to complete the restriction in order to move on to the next lesson. You can choose from the following restrictions:

### Restrictions

- `YesDialog`: User just has to type "yes", and confirm that they have read the whole lesson.
- `ImageDialog`: User has to upload an image of the work they have done.
- `QuizDialog`: User has to answer a quiz to move on to the next lesson.
- `AddressDialog`: User needs to add an EVM address to go forward. This can be a deployed contract address.
- `CompletionDialog`: This restriction should only be applied to the last lesson.

### Understanding the Frontmatter

Here is what each attribute means:

- `title`: The title of the lesson.
- `description`: The description of the lesson.
- `lesson`: The lesson number. Note that lesson numbers should start with 0.
- `restriction`: The type of restriction. It should be one of the types defined above.
- `question`: (Options) This is only needed when the restriction is QuizDialog.
- `option1`: (Options) This is only needed when the restriction is QuizDialog.
- `option2`: (Options) This is only needed when the restriction is QuizDialog.
- `option3`: (Options) This is only needed when the restriction is QuizDialog.
- `option4`: (Options) This is only needed when the restriction is QuizDialog.
- `answer`: (Options) This is only needed when the restriction is QuizDialog.
- `publishedAt`: The date when the lesson was published.

> And that's it! Once you've created your course content in markdown, your Next.js based LMS will automatically render it and make it available to your users.
