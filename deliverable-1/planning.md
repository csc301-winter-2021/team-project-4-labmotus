# LabMotus

## Product Details

### Q1: What are you planning to build?

We are planning to build a telehealth platform to allow physiotherapists to provide remote care augmented with automatically computed accurate patient range-of-motion data.

There are many pitfalls for the remote assessment and treatment of musculoskeletal disorder patients by clinicians. Given that many patients do not follow the treatment plan given to them, as well as the difficulty in determining a patient’s progress through basic video software, the recovery process often ends up being prolonged. To this end, we are building a web app allowing patients to upload videos of their movement and allowing clinicians to remotely view automated motion analysis of their patients.

On the website, the patient is guided through recording poses and movements a physiotherapist would be interested in analyzing. Once the patient is done, the video is analyzed on our cloud. The results are saved on the cloud, and can then be viewed by the patient’s therapist.

The clinician can see a list of their patients, and each of their motion analysis reports. Reports for individual video uploads are available, as well as a per-patient report showing the evolution of the patient’s movement over the duration of treatment. In addition, they can choose to view only what the cloud has labelled as irregular results, making the clinician workflow easier and more efficient.

***

### Q2: Who are your target users?

Our target users are **healthcare clinicians** (including physiotherapists, kinesiologists, athletic therapists, strength and conditioning coaches), **athletes**, **patients**, and **clinics**. 

Some example personas:

- Jotaro Kujo is a third year undergraduate student studying kinesiology at the University of Toronto. He is part of the basketball team. About a month ago, he unfortunately sprained his ankle during practice. He was sent to physical therapy and prescribed a 5-week rehab treatment. Eager to get back to practicing, Jotaro ended his treatment prematurely. However, he recently found himself injured again. He wishes there was an easier way for him to contact his therapist frequently to get healed as soon as possible.

- Dio Brando is a 60-year-old kinesiologist who has been working at The Kin Studio in Toronto for the past 25 years. Recently, Dio has found that many patients fall behind on their treatments after many of his sessions have moved online. He now has to assess clients over video, where it is difficult to make accurate measurements visually. He is looking for a way to replicate the detailed and accurate assessment he is able to conduct in person and get real-time feedback. 

- Joseph Joestar is a wealthy, performance-driven executive at KPMG. In his spare time, he constantly tries to improve his performance in tennis. During a match with a co-worker, he injured his ACL. Already finding it hard to travel and operate on a busy schedule, he wants to receive treatment on his own terms through a medium convenient for him.

***

### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

Currently, the WHO estimates there are around 1.71 billion people worldwide suffering from musculoskeletal conditions. Musculoskeletal issues, specifically lower back pain, are a primary cause of disabilities in 160 countries<sup>[1](https://www.who.int/news-room/fact-sheets/detail/musculoskeletal-conditions)</sup>. We are building a telemedicine service that will allow physiotherapists to provide remote rehabilitation services to both local clinic patients and global underserved populations. Studies of telemedicine services in specific fields have shown the service to be feasible as an in-person alternative and highly welcomed by patients, with more than 97.1% of the participants willing to recommend the service to others<sup> [2](https://pubmed.ncbi.nlm.nih.gov/31472419/)</sup>.

Traditional motion capture technology for physiotherapy is very expensive, costing upwards of \$10,000, and thus is usually limited to only use in academia. Other digital rehabilitation services like Kinetisense can provide the service at a much lower cost, in this case only requiring a Microsoft Kinect camera valued at \$400. We are designing our product to require only a smartphone, making it highly accessible to all users without the hassle of setting up dedicated hardware. 

Many existing apps that provide pose analysis also use 2D pose estimation technology, which requires the user to reposition their phone camera multiple times during a video session for different angles. Our service uses 3D pose estimation technology. This makes recording videos much more convenient for the patient, since it only requires one camera angle to deliver the same level of analysis. Using a single camera 3D estimation also improves the robustness of the estimation, without requiring the user to align the camera in specific angles to perform the analysis.

We are providing our service directly to clinicians who can then provide the service to their existing patients remotely, without having the patient having to familiarize themselves with a new clinician. Compared to consumer focused products such as Kaia health which focuses on providing tools to the patient to self medicate, we are focusing on providing the medically significant metrics directly to the clinician to provide better care than an algorithm guided solution.

Our service will also help clinicians perform their job faster. Compared to generic telemedicine services, we provide highly specialized diagnostic-aid tools, including but not limited to AI driven pose-estimation, automatically computed joint angle metrics, and comparisons against benchmarks. These tools can significantly decrease the number of times physiotherapists must spend on manual measurements. With physiotherapists attending to 8-12 patients a day, we can estimate the manual measurements taking 5 minutes per patient, we can potentially save up to an hour per day. That is, we can save physiotherapists 262 hours of work in a year, around $10,000 in savings per physiotherapist per year. 

***

### Q4: How will you build it?

When choosing the tech stack and architecture, performance and simplicity were the most important criteria to allow for future real-time analysis and to enable more rapid pivots for the partner. 

The front-end will be developed with React. Capacitor will be used for native mobile functionality and to build the React code into an iOS app for the patient. The clinician portal will be deployed as a React web app.

User data will be stored on DynamoDB, and video logs will be stored on S3 for cheap, reliable data access. Firebase Auth will be used to manage user and clinician accounts. 

Fastify, based on Node.js, will be used for the back-end due to its speed and reliability. It also allows for all development to occur on Javascript. Wrnch.ai will be used for pose estimation. The back-end itself will be deployed on AWS, and an AWS Lambda function will be used to perform pose estimation as necessary. 

The clinician app will be accessible from a website hosted on AWS, and the mobile app will be available using TestFlight for the beta, and eventually the App Store. 

GitHub Actions or CircleCI will be used for CI/CD (depending on availability of Actions credits), and the code base will be organized as a monorepo using npm workspaces for simplicity.

We will use unit tests and integration tests to check functionality. Specifically for the front-end, we will use Jest to check if DOM elements are structured in the right way. A mock API (ie: Swagger) will be used to test the front-end independently of the back-end. The back-end will be tested on the controller level using unit tests (testing data manipulation) and end-to-end (checking for appropriate responses). Finally, we will use Selenium to perform integration tests.

#### Architecture

<img src="https://lh5.googleusercontent.com/dHrgIQ8fOtzKIiHq2CZIeZpofHDEVsHpCq07Kj3vaJZfkZOdIiHL_5ytEjQakFVLBUercypA0zJOTLbeILKUyxQB7Kh8PPYD7KfWafPJu4MHw8Hy57JcchufUZrFRW18KpPj60C7" alt="architecture">

#### Object Model

<p align="center">
<img src="https://docs.google.com/drawings/u/0/d/scAlSrHTLzomX3bGscxJBXg/image?w=495&h=455&rev=207&ac=1&parent=1kpMr35Fwm7jMuATSkJiijQlpsZd_chKZhIXO1Mx-Ej4" alt="object model">
</p>

***

### Q5: What are the user stories that make up the MVP?

1. As a patient, I want to be able to see the progress of my treatment in order to know how far into my treatment I am.

   ```
   Acceptance Criteria:
   Registered and signed-in user with patient account checks the progress of their treatment
   “Given that I’m in a role of registered user that is logged in
   When I open the “HOME” page
   Then the system shows me today’s date and a list of body parts my treatment is covering
   And at the top of the screen it shows the current progress of my treatment”
   ```

2. As a patient, I want to view performance feedback in order to know my treatment progress.

   ```
   Acceptance Criteria:
   Registered and signed-in user opens a video they recorded and views the feedback
   “Given that I’m in a role of registered user that is logged in 
   When I open the “HOME” page
   Then the system shows me today’s date and a list of body parts my treatment is covering
   When I click on the date
   Then the system opens a calendar where I can choose a date to view videos for that day
   When I click on a body part in the list
   Then the system opens detailed feedback including video(s) and maximum range of motion in degrees”
   ```

3. As a clinician, I want to be able to create an account in order to easily have video conferences with my patients during their treatments

   ```
   Acceptance Criteria:
   Unregistered user creates a new account
   “Given that I’m in a role of unregistered user
   When I open the application
   And I click on the “NEW USER” button
   And the system opens a form where I can enter my username, password, email address and agree to the terms of services
   When I click on the “CREATE ACCOUNT” button
   Then the system creates the account and I am redirected to the clinician portal”
   ```

4. As a clinician, I want to edit patient information in order to easily change patient info after a session.

   ```
   Acceptance Criteria:
   Registered and signed-in user with clinician account edits patient info after an appointment 
   “Given that I’m in a role of registered user that is logged in
   When I open the “PATIENTS” page
   Then the system shows me a list of all my current patients
   When I search for the patient “GIORNO GIOVANNA”
   Then the system shows Giorno’s profile card with their first and last name, and a “VIEW PROFILE” and “EDIT PROFILE” below
   When I click the “EDIT PROFILE” button
   Then the system allows me to make changes to any section of Giorno’s profile such as their first & last name, year of birth, email, phone number, recorded videos, and notes
   When I click the “SAVE EDITS” button
   Then the system saves all my edits to the patient’s profile”
   ```

5. As a clinician, I want to able to record video during patient consultation in order to have access to the videos later to review.

   ```
   Acceptance Criteria:
   Registered and signed-in user records a video during a consultation with a patient
   “Given that I’m in a role of registered user that is logged in on a device with video capabilities
   When I open the “PATIENTS” page
   And I search for the patient I want to meet with
   Then the system shows the patient’s profile
   When I open the patient’s profile, I can see all their performance feedback including videos and statistics
   When I can click the “START CALL” button
   Then I am redirected to the “VIDEO CONFERENCING” page with the patient
   When I click on the “START RECORDING” button
   Then the system prompts the video conference to record
   When I am finished recording I click the “END RECORDING” button
   And the system ends the video recording
   Then the video is saved to the patient’s profile”
   ```

***

### Intellectual Property Confidentiality Agreement

We will release our software publicly with an open-source licence.

***

## Process Details

### Q6: What are the roles & responsibilities on the team?

Ethan will be responsible for project management, as well as front and back-end development. Ethan is our partner's main point of contact through email. Ethan's strengths include machine learning, front-end implementation (given design by someone else) in JavaScript, and building back-end and cloud integration. Ethan’s weaknesses include not familiar with iOS development, bad at visual (UI/UX) design, and has no advanced SQL experience.

Max will be responsible for project management and front-end logic. Outside of software, Max will be responsible for taking weekly meeting minutes with our partner. Max's strengths include experience with neural networks, very familiar with Git version control, and has developed iOS apps before. Max’s weaknesses include not familiar with many web development technologies, only has basic Javascript, SQL experience, and hasn't been exposed to Node.JS.

Sayan will be our team's scrum master. Sayan is also responsible for project management, UX, and back-end. Sayan's strengths include UX, back-end, NoSQL DB, and machine learning. Sayan’s weaknesses include no experience with SQL databases, mobile development (iOS / Android), and DevOps.

Yuhan will be responsible for the UX and back-end. Yuhan's strengths include web front-end (React, CSS, JavaScript), doing backend with Node.js (which Fastify is based on), and familiarity with Git version control. Yuhan’s weaknesses are no experience with iOS development, integrating third-party APIs, and writing tests.

Kyoji will be responsible for the UX and back-end. Kyoji's strengths include back-end (Node.js/Express.js), web front-end (React), and UX. Kyoji’s weaknesses include never have worked on a project using the Agile Methodology (mostly solo projects), no experience with AWS, and isn’t good at writing meaningful tests.

David will be responsible for front-end development. David's strengths include JavaScript (React, Node.js), AWS, and mobile app development. David’s weaknesses include not familiar with agile methodology, UI/UX design, and writing tests.

Joyce will be responsible for back-end development. Joyce's strengths include web front-end (React), backend (Node.js), and NoSQL DB. Joyce's weaknesses include very little experience with iOS development, no experience with Amazon products, and hasn't worked on a big project before.

***

### Q7: What operational events will you have as a team?

Our team plans on having meetings online due to the pandemic. We will communicate through a dedicated Discord server. We will have a check-in meeting every Sunday at 3pm, with a possible joint coding session if need be.

We will meet with a LabMotus representative Wednesdays at 10am through Google Meet. We have agreed to weekly meetings starting Feb 10, with the two meetings before the deadline for Deliverable 1 on Feb 3, Feb 10.

On the Feb 3 meeting, we introduced our team, and Victor Wu from LabMotus presented the mission of the LabMotus product and the desired features. We settled privacy concerns and agreed that the product will be released publicly with an open source license. We decided on the meeting schedule described above, with the intention of going over details on deliverable 1 (user stories, etc.) on Feb 10.

### LabMotus Meeting 1 Minutes

2021/02/03 - 10:00 am Google Meet (Remote)

Meeting started 10:05am

Called to meet with LabMotus representative Victor Wu

Attendees

Ethan Zhu, Victor Wu, Yuhan Sun, Kyoji Goto-Bernier, Joyce Ma, David Canagasbey

### Agenda Topics

#### Introductions

We introduced ourselves to the LabMotus team. 

#### Phase 1

Discussed the contents of phase 1 - hammer out user story, start coding in two weeks

#### LabMotus Presentation

Addressing Musculoskeletal Disorders - analyze range of motion and movement pattern

Many don’t follow up with treatment plan - recovery time is prolonged

Remote assessment + objective measurement of range of motion, movement pattern

Desired UI - Chat, Video, Analysis (clinician view)

#### Neural Network

AWS server is available for use. TURN OFF WHEN DONE

Fully convolutional neural network

#### Competitors

- Kaia Health - Focus on lower back pain
- Backend - analyze joint motions
- Business to Consumer, as opposed to Business to Clinician
- Curv Health - also to consumers
- Kentisense - use Kinect camera, but LabMotus wants to use cell phone (much cheaper!)
- Vicon - need special suit for biomechanical analysis
- We will use API from wrench.ai - assesses in 3D space

#### App Specifications

Pose estimation - use wrench.ai (iOS only)
ML model

#### Privacy + Confidentiality

We discussed the fact that students cannot guarantee the privacy of sensitive information

For confidentiality, open source license with public release was agreed upon.

#### Basic Functionality

Recording that is analyzed. Ideally an add on for zoom.

Accept video upload, then analyze recording. Global assessment rules. Hips, knees and ankles to start.

We are not providing diagnosis. We provide assessments. Gray area when it comes to sensitive info

#### Next Steps

Requirements for deliverable 1 were discussed. Biweekly meetings at Wed 10am were discussed, but must have 2 meetings before D1, so next meeting was scheduled for 10/02 (next Wed)

#### Meeting Adjourned

Meeting Adjourned at 11:07 am

On the Feb 10 meeting, we went over user stories, and minimum requirements for product in preparation of deliverable 2. The team presented the tech stack and wireframe mockup to LabMotus representative, who approved of both.

### LabMotus Meeting 2 Minutes

2021/02/10 - 10:00 am Google Meet (Remote)

Meeting started 10:08am

Called to meet with LabMotus representative Victor Wu

Attendees

Ethan Zhu, Victor Wu, Yuhan Sun, Sayan Faraz, Joyce Ma, David Canagasbey

Kyoji Goto-Bernier is absent on medical leave

### Agenda Topics

#### Questions:

#### User Stories

We clarified user stories with Victor Wu. Patients tend to be active and do a lot of physical activity (athletes). Prevent injuries or heal those that have happened

The clinics being targeted 

- Midtown Toronto ; wealthier individuals who play tennis
  - At Victor’s clinic across the street there is a tennis clinic
- Youth athletes
- Runner’s clinic - knee and hip injuries
  - Focus on knees, hips and ankles

Why is it necessary for the physiotherapist to see live pose estimation?

- Telemedicine is really restricted, and if you were not to have live pose estimation, the physiotherapist would have to ask the patient to adjust camera angles and re-upload the video
- Live analysis saves a lot of time for the clinician and allows them to focus on treatment and the patient
- Do doctors want to take notes per video upload? 
  - Would be nice
- Do doctors want to be able to take notes for each week of progress?
  - Not necessary, but again, would be nice

Both clinician and patient are able to upload video

- Upload at first--figure out livestream later

Will the clinician want to see a report of how the patient’s movement is changing over time? The patient’s self-rated pain / mobility?

- Preferable in a perfect world setting ; compare from video to video, day to day how the patient is recovering
- Metrics:
  - Angle of max range of motion
    - Progression: 5 degrees is amazing
  - knee valgus (knee pointing inwards)
  - Just angles between different joints, and let the clinician interpret them
    - Different clinicians look for different things / describe them differently

#### Wrnch.ai Compatibility

- Is wrnch.ai engine for Android on-device?
  - from cloud for now
  - on device real time for ios, most clientele will have new iPhone so that’s ok for final product
- Free trial for wrnch.ai, Victor is open to alternative software
  - wrnch has fast compute time
- Less than 10 users at first, 50-100 for next 6 months

#### Pose Estimation Workflow

Live pose guidance vs. pre-recorded video was discussed. It was decided that a recorded video would be acceptable. Multiple videos per session would be recorded. Videos will be 5-10 seconds long. There will be manual analysis in addition to software analysis. Patient and clinician will be talking over video. Barebones should just be the video recording - uploaded by patient or clinician. Live video will be upgraded later.

Hoping to have backend compatible with different streaming platforms.

- Will the patient have to record pre-defined motions and poses? Aka will the upload process be guided
  - Yes for final version ; not necessarily for MVP
  - Knee, hip angles for runners
    - Location of knees wrt hips
- Length of video being recorded? How do they record video?
  - Runners: take video from front or back
  - 5 seconds, 10 seconds
  - White coat syndrome for movement: change how you move cuz of anxiety of being in a clinic, but if you get them to do a movement that is natural you get more accurate repr of movement
  - Multiple videos per assessment 
    - instead of traditionally examining each joint, want to examine multiple joints in relation to each other to better determine the nature of the injury
    - Ie: forward lunge, reverse lunge
      - If the person gets more pain in reverse lunge vs forward, you can tell the nature of the injury
- Workflow right now:
  - Records video ; looking at what’s causing ie lower back pain
  - One of the hips is higher compared to the other one (35-45 degrees), whereas it should be 0 degrees
- Clinicians set up profile for patient

#### Software Report

Data needed for the software report was discussed. Session data per patient should be stored. Joint angle data will be included, since observing that data is hard for manual analysis, and noting improvement in angle is important for treating knee valgus.

#### User Stories

We shared our user stories with Victor Wu. The 4th user story was clarified that we should account for clinics having different organizational software by having an optional meeting scheduler in our app. Victor approved of our user stories, with a few clarifying questions asked.

#### Prototype

We shared the wireframe we developed with Victor Wu. Victor approved of our prototype and we decided to continue using it to guide us.

#### Tech Stack

Our preliminary tech stack was discussed. Victor approved of the tech stack and we will use these technologies to create our product.

#### Next Steps

Biweekly versus weekly meetings were discussed. Weekly meetings were approved, with the next meeting on 17/02, with more limited attendance due to reading week.

#### Meeting Adjourned

Meeting Adjourned at 11:33 am

***

### Q8: What artifacts will you use to self-organize?

We will record meeting minutes for meetings with the partner, which will take place weekly Wednesday at 10am through Google Meets.

For task assignment and planning, we will use GitHub Projects as it is the most integrated option for us. We will create issues in the “To Do” column, then team members will self-assign to unclaimed tasks and move to “In Progress” once they begin working. Once finished, they will move to “Review in Progress”, where another team member will review their work. Once completed, the task will move to “Reviewer Approved” and be considered done.

Other major decisions such as task prioritization will be made during our Discord meetings or through our Discord server.

***

### Q9: What are the rules regarding how your team works?

#### Communications:

Communications will be done via a dedicated Discord server. For communicating with our partner, we have weekly meetings Wednesday 10am through Google Meet, and we can email them with any immediate questions or concerns.

#### Meetings:

Max will take minutes for the meeting. We will have weekly check-in meetings Sunday at 3pm on our Discord voice channel. These will last around 2 hours (prone to change depending on the week). We will use these meetings to plan the next week and create tasks for people to select. 

#### Conflict Resolution:

- Somebody missing meetings without announcing beforehand
  - We'll begin by asking on Discord server why they didn’t attend the meeting. If they don’t reply by the end of the next day, reach out through email. If a member repeatedly misses meetings, we'll ask them whether the current meeting time is hard for them.
- Leadership conflicts
  - We have a dedicated mediator, Yuhan, in case tensions rise, and an alternate mediator, Joyce, in case the mediator is in a conflict. In the rare case that both mediators are in a conflict with each other, the other team members will help out. If it’s a specific decision such as which API to use, the member(s) implementing it will have the final say. If the members in charge are in conflict, they must first try to resolve it on their own. In the case that they are unable to, they may bring it to the mediator who will talk about it to the whole team during the weekly meeting. If tensions get too high during a meeting, we will call a meeting at a later time within the next week to continue the conversation, so everyone has a chance to cool down
- Somebody not doing work
  - First, we'll kindly confront them and ask what’s going on. This way, we'll get an idea of what’s preventing them from doing the work. We want to ensure that we’re not giving somebody too much or little work. We have agreed that we will give a two day notice if we can’t finish our task on time.

For all of these conflicts, the **final** resort is going to the professor / TA.

***

## Highlights

- The initial proposal given by LabMotus involved recording and analyzing patients’ movements in real-time during a video call. This would present a significant challenge to our team. However, when we met with Victor (our point-of-contact from LabMotus), he placed more emphasis on the AI aspect of the project rather than the video conferencing. During the meeting, we decided that the initial version of the application will instead accept video uploads and then analyze those uploads asynchronously. The video conferencing feature will then be added later if time permits. Keeping this in mind, we plan to split the backend into microservices (keeping the pose estimation separate from the rest) to keep it flexible, and we can switch from asynchronous analysis to real-time analysis with minimal changes to the code.

| Microservice architecture, with asynchronous pose estimation | Can switch to real-time pose estimation with minimal changes to the rest of the backend |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://lh6.googleusercontent.com/9Kx1Q2XHt1y1MOm15wkfsWjn5nOLQxd2JGOG1_TXd-6JG8PeowGYjDHmI8wkYNiP3lCR74Prs6K9sj_4IaSVLf4GCc38_pYbBN6PqY0UalKieBq3vFMtvRAx8o7X-EeMIZ0vdvDl" alt="microservice architecture 1"> | <img src="https://lh5.googleusercontent.com/k00Ix3kDrqeJTUQvC-MSQbAQHvyqu4c82w_b2wuFgnQ6oP-KsoK1WWaFKpyIml7Ul1F68LDL5-zpgab3JQhteCQDwJzddrqrlKWTJ8dgTTW1VPRd7bdp6G5Itvq5mefV4nD3zXhp" alt="microservice architecture 2"> |

*Note: Feel free to click on the images to enlarge them.*

- Our project involves storing and retrieving videos of patients’ movements. For this, we need a service that will host the video content. Amazon Web Services offers multiple potential candidates. The services that we considered are Simple Storage Service (S3) and Elastic File System (EFS). S3 is a general purpose storage service that is interacted with via API requests. EFS is a storage service that can be mounted to the server and interacted with as a file system. Originally, we were leaning towards EFS since the mountable file system would be easier for us to work with. However, there is a significant difference in storage cost (S3 costs \$0.023/GB-month, EFS costs $0.30/GB-month) that exceeds the benefit of the mountable storage. So we have instead decided to use S3 in our project. 

- For our project, we will need to authenticate users to verify their identity, especially since our project involves videos of the users that are intended to be private communication. We have decided to use a third-party authentication service to ensure that the authentication procedure is secure. For this, we considered Firebase Authentication (a Google service) and Amazon Cognito. We were initially considering Cognito since it would work well with the other Amazon services that we are using for this project. Upon further research, we found Cognito’s documentation difficult to work with, while Firebase is well-documented, and some of our team members are already familiar with it. So our final decision was to use Firebase as our authentication service. 

- We were originally going to use Express for our backend framework. Given that we are dealing with video uploads, we wanted to see if there were faster options. One alternative, Nanoexpress, ranked the highest in a benchmark comparison of 26 JavaScript frameworks <sup>[3](https://github.com/the-benchmarker/web-frameworks)</sup>. However, after more research, we decided to use Fastify. Fastify is used a lot in production, shares similar syntax with Express, is faster than Express, and has 344 contributors compared to Nanoexpress’ 6. All this makes Fastify a safer choice while not giving up on performance.

***

## Mockup

Clinician Portal: https://share.proto.io/LFFD2W/

Patient App: https://share.proto.io/HFDT7T/
