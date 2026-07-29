# StudyShare

> **An AI-powered collaborative learning platform designed to simplify resource sharing, group study, and academic collaboration for university students.**

![Laravel](https://img.shields.io/badge/Laravel-13-red?style=for-the-badge\&logo=laravel)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge\&logo=react)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2-purple?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge\&logo=tailwind-css)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge\&logo=mysql)
![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?style=for-the-badge\&logo=php)

---

# Overview

StudyShare is a full-stack web application developed to improve the way university students collaborate, share academic resources, and learn together.

Instead of relying on multiple disconnected platforms for file sharing, communication, and studying, StudyShare provides a single platform where students can:

* Upload and share learning materials
* Organise personal study libraries
* Join collaborative study groups
* Chat using integrated AI
* Analyse academic documents with AI
* Rate and favourite learning resources
* Communicate with administrators
* Access resources securely through role-based authentication

The system also includes a complete administration panel for managing users, uploaded resources, and platform activity.

---

# Problem Statement

University students often struggle with:

* Finding reliable study materials
* Managing notes from different subjects
* Collaborating effectively with classmates
* Receiving quick explanations for difficult concepts
* Organising their learning resources

StudyShare solves these challenges by providing one centralized learning platform that combines collaboration, artificial intelligence, and resource management.

---

#  Key Features

##  Authentication

* Email Registration
* Email Login
* Google OAuth Login
* Secure Logout
* Password Reset
* Session Management
* Role-Based Authentication
* Authorization using Spatie Laravel Permission



##  Student Module

### Dashboard

* Personal dashboard
* Learning statistics
* Recently uploaded resources
* Favourite resources
* Community resources

### Resource Management

* Upload documents
* Download resources
* Browse shared resources
* Private library
* Share resources publicly
* Delete personal uploads

### Learning Features

* Favourite resources
* Rating system
* Resource categorisation

### AI Integration

* AI Chat Assistant
* AI Document Analyzer
* AI-powered academic assistance
* Interactive document conversations

### Study Groups

* Create groups
* Join groups
* Invite members
* Group chat
* Share resources inside groups

### Profile Management

* Edit profile
* Change password
* Upload profile picture
* Notification management

### Contact

* Contact administrators
* Submit inquiries

---

##  Administrator Module

### Dashboard

* System analytics
* User statistics
* Resource statistics
* Upload trends
* Pending resources

### User Management

* View users
* Manage accounts

### Resource Management

* Review uploaded resources
* Approve resources
* Reject resources
* Delete inappropriate content

### Contact Management

* View messages
* Reply to users
* Mark messages as read


#  Artificial Intelligence Features

StudyShare integrates AI to improve the learning experience.

Current AI capabilities include:

* Question answering
* Document analysis
* Learning assistance
* Resource explanations
* Academic support



#  Technology Stack

## Frontend

* React.js
* Inertia.js
* Tailwind CSS
* Vite
* Axios



## Backend

* Laravel 13
* PHP 8.4
* Laravel Breeze
* Laravel Socialite
* Spatie Laravel Permission



## Database

* MySQL



## Authentication

* Email Authentication
* Google OAuth
* Laravel Breeze
* Laravel Socialite
* Spatie Roles & Permissions


## AI Services

* GROQ API



## Development Tools

* Composer
* npm
* Git
* GitHub
* VS Code
* phpMyAdmin


#  System Architecture

StudyShare follows the **Model–View–Controller (MVC)** architectural pattern.

```text
React (Frontend)
        │
        ▼
Inertia.js
        │
        ▼
Laravel Controllers
        │
        ▼
Laravel Models
        │
        ▼
MySQL Database
```

The MVC architecture improves:

* Code organisation
* Maintainability
* Scalability
* Separation of concerns



#  Project Structure

```text
app/
bootstrap/
config/
database/
public/
resources/
 ├── css/
 ├── js/
 │    ├── Components/
 │    ├── Layouts/
 │    ├── Pages/
 │    └── app.jsx
routes/
storage/
vendor/
```



#  Database Design

Main database tables:

* users
* resource_files
* favourites
* ratings
* groups
* group_members
* group_messages
* contact_messages
* notifications

Laravel Eloquent ORM manages relationships between these tables.



#  Security Features

* CSRF Protection
* Password Hashing
* Session Authentication
* Role-Based Authorization
* Google OAuth Authentication
* Input Validation
* Regex Validation
* Protected Routes
* Middleware Authentication



#  Validation

Laravel Validation is implemented throughout the application.

Examples include:

* Email validation
* Password validation
* File type validation
* File size validation
* Required field validation
* Regular Expression (Regex) validation
* Unique value validation



#  Screenshots

> Replace the placeholders below with screenshots from your application.

* Home Page
* Login Page
* Student Dashboard
* Upload Resource
* Browse Resources
* Library
* AI Chat
* AI Analyzer
* Study Groups
* Profile
* Contact
* Admin Dashboard
* User Management
* Resource Approval



#  Installation

## Clone Repository

```bash
git clone https://github.com/dewsithmenuka/Studyshare.git
```

---

## Install Dependencies

```bash
composer install
npm install
```

---

## Environment Configuration

```bash
cp .env.example .env
```

Generate application key

```bash
php artisan key:generate
```

---

## Configure Database

Update the `.env` file with your MySQL credentials.

Run migrations

```bash
php artisan migrate
```

(Optional)

```bash
php artisan db:seed
```

---

## Build Frontend

Development

```bash
npm run dev
```

Production

```bash
npm run build
```

---

## Run Application

```bash
php artisan serve
```

---

#  Future Improvements

Potential enhancements include:

* Mobile application
* Real-time notifications
* AI-generated quizzes
* AI flashcards
* Video study sessions
* Calendar integration
* Learning analytics
* Resource recommendation engine
* Push notifications
* Dark mode enhancements


#  Academic Outcomes

This project demonstrates practical implementation of:

* Full-Stack Web Development
* MVC Architecture
* RESTful Routing
* Authentication & Authorization
* CRUD Operations
* Database Design
* AI Integration
* File Management
* Role-Based Access Control
* Form Validation
* Responsive Web Design



# Author

**Menuka Dewsith**

Second Year Undergraduate

Computer Science

LNBTI

GitHub: https://github.com/dewsithmenuka

---

# 📄 License

This project was developed for educational and academic purposes as part of a university coursework submission.

© 2026 Menuka Dewsith. All rights reserved.
