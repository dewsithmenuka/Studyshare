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

<img width="972" height="542" alt="image" src="https://github.com/user-attachments/assets/7ce80aea-640a-41e5-b703-9d81e8986d52" />
<img width="972" height="544" alt="image" src="https://github.com/user-attachments/assets/9923268f-232d-4c4f-b19f-839bc2b9eded" />
<img width="972" height="542" alt="image" src="https://github.com/user-attachments/assets/a7f81358-6fe7-4054-98d4-e74d97aa2e9c" />
<img width="972" height="542" alt="image" src="https://github.com/user-attachments/assets/fcef79e4-47fa-4095-baa7-eb4fe677e391" />
<img width="972" height="542" alt="image" src="https://github.com/user-attachments/assets/60b42d4c-3d83-4104-896e-db0b1bee2c49" />
<img width="972" height="542" alt="image" src="https://github.com/user-attachments/assets/ac810cd0-5c13-4518-a700-24241a7298a5" />
<img width="972" height="544" alt="image" src="https://github.com/user-attachments/assets/ffce996e-445d-4a60-a5a7-a78f60dd201c" />
<img width="972" height="544" alt="image" src="https://github.com/user-attachments/assets/bf727e0f-9dc6-4f89-90e5-474aadf6a875" />
<img width="970" height="540" alt="image" src="https://github.com/user-attachments/assets/ab99dd4b-9a13-4278-97ee-a6ecfd223c6f" />
<img width="972" height="542" alt="image" src="https://github.com/user-attachments/assets/23c85cc3-203c-40df-b1ff-8e86b2e195a0" />
<img width="972" height="542" alt="image" src="https://github.com/user-attachments/assets/75c49591-959b-4f13-a457-6623199e0cfa" />
<img width="970" height="542" alt="image" src="https://github.com/user-attachments/assets/8d9a481a-3fd5-4336-9e78-844f6cb2a77c" />
<img width="972" height="536" alt="image" src="https://github.com/user-attachments/assets/c03cdede-d9c4-45ba-880b-c1457f4ffd03" />
<img width="972" height="542" alt="image" src="https://github.com/user-attachments/assets/9e61cb71-d7b5-42e5-b000-5f01a71844f9" />
<img width="972" height="540" alt="image" src="https://github.com/user-attachments/assets/e4b77966-d948-4115-b4fa-abe66f675d77" />



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
