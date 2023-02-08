# Job app manager

A web application built using <a href="https://nextjs.org/">Next.js</a>, MySQL (<a href="https://app.planetscale.com"/>planetscale</a>), <a href="https://aws.amazon.com/s3/">AWS S3</a>, and <a href="https://authjs.dev/">AuthJS</a> for user authentication.
<br>Keep track of job applications, making it easier to stay organized.

### Features

<ul>
  <li>User authentication using <a href="https://authjs.dev/">AuthJS</a></li>
  <li>Store job application information such as company name, job title, and application status</li>
  <li>Store additional information such as resume, cover letter, and notes</li>
  <li>Upload files such as resumes and cover letters to <a href="https://aws.amazon.com/s3/">AWS S3</a> for safe storage</li>
  <li>View job application information and documents in one convenient location</li>
  <li>Filter job applications by company name, job title, and application status</li>
  <li>Update job application information and documents at any time</li>
</ul>

### Prerequisites

<ul>

  <li>
    @auth/core: ^0.3.0
  </li>

  <li>
    @aws-sdk/client-s3: ^3.264.0
  </li>

  <li>
    mysql2: ^3.0.1
  </li>

  <li>
    next-auth: ^4.18.10
  </li>

  <li>
    formidable: ^2.1.1
  </li>

  <li>
    AWS account
  </li>

</ul>

### Getting started

<ol>

  <li>
    <p>Clone this repository to your local machine</p>

    ```
    $ git clone https://github.com/ihascats/job-application-manager.git
    ```

  </li>

  <li>
    <p>Change into the project directory.</p>

    ```
    $ cd job-application-manager
    ```

  </li>

  <li>
    <p>Install the required dependencies.</p>

    ```shell
    $ npm install
    ```

  </li>

  <li>
   <p>Create a '.env' file in the root directory of the project and add the following environment variables:</p>

    ```js
    DATABASE_URL = your_db_url;

    GITHUB_ID = // https://authjs.dev/reference/oauth-providers/github
    GITHUB_SECRET =

    GOOGLE_ID = // https://authjs.dev/reference/oauth-providers/google
    GOOGLE_SECRET =
    CALLBACK_URL = 'http://localhost:3000';
    NEXTAUTH_SECRET = // https://authjs.dev/reference/configuration/auth-config#secret

    S3_UPLOAD_KEY = s3_key;
    S3_UPLOAD_SECRET = s3_secret;
    S3_UPLOAD_BUCKET = s3_bucket_name;
    S3_UPLOAD_REGION = s3_region;
    ```

  </li>

  <li>
    <p>Start the development server.</p>

    ```shell
    $ npm run dev
    ```

  </li>
</ol>

### Deployment

Can be easily deployed to <a href="https://vercel.com/">Vercel</a>
