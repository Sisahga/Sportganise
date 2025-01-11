# Sportganise
A sport Management Application <br>

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![JUnit](https://img.shields.io/badge/JUnit-25A162?style=for-the-badge&logo=junit5&logoColor=white)
![Mockito](https://img.shields.io/badge/Mockito-4EA94B?style=for-the-badge&logo=mockito&logoColor=white)
![SLF4J](https://img.shields.io/badge/SLF4J-FF9900?style=for-the-badge&logo=slf4j&logoColor=white)
![GitHub Workflow](https://img.shields.io/badge/GitHub_Workflow-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)

## Release Demos
Release 1: https://drive.google.com/file/d/1UsRUmvnBbStKwHjvWQnSvQ8CL8Uo43cr/view?usp=drive_link

Release 2 (Jan 26): -

Release 3 (Apr 5): -

## Important Files 
(To add as project progresses)
|File  | Description  |
|-----------|-----------|
| [docker-compose.yml](https://github.com/Sisahga/Sportganise/blob/v.1.0/docker-compose.yml)    | Sets up Docker Containerization for the app and runs PostgreSql DB on docker volume with initial seed
| [pom.xml](https://github.com/Sisahga/Sportganise/blob/v.1.0/backend/pom.xml)    | Maintains all currently required dependencies for our backend
|   -  |   -  |
|   -  |  -   |
|  -   |   -  |
    

## Important Tests  
(To add as project progresses)

| Test  | Description  | 
|-----------|-----------|
| [ci-frontend.yml ](https://github.com/Sisahga/Sportganise/blob/v.1.0/.github/workflows/ci-frontend.yml)   | CI for frontend, makes sure code passes all checks before being able to merge    
|[ci-backend.yml](https://github.com/Sisahga/Sportganise/blob/v.1.0/.github/workflows/ci-backend.yml)     | CI for backend, makes sure code passes all checks before being able to merge
|   -  |   -  |
|   -  |  -   |
|  -   |   -  |


## Project Summary
This project is a website and mobile application designed for Accès Badminton, a non-profit organization dedicated to promoting badminton in the Greater Montreal Area. Our application serves as a central platform where players, coaches, and administrators can easily register, log in, and access essential information related to training sessions, upcoming events, competitions, and more. The app features a robust messaging tool to enhance internal communication between coaches and players, a real-time calendar displaying all events, and a feedback section for players to review training sessions. Through this app, players can connect, find partners for competitions, stay updated on club activities, and engage in club events. Additionally, we’ve built the application to be versatile, extending its functionality beyond badminton to any sports club or team. This adaptability allows clubs of various sizes to leverage the app for managing schedules, coordinating teams, and handling administrative tasks, ultimately supporting clubs in streamlining their operations and enhancing their management capabilities.

## Team Members
| Name           | Student ID     | Github ID      | Email Address  |
|----------------|----------------|----------------|----------------|
| **Sana Antoun**| 40209806       | [103603707](https://github.com/Sisahga/Sportganise/commits?author=sanaantoun)      | antounsana@gmail.com |
| Cleopatr-Aliak Manoukian  | 40211001  | [70761047](https://github.com/Sisahga/Sportganise/commits?author=kaianinja)  | cleopatraliakmanoukian@gmail.com |
| Sisahga Phimmasone  |40210015  | [80082494](https://github.com/Sisahga/Sportganise/commits?author=Sisahga)  | sisahga@gmail.com  |
| Karyenne Vuong  | 40157011 | [98135955](https://github.com/Sisahga/Sportganise/commits?author=karyennevu)  | vuongkaryenne@gmail.com  |
| Omar Alshanyour  | 40209637  | [80709119](https://github.com/Sisahga/Sportganise/commits?author=HelloMeFriend)  | omar-alshanyour@outlook.com  |
| Nusrath Zaman  | 40123819| [92409006](https://github.com/Sisahga/Sportganise/commits?author=nusrath-z)  | nusrath.zaman.nz@gmail.com  |
|  Vithujanan Vigneswaran | 40157822  | [92345647](https://github.com/Sisahga/Sportganise/commits?author=Houdini29)  | vithujanan0629@gmail.com |
| Arshpreet Singh    | 40172137  | [92754282](https://github.com/Sisahga/Sportganise/commits?author=Ashx11)  | arshpreets425@gmail.com  |
| Sofia Valiante  | 40191897  | [91510546](https://github.com/Sisahga/Sportganise/commits?author=s-vali)| valiante.sofia@gmail.com  |
| Dannick Bujold-Senss  | 40180290 | [44579430](https://github.com/Sisahga/Sportganise/commits?author=Bsenss6) | dannickbsenss@gmail.com |
| Jeremy Rimokh | 40110746 | [98069409](https://github.com/Sisahga/Sportganise/commits?author=j3rrimmy) | jeremy5727@hotmail.com |

## Developer getting started guide
This monorepo project is home to two workspaces: frontend and backend.

As a developer, it is recommended to open the editor (e.g. VS Code) in one of these
two folders instead of in the root of the project.


## Frontend - Getting Started with React Application

This project is a **React application** bootstrapped with [Vite](https://vitejs.dev/), a fast build tool and development server.

### Prerequisites
Before proceeding, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)  
- **pnpm** (Package manager)  
- **Git** (for version control)


### Get Started
**Clone the Repository**

If you don’t already have the repository cloned, run:

```bash
git clone <https://github.com/Sisahga/Sportganise.git>
```

**Switch to the Main Branch**

Make sure you are on the latest main branch:
```
git checkout main
git pull
```

**Navigate to the Frontend Directory**

Move into the frontend directory:

```
cd frontend
```

**Install Dependencies**

Install the required project dependencies using pnpm:
```
pnpm install
```

**Start the Development Server**

Run the application locally:
```
pnpm dev
```
This will start the Vite development server. Open the provided URL in your browser (commonly http://localhost:5173) to view the app.


### Development Workflow

**Hot Reloading**
The Vite development server supports **hot module replacement (HMR)**. Any changes made to the code will automatically reflect in the browser without requiring a full page refresh.

### Stopping the Development Server

To stop the development server, press `Ctrl + C` in the terminal.


## Backend - Getting Started 

A wonderful java app.

### Commands

NOTE: On windows systems, use the `./mvnw.cmd` script. On unix systems, use `./mvnw` instead.

- run: `./mvnw sprint-boot:run`
- test: `./mvnw test`
- format: `./mvnw spotless:apply`
- lint: `./mvnw stylecheck:check`

Thanks for reading

## Docker Developer Set up 
To run the docker, you first need to have docker desktop downloaded (Windows & MacOS):  https://www.docker.com/products/docker-desktop/
<br>

For linux: Docker can be installed directly without Docker Desktop. Additionally, you may need to install Docker Compose separately, as it might not be included by default.  <br> 
 <br> On Ubuntu, for example, you can install it with: <br>
 `sudo apt install docker-compose`   <br> 
 <br>
Then simply run:  <br>
`docker compose up`  <br>  

and once you're done: <br>
 `docker compose down`
 
## Mockups
The following link will direct you to our Figma page where we implemented the application's UI: [Application Designs](https://www.figma.com/design/8G8sA8UWmxEWocw2baWh3q/Welcome-page?node-id=1-4&t=52E00lTSscxSFA7g-1)

## Wiki table of contents
[Wiki Home Page](https://github.com/Sisahga/Sportganise/wiki)
* [Meeting Minutes](https://github.com/Sisahga/Sportganise/wiki/Meeting-Minutes)
* [Risks](https://github.com/Sisahga/Sportganise/wiki/Risks)
* [Legal and Ethical Issues](https://github.com/Sisahga/Sportganise/wiki/Legal-and-Ethical-Issues)
* [Economic](https://github.com/Sisahga/Sportganise/wiki/Economic)
* [Personas](https://github.com/Sisahga/Sportganise/wiki/Personas)
* [Diversity Statement](https://github.com/Sisahga/Sportganise/wiki/Diversity-Statement)
* [Overall Architecture and Diagrams](https://github.com/Sisahga/Sportganise/wiki/Overall-Architecture-and-Diagrams#database-schema-)
* [Infrastructure and tools](https://github.com/Sisahga/Sportganise/wiki/Infrastructure-and-tools)
* [Name Conventions](https://github.com/Sisahga/Sportganise/wiki/Name-Conventions)
* [Testing Plan and Continuous Integration](https://github.com/Sisahga/Sportganise/wiki/Testing-Plan-and-Continuous-Integration)
* [Security](https://github.com/Sisahga/Sportganise/wiki/Security)
* [Performance](https://github.com/Sisahga/Sportganise/wiki/Performance)
* [Deployment Plan and Infrastructure](https://github.com/Sisahga/Sportganise/wiki/Deployment-Plan-and-Infrastructure)
* [Mockups](https://github.com/Sisahga/Sportganise/wiki/Mockups)
* [Budget](https://github.com/Sisahga/Sportganise/wiki/Budget)
* [API Endpoint Documentation](https://github.com/Sisahga/Sportganise/wiki/API-Endpoint)

## Diversity Statement 
“We’re committed to creating an inclusive environment where everyone feels welcome, no matter their background, gender, or abilities. Our goal is to make sure the app is accessible to all users and helps bring people together in a way that promotes fairness and respect. We believe diversity makes our platform stronger and allows us to better serve all the clubs and players that use it.”
